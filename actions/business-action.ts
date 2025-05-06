"use server";

import { auth } from "@/auth";
import db from "@/drizzle";
import { businesses, users } from "@/drizzle/schema";
import {
  BusinessFormInput,
  BusinessSchema,
} from "@/validators/business-validator";
import { eq } from "drizzle-orm";
import * as v from "valibot";

export async function createBusiness(data: BusinessFormInput) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    v.safeParse(BusinessSchema, data);
  } catch (error) {
    return { success: false, error: "Invalid input data" };
  }

  try {
    const [newBusiness] = await db
      .insert(businesses)
      .values({
        name: data.name,
        description: data.description,
        businessType: data.businessType,
        ownerId: session.user.id,
      })
      .returning();

    if (newBusiness) {
      await db
        .update(users)
        .set({ role: "business" })
        .where(eq(users.id, session?.user?.id as string));
    }

    return { success: true, businessId: newBusiness.id };
  } catch (error) {
    console.error("Failed to create business:", error);
    return { success: false, error: "Database error" };
  }
}
