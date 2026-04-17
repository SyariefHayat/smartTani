import { KONTAK_INFO, KONTAK_FORM } from "@/constants/kontak";
import { MapPin, Phone, Mail, Globe, Clock, SendHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";

const INFO_ICONS = [MapPin, Phone, Mail, Globe, Clock];

export default function KontakMiddleSection() {
  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="container-smarttani">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">

          {/* Kiri: Informasi kontak */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-heading-2 font-bold text-foreground">
                {KONTAK_INFO.heading}
              </h2>
              <p className="mt-2 text-body-sm text-muted-foreground">
                {KONTAK_INFO.subtext}
              </p>
            </div>

            <div className="space-y-3">
              {KONTAK_INFO.items.map((item, index) => {
                const Icon = INFO_ICONS[index];
                return (
                  <div
                    key={item.type}
                    className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors duration-200"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-body-sm font-semibold text-foreground">{item.type}</p>
                      <p className="mt-0.5 text-caption text-muted-foreground leading-relaxed whitespace-pre-line">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kanan: Form kirim pesan */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
            <div>
              <h2 className="text-heading-2 font-bold text-foreground">
                {KONTAK_FORM.heading}
              </h2>
              <p className="mt-2 text-body-sm text-muted-foreground">
                {KONTAK_FORM.subtext}
              </p>
            </div>

            <form className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Nama */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-body-sm font-semibold text-foreground">
                  {KONTAK_FORM.fields.name.label}
                </Label>
                <Input
                  id="name"
                  placeholder={KONTAK_FORM.fields.name.placeholder}
                  className="h-11 rounded-lg border-slate-200 bg-slate-50/50 text-body-sm focus:bg-white transition-colors"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-body-sm font-semibold text-foreground">
                  {KONTAK_FORM.fields.email.label}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={KONTAK_FORM.fields.email.placeholder}
                  className="h-11 rounded-lg border-slate-200 bg-slate-50/50 text-body-sm focus:bg-white transition-colors"
                />
              </div>

              {/* Telepon */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-body-sm font-semibold text-foreground">
                  {KONTAK_FORM.fields.phone.label}
                </Label>
                <Input
                  id="phone"
                  placeholder={KONTAK_FORM.fields.phone.placeholder}
                  className="h-11 rounded-lg border-slate-200 bg-slate-50/50 text-body-sm focus:bg-white transition-colors"
                />
              </div>

              {/* Topik */}
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-body-sm font-semibold text-foreground">
                  {KONTAK_FORM.fields.subject.label}
                </Label>
                <Select>
                  <SelectTrigger
                    id="subject"
                    className="h-11 rounded-lg border-slate-200 bg-slate-50/50 text-body-sm focus:bg-white transition-colors"
                  >
                    <SelectValue placeholder={KONTAK_FORM.fields.subject.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="umum">Pertanyaan umum</SelectItem>
                    <SelectItem value="kerjasama">Kerjasama</SelectItem>
                    <SelectItem value="masukan">Kritik &amp; saran</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Pesan */}
              <div className="col-span-full space-y-2">
                <Label htmlFor="message" className="text-body-sm font-semibold text-foreground">
                  {KONTAK_FORM.fields.message.label}
                </Label>
                <Textarea
                  id="message"
                  placeholder={KONTAK_FORM.fields.message.placeholder}
                  className="min-h-[120px] rounded-lg border-slate-200 bg-slate-50/50 text-body-sm focus:bg-white transition-colors resize-none"
                />
              </div>

              {/* Tombol kirim */}
              <div className="col-span-full mt-2">
                <Button className="w-full h-12 bg-primary hover:bg-primary-dark !text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg active:scale-[0.99] cursor-pointer">
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