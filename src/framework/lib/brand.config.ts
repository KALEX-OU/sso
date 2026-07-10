import type { LucideIconName } from "./resources.config";

/**
 * Configurazione di brand (white-label) — E1 DS_REFACTORING_V1_PLAN.
 *
 * UNICA fonte dei valori di brand non-colore: identità (nome, logo, copyright),
 * regole commerciali (valuta, organizzazione di sistema venditrice) e catalogo
 * (mappe icone/prodotti). I COLORI del brand vivono invece nel blocco CSS
 * `[data-brand="<id>"]` di `styles/globals.css`: il BrandProvider applica
 * `data-brand` a <html> e il resto discende dai token `--klx-*`.
 *
 * Regola tassativa: nei componenti NIENTE valori di brand cablati — sempre
 * `useBrand()` (components/providers/BrandProvider.tsx).
 */
export interface BrandConfig {
  /** Identificativo del brand: diventa l'attributo `data-brand` su <html>. */
  readonly id: string;
  /** Nome commerciale mostrato in UI (sidebar, titoli moduli, copy). */
  readonly name: string;
  /** Sigla del logo (monogramma nella sidebar). */
  readonly logoMark: string;
  /** Riga di copyright nel footer della sidebar. */
  readonly copyright: string;
  /** Valuta ISO 4217 per prezzi e fatture. */
  readonly currency: string;
  /** Locale BCP 47 usato per formattare importi/valute (Intl.NumberFormat). */
  readonly numberLocale: string;
  /** Nome venditore di default sulle fatture quando il seller non è noto. */
  readonly sellerName: string;
  /** orgId dell'organizzazione di sistema che vende i prodotti/servizi del brand. */
  readonly sellerOrgId: string;
  /** Issuer mostrato nelle app authenticator per l'enrollment TOTP. */
  readonly totpIssuer: string;
  /** Catalogo del brand: icone dei servizi e mappa prodotto→app. */
  readonly catalog: {
    /** serviceId/appId → nome icona Lucide (fallback: "Cloud"). */
    readonly serviceIcons: Readonly<Record<string, LucideIconName>>;
    /** productId Stripe → appId verticale. */
    readonly productIdToAppId: Readonly<Record<string, string>>;
  };
}

/** Brand di default: KALEX. */
export const KALEX_BRAND: BrandConfig = {
  id: "kalex",
  name: "KALEX",
  logoMark: "K",
  copyright: "© KALEX CLOUDTECH OÜ",
  currency: "EUR",
  numberLocale: "it-IT",
  sellerName: "KALEX CLOUD",
  sellerOrgId: "KALEX_SYSTEM_ORG",
  totpIssuer: "KALEX",
  catalog: {
    serviceIcons: {
      etics: "Hammer",
      stand: "Layout",
      drone: "Navigation",
      photogrammetry: "Camera",
    },
    productIdToAppId: {
      prod_etics: "etics",
      prod_stand: "stand",
      prod_drone: "drone",
      prod_photogrammetry: "photogrammetry",
    },
  },
};

/**
 * Brand DEMO per il collaudo white-label (palette in [data-brand="acme"]).
 * Stesso catalogo/sistema di KALEX: cambia solo l'identità visibile.
 */
export const ACME_BRAND: BrandConfig = {
  ...KALEX_BRAND,
  id: "acme",
  name: "ACME",
  logoMark: "A",
  copyright: "© ACME Industries Ltd",
  sellerName: "ACME CLOUD",
  totpIssuer: "ACME",
};

export const BRAND_PRESETS: Readonly<Record<string, BrandConfig>> = {
  kalex: KALEX_BRAND,
  acme: ACME_BRAND,
};

/** Risolve un id brand (es. da NEXT_PUBLIC_KALEX_BRAND) nel preset; default KALEX. */
export function resolveBrand(brandId?: string | null): BrandConfig {
  if (brandId && Object.prototype.hasOwnProperty.call(BRAND_PRESETS, brandId)) {
    return BRAND_PRESETS[brandId];
  }
  return KALEX_BRAND;
}
