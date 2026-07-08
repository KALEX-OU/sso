// Registro APPEND-ONLY degli indici per il codec claims v2 (correzione di design D1).
//
// Gli indici NON sono posizionali: sono STABILI e non vanno MAI riassegnati né riusati.
//  - Nuovo app/modulo  → assegnare il PROSSIMO indice libero (max+1) in coda.
//  - App/modulo rimosso → MANTENERE lo slot (riservato, mai riciclato).
//
// Motivo (D1): l'indice compare nei bitmask di OGNI token già firmato; rimapparlo darebbe
// autorità sul modulo sbagliato per tutti i token in circolazione. Il test
// `claims-codec.test.ts` (a) ANCORA ogni indice corrente a un valore fisso — cambiarlo fa
// fallire la build — e (b) verifica che ogni app/modulo della SSOT
// (`APPLICATION_REGISTRY`/`MODULE_REGISTRY`) abbia un indice qui: aggiungere un modulo alla
// SSOT senza registrarlo in questa mappa fa fallire la build, forzando l'assegnazione
// esplicita del prossimo indice.
//
// Modulo puro e self-contained (nessun import): sincronizzabile as-is in api e functions.

export const CLAIMS_INDEX_VERSION = 1;

// appId → indice stabile
export const CLAIMS_APP_INDEX: Readonly<Record<string, number>> = {
  sso: 0,
  web: 1,
  etics: 2,
  stand: 3,
  drone: 4,
  photogrammetry: 5
};

// moduleId → indice stabile GLOBALE (dallo `MODULE_REGISTRY`): lo stesso modulo ha lo stesso
// indice in ogni app in cui compare (non si assume modulo↔app 1:1).
export const CLAIMS_MODULE_INDEX: Readonly<Record<string, number>> = {
  dashboard: 0,
  user: 1,
  team: 2,
  subscription: 3,
  checkout: 4,
  invoice: 5,
  payment: 6,
  compute: 7,
  product_consume: 8,
  apikey: 9,
  thing: 10,
  product: 11,
  productprice: 12,
  organization: 13
};

// Mappe inverse (indice → id), costruite una sola volta al load.
export const CLAIMS_APP_INDEX_REV: Readonly<Record<number, string>> = Object.freeze(
  Object.fromEntries(Object.entries(CLAIMS_APP_INDEX).map(([k, v]) => [v, k]))
);
export const CLAIMS_MODULE_INDEX_REV: Readonly<Record<number, string>> = Object.freeze(
  Object.fromEntries(Object.entries(CLAIMS_MODULE_INDEX).map(([k, v]) => [v, k]))
);
