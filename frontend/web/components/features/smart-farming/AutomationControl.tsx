'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Play, Square, Timer, Waves } from 'lucide-react';
import { AutomationTask } from './types';

interface AutomationControlProps {
  tasks: AutomationTask[];
}

export function AutomationControl({ tasks }: AutomationControlProps) {
  return (
    <Card className="col-span-1 shadow-sm border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Otomatisasi & Kontrol</CardTitle>
            <CardDescription>Atur jadwal penyiraman dan pemupukan otomatis.</CardDescription>
          </div>
          <Waves className="h-5 w-5 text-blue-500" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-3 rounded-lg border bg-slate-50/50"
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${task.isEnabled ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}
              >
                {task.type === 'irrigation' ? (
                  <Waves className="h-4 w-4" />
                ) : (
                  <Timer className="h-4 w-4" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold">{task.name}</p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={task.status === 'active' ? 'success' : 'outline'}
                    className="text-[10px] h-4"
                  >
                    {task.status === 'active' ? 'Sedang Jalan' : 'Menunggu'}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">{task.config}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-muted-foreground">
                  {task.isEnabled ? 'On' : 'Off'}
                </span>
                <Switch checked={task.isEnabled} />
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                {task.status === 'active' ? (
                  <Square className="h-4 w-4 text-red-500" />
                ) : (
                  <Play className="h-4 w-4 text-green-600" />
                )}
              </Button>
            </div>
          </div>
        ))}
        <Button className="w-full bg-slate-900 text-white hover:bg-slate-800" variant="outline">
          Konfigurasi Semua Jadwal
        </Button>
      </CardContent>
    </Card>
  );
}
