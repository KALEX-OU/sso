/**
 * Primitive condivise della paginazione keyset KALEX (item 138).
 * Le query List* del connector Data Connect filtrano su (createdAt DESC, id DESC) e
 * richiedono SEMPRE il cursore: la prima pagina usa un timestamp far-future, così il
 * ramo `createdAt < $before` matcha ogni riga e il ramo di spareggio non matcha mai.
 * Client-safe: nessuna dipendenza da Node (il codec base64 del cursore opaco vive
 * lato server in api/src/lib/pagination.ts).
 */

export interface CursorKey {
  createdAt: string;
  id: string;
}

export const DEFAULT_PAGE_LIMIT = 20;
export const MAX_PAGE_LIMIT = 100;

export const FIRST_PAGE_CURSOR: CursorKey = {
  createdAt: "9999-12-31T23:59:59.999Z",
  id: ""
};

/** Variabili keyset per leggere la prima pagina di una query List* via SDK Data Connect. */
export function firstPageListVars(limit: number = MAX_PAGE_LIMIT): { limit: number; beforeCreatedAt: string; beforeId: string } {
  return { limit, beforeCreatedAt: FIRST_PAGE_CURSOR.createdAt, beforeId: FIRST_PAGE_CURSOR.id };
}
