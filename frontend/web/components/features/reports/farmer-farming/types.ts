export interface FarmingReport {
  id: string;
  period: string;
  landName: string;
  cropType: string;
  healthScore: number;
  expectedYield: number;
  actualYield?: number;
  status: 'Draft' | 'Final' | 'Archived';
  createdAt: string;
}

export interface FarmingStats {
  totalLandArea: number;
  activeCropCount: number;
  averageHealthScore: number;
  projectedHarvestVal: number;
}
