"use client";

import React from "react";
import { useDashboard } from "../layouts/DashboardContext";
import { UserPageHeader } from "./UserMain";
import { SettingsOrganization } from "../settings/SettingsOrganization";
import { SettingsOrgLogo } from "../settings/SettingsOrgLogo";
import { DomainManagement } from "../settings/DomainManagement";
import { EmptyState } from "../ui";
import { Building2 } from "lucide-react";
import { useUIStrings } from "../../lib/ui.localization";

/**
 * Pagina ORGANIZZAZIONE (/settings) — tutto ciò che riguarda l'ORG: dati
 * fiscali/anagrafici (SettingsOrganization, con policy MFA) e domini
 * white-label §3-bis (DomainManagement), impilati senza tab. Nato dallo split
 * del vecchio wrapper settings: il profilo personale vive in UserProfile,
 * i membri in UserTeam. Accesso riservato a owner/admin (gate client-side;
 * le API restano protette server-side da RBAC).
 */
export function UserOrganization() {
  const { claims } = useDashboard();
  const s = useUIStrings();

  const activeRole = claims?.uRole || claims?.role;
  const isOrgManager = activeRole === "owner" || activeRole === "admin";

  if (!isOrgManager) {
    return (
      <div className="space-y-6">
        <UserPageHeader title={s.userPages.orgTitle} description={s.userPages.orgDesc} />
        <EmptyState
          icon={<Building2 className="w-8 h-8" />}
          title={s.userPages.orgForbiddenTitle}
          description={s.userPages.orgForbiddenDesc}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserPageHeader title={s.userPages.orgTitle} description={s.userPages.orgDesc} />
      {/* Dati fiscali + policy MFA a sinistra, logo aziendale a destra
          (stessa griglia 2/3–1/3 della pagina profilo). */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <SettingsOrganization />
        </div>
        <SettingsOrgLogo />
      </div>
      <DomainManagement />
    </div>
  );
}

export default UserOrganization;
