import React from "react";
import Image from "next/image";
import {
  ABOUT_PENCAPAIAN,
  ABOUT_PIMPINAN,
  ABOUT_ALAMAT,
  ABOUT_MITRA_STRATEGIS,
} from "@/constants/about";
import { Trophy, CheckCircle2, MapPin, Phone } from "lucide-react";

const PencapaianTimSection = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-smarttani">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Pencapaian Kami */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-6">
              {ABOUT_PENCAPAIAN.heading}
            </h3>
            <div className="flex flex-col gap-6">
              <div className="bg-primary/5 p-6 rounded-2xl flex items-center justify-center">
                <Trophy className="w-16 h-16 text-primary/40" />
              </div>
              <div className="space-y-3">
                {ABOUT_PENCAPAIAN.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground leading-tight">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kepemimpinan Kami */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-6">
              {ABOUT_PIMPINAN.heading}
            </h3>
            <div className="space-y-6">
              {ABOUT_PIMPINAN.items.map((pimpinan) => (
                <div key={pimpinan.nama} className="flex items-center gap-4 group">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-100 group-hover:border-primary transition-colors">
                    <Image
                      src={pimpinan.foto}
                      alt={pimpinan.nama}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {pimpinan.nama}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {pimpinan.jabatan}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alamat & Kontak */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-6">
              {ABOUT_ALAMAT.heading}
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-1" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {ABOUT_ALAMAT.alamat}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <p className="text-sm text-muted-foreground font-semibold">
                  {ABOUT_ALAMAT.telepon}
                </p>
              </div>
            </div>
          </div>

          {/* Mitra Strategis */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-6">
              {ABOUT_MITRA_STRATEGIS.heading}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {ABOUT_MITRA_STRATEGIS.items.map((mitra) => (
                <div
                  key={mitra.nama}
                  className="bg-slate-50 p-4 rounded-xl flex items-center justify-center grayscale hover:grayscale-0 transition-all hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100"
                >
                  <Image
                    src={mitra.logo}
                    alt={mitra.nama}
                    width={100}
                    height={50}
                    className="object-contain max-h-8"
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

export default PencapaianTimSection;
