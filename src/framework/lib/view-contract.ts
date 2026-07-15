import { z } from "zod";

/**
 * L4.2 (DS_LAYOUTS_V1_1_PLAN) — Contratto dati comune delle viste.
 *
 * Le viste dati (ListView tabellare, KanbanView, GanttView via ViewSwitcher)
 * lavorano sullo STESSO dataset del modulo: `items: readonly T[]` più un
 * adapter tipizzato che estrae i campi necessari. Così il passaggio
 * List↔Kanban↔Gantt non richiede alcuna trasformazione dei dati (obiettivo
 * §1.5 del piano) e il type-checking resta compile-time, senza cast.
 *
 * Per dataset esterni/non tipizzati (fixture, risposte API grezze) è fornito
 * lo schema Zod `viewItemsSchema` con l'adapter già pronto `viewItemAdapter`.
 */

export interface ViewDateRange {
  start: Date;
  end: Date;
}

export interface ViewDataAdapter<T> {
  /** Identificatore stabile dell'elemento (chiavi React, dnd, selezioni). */
  getId(item: T): string;
  /** Titolo mostrato su card/barre. */
  getTitle(item: T): string;
  /** Riga secondaria opzionale (categoria, assegnatario…). */
  getSubtitle?(item: T): string | undefined;
  /** Stato per il raggruppamento in colonne Kanban. */
  getStatus?(item: T): string | undefined;
  /** Intervallo temporale per le barre Gantt. */
  getDateRange?(item: T): ViewDateRange | undefined;
}

/** Elemento normalizzato per fixture e dataset esterni (validato con Zod). */
export const viewItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  status: z.string().optional(),
  start: z.coerce.date().optional(),
  end: z.coerce.date().optional()
});

export type ViewItem = z.infer<typeof viewItemSchema>;

export const viewItemsSchema = z.array(viewItemSchema);

/** Adapter già pronto per dataset conformi a `viewItemSchema`. */
export const viewItemAdapter: ViewDataAdapter<ViewItem> = {
  getId: (item) => item.id,
  getTitle: (item) => item.title,
  getSubtitle: (item) => item.subtitle,
  getStatus: (item) => item.status,
  getDateRange: (item) => (item.start && item.end ? { start: item.start, end: item.end } : undefined)
};
