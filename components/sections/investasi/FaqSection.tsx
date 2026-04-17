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
          <h2 className="text-heading-3 text-foreground">{INVESTASI_FAQ.heading}</h2>
          <p className="text-caption text-muted-foreground">Punya pertanyaan? Cari tahu di sini.</p>
        </div>
        <button className="text-caption font-semibold text-primary hover:underline">
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
            <AccordionTrigger className="text-caption font-bold text-foreground hover:no-underline py-4 text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-caption text-muted-foreground pb-4">
              Jawaban untuk pertanyaan ini akan segera diperbarui. Silakan hubungi tim dukungan kami untuk informasi lebih lanjut mengenai investasi di Smarttani.
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
