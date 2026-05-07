"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { isWithinInterval, parseISO } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useDateRange } from "@/context/dateRange";

const chartData = [
  { date: "2026-01-01", pendapatan: 2200000, pengeluaran: 1500000 },
  { date: "2026-01-02", pendapatan: 970000, pengeluaran: 1800000 },
  { date: "2026-01-03", pendapatan: 1670000, pengeluaran: 1200000 },
  { date: "2026-01-04", pendapatan: 2420000, pengeluaran: 2600000 },
  { date: "2026-01-05", pendapatan: 3730000, pengeluaran: 2900000 },
  { date: "2026-01-06", pendapatan: 3010000, pengeluaran: 3400000 },
  { date: "2026-01-07", pendapatan: 2450000, pengeluaran: 1800000 },
  { date: "2026-01-08", pendapatan: 4090000, pengeluaran: 3200000 },
  { date: "2026-01-09", pendapatan: 590000, pengeluaran: 1100000 },
  { date: "2026-01-10", pendapatan: 2610000, pengeluaran: 1900000 },
  { date: "2026-01-11", pendapatan: 3270000, pengeluaran: 3500000 },
  { date: "2026-01-12", pendapatan: 2920000, pengeluaran: 2100000 },
  { date: "2026-01-13", pendapatan: 3420000, pengeluaran: 3800000 },
  { date: "2026-01-14", pendapatan: 1370000, pengeluaran: 2200000 },
  { date: "2026-01-15", pendapatan: 1200000, pengeluaran: 1700000 },
  { date: "2026-01-16", pendapatan: 1380000, pengeluaran: 1900000 },
  { date: "2026-01-17", pendapatan: 4460000, pengeluaran: 3600000 },
  { date: "2026-01-18", pendapatan: 3640000, pengeluaran: 4100000 },
  { date: "2026-01-19", pendapatan: 2430000, pengeluaran: 1800000 },
  { date: "2026-01-20", pendapatan: 890000, pengeluaran: 1500000 },
  { date: "2026-01-21", pendapatan: 1370000, pengeluaran: 2000000 },
  { date: "2026-01-22", pendapatan: 2240000, pengeluaran: 1700000 },
  { date: "2026-01-23", pendapatan: 1380000, pengeluaran: 2300000 },
  { date: "2026-01-24", pendapatan: 3870000, pengeluaran: 2900000 },
  { date: "2026-01-25", pendapatan: 2150000, pengeluaran: 2500000 },
  { date: "2026-01-26", pendapatan: 750000, pengeluaran: 1300000 },
  { date: "2026-01-27", pendapatan: 3830000, pengeluaran: 4200000 },
  { date: "2026-01-28", pendapatan: 1220000, pengeluaran: 1800000 },
  { date: "2026-01-29", pendapatan: 3150000, pengeluaran: 2400000 },
  { date: "2026-01-30", pendapatan: 4540000, pengeluaran: 3800000 },

  // Mei 2026
  { date: "2026-05-01", pendapatan: 1650000, pengeluaran: 2200000 },
  { date: "2026-05-02", pendapatan: 2930000, pengeluaran: 3100000 },
  { date: "2026-05-03", pendapatan: 2470000, pengeluaran: 1900000 },
  { date: "2026-05-04", pendapatan: 3850000, pengeluaran: 4200000 },
  { date: "2026-05-05", pendapatan: 4810000, pengeluaran: 3900000 },
  { date: "2026-05-06", pendapatan: 4980000, pengeluaran: 5200000 },
  { date: "2026-05-07", pendapatan: 3880000, pengeluaran: 3000000 },
  { date: "2026-05-08", pendapatan: 1490000, pengeluaran: 2100000 },
  { date: "2026-05-09", pendapatan: 2270000, pengeluaran: 1800000 },
  { date: "2026-05-10", pendapatan: 2930000, pengeluaran: 3300000 },
  { date: "2026-05-11", pendapatan: 3350000, pengeluaran: 2700000 },
  { date: "2026-05-12", pendapatan: 1970000, pengeluaran: 2400000 },
  { date: "2026-05-13", pendapatan: 1970000, pengeluaran: 1600000 },
  { date: "2026-05-14", pendapatan: 4480000, pengeluaran: 4900000 },
  { date: "2026-05-15", pendapatan: 4730000, pengeluaran: 3800000 },
  { date: "2026-05-16", pendapatan: 3380000, pengeluaran: 4000000 },
  { date: "2026-05-17", pendapatan: 4990000, pengeluaran: 4200000 },
  { date: "2026-05-18", pendapatan: 3150000, pengeluaran: 3500000 },
  { date: "2026-05-19", pendapatan: 2350000, pengeluaran: 1800000 },
  { date: "2026-05-20", pendapatan: 1770000, pengeluaran: 2300000 },
  { date: "2026-05-21", pendapatan: 820000, pengeluaran: 1400000 },
  { date: "2026-05-22", pendapatan: 810000, pengeluaran: 1200000 },
  { date: "2026-05-23", pendapatan: 2520000, pengeluaran: 2900000 },
  { date: "2026-05-24", pendapatan: 2940000, pengeluaran: 2200000 },
  { date: "2026-05-25", pendapatan: 2010000, pengeluaran: 2500000 },
  { date: "2026-05-26", pendapatan: 2130000, pengeluaran: 1700000 },
  { date: "2026-05-27", pendapatan: 4200000, pengeluaran: 4600000 },
  { date: "2026-05-28", pendapatan: 2330000, pengeluaran: 1900000 },
  { date: "2026-05-29", pendapatan: 780000, pengeluaran: 1300000 },
  { date: "2026-05-30", pendapatan: 3400000, pengeluaran: 2800000 },
  { date: "2026-05-31", pendapatan: 1780000, pengeluaran: 2300000 },

  // Juni 2026
  { date: "2026-06-01", pendapatan: 1780000, pengeluaran: 2000000 },
  { date: "2026-06-02", pendapatan: 4700000, pengeluaran: 4100000 },
  { date: "2026-06-03", pendapatan: 1030000, pengeluaran: 1600000 },
  { date: "2026-06-04", pendapatan: 4390000, pengeluaran: 3800000 },
  { date: "2026-06-05", pendapatan: 880000, pengeluaran: 1400000 },
  { date: "2026-06-06", pendapatan: 2940000, pengeluaran: 2500000 },
  { date: "2026-06-07", pendapatan: 3230000, pengeluaran: 3700000 },
  { date: "2026-06-08", pendapatan: 3850000, pengeluaran: 3200000 },
  { date: "2026-06-09", pendapatan: 4380000, pengeluaran: 4800000 },
  { date: "2026-06-10", pendapatan: 1550000, pengeluaran: 2000000 },
  { date: "2026-06-11", pendapatan: 920000, pengeluaran: 1500000 },
  { date: "2026-06-12", pendapatan: 4920000, pengeluaran: 4200000 },
  { date: "2026-06-13", pendapatan: 810000, pengeluaran: 1300000 },
  { date: "2026-06-14", pendapatan: 4260000, pengeluaran: 3800000 },
  { date: "2026-06-15", pendapatan: 3070000, pengeluaran: 3500000 },
  { date: "2026-06-16", pendapatan: 3710000, pengeluaran: 3100000 },
  { date: "2026-06-17", pendapatan: 4750000, pengeluaran: 5200000 },
  { date: "2026-06-18", pendapatan: 1070000, pengeluaran: 1700000 },
  { date: "2026-06-19", pendapatan: 3410000, pengeluaran: 2900000 },
  { date: "2026-06-20", pendapatan: 4080000, pengeluaran: 4500000 },
  { date: "2026-06-21", pendapatan: 1690000, pengeluaran: 2100000 },
  { date: "2026-06-22", pendapatan: 3170000, pengeluaran: 2700000 },
  { date: "2026-06-23", pendapatan: 4800000, pengeluaran: 5300000 },
  { date: "2026-06-24", pendapatan: 1320000, pengeluaran: 1800000 },
  { date: "2026-06-25", pendapatan: 1410000, pengeluaran: 1900000 },
  { date: "2026-06-26", pendapatan: 4340000, pengeluaran: 3800000 },
  { date: "2026-06-27", pendapatan: 4480000, pengeluaran: 4900000 },
  { date: "2026-06-28", pendapatan: 1490000, pengeluaran: 2000000 },
  { date: "2026-06-29", pendapatan: 1030000, pengeluaran: 1600000 },
  { date: "2026-06-30", pendapatan: 4460000, pengeluaran: 4000000 },
];

