import React from "react";
import { X } from "lucide-react";
import styles from "./Filter.module.css";

export interface ActiveFilter {
  id: string;
  label: string;
  value: string;
  displayValue: string;
}

interface FilterProps {
  activeFilters: ActiveFilter[];
  onRemoveFilter: (id: string) => void;
  onClearAll: () => void;
  className?: string;
}

export const Filter: React.FC<FilterProps> = ({
  activeFilters,
  onRemoveFilter,
  onClearAll,
  className = ""
}) => {
  if (activeFilters.length === 0) return null;

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.label}>Filtri attivi:</div>
      <div className={styles.chips}>
        {activeFilters.map((filter) => (
          <div key={filter.id} className={styles.chip}>
            <span className={styles.chipText}>
              <strong>{filter.label}:</strong> {filter.displayValue}
            </span>
            <button
              onClick={() => onRemoveFilter(filter.id)}
              className={styles.chipButton}
              aria-label={`Rimuovi filtro ${filter.label}`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button onClick={onClearAll} className={styles.clearButton}>
          Rimuovi tutti
        </button>
      </div>
    </div>
  );
};
