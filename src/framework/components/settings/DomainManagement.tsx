"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDashboard } from "../layouts/DashboardContext";
import { fetchAuthedClient } from "../../lib/api";
import { Card, CardBody, Button, Input, Label } from "../ui";
import { Globe, Plus, Trash2, Copy, ExternalLink, RefreshCw } from "lucide-react";
import { useUIStrings } from "../../lib/ui.localization";
import { useI18n } from "@/locales/client";

interface CustomDomain {
  domainId: string;
  domain: string;
  status: string;
  verifiedAt?: string | null;
}

interface DomainListResponse {
  success: boolean;
  subdomain: string | null;
  baseDomain: string;
  customDomains: CustomDomain[];
}

// Colore della pill di stato del dominio custom (l'etichetta i18n è risolta inline con chiavi letterali).
function statusClass(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "bg-success/15 text-success border-success/30";
    case "FAILED":
      return "bg-danger/15 text-danger border-danger/30";
    default:
      return "bg-amber-500/15 text-amber-600 border-amber-500/30";
  }
}

export function DomainManagement(): React.ReactElement {
  const { showToast } = useDashboard();
  const t = useI18n();
  const s = useUIStrings();

  const [loading, setLoading] = useState(true);
  const [baseDomain, setBaseDomain] = useState("");
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [subdomainInput, setSubdomainInput] = useState("");
  const [customDomains, setCustomDomains] = useState<CustomDomain[]>([]);
  const [newDomain, setNewDomain] = useState("");
  const [savingSub, setSavingSub] = useState(false);
  const [addingDomain, setAddingDomain] = useState(false);

  const load = useCallback(async () => {
    const res = await fetchAuthedClient<DomainListResponse>("/api/domain", { method: "GET" });
    if (res.success && res.data) {
      setBaseDomain(res.data.baseDomain);
      setSubdomain(res.data.subdomain);
      setSubdomainInput(res.data.subdomain ?? "");
      setCustomDomains(res.data.customDomains ?? []);
    } else if (!res.success) {
      showToast(res.error?.message || t("settings.domains.error"), "error");
    }
    setLoading(false);
  }, [showToast, t]);

  useEffect(() => {
    // Deferito a microtask per non chiamare setState in modo sincrono nell'effetto (React 19 lint).
    void Promise.resolve().then(() => load());
  }, [load]);

  // Poll finché un dominio è in provisioning: mostra dal vivo il passaggio a ACTIVE/FAILED.
  useEffect(() => {
    const pending = customDomains.some((d) => d.status === "PROVISIONING" || d.status === "PENDING");
    if (!pending) return;
    const id = setInterval(() => {
      void load();
    }, 20000);
    return () => clearInterval(id);
  }, [customDomains, load]);

  const saveSubdomain = useCallback(async () => {
    setSavingSub(true);
    const slug = subdomainInput.trim().toLowerCase();
    const res = await fetchAuthedClient("/api/domain/subdomain", {
      method: "PUT",
      body: JSON.stringify({ subdomain: slug.length ? slug : null })
    });
    if (res.success) {
      showToast(t("settings.domains.subdomainSaved"), "success");
      await load();
    } else {
      showToast(res.error?.message || t("settings.domains.error"), "error");
    }
    setSavingSub(false);
  }, [subdomainInput, showToast, t, load]);

  const addDomain = useCallback(async () => {
    const d = newDomain.trim().toLowerCase();
    if (!d) return;
    setAddingDomain(true);
    const res = await fetchAuthedClient("/api/domain", {
      method: "POST",
      body: JSON.stringify({ domain: d })
    });
    if (res.success) {
      showToast(t("settings.domains.added"), "success");
      setNewDomain("");
      await load();
    } else {
      showToast(res.error?.message || t("settings.domains.error"), "error");
    }
    setAddingDomain(false);
  }, [newDomain, showToast, t, load]);

  const removeDomain = useCallback(
    async (domainId: string) => {
      const res = await fetchAuthedClient(`/api/domain/${domainId}`, { method: "DELETE" });
      if (res.success) {
        showToast(t("settings.domains.removed"), "success");
        await load();
      } else {
        showToast(res.error?.message || t("settings.domains.error"), "error");
      }
    },
    [showToast, t, load]
  );

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        showToast(t("settings.domains.copied"), "success");
      } catch {
        showToast(t("settings.domains.copyError"), "error");
      }
    },
    [showToast, t]
  );

  const cnameTarget = baseDomain ? `app.${baseDomain}` : "";
  const subdomainUrl = subdomain && baseDomain ? `https://${subdomain}.${baseDomain}` : null;

  const inputCls =
    "bg-surface-2 border border-line focus:border-primary rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-ink outline-none w-full";

  return (
    <div className="space-y-6">
      {/* --- Sottodominio white-label --- */}
      <Card className="klx-settings-card--full">
        <CardBody>
          <div className="flex items-center gap-2 mb-6 border-b border-line pb-4">
            <Globe className="w-4 h-4 text-secondary" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-ink">
              {t("settings.domains.subdomainTitle")}
            </h2>
          </div>
          <p className="text-xs text-ink-muted mb-4">{t("settings.domains.subdomainDesc")}</p>

          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-xs font-bold text-slate-700 dark:text-gray-300">
              {t("settings.domains.subdomainLabel")}
            </Label>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center flex-1 min-w-[220px]">
                <Input
                  type="text"
                  value={subdomainInput}
                  placeholder={s.settings.subdomainPlaceholder}
                  onChange={(e) => setSubdomainInput(e.target.value)}
                  className={`${inputCls} rounded-e-none`}
                />
                <span className="h-[48px] flex items-center px-3 rounded-2xl rounded-s-none border border-s-0 border-line bg-slate-100 dark:bg-slate-900 text-sm text-ink-muted whitespace-nowrap">
                  .{baseDomain}
                </span>
              </div>
              <Button variant="primary" isDisabled={savingSub || loading} onClick={() => void saveSubdomain()}>
                {savingSub ? t("settings.domains.saving") : t("settings.domains.save")}
              </Button>
            </div>
            {subdomainUrl && (
              <a
                href={subdomainUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1.5"
              >
                {subdomainUrl}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </CardBody>
      </Card>

      {/* --- Domini custom --- */}
      <Card className="klx-settings-card--full">
        <CardBody>
          <div className="flex items-center gap-2 mb-6 border-b border-line pb-4">
            <Globe className="w-4 h-4 text-secondary" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-ink">
              {t("settings.domains.customTitle")}
            </h2>
          </div>
          <p className="text-xs text-ink-muted mb-4">{t("settings.domains.customDesc")}</p>

          <div className="flex items-center gap-2 flex-wrap mb-5">
            <Input
              type="text"
              value={newDomain}
              placeholder={s.settings.customDomainPlaceholder}
              onChange={(e) => setNewDomain(e.target.value)}
              className={`${inputCls} flex-1 min-w-[220px]`}
            />
            <Button variant="primary" isDisabled={addingDomain || !newDomain.trim()} onClick={() => void addDomain()}>
              <Plus className="w-4 h-4 me-1" />
              {addingDomain ? t("settings.domains.adding") : t("settings.domains.add")}
            </Button>
          </div>

          {customDomains.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-gray-500 italic py-4 text-center">
              {t("settings.domains.empty")}
            </p>
          ) : (
            <div className="space-y-3">
              {customDomains.map((d) => {
                const cls = statusClass(d.status);
                const statusLabel =
                  d.status === "ACTIVE"
                    ? t("settings.domains.status.active")
                    : d.status === "FAILED"
                      ? t("settings.domains.status.failed")
                      : t("settings.domains.status.provisioning");
                return (
                  <div
                    key={d.domainId}
                    className="rounded-2xl border border-line p-4 bg-white/40 dark:bg-slate-950/30"
                  >
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-semibold text-ink truncate">{d.domain}</span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${cls}`}>
                          {statusLabel}
                        </span>
                      </div>
                      <Button
                        variant="danger-soft"
                        size="sm"
                        onClick={() => void removeDomain(d.domainId)}
                        aria-label={t("settings.domains.remove")}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    {d.status !== "ACTIVE" && (
                      <div className="mt-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-line p-3">
                        <p className="text-[11px] text-ink-muted mb-2 flex items-center gap-1">
                          <RefreshCw className="w-3 h-3" />
                          {t("settings.domains.cnameHint")}
                        </p>
                        <div className="flex items-center justify-between gap-2 font-mono text-xs bg-surface rounded-lg px-3 py-2 border border-line">
                          <span className="truncate text-slate-700 dark:text-gray-200">
                            {d.domain} &nbsp;CNAME&nbsp; {cnameTarget}
                          </span>
                          <button
                            type="button"
                            onClick={() => void copy(`${d.domain} CNAME ${cnameTarget}`)}
                            className="text-slate-400 hover:text-primary shrink-0"
                            aria-label={t("settings.domains.copy")}
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
