import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return (
    <div className="w-full max-w-sm md:max-w-3xl">
      <div className="flex flex-col items-center justify-center gap-6">
        {children}
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By clicking continue, you agree to our{" "}
          <Link href="/">Terms of Service</Link> and{" "}
          <Link href="/">Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
}
