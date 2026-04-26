import PortfolioSection from "./PortfolioSection";
import TestimonialSection from "./TestimonialSection";
import FaqSection from "./FaqSection";

export default function BottomLayoutSection() {
  return (
    <section className="section-padding">
      <div className="container-smarttani space-y-10">
        {/* Portfolio Section - Full Width */}
        <div className="">
          <PortfolioSection />
        </div>

        {/* Testimoni & FAQ - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="">
            <TestimonialSection />
          </div>

          <div className="">
            <FaqSection />
          </div>
        </div>
      </div>
    </section>
  );
}
