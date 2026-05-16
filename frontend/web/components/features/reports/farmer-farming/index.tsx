'use client';

import * as React from 'react';
import { FarmingReportHeader } from './FarmingReportHeader';
import { FarmingReportStats } from './FarmingReportStats';
import { FarmingTrendsChart } from './FarmingTrendsChart';
import { LandDistributionChart } from './LandDistributionChart';
import { RecentFarmingReports } from './RecentFarmingReports';

export function FarmingReportsManagement() {
  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-6">
        <FarmingReportHeader />
        <FarmingReportStats />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <FarmingTrendsChart />
          </div>
          <div>
            <LandDistributionChart />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Laporan Historis</h2>
          </div>
          <RecentFarmingReports />
        </div>
      </div>
    </div>
  );
}
