import Image from "next/image";
import { TrendingUp, Calendar, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface InvestasiCardProps {
  item: {
    badge: string | null;
    title: string;
    kategori: string;
    imbalHasil: string;
    durasi: string;
    terkumpul: string;
    progress: number;
    minimalInvestasi: string;
    image: string;
  };
}

export default function InvestasiCard({ item }: InvestasiCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Image Header */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {item.badge && (
          <div className={cn(
            "absolute left-3 top-3 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm",
            item.badge === "POPULER" ? "bg-[#b5d296] text-[#17391f]" : "bg-orange-100 text-orange-700"
          )}>
            {item.badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D6A2D]">
            {item.kategori}
          </span>
          <h3 className="mt-1 text-lg font-bold leading-tight text-[#17391f] line-clamp-2 min-h-[3.5rem]">
            {item.title}
          </h3>
        </div>

        {/* Stats Grid */}
        <div className="mt-4 grid grid-cols-2 gap-4 border-y border-neutral-100 py-4">
          <div className="space-y-1">
            <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-wide">Imbal Hasil</p>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="size-3.5 text-green-600" />
              <p className="text-sm font-bold text-[#17391f]">{item.imbalHasil}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-wide">Durasi</p>
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-blue-600" />
              <p className="text-sm font-bold text-[#17391f]">{item.durasi}</p>
            </div>
          </div>
        </div>

        {/* Funding Stats */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-wide">Terkumpul</p>
              <p className="text-sm font-bold text-[#17391f]">{item.terkumpul}</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-[#2D6A2D]">{item.progress}%</span>
            </div>
          </div>
          <Progress 
            value={item.progress} 
            className="h-1.5 bg-neutral-100" 
          />
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between pt-2">
          <div className="space-y-0.5">
            <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-wide">Min. Investasi</p>
            <p className="text-sm font-bold text-[#17391f]">{item.minimalInvestasi}</p>
          </div>
          <Button size="sm" className="rounded-lg bg-[#2D6A2D] px-5 font-bold hover:bg-[#235323] cursor-pointer">
            Lihat Detail
          </Button>
        </div>
      </div>
    </div>
  );
}
