'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Thermometer, Sun, Gauge, Activity } from 'lucide-react';
import { SensorData } from './types';
import { cn } from '@/lib/utils';

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
      case 'ph':
        return Activity;
      case 'light':
        return Sun;
      default:
        return Gauge;
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'normal':
        return {
          label: 'Kondisi Baik',
          badgeClass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
          dotClass: 'bg-emerald-500',
          progressClass: 'bg-emerald-500',
        };
      case 'low':
        return {
          label: 'Rendah',
          badgeClass: 'border-amber-200 bg-amber-50 text-amber-700',
          dotClass: 'bg-amber-500 animate-pulse',
          progressClass: 'bg-amber-500',
        };
      case 'high':
        return {
          label: 'Tinggi',
          badgeClass: 'border-rose-200 bg-rose-50 text-rose-700',
          dotClass: 'bg-rose-500 animate-pulse',
          progressClass: 'bg-rose-500',
        };
      default:
        return {
          label: 'N/A',
          badgeClass: 'border-slate-200 bg-slate-50 text-slate-600',
          dotClass: 'bg-slate-400',
          progressClass: 'bg-slate-400',
        };
    }
  };

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {sensors.map((sensor) => {
        const Icon = getIcon(sensor.type);
        const config = getStatusConfig(sensor.status);

        return (
          <Card
            key={sensor.id}
            className="overflow-hidden border border-slate-200 bg-white transition-all duration-300 hover:shadow-md hover:border-emerald-300 hover:-translate-y-0.5"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 truncate mr-2">
                {sensor.name}
              </CardTitle>
              <div
                className={cn(
                  'p-1.5 rounded-md',
                  sensor.status === 'normal'
                    ? 'bg-emerald-50 text-emerald-600'
                    : sensor.status === 'low'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-rose-50 text-rose-600'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
              </div>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight text-slate-800">
                  {sensor.value}
                </span>
                <span className="text-xs font-semibold text-slate-500">{sensor.unit}</span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase',
                    config.badgeClass
                  )}
                >
                  <span className={cn('h-1 w-1 rounded-full', config.dotClass)} />
                  {config.label}
                </span>
                <span className="text-[10px] font-medium text-slate-400">2m ago</span>
              </div>

              {/* Progress bar representing sensor level */}
              <div className="mt-3.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    config.progressClass
                  )}
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
