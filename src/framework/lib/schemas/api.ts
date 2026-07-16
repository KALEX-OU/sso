import { z } from "zod";
import { stripeUrlResponseSchema } from "../schemas";

/**
 * Schemi Zod delle risposte API consumate dai moduli app-level (E3.5).
 *
 * Stile allineato a `lib/schemas.ts` (che resta la casa degli schemi auth/Stripe già
 * esistenti — `stripeUrlResponseSchema` viene RIUSATO da qui, non duplicato): oggetti
 * "loose" (`z.looseObject`, campi extra tollerati) così un'estensione del payload non
 * rompe i client, ma con i campi letti dai moduli tipizzati in modo esplicito.
 * Contratto lasco ma validato: un payload malformato viene intercettato da `safeParse`
 * (log + messaggio i18n `errLoad`/simili) invece di propagarsi come dato corrotto.
 *
 * I campi derivano dalle interfacce TS storiche dei moduli (ProductItem,
 * InvoiceItem, SubscriptionItem…): gli identificatori sono obbligatori, i campi di sola
 * presentazione sono optional/nullable perché il backend può ometterli (es. `price` del
 * prodotto non esiste nel registro SSOT: i moduli lo gestiscono con fallback espliciti).
 */

// ==========================================
// ENVELOPE STANDARD (successo/errore)
// ==========================================

/**
 * Errore dell'envelope del gateway (`lib/errors.ts` lato api):
 * `{ code, message, requestId, details? }`; alcune risposte legacy usano una stringa.
 */
export const apiErrorSchema = z.union([
  z.looseObject({
    code: z.string().optional(),
    message: z.string().optional(),
    requestId: z.string().optional(),
    details: z.string().optional()
  }),
  z.string()
]);

/**
 * Envelope minimo comune a tutte le risposte del gateway:
 * `{ success, error?, message? }`. È anche lo schema di ack per le mutazioni
 * senza payload (seat assign/revoke, onboarding complete…).
 */
export const apiEnvelopeSchema = z.looseObject({
  success: z.boolean(),
  error: apiErrorSchema.nullable().optional(),
  message: z.string().optional()
});

export type ApiEnvelope = z.infer<typeof apiEnvelopeSchema>;

/**
 * Estrae il messaggio d'errore leggibile da un envelope (oggetto o stringa legacy);
 * `undefined` se assente → il chiamante applica il proprio fallback i18n.
 */
export function apiErrorMessage(envelope: ApiEnvelope): string | undefined {
  if (typeof envelope.error === "string") return envelope.error;
  return envelope.error?.message;
}

// ==========================================
// PRODUCT — GET /api/product/list
// (consumato sia da ProductModule sia da ApplicationModule)
// ==========================================

export const productItemSchema = z.looseObject({
  productId: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  // Campi del registro SSOT letti dai moduli (ProductModule: type/sku/price; ApplicationModule: mode/orgId/prices)
  mode: z.string().optional(),
  type: z.string().optional(),
  sku: z.string().nullable().optional(),
  price: z.number().optional(),
  isActive: z.boolean().optional(),
  orgId: z.string().optional(),
  prices: z
    .array(
      z.looseObject({
        priceId: z.string().optional(),
        amount: z.number().optional(),
        currency: z.string().optional(),
        interval: z.string().optional()
      })
    )
    .optional()
});

export type ProductItem = z.infer<typeof productItemSchema>;

export const productListResponseSchema = apiEnvelopeSchema.extend({
  items: z.array(productItemSchema).optional()
});

// ==========================================
// SUBSCRIPTION — GET /api/subscription/list
// ==========================================

export const subscriptionItemSchema = z.looseObject({
  service: z.looseObject({
    serviceId: z.string(),
    name: z.string().optional()
  }),
  status: z.string(),
  tier: z.string().nullable().optional(),
  seats: z.number(),
  expiresAt: z.string().nullable().optional()
});

export type SubscriptionItem = z.infer<typeof subscriptionItemSchema>;

export const subscriptionListResponseSchema = apiEnvelopeSchema.extend({
  items: z.array(subscriptionItemSchema).optional(),
  // Alias legacy della lista (il modulo legge `items || subscriptions`)
  subscriptions: z.array(subscriptionItemSchema).optional()
});

// ==========================================
// INVOICE — GET /api/invoice/list
// ==========================================

export const invoiceItemSchema = z.looseObject({
  invoiceId: z.string(),
  amount: z.number(),
  status: z.string(),
  pdfUrl: z.string().nullable().optional(),
  taxPercent: z.number().nullable().optional(),
  taxAmount: z.number().nullable().optional(),
  subtotal: z.number().nullable().optional(),
  createdAt: z.string(),
  // Direzione del flusso calcolata dal backend (buyer → received, seller → issued)
  type: z.enum(["received", "issued"]),
  buyer: z
    .looseObject({ orgId: z.string().optional(), name: z.string().optional() })
    .nullable()
    .optional(),
  seller: z
    .looseObject({ orgId: z.string().optional(), name: z.string().optional() })
    .nullable()
    .optional()
});

export type InvoiceItem = z.infer<typeof invoiceItemSchema>;

export const invoiceListResponseSchema = apiEnvelopeSchema.extend({
  items: z.array(invoiceItemSchema).optional(),
  // Alias legacy della lista (il modulo legge `items || invoices`)
  invoices: z.array(invoiceItemSchema).optional()
});

