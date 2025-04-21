import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import OAuthButtons from "@/components/oauth-buttons";
import SignupForm from "@/components/sign-up-form";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default async function SignupPage() {
  return (
    <Card className="w-full">
      <CardContent className="grid p-0 md:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-8">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">Welcome to QrMang</h1>
            <p className="text-balance text-muted-foreground">
              Register your QrMang account
            </p>
          </div>
          <OAuthButtons signup />
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <SignupForm />
        </div>
        <div className="relative hidden h-auto w-full bg-primary-foreground dark:bg-primary md:block">
          <Image
            src="/images/qr.png"
            width={300}
            height={300}
            alt="Image"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 dark:brightness-[0.2] dark:grayscale"
            priority
          />
        </div>
      </CardContent>
    </Card>
  );
}
