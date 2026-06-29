"use client";

import React, { useState } from "react";
import { useAuth, forceCleanSession } from "../../lib/auth";
import { Modal, ModalBackdrop, ModalContainer, ModalDialog, ModalHeader, ModalBody, ModalFooter, ModalHeading } from "./Modal";
import { Tabs, Tab, TabList } from "./Tabs";
import { Button } from "./Button";
import { Bug, Copy, Check, LogOut, RefreshCw } from "lucide-react";

export function DebugWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("claims");
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user, claims } = useAuth();

  // Visualizza solo in modalità di sviluppo locale
  const [isDev] = useState(() => {
    if (typeof window !== "undefined") {
      const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      return process.env.NODE_ENV === "development" || isLocalhost;
    }
    return false;
  });

  if (!isDev) return null;

  const handleCopyToken = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Impossibile copiare il token:", err);
    }
  };

  const handleRefreshClaims = async () => {
    if (!user) return;
    setIsRefreshing(true);
    try {
      // Forza il refresh dell'ID Token da Firebase per aggiornare i Custom Claims
      await user.getIdToken(true);
      window.location.reload();
    } catch (err) {
      console.error("Errore durante il refresh dei claims:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <>
      {/* Bottone flottante di debug */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 flex items-center justify-center w-12 h-12 rounded-full border border-purple-500/30 bg-slate-900/80 backdrop-blur-md text-purple-400 hover:text-purple-300 hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/10 cursor-pointer transition-all duration-200"
        title="Apri Pannello di Debug"
      >
        <Bug className="w-6 h-6 animate-pulse" />
      </button>

      {/* Finestra di debug */}
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalBackdrop isDismissable={true} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <ModalContainer className="dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-3xl p-6 max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <ModalDialog className="flex flex-col h-full overflow-hidden">
              
              <ModalHeader className="flex items-center gap-2 border-b border-white/5 pb-4">
                <Bug className="text-purple-400 w-5 h-5" />
                <ModalHeading className="text-lg font-extrabold text-white">
                  KALEX Developer Debug Panel
                </ModalHeading>
              </ModalHeader>

              <ModalBody className="py-6 overflow-y-auto flex-1 space-y-4">
                <Tabs selectedKey={activeTab} onSelectionChange={(k) => setActiveTab(k as string)} className="w-full">
                  <TabList className="border-b border-white/10 flex gap-4 mb-4">
                    <Tab
                      id="claims"
                      className="pb-2 text-xs font-bold uppercase tracking-wider cursor-pointer outline-none transition-colors border-b-2 border-transparent data-[selected=true]:border-purple-500 data-[selected=true]:text-purple-500 text-slate-400 hover:text-slate-200"
                    >
                      Custom Claims
                    </Tab>
                    <Tab
                      id="user"
                      className="pb-2 text-xs font-bold uppercase tracking-wider cursor-pointer outline-none transition-colors border-b-2 border-transparent data-[selected=true]:border-purple-500 data-[selected=true]:text-purple-500 text-slate-400 hover:text-slate-200"
                    >
                      User Info
                    </Tab>
                    <Tab
                      id="actions"
                      className="pb-2 text-xs font-bold uppercase tracking-wider cursor-pointer outline-none transition-colors border-b-2 border-transparent data-[selected=true]:border-purple-500 data-[selected=true]:text-purple-500 text-slate-400 hover:text-slate-200"
                    >
                      Azioni Staging
                    </Tab>
                  </TabList>
                </Tabs>

                {/* Contenuto Tab 1: Custom Claims */}
                {activeTab === "claims" && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-400">
                      I token JWT emessi da Firebase Auth contengono i seguenti claims configurati sul database Cloud:
                    </p>
                    {claims ? (
                      <pre className="p-4 bg-slate-900 border border-white/5 rounded-2xl overflow-x-auto text-[11px] font-mono text-purple-300 leading-relaxed max-h-[300px]">
                        {JSON.stringify(claims, null, 2)}
                      </pre>
                    ) : (
                      <div className="p-4 text-center border border-dashed border-white/10 rounded-2xl text-xs text-slate-500">
                        Nessun claim caricato o utente non autenticato.
                      </div>
                    )}
                  </div>
                )}

                {/* Contenuto Tab 2: User Info */}
                {activeTab === "user" && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-400">
                      Dettagli dell&apos;oggetto utente autenticato caricato da Firebase SDK:
                    </p>
                    {user ? (
                      <div className="space-y-4">
                        <pre className="p-4 bg-slate-900 border border-white/5 rounded-2xl overflow-x-auto text-[11px] font-mono text-slate-300 leading-relaxed max-h-[220px]">
                          {JSON.stringify(
                            {
                              uid: user.uid,
                              email: user.email,
                              emailVerified: user.emailVerified,
                              displayName: user.displayName,
                              photoURL: user.photoURL,
                              isAnonymous: user.isAnonymous,
                              metadata: user.metadata
                            },
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    ) : (
                      <div className="p-4 text-center border border-dashed border-white/10 rounded-2xl text-xs text-slate-500">
                        Utente non connesso.
                      </div>
                    )}
                  </div>
                )}

                {/* Contenuto Tab 3: Azioni Staging */}
                {activeTab === "actions" && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-400">
                      Strumenti rapidi per testare i flussi di onboarding, rbac e autenticazione:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <Button
                        onClick={handleCopyToken}
                        isDisabled={!user}
                        variant="ghost"
                        className="flex items-center justify-start gap-2 p-3 text-xs font-bold uppercase border border-white/5 hover:bg-white/5 text-slate-300 hover:text-white rounded-xl transition-all"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                            Copiato!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-purple-400 shrink-0" />
                            Copia JWT Token
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={handleRefreshClaims}
                        isDisabled={!user || isRefreshing}
                        variant="ghost"
                        className="flex items-center justify-start gap-2 p-3 text-xs font-bold uppercase border border-white/5 hover:bg-white/5 text-slate-300 hover:text-white rounded-xl transition-all"
                      >
                        <RefreshCw className={`w-4 h-4 text-purple-400 shrink-0 ${isRefreshing ? "animate-spin" : ""}`} />
                        Rinfresca Claims
                      </Button>

                      <Button
                        onClick={() => forceCleanSession()}
                        variant="ghost"
                        className="flex items-center justify-start gap-2 p-3 text-xs font-bold uppercase border border-red-500/20 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-xl transition-all sm:col-span-2"
                      >
                        <LogOut className="w-4 h-4 text-red-400 shrink-0" />
                        Pulisci Sessione & Hard Logout
                      </Button>
                    </div>
                  </div>
                )}
              </ModalBody>

              <ModalFooter className="pt-4 flex justify-end gap-2 border-t border-white/5">
                <Button
                  onClick={() => setIsOpen(false)}
                  className="font-bold text-xs uppercase bg-white/5 hover:bg-white/10 text-white rounded-xl"
                >
                  Chiudi
                </Button>
              </ModalFooter>

            </ModalDialog>
          </ModalContainer>
        </ModalBackdrop>
      </Modal>
    </>
  );
}
