"use client";

import { createContext, useContext } from "react";
import type { DashboardContextType } from "@/framework/lib/types";

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard deve essere utilizzato all'interno di DashboardLayout");
  }
  return context;
}
