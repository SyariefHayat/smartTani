import CartSidebar from '@/components/layouts/CartSidebar';
import Footer from '@/components/layouts/Footer';
import Navbar from '@/components/layouts/Navbar';
import ToastContainer from '@/components/layouts/ToastContainer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
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
