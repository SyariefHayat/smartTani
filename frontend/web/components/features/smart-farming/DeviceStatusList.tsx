'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, Battery, MapPin, Cpu } from 'lucide-react';
import { IoTDevice } from './types';

interface DeviceStatusListProps {
  devices: IoTDevice[];
}

export function DeviceStatusList({ devices }: DeviceStatusListProps) {
  return (
    <Card className="shadow-sm border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">Status Perangkat IoT</CardTitle>
          <Cpu className="h-5 w-5 text-slate-400" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {devices.map((device) => (
          <div key={device.id} className="flex flex-col gap-2 p-3 rounded-lg border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">{device.name}</span>
              <Badge
                variant={device.status === 'online' ? 'success' : 'destructive'}
                className="h-4 text-[10px]"
              >
                {device.status.toUpperCase()}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {device.location}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground justify-end">
                <Battery
                  className={`h-3 w-3 ${device.battery < 20 ? 'text-red-500' : 'text-green-500'}`}
                />
                {device.battery}%
              </div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Wifi className="h-3 w-3 text-blue-500" />
                Signal: {device.signal}%
              </div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground justify-end italic">
                ID: {device.id}
              </div>
            </div>
            <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full bg-blue-500`} style={{ width: `${device.signal}%` }} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
