import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="flex min-h-svh w-full flex-col items-center justify-center pt-10 font-geistSans md:pt-20">
        {children}
      </div>
      <div className="mt-6 md:mt-0">
        <Footer />
      </div>
    </>
  );
}
