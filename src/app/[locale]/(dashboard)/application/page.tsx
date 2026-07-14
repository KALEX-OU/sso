"use client";

import React from "react";
import { useDashboard } from "../layout";
import { fetchAuthed } from "@/lib/firebase/client";
import { ApplicationModule } from "@/framework/components/application/application";
import { useI18n } from "@/locales/client";

export default function ApplicationPage() {
  const { dbData, showToast } = useDashboard();
  const t = useI18n();
  const organizationId = dbData?.organization?.orgId || "";

  if (!organizationId) {
    return (
      <div className="p-4 bg-warning/10 border border-warning/20 text-warning rounded-2xl text-sm">
        {t("application.loadingContext")}
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
