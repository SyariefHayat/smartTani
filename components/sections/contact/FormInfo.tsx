"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CONTACT_INFO, CONTACT_FORM } from "@/constants/contact";
import { MapPin, Phone, Mail, Globe, Clock, SendHorizontal, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";

const INFO_ICONS = [MapPin, Phone, Mail, Globe, Clock];

const contactSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(10, "Nomor HP tidak valid"),
  subject: z.string().min(1, "Silakan pilih subjek"),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
});

type ContactValues = z.infer<typeof contactSchema>;

export default function FormInfo() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactValues) => {
    console.log("Form data:", data);
    await new Promise(r => setTimeout(r, 1000));
    setIsSubmitted(true);
  };

  const getContactHref = (type: string, value: string) => {
    if (type === "WhatsApp" || type === "Telepon" || type === "Nomor HP") return `tel:${value.replace(/\s+/g, '')}`;
    if (type === "Email") return `mailto:${value}`;
    if (type === "Website") return `https://${value}`;
    return "#";
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-smarttani">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">

          {/* Kiri: Informasi kontak */}
          <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
            <div>
              <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl mb-4">
                {CONTACT_INFO.heading}
              </h2>
              <p className="text-sm md:text-base font-medium text-[#5d7a64] leading-relaxed">
                {CONTACT_INFO.subtext}
              </p>
            </div>

            {/* Mobile: list vertikal | Tablet: grid 3x2 | Desktop: list vertikal */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 lg:divide-y lg:divide-slate-100">
              {CONTACT_INFO.items.map((item, index) => {
                const Icon = INFO_ICONS[index];
                const isLink = item.type === "WhatsApp" || item.type === "Telepon" || item.type === "Nomor HP" || item.type === "Email" || item.type === "Website";

                const content = (
                  <div className="flex flex-col items-center text-center gap-3 p-5 hover:bg-slate-50 transition-all duration-300 lg:flex-row lg:text-left">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#d4edda] text-[#2D6A2D]">
                      <Icon className="size-6" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-[#17391f] mb-0.5">{item.type}</p>
                      <p className="text-xs font-medium text-[#5d7a64] leading-relaxed whitespace-pre-line break-words">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );

                return isLink ? (
                  <a key={item.type} href={getContactHref(item.type, item.value)} className="block group">
                    {content}
                  </a>
                ) : (
                  <div key={item.type}>{content}</div>
                );
              })}
            </div>
          </div>

          {/* Kanan: Form kirim pesan */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-100 bg-white p-6 md:p-10 shadow-sm order-1 lg:order-2">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="size-20 bg-[#d4edda] text-[#2D6A2D] rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="size-10" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-extrabold text-[#17391f] mb-3">Pesan Terkirim!</h2>
                <p className="text-base font-medium text-[#5d7a64] max-w-md">
                  Pesan Anda telah berhasil dikirim! Tim kami akan menghubungi Anda kembali dalam waktu 1x24 jam.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="mt-8 rounded-xl font-bold border-primary text-primary hover:bg-primary/5 cursor-pointer h-12 px-8"
                >
                  Kirim Pesan Lain
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-xl font-extrabold text-[#17391f] md:text-2xl mb-2">
                    {CONTACT_FORM.heading}
                  </h2>
                  <p className="text-sm font-medium text-[#5d7a64]">
                    {CONTACT_FORM.subtext}
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Nama */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-extrabold text-[#17391f]">
                      {CONTACT_FORM.fields.name.label}
                    </Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder={CONTACT_FORM.fields.name.placeholder}
                      className={`h-12 rounded-xl border-slate-200 bg-slate-50/50 text-sm font-medium text-[#5d7a64] focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && <p className="text-[10px] font-bold text-red-500">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-extrabold text-[#17391f]">
                      {CONTACT_FORM.fields.email.label}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder={CONTACT_FORM.fields.email.placeholder}
                      className={`h-12 rounded-xl border-slate-200 bg-slate-50/50 text-sm font-medium text-[#5d7a64] focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-[10px] font-bold text-red-500">{errors.email.message}</p>}
                  </div>

                  {/* Telepon */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-extrabold text-[#17391f]">
                      {CONTACT_FORM.fields.phone.label}
                    </Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder={CONTACT_FORM.fields.phone.placeholder}
                      className={`h-12 rounded-xl border-slate-200 bg-slate-50/50 text-sm font-medium text-[#5d7a64] focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all ${errors.phone ? 'border-red-500' : ''}`}
                    />
                    {errors.phone && <p className="text-[10px] font-bold text-red-500">{errors.phone.message}</p>}
                  </div>

                  {/* Topik */}
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-xs font-extrabold text-[#17391f]">
                      {CONTACT_FORM.fields.subject.label}
                    </Label>
                    <Select onValueChange={(v) => setValue("subject", v)}>
                      <SelectTrigger
                        id="subject"
                        className={`h-12 rounded-xl border-slate-200 bg-slate-50/50 text-sm font-medium text-[#5d7a64] focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all ${errors.subject ? 'border-red-500' : ''}`}
                      >
                        <SelectValue placeholder={CONTACT_FORM.fields.subject.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="umum">Pertanyaan umum</SelectItem>
                        <SelectItem value="kerjasama">Kerjasama</SelectItem>
                        <SelectItem value="masukan">Kritik &amp; saran</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.subject && <p className="text-[10px] font-bold text-red-500">{errors.subject.message}</p>}
                  </div>

                  {/* Pesan */}
                  <div className="col-span-full space-y-2">
                    <Label htmlFor="message" className="text-xs font-extrabold text-[#17391f]">
                      {CONTACT_FORM.fields.message.label}
                    </Label>
                    <Textarea
                      id="message"
                      {...register("message")}
                      placeholder={CONTACT_FORM.fields.message.placeholder}
                      className={`min-h-[140px] rounded-xl border-slate-200 bg-slate-50/50 text-sm font-medium text-[#5d7a64] focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all resize-none ${errors.message ? 'border-red-500' : ''}`}
                    />
                    {errors.message && <p className="text-[10px] font-bold text-red-500">{errors.message.message}</p>}
                  </div>

                  {/* Tombol kirim */}
                  <div className="col-span-full mt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-primary hover:bg-primary-dark !text-white text-sm font-extrabold rounded-xl transition-all hover:shadow-xl shadow-primary/20 active:scale-[0.98] cursor-pointer disabled:opacity-70"
                    >
                      <SendHorizontal className="mr-2 size-5" />
                      {isSubmitting ? "Mengirim..." : CONTACT_FORM.button}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
