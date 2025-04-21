import Navbar from "@/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="flex min-h-[80svh] w-full flex-col items-center justify-center px-6 py-20 md:px-10">
        {children}
      </div>
    </>
  );
}
