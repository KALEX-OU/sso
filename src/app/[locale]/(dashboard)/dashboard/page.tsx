"use client";
import React, { useState, useEffect } from "react";
import { useDashboard } from "../layout";
import { Button, Card, Chip, Input, Label, TextField } from "@heroui/react";
import { useI18n } from "@/locales/client";
import {
  ShieldCheck,
  Smartphone,
  QrCode,
  Check,
  Laptop
} from "lucide-react";

interface DeviceSession {
  id: string;
  name: string;
  ip: string;
  loc: string;
  active: boolean;
  type: "desktop" | "mobile";
}

interface ServiceItem {
  serviceId: string;
  seats: number;
  assignedSeats?: Array<{ userId: string; assignedAt: string }> | null;
  tier?: string | null;
}

interface SubscriptionData {
  subscriptionId: string;
  appId: string;
  status: string;
  services: ServiceItem[];
  expiresAt?: string | null;
}

export default function DashboardPage() {
  const t = useI18n();
  const { dbData, showToast } = useDashboard();
  const [loading, setLoading] = useState(true);

  // Stati per la simulazione delle sessioni dei dispositivi
  const [sessions, setSessions] = useState<DeviceSession[]>([
    { id: "1", name: "Chrome on macOS (Current)", ip: "85.20.14.99", loc: "Milano, IT", active: true, type: "desktop" },
    { id: "2", name: "Safari on iPhone 15", ip: "85.20.14.101", loc: "Milano, IT", active: false, type: "mobile" },
    { id: "3", name: "Chrome on Windows 11", ip: "93.45.109.12", loc: "Tallinn, EE", active: false, type: "desktop" }
  ]);

  // MFA Wizard state
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaStep, setMfaStep] = useState<"idle" | "select" | "verify" | "active">("idle");
  const [mfaMethod, setMfaMethod] = useState<"sms" | "app">("sms");
  const [mfaPhone, setMfaPhone] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [mfaCodesList] = useState<string[]>(["KX99-RT34", "PL82-HY90", "QW11-PO92", "MN88-VC01"]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Contratto /api/auth/dashboard: { user, organization } (org attiva con role).
  const activeOrg = dbData?.organization;

  const handleRevokeSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
    showToast("Sessione revocata con successo.", "info");
  };

  const handleVerifyMFA = () => {
    if (mfaCode.length === 6) {
      setMfaEnabled(true);
      setMfaStep("active");
      showToast("MFA configurata con successo.", "success");
    } else {
      showToast("Codice non valido. Inserisci 6 cifre.", "error");
    }
  };

  const handleDisableMFA = () => {
    setMfaEnabled(false);
    setMfaStep("idle");
    setMfaCode("");
    setMfaPhone("");
    showToast("MFA disattivata con successo.", "info");
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Organizzazione Skeleton */}
          <div className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 rounded-3xl p-6 space-y-4">
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
              <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
            </div>
          </div>
          {/* Card Abbonamenti Skeleton */}
          <div className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 rounded-3xl p-6 space-y-4">
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
              <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card MFA Skeleton */}
          <div className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="space-y-2">
                <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                <div className="h-3 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
              </div>
            </div>
            <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          </div>
          {/* Card Dispositivi Skeleton */}
          <div className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="space-y-2">
                <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                <div className="h-3 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
              <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* 1. Anagrafica Organizzazione Info & Sottoscrizioni */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6">
          <Card.Content className="p-2 space-y-4">
            <span className="text-[10px] uppercase tracking-widest text-secondary dark:text-violet-400 font-extrabold block">
              {t("dashboard.title")}
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {activeOrg?.name || t("dashboard.noOrg")}
            </h3>
            <div className="flex gap-2">
              <Chip size="sm" variant="soft" className="text-xs font-semibold">Tipo: {activeOrg?.type || "N/D"}</Chip>
              <Chip size="sm" color="success" variant="soft" className="text-xs font-semibold">Stato: {activeOrg?.confirmed ? "Approvata" : "In verifica"}</Chip>
              {activeOrg?.viesValidated && (
                <Chip size="sm" color="success" variant="soft" className="text-xs font-semibold">VIES Validato</Chip>
              )}
            </div>
          </Card.Content>
        </Card>

        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6">
          <Card.Content className="p-2 space-y-4">
            <span className="text-[10px] uppercase tracking-widest text-secondary dark:text-violet-400 font-extrabold block">
              Sottoscrizioni Suite
            </span>
            <div className="space-y-2">
              {activeOrg?.subscriptions && activeOrg.subscriptions.length > 0 ? (
                (activeOrg.subscriptions as unknown as SubscriptionData[]).flatMap((sub) => {
                  const servicesList = Array.isArray(sub.services) ? sub.services : [];
                  return servicesList.map((srv) => ({
                    serviceId: srv.serviceId,
                    status: sub.status,
                    tier: srv.tier || "default"
                  }));
                }).map((srvItem) => (
                  <div key={srvItem.serviceId} className="flex justify-between items-center bg-slate-100/50 dark:bg-slate-950/20 p-3 rounded-2xl border border-slate-200/50 dark:border-white/5">
                    <span className="text-xs font-bold">{srvItem.serviceId}</span>
                    <Chip size="sm" color={srvItem.status === "active" ? "success" : "warning"} variant="soft">
                      {srvItem.status.toUpperCase()} ({srvItem.tier})
                    </Chip>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 text-center py-4">Nessun abbonamento attivo. Esplora il catalogo servizi.</div>
              )}
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* 2. Sicurezza: MFA & Sessioni Dispositivi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6">
          <Card.Content className="p-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-500/10 border border-violet-500/20 rounded-xl text-secondary dark:text-violet-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-md font-bold text-slate-900 dark:text-white">{t("dashboard.mfaTitle")}</h3>
                <p className="text-slate-500 dark:text-gray-400 text-xs">{t("dashboard.mfaDesc")}</p>
              </div>
            </div>

            {mfaStep === "idle" && !mfaEnabled && (
              <Button onClick={() => setMfaStep("select")} className="w-full font-bold bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-white py-5 rounded-xl border border-slate-200 dark:border-white/10 cursor-pointer">
                {t("dashboard.mfaSetupBtn")}
              </Button>
            )}

            {mfaEnabled && mfaStep === "idle" && (
              <div className="flex justify-between items-center bg-emerald-100/45 dark:bg-emerald-950/20 p-3.5 rounded-2xl border border-emerald-300 dark:border-emerald-500/20">
                <div>
                  <p className="text-emerald-700 dark:text-emerald-400 text-xs font-bold">{t("dashboard.mfaEnabled")}</p>
                </div>
                <Button size="sm" variant="danger-soft" onClick={handleDisableMFA} className="font-bold text-[10px] cursor-pointer">
                  {t("dashboard.mfaDisable")}
                </Button>
              </div>
            )}

            {mfaStep === "select" && (
              <div className="space-y-2">
                <p className="text-xs font-semibold">{t("dashboard.mfaSelectDesc")}</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => { setMfaMethod("sms"); setMfaStep("verify"); }} className="p-3 bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 hover:bg-slate-200/50 dark:hover:bg-white/5 rounded-2xl flex flex-col items-center gap-1 cursor-pointer">
                    <Smartphone className="w-5 h-5 text-violet-500" />
                    <span className="text-xs font-bold">{t("dashboard.mfaSms")}</span>
                  </button>
                  <button onClick={() => { setMfaMethod("app"); setMfaStep("verify"); }} className="p-3 bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 hover:bg-slate-200/50 dark:hover:bg-white/5 rounded-2xl flex flex-col items-center gap-1 cursor-pointer">
                    <QrCode className="w-5 h-5 text-violet-500" />
                    <span className="text-xs font-bold">{t("dashboard.mfaApp")}</span>
                  </button>
                </div>
              </div>
            )}

            {mfaStep === "verify" && (
              <div className="space-y-3">
                {mfaMethod === "sms" ? (
                  <TextField className="flex flex-col gap-1 w-full">
                    <Label className="text-[10px] font-bold text-slate-700 dark:text-gray-300">Cellulare</Label>
                    <Input placeholder="+39 345..." value={mfaPhone} onChange={e => setMfaPhone(e.target.value)} className="bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none w-full" />
                  </TextField>
                ) : (
                  <div className="flex items-center gap-3 bg-slate-100/50 dark:bg-white/5 p-3 rounded-2xl border border-slate-200/50 dark:border-white/5">
                    <QrCode className="w-8 h-8 text-slate-800 dark:text-white" />
                    <span className="text-[10px] text-slate-500">{"Scansiona il codice o usa: K4LX SSO KEY"}</span>
                  </div>
                )}
                <TextField className="flex flex-col gap-1 w-full">
                  <Label className="text-[10px] font-bold text-slate-700 dark:text-gray-300">Codice OTP</Label>
                  <Input maxLength={6} placeholder="123456" value={mfaCode} onChange={e => setMfaCode(e.target.value)} className="text-center font-mono font-bold bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none w-full" />
                </TextField>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setMfaStep("select")} className="w-1/3 cursor-pointer">Indietro</Button>
                  <Button size="sm" onClick={handleVerifyMFA} className="w-2/3 bg-gradient-to-r from-violet-500 to-accent text-slate-950 font-bold cursor-pointer">Verifica</Button>
                </div>
              </div>
            )}

            {mfaStep === "active" && (
              <div className="text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold">{t("dashboard.mfaSuccessTitle")}</p>
                <div className="grid grid-cols-2 gap-1 font-mono text-[9px] bg-slate-100/50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-200/50 dark:border-white/5">
                  {mfaCodesList.map((code, idx) => <span key={idx}>{code}</span>)}
                </div>
                <Button size="sm" onClick={() => setMfaStep("idle")} className="w-full font-bold cursor-pointer">Fatto</Button>
              </div>
            )}
          </Card.Content>
        </Card>

        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6">
          <Card.Content className="p-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-500/10 border border-violet-500/20 rounded-xl text-secondary dark:text-violet-400">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-md font-bold text-slate-900 dark:text-white">{t("dashboard.deviceTitle")}</h3>
                <p className="text-slate-500 dark:text-gray-400 text-xs">{t("dashboard.deviceDesc")}</p>
              </div>
            </div>

            <div className="space-y-2">
              {sessions.map((session) => (
                <div key={session.id} className="flex justify-between items-center bg-slate-100/50 dark:bg-slate-950/20 p-3 rounded-2xl border border-slate-200/50 dark:border-white/5">
                  <div>
                    <p className="text-xs font-bold">{session.name}</p>
                    <p className="text-[10px] text-slate-500">{session.ip} • {session.loc}</p>
                  </div>
                  {!session.active && (
                    <Button size="sm" variant="danger-soft" onClick={() => handleRevokeSession(session.id)} className="font-bold text-[10px] cursor-pointer">
                      Revoca
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
