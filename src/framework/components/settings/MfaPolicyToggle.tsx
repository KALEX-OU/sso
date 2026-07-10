"use client";

import React, { useState, useCallback } from "react";
import { useDashboard } from "../layouts/DashboardContext";
import { fetchAuthedClient } from "../../lib/api";
import { Card, CardBody } from "../ui";
import { ShieldCheck } from "lucide-react";
import { useI18n } from "@/locales/client";

interface OrgWithMfa {
  orgId?: string;
  mfaRequired?: boolean;
}

/**
 * Toggle della policy MFA per-org (174). Owner/admin possono richiedere il TOTP obbligatorio a tutti
 * i membri dell'org. Aggiorna `organization.mfaRequired` via l'API org (campo in allowedFields owner/
 * admin) e rinfresca i claims. Chi non è owner/admin non vede il controllo.
 */
export function MfaPolicyToggle(): React.ReactElement | null {
  const { dbData, claims, showToast, refreshClaims } = useDashboard();
  const t = useI18n();

  const role = (claims?.uRole || claims?.role) as string | undefined;
  const isManager = role === "owner" || role === "admin";
  const org = (dbData?.organization ?? {}) as OrgWithMfa;

  const [enabled, setEnabled] = useState<boolean>(!!org.mfaRequired);
  const [busy, setBusy] = useState(false);

  const toggle = useCallback(async () => {
    if (!org.orgId || busy) return;
    const next = !enabled;
    setBusy(true);
    setEnabled(next); // ottimistico
    const res = await fetchAuthedClient(`/api/organization/${org.orgId}`, {
      method: "POST",
      body: JSON.stringify({ mfaRequired: next, metadata: null })
    });
    if (res.success) {
      showToast(next ? t("settings.mfaPolicy.on") : t("settings.mfaPolicy.off"), "success");
      await refreshClaims();
    } else {
      setEnabled(!next); // rollback
      showToast(res.error?.message || t("settings.mfaPolicy.error"), "error");
    }
    setBusy(false);
  }, [org.orgId, enabled, busy, showToast, refreshClaims, t]);

  if (!isManager) return null;

  return (
    <Card className="klx-settings-card--full">
      <CardBody>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3 min-w-0">
            <ShieldCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <div className="min-w-0">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
                {t("settings.mfaPolicy.title")}
              </h2>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{t("settings.mfaPolicy.desc")}</p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label={t("settings.mfaPolicy.title")}
            disabled={busy}
            onClick={() => void toggle()}
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
              enabled ? "bg-success" : "bg-slate-300 dark:bg-slate-700"
            } ${busy ? "opacity-60" : ""}`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                enabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </CardBody>
    </Card>
  );
}
