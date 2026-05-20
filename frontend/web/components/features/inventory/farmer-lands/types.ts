export type LandStatus = 'active' | 'fallow' | 'rented';

export interface FarmerLand {
  id: string;
  farmer_id: string;
  name: string;
  location_province: string;
  location_city: string;
  location_district: string;
  full_address: string;
  area_ha: number;
  soil_type?: string;
  status: LandStatus;
  current_crop?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
