import Navbar from "@/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="flex min-h-[80svh] w-full flex-col items-center justify-center py-10 font-geistSans md:py-20">
        {children}
      </div>
    </>
  );
}
