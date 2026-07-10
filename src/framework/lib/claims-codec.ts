// Codec dei custom claims v2 (piano Enterprise Hardening, item P1-100 + correzione D2).
//
// OBIETTIVO: token compatto e versionato, con lettura TOLLERANTE v1↔v2 durante la
// transizione. `encodeClaims` (produttori: blocking fn + refreshUserClaims) comprime la forma
// "lunga" nella forma compatta v2 e applica un guard che DEGRADA (mai lancia, mai lockout).
// `decodeClaims` (3 confini di lettura: middleware JWT, middleware cookie, useAuth client)
// riespande v2 nella STESSA forma lunga che i lettori a valle già si aspettano; un token v1
// (o senza `v`) passa invariato. Così i ~15 lettori a valle non cambiano.
//
// Forma compatta: { v:2, i:uId, o:orgId, r:uRole, c:confirmed, l:loc, av:uAvatar, cc:country,
//   a:{ "<appIdx>": { "<modIdx>":mask, m:mode(0/1/2), e:expire, n:onboarded(0/1) } } }
// Campi droppati perché SENZA lettori (audit): uName, uEmail, orgName, lat, lng, alt, thm.
//
// Modulo puro/portabile (import solo di ./claims-index; `TextEncoder` è universale
// browser+node): sincronizzabile in api e functions.

import {
  CLAIMS_APP_INDEX,
  CLAIMS_MODULE_INDEX,
  CLAIMS_APP_INDEX_REV,
  CLAIMS_MODULE_INDEX_REV
} from "./claims-index";

export const CLAIMS_CODEC_VERSION = 2 as const;
// Margine sotto l'hard-limit Firebase (~1000B sui custom claims serializzati).
export const CLAIMS_BYTE_LIMIT = 900;

const MODE_TO_CODE: Readonly<Record<string, number>> = { buyer: 0, seller: 1, both: 2 };
const CODE_TO_MODE: Readonly<Record<number, string>> = { 0: "buyer", 1: "seller", 2: "both" };

// --- Tipi forma LUNGA (quella attesa dai lettori a valle) ---
// Valori con `undefined` per compatibilità col tipo esistente `AppRbac`.
export type RbacApp = Record<string, number | string | boolean | undefined>; // <module>→mask + mode/expire/onboarded
export interface FullRbac {
  // Valori opzionali per compatibilità con `RbacStructure`/`CustomClaims`
  // ({ [appName: string]: AppRbac | undefined }); encodeClaims salta le app undefined.
  apps?: Record<string, RbacApp | undefined>;
}
// Forma lunga in INPUT a encodeClaims / OUTPUT di decodeClaims. Campi tutti opzionali e nominati
// (niente index signature, così un `CustomClaims` — che non ne ha — resta assegnabile). Include
// anche i campi che encode SCARTA (nessun lettore): così i produttori possono passare l'oggetto
// completo senza errori di excess-property.
export interface FullClaims {
  uId?: string;
  orgId?: string;
  uRole?: string;
  confirmed?: boolean;
  // Policy MFA dell'org attiva (174): true se l'org richiede il TOTP obbligatorio ai membri.
  mfaReq?: boolean;
  loc?: string;
  uAvatar?: string;
  country?: string;
  rbac?: FullRbac;
  // Accettati in input ma droppati in encode (senza lettori a valle):
  uName?: string;
  uEmail?: string;
  orgName?: string;
  lat?: number | null;
  lng?: number | null;
  alt?: number | null;
  thm?: string;
}

// --- Tipi forma COMPATTA (v2) ---
type CompactApp = Record<string, number>; // "<modIdx>"→mask e m/e/n, tutti numerici
export interface CompactClaims {
  v: typeof CLAIMS_CODEC_VERSION;
  i?: string;
  o?: string;
  r?: string;
  c?: boolean;
  mf?: boolean;
  l?: string;
  av?: string;
  cc?: string;
  a?: Record<string, CompactApp>;
}

function byteLen(obj: unknown): number {
  return new TextEncoder().encode(JSON.stringify(obj)).length;
}

/**
 * Forma lunga → compatta v2. Droppa i campi display/geo senza lettori e applica il guard che
 * degrada. Usata dai produttori. Non lancia mai.
 */
