"use client";

import React, { useState, useEffect, Suspense } from "react";
import NextImage from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  REGISTER_MEMBERSHIP_TYPES,
  REGISTER_BENEFITS,
  REGISTER_FORM_LABELS,
  REGISTER_FORM_PLACEHOLDERS,
  REGISTER_FORM_HINTS,
  REGISTER_BUTTONS,
  REGISTER_TERMS,
} from "@/constants/register";
import {
  CheckCircle2,
  User,
  Mail,
  Phone,
  Lock,
  EyeOff,
  Calendar as CalendarIcon,
  Building2,
  Sprout,
  Store,
  TrendingUp,
  Handshake,
  ShieldCheck,
  Eye,
  Loader2
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const roleImages: Record<string, string> = {
  petani: "/images/register/farmer.webp",
  distributor: "/images/register/distributor.webp",
  investor: "/images/register/investor.webp",
  mitra_bisnis: "/images/register/business-partner.webp",
  admin_perusahaan: "/images/register/admin-company.webp",
};

const regionData: Record<string, string[]> = {
  jatim: ["Surabaya", "Malang", "Lamongan", "Sidoarjo", "Gresik"],
  jateng: ["Semarang", "Solo", "Magelang", "Tegal", "Pekalongan"],
  jabar: ["Bandung", "Bogor", "Depok", "Bekasi", "Cimahi"],
};

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedRole, setSelectedRole] = useState("petani");
  const [selectedProvinsi, setSelectedProvinsi] = useState<string>("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam && roleImages[roleParam]) {
      setSelectedRole(roleParam);
    }
  }, [searchParams]);

  const getPasswordStrength = () => {
    if (!password) return { label: "", color: "" };
    if (password.length < 6) return { label: "Lemah", color: "text-red-500 bg-red-100" };

    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length >= 10 && hasNumber && hasSymbol) {
      return { label: "Kuat", color: "text-green-600 bg-green-100" };
    }
    if (password.length >= 6 && hasNumber) {
      return { label: "Sedang", color: "text-yellow-600 bg-yellow-100" };
    }

    return { label: "Lemah", color: "text-red-500 bg-red-100" };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/login?registered=true");
  };

  const getRoleSpecificFields = () => {
    type FieldConfig = {
      label: string;
      placeholder: string;
      type?: string;
      options?: string[];
      icon?: any;
    };

    type RoleFields = {
      title: string;
      icon: any;
      field1: FieldConfig;
      field2: FieldConfig;
    };

    switch (selectedRole) {
      case "petani":
        return {
          title: "Informasi Pertanian",
          icon: Sprout,
          field1: { label: "Nama Kelompok Tani", placeholder: "Contoh: Tani Makmur Jaya", icon: Building2 },
          field2: { label: "Komoditas Utama", placeholder: "Pilih komoditas", type: "select", options: ["Padi", "Jagung", "Sayuran", "Buah-buahan", "Lainnya"] },
        } as RoleFields;
      case "distributor":
        return {
          title: "Informasi Bisnis & Distribusi",
          icon: Store,
          field1: { label: "Nama Toko / Gudang", placeholder: "Contoh: UD Sumber Rejeki", icon: Building2 },
          field2: { label: "Cakupan Wilayah", placeholder: "Pilih wilayah", type: "select", options: ["Lokal (Kecamatan)", "Regional (Kabupaten)", "Nasional"] },
        } as RoleFields;
      case "investor":
        return {
          title: "Profil Investasi",
          icon: TrendingUp,
          field1: { label: "Tipe Investor", placeholder: "Pilih tipe", type: "select", options: ["Individu / Perorangan", "Institusi / Perusahaan"] },
          field2: { label: "Rencana Budget Investasi", placeholder: "Pilih range", type: "select", options: ["Rp 1jt - 10jt", "Rp 10jt - 50jt", "Rp 50jt - 100jt", "> Rp 100jt"] },
        } as RoleFields;
      case "mitra_bisnis":
        return {
          title: "Informasi Kemitraan",
          icon: Handshake,
          field1: { label: "Nama Perusahaan / Institusi", placeholder: "Contoh: PT Agro Sejahtera", icon: Building2 },
          field2: { label: "Model Kerjasama", placeholder: "Pilih model", type: "select", options: ["Penyedia Teknologi", "Logistik & Rantai Pasok", "Offtaker / Pembeli Siaga", "Lainnya"] },
        } as RoleFields;
      case "admin_perusahaan":
        return {
          title: "Data Operasional Perusahaan",
          icon: ShieldCheck,
          field1: { label: "Nama Perusahaan Resmi", placeholder: "Contoh: PT Smarttani Tech", icon: Building2 },
          field2: { label: "Jabatan / Posisi", placeholder: "Pilih jabatan", type: "select", options: ["Direktur / CEO", "Manajer Operasional", "Admin Sistem", "Staf IT"] },
        } as RoleFields;
      default:
        return null;
    }
  };

  const extraFields = getRoleSpecificFields();

  return (
    <section className="section-padding">
      <div className="container-smarttani">
        <div className="grid gap-8 lg:grid-cols-12">

          {/* Left Column: Role Selection & Benefits */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl bg-white p-6 md:p-8 border border-slate-100">
              <h2 className="text-heading-2 font-bold text-gray-900">
                {REGISTER_MEMBERSHIP_TYPES.heading}
              </h2>
              <p className="mt-2 text-body-sm font-medium text-gray-500">
                {REGISTER_MEMBERSHIP_TYPES.subtext}
              </p>

              <RadioGroup
                value={selectedRole}
                onValueChange={setSelectedRole}
                className="mt-6 space-y-2"
              >
                {REGISTER_MEMBERSHIP_TYPES.items.map((role) => (
                  <div key={role.value}>
                    <Label
                      htmlFor={role.value}
                      className={`relative flex w-full cursor-pointer items-center gap-3 transition-all`}
                    >
                      <RadioGroupItem
                        value={role.value}
                        id={role.value}
                        className="sr-only hidden"
                      />

                      {/* Image */}
                      <div className="relative border size-10 shrink-0 overflow-hidden rounded-lg bg-slate-50 md:size-14">
                        <NextImage
                          src={roleImages[role.value]}
                          alt={role.label}
                          fill
                          className="object-contain p-1"
                        />
                      </div>

                      {/* Text — flex-1 agar mendorong radio ke kanan */}
                      <div className="flex-1">
                        <h3 className="text-sm md:text-base font-bold text-gray-900">
                          {role.label}
                        </h3>
                        <p className="hidden md:block mt-1 text-[11px] font-medium leading-tight text-gray-500">
                          {role.description}
                        </p>
                      </div>

                      {/* ✅ Radio indicator — child langsung dari Label agar justify works */}
                      <div className={`shrink-0 size-5 rounded-full border-2 flex items-center justify-center ${selectedRole === role.value
                        ? "border-[#1A6B2F] bg-[#1A6B2F]"
                        : "border-slate-200"
                        }`}>
                        {selectedRole === role.value && (
                          <div className="size-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-8">
            <div className="rounded-[2.5rem] bg-white p-6 shadow-xl shadow-slate-200/60 md:p-10 lg:p-12 border border-slate-100">
              <h2 className="text-heading-2 font-bold text-gray-900">
                {REGISTER_FORM_LABELS.heading}
              </h2>
              <p className="mt-2 text-body-sm font-medium text-gray-500">
                {REGISTER_FORM_LABELS.subtext}
              </p>

              <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
                {/* Nama Lengkap */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700">
                    {REGISTER_FORM_LABELS.namaLengkap}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      required
                      placeholder={REGISTER_FORM_PLACEHOLDERS.namaLengkap}
                      className="h-12 rounded-xl border-slate-200 bg-slate-50/50 pl-12 focus:bg-white transition-all focus:ring-1 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700">
                    {REGISTER_FORM_LABELS.email}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="email"
                      required
                      placeholder={REGISTER_FORM_PLACEHOLDERS.email}
                      className="h-12 rounded-xl border-slate-200 bg-slate-50/50 pl-12 focus:bg-white transition-all focus:ring-1 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Nomor HP */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700">
                    {REGISTER_FORM_LABELS.nomorHp}
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      required
                      placeholder={REGISTER_FORM_PLACEHOLDERS.nomorHp}
                      className="h-12 rounded-xl border-slate-200 bg-slate-50/50 pl-12 focus:bg-white transition-all focus:ring-1 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Kata Sandi */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold text-gray-700">
                      {REGISTER_FORM_LABELS.kataSandi}
                    </Label>
                    {password && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${strength.color}`}>
                        {strength.label}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                    <Input
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={REGISTER_FORM_PLACEHOLDERS.kataSandi}
                      className="h-12 rounded-xl border-slate-200 bg-slate-50/50 pl-12 pr-12 focus:bg-white transition-all focus:ring-1 focus:ring-primary/20"
                    />
                  </div>
                  <p className="text-[10px] font-medium text-gray-500">
                    ✓ {REGISTER_FORM_HINTS.kataSandi}
                  </p>
                </div>

                {/* Konfirmasi Kata Sandi */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700">
                    {REGISTER_FORM_LABELS.konfirmasiKataSandi}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      required
                      type="password"
                      placeholder={REGISTER_FORM_PLACEHOLDERS.konfirmasiKataSandi}
                      className="h-12 rounded-xl border-slate-200 bg-slate-50/50 pl-12 focus:bg-white transition-all focus:ring-1 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="hidden md:block" />

                {/* Jenis Kelamin */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700">
                    {REGISTER_FORM_LABELS.jenisKelamin}
                  </Label>
                  <Select required>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all">
                      <SelectValue placeholder={REGISTER_FORM_PLACEHOLDERS.jenisKelamin} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="laki-laki">Laki-laki</SelectItem>
                      <SelectItem value="perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tanggal Lahir */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700">
                    {REGISTER_FORM_LABELS.tanggalLahir}
                  </Label>
                  <div className="relative">
                    <CalendarIcon className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <Input
                      required
                      type="date"
                      className="h-12 rounded-xl border-slate-200 bg-slate-50/50 pr-12 focus:bg-white appearance-none block w-full transition-all"
                    />
                  </div>
                </div>

                {/* Lokasi (Provinsi) */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700">
                    {REGISTER_FORM_LABELS.lokasi}
                  </Label>
                  <Select required value={selectedProvinsi} onValueChange={setSelectedProvinsi}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all">
                      <SelectValue placeholder={REGISTER_FORM_PLACEHOLDERS.lokasi} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jatim">Jawa Timur</SelectItem>
                      <SelectItem value="jateng">Jawa Tengah</SelectItem>
                      <SelectItem value="jabar">Jawa Barat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Kota/Kabupaten */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700">
                    {REGISTER_FORM_LABELS.kotaKabupaten}
                  </Label>
                  <Select required disabled={!selectedProvinsi}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white disabled:opacity-50 transition-all">
                      <SelectValue placeholder={REGISTER_FORM_PLACEHOLDERS.kotaKabupaten} />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProvinsi && regionData[selectedProvinsi]?.map((kota) => (
                        <SelectItem key={kota} value={kota.toLowerCase()}>{kota}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Informasi Tambahan (Dynamic) */}
                {extraFields && (
                  <>
                    <div className="md:col-span-2 pt-2">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                          <extraFields.icon className="size-5" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">
                          {extraFields.title}
                        </h3>
                      </div>
                      <div className="mt-2 h-px w-full bg-slate-100" />
                    </div>

                    {/* Field 1 */}
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-gray-700">
                        {extraFields.field1.label}
                      </Label>
                      {extraFields.field1.type === "select" ? (
                        <Select>
                          <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all">
                            <SelectValue placeholder={extraFields.field1.placeholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {extraFields.field1.options?.map(opt => (
                              <SelectItem key={opt} value={opt.toLowerCase()}>{opt}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="relative">
                          {extraFields.field1.icon && <extraFields.field1.icon className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />}
                          <Input
                            placeholder={extraFields.field1.placeholder}
                            className={`h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all ${extraFields.field1.icon ? 'pl-12' : ''}`}
                          />
                        </div>
                      )}
                    </div>

                    {/* Field 2 */}
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-gray-700">
                        {extraFields.field2.label}
                      </Label>
                      {extraFields.field2.type === "select" ? (
                        <Select>
                          <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all">
                            <SelectValue placeholder={extraFields.field2.placeholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {extraFields.field2.options?.map(opt => (
                              <SelectItem key={opt} value={opt.toLowerCase()}>{opt}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="relative">
                          {extraFields.field2.icon && <extraFields.field2.icon className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />}
                          <Input
                            placeholder={extraFields.field2.placeholder}
                            className={`h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all ${extraFields.field2.icon ? 'pl-12' : ''}`}
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Syarat & Ketentuan */}
                <div className="md:col-span-2 flex items-center gap-3">
                  <Checkbox required id="syarat" className="shrink-0 border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                  <p className="text-xs font-bold leading-relaxed text-gray-700">
                    {REGISTER_TERMS.prefix}{" "}
                    <span className="text-primary cursor-pointer hover:underline">{REGISTER_TERMS.syaratKetentuan}</span>{" "}
                    {REGISTER_TERMS.conjunction}{" "}
                    <span className="text-primary cursor-pointer hover:underline">{REGISTER_TERMS.kebijakanPrivasi}</span>{" "}
                    {REGISTER_TERMS.suffix}
                  </p>
                </div>

                {/* Button */}
                <div className="md:col-span-2 mt-2 space-y-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary py-6 text-base font-bold text-white hover:bg-primary-dark rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 size-5 animate-spin" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Lock className="size-4" />
                        {REGISTER_BUTTONS.daftarSekarang}
                      </div>
                    )}
                  </Button>

                  <p className="text-center text-sm font-bold text-gray-900">
                    {REGISTER_FORM_HINTS.sudahPunyaAkun}{" "}
                    <Link href="/login" className="text-primary cursor-pointer hover:underline">
                      {REGISTER_FORM_HINTS.masukLink}
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default function Form() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin text-green-600 size-10" /></div>}>
      <RegisterFormContent />
    </Suspense>
  );
}
