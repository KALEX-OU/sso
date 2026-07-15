"use client";

import React, { useMemo, useState } from "react";
import { EmptyState, Button } from "../ui";
import { useUIStrings, fmtUI } from "../../lib/ui.localization";
import { useCurrentLocale } from "@/locales/client";
import type { ViewDataAdapter } from "../../lib/view-contract";

/**
 * L4.4 (DS_LAYOUTS_V1_1_PLAN) — Vista Gantt: barre su timeline con zoom
 * settimana/mese, sul contratto dati comune (items + adapter.getDateRange).
 *
 * Implementazione con SOLA CSS grid (nessuna libreria runtime): una colonna
 * per giorno, barre posizionate con grid-column start/span. Le tracce grid
 * sono logiche → in RTL la timeline si specchia da sola. Gli elementi senza
 * intervallo di date vengono esclusi e conteggiati in una nota.
 */

export type GanttZoom = "week" | "month";

const DAY_MS = 24 * 60 * 60 * 1000;

const ZOOM_DAY_WIDTH = {
  week: "3rem",
  month: "1.1rem",
} as const satisfies Record<GanttZoom, string>;

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / DAY_MS);
}

export interface GanttViewProps<T> {
  items: readonly T[];
  adapter: ViewDataAdapter<T>;
  /** Zoom controllato; se assente parte da `defaultZoom` con stato interno. */
  zoom?: GanttZoom;
  onZoomChange?: (zoom: GanttZoom) => void;
  defaultZoom?: GanttZoom;
  /** Render custom della barra; default: titolo dall'adapter. */
  renderBar?: (item: T) => React.ReactNode;
  className?: string;
}

export function GanttView<T>({
  items,
  adapter,
  zoom: zoomProp,
  onZoomChange,
  defaultZoom = "week",
  renderBar,
  className = ""
}: GanttViewProps<T>) {
  const s = useUIStrings();
  const currentLocale = useCurrentLocale();
  const [internalZoom, setInternalZoom] = useState<GanttZoom>(defaultZoom);
  const zoom = zoomProp ?? internalZoom;

  const setZoom = (z: GanttZoom) => {
    if (onZoomChange) onZoomChange(z);
    if (zoomProp === undefined) setInternalZoom(z);
  };

  const { dated, withoutDates, rangeStart, totalDays } = useMemo(() => {
    const withRange: Array<{ item: T; range: { start: Date; end: Date } }> = [];
    let skipped = 0;
    for (const item of items) {
      const range = adapter.getDateRange?.(item);
      if (range && range.end.getTime() >= range.start.getTime()) {
        withRange.push({ item, range });
      } else {
        skipped += 1;
      }
    }
    if (withRange.length === 0) {
      return { dated: withRange, withoutDates: skipped, rangeStart: startOfDay(new Date()), totalDays: 7 };
    }
    let min = withRange[0].range.start;
    let max = withRange[0].range.end;
    for (const { range } of withRange) {
      if (range.start < min) min = range.start;
      if (range.end > max) max = range.end;
    }
    // Margine di respiro: 1 giorno prima e dopo il range dei dati.
    const start = startOfDay(new Date(min.getTime() - DAY_MS));
    const days = daysBetween(start, max) + 2;
    return { dated: withRange, withoutDates: skipped, rangeStart: start, totalDays: days };
  }, [items, adapter]);

  const today = startOfDay(new Date());
  const todayOffset = daysBetween(rangeStart, today);
  const showToday = todayOffset >= 0 && todayOffset < totalDays;

  const dayLabelFormatter = useMemo(
    () => new Intl.DateTimeFormat(currentLocale, { day: "numeric", month: "short" }),
    [currentLocale]
  );

  // Intestazioni: una etichetta al giorno (zoom week) o a inizio settimana (zoom month).
  const headerStep = zoom === "week" ? 1 : 7;

  if (dated.length === 0) {
    return (
      <div className={className}>
        <EmptyState />
      </div>
    );
  }

  const gridTemplate = { gridTemplateColumns: `repeat(${totalDays}, ${ZOOM_DAY_WIDTH[zoom]})` };

  return (
    <div className={`rounded-3xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/40 p-4 ${className}`}>
      {/* Toolbar zoom */}
      <div className="flex items-center justify-end gap-1.5 mb-3">
        {(["week", "month"] as const).map((z) => (
          <Button
            key={z}
            size="sm"
            variant={zoom === z ? "primary" : "ghost"}
            aria-pressed={zoom === z}
            onClick={() => setZoom(z)}
            className="rounded-xl text-[11px] font-bold uppercase tracking-wider px-3"
          >
            {z === "week" ? s.layout.views.gantt.week : s.layout.views.gantt.month}
          </Button>
        ))}
      </div>

      <div className="overflow-x-auto klx-scrollbar-minimalist">
        <div className="min-w-max">
          {/* Intestazione timeline */}
          <div className="grid border-b border-slate-200 dark:border-white/10 pb-1.5 mb-2" style={gridTemplate}>
            {Array.from({ length: totalDays }, (_, i) => {
              const day = new Date(rangeStart.getTime() + i * DAY_MS);
              const isLabel = i % headerStep === 0;
              return (
                <div key={i} className="text-[10px] font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap overflow-visible">
                  {isLabel ? dayLabelFormatter.format(day) : ""}
                </div>
              );
            })}
          </div>

          {/* Righe con barre */}
          <div className="relative flex flex-col gap-1.5">
            {/* Marcatore di oggi */}
            {showToday && (
              <div
                className="absolute inset-block-0 top-0 bottom-0 grid pointer-events-none"
                style={gridTemplate}
                aria-hidden
              >
                <div
                  className="border-s-2 border-dashed border-secondary/60"
                  style={{ gridColumnStart: todayOffset + 1, gridColumnEnd: todayOffset + 2 }}
                  title={s.layout.views.gantt.today}
                />
              </div>
            )}

            {dated.map(({ item, range }) => {
              const id = adapter.getId(item);
              const offset = Math.max(0, daysBetween(rangeStart, range.start));
              const span = Math.max(1, daysBetween(range.start, range.end) + 1);
              return (
                <div key={id} className="grid items-center" style={gridTemplate}>
                  <div
                    className="rounded-xl bg-primary/85 text-white text-[11px] font-bold px-2.5 py-1.5 truncate shadow-sm"
                    style={{ gridColumnStart: offset + 1, gridColumnEnd: `span ${span}` }}
                    title={adapter.getTitle(item)}
                  >
                    {renderBar ? renderBar(item) : adapter.getTitle(item)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {withoutDates > 0 && (
        <p className="mt-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          {fmtUI(s.layout.views.gantt.withoutDates, { n: withoutDates })}
        </p>
      )}
    </div>
  );
}
