"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { showToast } from "@/lib/toast";

interface InvestmentFormProps {
  projectTitle: string;
  minInvestasi: string;
}

export default function InvestmentForm({ projectTitle, minInvestasi }: InvestmentFormProps) {
  const router = useRouter();
  const [nominal, setNominal] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // Extract number from string like "Rp100.000"
  const minVal = parseInt(minInvestasi.replace(/[^0-9]/g, "")) || 0;

  const handleInvest = () => {
    const auth = localStorage.getItem("smarttani-auth");
    if (!auth) {
      router.push(`/login?redirect=${window.location.pathname}`);
      return;
    }

    if (parseInt(nominal) < minVal) {
      showToast(`Minimal investasi adalah ${minInvestasi}`, "error");
      return;
    }

    setShowConfirm(true);
  };

  const confirmInvest = () => {
    showToast(`Sukses! Anda telah berinvestasi sebesar Rp ${parseInt(nominal).toLocaleString("id-ID")} di ${projectTitle}`, "success");
    setNominal("");
    setShowConfirm(false);
  };

  return (
    <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
      <h3 className="text-lg font-extrabold text-[#17391f] md:text-xl">Mulai Investasi</h3>
      <p className="mt-2 text-xs font-medium text-[#5d7a64] md:text-sm">
        Tentukan nominal investasi Anda untuk proyek ini.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Nominal Investasi (Rp)
          </label>
          <div className="relative mt-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
              Rp
            </span>
            <Input
              type="number"
              placeholder="0"
              value={nominal}
              onChange={(e) => setNominal(e.target.value)}
              className="pl-10 h-12 rounded-lg border-gray-200 focus:border-primary"
            />
          </div>
          <p className="mt-2 text-[10px] font-semibold text-[#BA7517]">
            Minimal investasi: {minInvestasi}
          </p>
        </div>

        {!showConfirm ? (
          <Button
            className="w-full h-14 bg-[#1A6B2F] hover:bg-[#145224] font-bold rounded-lg shadow-md cursor-pointer"
            onClick={handleInvest}
          >
            Investasi Sekarang
          </Button>
        ) : (
          <div className="space-y-3 rounded-xl bg-gray-50 p-4 border border-gray-100">
            <p className="text-sm font-medium text-[#17391f]">
              Konfirmasi: Investasi <strong className="font-extrabold">Rp {parseInt(nominal).toLocaleString("id-ID")}</strong> di <strong className="font-extrabold">{projectTitle}</strong>?
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 h-12 font-bold rounded-lg cursor-pointer"
                onClick={() => setShowConfirm(false)}
              >
                Batal
              </Button>
              <Button
                className="flex-1 h-12 bg-[#1A6B2F] hover:bg-[#145224] font-bold rounded-lg cursor-pointer text-white"
                onClick={confirmInvest}
              >
                Konfirmasi
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 rounded-xl bg-[#E1F5EE] p-4 border border-[#0F6E56]/10">
          <ShieldCheck className="h-5 w-5 text-[#0F6E56] shrink-0" />
          <p className="text-xs font-medium text-[#5d7a64]">
            Investasi Anda dilindungi sistem keamanan Smarttani dan diawasi secara berkala.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-medium text-gray-400">
          <Info className="h-3 w-3" />
          <span>S&K Berlaku untuk setiap investasi</span>
        </div>
      </div>
    </div>
  );
}
