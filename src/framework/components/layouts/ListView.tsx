"use client";

import React from "react";
import { TextField, Input, InputGroup, InputGroupPrefix } from "@heroui/react";
import { Filter, ActiveFilter } from "./Filter";
import { Search } from "lucide-react";

interface ListViewProps {
  title: string;
  description?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  activeFilters?: ActiveFilter[];
  onRemoveFilter?: (id: string) => void;
  onClearAllFilters?: () => void;
  filterContent?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ListView({
  title,
  description,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cerca...",
  activeFilters = [],
  onRemoveFilter,
  onClearAllFilters,
  filterContent,
  actions,
  children,
  className = ""
}: ListViewProps) {
  return (
    <div className={`flex flex-col gap-6 w-full ${className}`}>
      {/* Intestazione */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-divider/50 pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 self-start sm:self-center">
            {actions}
          </div>
        )}
      </div>

      {/* Barra dei controlli (Ricerca + Filtri) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="w-full md:max-w-md">
          <TextField value={searchValue} onChange={onSearchChange} aria-label={searchPlaceholder} className="w-full">
            <InputGroup className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2 flex items-center h-[42px] transition-all focus-within:!border-purple-500/80 focus-within:shadow-md focus-within:shadow-purple-500/5 w-full">
              <InputGroupPrefix className="flex items-center justify-center mr-2">
                <Search className="w-4 h-4 text-muted-foreground" />
              </InputGroupPrefix>
              <Input
                placeholder={searchPlaceholder}
                className="bg-transparent border-0 outline-none w-full text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
              />
            </InputGroup>
          </TextField>
        </div>
        {filterContent && (
          <div className="flex items-center gap-2 self-end md:self-center">
            {filterContent}
          </div>
        )}
      </div>

      {/* Visualizzazione Filtri Attivi */}
      {activeFilters.length > 0 && onRemoveFilter && onClearAllFilters && (
        <Filter
          activeFilters={activeFilters}
          onRemoveFilter={onRemoveFilter}
          onClearAll={onClearAllFilters}
          className="border-t border-divider/20 pt-2"
        />
      )}

      {/* Contenuto Principale */}
      <div className="w-full bg-content1 rounded-3xl p-6 shadow-sm border border-divider/30">
        {children}
      </div>
    </div>
  );
}

export type { ActiveFilter };
