"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDashboard } from "../layout";
import { ServiceModule } from "@/framework/components/service/service";
import { fetchAuthed } from "@/lib/firebase/client";

export default function ApplicationPage() {
  const { dbData, showToast } = useDashboard();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const hasSessionId = searchParams.get("session_id");
  const isSuccess = searchParams.get("checkout") === "success" || searchParams.get("checkout_success") === "true" || searchParams.get("checkout") === "cancel";
  const shouldRedirect = !!(hasSessionId || isSuccess);

  const activeOrgRelation = dbData?.userOrganizations_on_user?.[0];
  const activeOrg = activeOrgRelation?.organization;
  const activeRole = activeOrgRelation?.role;
  const organizationId = activeOrg?.orgId;

  // Reindirizzamento immediato per sessioni legacy di checkout verso /subscription
  useEffect(() => {
    if (shouldRedirect) {
      router.replace(`/subscription?${searchParams.toString()}`);
    }
  }, [shouldRedirect, searchParams, router]);

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

  if (shouldRedirect) {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white">
        <span className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></span>
        <h3 className="text-lg font-bold">Reindirizzamento in corso...</h3>
      </div>
    );
  }

  return (
    <ServiceModule
      organizationId={organizationId}
      activeRole={activeRole}
      fetchAuthed={fetchAuthed}
      showToast={showToast}
    />
  );
}
