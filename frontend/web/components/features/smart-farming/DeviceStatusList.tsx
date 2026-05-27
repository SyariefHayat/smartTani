'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wifi, Battery, MapPin, Cpu, SignalHigh } from 'lucide-react';
import { IoTDevice } from './types';
import { cn } from '@/lib/utils';

interface DeviceStatusListProps {
  devices: IoTDevice[];
}

export function DeviceStatusList({ devices }: DeviceStatusListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-250 bg-emerald-50 px-2 py-0.2 text-[9px] font-bold text-emerald-700 uppercase tracking-wider">
            <span className="h-1.2 w-1.2 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-250 bg-amber-50 px-2 py-0.2 text-[9px] font-bold text-amber-700 uppercase tracking-wider">
            <span className="h-1.2 w-1.2 rounded-full bg-amber-500 animate-pulse" />
            Warning
          </span>
        );
      case 'offline':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-250 bg-rose-50 px-2 py-0.2 text-[9px] font-bold text-rose-700 uppercase tracking-wider">
            <span className="h-1.2 w-1.2 rounded-full bg-rose-450" />
            Offline
          </span>
        );
    }
  };

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-800">
              Status Perangkat IoT
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Daftar node sensor dan kontroler terhubung.
            </CardDescription>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 text-slate-500">
            <Cpu className="h-4.5 w-4.5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {devices.map((device) => (
          <div
            key={device.id}
            className="flex flex-col gap-2.5 p-3.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors duration-200"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-slate-800 truncate">{device.name}</span>
              <div className="shrink-0">{getStatusBadge(device.status)}</div>
            </div>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-1">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{device.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 justify-end">
                <Battery
                  className={cn(
                    'h-3.5 w-3.5 shrink-0',
                    device.battery <= 20 ? 'text-rose-500 animate-bounce' : 'text-emerald-500'
                  )}
                />
                <span>{device.battery}%</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                <Wifi className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                <span className="truncate">Sinyal: {device.signal}%</span>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-mono font-semibold text-slate-400 justify-end">
                ID: {device.id}
              </div>
            </div>
            <div className="mt-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  device.status === 'online' ? 'bg-blue-500' : 'bg-slate-300'
                )}
                style={{ width: `${device.signal}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
