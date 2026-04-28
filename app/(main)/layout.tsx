import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import CartSidebar from "@/components/ui/CartSidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <CartSidebar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
