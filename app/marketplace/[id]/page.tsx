import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { MARKETPLACE_TERLARIS_DATA } from "@/constants/marketplace";
import ProductGallery from "@/components/sections/marketplace/ProductGallery";
import ProductInfo from "@/components/sections/marketplace/ProductInfo";
import ProductTabs from "@/components/sections/marketplace/ProductTabs";
import RelatedProducts from "@/components/sections/marketplace/RelatedProducts";

interface MarketplaceDetailPageProps {
  params: {
    id: string;
  };
}

export default async function MarketplaceDetailPage({
  params,
}: MarketplaceDetailPageProps) {
  const { id } = await params;

  // Find product by id in SAMPLE_PRODUCTS (via MARKETPLACE_TERLARIS_DATA)
  const product = MARKETPLACE_TERLARIS_DATA.items.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[#1A6B2F]"
          >
            <Home className="h-3 w-3" />
            Beranda
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/marketplace" className="hover:text-[#1A6B2F]">
            Marketplace
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="line-clamp-1 font-medium text-gray-900">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left Column: Gallery */}
          <ProductGallery images={[product.image, product.image, product.image]} />

          {/* Right Column: Info */}
          <ProductInfo product={product} />
        </div>

        {/* Product Details Tabs */}
        <ProductTabs description={product.description} />

        {/* Related Products */}
        <RelatedProducts />
      </div>
    </main>
  );
}
