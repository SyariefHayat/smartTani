import Portfolio from "./Portfolio";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";

export default function BottomLayout() {
  return (
    <section className="section-padding">
      <div className="container-smarttani space-y-10">
        {/* Portfolio Section - Full Width */}
        <div className="">
          <Portfolio />
        </div>

        {/* Testimoni & FAQ - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="">
            <Testimonials />
          </div>

          <div className="">
            <FAQ />
          </div>
        </div>
      </div>
    </section>
  );
}
