import { KONTAK_INFO, KONTAK_FORM } from "@/constants/kontak";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  SendHorizontal 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function KontakMiddleSection() {
  const infoIcons = [MapPin, Phone, Mail, Globe, Clock];

  return (
    <section className="py-16 md:py-24">
      <div className="container-smarttani">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Informasi Kontak */}
          <div className="lg:col-span-5">
            <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl">
              {KONTAK_INFO.heading}
            </h2>
            <p className="mt-2 text-sm font-medium text-gray-500 md:text-base">
              {KONTAK_INFO.subtext}
            </p>

            <div className="mt-8 space-y-6">
              {KONTAK_INFO.items.map((item, index) => {
                const Icon = infoIcons[index];
                return (
                  <div key={item.type} className="flex gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#17391f] text-white">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#17391f]">
                        {item.type}
                      </h3>
                      <p className="mt-1 whitespace-pre-line text-xs font-medium text-gray-600 md:text-sm">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Kirim Pesan Form */}
          <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-xl shadow-neutral-100 md:p-10 lg:col-span-7">
            <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl">
              {KONTAK_FORM.heading}
            </h2>
            <p className="mt-2 text-sm font-medium text-gray-500 md:text-base">
              {KONTAK_FORM.subtext}
            </p>

            <form className="mt-8 grid gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-bold text-[#17391f]">
                  {KONTAK_FORM.fields.name.label}
                </Label>
                <Input
                  id="name"
                  placeholder={KONTAK_FORM.fields.name.placeholder}
                  className="h-12 rounded-xl border-neutral-200 bg-neutral-50/30 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-bold text-[#17391f]">
                  {KONTAK_FORM.fields.email.label}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={KONTAK_FORM.fields.email.placeholder}
                  className="h-12 rounded-xl border-neutral-200 bg-neutral-50/30 focus:bg-white transition-colors"
                />
              </div>

              <div className="lg:col-span-1 space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-bold text-[#17391f]">
                  {KONTAK_FORM.fields.phone.label}
                </Label>
                <Input
                  id="phone"
                  placeholder={KONTAK_FORM.fields.phone.placeholder}
                  className="h-12 rounded-xl border-neutral-200 bg-neutral-50/30 focus:bg-white transition-colors"
                />
              </div>

              <div className="hidden lg:block" />

              <div className="space-y-5 lg:col-span-1">
                <div className="space-y-1.5">
                  <Label htmlFor="subject" className="text-sm font-bold text-[#17391f]">
                    {KONTAK_FORM.fields.subject.label}
                  </Label>
                  <Select>
                    <SelectTrigger className="h-12 rounded-xl border-neutral-200 bg-neutral-50/30 focus:bg-white transition-colors">
                      <SelectValue placeholder={KONTAK_FORM.fields.subject.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="umum">Pertanyaan Umum</SelectItem>
                      <SelectItem value="kerjasama">Kerjasama</SelectItem>
                      <SelectItem value="masukan">Kritik & Saran</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="lg:row-span-2 space-y-1.5">
                <Label htmlFor="message" className="text-sm font-bold text-[#17391f]">
                  {KONTAK_FORM.fields.message.label}
                </Label>
                <Textarea
                  id="message"
                  placeholder={KONTAK_FORM.fields.message.placeholder}
                  className="min-h-[140px] lg:min-h-[140px] rounded-xl border-neutral-200 bg-neutral-50/30 focus:bg-white transition-colors resize-none"
                />
              </div>

              <div className="lg:col-span-2 mt-4">
                <Button className="w-full bg-[#2D6A2D] py-7 text-base font-bold text-white hover:bg-[#235323] rounded-xl shadow-lg shadow-green-100 transition-all active:scale-[0.98]">
                  <SendHorizontal className="mr-2 size-5" />
                  {KONTAK_FORM.button}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
