"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDashboard } from "../layouts/DashboardContext";
import { fetchAuthedClient } from "../../lib/api";
import { toAuthError } from "../../lib/auth-error";
import { useBrand } from "../providers/BrandProvider";
import { Card, CardBody, Button } from "../ui";
import { Shield, Check } from "lucide-react";
import {
  multiFactor,
  TotpMultiFactorGenerator,
  type MultiFactorInfo,
  type TotpSecret
} from "firebase/auth";
import { AuthMfaEnrollment } from "../auth/AuthMfaEnrollment";
import { AuthMfaBackupCodes } from "../auth/AuthMfaBackupCodes";
import { useUIStrings, fmtUI } from "../../lib/ui.localization";
import { useI18n } from "@/locales/client";

// E4.2 — Card 2FA (TOTP) delle impostazioni, estratta meccanicamente da settings.tsx:
// enrollment/unenrollment del fattore app di autenticazione (nativo Firebase) e codici
// di backup MFA (173). La challenge di riautenticazione è posseduta dal wrapper Settings
// (executeWithReauthChallenge via prop); la revoca delle altre sessioni post-enroll è
// posseduta da SettingsSecurity (revokeOtherDeviceSessions via prop).

interface SettingsMfaProps {
  /** Avvia la challenge di riautenticazione e riesegue l'azione al successo */
  executeWithReauthChallenge: (action: () => Promise<void>) => void;
  /** Disconnette le ALTRE sessioni device (silent=true dopo l'enroll) */
  revokeOtherDeviceSessions: (silent?: boolean) => Promise<void>;
}

