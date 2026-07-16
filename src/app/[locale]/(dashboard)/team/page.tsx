"use client";

// /team — gestione UNIFICATA di membri e team (UserTeam del framework):
// inviti, ruoli, permessi RBAC per membro/team, reset 2FA assistito.
// Le dipendenze applicative (fetch autenticata e Data Connect) passano
// via props, come per i moduli Product/Invoice.

import React, { useCallback } from "react";
import { dataConnect, fetchAuthed } from "@/lib/firebase/client";
import { listMembersByOrg } from "@/lib/dataconnect-client";
import { UserTeam, TeamMemberItem } from "@/framework/components/user/UserTeam";

export default function TeamPage() {
  const listMembers = useCallback(async (orgId: string): Promise<TeamMemberItem[]> => {
    const memRes = await listMembersByOrg(dataConnect, { orgId });
    return (memRes.data.userOrganizations || []) as TeamMemberItem[];
  }, []);

  return <UserTeam fetchAuthed={fetchAuthed} listMembers={listMembers} />;
}
