"use client";

import React, { useState } from "react";
import { useDashboard } from "../layouts/DashboardContext";
import { fetchAuthedClient } from "../../lib/api";
import { apiEnvelopeSchema } from "../../lib/schemas/api";
import { toAuthError } from "../../lib/auth-error";
import { Button, Input, Modal } from "../ui";
import { UserPageHeader } from "./UserMain";
import { SettingsProfile } from "../settings/SettingsProfile";
import { SettingsSecurity } from "../settings/SettingsSecurity";
import { AuthReauthDialog } from "../auth/AuthReauthDialog";
import { AlertTriangle } from "lucide-react";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  getMultiFactorResolver,
  TotpMultiFactorGenerator,
  type MultiFactorResolver
} from "firebase/auth";
import { auth, forceCleanSession } from "../../lib/auth";
import { useUIStrings } from "../../lib/ui.localization";
import { useI18n } from "@/locales/client";

/**
 * Pagina PROFILO (/user) — tutto ciò che riguarda la PERSONA: anagrafica e
 * preferenze (SettingsProfile) + sicurezza personale (SettingsSecurity:
 * password, 2FA, sessioni, dispositivi fidati, chiave API personale, danger
 * zone GDPR). Nato dallo split del vecchio wrapper settings a tab: la parte
 * organizzazione vive in UserOrganization, i membri in UserTeam.
 *
 * Possiede i due dialog condivisi della parte utente:
 * - challenge di riautenticazione (password + eventuale TOTP), riusata da
 *   cambio password, gestione MFA ed eliminazione account;
 * - conferma eliminazione account GDPR (ui/Modal, theme-aware).
 */
