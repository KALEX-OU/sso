"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { ShieldAlert, RefreshCw, ArrowLeft } from "lucide-react";

interface RateLimitGuardProps {
  onRetry: () => void | Promise<void>;
  initialCountdown?: number;
}

export function RateLimitGuard({ onRetry, initialCountdown = 5 }: RateLimitGuardProps) {
  const [countdown, setCountdown] = useState(initialCountdown);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleRetry = async () => {
    if (countdown > 0 || isRetrying) return;
    setIsRetrying(true);
    try {
      await onRetry();
    } catch (err) {
      console.error("[RateLimitGuard] Errore durante il ripristino:", err);
      // Resetta il timer in caso di fallimento ulteriore per evitare click continui
      setCountdown(initialCountdown);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleGoBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white font-sans px-6 text-center select-none relative overflow-hidden">
      {/* Background Accent Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[500px] h-[350px] md:h-[500px] rounded-full filter blur-[100px] md:blur-[150px] pointer-events-none bg-purple-500/10 transition-all duration-700"></div>
      
      <div className="relative z-10 max-w-md w-full p-8 border border-white/10 bg-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl space-y-6">
        {/* Warning Icon Banner */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto border border-purple-500/30 animate-pulse">
          <ShieldAlert className="w-8 h-8 text-purple-400" />
        </div>

        {/* Text Copy */}
        <div className="space-y-2">
          <h2 className="text-xl font-black tracking-tight text-white uppercase">
            Richieste Troppo Rapide
          </h2>
          <p className="text-slate-400 text-xs leading-relaxed font-semibold">
            Hai eseguito troppi aggiornamenti della pagina in un breve intervallo di tempo. Per garantire la stabilità del servizio, le richieste frequenti sono momentaneamente limitate.
          </p>
          <p className="text-slate-400 text-xs leading-relaxed font-medium">
            Ti consigliamo di navigare all&apos;interno dell&apos;applicazione usando i menu e i link interni senza ricaricare l&apos;intera pagina.
          </p>
        </div>

        {/* Countdown Indicator */}
        {countdown > 0 ? (
          <div className="py-2 px-4 rounded-xl bg-white/5 border border-white/5 inline-block text-xs font-bold text-purple-400">
            Attendi <span className="text-white text-sm font-black mx-1">{countdown}</span> secondi per riprovare
          </div>
        ) : (
          <div className="py-2 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 inline-block text-xs font-bold text-emerald-400">
            Pronto per il ripristino!
          </div>
        )}

        {/* Actions Button */}
        <div className="flex flex-col gap-2 pt-2">
          <Button
            size="md"
            variant="ghost"
            className={`w-full font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer ${
              countdown > 0 
                ? "bg-purple-600/30 text-purple-400 cursor-not-allowed border border-purple-500/20" 
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg"
            }`}
            onClick={handleRetry}
            isDisabled={countdown > 0 || isRetrying}
          >
            {isRetrying ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                Ripristino...
              </span>
            ) : (
              "Riprova Ora"
            )}
          </Button>

          <Button
            size="md"
            variant="ghost"
            className="w-full font-bold text-xs uppercase tracking-wider rounded-xl border border-white/5 hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer"
            onClick={handleGoBack}
          >
            <ArrowLeft className="w-4 h-4 mr-1 shrink-0" />
            Torna Indietro
          </Button>
        </div>
      </div>
    </div>
  );
}
