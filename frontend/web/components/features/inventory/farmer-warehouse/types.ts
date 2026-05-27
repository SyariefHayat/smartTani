export type WarehouseType = 'Cold Storage' | 'Dry Storage' | 'Silo' | 'Open Yard';
export type WarehouseStatus = 'active' | 'full' | 'maintenance' | 'inactive';

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  type: WarehouseType;
  capacity: number; // in percentage (0-100)
  totalItems: number;
  lastUpdate: string;
  status: WarehouseStatus;
}

export interface WarehouseTableActions {
  onViewDetail: (warehouse: Warehouse) => void;
  onEdit: (warehouse: Warehouse) => void;
  onDelete: (warehouse: Warehouse) => void;
}
