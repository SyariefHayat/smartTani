import React from "react";
import Image from "next/image";
import {
  ABOUT_PENCAPAIAN,
  ABOUT_PIMPINAN,
  ABOUT_ALAMAT,
  ABOUT_MITRA_STRATEGIS,
} from "@/constants/about";
import { CheckCircle2, MapPin, Phone } from "lucide-react";

const PencapaianTimSection = () => {
  return (
    <section className="section-padding bg-slate-50">
      <div className="container-smarttani">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Pencapaian Kami */}
          <div>
            <h3 className="text-heading-3 font-bold text-foreground mb-6">
              {ABOUT_PENCAPAIAN.heading}
            </h3>
            <div className="space-y-4">
              {ABOUT_PENCAPAIAN.items.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-body-sm text-muted-foreground">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Kepemimpinan Kami */}
          <div>
            <h3 className="text-heading-3 font-bold text-foreground mb-6">
              {ABOUT_PIMPINAN.heading}
            </h3>
            <div className="space-y-5">
              {ABOUT_PIMPINAN.items.map((pimpinan) => (
                <div key={pimpinan.nama} className="flex items-center gap-4 group">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-primary transition-colors duration-300">
                    <Image
                      src={pimpinan.foto}
                      alt={pimpinan.nama}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-body-sm font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {pimpinan.nama}
                    </h4>
                    <p className="text-caption text-muted-foreground">
                      {pimpinan.jabatan}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alamat & Kontak */}
          <div>
            <h3 className="text-heading-3 font-bold text-foreground mb-6">
              {ABOUT_ALAMAT.heading}
            </h3>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <p className="text-body-sm text-muted-foreground">
                  {ABOUT_ALAMAT.alamat}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <p className="text-body-sm text-muted-foreground font-semibold">
                  {ABOUT_ALAMAT.telepon}
                </p>
              </div>
            </div>
          </div>

          {/* Mitra Strategis */}
          <div>
            <h3 className="text-heading-3 font-bold text-foreground mb-6">
              {ABOUT_MITRA_STRATEGIS.heading}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {ABOUT_MITRA_STRATEGIS.items.map((mitra) => (
                <div
                  key={mitra.nama}
                  className="p-4 rounded-xl bg-white border border-slate-100 flex items-center justify-center hover:shadow-sm transition-shadow duration-300"
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
