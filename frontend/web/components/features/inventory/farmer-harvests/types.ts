export type HarvestQuality = 'A' | 'B' | 'C';

export interface FarmerHarvest {
  id: string;
  farmer_id: string;
  land_id: string;
  crop_name: string;
  quantity: number;
  unit: string;
  harvest_date: string;
  quality_grade: HarvestQuality;
  notes?: string;
  created_at: string;
  updated_at: string;
  land?: {
    id: string;
    name: string;
  };
}
