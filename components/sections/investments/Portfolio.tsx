import { INVESTMENT_PORTFOLIO_DUMMY } from "@/constants/investments";
import { Badge } from "@/components/ui/badge";

export default function Portfolio() {
  const { summary, investasiAktif } = INVESTMENT_PORTFOLIO_DUMMY;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#17391f]">{INVESTMENT_PORTFOLIO_DUMMY.heading}</h2>
          <p className="text-sm font-medium text-[#5d7a64]">{INVESTMENT_PORTFOLIO_DUMMY.subtext}</p>
        </div>
        <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
          Lihat Portofolio
          <span className="text-lg">→</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#EAF3DE]/60 border border-[#d4edda] shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5d7a64] mb-1">Total Investasi</p>
          <p className="text-lg font-extrabold text-[#17391f]">{summary.totalInvestasi}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#FAEEDA]/60 border border-[#f3e1c4] shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5d7a64] mb-1">Total Keuntungan</p>
          <p className="text-lg font-extrabold text-primary">{summary.totalKeuntungan}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#E6F1FB]/60 border border-[#d1e4f7] shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5d7a64] mb-1">Proyek Aktif</p>
          <p className="text-lg font-extrabold text-[#17391f]">{summary.proyekAktif}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#F3E8FB]/60 border border-[#e2d1f3] shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5d7a64] mb-1">Imbal Hasil Rata-rata</p>
          <p className="text-lg font-extrabold text-[#17391f]">{summary.imbalHasilRataRata}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/30">
          <h3 className="text-sm font-extrabold text-[#17391f]">Investasi Aktif</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-[#5d7a64]">
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Proyek</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Tanggal Investasi</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Total Investasi</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Imbal Hasil</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {investasiAktif.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-extrabold text-[#17391f]">{item.proyek}</td>
                  <td className="px-4 py-3 text-[#5d7a64] font-medium">{item.tanggalInvestasi}</td>
                  <td className="px-4 py-3 font-bold text-[#17391f]">{item.totalInvestasi}</td>
                  <td className="px-4 py-3 text-primary font-extrabold">{item.imbalHasil}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="bg-[#EAF3DE] text-primary border-none text-[10px] font-bold h-5">
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-slate-50/50 text-center">
          <button className="text-xs font-bold text-primary hover:underline">
            Lihat Semua Investasi →
          </button>
        </div>
      </div>
    </div>
  );
}

