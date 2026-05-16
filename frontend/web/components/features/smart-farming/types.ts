export type DeviceStatus = 'online' | 'offline' | 'warning';

export interface SensorData {
  id: string;
  name: string;
  type: 'moisture' | 'temperature' | 'humidity' | 'ph' | 'light';
  value: number;
  unit: string;
  status: 'normal' | 'low' | 'high';
  lastReading: string;
}

export interface AutomationTask {
  id: string;
  name: string;
  type: 'irrigation' | 'fertilizer' | 'lighting';
  isEnabled: boolean;
  status: 'idle' | 'active' | 'scheduled';
  lastRun?: string;
  nextRun?: string;
  config: string;
}

export interface IoTDevice {
  id: string;
  name: string;
  location: string;
  status: DeviceStatus;
  battery: number;
  signal: number;
}
