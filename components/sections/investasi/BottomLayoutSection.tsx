import PortfolioSection from "./PortfolioSection";
import TestimoniSection from "./TestimoniSection";
import FaqSection from "./FaqSection";

export default function BottomLayoutSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Portfolio Section - Left Column (5/12) */}
          <div className="lg:col-span-5">
            <PortfolioSection />
          </div>

          {/* Testimoni Section - Middle Column (3/12) */}
          <div className="lg:col-span-3">
            <TestimoniSection />
          </div>

          {/* FAQ Section - Right Column (4/12) */}
          <div className="lg:col-span-4">
            <FaqSection />
          </div>
        </div>
      </div>
    </section>
  );
}
