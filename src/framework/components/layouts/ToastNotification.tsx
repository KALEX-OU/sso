"use client";

import React from "react";
import { CheckCircle, AlertCircle, Shield, X } from "lucide-react";

export interface ToastNotificationProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export function ToastNotification({ message, type, onClose }: ToastNotificationProps) {
  return (
    <div
      className={`fixed bottom-6 left-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300
        bg-slate-950/95 backdrop-blur-xl border rounded-2xl p-4 shadow-2xl flex items-center gap-3.5 max-w-sm
        ${
          type === "success"
            ? "border-[#00ffff] text-[#00ffff] shadow-[0_0_15px_rgba(0,255,255,0.15)]"
            : type === "error"
            ? "border-[#ff00ff] text-[#ff00ff] shadow-[0_0_15px_rgba(255,0,255,0.15)]"
            : "border-[#ffff00] text-[#ffff00] shadow-[0_0_15px_rgba(255,255,0,0.15)]"
        }`}
    >
      <div className="shrink-0">
        {type === "success" && <CheckCircle className="w-5 h-5 text-[#00ffff]" />}
        {type === "error" && <AlertCircle className="w-5 h-5 text-[#ff00ff]" />}
        {type === "info" && <Shield className="w-5 h-5 text-[#ffff00]" />}
      </div>
      
      <p className="text-white text-xs font-bold leading-relaxed pr-2">
        {message}
      </p>

      <button
        onClick={onClose}
        className={`ml-auto shrink-0 p-1 rounded-lg transition-colors cursor-pointer outline-none
          ${
            type === "success"
              ? "hover:bg-[#00ffff]/10 text-[#00ffff]"
              : type === "error"
              ? "hover:bg-[#ff00ff]/10 text-[#ff00ff]"
              : "hover:bg-[#ffff00]/10 text-[#ffff00]"
          }`}
        aria-label="Chiudi notifica"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
