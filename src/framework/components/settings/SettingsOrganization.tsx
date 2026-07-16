"use client";

import React, { useMemo } from "react";
import { useDashboard } from "../layouts/DashboardContext";
import { fetchAuthedClient } from "../../lib/api";
import { Card, CardBody } from "../ui";
import { Form } from "../layouts/Form";
import { MfaPolicyToggle } from "./MfaPolicyToggle";
import { Building2 } from "lucide-react";
import { useI18n } from "@/locales/client";
import { organizationSettingsSchema } from "../../lib/schemas/api";

// E4.2 — Sezione "Organizzazione" delle impostazioni, estratta meccanicamente da
// settings.tsx: form dei dati fiscali dell'organizzazione attiva (validata via Zod, E3.5)
// e policy MFA per-org (174).

export function SettingsOrganization() {
  const { user, dbData, showToast } = useDashboard();
  const t = useI18n();

  // Organizzazione attiva validata via Zod (E3.5): il payload dashboard è lasco
  // (index signature `unknown`) — niente doppio cast, un payload non conforme viene
  // loggato e trattato come assente (il tab azienda resta vuoto invece di corrompersi).
  const rawOrganization = dbData?.organization;
  const activeOrg = useMemo(() => {
    if (!rawOrganization) return undefined;
    const parsed = organizationSettingsSchema.safeParse(rawOrganization);
    if (!parsed.success) {
      console.error("[Settings] Payload organizzazione non conforme allo schema:", parsed.error);
      return undefined;
    }
    return parsed.data;
  }, [rawOrganization]);
  const orgInitialData = useMemo(() => {
    if (!activeOrg) return {};
    return {
      name: activeOrg.name || "",
      type: activeOrg.type || "business",
      country: activeOrg.country || "IT",
      vatNumber: activeOrg.vatNumber || "",
      fiscalCode: activeOrg.fiscalCode || "",
      billingAddress: activeOrg.billingAddress || "",
      sdiCode: activeOrg.sdiCode || "",
      officeCode: activeOrg.officeCode || "",
      cigCode: activeOrg.cigCode || "",
      cupCode: activeOrg.cupCode || "",
      address: activeOrg.address || ""
    };
  }, [activeOrg]);

  // Gestione Submit Organizzazione
  const handleOrgSubmit = async (data: Record<string, unknown>, idempotencyKey: string) => {
    if (!activeOrg) return;

    try {
      const resData = await fetchAuthedClient<Record<string, unknown>>(`/api/organization/${activeOrg.orgId}`, {
        method: "POST",
        headers: { "Idempotency-Key": idempotencyKey },
        body: JSON.stringify({
          ...data,
          metadata: activeOrg.metadata || null
        })
      });

      if (!resData.success) {
        throw new Error(resData.error?.message || t("settings.toast.orgUpdateError"));
      }

      showToast(t("settings.toast.orgSaved"), "success");

      if (user) {
        await user.getIdTokenResult(true);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="klx-settings-card">
        <CardBody>
          {/* Header standard di sezione (stessa grammatica delle card profilo). */}
          <div className="flex items-center justify-between mb-6 border-b border-line pb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-secondary" />
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-ink">
                {t("settings.org.title")}
              </h2>
            </div>
          </div>
          <Form
            moduleId="organization"
            initialData={orgInitialData}
            fieldsOrder={["name", "type", "country", "vatNumber", "fiscalCode", "address", "billingAddress", "sdiCode", "officeCode", "cigCode", "cupCode"]}
            onSubmit={handleOrgSubmit}
            submitLabel={t("settings.org.submit")}
          />
        </CardBody>
      </Card>
      {/* Policy MFA per-org (174): richiedi il TOTP obbligatorio ai membri. */}
      <MfaPolicyToggle />
    </div>
  );
}
