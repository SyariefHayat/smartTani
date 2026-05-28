'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

export interface AdminStatItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  color?: string; // Text color of icon
  bgColor?: string; // Background color of icon
  link?: string;
}

interface AdminStatsCardsProps {
  stats: AdminStatItem[];
  loading?: boolean;
}

export function AdminStatsCards({ stats, loading = false }: AdminStatsCardsProps) {
  return (
    <div className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => {
        const IconComponent = stat.icon;
        const CardWrapper = ({ children }: { children: React.ReactNode }) => {
          if (stat.link) {
            return (
              <Link href={stat.link} className="block transition-transform hover:-translate-y-0.5">
                <Card className="border-slate-200 bg-white rounded-2xl shadow-sm hover:shadow-md cursor-pointer h-full">
                  {children}
                </Card>
              </Link>
            );
          }
          return (
            <Card className="border-slate-200 bg-white rounded-2xl shadow-sm h-full">
              {children}
            </Card>
          );
        };

        return (
          <CardWrapper key={idx}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-5">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                {stat.label}
              </CardTitle>
              <div className={`p-2 rounded-xl ${stat.bgColor || 'bg-slate-50'}`}>
                <IconComponent className={`h-4 w-4 ${stat.color || 'text-slate-500'}`} />
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-7 w-24 bg-slate-100 rounded-lg animate-pulse" />
                  <div className="h-3 w-32 bg-slate-100 rounded-md animate-pulse" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-slate-800 tracking-tight">
                    {stat.value}
                  </div>
                  {stat.description && (
                    <p className="text-[10px] font-semibold text-slate-400 mt-1">
                      {stat.description}
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </CardWrapper>
        );
      })}
    </div>
  );
}
