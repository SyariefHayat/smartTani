export type LandStatus = 'cultivating' | 'harvested' | 'fallow' | 'preparing';

export interface CropInfo {
  name: string;
  plantingDate: string;
  estimatedHarvestDate: string;
  expectedYield: number; // in kg/ton
}

export interface FarmerLand {
  id: string;
  name: string;
  location: string;
  areaHa: number;
  soilType: string;
  status: LandStatus;
  activeCrop?: CropInfo;
}
