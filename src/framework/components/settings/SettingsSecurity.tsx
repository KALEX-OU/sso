"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useDashboard } from "../layouts/DashboardContext";
import { fetchAuthedClient } from "../../lib/api";
import { Card, CardBody, Button, Input, Label } from "../ui";
import { SettingsMfa } from "./SettingsMfa";
import { SettingsApiKey } from "./SettingsApiKey";
import {
  Key,
  Shield,
  Trash,
  AlertTriangle,
  Eye,
  EyeOff
} from "lucide-react";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "firebase/auth";
import { forceCleanSession } from "../../lib/auth";
import { useUIStrings } from "../../lib/ui.localization";
import { useI18n } from "@/locales/client";

// E4.2 — Sezione "Sicurezza" delle impostazioni, estratta meccanicamente da settings.tsx:
// cambio password con indicatore di forza, card 2FA (SettingsMfa), sessioni/dispositivi
// attivi (3.2), chiave API personale (SettingsApiKey) e danger zone GDPR (il dialog di
// conferma eliminazione è posseduto dal wrapper Settings, aperto via onRequestAccountDeletion).

// Sessione/dispositivo attivo restituito da /api/auth/sessions (3.2)
interface DeviceSession {
  id: string;
  createdAt: string;
  lastSeenAt: string;
  userAgent: string;
  ip: string;
  current: boolean;
}

interface SettingsSecurityProps {
  /** Avvia la challenge di riautenticazione (posseduta dal wrapper) e riesegue l'azione al successo */
  executeWithReauthChallenge: (action: () => Promise<void>) => void;
  /** Apre il dialog di conferma eliminazione account GDPR (posseduto dal wrapper) */
  onRequestAccountDeletion: () => void;
}

