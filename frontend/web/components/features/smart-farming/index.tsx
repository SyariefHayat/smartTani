'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Cpu, Wifi, Layers, Bot, Sparkles, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SmartFarmingManagement() {
  return (
    <div className="w-full text-slate-900 animate-in fade-in duration-500">
      <div className="mx-auto flex w-full flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Smart Farming IoT</h1>
            <p className="text-muted-foreground">
              Integrasi teknologi Internet of Things (IoT) untuk pertanian presisi dan otomatisasi
              lahan.
            </p>
          </div>
        </div>

        {/* Coming Soon Glowing Hero Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-8 md:p-12 text-white shadow-xl border border-slate-800">
          {/* Decorative glowing blobs */}
          <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto py-10">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20 mb-6 animate-pulse">
              <Sparkles className="h-3.5 w-3.5" />
              Fitur Masa Depan (IoT)
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-emerald-300">
              Integrasi Sensor & Irigasi Otomatis
            </h2>

            <p className="text-base text-slate-300 mb-8 leading-relaxed">
              Kami sedang merancang sistem integrasi Internet of Things (IoT) yang tangguh. Anda
              akan dapat memantau tingkat kelembaban tanah, keasaman (pH), suhu lingkungan secara
              langsung, dan mengontrol perangkat irigasi presisi secara otomatis dari satu dashboard
              terpadu.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-950/30 transition-all duration-300 hover:shadow-emerald-600/30 hover:scale-[1.02]">
                <Wifi className="mr-2 h-4 w-4" /> Hubungkan Perangkat IoT
              </Button>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Activity className="h-4 w-4 text-emerald-400" /> Rilis Direncanakan: Q3 2026
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Features Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800">
            Teknologi Pintar yang Sedang Dipersiapkan:
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Sensor Tanah Realtime',
                desc: 'Pantau kelembaban, pH tanah, suhu harian, dan kandungan hara secara presisi langsung dari sensor fisik di lahan.',
                icon: Cpu,
                color: 'text-emerald-500',
                bgColor: 'bg-emerald-500/10',
                borderColor: 'border-emerald-500/20',
              },
              {
                title: 'Otomatisasi Pompa Air',
                desc: 'Atur sistem irigasi pintar yang menyala otomatis jika kelembaban tanah berada di bawah ambang batas optimal tanaman.',
                icon: Wifi,
                color: 'text-blue-500',
                bgColor: 'bg-blue-500/10',
                borderColor: 'border-blue-500/20',
              },
              {
                title: 'Pemetaan Lahan IoT',
                desc: 'Visualisasikan denah blok lahan pertanian Anda dengan indikator kondisi tanaman termal terintegrasi sensor.',
                icon: Layers,
                color: 'text-purple-500',
                bgColor: 'bg-purple-500/10',
                borderColor: 'border-purple-500/20',
              },
              {
                title: 'Asisten AI SmartTani',
                desc: 'AI akan menganalisis tren data sensor harian untuk memberikan rekomendasi pemupukan dan penanggulangan hama.',
                icon: Bot,
                color: 'text-amber-500',
                bgColor: 'bg-amber-500/10',
                borderColor: 'border-amber-500/20',
              },
            ].map((feat) => (
              <Card
                key={feat.title}
                className={`border ${feat.borderColor} bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}
              >
                <CardContent className="p-6">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${feat.bgColor} mb-4`}
                  >
                    <feat.icon className={`h-5 w-5 ${feat.color}`} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">{feat.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
