"use client";

import React from "react";
import { TextField, Input, InputGroup, InputGroupPrefix } from "../ui";
import { Filter, ActiveFilter } from "./Filter";
import { Search } from "lucide-react";
import { useUIStrings } from "../../lib/ui.localization";

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
  searchPlaceholder,
  activeFilters = [],
  onRemoveFilter,
  onClearAllFilters,
  filterContent,
  actions,
  children,
  className = ""
}: ListViewProps) {
  const s = useUIStrings();
  const placeholder = searchPlaceholder ?? s.common.search;
  return (
    <div className={`klx-listview-container ${className}`}>
      {/* Intestazione */}
      <div className="klx-listview-header">
        <div>
          <h1 className="klx-listview-title">
            {title}
          </h1>
          {description && (
            <p className="klx-listview-desc">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="klx-listview-actions">
            {actions}
          </div>
        )}
      </div>

      {/* Barra dei controlli (Ricerca + Filtri) */}
      <div className="klx-listview-controls">
        <div className="klx-listview-search-wrapper">
          <TextField value={searchValue} onChange={onSearchChange} aria-label={placeholder} className="w-full">
            <InputGroup className="klx-listview-search-input-group">
              <InputGroupPrefix className="flex items-center justify-center me-2">
                <Search className="w-4 h-4 text-muted-foreground" />
              </InputGroupPrefix>
              <Input
                placeholder={placeholder}
                className="klx-listview-search-input"
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
      <div className="klx-listview-content">
        {children}
      </div>
    </div>
  );
}

export type { ActiveFilter };
