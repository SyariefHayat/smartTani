'use client';

import * as React from 'react';
import { SmartFarmingHeader } from './SmartFarmingHeader';
import { SensorOverview } from './SensorOverview';
import { AutomationControl } from './AutomationControl';
import { DeviceStatusList } from './DeviceStatusList';
import { SensorData, AutomationTask, IoTDevice } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Sun, Droplets, Wind, Activity } from 'lucide-react';

const MOCK_SENSORS: SensorData[] = [
  {
    id: '1',
    name: 'Kelembaban Tanah',
    type: 'moisture',
    value: 45,
    unit: '%',
    status: 'normal',
    lastReading: '2024-05-16T10:00:00Z',
  },
  {
    id: '2',
    name: 'Suhu Udara',
    type: 'temperature',
    value: 28.5,
    unit: '°C',
    status: 'normal',
    lastReading: '2024-05-16T10:00:00Z',
  },
  {
    id: '3',
    name: 'pH Tanah',
    type: 'ph',
    value: 6.2,
    unit: 'pH',
    status: 'normal',
    lastReading: '2024-05-16T10:00:00Z',
  },
  {
    id: '4',
    name: 'Intensitas Cahaya',
    type: 'light',
    value: 850,
    unit: 'lux',
    status: 'high',
    lastReading: '2024-05-16T10:00:00Z',
  },
];

const MOCK_TASKS: AutomationTask[] = [
  {
    id: '1',
    name: 'Penyiraman Otomatis',
    type: 'irrigation',
    isEnabled: true,
    status: 'active',
    config: 'Moisture < 40%',
  },
  {
    id: '2',
    name: 'Pemupukan Cair',
    type: 'fertilizer',
    isEnabled: false,
    status: 'idle',
    config: 'Setiap Senin 08:00',
  },
  {
    id: '3',
    name: 'Penyemprotan Hama',
    type: 'irrigation',
    isEnabled: true,
    status: 'scheduled',
    config: 'Interval 3 hari',
  },
];

const MOCK_DEVICES: IoTDevice[] = [
  {
    id: 'DEV-991',
    name: 'Node Sensor Lahan A',
    location: 'Blok Utara',
    status: 'online',
    battery: 85,
    signal: 92,
  },
  {
    id: 'DEV-992',
    name: 'Gateway Utama',
    location: 'Rumah Pompa',
    status: 'online',
    battery: 100,
    signal: 98,
  },
  {
    id: 'DEV-993',
    name: 'Node Sensor Lahan B',
    location: 'Blok Selatan',
    status: 'warning',
    battery: 15,
    signal: 45,
  },
];

export function SmartFarmingManagement() {
  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-6">
        <SmartFarmingHeader />

        <SensorOverview sensors={MOCK_SENSORS} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <AutomationControl tasks={MOCK_TASKS} />

            {/* Weather Card Placeholder */}
            <Card className="shadow-sm border-none bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Prakiraan Cuaca</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Sun className="h-12 w-12 text-yellow-300" />
                    <div>
                      <div className="text-3xl font-bold">31°C</div>
                      <div className="text-sm opacity-90">Cerah Berawan • Lamongan, Jatim</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Droplets className="h-4 w-4" /> 15% Hujan
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Wind className="h-4 w-4" /> 12 km/h
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Cloud className="h-4 w-4" /> 40% Awan
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="h-4 w-4" /> UV: Sedang
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <DeviceStatusList devices={MOCK_DEVICES} />

            <Card className="shadow-sm border-none">
              <CardHeader>
                <CardTitle className="text-sm font-bold">Log Aktivitas Terbaru</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0 text-xs">
                  {[
                    { time: '10:05', msg: 'Pompa Blok A dinyalakan otomatis' },
                    { time: '09:30', msg: 'Sensor Moisture Lahan B mencapai batas bawah' },
                    { time: '08:00', msg: 'Sistem Sinkronisasi Berhasil' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 border-t">
                      <span className="font-mono text-muted-foreground whitespace-nowrap">
                        {log.time}
                      </span>
                      <span className="truncate">{log.msg}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
