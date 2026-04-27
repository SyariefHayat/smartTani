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

export default function ContactMiddleSection() {
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
    if (type === "WhatsApp" || type === "Telepon") return `tel:${value.replace(/\s+/g, '')}`;
    if (type === "Email") return `mailto:${value}`;
    return "#";
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-smarttani">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">

          {/* Kiri: Informasi kontak */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl">
                {CONTACT_INFO.heading}
              </h2>
              <p className="mt-2 text-sm font-medium text-[#5d7a64]">
                {CONTACT_INFO.subtext}
              </p>
            </div>

            {/* ✅ Selalu 1 kolom di semua ukuran — tidak ada grid 2 kolom di tablet */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
              {CONTACT_INFO.items.map((item, index) => {
                const Icon = INFO_ICONS[index];
                const isLink = item.type === "WhatsApp" || item.type === "Telepon" || item.type === "Email";

                const content = (
                  <div className="flex items-center gap-3 p-4 hover:bg-white transition-all duration-300">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="size-7 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-extrabold text-[#17391f]">{item.type}</p>
                      <p className="text-xs font-medium text-[#5d7a64] leading-relaxed whitespace-pre-line break-words">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );

                return isLink ? (
                  <a key={item.type} href={getContactHref(item.type, item.value)} className="block">
                    {content}
                  </a>
                ) : (
                  <div key={item.type}>{content}</div>
                );
              })}
            </div>
          </div>

          {/* Kanan: Form kirim pesan */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="size-16 bg-primary-light rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="size-8 text-primary" />
                </div>
                <h2 className="text-xl font-extrabold text-[#17391f] mb-2">Pesan Terkirim!</h2>
                <p className="text-sm font-medium text-[#5d7a64] max-w-md">
                  ✓ Pesan Anda telah dikirim! Tim kami akan menghubungi dalam 1x24 jam.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="mt-6 rounded-xl font-bold border-primary text-primary hover:bg-primary-light cursor-pointer h-11 px-6"
                >
                  Kirim Pesan Lain
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-xl font-extrabold text-[#17391f] md:text-2xl">
                    {CONTACT_FORM.heading}
                  </h2>
                  <p className="mt-2 text-sm font-medium text-[#5d7a64]">
                    {CONTACT_FORM.subtext}
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Nama */}
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-extrabold text-[#17391f]">
                      {CONTACT_FORM.fields.name.label}
                    </Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder={CONTACT_FORM.fields.name.placeholder}
                      className={`h-11 rounded-xl border-slate-200 bg-slate-50/50 text-sm font-medium text-[#5d7a64] focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && <p className="text-[10px] font-bold text-red-500">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-extrabold text-[#17391f]">
                      {CONTACT_FORM.fields.email.label}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder={CONTACT_FORM.fields.email.placeholder}
                      className={`h-11 rounded-xl border-slate-200 bg-slate-50/50 text-sm font-medium text-[#5d7a64] focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-[10px] font-bold text-red-500">{errors.email.message}</p>}
                  </div>

                  {/* Telepon */}
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-extrabold text-[#17391f]">
                      {CONTACT_FORM.fields.phone.label}
                    </Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder={CONTACT_FORM.fields.phone.placeholder}
                      className={`h-11 rounded-xl border-slate-200 bg-slate-50/50 text-sm font-medium text-[#5d7a64] focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all ${errors.phone ? 'border-red-500' : ''}`}
                    />
                    {errors.phone && <p className="text-[10px] font-bold text-red-500">{errors.phone.message}</p>}
                  </div>

                  {/* Topik */}
                  <div className="space-y-1.5">
                    <Label htmlFor="subject" className="text-xs font-extrabold text-[#17391f]">
                      {CONTACT_FORM.fields.subject.label}
                    </Label>
                    <Select onValueChange={(v) => setValue("subject", v)}>
                      <SelectTrigger
                        id="subject"
                        className={`h-11 rounded-xl border-slate-200 bg-slate-50/50 text-sm font-medium text-[#5d7a64] focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all ${errors.subject ? 'border-red-500' : ''}`}
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
                  <div className="col-span-full space-y-1.5">
                    <Label htmlFor="message" className="text-xs font-extrabold text-[#17391f]">
                      {CONTACT_FORM.fields.message.label}
                    </Label>
                    <Textarea
                      id="message"
                      {...register("message")}
                      placeholder={CONTACT_FORM.fields.message.placeholder}
                      className={`min-h-[110px] rounded-xl border-slate-200 bg-slate-50/50 text-sm font-medium text-[#5d7a64] focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all resize-none ${errors.message ? 'border-red-500' : ''}`}
                    />
                    {errors.message && <p className="text-[10px] font-bold text-red-500">{errors.message.message}</p>}
                  </div>

                  {/* Tombol kirim */}
                  <div className="col-span-full mt-2">
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