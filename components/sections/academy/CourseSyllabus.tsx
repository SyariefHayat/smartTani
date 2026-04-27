"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, PlayCircle, FileText, Lock } from "lucide-react";

export default function CourseSyllabus() {
  const [openModules, setOpenModules] = useState<number[]>([0]);

  const toggleModule = (index: number) => {
    if (openModules.includes(index)) {
      setOpenModules(openModules.filter((i) => i !== index));
    } else {
      setOpenModules([...openModules, index]);
    }
  };

  const modules = [
    {
      title: "Modul 1: Pendahuluan & Dasar-dasar",
      items: [
        { title: "Selamat Datang di SiTani Academy", type: "video", duration: "05:00", free: true },
        { title: "Tujuan & Target Pembelajaran", type: "video", duration: "10:00", free: true },
        { title: "Persiapan & Tools yang Dibutuhkan", type: "doc", duration: "5 min", free: false },
      ],
    },
    {
      title: "Modul 2: Teknik & Strategi Utama",
      items: [
        { title: "Analisis Kondisi Lapangan", type: "video", duration: "15:00", free: false },
        { title: "Langkah-langkah Implementasi", type: "video", duration: "25:00", free: false },
        { title: "Tips & Trick dari Ahli", type: "video", duration: "20:00", free: false },
      ],
    },
    {
      title: "Modul 3: Optimasi & Hasil",
      items: [
        { title: "Cara Monitoring Perkembangan", type: "video", duration: "12:00", free: false },
        { title: "Penanganan Kendala Umum", type: "doc", duration: "10 min", free: false },
        { title: "Evaluasi & Panen", type: "video", duration: "18:00", free: false },
      ],
    },
  ];

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-extrabold text-[#17391f] mb-8">Silabus Kursus</h2>
      <div className="space-y-4">
        {modules.map((module, mIdx) => (
          <div key={mIdx} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <button
              onClick={() => toggleModule(mIdx)}
              className="flex w-full items-center justify-between bg-slate-50 px-6 py-5 transition-colors hover:bg-slate-100"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-sm">
                  {mIdx + 1}
                </div>
                <div className="text-left">
                  <h3 className="text-base font-extrabold text-[#17391f]">{module.title}</h3>
                  <p className="text-xs font-medium text-[#5d7a64]">{module.items.length} Materi</p>
                </div>
              </div>
              {openModules.includes(mIdx) ? (
                <ChevronUp className="size-5 text-[#5d7a64]" />
              ) : (
                <ChevronDown className="size-5 text-[#5d7a64]" />
              )}
            </button>

            {openModules.includes(mIdx) && (
              <div className="divide-y divide-slate-100">
                {module.items.map((item, iIdx) => (
                  <div key={iIdx} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      {item.type === "video" ? (
                        <PlayCircle className="size-4 text-primary" />
                      ) : (
                        <FileText className="size-4 text-accent" />
                      )}
                      <span className={`text-sm font-medium ${item.free ? "text-[#17391f]" : "text-[#5d7a64]"}`}>
                        {item.title}
                      </span>
                      {item.free && (
                        <span className="rounded-lg bg-primary-light px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/10">
                          GRATIS
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-bold text-[#5d7a64]">{item.duration}</span>
                      {!item.free && <Lock className="size-3.5 text-slate-300" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
