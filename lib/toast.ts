export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastDetail {
  message: string;
  type: ToastType;
  duration?: number;
  id: number;
}

export function showToast(
  message: string, 
  type: ToastType = 'success',
  duration: number = 3000
) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: { message, type, duration, id: Date.now() }
    }));
  }
}
