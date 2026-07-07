"use client";

import React, { useEffect } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = "info", onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgClass =
    type === "success"
      ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-300"
      : type === "error"
      ? "bg-rose-950/90 border-rose-500/30 text-rose-300"
      : "bg-zinc-900/90 border-zinc-700/30 text-zinc-300";

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md shadow-2xl scale-up-entry ${bgClass}`}>
      {type === "error" ? (
        <AlertCircle className="w-5 h-5 text-rose-400" />
      ) : (
        <CheckCircle className="w-5 h-5 text-emerald-400" />
      )}
      <p className="text-sm font-sans font-medium">{message}</p>
      <button onClick={onClose} className="p-0.5 hover:bg-white/10 rounded transition">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
