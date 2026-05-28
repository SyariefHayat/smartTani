'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStoredAuthUser } from '@/lib/auth-storage';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Video,
  Calendar,
  Clock,
  User,
  Users,
  Search,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Share2,
} from 'lucide-react';

interface Webinar {
  id: string;
  title: string;
  speaker: string;
  speaker_title: string;
  date: string;
  time: string;
  description: string;
  platform: string;
  registered_count: number;
  max_slots: number;
  category: string;
}

const MOCK_WEBINARS: Webinar[] = [
  {
    id: 'web-1',
    title: 'Peluang Ekspor Hortikultura Premium ke Jepang',
    speaker: 'Ahmad Syafii',
    speaker_title: 'Direktur Ekspor & Kemitraan Tani Nasional',
    date: '2026-05-30',
    time: '09:00 - 11:00 WIB',
    description:
      'Pelajari standardisasi komoditas, sertifikasi ekspor phytosanitary, dan tips menembus pasar premium Jepang.',
    platform: 'Zoom Meeting',
    registered_count: 345,
    max_slots: 500,
    category: 'Bisnis & Ekspor',
  },
  {
    id: 'web-2',
    title: 'Otomatisasi Lahan dengan Smart Irrigation System',
    speaker: 'Riza Fahmi, M.T.',
    speaker_title: 'IoT Engineering Consultant & AgriTech Specialist',
    date: '2026-06-05',
    time: '14:00 - 16:00 WIB',
    description:
      'Implementasi praktis sensor kelembaban tanah dengan pompa mikro otomatis berbasis ESP32 untuk hemat air.',
    platform: 'Google Meet',
    registered_count: 180,
    max_slots: 250,
    category: 'Agroteknologi',
  },
  {
    id: 'web-3',
    title: 'Strategi Pemupukan Presisi Komoditas Padi & Jagung',
    speaker: 'Dr. Ir. Heri Susanto',
    speaker_title: 'Dosen Senior Ilmu Tanah & Nutrisi Tanaman IPB',
    date: '2026-06-12',
    time: '10:00 - 12:00 WIB',
    description:
      'Mengukur kecukupan Nitrogen, Fosfor, Kalium (NPK) menggunakan bagan warna daun digital untuk hasil maksimal.',
    platform: 'Zoom Meeting',
    registered_count: 420,
    max_slots: 500,
    category: 'Budidaya',
  },
  {
    id: 'web-4',
    title: 'Penyusunan Proposal Investasi Tani yang Menarik',
    speaker: 'Budi Santoso, MBA',
    speaker_title: 'Praktisi Agribisnis & Investor Modal Ventura Tani',
    date: '2026-06-20',
    time: '13:00 - 15:00 WIB',
    description:
      'Formula menghitung IRR, payback period, dan pembagian bagi hasil profit-sharing untuk diajukan ke investor.',
    platform: 'Zoom Meeting',
    registered_count: 98,
    max_slots: 200,
    category: 'Keuangan',
  },
];

