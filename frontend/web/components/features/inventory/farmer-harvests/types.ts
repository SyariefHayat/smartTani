export type HarvestStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
export type HarvestQuality = 'A' | 'B' | 'C' | 'D' | 'pending';

export interface FarmerHarvest {
  id: string;
  landId: string;
  landName: string;
  cropName: string;
  harvestDate: string;
  actualYield?: number;
  expectedYield: number;
  unit: string;
  status: HarvestStatus;
  quality: HarvestQuality;
  notes?: string;
}
