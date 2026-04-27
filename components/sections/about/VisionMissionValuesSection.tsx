import React from "react";
import { ABOUT_VISION, ABOUT_MISSION, ABOUT_VALUES, ABOUT_DESCRIPTION } from "@/constants/about";
import { Eye, Target, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const VisionMissionValuesSection = () => {
  return (
    <section id="profil" className="bg-white">
      <div className="container-smarttani">
        {/* Description Content */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl mb-4">
            {ABOUT_DESCRIPTION.heading}
          </h2>
          <p className="text-sm md:text-base font-medium text-[#5d7a64] mb-8 leading-relaxed">
            {ABOUT_DESCRIPTION.content}
          </p>
          <Button
            className="bg-primary hover:bg-primary-dark text-white rounded-xl font-bold px-8 h-12 shadow-lg shadow-primary/20 cursor-pointer"
            asChild
          >
            <a href="#visi-misi">{ABOUT_DESCRIPTION.cta}</a>
          </Button>
        </div>

        <div id="visi-misi" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Visi Kami */}
          <div className="group bg-white p-8 rounded-3xl border border-slate-100 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="size-16 rounded-2xl bg-[#d4edda] flex items-center justify-center mb-6 text-[#2D6A2D]">
              <Eye className="size-8" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-extrabold text-[#17391f] mb-4">
              {ABOUT_VISION.heading}
            </h3>
            <p className="text-sm font-medium text-[#5d7a64] leading-relaxed">
              {ABOUT_VISION.content}
            </p>
          </div>

          {/* Misi Kami */}
          <div className="group bg-white p-8 rounded-3xl border border-slate-100 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="size-16 rounded-2xl bg-[#d4edda] flex items-center justify-center mb-6 text-[#2D6A2D]">
              <Target className="size-8" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-extrabold text-[#17391f] mb-4">
              {ABOUT_MISSION.heading}
            </h3>
            <ul className="space-y-4 w-full">
              {ABOUT_MISSION.items.map((misi, index) => (
                <li key={index} className="flex items-start gap-3 text-left">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-[#5d7a64] leading-relaxed">
                    {misi}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Nilai Inti */}
          <div className="group bg-white p-8 rounded-3xl border border-slate-100 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="size-16 rounded-2xl bg-[#d4edda] flex items-center justify-center mb-6 text-[#2D6A2D]">
              <ShieldCheck className="size-8" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-extrabold text-[#17391f] mb-4">
              {ABOUT_VALUES.heading}
            </h3>
            <div className="grid grid-cols-1 gap-5 w-full">
              {ABOUT_VALUES.items.map((nilai, index) => (
                <div key={index} className="flex items-start gap-3 text-left">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-extrabold text-[#17391f] leading-tight">
                      {nilai.title}
                    </h4>
                    <p className="text-xs font-medium text-[#5d7a64] mt-1 leading-relaxed">
                      {nilai.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMissionValuesSection;
