"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDashboard } from "../layout";
import { dataConnect } from "@/lib/firebase/client";
import { listMembersByOrg } from "@/lib/dataconnect-client";
import { Card, Button, Chip, Avatar } from "@heroui/react";
import { CreditCard, UserCheck, ExternalLink } from "lucide-react";

interface MemberItem {
  role: string;
  joinedAt: string;
  user?: {
    uid: string;
    email: string;
    fullName?: string | null;
    avatarUrl?: string | null;
  } | null;
  status?: string;
}

interface AssignedSeatsState {
  [serviceId: string]: string[]; // Array di userUid assegnati
}

export default function SubscriptionPage() {
  const { dbData, showToast } = useDashboard();
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  
  // Stato per tenere traccia delle assegnazioni locali dei seats
  const [assignedSeats, setAssignedSeats] = useState<AssignedSeatsState>({
    "safety": [],
    "standlo": []
  });
  const [updatingSeats, setUpdatingSeats] = useState<string | null>(null);

  const activeOrgRelation = dbData?.userOrganizations_on_user?.[0];
  const activeOrg = activeOrgRelation?.organization;
  const activeRole = activeOrgRelation?.role;

  // Abbonamenti attivi dell'organizzazione
  const activeSubscriptions = activeOrg?.serviceSubscriptions_on_organization || [];

  const loadMembers = useCallback(async (orgId: string) => {
    setLoadingMembers(true);
    try {
      const memRes = await listMembersByOrg(dataConnect, { orgId });
      const activeMems = (memRes.data.userOrganizations || []) as MemberItem[];
      setMembers(activeMems);

      // Inizializza l'assegnazione dei seats in modo casuale o logico per il mock
      // per fornire dati pronti all'uso all'utente
      const uids = activeMems.map(m => m.user?.uid).filter((id): id is string => !!id);
      setAssignedSeats({
        "safety": uids.slice(0, Math.min(2, uids.length)),
        "standlo": uids.slice(0, Math.min(1, uids.length))
      });
    } catch (err) {
      console.error("Errore caricamento membri per seats:", err);
      showToast("Impossibile caricare l'elenco dei membri.", "error");
    } finally {
      setLoadingMembers(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (activeOrg?.orgId) {
      const timer = setTimeout(() => {
        void loadMembers(activeOrg.orgId);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeOrg?.orgId, loadMembers]);

  const toggleSeat = async (serviceId: string, memberUid: string, maxSeats: number) => {
    if (activeRole !== "owner" && activeRole !== "admin") {
      showToast("Non disponi dei privilegi di amministratore per assegnare licenze.", "error");
      return;
    }

    const currentAssigned = assignedSeats[serviceId] || [];
    const isAssigned = currentAssigned.includes(memberUid);

    if (!isAssigned && currentAssigned.length >= maxSeats) {
      showToast(`Limite di postazioni (seats) raggiunto per questo abbonamento (${maxSeats}). Rimuovi un utente o acquista altri posti su Stripe.`, "error");
      return;
    }

    setUpdatingSeats(`${serviceId}_${memberUid}`);
    try {
      // Simuliamo il salvataggio asincrono dei permessi d'uso
      setTimeout(() => {
        let updated: string[];
        if (isAssigned) {
          updated = currentAssigned.filter(id => id !== memberUid);
          showToast("Licenza revocata con successo per l'utente selezionato.", "success");
        } else {
          updated = [...currentAssigned, memberUid];
          showToast("Licenza assegnata con successo all'utente selezionato.", "success");
        }
        
        setAssignedSeats(prev => ({
          ...prev,
          [serviceId]: updated
        }));
        setUpdatingSeats(null);
      }, 1000);
    } catch (err) {
      console.error(err);
      showToast("Errore durante l'aggiornamento dell'assegnazione.", "error");
      setUpdatingSeats(null);
    }
  };

  const openStripePortal = () => {
    showToast("Reindirizzamento a Stripe Customer Portal in corso...", "info");
    // In produzione, apre la sessione del portale clienti Stripe per gestire fatture ed abbonamento
    setTimeout(() => {
      window.open("https://billing.stripe.com/p/login/test_demo", "_blank");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Gestione Abbonamenti SaaS & Seats</h2>
          <p className="text-slate-500 dark:text-gray-400 text-xs mt-1">
            Visualizza lo stato dei tuoi abbonamenti e alloca le postazioni (seats) acquistate tra i membri del tuo team.
          </p>
        </div>

        {activeOrg?.stripeCustomerId && (
          <Button
            onClick={openStripePortal}
            className="py-3 px-5 font-bold border border-purple-500/30 hover:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl active:scale-[0.98] transition-all cursor-pointer text-xs flex items-center justify-center gap-2"
          >
            Gestisci su Stripe <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      {activeSubscriptions.length === 0 ? (
        <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-8 text-center space-y-4">
          <Card.Content className="p-2 max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 mx-auto">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-md font-extrabold text-slate-900 dark:text-white">Nessun Abbonamento Attivo</h3>
              <p className="text-slate-500 dark:text-gray-400 text-xs mt-1 leading-relaxed">
                La tua organizzazione non ha ancora sottoscritto alcun abbonamento SaaS. Vai nella sezione &quot;Servizi Cloud&quot; per iniziare.
              </p>
            </div>
          </Card.Content>
        </Card>
      ) : (
        <div className="space-y-6">
          {activeSubscriptions.map((sub, idx) => {
            const serviceId = sub.service.serviceId;
            const serviceName = serviceId === "safety" ? "KALEX Safety" : serviceId === "standlo" ? "KALEX Standlo" : serviceId;
            
            // Definiamo i posti fittizi inclusi nell'abbonamento acquistato su Stripe
            const maxSeats = serviceId === "safety" ? 5 : 3;
            const currentAssigned = assignedSeats[serviceId] || [];
            const activeSeatsCount = currentAssigned.length;

            return (
              <div key={serviceId || idx} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Dettagli Abbonamento */}
                <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6 lg:col-span-1">
                  <Card.Content className="p-2 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Abbonamento SaaS</span>
                        <h3 className="text-md font-black text-slate-900 dark:text-white">{serviceName}</h3>
                      </div>
                      <Chip color="success" size="sm" variant="soft" className="uppercase font-bold text-[8px]">
                        {sub.status}
                      </Chip>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-200/50 dark:border-white/5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 dark:text-gray-400">Piano Tariffario</span>
                        <span className="font-bold text-slate-900 dark:text-white capitalize">{sub.tier || "Premium"}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 dark:text-gray-400">Postazioni Totali</span>
                        <span className="font-extrabold text-slate-900 dark:text-white">{maxSeats} Posti</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 dark:text-gray-400">Prossimo Rinnovo</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString() : "Illimitato"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-slate-200/50 dark:border-white/5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">Postazioni Utilizzate</span>
                        <span className="text-purple-600 dark:text-purple-400">
                          {activeSeatsCount} / {maxSeats}
                        </span>
                      </div>
                      {/* Barra di avanzamento per l'allocazione */}
                      <div className="w-full bg-slate-100 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${(activeSeatsCount / maxSeats) * 100}%` }}
                        />
                      </div>
                    </div>
                  </Card.Content>
                </Card>

                {/* Assegnazione Seats */}
                <Card className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl rounded-3xl p-6 lg:col-span-2">
                  <Card.Content className="p-2 space-y-4">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Assegna Licenze agli Utenti</h4>
                      <p className="text-slate-500 dark:text-gray-400 text-[10px] mt-0.5">
                        Seleziona i membri dell&apos;organizzazione per concedere loro l&apos;accesso a questa applicazione.
                      </p>
                    </div>

                    {loadingMembers ? (
                      <div className="flex justify-center p-6"><span className="animate-spin rounded-full h-6 w-6 border-t-2 border-purple-500"></span></div>
                    ) : (
                      <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                        {members.map((member, mIdx) => {
                          const u = member.user;
                          if (!u) return null;
                          const isAssigned = currentAssigned.includes(u.uid);
                          const isUpdating = updatingSeats === `${serviceId}_${u.uid}`;

                          return (
                            <div
                              key={u.uid || mIdx}
                              className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-100/50 dark:hover:bg-white/[0.01] transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="w-7.5 h-7.5 text-xs font-bold bg-slate-200 dark:bg-white/10">
                                  {u.avatarUrl && <Avatar.Image src={u.avatarUrl} />}
                                  <Avatar.Fallback className="text-white">{(u.fullName || u.email || "U").slice(0, 2)}</Avatar.Fallback>
                                </Avatar>
                                <div>
                                  <p className="text-xs font-bold text-slate-900 dark:text-white">{u.fullName || "Membro Invitato"}</p>
                                  <p className="text-[10px] text-slate-400">{u.email}</p>
                                </div>
                              </div>

                              <Button
                                size="sm"
                                variant={isAssigned ? "secondary" : "ghost"}
                                isDisabled={isUpdating}
                                className={`font-bold text-[10px] py-1.5 px-4 rounded-xl cursor-pointer transition-all ${
                                  isAssigned
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10"
                                    : "border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5"
                                }`}
                                onClick={() => void toggleSeat(serviceId, u.uid, maxSeats)}
                              >
                                {isUpdating ? (
                                  <span className="animate-spin rounded-full h-3 w-3 border-t-2 border-slate-500"></span>
                                ) : isAssigned ? (
                                  <span className="flex items-center gap-1"><UserCheck className="w-3.5 h-3.5" /> Assegnato</span>
                                ) : (
                                  "Assegna"
                                )}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </Card.Content>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
