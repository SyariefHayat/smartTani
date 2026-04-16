import { INVESTASI_CTA_BANNER } from "@/constants/investasi";
import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative rounded-[40px] bg-gradient-to-r from-[#17391f] to-[#2D6A2D] p-10 md:p-16 text-white overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-20 pointer-events-none">
             {/* You could add a decorative image here */}
          </div>
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
              {INVESTASI_CTA_BANNER.heading}
            </h2>
            <p className="text-sm md:text-base text-white/80 mb-10 max-w-2xl mx-auto">
              {INVESTASI_CTA_BANNER.subtext}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className="w-full sm:w-auto bg-[#3B6D11] hover:bg-[#2D520D] text-white px-10 h-14 rounded-full font-bold text-base border-none shadow-lg">
                {INVESTASI_CTA_BANNER.cta[0].label}
              </Button>
              <Button className="w-full sm:w-auto bg-[#F5C35B] hover:bg-[#E5B24A] text-[#17391f] px-10 h-14 rounded-full font-bold text-base border-none shadow-lg">
                {INVESTASI_CTA_BANNER.cta[1].label}
              </Button>
            </div>
          </div>

          {/* Decorative icons/images could be placed here with absolute positioning */}
        </div>
      </div>
    </section>
  );
}
