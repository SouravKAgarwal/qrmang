"use server";

import db from "@/drizzle";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { hashString } from "@/lib/utils";

export async function authVerifyEmailAction(email: string) {
  const existingUser = await db
    .select({
      id: users.id,
      emailVerified: users.emailVerified,
      name: users.name,
    })
    .from(users)
    .where(eq(users.email, email))
    .then((res) => res[0] ?? null);

  if (!existingUser) {
    return;
  }

  if (existingUser.emailVerified) {
    return;
  }

  const token = await hashString(nanoid(12));

  const apiRouteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/send-verification-email`;

  const response = await fetch(apiRouteUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      userId: existingUser?.id,
      name: existingUser?.name ?? "User",
      token: token,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send verification email");
  }
}
