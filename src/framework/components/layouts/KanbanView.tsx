"use client";

import React, { useMemo, useState } from "react";
import { EmptyState } from "../ui";
import { useUIStrings, fmtUI } from "../../lib/ui.localization";
import type { ViewDataAdapter } from "../../lib/view-contract";

/**
 * L4.3 (DS_LAYOUTS_V1_1_PLAN) — Vista Kanban: colonne per stato sul contratto
 * dati comune (items + adapter).
 *
 * Drag & drop: NATIVO HTML5, attivo solo se il consumer passa `onItemMove`.
 * Decisione L4.1 esplicita: NIENTE @dnd-kit come peer — per lo spostamento di
 * card tra colonne di stato il dnd nativo basta, senza nuove dipendenze né
 * complessità di peerDep nel framework sync-copiato. Limite noto e accettato:
 * niente riordino intra-colonna né touch avanzato; @dnd-kit si rivaluta se
 * quei requisiti diventeranno reali.
 */

export interface KanbanColumn {
  id: string;
  label: string;
  /** Classe colore del pallino di colonna (token: es. "bg-warning"). Default: bg-primary. */
  accentClassName?: string;
}

export interface KanbanViewProps<T> {
  items: readonly T[];
  adapter: ViewDataAdapter<T>;
  columns: readonly KanbanColumn[];
  /** Render custom della card; default: titolo + sottotitolo dall'adapter. */
  renderItem?: (item: T) => React.ReactNode;
  /** Se presente abilita il drag&drop tra colonne (nativo HTML5). */
  onItemMove?: (itemId: string, fromColumnId: string, toColumnId: string) => void;
  className?: string;
}

export function KanbanView<T>({ items, adapter, columns, renderItem, onItemMove, className = "" }: KanbanViewProps<T>) {
  const s = useUIStrings();
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const byColumn = useMemo(() => {
    const map = new Map<string, T[]>();
    for (const col of columns) map.set(col.id, []);
    for (const item of items) {
      const status = adapter.getStatus?.(item);
      if (status !== undefined && map.has(status)) map.get(status)?.push(item);
    }
    return map;
  }, [items, columns, adapter]);

  const draggable = onItemMove !== undefined;

  if (items.length === 0) {
    return (
      <div className={className}>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className={`flex gap-4 overflow-x-auto pb-2 klx-scrollbar-minimalist ${className}`}>
      {columns.map((col) => {
        const colItems = byColumn.get(col.id) || [];
        const isDropTarget = dragOverColumn === col.id;
        return (
          <section
            key={col.id}
            aria-label={col.label}
            className={`flex flex-col shrink-0 w-72 rounded-3xl border transition-colors ${
              isDropTarget
                ? "border-primary/50 bg-primary/5"
                : "border-slate-200 dark:border-white/10 bg-slate-100/60 dark:bg-slate-900/40"
            }`}
            onDragOver={draggable ? (e) => {
              e.preventDefault();
              setDragOverColumn(col.id);
            } : undefined}
            onDragLeave={draggable ? () => setDragOverColumn((cur) => (cur === col.id ? null : cur)) : undefined}
            onDrop={draggable ? (e) => {
              e.preventDefault();
              setDragOverColumn(null);
              const itemId = e.dataTransfer.getData("text/klx-item-id");
              const from = e.dataTransfer.getData("text/klx-from-column");
              if (itemId && from && from !== col.id) onItemMove?.(itemId, from, col.id);
            } : undefined}
          >
            {/* Intestazione colonna */}
            <div className="flex items-center gap-2 px-4 pt-4 pb-2">
              <span className={`w-2 h-2 rounded-full ${col.accentClassName ?? "bg-primary"}`} />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex-1">
                {col.label}
              </h3>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                {fmtUI(s.layout.views.kanban.itemCount, { n: colItems.length })}
              </span>
            </div>

            {/* Card */}
            <div className="flex flex-col gap-2.5 p-3 pt-1 min-h-24">
              {colItems.length === 0 ? (
                <EmptyState size="sm" title={s.layout.views.kanban.columnEmpty} />
              ) : (
                colItems.map((item) => {
                  const id = adapter.getId(item);
                  return (
                    <article
                      key={id}
                      draggable={draggable}
                      onDragStart={draggable ? (e) => {
                        e.dataTransfer.setData("text/klx-item-id", id);
                        e.dataTransfer.setData("text/klx-from-column", col.id);
                        e.dataTransfer.effectAllowed = "move";
                      } : undefined}
                      className={`rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/60 shadow-sm p-3.5 text-start ${
                        draggable ? "cursor-grab active:cursor-grabbing" : ""
                      }`}
                    >
                      {renderItem ? (
                        renderItem(item)
                      ) : (
                        <>
                          <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                            {adapter.getTitle(item)}
                          </p>
                          {adapter.getSubtitle?.(item) && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {adapter.getSubtitle(item)}
                            </p>
                          )}
                        </>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
