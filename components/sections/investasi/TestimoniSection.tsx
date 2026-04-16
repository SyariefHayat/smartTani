import { INVESTASI_TESTIMONI } from "@/constants/investasi";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

export default function TestimoniSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#17391f]">{INVESTASI_TESTIMONI.heading}</h2>
          <p className="text-xs text-gray-500">{INVESTASI_TESTIMONI.subtext}</p>
        </div>
        <button className="text-[11px] font-semibold text-[#2D6A2D] hover:underline">
          Lihat Semua →
        </button>
      </div>

      <div className="space-y-4">
        {INVESTASI_TESTIMONI.items.map((item, index) => (
          <div key={index} className="p-6 rounded-3xl bg-white border border-neutral-100 shadow-sm relative overflow-hidden group hover:border-[#b5d296] transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative size-12 overflow-hidden rounded-full bg-neutral-100 border border-neutral-200">
                <Image
                  src={item.avatar}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#17391f]">{item.name}</h4>
                <p className="text-[10px] text-gray-500">{item.role}</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="size-3 fill-[#f5c35b] text-[#f5c35b]" />
                ))}
              </div>
            </div>
            <div className="relative">
              <Quote className="absolute -top-1 -left-1 size-8 text-neutral-50 -z-10 group-hover:text-[#f0f9f0] transition-colors" />
              <p className="text-sm italic leading-relaxed text-[#17391f] relative z-0">
                &quot;{item.quote}&quot;
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
