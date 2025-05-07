"use server";

import * as v from "valibot";
import argon2 from "argon2";
import { SignupSchema } from "@/validators/signup-validator";
import db from "@/drizzle";
import { lower, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

type Res =
  | { success: true }
  | { success: false; error: v.FlatErrors<undefined>; statusCode: 400 }
  | { success: false; error: string; statusCode: 500 }
  | { success: false; error: string; statusCode: 409 };

export async function signupUserAction(values: unknown): Promise<Res> {
  const parsedValues = v.safeParse(SignupSchema, values);

  if (!parsedValues.success) {
    const flattenedErrors = v.flatten(parsedValues.issues);
    return { success: false, error: flattenedErrors, statusCode: 400 };
  }

  const { name, email, password } = parsedValues.output;

  try {
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(lower(users.email), email.toLowerCase()))
      .then((res) => res[0] ?? null);

    if (existingUser?.id) {
      return { success: false, error: "Email already exists", statusCode: 409 };
    }
  } catch (error) {
    console.log(error);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }

  try {
    const hashedPassword = await argon2.hash(password);

    const newUser = await db
      .insert(users)
      .values({ name, email, password: hashedPassword })
      .returning({ id: users.id })
      .then((res) => res[0]);

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
}
