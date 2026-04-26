import { INVESTASI_PORTOFOLIO_DUMMY } from "@/constants/investasi";
import { Badge } from "@/components/ui/badge";

export default function PortfolioSection() {
  const { summary, investasiAktif } = INVESTASI_PORTOFOLIO_DUMMY;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-[#17391f] md:text-xl">{INVESTASI_PORTOFOLIO_DUMMY.heading}</h2>
          <p className="mt-1 text-xs font-medium text-[#5d7a64] md:text-sm">{INVESTASI_PORTOFOLIO_DUMMY.subtext}</p>
        </div>
        <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
          Lihat Portofolio
          <span className="text-base">→</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#EAF3DE]/30 border border-[#EAF3DE] shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#5d7a64] mb-1">Total Investasi</p>
          <p className="text-sm font-extrabold text-[#17391f]">{summary.totalInvestasi}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#FAEEDA]/30 border border-[#FAEEDA] shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#BA7517] mb-1">Total Keuntungan</p>
          <p className="text-sm font-extrabold text-[#BA7517]">{summary.totalKeuntungan}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#E6F1FB]/30 border border-[#E6F1FB] shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#185FA5] mb-1">Proyek Aktif</p>
          <p className="text-sm font-extrabold text-[#17391f]">{summary.proyekAktif}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#F3E8FB]/30 border border-[#F3E8FB] shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B21A8] mb-1">Rata-rata Hasil</p>
          <p className="text-sm font-extrabold text-[#17391f]">{summary.imbalHasilRataRata}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 bg-slate-50/50">
          <h3 className="text-xs font-bold text-[#17391f]">Investasi Aktif</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-[#5d7a64]">
                <th className="px-4 py-3">Proyek</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Nominal</th>
                <th className="px-4 py-3">Hasil</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {investasiAktif.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-extrabold text-[#17391f]">{item.proyek}</td>
                  <td className="px-4 py-3 text-xs font-medium text-[#5d7a64]">{item.tanggalInvestasi}</td>
                  <td className="px-4 py-3 text-sm font-bold text-[#17391f]">{item.totalInvestasi}</td>
                  <td className="px-4 py-3 text-sm font-extrabold text-primary">{item.imbalHasil}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="bg-[#E1F5EE] text-[#0F6E56] border-none text-[10px] font-bold h-5">
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-slate-50 text-center">
          <button className="text-xs font-bold text-primary hover:underline cursor-pointer">
            Lihat Semua Investasi →
          </button>
        </div>
      </div>
    </div>
  );
}
