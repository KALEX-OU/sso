/**
 * Risoluzione centralizzata degli URL base lato client/SSR, guidata da env `NEXT_PUBLIC_*` con
 * default sul dominio corrente (`kalexs.com`). Elimina gli hardcode sparsi del vecchio dominio:
 * ogni ambiente (dev/staging/prod) sovrascrive via variabili d'ambiente.
 */

const PUBLIC_BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN?.trim() || "kalexs.com";

/** Base URL del gateway SSO (dove vivono le pagine auth/login). */
export function getSsoBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SSO_URL?.trim() || `https://sso.${PUBLIC_BASE_DOMAIN}`;
}

/** Base URL dell'API gateway. */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.trim() || `https://api.${PUBLIC_BASE_DOMAIN}`;
}
