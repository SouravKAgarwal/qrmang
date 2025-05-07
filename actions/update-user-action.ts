"use server";

import { auth } from "@/auth";
import db from "@/drizzle";
import { users, businesses } from "@/drizzle/schema";
import { UpdateUserInfoSchema } from "@/validators/update-user-validator";
import { eq } from "drizzle-orm";
import * as v from "valibot";
import { uploadImageUrl } from "@/lib";

type Res =
  | {
      success: true;
      data: {
        id: (typeof users.$inferSelect)["id"];
        name: (typeof users.$inferSelect)["name"];
        image: (typeof users.$inferSelect)["image"];
        role: (typeof users.$inferSelect)["role"];
      };
    }
  | { success: false; error: v.FlatErrors<undefined>; statusCode: 400 }
  | { success: false; error: string; statusCode: 500 | 401 | 403 };

export async function updateUserAction(values: unknown): Promise<Res> {
  const parsedValues = v.safeParse(UpdateUserInfoSchema, values);

  if (!parsedValues.success) {
    const flattenedErrors = v.flatten(parsedValues.issues);
    return { success: false, error: flattenedErrors, statusCode: 400 };
  }

  const { id, name, image, role, businessName, businessDescription } =
    parsedValues.output;

  const session = await auth();

  if (!session?.user?.id || session?.user?.id !== id) {
    return { success: false, error: "Unauthorized access", statusCode: 401 };
  }

  if (role === "business" && !businessName) {
    return {
      success: false,
      error: { nested: { businessName: ["Business name is required"] } },
      statusCode: 400,
    };
  }

  try {
    const newImage = image ? await uploadImageUrl(image) : null;

    const updateUser = await db
      .update(users)
      .set({
        name: name,
        image: newImage,
        role: role || null, 
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        image: users.image,
        role: users.role,
      })
      .then((res) => res[0] ?? null);

    if (!updateUser) {
      return { success: false, error: "User not found", statusCode: 500 };
    }

    if (role === "business" && businessName) {
      const existingBusiness = await db
        .select()
        .from(businesses)
        .where(eq(businesses.ownerId, id))
        .then((res) => res[0] ?? null);

      if (existingBusiness) {
        await db
          .update(businesses)
          .set({
            name: businessName,
            description: businessDescription ?? "",
          })
          .where(eq(businesses.ownerId, id));
      } else {
        await db.insert(businesses).values({
          name: businessName,
          description: businessDescription ?? "",
          ownerId: id,
        });
      }
    }

    return { success: true, data: updateUser };
  } catch (err) {
    console.error("Update user error:", err);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
}
