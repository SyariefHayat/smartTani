import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import CartSidebar from "@/components/ui/CartSidebar";
import ToastContainer from "@/components/ui/ToastContainer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <CartSidebar />
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer />
      <ToastContainer />
    </>
  );
}