export function UserProfile() {
  const { user, showToast, claims } = useDashboard();
  const t = useI18n();
  const s = useUIStrings();

  // Stati per il Dialog di Riautenticazione Generale
  const [reauthOpen, setReauthOpen] = useState(false);
  const [reauthPending, setReauthPending] = useState(false);
  const [onReauthSuccess, setOnReauthSuccess] = useState<(() => Promise<void>) | null>(null);
  // Se la reauth richiede il secondo fattore (utente con MFA TOTP attiva), si risolve col
  // codice dell'app di autenticazione prima di completare la riautenticazione.
  const [reauthMfaResolver, setReauthMfaResolver] = useState<MultiFactorResolver | null>(null);
  const [reauthMfaHint, setReauthMfaHint] = useState("");
  const [reauthMfaTotpUid, setReauthMfaTotpUid] = useState("");
  // Errore mostrato INLINE nel dialog di reauth: un toast finirebbe dietro il backdrop del modal.
  const [reauthError, setReauthError] = useState("");

  // Stati per l'Eliminazione GDPR
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletePending, setDeletePending] = useState(false);

  // Challenge di Riautenticazione
  const closeReauth = () => {
    setReauthOpen(false);
    setOnReauthSuccess(null);
    setReauthMfaResolver(null);
    setReauthMfaHint("");
    setReauthError("");
  };

  const executeWithReauthChallenge = (action: () => Promise<void>) => {
    setOnReauthSuccess(() => action);
    setReauthMfaResolver(null);
    setReauthMfaHint("");
    setReauthError("");
    setReauthOpen(true);
  };

  const handleReauthSubmit = async (password: string) => {
    if (!user || !user.email) return;

    try {
      setReauthPending(true);
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      // Reauth completata senza secondo fattore.
      const pending = onReauthSuccess;
      closeReauth();
      showToast(t("settings.toast.reauthOk"), "success");
      if (pending) await pending();
    } catch (err) {
      const authErr = toAuthError(err);
      // Utente con MFA (TOTP) attiva: la reauth richiede il secondo fattore → codice dell'app.
      if (authErr.code === "auth/multi-factor-auth-required") {
        try {
          const resolver = getMultiFactorResolver(auth, err as Parameters<typeof getMultiFactorResolver>[1]);
          const totpHint = resolver.hints.find((h) => h.factorId === TotpMultiFactorGenerator.FACTOR_ID);
          if (!totpHint) {
            throw new Error("Nessun secondo fattore TOTP risolvibile disponibile.");
          }
          setReauthMfaResolver(resolver);
          setReauthMfaTotpUid(totpHint.uid);
          setReauthMfaHint(totpHint.displayName || t("settings.reauth.defaultHint"));
          setReauthError("");
          showToast(t("settings.toast.mfaEnterCode"), "info");
        } catch (mfaErr) {
          console.error("[Reauth MFA] Errore avvio secondo fattore:", mfaErr);
          showToast(t("settings.toast.mfaStartFail"), "error");
        }
        return;
      }
      console.error("[Reauth] Errore:", err);
      const reauthMsg = authErr.code === "auth/wrong-password" || authErr.code === "auth/invalid-credential"
        ? t("settings.toast.reauthWrongPw")
        : t("settings.toast.reauthFail");
      setReauthError(reauthMsg);
      showToast(reauthMsg, "error");
    } finally {
      setReauthPending(false);
    }
  };

  // Secondo step della reauth: verifica il codice TOTP del fattore esistente e completa la reauth.
  const handleReauthMfaVerify = async (code: string) => {
    if (!reauthMfaResolver || !code) return;
    try {
      setReauthPending(true);
      const assertion = TotpMultiFactorGenerator.assertionForSignIn(reauthMfaTotpUid, code);
      await reauthMfaResolver.resolveSignIn(assertion);
      const pending = onReauthSuccess;
      closeReauth();
      showToast(t("settings.toast.identityConfirmed"), "success");
      if (pending) await pending();
    } catch (err) {
      console.error("[Reauth MFA] Errore verifica:", err);
      setReauthError(t("settings.toast.codeInvalidExpired"));
      showToast(t("settings.toast.codeInvalidExpired"), "error");
    } finally {
      setReauthPending(false);
    }
  };

  // Eliminazione GDPR Account
  const handlePurgeAccount = async () => {
    if (deleteConfirmText !== t("settings.deleteDialog.confirmWord")) {
      showToast(t("settings.deleteDialog.typeConfirm", { word: t("settings.deleteDialog.confirmWord") }), "error");
      return;
    }

    const action = async () => {
      try {
        setDeletePending(true);
        const userId = claims?.uId || user?.uid;
        if (!userId) throw new Error(t("settings.toast.userNotIdentified"));

        // 1. Chiama l'endpoint del backend per eliminare i dati da PostgreSQL, team e Firestore
        const resData = await fetchAuthedClient<Record<string, unknown>>(`/api/user/${userId}/account`, {
          method: "DELETE"
        }, {
          validate: (raw): Record<string, unknown> => apiEnvelopeSchema.parse(raw)
        });

        if (!resData.success) {
          throw new Error(resData.error?.message || t("settings.toast.selfDeleteError"));
        }

        // 2. Rimuove l'utente client-side da Firebase Auth
        if (user) {
          await user.delete();
        }

        showToast(t("settings.toast.accountDeleted"), "success");
        setDeleteOpen(false);

        // 3. Pulisce la sessione locale e cookie
        await forceCleanSession();
        window.location.href = "/auth";
      } catch (err) {
        const authErr = toAuthError(err);
        if (authErr.code === "auth/requires-recent-login") {
          executeWithReauthChallenge(action);
        } else {
          console.error(err);
          showToast(err instanceof Error ? err.message : t("settings.toast.accountDeleteFail"), "error");
        }
      } finally {
        setDeletePending(false);
      }
    };

    await action();
  };

  return (
    <div className="space-y-6">
      <UserPageHeader title={s.userPages.profileTitle} description={s.userPages.profileDesc} />

      <SettingsProfile />
      <SettingsSecurity
        executeWithReauthChallenge={executeWithReauthChallenge}
        onRequestAccountDeletion={() => setDeleteOpen(true)}
      />

      {/* DIALOG DI CONFERMA ELIMINAZIONE GDPR — ui/Modal theme-aware (prima era
          un overlay hardcoded dark, illeggibile in tema chiaro). Montato solo
          quando aperto (regola dialoghi in alberi display:none). */}
      {deleteOpen && (
        <Modal isOpen={deleteOpen} onOpenChange={(open) => { if (!open) { setDeleteOpen(false); setDeleteConfirmText(""); } }}>
          <Modal.Backdrop isDismissable className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Modal.Container className="h-auto w-full max-w-md flex-none p-0 sm:w-full sm:p-0">
              <Modal.Dialog className="w-full rounded-3xl border border-danger/30 bg-surface shadow-2xl p-6 space-y-4">
                <div className="flex items-center gap-3 text-danger">
                  <AlertTriangle className="w-6 h-6" />
                  <h3 className="text-base font-extrabold uppercase tracking-wider">
                    {t("settings.deleteDialog.title")}
                  </h3>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">
                  {t("settings.deleteDialog.bodyBefore")} <span className="font-bold text-ink uppercase tracking-widest font-mono bg-danger/15 px-1 rounded">{t("settings.deleteDialog.confirmWord")}</span> {t("settings.deleteDialog.bodyAfter")}
                </p>
                <Input
                  type="text"
                  placeholder={t("settings.deleteDialog.placeholder", { word: t("settings.deleteDialog.confirmWord") })}
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="bg-surface-2 border border-line rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-ink outline-none w-full text-center font-bold tracking-widest"
                />
                <div className="flex gap-3 justify-end pt-2">
                  <Button
                    unstyled
                    variant="ghost"
                    onClick={() => {
                      setDeleteOpen(false);
                      setDeleteConfirmText("");
                    }}
                    className="px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-widest border border-line hover:bg-surface-2 text-ink-muted rounded-xl cursor-pointer active:scale-95 transition-all"
                  >
                    {t("settings.common.cancel")}
                  </Button>
                  <Button
                    unstyled
                    onClick={() => void handlePurgeAccount()}
                    isDisabled={deletePending || deleteConfirmText !== t("settings.deleteDialog.confirmWord")}
                    className="px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-widest bg-danger hover:bg-danger/90 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl active:scale-95 transition-all cursor-pointer shadow-lg"
                  >
                    {deletePending ? t("settings.deleteDialog.deleting") : t("settings.deleteDialog.confirmDelete")}
                  </Button>
                </div>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      )}

      {/* DIALOG DI RIAUTENTICAZIONE MODALE */}
      {reauthOpen && (
        <AuthReauthDialog
          isOpen={reauthOpen}
          step={reauthMfaResolver ? "mfa" : "password"}
          factorHint={reauthMfaHint}
          error={reauthError}
          loading={reauthPending}
          onSubmitPassword={handleReauthSubmit}
          onSubmitCode={handleReauthMfaVerify}
          onCancel={closeReauth}
          onErrorClear={() => setReauthError("")}
        />
      )}
    </div>
  );
}

export default UserProfile;