export function SettingsSecurity({ executeWithReauthChallenge, onRequestAccountDeletion }: SettingsSecurityProps) {
  const { user, showToast } = useDashboard();
  const t = useI18n();
  const s = useUIStrings();

  // Stati per il modulo Cambio Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordPending, setPasswordPending] = useState(false);

  // Stati per la gestione sessioni/dispositivi (3.2)
  const [deviceSessions, setDeviceSessions] = useState<DeviceSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionRevokePending, setSessionRevokePending] = useState("");
  const [revokeOthersPending, setRevokeOthersPending] = useState(false);

  // Funzione per validare la forza della password
  const passwordStrength = useMemo(() => {
    if (!newPassword) return null;
    if (newPassword.length < 6) return { level: "short" as const, color: "text-danger bg-danger/10 border-danger/20", width: "w-1/4" };

    let score = 0;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;

    if (score === 0) return { level: "weak" as const, color: "text-orange-500 bg-orange-500/10 border-orange-500/20", width: "w-2/4" };
    if (score === 1 || score === 2) return { level: "medium" as const, color: "text-amber-500 bg-amber-500/10 border-amber-500/20", width: "w-3/4" };
    return { level: "strong" as const, color: "text-success bg-success/10 border-success/20", width: "w-full" };
  }, [newPassword]);

  // Cambio Password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword !== confirmPassword) {
      showToast(t("settings.toast.pwdMismatch"), "error");
      return;
    }

    const action = async () => {
      try {
        setPasswordPending(true);
        await updatePassword(user, newPassword);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        showToast(t("settings.toast.pwdUpdated"), "success");
      } catch (err) {
        const authErr = err as { code?: string };
        if (authErr.code === "auth/requires-recent-login") {
          executeWithReauthChallenge(action);
        } else {
          console.error(err);
          showToast(t("settings.toast.pwdChangeFail"), "error");
        }
      } finally {
        setPasswordPending(false);
      }
    };

    // Tenta il cambio (reautenticando prima se possibile)
    try {
      setPasswordPending(true);
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast(t("settings.toast.pwdUpdated"), "success");
    } catch (err) {
      const authErr = err as { code?: string };
      if (authErr.code === "auth/requires-recent-login" || authErr.code === "auth/wrong-password" || authErr.code === "auth/invalid-credential") {
        showToast(t("settings.toast.pwdCredWrong"), "error");
      } else {
        await action();
      }
    } finally {
      setPasswordPending(false);
    }
  };

  // === SESSIONI / DISPOSITIVI ATTIVI (3.2) ===
  const loadDeviceSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const res = await fetchAuthedClient<{ success: boolean; sessions: DeviceSession[] }>("/api/auth/sessions", { method: "GET" });
      if (res.success && res.data && Array.isArray(res.data.sessions)) {
        setDeviceSessions(res.data.sessions);
      }
    } catch (err) {
      console.warn("[Settings] Impossibile caricare le sessioni attive:", err);
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Deferred per evitare setState sincrono nell'effect (cascading renders)
    void Promise.resolve().then(() => loadDeviceSessions());
  }, [loadDeviceSessions]);

  const revokeDeviceSession = async (session: DeviceSession) => {
    setSessionRevokePending(session.id);
    try {
      const res = await fetchAuthedClient<Record<string, unknown>>(`/api/auth/sessions/${session.id}`, { method: "DELETE" });
      if (!res.success) {
        throw new Error(res.error?.message || t("settings.toast.deviceDisconnectFail"));
      }
      if (session.current) {
        // Disconnessa la sessione di QUESTO device: si completa con un logout pulito
        await forceCleanSession();
        window.location.assign("/auth");
        return;
      }
      showToast(t("settings.toast.deviceDisconnected"), "success");
      await loadDeviceSessions();
    } catch (err) {
      showToast(err instanceof Error ? err.message : t("settings.toast.deviceDisconnectFail"), "error");
    } finally {
      setSessionRevokePending("");
    }
  };

  // Disconnette tutte le ALTRE sessioni (non quella corrente). Azione manuale e, in automatico,
  // all'attivazione della 2FA: ogni device stabilito PRIMA viene forzato a riautenticarsi.
  // silent=true evita il toast (es. dopo l'enroll, dove il toast di enrollment ha la priorità).
  const revokeOtherDeviceSessions = async (silent = false) => {
    setRevokeOthersPending(true);
    try {
      const res = await fetchAuthedClient<{ success: boolean; revoked: number }>("/api/auth/sessions/revoke-others", { method: "POST" });
      if (!res.success) {
        throw new Error(res.error?.message || t("settings.sessions.othersRevokeFail"));
      }
      if (!silent) {
        showToast(t("settings.sessions.othersRevoked", { count: String(res.data?.revoked ?? 0) }), "success");
      }
      await loadDeviceSessions();
    } catch (err) {
      if (!silent) showToast(err instanceof Error ? err.message : t("settings.sessions.othersRevokeFail"), "error");
    } finally {
      setRevokeOthersPending(false);
    }
  };

  // Etichetta leggibile del device a partire dallo user agent (best-effort, solo display)
  const describeDevice = (userAgent: string): string => {
    const ua = userAgent.toLowerCase();
    const os = ua.includes("android") ? "Android"
      : (ua.includes("iphone") || ua.includes("ipad")) ? "iOS"
        : ua.includes("mac os") ? "macOS"
          : ua.includes("windows") ? "Windows"
            : ua.includes("linux") ? "Linux" : s.settings.deviceFallback;
    const browser = ua.includes("edg/") ? "Edge"
      : ua.includes("chrome/") ? "Chrome"
        : ua.includes("safari/") && !ua.includes("chrome/") ? "Safari"
          : ua.includes("firefox/") ? "Firefox" : s.settings.browserFallback;
    return `${browser} · ${os}`;
  };

  return (
    <>
      {/* Griglia responsive a due colonne per Password e 2FA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SEC 2: CAMBIO PASSWORD */}
        <Card className="klx-settings-card--full">
          <CardBody>
            <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
              <Key className="w-4 h-4 text-secondary" />
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
                {t("settings.pwd.title")}
              </h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5 w-full">
                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300">
                  {t("settings.pwd.current")}
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("settings.pwd.currentPlaceholder")}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-primary rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full pe-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300">
                  {t("settings.pwd.new")}
                </Label>
                <Input
                  type="password"
                  placeholder={t("settings.pwd.newPlaceholder")}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-primary rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full"
                />
                {passwordStrength && (
                  <div className="space-y-1.5 mt-1">
                    <div className="klx-settings-strength-meter-container">
                      <div className={`klx-settings-strength-meter-bar ${passwordStrength.width} ${
                        passwordStrength.level === "strong" ? "bg-success" : passwordStrength.level === "medium" ? "bg-amber-500" : "bg-danger"
                      }`} />
                    </div>
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${passwordStrength.color}`}>
                      {t("settings.pwd.strengthLabel")}: {
                        passwordStrength.level === "short" ? t("settings.pwd.strengthShort")
                          : passwordStrength.level === "weak" ? t("settings.pwd.strengthWeak")
                            : passwordStrength.level === "medium" ? t("settings.pwd.strengthMedium")
                              : t("settings.pwd.strengthStrong")
                      }
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300">
                  {t("settings.pwd.confirm")}
                </Label>
                <Input
                  type="password"
                  placeholder={t("settings.pwd.confirmPlaceholder")}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-primary rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  isDisabled={passwordPending}
                  variant="primary"
                >
                  {passwordPending ? t("settings.pwd.saving") : t("settings.pwd.submit")}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* SEC 3: 2FA (app di autenticazione — TOTP) */}
        <SettingsMfa
          executeWithReauthChallenge={executeWithReauthChallenge}
          revokeOtherDeviceSessions={revokeOtherDeviceSessions}
        />
      </div>

      {/* SEC 3B: SESSIONI / DISPOSITIVI ATTIVI (3.2) */}
      <Card className="klx-settings-card--full">
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
                {t("settings.sessions.title")}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {deviceSessions.length > 1 && (
                <Button onClick={() => void revokeOtherDeviceSessions(false)} isDisabled={revokeOthersPending} variant="danger-soft">
                  {t("settings.sessions.revokeOthers")}
                </Button>
              )}
              <Button onClick={() => void loadDeviceSessions()} isDisabled={sessionsLoading} variant="ghost">
                {t("settings.sessions.refresh")}
              </Button>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed mb-4">
            {t("settings.sessions.desc")}
          </p>
          {sessionsLoading && deviceSessions.length === 0 ? (
            <p className="text-xs text-slate-400">{t("settings.sessions.loading")}</p>
          ) : deviceSessions.length === 0 ? (
            <p className="text-xs text-slate-400">{t("settings.sessions.empty")}</p>
          ) : (
            <div className="space-y-2">
              {deviceSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-950/40 px-3.5 py-2.5"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      {describeDevice(session.userAgent)}
                      {session.current && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-success/15 border border-success/30 text-success rounded-full">
                          {t("settings.sessions.thisDevice")}
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">
                      {t("settings.sessions.ipLine", { ip: session.ip, when: session.lastSeenAt ? new Date(session.lastSeenAt).toLocaleString() : "—" })}
                    </span>
                  </div>
                  <Button
                    onClick={() => void revokeDeviceSession(session)}
                    isDisabled={sessionRevokePending === session.id}
                    variant="danger-soft"
                  >
                    {sessionRevokePending === session.id ? t("settings.sessions.disconnecting") : t("settings.sessions.disconnect")}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* SEC 4: CHIAVE API PERSONALE */}
      <SettingsApiKey />

      {/* SEC 5: DANGEROUS ZONE GDPR */}
      <Card className="klx-settings-card--danger">
        <CardBody>
          <div className="flex items-center gap-2 mb-6 border-b border-red-500/20 pb-4">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-red-700 dark:text-red-400">
              {t("settings.danger.title")}
            </h2>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <p className="text-xs font-bold text-red-800 dark:text-red-400">
                {t("settings.danger.irreversible")}
              </p>
              <p className="text-xs text-red-600/80 dark:text-red-400/60 leading-relaxed">
                {t("settings.danger.desc")}
              </p>
            </div>
            <Button
              onClick={onRequestAccountDeletion}
              variant="danger"
              icon={<Trash className="w-3.5 h-3.5" />}
            >
              {t("settings.danger.deleteBtn")}
            </Button>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
