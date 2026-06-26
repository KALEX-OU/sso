// api/src/lib/product.config.ts

/**
 * Mappatura dei codici fiscali Stripe (Stripe Tax Codes) supportati da KALEX.
 * Ciascun codice corrisponde a una categoria fiscale specifica di Stripe Tax.
 */
export const STRIPE_TAX_CODES = {
  txcd_10103000: {
    key: "saas_b2b",
    name: "Software as a Service (SaaS) - business use",
    description: "Servizi software cloud erogati ad altre aziende (B2B)."
  },
  txcd_10102000: {
    key: "saas_b2c",
    name: "Software as a Service (SaaS) - consumer use",
    description: "Servizi software cloud erogati a consumatori finali (B2C)."
  },
  txcd_10101000: {
    key: "downloadable_software_b2b",
    name: "Downloadable software - business use",
    description: "Software scaricabile o on-premise per fini commerciali."
  },
  txcd_10104000: {
    key: "downloadable_software_b2c",
    name: "Downloadable software - consumer use",
    description: "Software scaricabile o on-premise per uso privato."
  },
  txcd_20030000: {
    key: "computer_hardware",
    name: "Computer hardware",
    description: "Dispositivi fisici, microcontrollori ed hardware IoT."
  },
  txcd_10503000: {
    key: "it_consulting",
    name: "Business consulting services",
    description: "Servizi di consulenza professionale IT e di sicurezza."
  },
  txcd_00000000: {
    key: "taxable_goods",
    name: "General - taxable goods",
    description: "Beni fisici generici soggetti a tassazione ordinaria."
  },
  txcd_99999999: {
    key: "nontaxable_services",
    name: "General - nontaxable services",
    description: "Servizi generici esenti o non tassabili."
  }
} as const;

export type StripeTaxCode = keyof typeof STRIPE_TAX_CODES;
export type TaxCodeDetail = (typeof STRIPE_TAX_CODES)[StripeTaxCode];
