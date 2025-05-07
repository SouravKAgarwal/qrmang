"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

type Res =
  | { success: true }
  | { success: false; error: string; statusCode: 500 | 401 | 409 };

export async function signinUserAction(values: unknown): Promise<Res> {
  try {
    if (
      typeof values !== "object" ||
      values === null ||
      Array.isArray(values)
    ) {
      throw new Error("Invalid JSON object.");
    }

    await signIn("credentials", { ...values, redirect: false });
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
        case "CallbackRouteError":
          return {
            success: false,
            error: "Invalid credentials",
            statusCode: 401,
          };

        case "AccessDenied":
          return {
            success: false,
            error: "Email not verified",
            statusCode: 409,
          };
        case "OAuthAccountAlreadyLinkedError" as AuthError["type"]:
          return {
            success: false,
            error: "Login with your Google or Github account",
            statusCode: 401,
          };
        case "EmailNotVerifiedError" as AuthError["type"]:
          return {
            success: false,
            error:
              "Please verify your email using the link sent to your inbox.",
            statusCode: 401,
          };
        default:
          return {
            success: false,
            error: "Oops!! Something went wrong.",
            statusCode: 500,
          };
      }
    }

    console.log(err);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
  return { success: true };
}
