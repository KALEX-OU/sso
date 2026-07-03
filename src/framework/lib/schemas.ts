import { z } from "zod";

/**
 * Schemi Zod di validazione runtime delle risposte API (follow-up F2.1).
 * Modellati sui contratti REALI delle rotte Hono (api/src/routes), non sui tipi frontend:
 * ogni campo qui presente esiste nella risposta del backend. Gli oggetti sono "loose"
 * (campi extra tollerati) così un'estensione del payload non rompe i client; i campi
 * critici sono invece obbligatori, così un payload malformato viene intercettato da
 * `fetchAuthedClient` come errore `api/invalid-response` invece di propagarsi come dato.
 */

/** Elemento di `organization.subscriptions` (da `subscriptions_on_buyer` in queries.gql). */
const dashboardSubscriptionSchema = z.looseObject({
  subscriptionId: z.string(),
  appId: z.string(),
  status: z.string(),
  buyerId: z.string().optional(),
  sellerId: z.string().optional(),
  items: z.unknown().optional(),
  expiresAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional()
});

/** Risposta 202 di GET /api/auth/dashboard: onboarding ancora in corso. */
const dashboardPendingSchema = z.looseObject({
  success: z.boolean(),
  status: z.literal("pending"),
  message: z.string().optional(),
  organization: z.null().optional()
});

/** Risposta 200 di GET /api/auth/dashboard: utente censito, organizzazione attiva (o null). */
const dashboardReadySchema = z.looseObject({
  success: z.boolean(),
  status: z.string().optional(),
  message: z.string().optional(),
  user: z.looseObject({
    uid: z.string(),
    email: z.string(),
    fullName: z.string().nullable(),
    avatarUrl: z.string().nullable(),
    mobile: z.string().nullable(),
    locale: z.string(),
    theme: z.string(),
    emailVerified: z.boolean()
  }),
  organization: z.looseObject({
    orgId: z.string(),
    name: z.string(),
    type: z.string(),
    country: z.string(),
    confirmed: z.boolean(),
    role: z.string(),
    isTest: z.boolean().optional(),
    viesValidated: z.boolean().optional(),
    subscriptions: z.array(dashboardSubscriptionSchema).optional()
  }).nullable()
});

export const dashboardResponseSchema = z.union([dashboardPendingSchema, dashboardReadySchema]);

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
