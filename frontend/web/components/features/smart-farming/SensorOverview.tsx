'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Thermometer, CloudRain, Wind, Activity } from 'lucide-react';
import { SensorData } from './types';

interface SensorOverviewProps {
  sensors: SensorData[];
}

export function SensorOverview({ sensors }: SensorOverviewProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'moisture':
        return Droplets;
      case 'temperature':
        return Thermometer;
      case 'humidity':
        return CloudRain;
      case 'ph':
        return Activity;
      case 'light':
        return Wind;
      default:
        return Activity;
    }
  };

  const getColorClass = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-600';
      case 'low':
        return 'text-orange-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {sensors.map((sensor) => {
        const Icon = getIcon(sensor.type);
        return (
          <Card key={sensor.id} className="overflow-hidden border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{sensor.name}</CardTitle>
              <Icon className={`h-4 w-4 ${getColorClass(sensor.status)}`} />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{sensor.value}</span>
                <span className="text-sm text-muted-foreground font-medium">{sensor.unit}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase ${getColorClass(sensor.status)}`}>
                  {sensor.status === 'normal'
                    ? 'Kondisi Baik'
                    : sensor.status === 'low'
                      ? 'Terlalu Rendah'
                      : 'Terlalu Tinggi'}
                </span>
                <span className="text-[10px] text-muted-foreground">Update: 2m ago</span>
              </div>
              <div className="mt-3 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${sensor.status === 'normal' ? 'bg-green-500' : sensor.status === 'low' ? 'bg-orange-500' : 'bg-red-500'}`}
                  style={{
                    width: `${Math.min(100, (sensor.value / (sensor.type === 'ph' ? 14 : 100)) * 100)}%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
