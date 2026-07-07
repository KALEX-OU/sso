import { getModuleInfo } from "./resources.config";

// Traduzioni EN/ES dei nomi-modulo mostrati nella Sidebar.
//
// L'italiano NON è duplicato qui: resta guidato dalla SSOT
// (`getModuleInfo(moduleId).name` nei file `resources/*.module.ts`), così esiste
// una sola fonte per il default. Questa mappa fornisce solo gli override per le
// locale non-default. Un modulo assente da questa mappa (o una locale non
// gestita) ricade sul nome SSOT: nessun label resta mai vuoto.
type NonDefaultLocale = "en" | "es";

const MODULE_LABEL_TRANSLATIONS: Record<string, Record<NonDefaultLocale, string>> = {
  dashboard: { en: "Dashboard Console", es: "Consola Dashboard" },
  user: { en: "User Management", es: "Gestión de Usuarios" },
  team: { en: "Team Management", es: "Gestión de Equipos" },
  subscription: { en: "Plans & Subscriptions", es: "Planes y Suscripciones" },
  checkout: { en: "Cart & Checkout", es: "Carrito y Pago" },
  invoice: { en: "Invoices & Purchases", es: "Facturas y Compras" },
  payment: { en: "Transactions & Payments", es: "Transacciones y Pagos" },
  compute: { en: "Compute & Serverless IoT", es: "Cómputo y IoT Serverless" },
  product_consume: { en: "Consumption & Metric Logs", es: "Consumo y Registros de Métricas" },
  apikey: { en: "API Keys", es: "Claves API" },
  thing: { en: "Connected Devices (IoT)", es: "Dispositivos Conectados (IoT)" },
  product: { en: "Product & Service Catalog", es: "Catálogo de Productos y Servicios" },
  productprice: { en: "Price Lists", es: "Listas de Precios" },
  organization: { en: "Organizations", es: "Organizaciones" }
};

/**
 * Restituisce l'etichetta localizzata del modulo per la Sidebar.
 * - `it` (o locale non gestita) → nome dalla SSOT (`getModuleInfo`).
 * - `en` / `es` → override dalla mappa, con fallback alla SSOT se mancante.
 */
export function getModuleLabel(moduleId: string, locale: string): string {
  const ssotName = getModuleInfo(moduleId)?.name || moduleId;
  if (locale === "en" || locale === "es") {
    return MODULE_LABEL_TRANSLATIONS[moduleId]?.[locale] ?? ssotName;
  }
  return ssotName;
}
