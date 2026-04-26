import { INVESTMENT_TESTIMONIALS } from "@/constants/investments";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

export default function TestimonialSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-heading-3 text-foreground">{INVESTMENT_TESTIMONIALS.heading}</h2>
          <p className="text-caption text-muted-foreground">{INVESTMENT_TESTIMONIALS.subtext}</p>
        </div>
        <button className="text-caption font-semibold text-primary hover:underline">
          Lihat Semua →
        </button>
      </div>

      <div className="space-y-4">
        {INVESTMENT_TESTIMONIALS.items.map((item, index) => (
          <div key={index} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative size-12 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                <Image
                  src={item.avatar}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-body-sm font-bold text-foreground">{item.name}</h4>
                <p className="text-caption text-muted-foreground">{item.role}</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="size-3 fill-accent text-accent" />
                ))}
              </div>
            </div>
            <div className="relative">
              <Quote className="absolute -top-1 -left-1 size-8 text-slate-100 -z-10 group-hover:text-primary-light transition-colors" />
              <p className="text-body-sm italic text-foreground relative z-0">
                &quot;{item.quote}&quot;
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

