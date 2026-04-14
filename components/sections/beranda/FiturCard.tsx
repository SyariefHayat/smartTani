import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FiturCardProps {
  title: string;
  description: string;
  cta: string;
  image: string;
  bgColor: string;
  textColor: string;
  isHighlighted?: boolean;
}

export function FiturCard({
  title,
  description,
  cta,
  image,
  bgColor,
  textColor,
  isHighlighted = false,
}: FiturCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-3xl p-6 text-center transition-all hover:shadow-lg",
        isHighlighted ? "bg-primary text-white" : "bg-white"
      )}
    >
      <div
        className={cn(
          "mb-6 flex size-32 items-center justify-center rounded-2xl shadow-sm",
          isHighlighted ? "bg-white/10" : bgColor
        )}
      >
        <div className="relative size-20">
          <Image src={image} alt={title} fill className="object-contain" />
        </div>
      </div>
      <h3
        className={cn(
          "mb-3 text-lg font-extrabold",
          isHighlighted ? "text-white" : "text-[#17391f]"
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "mb-6 text-xs leading-relaxed md:text-sm",
          isHighlighted ? "text-white/80" : "text-[#5d7a64]"
        )}
      >
        {description}
      </p>
      <Link
        href="#"
        className={cn(
          "group flex items-center gap-1.5 text-xs font-bold transition-colors hover:opacity-80",
          isHighlighted ? "text-white" : textColor
        )}
      >
        {cta}
      </Link>
    </div>
  );
}
