import React, { useEffect } from "react";
import { X } from "lucide-react";
import styles from "./DetailView.module.css";

interface DetailViewProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const DetailView: React.FC<DetailViewProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  actions,
  children,
  className = ""
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.drawer} ${className}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>{title}</h3>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          <button onClick={onClose} className={styles.closeButton} aria-label="Chiudi dettagli">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={styles.body}>
          {children}
        </div>

        {actions && <div className={styles.footer}>{actions}</div>}
      </div>
    </div>
  );
};
