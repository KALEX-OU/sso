"use client";

import React from "react";
import { useDashboard } from "../layout";
import { InvoiceModule } from "@/framework/components/invoice/invoice";
import { fetchAuthed } from "@/lib/firebase/client";

export default function InvoicePage() {
  const { dbData } = useDashboard();

  const activeOrgRelation = dbData?.userOrganizations_on_user?.[0];
  const activeOrg = activeOrgRelation?.organization;
  const organizationId = activeOrg?.orgId;

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-sm text-slate-500 dark:text-gray-400">
            Nessuna organizzazione selezionata o in corso di caricamento...
          </p>
        </div>
      </div>
    );
  }

  return (
    <InvoiceModule
      organizationId={organizationId}
      fetchAuthed={fetchAuthed}
    />
  );
}
