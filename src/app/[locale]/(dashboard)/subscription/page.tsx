"use client";

import React, { useCallback } from "react";
import { useDashboard } from "../layout";
import { SubscriptionModule } from "@/framework/components/subscription/subscription";
import { fetchAuthed } from "@/lib/firebase/client";

export default function SubscriptionPage() {
  const { dbData, showToast } = useDashboard();

  const activeOrgRelation = dbData?.userOrganizations_on_user?.[0];
  const activeOrg = activeOrgRelation?.organization;
  const activeRole = activeOrgRelation?.role;
  const organizationId = activeOrg?.orgId;
  const activeOrgName = activeOrg?.name;

  // Estrae i seats dal dbData dell'organizzazione
  const serviceSeatsOnOrg = activeOrg?.serviceSeats_on_organization?.map((seat) => ({
    service: { serviceId: seat.service.serviceId },
    user: { uid: seat.user.uid }
  }));

  const handleListMembersByOrg = useCallback(async (orgId: string) => {
    const { dataConnect } = await import("@/lib/firebase/client");
    const { listMembersByOrg: sdkListMembersByOrg } = await import("@/lib/dataconnect-client");
    const memRes = await sdkListMembersByOrg(dataConnect, { orgId });
    return (memRes.data.userOrganizations || []).map((mo) => ({
      role: mo.role,
      joinedAt: mo.joinedAt,
      user: mo.user ? {
        uid: mo.user.uid,
        email: mo.user.email,
        fullName: mo.user.fullName,
        avatarUrl: mo.user.avatarUrl
      } : null
    }));
  }, []);

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
    <SubscriptionModule
      organizationId={organizationId}
      activeRole={activeRole}
      activeOrgName={activeOrgName}
      serviceSeatsOnOrg={serviceSeatsOnOrg}
      fetchAuthed={fetchAuthed}
      showToast={showToast}
      listMembersByOrg={handleListMembersByOrg}
    />
  );
}
