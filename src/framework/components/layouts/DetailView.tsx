"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/Button";
import { ScrollShadow } from "../ui/ScrollShadow";

interface DetailViewProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DetailView({
  isOpen,
  onClose,
  title,
  subtitle,
  actions,
  children,
  className = ""
}: DetailViewProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-xl h-full bg-slate-950/95 dark:bg-black/95 backdrop-blur-xl border-l border-slate-900 rounded-l-3xl shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 ${className}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Intestazione */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-900/50">
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight text-white">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                {subtitle}
              </p>
            )}
          </div>
          <Button
            isIconOnly
            onClick={onClose}
            variant="ghost"
            size="sm"
            aria-label="Chiudi dettagli"
            className="min-w-0 active:scale-95 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Corpo con ScrollShadow */}
        <ScrollShadow className="flex-1 p-6 overflow-y-auto text-slate-300">
          {children}
        </ScrollShadow>

        {/* Footer */}
        {actions && (
          <div className="px-6 py-4 border-t border-slate-900/50 bg-slate-950/60 flex items-center justify-end gap-3 rounded-bl-3xl">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
