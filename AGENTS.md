<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Regola di Validazione del Codice (Mandatoria)

Prima di rispondere all'utente o considerare completata qualsiasi attività, l'agente DEVE assolutamente eseguire il comando `npm run validate` nella root del progetto. Il codebase deve essere sempre immacolato: **100% privo di errori di compilazione, TypeScript, linter o warning**.

## Regole di Qualità Rigide:
1. **Tipizzazione Forte**: Ogni singola variabile, parametro, e ritorno di funzione deve essere tipizzato correttamente. È severamente vietato l'uso del tipo generico `any` (implicitamente o esplicitamente) o di scorciatoie.
2. **Nessun Bypass**: È vietato silenziare gli avvertimenti o gli errori tramite commenti del tipo `// @ts-ignore`, `// @ts-nocheck`, `/* eslint-disable */`, `eslint-disable-next-line`, o qualsiasi altro meccanismo di bypass dei controlli automatici.
3. **Autocorrezione**: Se il comando `npm run validate` restituisce errori o avvertimenti, l'agente ha l'obbligo di analizzarli, risolverli scrivendo codice corretto, e rieseguire la verifica fino ad ottenere un esito pulito (exit code 0) prima di formulare la risposta per l'utente.

## Linee Guida per Evitare Errori Comuni (Anti-patterns):

Per evitare di reintrodurre errori sistematici nel codebase, attieniti scrupolosamente a queste regole pratiche di sviluppo:

### 1. Mai definire o ritornare JSX all'interno di un blocco `try/catch`
* **Perché**: React non esegue il rendering del JSX immediatamente al momento della sua costruzione. Di conseguenza, eventuali errori di rendering interni al JSX non verrebbero catturati dal `try/catch`, vanificando la gestione degli errori.
* **Come fare**: Esegui nel `try/catch` solo la logica di fetching dei dati, le chiamate asincrone o i calcoli. Salva i risultati o i messaggi di errore in variabili locali ed effettua i ritorni del JSX (di successo o di errore) fuori dal blocco `try/catch`.

### 2. Gestione sicura degli errori nei blocchi `catch` (Zero `any`)
* **Perché**: TypeScript e le regole ESLint del progetto vietano l'uso del tipo esplicito `any` (es. `catch (err: any)`).
* **Come fare**: Usa sempre un costrutto standard `catch (err)`. Per accedere alle proprietà dell'errore in modo sicuro:
  - Per errori standard di sistema o di rete, verifica il tipo: `err instanceof Error ? err.message : "Messaggio di default"`.
  - Per errori con codici specifici (come gli errori Firebase Auth): verifica in modo robusto la struttura dell'oggetto, ad esempio:
    ```typescript
    const errCode = (err && typeof err === "object" && "code" in err && typeof (err as { code: unknown }).code === "string")
      ? (err as { code: string }).code
      : "unknown";
    ```

### 3. Allineamento rigoroso delle dipendenze di `useEffect` e `useCallback`
* **Perché**: Le funzioni esterne chiamate all'interno di un `useEffect` possono cambiare ad ogni render se non memorizzate, portando a loop infiniti o a warning di dipendenze mancanti.
* **Come fare**:
  - Se una funzione viene invocata in un `useEffect`, avvolgila sempre in un `useCallback` e aggiungi tale funzione alle dipendenze dell'effetto.
  - Assicurati che l'array di dipendenze del `useCallback` includa solo le variabili effettivamente utilizzate internamente al callback (evita dipendenze inutili o ridondanti).

### 4. Manutenzione del Linter per Artifact di Build
* **Perché**: File JavaScript compilati automaticamente (come la cartella `functions/lib/`) non devono essere analizzati dal linter radice progettato per TypeScript/Next.js.
* **Come fare**: Se introduci nuovi percorsi di output o build, aggiorna immediatamente l'array `globalIgnores` nel file `eslint.config.mjs` per evitare falsi positivi sui file distribuiti.

### 5. Convenzione File `proxy.ts` (ex `middleware.ts`) in Next.js 16+
* **Perché**: In Next.js 16+, la convenzione del file `middleware.ts` è ufficialmente deprecata. Viene emesso l'avvertimento:
  > `⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy`
  Il file di intercettazione delle richieste deve essere rinominato in `proxy.ts` (o `proxy.js`), e deve esportare una funzione denominata `proxy`.
* **Come fare**: Non creare o utilizzare mai file denominati `middleware.ts`. Utilizza esclusivamente `src/proxy.ts` definendo la funzione di routing come `export function proxy(request: NextRequest)`.

### 6. Avvisi FedCM per Google One Tap (`[GSI_LOGGER]`)
* **Perché**: Con l'obbligatorietà del protocollo FedCM (Federated Credential Management) nei browser, l'SDK di Google Identity Services (`https://accounts.google.com/gsi/client`) emette il seguente avviso per scoraggiare l'uso di metodi legacy di cattura dello stato del prompt:
  > `[GSI_LOGGER]: Your client application uses one of the Google One Tap prompt UI status methods that may stop functioning when FedCM becomes mandatory. Refer to the migration guide to update your code accordingly and opt-in to FedCM to test your changes. Learn more: https://developers.google.com/identity/gsi/web/guides/fedcm-migration?s=dc#display_moment and https://developers.google.com/identity/gsi/web/guides/fedcm-migration?s=dc#skipped_moment (https://accounts.google.com/gsi/client:87:460)`
