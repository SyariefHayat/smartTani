import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Review = {
  initials: string;
  name: string;
  date: string;
  rating: number;
  comment: string;
  product: string;
  avatarColor: string;
  textColor: string;
};

const reviews: Review[] = [
  {
    initials: "AR",
    name: "Andi Rahmawan",
    date: "2 hari lalu",
    rating: 5,
    comment:
      "Kemeja batiknya bagus banget, bahan adem dan jahitan rapi. Pengiriman cepat, packing aman. Recommended!",
    product: "Kemeja Batik Slim Fit",
    avatarColor: "bg-violet-100",
    textColor: "text-violet-800",
  },
  {
    initials: "DS",
    name: "Dewi Susanti",
    date: "5 hari lalu",
    rating: 4,
    comment:
      "Celana chinonya premium, sesuai deskripsi. Ukuran sedikit lebih besar dari biasanya tapi overall puas.",
    product: "Celana Chino Premium",
    avatarColor: "bg-teal-100",
    textColor: "text-teal-800",
  },
  {
    initials: "BP",
    name: "Bagus Pratama",
    date: "1 minggu lalu",
    rating: 5,
    comment:
      "Sepatu kulitnya keren, kualitas sangat baik untuk harganya. Sudah pakai ke kantor, banyak yang nanya.",
    product: "Sepatu Kulit Formal",
    avatarColor: "bg-orange-100",
    textColor: "text-orange-800",
  },
];

const ratingBreakdown = [
  { star: 5, pct: 68 },
  { star: 4, pct: 21 },
  { star: 3, pct: 7 },
  { star: 2, pct: 3 },
  { star: 1, pct: 1 },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={s <= rating ? "text-amber-400" : "text-muted-foreground"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

const CustomerReviews = ({ className }: { className?: string }) => {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Ulasan pelanggan</p>
            <p className="text-xs text-muted-foreground">128 ulasan total</p>
          </div>
          <span className="text-xs bg-amber-50 text-amber-800 px-2 py-1 rounded-md">
            Toko terverifikasi
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Rating summary */}
        <div className="flex gap-5 items-center bg-muted/40 rounded-lg p-4">
          <div className="text-center shrink-0">
            <div className="text-4xl font-medium">4.6</div>
            <StarRow rating={5} />
            <p className="text-xs text-muted-foreground mt-1">dari 5</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {ratingBreakdown.map(({ star, pct }) => (
              <div
                key={star}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <span className="w-2 text-right">{star}</span>
                <span className="text-amber-400 text-[11px]">★</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-7">{pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review list */}
        <div className="divide-y">
          {reviews.map((r) => (
            <div key={r.name} className="py-3 first:pt-0 last:pb-0">
              <div className="flex gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${r.avatarColor} ${r.textColor}`}
                >
                  {r.initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{r.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {r.date}
                    </span>
                  </div>
                  <StarRow rating={r.rating} />
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {r.comment}
                  </p>
                  <span className="text-[11px] bg-muted px-2 py-0.5 rounded mt-1.5 inline-block">
                    {r.product}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full text-sm text-muted-foreground border rounded-md py-2 hover:bg-muted transition-colors">
          Lihat semua ulasan
        </button>
      </CardContent>
    </Card>
  );
};

export default CustomerReviews;
