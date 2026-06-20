import React, { useState, useEffect, useCallback } from "react";
import { CreditCard, UserCheck, ExternalLink, AlertCircle } from "lucide-react";
import { BaseModuleLayout } from "../layouts/BaseModuleLayout";

interface MemberItem {
  role: string;
  joinedAt: string;
  user?: {
    uid: string;
    email: string;
    fullName?: string | null;
    avatarUrl?: string | null;
  } | null;
}

interface SubscriptionItem {
  service: {
    serviceId: string;
    name?: string;
  };
  status: string;
  tier?: string | null;
  seats: number;
  expiresAt?: string | null;
}

interface AssignedSeatsState {
  [serviceId: string]: string[];
}

interface SubscriptionModuleProps {
  organizationId: string;
  activeRole: string | undefined;
  activeOrgName: string | undefined;
  serviceSeatsOnOrg: Array<{ service: { serviceId: string }; user: { uid: string } }> | undefined;
  fetchAuthed: (url: string, options?: RequestInit) => Promise<Response>;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
  listMembersByOrg: (orgId: string) => Promise<MemberItem[]>;
}

export const SubscriptionModule: React.FC<SubscriptionModuleProps> = ({
  organizationId,
  activeRole,
  activeOrgName,
  serviceSeatsOnOrg,
  fetchAuthed,
  showToast,
  listMembersByOrg
}) => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [assignedSeats, setAssignedSeats] = useState<AssignedSeatsState>({});
  const [loading, setLoading] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [updatingSeats, setUpdatingSeats] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  const loadSubscriptions = useCallback(async () => {
    try {
      const res = await fetchAuthed("/api/subscription/list");
      const data = await res.json();
      if (data.success) {
        setSubscriptions(data.items || data.subscriptions || []);
      } else {
        const errMsg = data.error && typeof data.error === "object" && "message" in data.error
          ? String(data.error.message)
          : typeof data.error === "string"
            ? data.error
            : "Impossibile recuperare lo storico abbonamenti.";
        setError(errMsg);
      }
    } catch (err) {
      console.error("[SubscriptionModule] Load Subs Error:", err);
      setError("Errore durante il caricamento dei dati di abbonamento.");
    }
  }, [fetchAuthed]);

  const loadMembers = useCallback(async () => {
    setLoadingMembers(true);
    try {
      const activeMems = await listMembersByOrg(organizationId);
      setMembers(activeMems);
    } catch (err) {
      console.error("[SubscriptionModule] Load Members Error:", err);
    } finally {
      setLoadingMembers(false);
    }
  }, [organizationId, listMembersByOrg]);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      await Promise.all([loadSubscriptions(), loadMembers()]);
    } catch (err) {
      console.error(err);
      setError("Errore durante il caricamento dei dati di abbonamento.");
    } finally {
      setLoading(false);
    }
  }, [loadSubscriptions, loadMembers]);

  useEffect(() => {
    if (organizationId) {
      const timer = setTimeout(() => {
        void loadAllData();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [organizationId, loadAllData]);

  const [prevSeats, setPrevSeats] = useState(serviceSeatsOnOrg);
  if (serviceSeatsOnOrg !== prevSeats) {
    setPrevSeats(serviceSeatsOnOrg);
    const initial: AssignedSeatsState = {};
    if (serviceSeatsOnOrg) {
      for (const seat of serviceSeatsOnOrg) {
        const sId = seat.service.serviceId;
        const uId = seat.user.uid;
        if (!initial[sId]) {
          initial[sId] = [];
        }
        initial[sId].push(uId);
      }
    }
    setAssignedSeats(initial);
  }

  const toggleSeat = async (serviceId: string, memberUid: string, maxSeats: number) => {
    if (activeRole !== "owner" && activeRole !== "admin") {
      showToast("Non disponi dei privilegi di amministratore per assegnare licenze.", "error");
      return;
    }

    const currentAssigned = assignedSeats[serviceId] || [];
    const isAssigned = currentAssigned.includes(memberUid);

    if (!isAssigned && currentAssigned.length >= maxSeats) {
      showToast(`Limite di postazioni raggiunto per questo abbonamento (${maxSeats}). Rimuovi un utente o acquistane di nuovi.`, "error");
      return;
    }

    setUpdatingSeats(`${serviceId}_${memberUid}`);
    try {
      let res;
      if (isAssigned) {
        res = await fetchAuthed("/api/subscription/seat/revoke", {
          method: "POST",
          body: JSON.stringify({ serviceId, uid: memberUid })
        });
      } else {
        const member = members.find(m => m.user?.uid === memberUid);
        const email = member?.user?.email;
        if (!email) throw new Error("Email utente non trovata.");

        res = await fetchAuthed("/api/subscription/seat/assign", {
          method: "POST",
          body: JSON.stringify({ serviceId, email })
        });
      }

      const data = await res.json();
      if (data.success) {
        let updated: string[];
        if (isAssigned) {
          updated = currentAssigned.filter(id => id !== memberUid);
          showToast("Licenza revocata con successo.", "success");
        } else {
          updated = [...currentAssigned, memberUid];
          showToast("Licenza assegnata con successo.", "success");
        }
        
        setAssignedSeats(prev => ({
          ...prev,
          [serviceId]: updated
        }));
      } else {
        showToast(data.error || "Impossibile aggiornare la licenza.", "error");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      showToast(`Errore durante l'aggiornamento della licenza: ${message}`, "error");
    } finally {
      setUpdatingSeats(null);
    }
  };

  const openStripePortal = async () => {
    showToast("Reindirizzamento a Stripe Customer Portal in corso...", "info");
    try {
      const res = await fetchAuthed("/api/stripe/portal-session", {
        method: "POST",
        body: JSON.stringify({ returnUrl: window.location.href })
      });
      const data = await res.json();
      if (data.success && data.url) {
        window.location.assign(data.url);
      } else {
        showToast("Impossibile aprire il portale Stripe.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Errore di connessione con il server Stripe.", "error");
    }
  };

  const hasPastDue = subscriptions.some(sub => sub.status === "past_due");

  return (
    <BaseModuleLayout isLoading={loading} error={error}>
      <div className="w-full">
        {hasPastDue && (
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-danger-500/10 text-danger border border-danger-500/20 rounded-2xl mb-6 shadow-md">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <strong className="text-sm font-extrabold uppercase tracking-wider block mb-1">Abbonamento Insoluto!</strong>
              <p className="text-xs opacity-90">
                Uno o più servizi dell&apos;organizzazione <strong>{activeOrgName}</strong> risultano insoluti. Alcune funzionalità potrebbero essere sospese. Effettua il pagamento per sbloccare l&apos;accesso.
              </p>
            </div>
            <button onClick={openStripePortal} className="sm:ml-auto px-4 py-2 bg-danger text-white font-extrabold uppercase text-xs rounded-xl shadow-md active:scale-95 transition-all cursor-pointer">
              Paga Ora
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Piani ed Abbonamenti</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Gestisci l&apos;abbonamento mensile, i posti dei membri (seats) ed accedi alle impostazioni di fatturazione Stripe.
            </p>
          </div>
          <button onClick={openStripePortal} className="inline-flex items-center gap-2 px-4 py-2 bg-default-100 hover:bg-default-200 border border-divider text-foreground font-bold text-sm rounded-xl active:scale-95 transition-all cursor-pointer">
            Gestisci su Stripe
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {subscriptions.length === 0 ? (
            <div className="col-span-full border border-divider border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3 bg-content1/50">
              <CreditCard className="w-12 h-12 text-slate-300 dark:text-slate-700" />
              <h3 className="font-bold text-lg">Nessun abbonamento attivo</h3>
              <p className="text-xs text-muted-foreground">Abilita una delle applicazioni verticali o API di KALEX nel catalogo servizi per iniziare.</p>
            </div>
          ) : (
            subscriptions.map(sub => {
              const assigned = assignedSeats[sub.service.serviceId] || [];
              const maxSeats = sub.seats;

              return (
                <div key={sub.service.serviceId} className="flex flex-col border border-divider rounded-2xl bg-content1 shadow-md p-5">
                  <div className="flex justify-between items-start gap-4 mb-5 border-b border-divider/40 pb-4">
                    <div>
                      <h3 className="font-bold text-base text-foreground">{sub.service.name || sub.service.serviceId}</h3>
                      <span className={`inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${sub.status === "active" ? "bg-success-500/10 text-success" : "bg-danger-500/10 text-danger"}`}>
                        {sub.status}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground bg-default-100 px-3 py-1.5 rounded-xl border border-divider">
                      Postazioni: <strong>{assigned.length} / {maxSeats}</strong>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Assegnazione Licenze (Seats)</h4>
                    {loadingMembers ? (
                      <div className="w-8 h-8 rounded-full border-2 border-divider border-t-purple-500 animate-spin mx-auto my-4" />
                    ) : (
                      <div className="flex flex-col gap-2">
                        {members.map(member => {
                          if (!member.user) return null;
                          const isAssigned = assigned.includes(member.user.uid);
                          const isUpdating = updatingSeats === `${sub.service.serviceId}_${member.user.uid}`;

                          return (
                            <div key={member.user.uid} className="flex items-center justify-between gap-4 p-3 bg-default-50/50 rounded-xl border border-divider/40">
                              <div className="flex flex-col text-left">
                                <span className="text-xs font-bold text-foreground">{member.user.fullName || member.user.email}</span>
                                <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">{member.role}</span>
                              </div>
                              <button
                                onClick={() => toggleSeat(sub.service.serviceId, member.user!.uid, maxSeats)}
                                disabled={isUpdating}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-95 ${isAssigned ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20" : "bg-default-100 border border-divider hover:bg-default-200 text-foreground"}`}
                              >
                                {isUpdating ? (
                                  "Aggiornamento..."
                                ) : isAssigned ? (
                                  <>
                                    <UserCheck className="w-3.5 h-3.5" />
                                    Assegnato
                                  </>
                                ) : (
                                  "Assegna"
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </BaseModuleLayout>
  );
};
