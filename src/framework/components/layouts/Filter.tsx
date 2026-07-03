"use client";

import React from "react";
import { Button } from "../ui";
import { X } from "lucide-react";

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

export function Filter({
  activeFilters,
  onRemoveFilter,
  onClearAll,
  className = ""
}: FilterProps) {
  if (activeFilters.length === 0) return null;

  return (
    <div className={`klx-filter-container ${className}`}>
      <span className="klx-filter-label">
        Filtri attivi:
      </span>
      <div className="klx-filter-chips">
        {activeFilters.map((filter) => (
          <div key={filter.id} className="klx-filter-chip">
            <span className="opacity-70 mr-1">{filter.label}:</span>
            <span>{filter.displayValue}</span>
            <button 
              onClick={() => onRemoveFilter(filter.id)} 
              className="klx-filter-chip-remove-btn"
              aria-label={`Rimuovi filtro ${filter.label}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        <Button
          onClick={onClearAll}
          size="sm"
          variant="ghost"
          className="klx-filter-clear-btn"
        >
          Rimuovi tutti
        </Button>
      </div>
    </div>
  );
}
