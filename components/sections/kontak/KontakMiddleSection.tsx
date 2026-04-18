"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { KONTAK_INFO, KONTAK_FORM } from "@/constants/kontak";
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

export default function KontakMiddleSection() {
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
                const isLink = item.type === "WhatsApp" || item.type === "Telepon" || item.type === "Email";
                
                const content = (
                  <div
                    className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors duration-200 h-full"
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
          <div className="lg:col-span-7 rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="size-20 bg-primary-light rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="size-10 text-primary" />
                </div>
                <h2 className="text-heading-2 font-bold text-foreground mb-3">Pesan Terkirim!</h2>
                <p className="text-body text-muted-foreground max-w-md">
                  ✓ Pesan Anda telah dikirim! Tim kami akan menghubungi dalam 1x24 jam.
                </p>
                <Button 
                  onClick={() => setIsSubmitted(false)}
                  variant="outline" 
                  className="mt-8 rounded-xl font-bold border-primary text-primary hover:bg-primary-light cursor-pointer"
                >
                  Kirim Pesan Lain
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-heading-2 font-bold text-foreground">
                    {KONTAK_FORM.heading}
                  </h2>
                  <p className="mt-2 text-body-sm text-muted-foreground">
                    {KONTAK_FORM.subtext}
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Nama */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-body-sm font-semibold text-foreground">
                      {KONTAK_FORM.fields.name.label}
                    </Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder={KONTAK_FORM.fields.name.placeholder}
                      className={`h-11 rounded-lg border-slate-200 bg-slate-50/50 text-body-sm focus:bg-white transition-colors ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && <p className="text-[10px] font-bold text-red-500">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-body-sm font-semibold text-foreground">
                      {KONTAK_FORM.fields.email.label}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder={KONTAK_FORM.fields.email.placeholder}
                      className={`h-11 rounded-lg border-slate-200 bg-slate-50/50 text-body-sm focus:bg-white transition-colors ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-[10px] font-bold text-red-500">{errors.email.message}</p>}
                  </div>

                  {/* Telepon */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-body-sm font-semibold text-foreground">
                      {KONTAK_FORM.fields.phone.label}
                    </Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder={KONTAK_FORM.fields.phone.placeholder}
                      className={`h-11 rounded-lg border-slate-200 bg-slate-50/50 text-body-sm focus:bg-white transition-colors ${errors.phone ? 'border-red-500' : ''}`}
                    />
                    {errors.phone && <p className="text-[10px] font-bold text-red-500">{errors.phone.message}</p>}
                  </div>

                  {/* Topik */}
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-body-sm font-semibold text-foreground">
                      {KONTAK_FORM.fields.subject.label}
                    </Label>
                    <Select onValueChange={(v) => setValue("subject", v)}>
                      <SelectTrigger
                        id="subject"
                        className={`h-11 rounded-lg border-slate-200 bg-slate-50/50 text-body-sm focus:bg-white transition-colors ${errors.subject ? 'border-red-500' : ''}`}
                      >
                        <SelectValue placeholder={KONTAK_FORM.fields.subject.placeholder} />
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
                    <Label htmlFor="message" className="text-body-sm font-semibold text-foreground">
                      {KONTAK_FORM.fields.message.label}
                    </Label>
                    <Textarea
                      id="message"
                      {...register("message")}
                      placeholder={KONTAK_FORM.fields.message.placeholder}
                      className={`min-h-[120px] rounded-lg border-slate-200 bg-slate-50/50 text-body-sm focus:bg-white transition-colors resize-none ${errors.message ? 'border-red-500' : ''}`}
                    />
                    {errors.message && <p className="text-[10px] font-bold text-red-500">{errors.message.message}</p>}
                  </div>

                  {/* Tombol kirim */}
                  <div className="col-span-full mt-2">
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-primary hover:bg-primary-dark !text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg active:scale-[0.99] cursor-pointer disabled:opacity-70"
                    >
                      <SendHorizontal className="mr-2 size-5" />
                      {isSubmitting ? "Mengirim..." : KONTAK_FORM.button}
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