import db from "@/drizzle";
import { users, verificationTokens } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Verification",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <AlertCircle className="h-6 w-6 text-red-500" />
            No Token Provided
          </CardTitle>
          <CardDescription>
            It looks like the verification link is incomplete.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Please check your email for the correct link or request a new one.
            </AlertDescription>
          </Alert>
          <Button asChild className="w-full">
            <Link href="/auth/sign-in">Back to Login</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  try {
    const storedToken = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.token, token))
      .then((res) => res[0] ?? null);

    if (!storedToken || storedToken.expires < new Date()) {
      return (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <XCircle className="h-6 w-6 text-red-500" />
              Invalid or Expired Token
            </CardTitle>
            <CardDescription>
              The verification link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Please request a new verification email to continue.
              </AlertDescription>
            </Alert>
            <Button asChild className="w-full">
              <Link href="/auth/sign-in">Request New Link</Link>
            </Button>
          </CardContent>
        </Card>
      );
    }

    await db
      .update(users)
      .set({ emailVerified: new Date() })
      .where(eq(users.email, storedToken.identifier));

    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.token, token));

    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            Email Verified Successfully
          </CardTitle>
          <CardDescription>Your email has been verified!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="default">
            <AlertDescription>
              You can now access all features of your account.
            </AlertDescription>
          </Alert>
          <Button asChild className="w-full">
            <Link href="/user/profile">Go to Profile</Link>
          </Button>
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error("Error verifying email:", error);
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <AlertCircle className="h-6 w-6 text-red-500" />
            Verification Error
          </CardTitle>
          <CardDescription>
            An error occurred while verifying your email.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>
              Please try again later or contact support.
            </AlertDescription>
          </Alert>
          <Button asChild className="w-full">
            <Link href="/auth/sign-in">Back to Login</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }
}