const chartConfig = {
  pendapatan: {
    label: "Pendapatan",
    color: "var(--chart-2)",
  },
  pengeluaran: {
    label: "Pengeluaran",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type ChartKey = "pendapatan" | "pengeluaran";

export function ChartBarInteractive() {
  const { date } = useDateRange();
  const [activeChart, setActiveChart] = React.useState<ChartKey>("pendapatan");

  const filteredData = React.useMemo(() => {
    if (!date?.from) return chartData;
    return chartData.filter((item) => {
      const itemDate = parseISO(item.date);
      if (date.from && date.to) {
        return isWithinInterval(itemDate, { start: date.from, end: date.to });
      }
      return itemDate >= date.from!;
    });
  }, [date]);

  const total = React.useMemo(
    () => ({
      pendapatan: filteredData.reduce((acc, curr) => acc + curr.pendapatan, 0),
      pengeluaran: filteredData.reduce(
        (acc, curr) => acc + curr.pengeluaran,
        0,
      ),
    }),
    [filteredData],
  );

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
          <CardTitle className="font-semibold lg:text-xl">
            Grafik Pendapatan
          </CardTitle>
          <CardDescription>
            Menampilkan total pendapatan dan pengeluaran sesuai rentang tanggal
          </CardDescription>
        </div>
        <div className="flex">
          {(["pendapatan", "pengeluaran"] as ChartKey[]).map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActiveChart(key)}
            >
              <span className="text-xs text-muted-foreground">
                {chartConfig[key].label}
              </span>
              <span className="text-base leading-none font-bold sm:text-2xl">
                {formatRupiah(total[key])}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-62.5 w-full"
        >
          <BarChart
            accessibilityLayer
            data={filteredData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("id-ID", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-44"
                  nameKey={activeChart}
                  formatter={(value) => formatRupiah(value as number)}
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("id-ID", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill={`var(--color-${activeChart})`}
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
