import { INVESTMENT_FAQ } from "@/constants/investments";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#17391f]">{INVESTMENT_FAQ.heading}</h2>
          <p className="text-sm font-medium text-[#5d7a64]">Punya pertanyaan? Cari tahu di sini.</p>
        </div>
        <button className="text-xs font-bold text-primary hover:underline">
          Lihat Semua →
        </button>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-3 border-none">
        {INVESTMENT_FAQ.items.map((item, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="rounded-2xl bg-white border border-slate-100 px-4 shadow-sm overflow-hidden hover:border-primary/20 transition-all"
          >
            <AccordionTrigger className="text-xs md:text-sm font-extrabold text-[#17391f] hover:no-underline py-4 text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-xs md:text-sm font-medium text-[#5d7a64] pb-4">
              Jawaban untuk pertanyaan ini akan segera diperbarui. Silakan hubungi tim dukungan kami untuk informasi lebih lanjut mengenai investasi di Smarttani.
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

