'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Bot,
  Sparkles,
  Activity,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { landService } from '@/services/land';

import { SmartFarmingHeader } from './SmartFarmingHeader';
import { SensorOverview } from './SensorOverview';
import { AutomationControl } from './AutomationControl';
import { DeviceStatusList } from './DeviceStatusList';
import { SensorData, AutomationTask, IoTDevice } from './types';

const INITIAL_SENSORS: SensorData[] = [
  {
    id: 'SNS-001',
    name: 'Sensor Kelembaban - Blok A1',
    type: 'moisture',
    value: 42,
    unit: '%',
    status: 'normal',
    lastReading: new Date().toISOString(),
  },
  {
    id: 'SNS-002',
    name: 'Sensor Suhu - Lahan Utama',
    type: 'temperature',
    value: 28.5,
    unit: '°C',
    status: 'normal',
    lastReading: new Date().toISOString(),
  },
  {
    id: 'SNS-003',
    name: 'Sensor pH Tanah - Blok B2',
    type: 'ph',
    value: 5.4,
    unit: 'pH',
    status: 'low',
    lastReading: new Date().toISOString(),
  },
  {
    id: 'SNS-004',
    name: 'Sensor Intensitas Cahaya - Hidroponik',
    type: 'light',
    value: 85,
    unit: 'kLux',
    status: 'high',
    lastReading: new Date().toISOString(),
  },
];

const INITIAL_TASKS: AutomationTask[] = [
  {
    id: 'TSK-001',
    name: 'Penyiraman Otomatis Blok A1',
    type: 'irrigation',
    isEnabled: true,
    status: 'active',
    config: 'Kelembaban < 45%',
  },
  {
    id: 'TSK-002',
    name: 'Pemupukan Otomatis Blok B2',
    type: 'fertilizer',
    isEnabled: false,
    status: 'idle',
    config: 'Setiap Senin 08:00',
  },
  {
    id: 'TSK-003',
    name: 'LED Grow Light Hidroponik',
    type: 'lighting',
    isEnabled: true,
    status: 'scheduled',
    config: 'Pukul 18:00 - 06:00',
  },
];

const INITIAL_DEVICES: IoTDevice[] = [
  {
    id: 'DEV-8821',
    name: 'IoT Smart Gateway Hub 01',
    location: 'Gudang Utama',
    status: 'online',
    battery: 100,
    signal: 95,
  },
  {
    id: 'DEV-8822',
    name: 'Node Sensor Kelembaban A1',
    location: 'Lahan Cabai',
    status: 'online',
    battery: 82,
    signal: 78,
  },
  {
    id: 'DEV-8823',
    name: 'Node Sensor pH & Temp B2',
    location: 'Lahan Tomat',
    status: 'online',
    battery: 15,
    signal: 62,
  },
  {
    id: 'DEV-8824',
    name: 'Smart Pump Valve Control',
    location: 'Pompa Irigasi',
    status: 'offline',
    battery: 0,
    signal: 0,
  },
];

