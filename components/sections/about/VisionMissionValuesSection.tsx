import React from "react";
import { ABOUT_VISION, ABOUT_MISSION, ABOUT_VALUES, ABOUT_DESCRIPTION } from "@/constants/about";
import { Eye, Target, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const VisionMissionValuesSection = () => {
  return (
    <section id="profil" className="bg-white scroll-mt-24">
      <div className="container-smarttani">
        {/* Description Content */}
        <div className="max-w-4xl mb-16">
          <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl mb-6">
            {ABOUT_DESCRIPTION.heading}
          </h2>
          <p className="text-sm md:text-base font-medium text-[#5d7a64] mb-8 text-justify lg:text-left leading-relaxed">
            {ABOUT_DESCRIPTION.content}
          </p>
          <Button
            className="bg-primary hover:bg-primary-dark !text-white rounded-xl font-bold px-8 h-12 shadow-lg shadow-primary/20 cursor-pointer"
            asChild
          >
            <a href="#visi-misi">{ABOUT_DESCRIPTION.cta}</a>
          </Button>
        </div>

        <div id="visi-misi" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 scroll-mt-24">
          {/* Visi Kami */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex flex-col items-start h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-extrabold text-[#17391f] mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              {ABOUT_VISION.heading}
            </h3>
            <p className="text-sm font-medium text-[#5d7a64] leading-relaxed">
              {ABOUT_VISION.content}
            </p>
          </div>

          {/* Misi Kami */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex flex-col items-start h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-extrabold text-[#17391f] mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              {ABOUT_MISSION.heading}
            </h3>
            <ul className="space-y-4">
              {ABOUT_MISSION.items.map((misi, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-[#5d7a64] leading-relaxed">
                    {misi}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Nilai Inti */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex flex-col items-start h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-extrabold text-[#17391f] mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              {ABOUT_VALUES.heading}
            </h3>
            <div className="space-y-5">
              {ABOUT_VALUES.items.map((nilai, index) => (
                <div key={index} className="flex items-start gap-3">
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
