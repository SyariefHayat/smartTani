import { INVESTASI_PORTOFOLIO_DUMMY } from "@/constants/investasi";
import { Badge } from "@/components/ui/badge";

export default function PortfolioSection() {
  const { summary, investasiAktif } = INVESTASI_PORTOFOLIO_DUMMY;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#17391f]">{INVESTASI_PORTOFOLIO_DUMMY.heading}</h2>
          <p className="text-xs text-gray-500">{INVESTASI_PORTOFOLIO_DUMMY.subtext}</p>
        </div>
        <button className="text-[11px] font-semibold text-[#2D6A2D] hover:underline flex items-center gap-1">
          Lihat Portofolio 
          <span className="text-lg">→</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-neutral-100 shadow-sm">
          <p className="text-[10px] text-gray-500 mb-1">Total Investasi</p>
          <p className="text-sm font-bold text-[#17391f]">{summary.totalInvestasi}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-neutral-100 shadow-sm">
          <p className="text-[10px] text-gray-500 mb-1">Total Keuntungan</p>
          <p className="text-sm font-bold text-[#2D6A2D]">{summary.totalKeuntungan}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-neutral-100 shadow-sm">
          <p className="text-[10px] text-gray-500 mb-1">Proyek Aktif</p>
          <p className="text-sm font-bold text-[#17391f]">{summary.proyekAktif}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-neutral-100 shadow-sm">
          <p className="text-[10px] text-gray-500 mb-1">Imbal Hasil Rata-rata</p>
          <p className="text-sm font-bold text-[#17391f]">{summary.imbalHasilRataRata}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-50">
          <h3 className="text-xs font-bold text-[#17391f]">Investasi Aktif</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="bg-neutral-50 text-gray-500">
                <th className="px-4 py-3 font-semibold">Proyek</th>
                <th className="px-4 py-3 font-semibold">Tanggal Investasi</th>
                <th className="px-4 py-3 font-semibold">Total Investasi</th>
                <th className="px-4 py-3 font-semibold">Imbal Hasil</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {investasiAktif.map((item, index) => (
                <tr key={index} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-[#17391f]">{item.proyek}</td>
                  <td className="px-4 py-3 text-gray-600">{item.tanggalInvestasi}</td>
                  <td className="px-4 py-3 font-semibold text-[#17391f]">{item.totalInvestasi}</td>
                  <td className="px-4 py-3 text-[#2D6A2D] font-bold">{item.imbalHasil}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="bg-[#f0f9f0] text-[#2D6A2D] border-none text-[9px] h-5">
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-neutral-50 text-center">
          <button className="text-[10px] font-bold text-[#2D6A2D] hover:underline">
            Lihat Semua Investasi →
          </button>
        </div>
      </div>
    </div>
  );
}
