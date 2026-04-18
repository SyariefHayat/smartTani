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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Silabus Kursus</h2>
      <div className="space-y-4">
        {modules.map((module, mIdx) => (
          <div key={mIdx} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <button
              onClick={() => toggleModule(mIdx)}
              className="flex w-full items-center justify-between bg-gray-50 px-6 py-4 transition-colors hover:bg-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A6B2F] text-xs font-bold text-white">
                  {mIdx + 1}
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-bold text-gray-900">{module.title}</h3>
                  <p className="text-xs text-gray-500">{module.items.length} Materi</p>
                </div>
              </div>
              {openModules.includes(mIdx) ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {openModules.includes(mIdx) && (
              <div className="divide-y divide-gray-100">
                {module.items.map((item, iIdx) => (
                  <div key={iIdx} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      {item.type === "video" ? (
                        <PlayCircle className="h-4 w-4 text-[#1A6B2F]" />
                      ) : (
                        <FileText className="h-4 w-4 text-[#BA7517]" />
                      )}
                      <span className={`text-sm ${item.free ? "text-gray-900" : "text-gray-500"}`}>
                        {item.title}
                      </span>
                      {item.free && (
                        <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
                          GRATIS
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-400">{item.duration}</span>
                      {!item.free && <Lock className="h-3 w-3 text-gray-300" />}
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
