import { INVESTASI_FAQ } from "@/constants/investasi";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FaqSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-[#17391f] md:text-xl">{INVESTASI_FAQ.heading}</h2>
          <p className="mt-1 text-xs font-medium text-[#5d7a64] md:text-sm">Punya pertanyaan? Cari tahu di sini.</p>
        </div>
        <button className="text-xs font-bold text-primary hover:underline cursor-pointer">
          Lihat Semua →
        </button>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-3 border-none">
        {INVESTASI_FAQ.items.map((item, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="rounded-2xl bg-slate-50 border border-slate-100 px-4 shadow-sm overflow-hidden"
          >
            <AccordionTrigger className="text-sm font-bold text-[#17391f] hover:no-underline py-4 text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-xs font-medium text-[#5d7a64] pb-4 leading-relaxed">
              Jawaban untuk pertanyaan ini akan segera diperbarui. Silakan hubungi tim dukungan kami untuk informasi lebih lanjut mengenai investasi di Smarttani.
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
