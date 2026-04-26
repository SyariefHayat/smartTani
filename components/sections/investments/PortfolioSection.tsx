import { INVESTMENT_PORTFOLIO_DUMMY } from "@/constants/investments";
import { Badge } from "@/components/ui/badge";

export default function PortfolioSection() {
  const { summary, investasiAktif } = INVESTMENT_PORTFOLIO_DUMMY;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-heading-3 text-foreground">{INVESTMENT_PORTFOLIO_DUMMY.heading}</h2>
          <p className="text-caption text-muted-foreground">{INVESTMENT_PORTFOLIO_DUMMY.subtext}</p>
        </div>
        <button className="text-caption font-semibold text-primary hover:underline flex items-center gap-1">
          Lihat Portofolio
          <span className="text-lg">→</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <p className="text-caption text-muted-foreground mb-1">Total Investasi</p>
          <p className="text-body-sm font-bold text-foreground">{summary.totalInvestasi}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <p className="text-caption text-muted-foreground mb-1">Total Keuntungan</p>
          <p className="text-body-sm font-bold text-primary">{summary.totalKeuntungan}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <p className="text-caption text-muted-foreground mb-1">Proyek Aktif</p>
          <p className="text-body-sm font-bold text-foreground">{summary.proyekAktif}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <p className="text-caption text-muted-foreground mb-1">Imbal Hasil Rata-rata</p>
          <p className="text-body-sm font-bold text-foreground">{summary.imbalHasilRataRata}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50">
          <h3 className="text-caption font-bold text-foreground">Investasi Aktif</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-caption">
            <thead>
              <tr className="bg-slate-50 text-muted-foreground">
                <th className="px-4 py-3 font-semibold">Proyek</th>
                <th className="px-4 py-3 font-semibold">Tanggal Investasi</th>
                <th className="px-4 py-3 font-semibold">Total Investasi</th>
                <th className="px-4 py-3 font-semibold">Imbal Hasil</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {investasiAktif.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-foreground">{item.proyek}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.tanggalInvestasi}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">{item.totalInvestasi}</td>
                  <td className="px-4 py-3 text-primary font-bold">{item.imbalHasil}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="bg-primary-light text-primary border-none text-caption h-5">
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-slate-50 text-center">
          <button className="text-caption font-bold text-primary hover:underline">
            Lihat Semua Investasi →
          </button>
        </div>
      </div>
    </div>
  );
}

