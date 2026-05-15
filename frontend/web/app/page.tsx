import { Button } from "@/components/ui/button";
import { Sprout, ShoppingCart, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-white px-4 text-center">
      <div className="bg-green-100 p-3 rounded-full mb-6">
        <Sprout className="w-12 h-12 text-green-600" />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-gray-900 mb-4">
        SmartTani Marketplace
      </h1>
      <p className="text-xl text-gray-500 max-w-[600px] mb-8">
        Ekosistem digital agrikultur untuk petani, pembeli, dan investor. 
        Membangun masa depan ketahanan pangan Indonesia.
      </p>
      
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/marketplace">
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white gap-2">
            <ShoppingCart className="w-5 h-5" />
            Mulai Belanja
          </Button>
        </Link>
        <Link href="/proposals">
          <Button size="lg" variant="outline" className="gap-2 border-green-600 text-green-600 hover:bg-green-50">
            <BarChart3 className="w-5 h-5" />
            Mulai Investasi
          </Button>
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        <div className="p-6 border rounded-xl hover:shadow-lg transition-shadow text-left">
          <h3 className="text-lg font-bold mb-2">Untuk Petani</h3>
          <p className="text-gray-500 text-sm">
            Jual hasil panen langsung ke pembeli tanpa perantara.
          </p>
        </div>
        <div className="p-6 border rounded-xl hover:shadow-lg transition-shadow text-left">
          <h3 className="text-lg font-bold mb-2">Untuk Pembeli</h3>
          <p className="text-gray-500 text-sm">
            Dapatkan produk segar berkualitas dengan harga terbaik.
          </p>
        </div>
        <div className="p-6 border rounded-xl hover:shadow-lg transition-shadow text-left">
          <h3 className="text-lg font-bold mb-2">Untuk Investor</h3>
          <p className="text-gray-500 text-sm">
            Danai proposal pertanian dan nikmati bagi hasil yang menguntungkan.
          </p>
        </div>
      </div>
    </div>
  );
}
