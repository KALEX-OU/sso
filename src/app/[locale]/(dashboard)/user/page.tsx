"use client";

// /user — PROFILO PERSONALE (UserProfile del framework): anagrafica,
// preferenze e sicurezza personale. La vecchia "Gestione Utenti" (membri org)
// è confluita in /team (UserTeam), raggiungibile dal menu utente.

import React from "react";
import { UserProfile } from "@/framework/components/user/UserProfile";

export default function UserProfilePage() {
  return <UserProfile />;
}
