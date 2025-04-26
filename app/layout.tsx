import "./globals.css";
import type { Metadata } from "next";
import { Fira_Sans, Geist } from "next/font/google";
import { Providers as AuthProviders } from "@/components/providers";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const firaSans = Fira_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-fira-sans",
  preload: true,
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "QRMang",
    template: "%s | QRMang",
  },
  description:
    "Your go-to platform for managing your events, restuarants etc. with QR codes.",
  keywords: ["qr", "qrcode", "dynamic qr", "scan", "event", "restuarant"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={cn(
          geistSans.variable,
          firaSans.variable,
          "scroll-smooth bg-[#fafafa] font-firaSans antialiased",
        )}
      >
        <AuthProviders>
          {/* <ThemeProvider attribute="class" enableSystem> */}
          {children}
          <Toaster />
          {/* </ThemeProvider> */}
        </AuthProviders>
      </body>
    </html>
  );
}
