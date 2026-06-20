"use client";

import React from "react";
import { Button } from "../ui/Button";
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
    <div className={`flex flex-wrap items-center gap-2.5 py-2 ${className}`}>
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
        Filtri attivi:
      </span>
      <div className="flex flex-wrap items-center gap-1.5">
        {activeFilters.map((filter) => (
          <div key={filter.id} className="inline-flex items-center gap-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded-xl px-2.5 py-1 text-xs font-semibold">
            <span className="opacity-70 mr-1">{filter.label}:</span>
            <span>{filter.displayValue}</span>
            <button onClick={() => onRemoveFilter(filter.id)} className="ml-1 hover:text-purple-700 dark:hover:text-purple-300 transition-colors cursor-pointer outline-none flex items-center justify-center">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        <Button
          onClick={onClearAll}
          size="sm"
          variant="ghost"
          className="h-7 min-w-0 px-2 text-xs font-extrabold uppercase tracking-wider rounded-lg text-danger hover:bg-danger/10 active:scale-95 transition-all"
        >
          Rimuovi tutti
        </Button>
      </div>
    </div>
  );
}
