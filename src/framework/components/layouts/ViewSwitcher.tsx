"use client";

import React from "react";
import { List, Columns3, CalendarRange } from "lucide-react";
import { Button, Tooltip } from "../ui";
import { usePersistentString } from "../../lib/use-persistent-toggle";
import { useUIStrings } from "../../lib/ui.localization";

/**
 * L4.5 (DS_LAYOUTS_V1_1_PLAN) — Selettore vista List↔Kanban↔Gantt sullo
 * STESSO dataset (contratto L4.2: il consumer passa le tre viste già legate
 * a items+adapter come render-prop; le viste assenti non compaiono).
 * La preferenza è persistita per modulo via `persistKey` (localStorage,
 * stessa meccanica delle preferenze shell).
 */

export type DataViewKind = "list" | "kanban" | "gantt";

interface ViewDefinition {
  kind: DataViewKind;
  icon: React.ComponentType<{ className?: string }>;
}

const VIEW_DEFS: readonly ViewDefinition[] = [
  { kind: "list", icon: List },
  { kind: "kanban", icon: Columns3 },
  { kind: "gantt", icon: CalendarRange },
];

export interface ViewSwitcherProps {
  /** Chiave di persistenza della preferenza (tipicamente il moduleId). */
  persistKey: string;
  defaultView?: DataViewKind;
  renderList?: () => React.ReactNode;
  renderKanban?: () => React.ReactNode;
  renderGantt?: () => React.ReactNode;
  /** Slot opzionale a inizio riga della toolbar (titolo, filtri…). */
  toolbarStart?: React.ReactNode;
  className?: string;
}

export function ViewSwitcher({
  persistKey,
  defaultView = "list",
  renderList,
  renderKanban,
  renderGantt,
  toolbarStart,
  className = ""
}: ViewSwitcherProps) {
  const s = useUIStrings();
  const renders: Record<DataViewKind, (() => React.ReactNode) | undefined> = {
    list: renderList,
    kanban: renderKanban,
    gantt: renderGantt,
  };
  const available = VIEW_DEFS.filter((def) => renders[def.kind] !== undefined);

  const [persisted, setPersisted] = usePersistentString(`klx-view:${persistKey}`, defaultView);

  const labels: Record<DataViewKind, string> = {
    list: s.layout.views.switcher.list,
    kanban: s.layout.views.switcher.kanban,
    gantt: s.layout.views.switcher.gantt,
  };

  if (available.length === 0) return null;

  const isKind = (value: string): value is DataViewKind =>
    value === "list" || value === "kanban" || value === "gantt";
  const activeKind: DataViewKind =
    isKind(persisted) && renders[persisted] !== undefined ? persisted : available[0].kind;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">{toolbarStart}</div>
        {available.length > 1 && (
          <div
            role="group"
            aria-label={s.layout.views.switcher.list}
            className="flex items-center gap-1 p-1 rounded-2xl border border-line bg-slate-100/70 dark:bg-slate-900/50 shrink-0"
          >
            {available.map(({ kind, icon: Icon }) => (
              <Tooltip key={kind} delay={300}>
                <Tooltip.Trigger>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="ghost"
                    aria-pressed={activeKind === kind}
                    aria-label={labels[kind]}
                    onClick={() => setPersisted(kind)}
                    className={`rounded-xl transition-colors ${
                      activeKind === kind
                        ? "bg-surface text-primary shadow-sm"
                        : "text-ink-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content className="klx-sidebar-tooltip">{labels[kind]}</Tooltip.Content>
              </Tooltip>
            ))}
          </div>
        )}
      </div>

      <div className="klx-motion-page-in">{renders[activeKind]?.()}</div>
    </div>
  );
}
