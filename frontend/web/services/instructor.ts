import api from '@/lib/api';
import { Course } from './academy';

export interface InstructorAnalytics {
  total_courses: number;
  published_courses: number;
  total_students: number;
  avg_rating: number;
  total_reviews: number;
  completion_rate: number;
  students_this_month: number;
  students_change_percent: number;
  top_courses: Array<{ id: string; title: string; enrolled_count: number; rating: number }>;
  recent_enrollments: Array<{
    student_id: string;
    student_name: string;
    course_title: string;
    enrolled_at: string;
  }>;
  recent_reviews: Array<{
    student_name: string;
    course_title: string;
    rating: number;
    comment: string;
  }>;
}

export interface StudentProgress {
  student_id: string;
  student_name: string;
  student_email: string;
  enrolled_at: string;
  progress_percent: number;
  status: 'active' | 'completed' | 'dropped';
  last_module_title?: string;
}

export interface StudentPerformanceResponse {
  students: StudentProgress[];
  stats: {
    total: number;
    active: number;
    completed: number;
    dropped: number;
    avg_progress: number;
    completion_rate: number;
  };
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface CoursePerformance {
  id: string;
  title: string;
  enrolled_count: number;
  completion_rate: number;
  avg_rating: number;
  drop_rate: number;
  avg_completion_days: number;
  revenue: number;
}

export interface InstructorPerformanceResponse {
  courses: CoursePerformance[];
  enrollment_trend: Array<{ month: string; count: number }>;
  rating_distribution: Record<string, number>;
}

export interface InstructorEarningItem {
  id: string;
  title: string;
  price: number;
  students: number;
  revenue: number;
  fee: number;
  net: number;
}

export interface InstructorEarningsResponse {
  total_earnings: number;
  monthly_earnings: number;
  paid_students: number;
  courses: InstructorEarningItem[];
}

export const instructorService = {
  getMyCourses: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ courses: Course[]; meta: Record<string, unknown> }> => {
    const response = await api.get('/academy/courses/me', { params });
    return response.data.data;
  },

  getStudents: async (
    courseId: string,
    params?: { page?: number; limit?: number; search?: string; status?: string }
  ): Promise<StudentPerformanceResponse> => {
    const response = await api.get(`/academy/courses/${courseId}/students`, { params });
    return response.data.data;
  },

  publishCourse: async (courseId: string, isPublished: boolean): Promise<Course> => {
    const response = await api.patch(`/academy/courses/${courseId}/publish`, {
      is_published: isPublished,
    });
    return response.data.data;
  },

  reorderModules: async (courseId: string, moduleIds: string[]): Promise<{ success: boolean }> => {
    const response = await api.patch(`/academy/courses/${courseId}/modules/reorder`, {
      module_ids: moduleIds,
    });
    return response.data.data;
  },

  getInstructorAnalytics: async (instructorId: string): Promise<InstructorAnalytics> => {
    const response = await api.get(`/academy/analytics/instructor/${instructorId}`);
    return response.data.data;
  },

  getCoursePerformance: async (instructorId: string): Promise<InstructorPerformanceResponse> => {
    const response = await api.get(
      `/academy/analytics/instructor/${instructorId}/course-performance`
    );
    return response.data.data;
  },

  getEarnings: async (): Promise<InstructorEarningsResponse> => {
    const response = await api.get('/academy/earnings/me');
    return response.data.data;
  },
};
