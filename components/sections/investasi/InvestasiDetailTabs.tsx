"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Clock } from "lucide-react";

export default function InvestasiDetailTabs() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "keuangan", label: "Keuangan" },
    { id: "tim", label: "Tim Proyek" },
    { id: "update", label: "Update" },
  ];

  return (
    <div className="mt-8">
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-6 py-4 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "border-b-2 border-[#1A6B2F] text-[#1A6B2F]"
                : "text-gray-500 hover:text-[#1A6B2F]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="py-8">
        {activeTab === "overview" && (
          <div className="prose max-w-none text-gray-600">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Deskripsi Proyek</h3>
            <p>
              Proyek ini difokuskan pada pengembangan pertanian berkelanjutan dengan
              pemanfaatan teknologi modern untuk meningkatkan hasil panen dan
              efisiensi operasional. Kami bekerja sama dengan petani lokal berpengalaman
              untuk memastikan keberhasilan proyek.
            </p>
            <p className="mt-4">
              Dana yang terkumpul akan digunakan untuk pengadaan bibit unggul,
              pupuk organik, sistem irigasi cerdas, serta biaya operasional selama
              masa tanam hingga panen.
            </p>
            <ul className="mt-6 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#1A6B2F]" />
                <span>Penggunaan bibit unggul bersertifikat</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#1A6B2F]" />
                <span>Monitoring berkala oleh tim ahli</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#1A6B2F]" />
                <span>Pasar penyerapan hasil panen yang sudah tersedia</span>
              </li>
            </ul>
          </div>
        )}

        {activeTab === "keuangan" && (
          <div className="overflow-x-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Proyeksi Keuntungan</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-sm font-bold text-gray-900 border-b">Tahun</th>
                  <th className="p-4 text-sm font-bold text-gray-900 border-b">Proyeksi Pendapatan</th>
                  <th className="p-4 text-sm font-bold text-gray-900 border-b">Estimasi Profit</th>
                  <th className="p-4 text-sm font-bold text-gray-900 border-b">ROI</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tahun: "Tahun 1", pendapatan: "Rp 1.200.000.000", profit: "Rp 150.000.000", roi: "12,5%" },
                  { tahun: "Tahun 2", pendapatan: "Rp 1.500.000.000", profit: "Rp 210.000.000", roi: "14,0%" },
                  { tahun: "Tahun 3", pendapatan: "Rp 1.850.000.000", profit: "Rp 277.500.000", roi: "15,0%" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-600 border-b">{row.tahun}</td>
                    <td className="p-4 text-sm text-gray-600 border-b">{row.pendapatan}</td>
                    <td className="p-4 text-sm font-bold text-[#1A6B2F] border-b">{row.profit}</td>
                    <td className="p-4 text-sm font-bold text-[#BA7517] border-b">{row.roi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "tim" && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Arif Wijaya", role: "Manager Proyek", image: "/images/about/pimpinan-arif-wijaya.jpeg" },
              { name: "Budi Santoso", role: "Ahli Agronomi", image: "/images/about/pimpinan-budi-santoso.jpeg" },
              { name: "Siti Aminah", role: "Ops Manager", image: "/images/about/pimpinan-siti-aminah.jpeg" },
            ].map((member, i) => (
              <div key={i} className="rounded-xl border border-gray-100 p-4 text-center">
                <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full mb-4">
                  <Image src={member.image} alt={member.name} fill className="object-cover" />
                </div>
                <h4 className="font-bold text-gray-900">{member.name}</h4>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "update" && (
          <div className="space-y-8">
            {[
              { title: "Persiapan Lahan Selesai", date: "10 April 2024", desc: "Lahan telah siap ditanami, irigasi sudah terpasang.", status: "Completed" },
              { title: "Penanaman Bibit Tahap 1", date: "15 April 2024", desc: "Sebanyak 10.000 bibit telah ditanam.", status: "In Progress" },
              { title: "Pemupukan Pertama", date: "30 April 2024", desc: "Pemupukan dasar menggunakan pupuk organik.", status: "Upcoming" },
            ].map((update, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${i === 0 ? "bg-[#1A6B2F]" : "bg-gray-200"}`}>
                    <Clock className={`h-4 w-4 ${i === 0 ? "text-white" : "text-gray-500"}`} />
                  </div>
                  {i !== 2 && <div className="w-0.5 flex-1 bg-gray-200" />}
                </div>
                <div className="pb-8">
                  <h4 className="font-bold text-gray-900">{update.title}</h4>
                  <div className="text-xs text-gray-500 mb-2">{update.date}</div>
                  <p className="text-sm text-gray-600">{update.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
