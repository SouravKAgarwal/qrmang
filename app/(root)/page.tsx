import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - QR Code Business Solutions",
  description:
    "Effortlessly manage events, restaurants, and customer engagement with dynamic QR codes. Streamline operations and boost efficiency.",
};

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-10 pt-8 sm:max-w-2xl md:px-10 md:pt-16 2xl:-mt-20">
      <span className="hidden items-center gap-1 rounded-full border px-3 py-0 text-sm md:flex">
        Create, Customize & Track Your QR Codes Effortlessly.
        <Button variant="link" size="sm" className="px-0" asChild>
          <Link href="/dashboard">Get Started</Link>
        </Button>
      </span>

      <h1 className="text-center text-4xl font-bold 2xl:text-6xl">
        Smart QR Code Creation & Management
      </h1>

      <span className="text-center text-sm text-muted-foreground/80">
        "Generate dynamic QR codes, track analytics, and customize designs to
        fit your brand. Elevate your business with our powerful QR management
        tools."
      </span>

      <div className="mt-6 flex items-center gap-6">
        {!!session?.user ? (
          session?.user.role === "business" && (
            <>
              <Button asChild>
                <Link href="/dashboard/organiser">Dashboard</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/organiser/create">Create Event</Link>
              </Button>
            </>
          )
        ) : (
          <>
            <Button asChild>
              <Link href="/auth/sign-in">Get Started</Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/auth/sign-up" className="font-semibold">
                Join Now
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
