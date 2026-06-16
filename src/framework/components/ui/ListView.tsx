import React from "react";
import { SearchInput } from "./SearchInput";
import { Filter, ActiveFilter } from "./Filter";
import styles from "./ListView.module.css";

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

export const ListView: React.FC<ListViewProps> = ({
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
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>

      <div className={styles.controlsBar}>
        <div className={styles.searchWrapper}>
          <SearchInput
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
          />
        </div>
        {filterContent && <div className={styles.filters}>{filterContent}</div>}
      </div>

      {activeFilters.length > 0 && onRemoveFilter && onClearAllFilters && (
        <div className={styles.chipsRow}>
          <Filter
            activeFilters={activeFilters}
            onRemoveFilter={onRemoveFilter}
            onClearAll={onClearAllFilters}
          />
        </div>
      )}

      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};
export type { ActiveFilter };
