"use client";

import React, { useState } from "react";
import { useDashboard } from "../layouts/DashboardContext";
import { fetchAuthedClient } from "../../lib/api";
import { Card, CardBody, Tabs, Tab, TabList, Input } from "../ui";
import { DomainManagement } from "./DomainManagement";
import { SettingsProfile } from "./SettingsProfile";
import { SettingsSecurity } from "./SettingsSecurity";
import { SettingsOrganization } from "./SettingsOrganization";
import {
  User as UserIcon,
  AlertTriangle
} from "lucide-react";
import { AuthReauthDialog } from "../auth/AuthReauthDialog";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  getMultiFactorResolver,
  TotpMultiFactorGenerator,
  type MultiFactorResolver
} from "firebase/auth";
import { auth, forceCleanSession } from "../../lib/auth";
import { useI18n } from "@/locales/client";

// E4.2 — Wrapper della pagina Impostazioni: possiede i Tabs (profilo/organizzazione/domini)
// e compone le sezioni estratte (SettingsProfile, SettingsSecurity, SettingsOrganization,
// DomainManagement). Possiede inoltre i due dialog modali condivisi, che devono restare
// figli diretti del container (stesso DOM di prima dello split):
//  - challenge di riautenticazione (password + eventuale secondo fattore TOTP), riusata da
//    cambio password, gestione MFA ed eliminazione account (via executeWithReauthChallenge);
//  - conferma eliminazione account GDPR (handlePurgeAccount usa la challenge di reauth).

export function Settings() {
  const { user, showToast, claims } = useDashboard();
  const t = useI18n();
  const [activeTab, setActiveTab] = useState("user");

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

  // Ruolo dell'utente loggato nell'organizzazione (uRole / role fallback)
  const activeRole = claims?.uRole || claims?.role;
  const isOrgManager = activeRole === "owner" || activeRole === "admin";
  const currentTab = isOrgManager ? activeTab : "user";

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
      const authErr = err as { code?: string };
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
        const authErr = err as { code?: string };
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
    <div className="klx-settings-container">
      <div>
        <h1 className="klx-settings-header-title">
          <UserIcon className="w-5 h-5 text-secondary" /> {t("settings.header.title")}
        </h1>
        <p className="klx-settings-header-desc">
          {t("settings.header.desc")}
        </p>
      </div>

      {isOrgManager ? (
        <Tabs
          selectedKey={currentTab}
          onSelectionChange={(key) => setActiveTab(key as string)}
          aria-label={t("settings.tabs.ariaLabel")}
          className="w-full"
        >
          <TabList className="klx-settings-tabs-list">
            <Tab
              id="user"
              className="klx-settings-tab-trigger"
            >
              {t("settings.tabs.profile")}
            </Tab>
            <Tab
              id="organization"
              className="klx-settings-tab-trigger"
            >
              {t("settings.tabs.organization")}
            </Tab>
            <Tab
              id="domains"
              className="klx-settings-tab-trigger"
            >
              {t("settings.tabs.domains")}
            </Tab>
          </TabList>
        </Tabs>
      ) : null}

      {/* ========================================== */}
      {/* TAB 1: PROFILO & SICUREZZA                 */}
      {/* ========================================== */}
      {currentTab === "user" && (
        <div className="space-y-8">
          <SettingsProfile />
          <SettingsSecurity
            executeWithReauthChallenge={executeWithReauthChallenge}
            onRequestAccountDeletion={() => setDeleteOpen(true)}
          />
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: DATI FISCALI ORGANIZZAZIONE          */}
      {/* ========================================== */}
      {currentTab === "organization" && isOrgManager && <SettingsOrganization />}

      {/* ========================================== */}
      {/* TAB 3: DOMINI (white-label §3-bis)         */}
      {/* ========================================== */}
      {currentTab === "domains" && isOrgManager && <DomainManagement />}

      {/* ========================================== */}
      {/* DIALOG DI CONFIRMA ELIMINAZIONE GDPR       */}
      {/* ========================================== */}
      {deleteOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border border-red-500/30 bg-slate-950 rounded-3xl p-6 shadow-2xl relative">
            <CardBody className="space-y-4">
              <div className="flex items-center gap-3 text-red-500">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-base font-extrabold uppercase tracking-wider">
                  {t("settings.deleteDialog.title")}
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t("settings.deleteDialog.bodyBefore")} <span className="font-bold text-white uppercase tracking-widest font-mono bg-red-950 px-1 rounded">{t("settings.deleteDialog.confirmWord")}</span> {t("settings.deleteDialog.bodyAfter")}
              </p>
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder={t("settings.deleteDialog.placeholder", { word: t("settings.deleteDialog.confirmWord") })}
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="bg-white/5 dark:bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-white outline-none w-full text-center font-bold tracking-widest"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteOpen(false);
                    setDeleteConfirmText("");
                  }}
                  className="px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-widest bg-transparent border border-slate-800 hover:bg-slate-900 text-slate-400 rounded-xl cursor-pointer active:scale-95 transition-all"
                >
                  {t("settings.common.cancel")}
                </button>
                <button
                  type="button"
                  onClick={handlePurgeAccount}
                  disabled={deletePending || deleteConfirmText !== t("settings.deleteDialog.confirmWord")}
                  className="px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-widest bg-red-600 hover:bg-red-700 disabled:bg-red-900/50 disabled:text-red-400/50 disabled:cursor-not-allowed text-white rounded-xl active:scale-95 transition-all border-none flex items-center gap-1 shadow-lg"
                >
                  {deletePending ? t("settings.deleteDialog.deleting") : t("settings.deleteDialog.confirmDelete")}
                </button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* ========================================== */}
      {/* DIALOG DI RIAUTENTICAZIONE MODALE          */}
      {/* ========================================== */}
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

export default Settings;
