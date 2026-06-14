import Stripe from "stripe";
import { adminDataConnect } from "@/lib/firebase/admin";
import { getOrganizationDetails, updateOrganizationStripeConnect } from "@/lib/dataconnect-admin";
import Link from "next/link";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16" as never,
});

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
    // 1. Recupera l'organizzazione e il suo ID Connect dal database PostgreSQL
    const orgRes = await getOrganizationDetails(adminDataConnect, { orgId });
    const org = orgRes.data?.organization;

    if (!org || !org.stripeConnectAccountId) {
      throw new Error("Account Stripe Connect non configurato o non trovato per questa organizzazione.");
    }

    orgName = org.name;

    // 2. Recupera l'account direttamente da Stripe per verificare lo stato di compilazione del KYC
    const account = await stripe.accounts.retrieve(org.stripeConnectAccountId);
    onboarded = account.details_submitted;

    if (onboarded) {
      // Aggiorna lo stato su PostgreSQL impostando stripeConnectOnboarded = true
      await updateOrganizationStripeConnect(adminDataConnect, {
        orgId,
        stripeConnectAccountId: org.stripeConnectAccountId,
        stripeConnectOnboarded: true
      });
    }
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-955/20 text-white p-6 font-sans">
      <div className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-3xl p-10 max-w-md w-full shadow-2xl text-center flex flex-col items-center">
        {onboarded ? (
          <>
            {/* Success badge */}
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-6 text-emerald-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3">
              Account Connesso!
            </h1>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              L&apos;onboarding di Stripe Connect per <strong className="text-white">{orgName}</strong> è completato con successo. Ora puoi ricevere pagamenti split ed incassi per i progetti.
            </p>
          </>
        ) : (
          <>
            {/* Pending/Warning badge */}
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mb-6 text-amber-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent mb-3">
              KYC non completato
            </h1>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Non hai completato tutti i passaggi richiesti da Stripe per verificare il tuo conto. Completa la configurazione per poter abilitare i payout.
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

