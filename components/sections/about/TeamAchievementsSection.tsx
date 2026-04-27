import React from "react";
import Image from "next/image";
import {
  ABOUT_ACHIEVEMENTS,
  ABOUT_LEADERSHIP,
  ABOUT_ADDRESS,
  ABOUT_STRATEGIC_PARTNERS,
} from "@/constants/about";
import { CheckCircle2, MapPin, Phone } from "lucide-react";

const TeamAchievementsSection = () => {
  return (
    <section className="section-padding">
      <div className="container-smarttani">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Pencapaian Kami */}
          <div>
            <h3 className="text-lg font-extrabold text-[#17391f] mb-6">
              {ABOUT_ACHIEVEMENTS.heading}
            </h3>
            <div className="space-y-4">
              {ABOUT_ACHIEVEMENTS.items.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-[#5d7a64] leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Kepemimpinan Kami */}
          <div>
            <h3 className="text-lg font-extrabold text-[#17391f] mb-6">
              {ABOUT_LEADERSHIP.heading}
            </h3>
            <div className="space-y-5">
              {ABOUT_LEADERSHIP.items.map((pimpinan) => (
                <div key={pimpinan.nama} className="flex items-center gap-4 group">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-primary transition-colors duration-300">
                    <Image
                      src={pimpinan.foto}
                      alt={pimpinan.nama}
                      fill
                      sizes="100%"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#17391f] group-hover:text-primary transition-colors duration-300">
                      {pimpinan.nama}
                    </h4>
                    <p className="text-xs font-medium text-[#5d7a64]">
                      {pimpinan.jabatan}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alamat & Kontak */}
          <div>
            <h3 className="text-lg font-extrabold text-[#17391f] mb-6">
              {ABOUT_ADDRESS.heading}
            </h3>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-medium text-[#5d7a64] leading-relaxed">
                  {ABOUT_ADDRESS.alamat}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <a href="tel:+6282326952833" className="text-sm font-extrabold text-primary hover:text-primary-dark transition-colors">
                  {ABOUT_ADDRESS.telepon}
                </a>
              </div>
            </div>
          </div>

          {/* Mitra Strategis */}
          <div>
            <h3 className="text-lg font-extrabold text-[#17391f] mb-6">
              {ABOUT_STRATEGIC_PARTNERS.heading}
            </h3>
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {ABOUT_STRATEGIC_PARTNERS.items.map((mitra) => (
                <div
                  key={mitra.nama}
                  className="p-3 md:p-4 rounded-xl bg-white border border-slate-100 flex items-center justify-center hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <Image
                    src={mitra.logo}
                    alt={mitra.nama}
                    width={100}
                    height={50}
                    className="object-contain max-h-10 md:max-h-12 w-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamAchievementsSection;
