// Ponte di ri-autenticazione (step-up auth, 178).
//
// Il backend protegge le operazioni SENSIBILI (eliminazione org, gestione domini custom, conio
// API key) con `mustBeFreshAuth`: se la sessione utente non è stata autenticata di recente ritorna
// 403 `auth/reauth-required`. Il client (`fetchAuthedClient`, codice NON-React in `api.ts`) deve
// allora far ri-autenticare l'utente e ritentare. Questo modulo è il ponte tra quel codice non-React
// e il modal React che raccoglie la password (+ eventuale TOTP): un handler viene registrato dal
// `ReauthProvider` montato in cima all'app; `fetchAuthedClient` lo invoca via `requestReauth()`.
//
// Perché un ponte e non un import diretto: `api.ts` è una libreria priva di contesto React e non può
// renderizzare un modal; il provider vive nell'albero React. Il bridge disaccoppia i due lati senza
// dipendenze cicliche.

type ReauthFn = () => Promise<boolean>;

let handler: ReauthFn | null = null;

/**
 * Registra l'handler che apre il modal di ri-autenticazione. Chiamato UNA volta dal `ReauthProvider`
 * al mount. Ritorna una funzione di de-registrazione (da usare in cleanup dell'effetto).
 */
export function registerReauthHandler(fn: ReauthFn): () => void {
  handler = fn;
  return () => {
    if (handler === fn) handler = null;
  };
}

/**
 * Innesca la ri-autenticazione e attende l'esito. Ritorna `true` se l'utente si è ri-autenticato
 * con successo (il prossimo `getIdToken(true)` avrà un `auth_time` fresco), `false` se ha annullato
 * o se nessun provider è montato (fail-safe: il chiamante non ritenta e propaga il 403 originale).
 */
export async function requestReauth(): Promise<boolean> {
  if (!handler) return false;
  try {
    return await handler();
  } catch {
    return false;
  }
}
