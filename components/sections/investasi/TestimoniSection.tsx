import { INVESTASI_TESTIMONI } from "@/constants/investasi";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

export default function TestimoniSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-[#17391f] md:text-xl">{INVESTASI_TESTIMONI.heading}</h2>
          <p className="mt-1 text-xs font-medium text-[#5d7a64] md:text-sm">{INVESTASI_TESTIMONI.subtext}</p>
        </div>
        <button className="text-xs font-bold text-primary hover:underline cursor-pointer">
          Lihat Semua →
        </button>
      </div>

      <div className="space-y-4">
        {INVESTASI_TESTIMONI.items.map((item, index) => (
          <div key={index} className="p-6 rounded-2xl bg-[#EAF3DE]/40 border border-[#EAF3DE] shadow-sm relative overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative size-12 overflow-hidden rounded-full bg-white border border-gray-100">
                <Image
                  src={item.avatar}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#17391f]">{item.name}</h4>
                <p className="text-[0.65rem] font-medium text-[#5d7a64] md:text-xs">{item.role}</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="size-3 fill-[#f5c35b] text-[#f5c35b]" />
                ))}
              </div>
            </div>
            <div className="relative">
              <Quote className="absolute -top-1 -left-1 size-8 text-[#3B6D11]/10 -z-10 group-hover:text-primary-light transition-colors" />
              <p className="text-xs leading-relaxed italic text-[#5d7a64] md:text-sm relative z-0">
                &quot;{item.quote}&quot;
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
