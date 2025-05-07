import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function DocumentationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="font-sans px-4 py-16 sm:px-6 lg:px-8">
        {children}
      </div>
      <Footer />
    </>
  );
}
