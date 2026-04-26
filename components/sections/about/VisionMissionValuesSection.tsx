import React from "react";
import { ABOUT_VISION, ABOUT_MISSION, ABOUT_VALUES, ABOUT_DESCRIPTION } from "@/constants/about";
import { Eye, Target, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const VisionMissionValuesSection = () => {
  return (
    <section id="profil" className="section-padding bg-white scroll-mt-24">
      <div className="container-smarttani">
        {/* Description Content */}
        <div className="max-w-4xl mb-16">
          <h2 className="text-heading-2 font-bold text-foreground mb-6">
            {ABOUT_DESCRIPTION.heading}
          </h2>
          <p className="text-body text-muted-foreground mb-8 text-justify lg:text-left">
            {ABOUT_DESCRIPTION.content}
          </p>
          <Button
            variant="default"
            className="bg-primary hover:bg-primary-dark rounded-lg font-semibold px-6"
            asChild
          >
            <a href="#visi-misi">{ABOUT_DESCRIPTION.cta}</a>
          </Button>
        </div>

        <div id="visi-misi" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 scroll-mt-24">
          {/* Visi Kami */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex flex-col items-start h-full hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-heading-3 mb-4 text-primary font-bold flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              {ABOUT_VISION.heading}
            </h3>
            <p className="text-body-sm text-muted-foreground">
              {ABOUT_VISION.content}
            </p>
          </div>

          {/* Misi Kami */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex flex-col items-start h-full hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-heading-3 mb-4 text-primary font-bold flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              {ABOUT_MISSION.heading}
            </h3>
            <ul className="space-y-3">
              {ABOUT_MISSION.items.map((misi, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-body-sm text-muted-foreground">
                    {misi}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Nilai Inti */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex flex-col items-start h-full hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-heading-3 mb-4 text-primary font-bold flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              {ABOUT_VALUES.heading}
            </h3>
            <div className="space-y-4">
              {ABOUT_VALUES.items.map((nilai, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-body-sm font-bold text-foreground leading-tight">
                      {nilai.title}
                    </h4>
                    <p className="text-caption text-muted-foreground mt-0.5">
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
