import { adminDataConnect } from "@/lib/firebase/admin";
import { getOrganizationDetails } from "@/lib/dataconnect-admin";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ orgId?: string }>;
}

export default async function ConnectReturnPage({ searchParams }: PageProps) {
  const { orgId } = await searchParams;

  if (!orgId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-6 font-sans">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <h1 className="text-xl font-bold text-red-400 mb-4">Errore di Configurazione</h1>
          <p className="text-gray-400 text-sm">Parametro orgId non presente nell&apos;URL di reindirizzamento.</p>
        </div>
      </div>
    );
  }

  let onboarded = false;
  let orgName = "";
  let errorMsg: string | null = null;

  try {
    // La verifica dello stato KYC su Stripe è centralizzata nell'API (gateway Hono):
    // SSO NON usa più la STRIPE_SECRET_KEY. Lo stato `stripeConnectOnboarded` è sincronizzato
    // dal webhook `account.updated` (fonte di verità, T1.8). Qui leggiamo semplicemente il DB.
    const orgRes = await getOrganizationDetails(adminDataConnect, { orgId });
    const org = orgRes.data?.organization;

    if (!org || !org.stripeConnectAccountId) {
      throw new Error("Account Stripe Connect non configurato o non trovato per questa organizzazione.");
    }

    orgName = org.name;
    onboarded = !!org.stripeConnectOnboarded;
  } catch (error) {
    console.error("Errore durante verifica ritorno Connect:", error);
    errorMsg = error instanceof Error ? error.message : "Impossibile caricare i dati dell&apos;account Connect.";
  }

  if (errorMsg !== null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-6 font-sans">
        <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <h1 className="text-xl font-bold text-red-400 mb-4">Verifica Fallita</h1>
          <p className="text-gray-400 text-sm mb-6">{errorMsg}</p>
          <Link href="/" className="text-sm font-semibold text-gray-300 hover:text-white underline">
            Torna alla Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-secondary/20 via-slate-900 to-slate-950/20 text-white p-6 font-sans">
      <div className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-3xl p-10 max-w-md w-full shadow-2xl text-center flex flex-col items-center">
        {onboarded ? (
          <>
            {/* Success badge */}
            <div className="w-16 h-16 bg-success/10 border border-success/20 rounded-full flex items-center justify-center mb-6 text-success">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-success to-teal-400 bg-clip-text text-transparent mb-3">
              Account Connesso!
            </h1>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              L&apos;onboarding di Stripe Connect per <strong className="text-white">{orgName}</strong> è completato con successo. Ora puoi ricevere pagamenti split ed incassi per i progetti.
            </p>
          </>
        ) : (
          <>
            {/* Pending/Warning badge */}
            <div className="w-16 h-16 bg-warning/10 border border-warning/20 rounded-full flex items-center justify-center mb-6 text-warning">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            {/* Gradiente warning tokenizzato (era amber→yellow non-token): dissolvenza sul medesimo token */}
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-warning to-warning/60 bg-clip-text text-transparent mb-3">
              KYC non completato
            </h1>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Se hai appena completato l&apos;onboarding, lo stato potrebbe richiedere qualche istante per aggiornarsi: ricarica la pagina tra poco. Se il problema persiste, completa i passaggi richiesti da Stripe per abilitare i payout.
            </p>
          </>
        )}

        <Link
          href="/"
          className="w-full py-3.5 rounded-xl text-sm font-bold bg-white text-slate-950 hover:bg-gray-100 transition-all active:scale-[0.98] shadow-lg text-center"
        >
          Vai alla Dashboard
        </Link>
      </div>
    </div>
  );
}

