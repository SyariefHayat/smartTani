import { notFound } from "next/navigation";
import { ACADEMY_KURSUS } from "@/constants/academy";
import CourseHero from "@/components/sections/academy/CourseHero";
import CourseSyllabus from "@/components/sections/academy/CourseSyllabus";
import CourseInstructor from "@/components/sections/academy/CourseInstructor";
import CourseEnroll from "@/components/sections/academy/CourseEnroll";
import RelatedCourses from "@/components/sections/academy/RelatedCourses";

interface CourseDetailPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return ACADEMY_KURSUS.items.map((c) => ({ id: c.id }));
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { id } = await params;
  
  // Find course by id
  const course = ACADEMY_KURSUS.items.find((c) => c.id === id);

  if (!course) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <CourseHero course={course} />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="prose max-w-none text-gray-600">
              <h2 className="text-2xl font-bold text-gray-900">Tentang Kursus</h2>
              <p className="mt-4">{course.description}</p>
              <p className="mt-2">
                Dalam kursus ini, Anda akan mempelajari langkah-demi-langkah strategi yang telah 
                terbukti untuk mencapai keberhasilan maksimal dalam bidang ini. Materi dirancang 
                secara praktis sehingga dapat langsung diterapkan di lapangan.
              </p>
            </div>

            <CourseSyllabus />
            <CourseInstructor instructor={course.instruktur} />
          </div>

          {/* Sidebar Enroll */}
          <div className="relative">
            <CourseEnroll />
          </div>
        </div>

        {/* Related Courses */}
        <RelatedCourses />
      </div>
    </main>
  );
}
