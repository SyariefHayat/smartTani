import PortfolioSection from "./PortfolioSection";
import TestimoniSection from "./TestimoniSection";
import FaqSection from "./FaqSection";

export default function BottomLayoutSection() {
  return (
    <section className="">
      <div className="container-smarttani space-y-8">
        {/* Portfolio Section - Full Width */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <PortfolioSection />
        </div>

        {/* Testimoni & FAQ - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <TestimoniSection />
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <FaqSection />
          </div>
        </div>
      </div>
    </section>
  );
}
