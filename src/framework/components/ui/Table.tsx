import React from "react";
import styles from "./Table.module.css";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (item: T) => string;
  selectedKeys?: Set<string>;
  onSelectionChange?: (selectedKeys: Set<string>) => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSortChange?: (key: string, direction: "asc" | "desc") => void;
  isLoading?: boolean;
  emptyContent?: React.ReactNode;
  groupActions?: React.ReactNode;
  className?: string;
}

export function Table<T>({
  data,
  columns,
  rowKey,
  selectedKeys,
  onSelectionChange,
  sortKey,
  sortDirection,
  onSortChange,
  isLoading = false,
  emptyContent = "Nessun dato trovato.",
  groupActions,
  className = ""
}: TableProps<T>) {
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSelectionChange) return;
    if (e.target.checked) {
      const keys = new Set(data.map(item => rowKey(item)));
      onSelectionChange(keys);
    } else {
      onSelectionChange(new Set());
    }
  };

  const handleSelectRow = (key: string, checked: boolean) => {
    if (!onSelectionChange || !selectedKeys) return;
    const newKeys = new Set(selectedKeys);
    if (checked) {
      newKeys.add(key);
    } else {
      newKeys.delete(key);
    }
    onSelectionChange(newKeys);
  };

  const handleHeaderClick = (col: Column<T>) => {
    if (!col.sortable || !onSortChange) return;
    const isCurrent = sortKey === col.key;
    const direction = isCurrent && sortDirection === "asc" ? "desc" : "asc";
    onSortChange(col.key, direction);
  };

  const allSelected = data.length > 0 && selectedKeys && selectedKeys.size === data.length;
  const someSelected = selectedKeys && selectedKeys.size > 0 && selectedKeys.size < data.length;

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {selectedKeys && selectedKeys.size > 0 && groupActions && (
        <div className={styles.groupActionsBar}>
          <span className={styles.selectedCount}>
            {selectedKeys.size} element{selectedKeys.size === 1 ? "o selezionato" : "i selezionati"}
          </span>
          <div className={styles.groupActions}>
            {groupActions}
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {onSelectionChange && (
                <th className={styles.checkboxCell}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={input => {
                      if (input) {
                        input.indeterminate = !!someSelected;
                      }
                    }}
                    onChange={handleSelectAll}
                    className={styles.checkbox}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleHeaderClick(col)}
                  className={`${styles.headerCell} ${col.sortable ? styles.sortableHeader : ""} ${col.className || ""}`}
                >
                  <div className={styles.headerContent}>
                    {col.header}
                    {col.sortable && sortKey === col.key && (
                      <span className={styles.sortIndicator}>
                        {sortDirection === "asc" ? " ▲" : " ▼"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (onSelectionChange ? 1 : 0)} className={styles.loadingCell}>
                  <div className={styles.spinnerWrapper}>
                    <div className={styles.spinner} />
                    <span>Caricamento dati...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onSelectionChange ? 1 : 0)} className={styles.emptyCell}>
                  {emptyContent}
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const key = rowKey(item);
                const isSelected = selectedKeys ? selectedKeys.has(key) : false;
                return (
                  <tr key={key} className={`${isSelected ? styles.selectedRow : ""} ${styles.row}`}>
                    {onSelectionChange && (
                      <td className={styles.checkboxCell}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(key, e.target.checked)}
                          className={styles.checkbox}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className={`${styles.bodyCell} ${col.className || ""}`}>
                        {col.render ? col.render(item, index) : ((item as Record<string, unknown>)[col.key] as React.ReactNode)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
