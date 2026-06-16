"use client";

import React from "react";
import { useDashboard } from "../layout";
import { ProductModule } from "@/framework/components/product/product";
import { fetchAuthed } from "@/lib/firebase/client";

export default function ProductPage() {
  const { dbData, showToast } = useDashboard();

  const activeOrgRelation = dbData?.userOrganizations_on_user?.[0];
  const activeOrg = activeOrgRelation?.organization;
  const activeRole = activeOrgRelation?.role;
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
    <ProductModule
      organizationId={organizationId}
      activeRole={activeRole}
      fetchAuthed={fetchAuthed}
      showToast={showToast}
    />
  );
}
