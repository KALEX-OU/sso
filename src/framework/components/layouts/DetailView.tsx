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
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-xl h-full bg-background/80 backdrop-blur-md border-l border-divider shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 ${className}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Intestazione */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-divider">
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
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
            className="min-w-0 active:scale-95 hover:bg-default/15 rounded-xl transition-all"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>

        {/* Corpo con ScrollShadow */}
        <ScrollShadow className="flex-1 p-6 overflow-y-auto">
          {children}
        </ScrollShadow>

        {/* Footer */}
        {actions && (
          <div className="px-6 py-4 border-t border-divider bg-content1/50 flex items-center justify-end gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
