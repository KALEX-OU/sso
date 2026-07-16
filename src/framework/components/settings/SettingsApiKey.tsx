"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDashboard } from "../layouts/DashboardContext";
import { fetchAuthedClient } from "../../lib/api";
import { apiKeyStatusResponseSchema, apiKeyGenerateResponseSchema, apiEnvelopeSchema } from "../../lib/schemas/api";
import { Card, CardBody, Button } from "../ui";
import { Key, Check, AlertTriangle, Copy, Trash2 } from "lucide-react";
import { useI18n } from "@/locales/client";
import { useBrand } from "../providers/BrandProvider";

// E4.2 — Card "Chiave API personale" delle impostazioni, estratta meccanicamente da
// settings.tsx: lettura dello stato della chiave (hash/attiva/data), generazione e
// rigenerazione con banner one-time della chiave in chiaro appena creata.

export function SettingsApiKey() {
  const { user, showToast, claims } = useDashboard();
  const t = useI18n();
  // Brand white-label attivo: il copy della chiave API non cabla "KALEX" (E5.1).
  const brand = useBrand();

  // Stati per la gestione della chiave API personale dell'utente
  const [apiKeyData, setApiKeyData] = useState<{
    hasKey: boolean;
    keyHash?: string;
    name?: string;
    isActive?: boolean;
    createdAt?: string;
  } | null>(null);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [loadingApiKey, setLoadingApiKey] = useState(false);

  const fetchUserApiKey = useCallback(async () => {
    const userId = claims?.uId || user?.uid;
    if (!userId) return;
    try {
      setLoadingApiKey(true);
      // Tipo inferito dallo schema Zod (Z1): niente generic inline da tenere allineato.
      const res = await fetchAuthedClient(`/api/user/${userId}/apikey`, undefined, { validate: (raw) => apiKeyStatusResponseSchema.parse(raw) });
      if (res.success && res.data) {
        setApiKeyData({
          hasKey: res.data.hasKey ?? false,
          keyHash: res.data.keyHash,
          name: res.data.name,
          isActive: res.data.isActive,
          createdAt: res.data.createdAt
        });
      }
    } catch (err) {
      console.warn("Impossibile caricare la chiave API personale:", err);
    } finally {
      setLoadingApiKey(false);
    }
  }, [claims?.uId, user?.uid]);

  const handleGenerateApiKey = async () => {
    const userId = claims?.uId || user?.uid;
    if (!userId) return;
    try {
      setLoadingApiKey(true);
      setGeneratedKey(null);
      const res = await fetchAuthedClient(`/api/user/${userId}/apikey`, {
        method: "POST"
      }, { validate: (raw) => apiKeyGenerateResponseSchema.parse(raw) });
      if (res.success && res.data) {
        setGeneratedKey(res.data.apiKey ?? null);
        showToast(t("settings.toast.apiKeyGenerated"), "success");
        await fetchUserApiKey();
      } else {
        showToast(t("settings.toast.apiKeyGenError"), "error");
      }
    } catch (err) {
      console.error(err);
      showToast(t("settings.toast.apiKeyGenFail"), "error");
    } finally {
      setLoadingApiKey(false);
    }
  };

  // Eliminazione definitiva della chiave personale: le richieste firmate con
  // la chiave vengono rifiutate da subito (coerente con revoca sessioni/device:
  // azione diretta, niente dialogo — la rigenerazione è comunque possibile).
  const handleDeleteApiKey = async () => {
    const userId = claims?.uId || user?.uid;
    if (!userId) return;
    try {
      setLoadingApiKey(true);
      const res = await fetchAuthedClient(`/api/user/${userId}/apikey`, {
        method: "DELETE"
      }, { validate: (raw) => apiEnvelopeSchema.parse(raw) });
      if (res.success) {
        setGeneratedKey(null);
        setApiKeyData({ hasKey: false });
        showToast(t("settings.toast.apiKeyDeleted"), "success");
      } else {
        showToast(t("settings.toast.apiKeyDeleteFail"), "error");
      }
    } catch (err) {
      console.error(err);
      showToast(t("settings.toast.apiKeyDeleteFail"), "error");
    } finally {
      setLoadingApiKey(false);
    }
  };

  useEffect(() => {
    if (user) {
      Promise.resolve().then(() => {
        fetchUserApiKey();
      });
    }
  }, [user, fetchUserApiKey]);

  return (
    <Card className="klx-settings-card--full">
      <CardBody>
        <div className="flex items-center justify-between mb-6 border-b border-line pb-4">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-secondary" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-ink">
              {t("settings.apikey.title")}
            </h2>
          </div>
          {apiKeyData?.hasKey && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider bg-success/15 border border-success/30 text-success rounded-full">
              <Check className="w-3 h-3" /> {t("settings.apikey.active")}
            </span>
          )}
        </div>

        <div className="space-y-6">
          <p className="text-xs text-ink-muted leading-relaxed max-w-3xl">
            {t("settings.apikey.desc", { brand: brand.name })}
          </p>

          {/* Banner di visualizzazione della chiave in chiaro appena generata */}
          {generatedKey && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-3">
              <div className="flex items-center gap-2 text-amber-500">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">{t("settings.apikey.saveNowTitle")}</span>
              </div>
              <p className="text-[11px] text-ink-muted leading-relaxed">
                {t("settings.apikey.saveNowDesc")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <input
                  type="text"
                  readOnly
                  value={generatedKey}
                  className="bg-slate-900/60 border border-amber-500/30 text-amber-400 font-mono text-xs rounded-2xl px-3.5 py-2 flex-1 h-[44px] outline-none select-all w-full min-w-0"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedKey);
                    showToast(t("settings.toast.apiKeyCopied"), "success");
                  }}
                  variant="primary"
                  icon={<Copy className="w-3.5 h-3.5" />}
                  className="shrink-0"
                >
                  {t("settings.apikey.copy")}
                </Button>
              </div>
            </div>
          )}

          {loadingApiKey ? (
            <div className="flex items-center gap-2 text-slate-400 py-2">
              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-secondary"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider">{t("settings.apikey.loadingDetails")}</span>
            </div>
          ) : apiKeyData?.hasKey ? (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-5 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-white/5 rounded-2xl">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase">{t("settings.apikey.hashLabel")}</span>
                  <code className="text-xs text-slate-800 dark:text-secondary font-mono font-bold break-all bg-white dark:bg-black/30 px-2 py-0.5 rounded border border-slate-200 dark:border-white/5">
                    {apiKeyData.keyHash}
                  </code>
                </div>
                <div className="text-[10px] text-ink-muted">
                  {t("settings.apikey.generatedOn")} <span className="font-bold">{apiKeyData.createdAt ? new Date(apiKeyData.createdAt).toLocaleDateString() : "-"}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleGenerateApiKey}
                  isDisabled={loadingApiKey}
                  variant="ghost"
                  icon={<Key className="w-3.5 h-3.5" />}
                >
                  {t("settings.apikey.regenerate")}
                </Button>
                <Button
                  onClick={handleDeleteApiKey}
                  isDisabled={loadingApiKey}
                  variant="danger-soft"
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  {t("settings.apikey.delete")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <Button
                onClick={handleGenerateApiKey}
                isDisabled={loadingApiKey}
                variant="primary"
                icon={<Key className="w-3.5 h-3.5" />}
              >
                {t("settings.apikey.generate")}
              </Button>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
