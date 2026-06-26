"use client";

import React from "react";
import { useAuth } from "@/framework/lib/auth";

export interface AccessControlProps {
  /**
   * La risorsa da controllare (es. "thing", "apikey", "project")
   */
  resource: string;
  /**
   * Il livello di permessi richiesto.
   * Livelli standard:
   * 1 = READ
   * 2 = CREATE
   * 3 = UPDATE
   * 4 = DELETE
   */
  level: number;
  /**
   * Elemento opzionale da renderizzare in caso di permessi insufficienti.
   */
  fallback?: React.ReactNode;
  /**
   * Elementi figli visualizzati in caso di successo.
   */
  children: React.ReactNode;
}

/**
 * Componente per il controllo accessi lato client.
 * Renderizza i children se l'utente loggato ha il livello di permesso richiesto per la risorsa specificata.
 * Altrimenti, visualizza il fallback o nulla.
 */
export function AccessControl({
  resource,
  level,
  fallback = null,
  children
}: AccessControlProps) {
  const { hasPermission, loading } = useAuth();

  // Durante il caricamento dello stato di auth e dei claims, non mostriamo nulla
  // per prevenire fastidiosi flash visivi.
  if (loading) {
    return null;
  }

  const allowed = hasPermission(resource, level);

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
