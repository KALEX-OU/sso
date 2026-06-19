"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentLocale } from "@/locales/client";

export default function ConnectRefreshPage() {
  const router = useRouter();
  const locale = useCurrentLocale();

  useEffect(() => {
    // Reindirizza l'utente alla dashboard dopo 3 secondi per consentirgli di riavviare l'onboarding
    const timer = setTimeout(() => {
      router.push(`/${locale}/dashboard`);
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, locale]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-6 font-sans">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <div className="w-12 h-12 border-4 border-t-white border-white/20 rounded-full animate-spin mx-auto mb-6"></div>
        <h1 className="text-xl font-bold mb-3">Sessione di Onboarding Scaduta</h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          La sessione di configurazione di Stripe Connect è scaduta o è stata aggiornata. Ti stiamo riportando alla dashboard per generarne una nuova...
        </p>
      </div>
    </div>
  );
}
