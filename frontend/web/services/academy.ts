import api from '@/lib/api';

export interface Course {
  id: string;
  title: string;
  description: string;
  short_description: string;
  image?: string;
  category: string;
  difficulty: 'pemula' | 'menengah' | 'ahli';
  mode: 'online' | 'offline' | 'blended';
  duration_hours: number;
  instructor_id: string;
  instructor_name: string;
  instructor_title: string;
  instructor_avatar?: string;
  price: number;
  is_free: boolean;
  is_published: boolean;
  max_students?: number;
  enrolled_count: number;
  average_rating: number;
  review_count: number;
  created_at?: string;
  updated_at?: string;
  modules?: Module[];
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  order: number;
  type: 'video' | 'article' | 'quiz' | 'assignment';
  content_url?: string;
  content_text?: string;
  duration_minutes?: number;
  created_at?: string;
  quiz_questions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  status: 'active' | 'completed' | 'dropped';
  enrolled_at: string;
  completed_at?: string;
  progress_percent: number;
  course?: Course;
}

export interface ModuleProgress {
  id: string;
  enrollment_id: string;
  module_id: string;
  student_id: string;
  is_completed: boolean;
  completed_at?: string;
  score?: number;
}

export interface Certificate {
  id: string;
  enrollment_id: string;
  student_id: string;
  course_id: string;
  certificate_number: string;
  issued_at: string;
  course?: Course;
}

export interface CourseReview {
  id: string;
  course_id: string;
  student_id: string;
  student_name: string;
  student_avatar?: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface StudentAnalytics {
  active_courses: number;
  completed_courses: number;
  certificates_count: number;
  total_learning_hours: number;
  current_streak_days: number;
  top_categories: Array<{ category: string; count: number }>;
}

export interface GetCoursesParams {
  category?: string;
  difficulty?: string;
  mode?: string;
  is_free?: boolean;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface GetCoursesResponse {
  courses: Course[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const academyService = {
  getCourses: async (params?: GetCoursesParams): Promise<GetCoursesResponse> => {
    const response = await api.get('/academy/courses', { params });
    return response.data.data;
  },

  getCourseById: async (id: string): Promise<Course & { modules: Module[] }> => {
    const response = await api.get(`/academy/courses/${id}`);
    return response.data.data;
  },

  enrollCourse: async (courseId: string): Promise<Enrollment> => {
    const response = await api.post(`/academy/courses/${courseId}/enroll`);
    return response.data.data;
  },

  getMyEnrollments: async (): Promise<Enrollment[]> => {
    const response = await api.get('/academy/enrollments/me');
    return response.data.data;
  },

  getMyEnrollmentProgress: async (
    courseId: string
  ): Promise<{ enrollment: Enrollment; progress: ModuleProgress[] }> => {
    const response = await api.get(`/academy/enrollments/me/${courseId}`);
    return response.data.data;
  },

  completeModule: async (moduleId: string, data?: { score?: number }): Promise<ModuleProgress> => {
    const response = await api.post(`/academy/modules/${moduleId}/complete`, data);
    return response.data.data;
  },

  getMyCertificates: async (): Promise<Certificate[]> => {
    const response = await api.get('/academy/certificates/me');
    return response.data.data;
  },

  getCertificateById: async (id: string): Promise<Certificate> => {
    const response = await api.get(`/academy/certificates/${id}`);
    return response.data.data;
  },

  createCourseReview: async (
    courseId: string,
    data: { rating: number; comment?: string }
  ): Promise<CourseReview> => {
    const response = await api.post(`/academy/courses/${courseId}/reviews`, data);
    return response.data.data;
  },

  getCourseReviews: async (
    courseId: string,
    params?: { page?: number; limit?: number }
  ): Promise<{ reviews: CourseReview[] }> => {
    const response = await api.get(`/academy/courses/${courseId}/reviews`, { params });
    return response.data.data;
  },

  getStudentAnalytics: async (): Promise<StudentAnalytics> => {
    const response = await api.get('/academy/analytics/student');
    return response.data.data;
  },
};
