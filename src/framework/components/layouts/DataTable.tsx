"use client";

import React from "react";
import { Table } from "../ui";

/**
 * Tabella dati condivisa dei moduli risorsa (S4, DS_FOUNDATION_HARDENING_PLAN):
 * unifica il tipo colonna (prima duplicato identico in product/invoice) e lo
 * scheletro `ui/Table` con le regole della casa già incorporate — prima
 * colonna `isRowHeader` (nome accessibile delle righe, regola a11y), empty
 * state renderizzato da `Table.Body`, hover/bordi standard.
 */
export interface DataColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  ariaLabel: string;
  columns: ReadonlyArray<DataColumn<T>>;
  items: readonly T[];
  /** Id stabile della riga (chiave React + id react-aria). */
  getRowId: (item: T) => string;
  /** Contenuto mostrato quando `items` è vuoto (già localizzato). */
  emptyState: React.ReactNode;
}

export function DataTable<T extends object>({
  ariaLabel,
  columns,
  items,
  getRowId,
  emptyState,
}: DataTableProps<T>): React.JSX.Element {
  return (
    <Table aria-label={ariaLabel}>
      <Table.ScrollContainer>
        <Table.Content>
          <Table.Header>
            {/* react-aria richiede almeno una colonna isRowHeader */}
            {columns.map((col, idx) => (
              <Table.Column key={col.key} id={col.key} isRowHeader={idx === 0} className="text-xs font-bold">
                {col.header}
              </Table.Column>
            ))}
          </Table.Header>
          <Table.Body
            renderEmptyState={() => (
              <div className="text-center py-8 text-muted-foreground text-xs">{emptyState}</div>
            )}
          >
            {items.map((item) => {
              const rowId = getRowId(item);
              return (
                <Table.Row
                  key={rowId}
                  id={rowId}
                  className="border-b border-divider/40 last:border-0 hover:bg-default-50/50 transition-colors"
                >
                  {columns.map((col) => (
                    <Table.Cell key={col.key} id={`${rowId}-${col.key}`}>
                      {col.render
                        ? col.render(item)
                        : String((item as Record<string, unknown>)[col.key] ?? "")}
                    </Table.Cell>
                  ))}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
