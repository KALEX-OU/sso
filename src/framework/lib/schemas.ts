import { z } from "zod";

/**
 * Schemi Zod di validazione runtime delle risposte API (follow-up F2.1).
 * Modellati sui contratti REALI delle rotte Hono (api/src/routes), non sui tipi frontend:
 * ogni campo qui presente esiste nella risposta del backend. Gli oggetti sono "loose"
 * (campi extra tollerati) così un'estensione del payload non rompe i client; i campi
 * critici sono invece obbligatori, così un payload malformato viene intercettato da
 * `fetchAuthedClient` come errore `api/invalid-response` invece di propagarsi come dato.
 */

/**
 * Risposta di GET /api/auth/dashboard.
 *
 * Il payload è volutamente AMPIO e consumato in modo lasco (`DashboardData` ha `[key]: unknown`)
 * e cambia forma tra 200 (utente+org, con `user`/`organization`) e 202 (onboarding `pending`).
 * Una validazione campo-per-campo qui è controproducente: farebbe fallire l'intera dashboard al
 * minimo scostamento del backend. Il guard corretto per questo endpoint è quindi MINIMALE — deve
 * solo garantire che la risposta sia un oggetto (non una stringa/array/null propagati come dato) —
 * e i campi noti restano opzionali/lassi. La validazione stretta è appropriata solo per payload
 * ristretti e stabili (vedi `refreshClaimsResponseSchema`, `stripeConnectStatusSchema`).
 */
export const dashboardResponseSchema = z.looseObject({
  success: z.boolean().optional(),
  status: z.string().optional(),
  message: z.string().optional(),
  user: z.looseObject({}).nullable().optional(),
  organization: z.looseObject({}).nullable().optional()
});

/** Risposta di POST /api/auth/claims/refresh (il client legge solo `success`). */
export const refreshClaimsResponseSchema = z.looseObject({
  success: z.boolean()
});

/** Risposta di GET /api/stripe/connect/status (la variante minima ha solo success+onboarded). */
export const stripeConnectStatusSchema = z.looseObject({
  success: z.boolean(),
  stripeConnectAccountId: z.string().nullable().optional(),
  stripeConnectOnboarded: z.boolean(),
  detailsSubmitted: z.boolean().optional(),
  payoutsEnabled: z.boolean().optional(),
  chargesEnabled: z.boolean().optional(),
  currentlyDue: z.array(z.string()).optional(),
  eventuallyDue: z.array(z.string()).optional()
});

/**
 * Risposta dei flussi di redirect Stripe (checkout, portal, connect onboard/login-link):
 * `{ success, url }`. `error` è presente solo nei corpi d'errore letti dai chiamanti
 * che usano la fetch grezza (fuori da fetchAuthedClient).
 */
export const stripeUrlResponseSchema = z.looseObject({
  success: z.boolean(),
  url: z.string().optional(),
  error: z.looseObject({
    message: z.string().optional(),
    code: z.string().optional()
  }).optional()
});
