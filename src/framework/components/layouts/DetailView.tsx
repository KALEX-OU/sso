"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Button, ScrollShadow } from "../ui";
import { useUIStrings } from "../../lib/ui.localization";

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
  const s = useUIStrings();
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
      className="klx-detail-overlay"
      onClick={onClose}
    >
      <div
        className={`klx-detail-panel ${className}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Intestazione */}
        <div className="klx-detail-header">
          <div>
            <h3 className="klx-detail-title">
              {title}
            </h3>
            {subtitle && (
              <p className="klx-detail-subtitle">
                {subtitle}
              </p>
            )}
          </div>
          <Button
            isIconOnly
            onClick={onClose}
            variant="ghost"
            size="sm"
            aria-label={s.common.closeDetails}
            className="klx-detail-close-btn"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Corpo con ScrollShadow */}
        <ScrollShadow className="klx-detail-body">
          {children}
        </ScrollShadow>

        {/* Footer */}
        {actions && (
          <div className="klx-detail-footer">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