export default function StudentWebinarsPage() {
  const user = getStoredAuthUser();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('all');

  const { data: webinars, isLoading } = useQuery<Webinar[]>({
    queryKey: ['student-webinars', user?.id],
    queryFn: async () => {
      // Simulate API or load
      return MOCK_WEBINARS;
    },
  });

  const { data: registeredIds } = useQuery<string[]>({
    queryKey: ['student-registered-webinars', user?.id],
    queryFn: async () => {
      const key = `webinars-registered-${user?.id}`;
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : ['web-1']; // 'web-1' pre-registered for demonstration
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (webinarId: string) => {
      const key = `webinars-registered-${user?.id}`;
      const prev = registeredIds || [];
      const updated = [...prev, webinarId];
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['student-registered-webinars', user?.id], data);
      toast.success('Pendaftaran webinar berhasil! Tautan akses dikirim ke email Anda.');
    },
  });

  const filteredWebinars = React.useMemo(() => {
    if (!webinars) return [];
    return webinars.filter((web) => {
      const title = web.title.toLowerCase();
      const speaker = web.speaker.toLowerCase();
      const matchSearch =
        title.includes(searchQuery.toLowerCase()) || speaker.includes(searchQuery.toLowerCase());

      const isRegistered = registeredIds?.includes(web.id);
      if (activeTab === 'registered') {
        return matchSearch && isRegistered;
      }
      return matchSearch;
    });
  }, [webinars, searchQuery, activeTab, registeredIds]);

  const handleShare = (title: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/webinars/detail`);
      toast.success(`Tautan untuk webinar "${title}" disalin!`);
    }
  };

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Webinar Pertanian SiTani 🎤
        </h1>
        <p className="text-xs font-semibold text-slate-500">
          Ikuti sesi interaktif langsung bersama praktisi agribisnis dan akademisi terkemuka.
        </p>
      </div>

      {/* Tabs and Controls */}
      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full space-y-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
          <TabsList className="bg-slate-100 rounded-xl p-1 max-w-fit">
            <TabsTrigger
              value="all"
              className="rounded-lg text-xs font-bold px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Semua Sesi
            </TabsTrigger>
            <TabsTrigger
              value="registered"
              className="rounded-lg text-xs font-bold px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Sudah Terdaftar
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Cari webinar atau pembicara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white border-slate-200 text-xs font-medium focus:ring-green-500 rounded-xl"
            />
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-64 w-full bg-slate-100 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : filteredWebinars.length === 0 ? (
            <div className="text-center py-12 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <p className="text-xs font-semibold text-slate-400">Tidak ada webinar yang cocok.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredWebinars.map((web) => {
                const isRegistered = registeredIds?.includes(web.id);
                const isFull = web.registered_count >= web.max_slots;
                const progressPct = Math.round((web.registered_count / web.max_slots) * 100);

                const webDate = new Date(web.date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                });

                return (
                  <Card
                    key={web.id}
                    className="border-slate-200 bg-white hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <Badge className="bg-emerald-50 border border-emerald-100 text-emerald-700 hover:bg-emerald-50 text-[9px] font-bold uppercase rounded-lg">
                            {web.category}
                          </Badge>
                          <CardTitle className="text-sm font-bold text-slate-800 line-clamp-2 mt-1">
                            {web.title}
                          </CardTitle>
                        </div>
                        <div className="h-9 w-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center border border-green-100 shrink-0">
                          <Video className="h-4.5 w-4.5" />
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3.5 pb-4 text-xs font-medium text-slate-600">
                        {/* Speaker info */}
                        <div className="flex gap-2.5 items-start bg-slate-50/60 rounded-xl p-3 border border-slate-100">
                          <div className="h-8 w-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center shrink-0 border border-green-200">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-[11px]">
                              {web.speaker}
                            </div>
                            <div className="text-[10px] text-slate-400 font-semibold leading-tight">
                              {web.speaker_title}
                            </div>
                          </div>
                        </div>

                        <p className="text-[11px] font-semibold text-slate-500 leading-relaxed line-clamp-3">
                          {web.description}
                        </p>

                        {/* Date/Time specs */}
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {webDate}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            {web.time}
                          </div>
                        </div>

                        {/* Slots indicator */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              Keterisian Kelas
                            </span>
                            <span>
                              {web.registered_count} / {web.max_slots} Kursi
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-600 rounded-full"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </div>

                    <CardFooter className="border-t border-slate-100 p-4 bg-slate-50/30 flex items-center justify-between gap-3">
                      <Button
                        variant="ghost"
                        onClick={() => handleShare(web.title)}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
                      >
                        <Share2 className="h-3.5 w-3.5 mr-1" />
                        Bagikan
                      </Button>

                      {isRegistered ? (
                        <Button
                          disabled
                          className="bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-xs font-bold shadow-none"
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                          Sudah Terdaftar
                        </Button>
                      ) : (
                        <Button
                          onClick={() => registerMutation.mutate(web.id)}
                          disabled={isFull || registerMutation.isPending}
                          className="bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-sm"
                        >
                          Daftar Sekarang
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="registered" className="mt-0">
          {filteredWebinars.length === 0 ? (
            <Card className="border-dashed border-slate-200 bg-slate-50/50 py-12 flex flex-col items-center justify-center text-center">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2.5">
                <Video className="h-5 w-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-700">Belum Mendaftar Webinar</h3>
              <p className="text-[10px] font-semibold text-slate-400 max-w-xs mt-0.5 px-4">
                Pilih topik favorit Anda di tab &quot;Semua Sesi&quot; untuk mendapatkan akses
                belajar interaktif langsung.
              </p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredWebinars.map((web) => {
                const webDate = new Date(web.date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                });

                return (
                  <Card
                    key={web.id}
                    className="border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden flex flex-col justify-between"
                  >
                    <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4">
                      <div>
                        <Badge className="bg-amber-50 border border-amber-100 text-amber-700 text-[9px] font-bold uppercase rounded-lg mb-1.5">
                          Akses Link Tersedia
                        </Badge>
                        <CardTitle className="text-sm font-bold text-slate-800 line-clamp-2">
                          {web.title}
                        </CardTitle>
                      </div>
                      <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0">
                        <Video className="h-4.5 w-4.5" />
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3.5 pb-4 text-xs font-semibold text-slate-600">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span>
                          Pembicara: <span className="font-bold text-slate-700">{web.speaker}</span>
                        </span>
                      </div>

                      <div className="flex flex-col gap-1 text-[11px] font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100/60">
                        <div className="flex items-center justify-between text-slate-500">
                          <span>Waktu Mulai:</span>
                          <span className="font-bold text-slate-800">{webDate}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-500">
                          <span>Jam Pertemuan:</span>
                          <span className="font-bold text-slate-800">{web.time}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-500 border-t border-slate-200/50 pt-1.5 mt-1.5">
                          <span>Platform:</span>
                          <span className="font-bold text-emerald-600">{web.platform}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="border-t border-slate-100 p-4 bg-slate-50/50 flex items-center justify-between gap-3">
                      <Button
                        variant="ghost"
                        onClick={() => handleShare(web.title)}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
                      >
                        <Share2 className="h-3.5 w-3.5 mr-1" />
                        Bagikan
                      </Button>
                      <Button
                        onClick={() => {
                          toast.success('Membuka aplikasi telekonferensi untuk webinar...');
                          window.open('https://zoom.us', '_blank');
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-sm gap-1"
                      >
                        Masuk Ruang Sesi
                        <ExternalLink className="h-3.5 w-3.5 ml-0.5" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
