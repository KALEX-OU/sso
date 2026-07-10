"use client";

import React from "react";
import { CheckCircle, AlertCircle, Shield, X } from "lucide-react";
import { useUIStrings } from "../../lib/ui.localization";

export interface ToastNotificationProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export function ToastNotification({ message, type, onClose }: ToastNotificationProps) {
  const s = useUIStrings();
  return (
    <div
      className={`klx-toast ${
        type === "success"
          ? "klx-toast--success"
          : type === "error"
          ? "klx-toast--error"
          : "klx-toast--info"
      }`}
    >
      <div className="klx-toast-icon">
        {type === "success" && <CheckCircle className="w-5 h-5" />}
        {type === "error" && <AlertCircle className="w-5 h-5" />}
        {type === "info" && <Shield className="w-5 h-5" />}
      </div>
      
      <p className="klx-toast-message">
        {message}
      </p>

      <button
        onClick={onClose}
        className={`klx-toast-close-btn ${
          type === "success"
            ? "klx-toast-close-btn--success"
            : type === "error"
            ? "klx-toast-close-btn--error"
            : "klx-toast-close-btn--info"
        }`}
        aria-label={s.common.closeNotification}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
