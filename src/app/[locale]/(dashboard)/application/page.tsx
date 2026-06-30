"use client";

import React from "react";
import { useDashboard } from "../layout";
import { fetchAuthed } from "@/lib/firebase/client";
import { ApplicationModule } from "@/framework/components/application/application";

export default function ApplicationPage() {
  const { dbData, showToast } = useDashboard();
  const organizationId = dbData?.organization?.orgId || "";

  if (!organizationId) {
    return (
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl text-sm">
        Caricamento contesto organizzazione in corso...
      </div>
    );
  }

  return (
    <div className="py-2">
      <ApplicationModule
        organizationId={organizationId}
        fetchAuthed={fetchAuthed}
        showToast={showToast}
      />
    </div>
  );
}
