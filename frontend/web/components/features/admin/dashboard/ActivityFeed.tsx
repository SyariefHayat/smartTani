'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, ShoppingBag, FileText, ShieldCheck, Activity } from 'lucide-react';

export interface ActivityItem {
  id: string;
  type: 'user' | 'order' | 'proposal' | 'verification';
  message: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities?: ActivityItem[];
  loading?: boolean;
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'user',
    message: 'Petani baru "Slamet Raharjo" mendaftar di Lamongan, Jawa Timur.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  }, // 15 mins ago
  {
    id: 'act-2',
    type: 'order',
    message: 'Transaksi B2B Pupuk Organik Cair senilai Rp 8.500.000 sukses.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  }, // 45 mins ago
  {
    id: 'act-3',
    type: 'proposal',
    message: 'Petani mengajukan proposal baru: "Modernisasi Irigasi Tetes Cabe Rawit".',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  }, // 2 hours ago
  {
    id: 'act-4',
    type: 'verification',
    message:
      'Sertifikat Kelulusan "Budidaya Melon Hidroponik" diterbitkan untuk siswa Ahmad Ghozali.',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  }, // 4 hours ago
  {
    id: 'act-5',
    type: 'order',
    message: 'Buyer memesan "100kg Cabe Rawit Premium" dari Kelompok Tani Makmur.',
    timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
  }, // 10 hours ago
];

export function ActivityFeed({ activities = MOCK_ACTIVITIES, loading = false }: ActivityFeedProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <UserPlus className="h-4 w-4 text-blue-600" />;
      case 'order':
        return <ShoppingBag className="h-4 w-4 text-green-600" />;
      case 'proposal':
        return <FileText className="h-4 w-4 text-amber-600" />;
      case 'verification':
        return <ShieldCheck className="h-4 w-4 text-purple-600" />;
      default:
        return <Activity className="h-4 w-4 text-slate-400" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'user':
        return 'bg-blue-50';
      case 'order':
        return 'bg-green-50';
      case 'proposal':
        return 'bg-amber-50';
      case 'verification':
        return 'bg-purple-50';
      default:
        return 'bg-slate-50';
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    // eslint-disable-next-line react-hooks/purity
    const minutes = Math.round((Date.now() - new Date(timestamp).getTime()) / (1000 * 60));
    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;
    return new Date(timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  return (
    <Card className="border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-600" />
          <CardTitle className="text-sm font-bold text-slate-800">
            Aktivitas Terkini Platform
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="h-8 w-8 rounded-full bg-slate-100" />
                <div className="flex-1 space-y-1.5 py-1">
                  <div className="h-3.5 bg-slate-100 rounded w-3/4" />
                  <div className="h-2 bg-slate-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative border-l border-slate-100 pl-4.5 ml-2.5 space-y-5">
            {activities.map((item) => (
              <div key={item.id} className="relative flex gap-3.5 group">
                {/* Timeline Dot Indicator */}
                <div
                  className={`absolute -left-7.5 top-0.5 h-6 w-6 rounded-full border border-white flex items-center justify-center shadow-sm transition-all group-hover:scale-110 ${getBgColor(
                    item.type
                  )}`}
                >
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-semibold text-slate-700 leading-normal">
                    {item.message}
                  </p>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    {formatRelativeTime(item.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