export function SettingsMfa({ executeWithReauthChallenge, revokeOtherDeviceSessions }: SettingsMfaProps) {
  const { user, showToast, refreshClaims } = useDashboard();
  const brand = useBrand();
  const t = useI18n();
  const s = useUIStrings();

  // Stati per la 2FA (MFA) — enrollment nativo Firebase via app di autenticazione (fattore TOTP).
  // L'SMS è stato rimosso: reCAPTCHA Enterprise (App Check) e il phone auth di Firebase non
  // coesistono sul web (conflitto SDK), e il TOTP è comunque il metodo 2FA raccomandato
  // (NIST scoraggia l'SMS per SIM-swap/SS7).
  const [mfaStep, setMfaStep] = useState<"idle" | "totp-verify">("idle");
  const [mfaPending, setMfaPending] = useState(false);
  const [totpSecret, setTotpSecret] = useState<TotpSecret | null>(null);
  const [totpUri, setTotpUri] = useState("");
  // Codici di backup MFA (173): recovery self-service. `backupCodes` è popolato SOLO subito dopo
  // la generazione (mostrati una volta); `backupStatus` è il conteggio residuo letto dal server.
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [backupStatus, setBackupStatus] = useState<{ total: number; remaining: number } | null>(null);
  const [backupPending, setBackupPending] = useState(false);

  // Fattori MFA registrati (app di autenticazione TOTP), letti dallo stato Firebase del client e
  // ricalcolati ad ogni render: dopo enroll/unenroll il setState locale (mfaPending) forza il refresh.
  const enrolledFactors: MultiFactorInfo[] = user ? multiFactor(user).enrolledFactors : [];
  const is2faActive = enrolledFactors.length > 0;
  // Firebase consente al più UN fattore TOTP per utente: il pulsante di enrollment si nasconde se già presente
  const hasTotpFactor = enrolledFactors.some((f) => f.factorId === TotpMultiFactorGenerator.FACTOR_ID);

  const resetMfaFlow = () => {
    setMfaStep("idle");
    setTotpSecret(null);
    setTotpUri("");
  };

  // Gestione centralizzata degli errori MFA. Due casi richiedono una riautenticazione con la
  // password prima di gestire i fattori, dopodiché l'azione viene ritentata:
  //  - auth/requires-recent-login: Firebase esige un login recente per modificare i fattori;
  //  - auth/unsupported-first-factor: la sessione client è stata stabilita via custom token
  //    (bootstrap SSO), il cui first-factor "custom" non consente l'enrollment MFA. La reauth
  //    con EmailAuthProvider porta il first-factor a email/password e sblocca l'operazione.
  const handleMfaError = (err: unknown, retriableAction: () => Promise<void>) => {
    const authErr = toAuthError(err);
    if (
      authErr.code === "auth/requires-recent-login" ||
      authErr.code === "auth/unsupported-first-factor"
    ) {
      showToast(t("settings.toast.mfaManagePwd"), "info");
      executeWithReauthChallenge(retriableAction);
      return;
    }
    console.error("[MFA]", err);
    const msg =
      authErr.code === "auth/invalid-verification-code"
        ? t("settings.toast.mfaCodeInvalid")
        : authErr.code === "auth/code-expired"
          ? t("settings.toast.mfaCodeExpired")
          : authErr.code === "auth/maximum-second-factor-count-exceeded"
            ? t("settings.toast.mfaMaxFactors")
            : authErr.code === "auth/operation-not-allowed"
              ? t("settings.toast.mfaNotAllowed")
              : err instanceof Error
                ? err.message
                : t("settings.toast.mfaGenericError");
    showToast(msg, "error");
  };

  // === 2FA VIA APP DI AUTENTICAZIONE (fattore TOTP, nativo Firebase — 0.7) ===
  // Il provider TOTP è abilitato a livello progetto via scripts/enable-totp-mfa.ts (Admin SDK;
  // la console non espone il toggle). Enrollment: generateSecret → l'utente registra la chiave
  // nella sua app (link otpauth o chiave manuale) → verifica del primo codice → enroll.
  const startTotpEnrollment = async () => {
    if (!user) return;
    const action = async () => {
      setMfaPending(true);
      try {
        const session = await multiFactor(user).getSession();
        const secret = await TotpMultiFactorGenerator.generateSecret(session);
        setTotpSecret(secret);
        setTotpUri(secret.generateQrCodeUrl(user.email || fmtUI(s.settings.totpAccountFallback, { issuer: brand.totpIssuer }), brand.totpIssuer));
        setMfaStep("totp-verify");
      } catch (err) {
        handleMfaError(err, action);
      } finally {
        setMfaPending(false);
      }
    };
    await action();
  };

  const confirmTotpEnrollment = async (code: string) => {
    if (!user || !totpSecret || code.length < 6) return;
    const action = async () => {
      setMfaPending(true);
      try {
        const assertion = TotpMultiFactorGenerator.assertionForEnrollment(totpSecret, code);
        await multiFactor(user).enroll(assertion, t("settings.mfa.factorAppName"));
        await user.reload();
        resetMfaFlow();
        showToast(t("settings.mfa.toastEnrolled"), "success");
        await refreshClaims();
        // Sicurezza: appena la 2FA è attiva, disconnette le ALTRE sessioni (device pre-2FA),
        // così vengono forzate a riautenticarsi col nuovo fattore. Silenzioso (best-effort).
        await revokeOtherDeviceSessions(true);
      } catch (err) {
        handleMfaError(err, action);
      } finally {
        setMfaPending(false);
      }
    };
    await action();
  };

  // Esito copia (chiave TOTP / codici di backup) dai componenti auth → toast.
  const onCopyResult = (ok: boolean) => {
    showToast(ok ? t("settings.mfa.toastCopied") : t("settings.mfa.toastCopyError"), ok ? "success" : "error");
  };

  // === CODICI DI BACKUP MFA (173) — recovery self-service ===
  const loadBackupCodesStatus = useCallback(async () => {
    try {
      const res = await fetchAuthedClient<{ total: number; remaining: number; generatedAt: string | null }>("/api/user/mfa/backup-codes", { method: "GET" });
      if (res.success && res.data) {
        setBackupStatus({ total: res.data.total, remaining: res.data.remaining });
      }
    } catch {
      // Silenzioso: lo stato dei codici non è bloccante per la pagina.
    }
  }, []);

  const generateBackupCodes = async () => {
    setBackupPending(true);
    try {
      const res = await fetchAuthedClient<{ success: boolean; codes: string[] }>("/api/user/mfa/backup-codes", { method: "POST" });
      if (res.success && res.data?.codes) {
        setBackupCodes(res.data.codes);
        await loadBackupCodesStatus();
        showToast(t("settings.mfa.backupToastGenerated"), "success");
      } else {
        throw new Error(res.error?.message || t("settings.mfa.backupToastError"));
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : t("settings.mfa.backupToastError"), "error");
    } finally {
      setBackupPending(false);
    }
  };

  // Carica il conteggio dei codici residui quando la 2FA è attiva. Deferred (Promise.resolve)
  // per evitare setState sincrono nell'effect (cascading renders), come per loadDeviceSessions.
  useEffect(() => {
    if (is2faActive) {
      void Promise.resolve().then(() => loadBackupCodesStatus());
    }
  }, [is2faActive, loadBackupCodesStatus]);

  // === DISATTIVAZIONE DI UN FATTORE (con re-auth imposta da Firebase) ===
  const unenrollFactor = async (factor: MultiFactorInfo) => {
    if (!user) return;
    const action = async () => {
      setMfaPending(true);
      try {
        await multiFactor(user).unenroll(factor);
        await user.reload();
        showToast(t("settings.mfa.toastFactorRemoved"), "success");
        await refreshClaims();
      } catch (err) {
        handleMfaError(err, action);
      } finally {
        setMfaPending(false);
      }
    };
    await action();
  };

  return (
    <Card className="klx-settings-card--full">
      <CardBody>
        <div className="flex items-center justify-between mb-6 border-b border-line pb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-secondary" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-ink">
              {t("settings.mfa.title")}
            </h2>
          </div>
          <div>
            {is2faActive ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider bg-success/15 border border-success/30 text-success rounded-full animate-pulse">
                <Check className="w-3 h-3" /> {t("settings.mfa.badgeActive")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-400 rounded-full">
                {t("settings.mfa.badgeInactive")}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-ink-muted leading-relaxed">
            {t("settings.mfa.intro")}
          </p>

          {/* Fattori attualmente registrati */}
          {enrolledFactors.length > 0 && (
            <div className="space-y-2">
              {enrolledFactors.map((factor) => (
                <div
                  key={factor.uid}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface-2 px-3.5 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-success" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-ink">
                        {factor.displayName || (factor.factorId === TotpMultiFactorGenerator.FACTOR_ID ? t("settings.mfa.factorAppName") : t("settings.mfa.factorGeneric"))}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        {factor.factorId === TotpMultiFactorGenerator.FACTOR_ID ? t("settings.mfa.factorTotpLabel") : t("settings.mfa.factorLegacyLabel")}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => unenrollFactor(factor)}
                    isDisabled={mfaPending}
                    variant="danger-soft"
                  >
                    {t("settings.mfa.remove")}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Avvio enrollment: app di autenticazione (TOTP) */}
          {mfaStep === "idle" && !hasTotpFactor && (
            <div className="pt-2">
              <Button
                onClick={startTotpEnrollment}
                isDisabled={mfaPending}
                variant="primary"
              >
                {t("settings.mfa.enrollCta")}
              </Button>
            </div>
          )}

          {/* Enrollment app di autenticazione (TOTP): componente famiglia auth (N1) */}
          {mfaStep === "totp-verify" && totpSecret && (
            <AuthMfaEnrollment
              className="pt-2"
              totpUri={totpUri}
              secretKey={totpSecret.secretKey}
              loading={mfaPending}
              onConfirm={(code) => void confirmTotpEnrollment(code)}
              onCancel={resetMfaFlow}
              onCopyResult={onCopyResult}
            />
          )}

          {/* Codici di backup MFA (173): recovery self-service, visibili solo con 2FA attiva */}
          {is2faActive && (
            <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-white/10 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-white/90">
                    {t("settings.mfa.backupTitle")}
                  </p>
                  <p className="text-[11px] text-ink-muted mt-0.5">
                    {backupStatus && backupStatus.total > 0
                      ? t("settings.mfa.backupRemaining", { remaining: String(backupStatus.remaining), total: String(backupStatus.total) })
                      : t("settings.mfa.backupNone")}
                  </p>
                </div>
                <Button onClick={() => void generateBackupCodes()} isDisabled={backupPending} variant="ghost">
                  {backupStatus && backupStatus.total > 0 ? t("settings.mfa.backupRegenerate") : t("settings.mfa.backupGenerate")}
                </Button>
              </div>
              <AuthMfaBackupCodes
                codes={backupCodes}
                onDone={() => setBackupCodes([])}
                onCopyResult={onCopyResult}
                downloadFileName={`${brand.totpIssuer.toLowerCase()}-backup-codes.txt`}
              />
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
