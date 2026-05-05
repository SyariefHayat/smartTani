"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { 
  GraduationCap, 
  Users, 
  Video, 
  Award,
  Plus,
  BookOpen,
  Calendar,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AcademyDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("smarttani-auth");
    if (!auth) {
      router.push("/login?redirect=/dashboard/academy");
    } else {
      const userData = JSON.parse(auth);
      if (userData.role !== "academy") {
        router.push(`/dashboard/${userData.role === 'petani' ? 'farmer' : userData.role.replace('_', '-')}`);
      } else {
        setUser(userData);
        setLoading(false);
      }
    }
  }, [router]);

  if (loading) return null;

  const stats = [
    { label: "Total Kursus", value: "24", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Siswa Aktif", value: "1,240", icon: Users, color: "text-green-600", bg: "bg-green-100" },
    { label: "Webinar Mendatang", value: "5", icon: Video, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Sertifikat Diterbitkan", value: "850", icon: Award, color: "text-amber-600", bg: "bg-amber-100" },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Ringkasan Akademi</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Selamat Datang, {user?.name || "Admin Akademi"}!</h1>
              <p className="text-gray-500">Kelola kurikulum dan pantau perkembangan belajar siswa Anda.</p>
            </div>
            <Button className="bg-[#1A6B2F] hover:bg-[#145224]">
              <Plus className="mr-2 h-4 w-4" />
              Buat Kursus Baru
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Areas */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-1 lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-bold text-gray-900">Manajemen Kursus</h2>
                <button className="text-sm text-[#1A6B2F] font-medium hover:underline">Lihat Semua</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Nama Kursus</th>
                      <th className="px-6 py-4">Kategori</th>
                      <th className="px-6 py-4">Siswa</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { name: "Dasar Smart Farming & IoT", category: "Teknologi", enrollment: 450, status: "Aktif", color: "bg-green-100 text-green-700" },
                      { name: "Manajemen Agribisnis Modern", category: "Bisnis", enrollment: 320, status: "Draft", color: "bg-gray-100 text-gray-700" },
                      { name: "Hidroponik Skala Industri", category: "Budidaya", enrollment: 280, status: "Aktif", color: "bg-green-100 text-green-700" },
                      { name: "Teknik Irigasi Cerdas", category: "Teknologi", enrollment: 150, status: "Review", color: "bg-amber-100 text-amber-700" },
                    ].map((course, i) => (
                      <tr key={i} className="text-sm hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{course.name}</td>
                        <td className="px-6 py-4 text-gray-600">{course.category}</td>
                        <td className="px-6 py-4 font-bold text-gray-900">{course.enrollment}</td>
                        <td className="px-6 py-4">
                          <Badge className={`${course.color} shadow-none border-none text-[10px]`}>
                            {course.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900">Agenda Webinar</h2>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { title: "Masa Depan Padi 4.0", date: "24 Mei, 10:00", speaker: "Dr. Ir. Suwandi" },
                    { title: "Optimasi Ekspor Hasil Tani", date: "26 Mei, 14:00", speaker: "Budi Santoso" },
                  ].map((webinar, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-lg flex flex-col items-center justify-center text-[#1A6B2F]">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-gray-900 leading-tight">{webinar.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{webinar.date}</p>
                        <p className="text-xs font-medium text-[#1A6B2F] mt-1">{webinar.speaker}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4 border-[#1A6B2F] text-[#1A6B2F] hover:bg-green-50">
                    Lihat Kalender
                  </Button>
                </div>
              </div>

              <div className="bg-[#1A6B2F] rounded-xl p-6 text-white flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold mb-2">Academy Insight</h2>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Minat pada kursus "Teknologi IoT" meningkat 40% minggu ini. Pertimbangkan untuk menambah sesi tanya jawab live.
                  </p>
                </div>
                <Button variant="secondary" className="mt-6 w-full text-[#1A6B2F] font-bold">
                  Lihat Analisis Detail
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
