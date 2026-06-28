"use client";

import React, { useState, useMemo } from "react";
import { useDashboard } from "../layouts/DashboardContext";
import { fetchAuthedClient } from "../../lib/api";
import { Card, CardBody } from "../ui/Card";
import { Tabs, Tab, TabList } from "../ui/Tabs";
import { Form } from "../layouts/Form";
import { User as UserIcon } from "lucide-react";

interface OrganizationData {
  orgId: string;
  name: string;
  type: string;
  country: string;
  vatNumber?: string | null;
  fiscalCode?: string | null;
  billingAddress?: string | null;
  sdiCode?: string | null;
  officeCode?: string | null;
  cigCode?: string | null;
  cupCode?: string | null;
  address?: string | null;
  metadata?: Record<string, unknown> | null;
}

export function Settings() {
  const { user, dbData, showToast, claims } = useDashboard();
  const [activeTab, setActiveTab] = useState("user");

  // Ruolo dell'utente loggato nell'organizzazione
  const activeRole = claims?.role;
  const isOrgManager = activeRole === "owner" || activeRole === "admin";

  // Tab effettiva per prevenire modifiche di stato sincrone
  const currentTab = isOrgManager ? activeTab : "user";

  // Dati dell'organizzazione
  const activeOrgRelation = dbData?.userOrganizations_on_user?.[0];
  const activeOrg = activeOrgRelation?.organization as unknown as OrganizationData | undefined;

  // Caricamento dei dati dell'utente
  const currentUserData = dbData?.user;

  const userInitialData = useMemo(() => {
    if (!currentUserData) return {};
    return {
      fullName: currentUserData.fullName || "",
      mobile: currentUserData.mobile || "",
      locale: currentUserData.locale || "en",
      theme: currentUserData.theme || "dark",
      avatarUrl: currentUserData.avatarUrl || ""
    };
  }, [currentUserData]);

  const orgInitialData = useMemo(() => {
    if (!activeOrg) return {};
    return {
      name: activeOrg.name || "",
      type: activeOrg.type || "business",
      country: activeOrg.country || "IT",
      vatNumber: activeOrg.vatNumber || "",
      fiscalCode: activeOrg.fiscalCode || "",
      billingAddress: activeOrg.billingAddress || "",
      sdiCode: activeOrg.sdiCode || "",
      officeCode: activeOrg.officeCode || "",
      cigCode: activeOrg.cigCode || "",
      cupCode: activeOrg.cupCode || "",
      address: activeOrg.address || ""
    };
  }, [activeOrg]);

  // Submit del Profilo Utente
  const handleUserSubmit = async (data: Record<string, unknown>, idempotencyKey: string) => {
    try {
      const resData = await fetchAuthedClient<Record<string, unknown>>("/api/user/profile", {
        method: "POST",
        headers: {
          "Idempotency-Key": idempotencyKey
        },
        body: JSON.stringify(data)
      });

      if (!resData.success) {
        throw new Error(resData.error?.message || "Errore durante l'aggiornamento del profilo.");
      }

      showToast("Profilo utente aggiornato con successo.", "success");
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Submit dell'Organizzazione
  const handleOrgSubmit = async (data: Record<string, unknown>, idempotencyKey: string) => {
    if (!activeOrg) return;

    try {
      const resData = await fetchAuthedClient<Record<string, unknown>>(`/api/organization/${activeOrg.orgId}`, {
        method: "POST",
        headers: {
          "Idempotency-Key": idempotencyKey
        },
        body: JSON.stringify({
          ...data,
          metadata: activeOrg.metadata || null
        })
      });

      if (!resData.success) {
        throw new Error(resData.error?.message || "Errore durante l'aggiornamento dell'organizzazione.");
      }

      showToast("Impostazioni dell'organizzazione salvate con successo. Ricalcolo claims in corso...", "success");
      
      // Forza il refresh del token
      if (user) {
        await user.getIdTokenResult(true);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-purple-500" /> Impostazioni Personali e Azienda
        </h1>
        <p className="text-slate-500 dark:text-gray-400 text-xs mt-1">
          Gestisci il tuo profilo personale e i dati fiscali della tua organizzazione.
        </p>
      </div>

      {isOrgManager ? (
        <Tabs
          selectedKey={currentTab}
          onSelectionChange={(key) => setActiveTab(key as string)}
          aria-label="Impostazioni"
          className="w-full"
        >
          <TabList className="border-b border-slate-200 dark:border-white/10 flex gap-6 mb-6 w-full">
            <Tab
              id="user"
              className="pb-3 text-xs font-extrabold uppercase tracking-wider cursor-pointer outline-none transition-colors border-b-2 border-transparent data-[selected=true]:border-purple-500 data-[selected=true]:text-purple-500 text-slate-400 hover:text-slate-200"
            >
              Profilo Utente
            </Tab>
            <Tab
              id="organization"
              className="pb-3 text-xs font-extrabold uppercase tracking-wider cursor-pointer outline-none transition-colors border-b-2 border-transparent data-[selected=true]:border-purple-500 data-[selected=true]:text-purple-500 text-slate-400 hover:text-slate-200"
            >
              Organizzazione
            </Tab>
          </TabList>
        </Tabs>
      ) : null}

      {/* TAB 1: PROFILO UTENTE */}
      {currentTab === "user" && (
        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6">
          <CardBody>
            <Form
              moduleId="user"
              initialData={userInitialData}
              fieldsOrder={["fullName", "email", "mobile", "locale", "theme"]}
              disabledFields={["email"]}
              onSubmit={handleUserSubmit}
              submitLabel="Salva Profilo"
            />
          </CardBody>
        </Card>
      )}

      {/* TAB 2: DATI FISCALI ORGANIZZAZIONE */}
      {currentTab === "organization" && isOrgManager && (
        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6">
          <CardBody>
            <Form
              moduleId="organization"
              initialData={orgInitialData}
              fieldsOrder={["name", "type", "country", "vatNumber", "fiscalCode", "address", "billingAddress", "sdiCode", "officeCode", "cigCode", "cupCode"]}
              onSubmit={handleOrgSubmit}
              submitLabel="Salva Organizzazione"
            />
          </CardBody>
        </Card>
      )}
    </div>
  );
}

export default Settings;
