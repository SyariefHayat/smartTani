"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import { ToastDetail, ToastType } from "@/lib/toast";

const icons: Record<ToastType, any> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const bgColors: Record<ToastType, string> = {
  success: "bg-green-600",
  error: "bg-red-600",
  warning: "bg-yellow-500",
  info: "bg-blue-600",
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastDetail[]>([]);

  useEffect(() => {
    const handleShowToast = (e: any) => {
      const newToast = e.detail as ToastDetail;
      setToasts((prev) => [...prev, newToast]);

      if (newToast.duration !== 0) {
        setTimeout(() => {
          removeToast(newToast.id);
        }, newToast.duration || 3000);
      }
    };

    window.addEventListener("show-toast", handleShowToast);
    return () => window.removeEventListener("show-toast", handleShowToast);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-white min-w-[280px] max-w-sm animate-in slide-in-from-right-full duration-300 ${
              bgColors[toast.type]
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <p className="flex-1 text-sm font-bold">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="rounded-full p-1 hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