// ==========================================
// STRIPE — checkout/portal session ({ success, url })
// ==========================================

/** POST /api/stripe/checkout-session, /api/stripe/partner/checkout-session, /api/stripe/checkout. */
export const checkoutSessionResponseSchema = stripeUrlResponseSchema;

/** POST /api/stripe/portal-session, /api/stripe/portal. */
export const portalSessionResponseSchema = stripeUrlResponseSchema;

// ==========================================
// SUBSCRIPTION SEATS — POST /api/subscription/seat/{assign,revoke}
// ==========================================

/** Ack `{ success, message? }` delle mutazioni seat (il modulo legge solo success/error.message). */
export const seatMutationResponseSchema = apiEnvelopeSchema;

// ==========================================
// SETTINGS — organizzazione attiva (payload dashboard)
// ==========================================

/**
 * Campi dell'organizzazione letti dal pannello Settings (form dati aziendali).
 * Sostituisce il doppio cast `as unknown as OrganizationData` su `dbData.organization`:
 * il payload dashboard è lasco (index signature `unknown`), qui viene validato il
 * sottoinsieme minimo effettivamente usato dal form.
 */
export const organizationSettingsSchema = z.looseObject({
  orgId: z.string(),
  name: z.string().optional(),
  type: z.string().optional(),
  country: z.string().optional(),
  vatNumber: z.string().nullable().optional(),
  fiscalCode: z.string().nullable().optional(),
  billingAddress: z.string().nullable().optional(),
  sdiCode: z.string().nullable().optional(),
  officeCode: z.string().nullable().optional(),
  cigCode: z.string().nullable().optional(),
  cupCode: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional()
});

export type OrganizationSettingsData = z.infer<typeof organizationSettingsSchema>;

/* ── Settings / sicurezza account (Z1 DS_FOUNDATION_HARDENING_PLAN) ──────────
   Prima questi fetch erano "fidati" (solo tipizzati): ora ogni res.json()
   dei settings passa da validate: → payload malformato = api/invalid-response. */

export const deviceSessionSchema = z.looseObject({
  id: z.string(),
  createdAt: z.string(),
  lastSeenAt: z.string(),
  userAgent: z.string(),
  ip: z.string(),
  current: z.boolean()
});
export type DeviceSessionData = z.infer<typeof deviceSessionSchema>;

export const deviceSessionsResponseSchema = apiEnvelopeSchema.extend({
  sessions: z.array(deviceSessionSchema).optional()
});

export const trustedDeviceSchema = z.looseObject({
  id: z.string(),
  createdAt: z.string(),
  lastUsedAt: z.string(),
  userAgent: z.string(),
  ip: z.string(),
  expiresAt: z.string(),
  current: z.boolean()
});
export type TrustedDeviceData = z.infer<typeof trustedDeviceSchema>;

export const trustedDevicesResponseSchema = apiEnvelopeSchema.extend({
  devices: z.array(trustedDeviceSchema).optional()
});

/* ── Team (UserTeam: /api/team/list) ─────────────────────────────────────── */

export const teamItemSchema = z.looseObject({
  teamId: z.string(),
  name: z.string(),
  isTest: z.boolean().optional(),
  createdAt: z.string().optional(),
  memberCount: z.number().optional(),
  rbac: z.object({ apps: z.record(z.string(), z.record(z.string(), z.number())) }).nullable().optional()
});
export type TeamItemData = z.infer<typeof teamItemSchema>;

export const teamListResponseSchema = apiEnvelopeSchema.extend({
  items: z.array(teamItemSchema).optional()
});

/* ── Permessi effettivi (P1 RBAC_ENTERPRISE_PLAN: ruolo ∪ team, con fonti) ── */

export const effectiveModulePermissionSchema = z.object({
  mask: z.number(),
  sources: z.array(z.string())
});

export const effectivePermissionsResponseSchema = apiEnvelopeSchema.extend({
  role: z.string().optional(),
  teams: z.array(z.object({ teamId: z.string(), name: z.string() })).optional(),
  permissions: z.record(z.string(), z.record(z.string(), effectiveModulePermissionSchema)).optional()
});
export type EffectivePermissionsResponse = z.infer<typeof effectivePermissionsResponseSchema>;

/* ── Audit permessi (P3 RBAC_ENTERPRISE_PLAN: timeline modifiche) ─────────── */

export const permissionAuditItemSchema = z.looseObject({
  id: z.string(),
  actorUid: z.string(),
  actorRole: z.string(),
  target: z.looseObject({ kind: z.string(), id: z.string(), label: z.string() }),
  action: z.string(),
  before: z.record(z.string(), z.unknown()).nullable().optional(),
  after: z.record(z.string(), z.unknown()).nullable().optional(),
  reason: z.string().optional(),
  ts: z.string()
});
export type PermissionAuditItemData = z.infer<typeof permissionAuditItemSchema>;

export const permissionAuditListResponseSchema = apiEnvelopeSchema.extend({
  items: z.array(permissionAuditItemSchema).optional()
});

export const apiKeyStatusResponseSchema = apiEnvelopeSchema.extend({
  hasKey: z.boolean().optional(),
  keyHash: z.string().optional(),
  name: z.string().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.string().optional()
});

export const apiKeyGenerateResponseSchema = apiEnvelopeSchema.extend({
  apiKey: z.string().optional(),
  keyHash: z.string().optional()
});