* **Come fare**: Evitare di utilizzare metodi legacy per determinare se il prompt non è stato mostrato o è stato saltato (come ad es. controlli basati su `isNotDisplayed()` o `isSkippedMoment()`). Gli agenti devono allinearsi con le linee guida di migrazione a FedCM di Google, non introducendo dipendenze bloccanti su questi stati obsoleti.

### 7. Lingua di Comunicazione e dei Documenti (Italiano)
* **Perché**: La lingua principale di lavoro dell'utente è l'italiano.
* **Come fare**: L'agente deve **sempre rispondere in lingua italiana** e redigere sia i piani di implementazione (`implementation_plan.md`) che i resoconti delle modifiche (`walkthrough.md`) **rigorosamente in italiano**.

### 8. Integrazione con HeroUI v3 (Tailwind CSS v4 & Nuove API dei Componenti)
* **Perché**: Questo progetto utilizza **HeroUI v3** (integrato con Tailwind CSS v4). Molte API, strutture dei componenti (come l'adozione del pattern *Compound Components* per elementi complessi come `Checkbox`, `CheckboxGroup` e altri) e metodi di configurazione dei plugin differiscono sostanzialmente rispetto alla versione legacy v2. L'uso di convenzioni v2 (es. definire ed importare il plugin JS `heroui()` in un file `hero.ts`, o usare tag semplici non nidificati) causa errori di compilazione Turbopack o problemi di rendering visivo.
* **Come fare**:
  - **Consultare la documentazione v3**: Prima di utilizzare o modificare qualsiasi componente di HeroUI, è mandatorio consultare l'API reference ufficiale di **HeroUI v3** per verificare la corretta sintassi di composizione e le proprietà supportate, prevenendo errori di rendering (es. l'indicatore grafico mancante nel `Checkbox`).
  - **CSS e Stili**: Non definire o importare plugin JS `heroui`. In `globals.css`, carica direttamente gli stili precompilati usando `@import "@heroui/react/styles";` subito dopo `@import "tailwindcss";`.
  - **Compound Components**: Per i componenti che lo richiedono (es. `Checkbox`), utilizza sempre la struttura di composizione esplicita (es. `Checkbox.Control`, `Checkbox.Indicator`, `Checkbox.Content`) per garantire il corretto markup DOM.

### 9. Non usare emulatori locali di Firebase (Obbligatorio)
* **Perché**: Questo progetto si collega e utilizza direttamente le risorse di produzione/staging di Firebase in Cloud (es. Auth, Data Connect, Firestore, Storage) e non fa uso di emulatori locali. L'avvio o la configurazione degli emulatori locali non è supportata ed è vietata.
* **Come fare**: Non configurare o collegare gli SDK Firebase ad emulatori locali (es. non usare `connectAuthEmulator`, `connectDataConnectEmulator`, o variabili d'ambiente locali come `FIREBASE_AUTH_EMULATOR_HOST` o `DATA_CONNECT_EMULATOR_PORT`). Tutte le modifiche locali dello schema di Data Connect devono essere pubblicate/deployate sul cloud reale di Firebase tramite `npx firebase deploy --only dataconnect`.

### 10. Mantenere Attivi i Server di Sviluppo in Background (npm run dev)
* **Perché**: Per consentire una diagnostica rapida e l'ispezione immediata dei log delle chiamate HTTP e degli errori applicativi, è fondamentale che i server di sviluppo di API (`api/`) e SSO (`sso/`) rimangano costantemente attivi in background come task.
* **Come fare**: Non spegnere i task in background dei server di sviluppo a meno che non sia strettamente necessario. Mantieni sempre attivi i task asincroni in background (`npm run dev` per SSO sulla porta 3000 e `npm run dev` per l'API sulla porta 3001) per ispezionare continuamente i log di runtime tramite lo strumento di gestione dei task o leggendo i file di log dei task.

### 11. Sincronizzazione Database e Schema di Data Connect
* **Perché**: Le modifiche locali apportate allo schema (`schema.gql`) o alle mutazioni/query (`mutations.gql`, `queries.gql`) di Firebase Data Connect non hanno effetto sul database reale e sul servizio Data Connect in Cloud a meno che non vengano esplicitamente migrate e pubblicate. Se il Cloud e il codebase locale non sono allineati, si verificano errori GraphQL di mancata corrispondenza dei campi.
* **Come fare**: Ogni volta che si modifica lo schema o si aggiungono/rimuovono campi o parametri, occorre:
  1. Eseguire la migrazione di Cloud SQL per allineare il database in Cloud:
     `npx firebase dataconnect:sql:migrate --project kalex-cloud --force`
  2. Eseguire il deploy dei connettori e dello schema su Firebase:
     `npx firebase deploy --only dataconnect --project kalex-cloud`

### 12. Allineamento con le API Gateway e OpenAPI
* **Perché**: Le chiamate effettuate dal frontend SSO verso i servizi Hono di backend devono corrispondere rigorosamente alle definizioni fornite dalle specifiche OpenAPI (esposte all'endpoint `/swagger` dell'API centralizzata). Cambiamenti non documentati o non allineati della struttura dei dati o dei codici d'errore (come ad es. `auth/email-not-verified`) possono rompere il flusso di autenticazione e dell'onboarding.
* **Come fare**:
  - Prima di integrare o modificare una chiamata ad Hono dal client React/Next.js, consultare `/openapi.json` o la dashboard Swagger dell'API Gateway locale (porta 3001).
  - Assicurarsi che le strutture dei payload inviati e le risposte ricevute siano completamente tipizzate e allineate con gli schemi definiti nell'API.
