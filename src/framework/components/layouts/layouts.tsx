"use client";

// L3.4 (DS_LAYOUTS_V1_1_PLAN): il DashboardLayout storico è assorbito dalla
// shell user del framework — user/UserArea (orchestratore: session sync,
// gate RBAC/MFA/onboarding) che compone la shell presentazionale user/UserLayout
// (UserSidebar dockata + Drawer mobile, UserMain, Command Palette ⌘K).
//
// NB sync-framework.js: questo file viene COPIATO come `(dashboard)/layout.tsx`
// dei frontend, sostituendo `appId = "sso"` con l'app di destinazione — il
// default nella firma qui sotto è quindi un contratto del sync, non toccarlo.

import React from "react";
import { UserArea } from "@/framework/components/user/UserArea";

export { useDashboard } from "@/framework/components/layouts/DashboardContext";

export interface LayoutProps {
  children: React.ReactNode;
  appId?: string;
}

export function DashboardLayout({ children, appId = "sso" }: LayoutProps): React.ReactElement {
  return <UserArea appId={appId}>{children}</UserArea>;
}

export default DashboardLayout;
