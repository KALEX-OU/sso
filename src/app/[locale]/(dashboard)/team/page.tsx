"use client";

// /team — gestione UNIFICATA di membri e team (UserTeam del framework):
// inviti, ruoli, permessi RBAC per membro/team, reset 2FA assistito.
// La rete passa da fetchAuthedClient (framework); l'unica dipendenza
// applicativa è Data Connect (listMembersByOrg), passata via props.

import React, { useCallback } from "react";
import { dataConnect } from "@/lib/firebase/client";
import { listMembersByOrg } from "@/lib/dataconnect-client";
import { UserTeam, TeamMemberItem } from "@/framework/components/user/UserTeam";

export default function TeamPage() {
  const listMembers = useCallback(async (orgId: string): Promise<TeamMemberItem[]> => {
    const memRes = await listMembersByOrg(dataConnect, { orgId });
    return (memRes.data.userOrganizations || []) as TeamMemberItem[];
  }, []);

  return <UserTeam listMembers={listMembers} />;
}
