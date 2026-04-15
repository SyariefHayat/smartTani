import React from "react";
import { ABOUT_VISI, ABOUT_MISI, ABOUT_NILAI } from "@/constants/about";
import { Eye, Target, ShieldCheck, CheckCircle2 } from "lucide-react";

const VisiMisiNilaiSection = () => {
  return (
    <section className="section-padding bg-slate-50">
      <div className="container-smarttani">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Visi Kami */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start h-full">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-heading-3 mb-4 text-primary font-bold flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              {ABOUT_VISI.heading}
            </h3>
            <p className="text-body text-muted-foreground leading-relaxed">
              {ABOUT_VISI.content}
            </p>
          </div>

          {/* Misi Kami */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start h-full">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-heading-3 mb-4 text-primary font-bold flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              {ABOUT_MISI.heading}
            </h3>
            <ul className="space-y-3">
              {ABOUT_MISI.items.map((misi, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-body text-muted-foreground text-sm">
                    {misi}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Nilai Inti */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start h-full">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-heading-3 mb-4 text-primary font-bold flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              {ABOUT_NILAI.heading}
            </h3>
            <div className="space-y-4">
              {ABOUT_NILAI.items.map((nilai, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground leading-tight">
                      {nilai.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
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

export default VisiMisiNilaiSection;
