"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useDashboard } from "../layouts/DashboardContext";
import { forceCleanSession } from "../../lib/auth";
import { multiFactor, TotpMultiFactorGenerator, type TotpSecret } from "firebase/auth";
import QRCode from "react-qr-code";
import { Card, CardBody, Button, Input } from "../ui";
import { ShieldAlert, Copy, Check } from "lucide-react";
import { useI18n } from "@/locales/client";

const APP_ID = process.env.NEXT_PUBLIC_APP_ID || "sso";

/**
 * Gate di enrollment MFA forzato (174). Se l'org attiva dell'utente richiede il TOTP
 * (`claims.mfaReq`) e l'utente NON ha ancora un secondo fattore enrollato, blocca l'accesso all'app
 * e mostra il flusso di attivazione TOTP obbligatorio. Completato l'enroll, esegue il sign-out così
 * l'utente riaccede CON il TOTP (nuova sessione con `sign_in_second_factor` → l'api sblocca).
 * Se la policy non è attiva o l'utente è già enrollato, rende i `children` invariati.
 */
export function MfaEnrollmentGate({ children }: { children: React.ReactNode }): React.ReactElement {
  const { user, claims } = useDashboard();
  const t = useI18n();

  const mfaRequired = claims?.mfaReq === true;
  const hasTotp = useMemo(() => {
    if (!user) return false;
    return multiFactor(user).enrolledFactors.some((f) => f.factorId === TotpMultiFactorGenerator.FACTOR_ID);
  }, [user]);

  const [step, setStep] = useState<"intro" | "qr">("intro");
  const [secret, setSecret] = useState<TotpSecret | null>(null);
  const [qrUri, setQrUri] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const startEnrollment = useCallback(async () => {
    if (!user) return;
    setBusy(true);
    setError("");
    try {
      const session = await multiFactor(user).getSession();
      const s = await TotpMultiFactorGenerator.generateSecret(session);
      setSecret(s);
      setQrUri(s.generateQrCodeUrl(user.email || "KALEX", "KALEX"));
      setStep("qr");
    } catch {
      setError(t("mfaGate.startError"));
    }
    setBusy(false);
  }, [user, t]);

  const confirmEnrollment = useCallback(async () => {
    if (!user || !secret) return;
    setBusy(true);
    setError("");
    try {
      const assertion = TotpMultiFactorGenerator.assertionForEnrollment(secret, code.trim());
      await multiFactor(user).enroll(assertion, "Authenticator TOTP");
      // Enrollment ok: la sessione corrente è ancora senza 2° fattore → si esce e si riaccede con TOTP.
      await forceCleanSession(APP_ID);
    } catch {
      setError(t("mfaGate.confirmError"));
      setBusy(false);
    }
  }, [user, secret, code, t]);

  // Policy non attiva o utente già conforme → nessun gate.
  if (!mfaRequired || hasTotp) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <Card className="max-w-md w-full border border-amber-500/30">
        <CardBody className="space-y-5 p-6">
          <div className="flex items-center gap-3 text-amber-500">
            <ShieldAlert className="w-7 h-7 shrink-0" />
            <h2 className="text-base font-extrabold uppercase tracking-wider">{t("mfaGate.title")}</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">{t("mfaGate.desc")}</p>

          {step === "intro" && (
            <Button variant="primary" isDisabled={busy} onClick={() => void startEnrollment()} className="w-full">
              {busy ? t("mfaGate.starting") : t("mfaGate.start")}
            </Button>
          )}

          {step === "qr" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-gray-400">{t("mfaGate.scan")}</p>
              {qrUri && (
                <div className="flex justify-center bg-white p-3 rounded-2xl">
                  <QRCode value={qrUri} size={160} />
                </div>
              )}
              {secret && (
                <div className="flex items-center justify-between gap-2 font-mono text-xs bg-slate-100 dark:bg-slate-900 rounded-lg px-3 py-2 border border-slate-200 dark:border-white/10">
                  <span className="truncate">{secret.secretKey}</span>
                  <button
                    type="button"
                    onClick={() => {
                      void navigator.clipboard.writeText(secret.secretKey);
                      setCopied(true);
                    }}
                    className="text-slate-400 hover:text-primary shrink-0"
                    aria-label={t("mfaGate.copy")}
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
              <Input
                type="text"
                inputMode="numeric"
                value={code}
                placeholder={t("mfaGate.codePlaceholder")}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 h-[48px] text-center tracking-[0.4em] text-lg font-bold w-full outline-none"
              />
              <Button
                variant="primary"
                isDisabled={busy || code.length !== 6}
                onClick={() => void confirmEnrollment()}
                className="w-full"
              >
                {busy ? t("mfaGate.verifying") : t("mfaGate.verify")}
              </Button>
            </div>
          )}

          {error && <p className="text-xs font-medium text-red-500">{error}</p>}
          <p className="text-[11px] text-slate-400 dark:text-gray-500 text-center">{t("mfaGate.reloginNote")}</p>
        </CardBody>
      </Card>
    </div>
  );
}
