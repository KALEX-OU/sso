"use client";

// L3.4 (DS_LAYOUTS_V1_1_PLAN): il DashboardLayout storico è assorbito dalla
// shell user del framework — user/UserLayout (UserSidebar dockata + Drawer
// mobile, UserMain con ErrorBoundary/Suspense e toast host, Command Palette ⌘K).
//
// NB sync-framework.js: questo file viene COPIATO come `(dashboard)/layout.tsx`
// dei frontend, sostituendo `appId = "sso"` con l'app di destinazione — il
// default nella firma qui sotto è quindi un contratto del sync, non toccarlo.

import React from "react";
import { UserLayout } from "@/framework/components/user/UserLayout";

export { useDashboard } from "@/framework/components/layouts/DashboardContext";

export interface LayoutProps {
  children: React.ReactNode;
  appId?: string;
}

export function DashboardLayout({ children, appId = "sso" }: LayoutProps): React.ReactElement {
  return <UserLayout appId={appId}>{children}</UserLayout>;
}

export default DashboardLayout;