export function SmartFarmingManagement() {
  const [sensors, setSensors] = React.useState<SensorData[]>(INITIAL_SENSORS);
  const [tasks] = React.useState<AutomationTask[]>(INITIAL_TASKS);
  const [devices, setDevices] = React.useState<IoTDevice[]>(INITIAL_DEVICES);
  const [isSyncing, setIsSyncing] = React.useState(false);

  // Fetch land data directly from database via API as health proxy and dynamic data-source
  const {
    data: lands = [],
    error: errorLands,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['farmer-lands-for-smartfarming'],
    queryFn: () => landService.getLands(),
  });

  const isOffline = !!errorLands;

  React.useEffect(() => {
    if (isOffline) {
      toast.error('Gagal menghubungkan ke layanan smart farming. Koneksi terputus.');
    }
  }, [isOffline]);

  // Generate dynamic sensor readings based on database lands when online
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (isOffline || !lands || lands.length === 0) {
        setSensors([]);
        setDevices([]);
        return;
      }

      const sens: SensorData[] = [];
      lands.forEach((land, idx) => {
        sens.push({
          id: `SNS-L${idx + 1}-1`,
          name: `Sensor Kelembaban - ${land.name}`,
          type: 'moisture',
          value: 40 + Math.round(Math.random() * 20),
          unit: '%',
          status: 'normal',
          lastReading: new Date().toISOString(),
        });
        sens.push({
          id: `SNS-L${idx + 1}-2`,
          name: `Sensor pH Tanah - ${land.name}`,
          type: 'ph',
          value: 5.5 + Math.round(Math.random() * 1.5 * 10) / 10,
          unit: 'pH',
          status: 'normal',
          lastReading: new Date().toISOString(),
        });
      });

      setSensors(sens.length > 0 ? sens : INITIAL_SENSORS);

      const devList: IoTDevice[] = [
        {
          id: 'DEV-GW01',
          name: 'IoT Smart Gateway Hub 01',
          location: 'Gudang Utama',
          status: 'online',
          battery: 100,
          signal: 95,
        },
      ];

      lands.forEach((land, idx) => {
        devList.push({
          id: `DEV-NODE-L${idx + 1}`,
          name: `Node Sensor ${land.name}`,
          location: land.name,
          status: 'online',
          battery: Math.max(10, 100 - idx * 12 - Math.round(Math.random() * 5)),
          signal: Math.max(50, 90 - idx * 8 - Math.round(Math.random() * 5)),
        });
      });

      devList.push({
        id: 'DEV-PMP01',
        name: 'Smart Pump Valve Control',
        location: 'Pompa Irigasi',
        status: 'offline',
        battery: 0,
        signal: 0,
      });

      setDevices(devList);
    }, 0);

    return () => clearTimeout(timer);
  }, [lands, isOffline]);

  const handleRefresh = React.useCallback(() => {
    setIsSyncing(true);
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: 'Menghubungkan ke Gateway IoT & Sinkronisasi sensor...',
      success: () => {
        setIsSyncing(false);
        // Slightly randomize values for interactive feel
        setSensors((prev) =>
          prev.map((s) => {
            let val = s.value;
            if (s.type === 'moisture')
              val = Math.min(100, Math.max(10, Math.round(val + (Math.random() - 0.5) * 4)));
            if (s.type === 'temperature')
              val = Math.round((val + (Math.random() - 0.5) * 1) * 10) / 10;
            if (s.type === 'ph') val = Math.round((val + (Math.random() - 0.5) * 0.2) * 10) / 10;
            return { ...s, value: val, lastReading: new Date().toISOString() };
          })
        );
        refetch();
        return 'Data sensor berhasil disinkronkan';
      },
      error: 'Gagal sinkronisasi data IoT',
    });
  }, [refetch]);

  const handleConfigure = () => {
    toast.info('Halaman konfigurasi aturan otomatisasi sedang dipersiapkan.');
  };

  const handleAddDevice = () => {
    toast.loading('Mencari perangkat IoT di jaringan terdekat...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Ditemukan 1 perangkat baru: DEV-8825 (Smart Valve). Silakan hubungkan lahan.');
    }, 2000);
  };

  return (
    <div className="w-full text-slate-900 animate-in fade-in duration-500">
      <div className="mx-auto flex w-full flex-col gap-6">
        {/* Header Component */}
        <SmartFarmingHeader
          onRefresh={handleRefresh}
          onConfigure={handleConfigure}
          onAddDevice={handleAddDevice}
        />

        {isOffline ? (
          <>
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
              Gagal memuat data sensor real-time / Koneksi ke server terputus
            </div>
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
              Gagal sinkronisasi rekomendasi asisten AI / Koneksi ke server terputus
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
                Gagal memuat data otomatisasi pintar / Koneksi ke server terputus
              </div>
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
                Gagal memuat daftar perangkat IoT / Koneksi ke server terputus
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Real-time Sensors Overview Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-700 tracking-wide uppercase flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-emerald-500" />
                  Sensor Lapangan Real-time
                </h2>
                {isSyncing && (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <RefreshCw className="h-3 w-3 animate-spin text-slate-400" />
                    Menghubungkan...
                  </span>
                )}
              </div>
              <SensorOverview sensors={sensors} />
            </div>

            {/* AI Recommendations Panel */}
            <Card className="border border-slate-200 bg-linear-to-br from-emerald-950 via-slate-900 to-slate-950 text-white shadow-lg overflow-hidden relative">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Bot className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-slate-100 flex items-center gap-1.5">
                      Asisten AI SmartTani
                      <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Analis
                      </span>
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400 mt-0.5">
                      Rekomendasi tindakan cerdas berdasarkan sensor & tren lahan Anda.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-1">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex items-start gap-2.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold text-emerald-400">Status Kelembaban Lahan Blok A1</p>
                      <p className="text-slate-300 mt-1 leading-relaxed">
                        Kadar air tanah (42%) tergolong stabil tapi mendekati batas kritis (40%).
                        Sistem irigasi otomatis dijadwalkan aktif pukul 17:00 jika tidak terjadi
                        hujan harian.
                      </p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex items-start gap-2.5">
                    <Activity className="h-4.5 w-4.5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold text-amber-400">pH Tanah Kurang Optimal Blok B2</p>
                      <p className="text-slate-300 mt-1 leading-relaxed">
                        Tingkat keasaman tanah rendah (5.4 pH). AI merekomendasikan penambahan
                        dolomit sebanyak 150g per tanaman pada siklus pemupukan fosfat berikutnya
                        untuk menormalkan nutrisi.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2-Column Controls Layout */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Automation Control Panel */}
              <AutomationControl tasks={tasks} />

              {/* Connected IoT Devices List */}
              <DeviceStatusList devices={devices} />
            </div>
          </>
        )}

        {/* Coming Soon Q3 Banner */}
        <div className="relative overflow-hidden rounded-xl bg-slate-50 border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-full bg-emerald-50 text-emerald-600 shrink-0">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                Pembaruan Integrasi IoT Lanjutan (Q3 2026)
              </p>
              <p className="text-xs text-slate-500 mt-0.5 max-w-xl leading-relaxed">
                Nantikan integrasi drone pemantau lahan, sensor NPK tanah realtime, dan asisten
                suara otomatisasi. Kami sedang menguji hardware di laboratorium riset SmartTani.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="border-slate-200 text-xs font-semibold shrink-0 cursor-pointer hover:bg-slate-100"
          >
            Daftar Uji Coba Beta <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
