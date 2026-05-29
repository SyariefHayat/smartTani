'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Play, Square, Timer, Waves, Zap } from 'lucide-react';
import { AutomationTask } from './types';
import { cn } from '@/lib/utils';

interface AutomationControlProps {
  tasks: AutomationTask[];
}

export function AutomationControl({ tasks }: AutomationControlProps) {
  return (
    <Card className="col-span-1 border border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-800">
              Otomatisasi & Kontrol
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Atur jadwal penyiraman dan pemupukan otomatis.
            </CardDescription>
          </div>
          <div className="p-2 rounded-lg bg-blue-50 text-blue-500">
            <Zap className="h-4.5 w-4.5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-3.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'p-2.5 rounded-full shrink-0',
                  task.isEnabled
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-slate-200/60 text-slate-400'
                )}
              >
                {task.type === 'irrigation' ? (
                  <Waves className="h-4 w-4" />
                ) : (
                  <Timer className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{task.name}</p>
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  {task.status === 'active' ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.2 text-[9px] font-bold text-emerald-700 uppercase tracking-wider">
                      <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                      Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.2 text-[9px] font-bold text-slate-600 uppercase tracking-wider">
                      <span className="h-1 w-1 rounded-full bg-slate-450" />
                      Menunggu
                    </span>
                  )}
                  <span className="text-[10px] font-medium text-slate-400 truncate">
                    {task.config}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400">
                  {task.isEnabled ? 'ON' : 'OFF'}
                </span>
                <Switch checked={task.isEnabled} className="cursor-pointer" />
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 hover:bg-slate-100 cursor-pointer text-slate-500 rounded-full shrink-0"
              >
                {task.status === 'active' ? (
                  <Square className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                ) : (
                  <Play className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600" />
                )}
              </Button>
            </div>
          </div>
        ))}
        <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold cursor-pointer h-9 mt-1">
          Konfigurasi Semua Jadwal
        </Button>
      </CardContent>
    </Card>
  );
}
