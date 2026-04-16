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
          <h2 className="text-xl font-bold text-[#17391f]">{INVESTASI_FAQ.heading}</h2>
          <p className="text-xs text-gray-500">Punya pertanyaan? Cari tahu di sini.</p>
        </div>
        <button className="text-[11px] font-semibold text-[#2D6A2D] hover:underline">
          Lihat Semua →
        </button>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-3 border-none">
        {INVESTASI_FAQ.items.map((item, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="rounded-2xl border border-neutral-100 bg-white px-4 shadow-sm overflow-hidden"
          >
            <AccordionTrigger className="text-xs font-bold text-[#17391f] hover:no-underline py-4 text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-[11px] text-gray-500 leading-relaxed pb-4">
              {/* Dummy answer since it's not in constants */}
              Jawaban untuk pertanyaan ini akan segera diperbarui. Silakan hubungi tim dukungan kami untuk informasi lebih lanjut mengenai investasi di Smarttani.
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
