import { INVESTMENT_TESTIMONIALS } from "@/constants/investments";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

export default function Testimonials() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#17391f]">{INVESTMENT_TESTIMONIALS.heading}</h2>
          <p className="text-sm font-medium text-[#5d7a64]">{INVESTMENT_TESTIMONIALS.subtext}</p>
        </div>
        <button className="text-xs font-bold text-primary hover:underline">
          Lihat Semua →
        </button>
      </div>

      <div className="space-y-4">
        {INVESTMENT_TESTIMONIALS.items.map((item, index) => (
          <div key={index} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm relative overflow-hidden group hover:border-primary/20 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative size-12 overflow-hidden rounded-full bg-slate-50 border border-slate-100">
                <Image
                  src={item.avatar}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#17391f]">{item.name}</h4>
                <p className="text-xs font-medium text-[#5d7a64]">{item.role}</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="size-3 fill-[#F5A623] text-[#F5A623]" />
                ))}
              </div>
            </div>
            <div className="relative">
              <Quote className="absolute -top-1 -left-1 size-8 text-[#EAF3DE] -z-10 group-hover:text-[#d4edda] transition-colors" />
              <p className="text-body-sm italic text-[#17391f]/90 relative z-0">
                &quot;{item.quote}&quot;
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

