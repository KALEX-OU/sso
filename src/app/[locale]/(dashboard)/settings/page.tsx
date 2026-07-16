"use client";

// /settings — ORGANIZZAZIONE (UserOrganization del framework): dati fiscali,
// policy di sicurezza org e domini white-label, senza tab. Il profilo
// personale vive su /user (UserProfile), i membri su /team (UserTeam).

import React from "react";
import { UserOrganization } from "@/framework/components/user/UserOrganization";

export default function SettingsPage() {
  return <UserOrganization />;
}
