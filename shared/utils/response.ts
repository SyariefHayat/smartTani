/**
 * Standard success response format
 */
export const successResponse = <T>(data: T, meta?: unknown) => ({
  success: true,
  data,
  meta,
});

/**
 * Standard error response format
 */
export const errorResponse = (code: string, message: string) => ({
  success: false,
  error: {
    code,
    message,
  },
});

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  meta?: unknown;
  error?: {
    code: string;
    message: string;
  };
}
