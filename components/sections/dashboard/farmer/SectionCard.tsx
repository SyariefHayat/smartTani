import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

type CardData = {
  title: string;
  value: string;
  percentage: string;
  trend: "up" | "down";
};

const cards: CardData[] = [
  {
    title: "Total Saldo",
    value: "18.500.000",
    percentage: "3,6%",
    trend: "up",
  },
  {
    title: "Total Pendapatan",
    value: "24.750.000",
    percentage: "2,6%",
    trend: "up",
  },
  {
    title: "Total Pengeluaran",
    value: "6.250.000",
    percentage: "3,6%",
    trend: "down",
  },
  {
    title: "Total Pajak (PPN)",
    value: "2.750.000",
    percentage: "1,2%",
    trend: "up",
  },
];

const SectionCard = () => {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      {cards.map((card) => {
        const isUp = card.trend === "up";
        const colorClass = isUp ? "text-green-500" : "text-red-500";
        const Icon = isUp ? ArrowUp : ArrowDown;

        return (
          <Card key={card.title} className="min-w-0">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs">
                {card.title}
              </CardDescription>
              <CardTitle
                className="truncate text-xl font-semibold tabular-nums lg:text-2xl"
                title={card.value} // tooltip saat hover jika terpotong
              >
                {card.value}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                <Icon className={`size-4 shrink-0 ${colorClass}`} />
                <span className="truncate">
                  <span className={colorClass}>{card.percentage}</span>
                  {" dari bulan lalu"}
                </span>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default SectionCard;