export function encodeClaims(full: FullClaims): CompactClaims {
  const out: CompactClaims = { v: CLAIMS_CODEC_VERSION };
  if (full.uId !== undefined) out.i = full.uId;
  if (full.orgId !== undefined) out.o = full.orgId;
  if (full.uRole !== undefined) out.r = full.uRole;
  if (full.confirmed !== undefined) out.c = full.confirmed;
  if (full.mfaReq !== undefined) out.mf = full.mfaReq;
  if (full.loc !== undefined) out.l = full.loc;
  if (full.uAvatar) out.av = full.uAvatar; // stringa vuota → droppata
  if (full.country !== undefined) out.cc = full.country;

  const apps = full.rbac?.apps;
  if (apps) {
    const a: Record<string, CompactApp> = {};
    for (const [appId, appObj] of Object.entries(apps)) {
      const appIdx = CLAIMS_APP_INDEX[appId];
      if (appIdx === undefined || !appObj) continue; // app non registrata nel lock o valore assente
      const ca: CompactApp = {};
      for (const [key, val] of Object.entries(appObj)) {
        if (key === "mode") ca.m = MODE_TO_CODE[String(val)] ?? 0;
        else if (key === "expire") ca.e = typeof val === "number" ? val : Number(val) || 0;
        else if (key === "onboarded") ca.n = val ? 1 : 0;
        else {
          const modIdx = CLAIMS_MODULE_INDEX[key];
          if (modIdx !== undefined && typeof val === "number") ca[String(modIdx)] = val;
        }
      }
      a[String(appIdx)] = ca;
    }
    out.a = a;
  }

  return applyByteGuard(out);
}

/**
 * Guard che DEGRADA in stadi finché il token compatto sta sotto `CLAIMS_BYTE_LIMIT`.
 * Non lancia MAI: meglio permessi ridotti (ricostruibili da ruolo+SSOT) che un lockout.
 */
function applyByteGuard(c: CompactClaims): CompactClaims {
  if (byteLen(c) <= CLAIMS_BYTE_LIMIT) return c;
  // Stadio 1: droppa avatar + locale (display/preferenza, ricavabili altrove).
  delete c.av;
  delete c.l;
  if (byteLen(c) <= CLAIMS_BYTE_LIMIT) return c;
  // Stadio 2: riduci l'RBAC alle sole app core (sso, web), scartando le commerciali.
  if (c.a) {
    const coreIdx = new Set([String(CLAIMS_APP_INDEX.sso), String(CLAIMS_APP_INDEX.web)]);
    const reduced: Record<string, CompactApp> = {};
    for (const [k, v] of Object.entries(c.a)) if (coreIdx.has(k)) reduced[k] = v;
    c.a = reduced;
  }
  // Stadio 3 (estremo): si ritorna comunque il core — mai un lockout. Il produttore logga
  // un alert quando `isDegraded` risulta true.
  return c;
}

/** True se il token compatto è stato degradato dal guard (per alert lato produttore). */
export function isDegraded(encoded: CompactClaims): boolean {
  return byteLen(encoded) > CLAIMS_BYTE_LIMIT;
}

/**
 * TOLLERANTE. Se `raw.v === 2` riespande la forma compatta nella forma lunga (mantenendo i
 * campi Firebase standard di `raw`); altrimenti (v1 o senza `v`) ritorna `raw` invariato,
 * perché è già forma lunga. Usata ai 3 confini di lettura.
 */
export function decodeClaims<T extends Record<string, unknown>>(raw: T): T & FullClaims {
  if (!raw || (raw as { v?: unknown }).v !== CLAIMS_CODEC_VERSION) {
    return raw as T & FullClaims; // v1 o ignoto: già forma lunga
  }
  const c = raw as unknown as CompactClaims;
  const full: FullClaims = {};
  if (c.i !== undefined) full.uId = c.i;
  if (c.o !== undefined) full.orgId = c.o;
  if (c.r !== undefined) full.uRole = c.r;
  if (c.c !== undefined) full.confirmed = c.c;
  if (c.mf !== undefined) full.mfaReq = c.mf;
  if (c.l !== undefined) full.loc = c.l;
  if (c.av !== undefined) full.uAvatar = c.av;
  if (c.cc !== undefined) full.country = c.cc;

  if (c.a) {
    const apps: Record<string, RbacApp> = {};
    for (const [appIdxStr, ca] of Object.entries(c.a)) {
      const appId = CLAIMS_APP_INDEX_REV[Number(appIdxStr)];
      if (appId === undefined) continue;
      const appObj: RbacApp = {};
      for (const [k, val] of Object.entries(ca)) {
        if (k === "m") appObj.mode = CODE_TO_MODE[val] ?? "buyer";
        else if (k === "e") appObj.expire = val;
        else if (k === "n") appObj.onboarded = val === 1;
        else {
          const modId = CLAIMS_MODULE_INDEX_REV[Number(k)];
          if (modId !== undefined) appObj[modId] = val;
        }
      }
      apps[appId] = appObj;
    }
    full.rbac = { apps };
  }

  // Sovrappone la forma lunga ai campi standard di `raw` (uid, email, iat, exp, ...).
  return { ...raw, ...full } as T & FullClaims;
}
