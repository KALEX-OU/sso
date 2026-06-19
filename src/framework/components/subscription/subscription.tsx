import React, { useState, useEffect, useCallback } from "react";
import { CreditCard, UserCheck, ExternalLink, AlertCircle } from "lucide-react";
import { BaseModuleLayout } from "../layout/BaseModuleLayout";
import styles from "./subscription.module.css";
import { useI18n } from "@/locales/client";

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

interface ServiceItem {
  serviceId: string;
  seats: number;
  quantity?: number | null;
  assignedSeats?: Array<{ uid: string; assignedAt: string }> | null;
  tier?: string | null;
}

interface SubscriptionData {
  subscriptionId: string;
  appId: string;
  status: string;
  services: ServiceItem[];
  expiresAt?: string | null;
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
  assignedSeats?: Array<{ uid: string; assignedAt: string }> | null;
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
  currentUid?: string;
}

export const SubscriptionModule: React.FC<SubscriptionModuleProps> = ({
  organizationId,
  activeRole,
  activeOrgName,
  serviceSeatsOnOrg,
  fetchAuthed,
  showToast,
  listMembersByOrg,
  currentUid
}) => {
  const t = useI18n();
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [assignedSeats, setAssignedSeats] = useState<AssignedSeatsState>({});
  const [loading, setLoading] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [updatingSeats, setUpdatingSeats] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  const loadSubscriptions = useCallback(async () => {
    try {
      const res = await fetchAuthed("/api/service/subscription/list");
      const data = await res.json();
      if (data.success) {
        const rawSubs = (data.items || data.subscriptions || []) as SubscriptionData[];
        
        // Flatten the multilateral ServiceSubscriptions into individual SubscriptionItems
        const subs: SubscriptionItem[] = [];
        for (const sub of rawSubs) {
          const servicesList = Array.isArray(sub.services) ? sub.services : [];
          for (const srv of servicesList) {
            subs.push({
              service: {
                serviceId: srv.serviceId,
                name: srv.serviceId === "a57173e2-89cd-4cbb-8452-40f42bf6e1e2" ? "KALEX SSO Console" : 
                      srv.serviceId === "c8d197e8-468f-4d43-a6d1-419b48c4cf1d" ? "KALEX API Gateway" : 
                      srv.serviceId === "f3b610c1-229d-4340-9a7e-1284eb34b68e" ? "KALEX Mobile App" : srv.serviceId
              },
              status: sub.status,
              tier: srv.tier || null,
              seats: typeof srv.quantity === "number" ? srv.quantity : (srv.seats || 1),
              expiresAt: sub.expiresAt,
              assignedSeats: srv.assignedSeats || []
            });
          }
        }

        setSubscriptions(subs);
        
        // Popola l'assegnazione dei seats dalle sottoscrizioni fresche dell'API
        const initial: AssignedSeatsState = {};
        for (const sub of subs) {
          const sId = sub.service.serviceId;
          const assigned = Array.isArray(sub.assignedSeats) ? sub.assignedSeats : [];
          initial[sId] = assigned.map((seat: { uid: string } | string | unknown) => {
            if (seat && typeof seat === "object" && "uid" in seat) {
              return (seat as { uid: string }).uid;
            }
            return typeof seat === "string" ? seat : "";
          });
        }
        setAssignedSeats(initial);
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

  const [prevSeatsJson, setPrevSeatsJson] = useState("");
  const currentSeatsJson = JSON.stringify(serviceSeatsOnOrg || []);
  if (currentSeatsJson !== prevSeatsJson) {
    setPrevSeatsJson(currentSeatsJson);
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

    // Impedisce la revoca dei servizi di base per l'owner lato client
    const isBaseService = serviceId === "a57173e2-89cd-4cbb-8452-40f42bf6e1e2" || serviceId === "c8d197e8-468f-4d43-a6d1-419b48c4cf1d";
    const targetMember = members.find(m => m.user?.uid === memberUid);
    const isOwner = targetMember?.role === "owner";

    if (isBaseService && isOwner && isAssigned) {
      showToast("Non è consentito revocare le licenze dei servizi di base (SSO e WEB) all'owner dell'organizzazione.", "error");
      return;
    }

    if (!isAssigned && currentAssigned.length >= maxSeats) {
      showToast(`Limite di postazioni raggiunto per questo abbonamento (${maxSeats}). Rimuovi un utente o acquistane di nuovi.`, "error");
      return;
    }

    setUpdatingSeats(`${serviceId}_${memberUid}`);
    try {
      let res;
      if (isAssigned) {
        res = await fetchAuthed("/api/service/subscription/seat/revoke", {
          method: "POST",
          body: JSON.stringify({ serviceId, uid: memberUid })
        });
      } else {
        const member = members.find(m => m.user?.uid === memberUid);
        const email = member?.user?.email;
        if (!email) throw new Error("Email utente non trovata.");

        res = await fetchAuthed("/api/service/subscription/seat/assign", {
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
      const res = await fetchAuthed("/api/stripe/subscription/portal", {
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
      <div className={styles.subscriptionModule}>
        {hasPastDue && (
          <div className={styles.pastDueBanner}>
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <strong className={styles.bannerTitle}>Abbonamento Insoluto!</strong>
              <p className={styles.bannerText}>
                Uno o più servizi dell&apos;organizzazione <strong>{activeOrgName}</strong> risultano insoluti. Alcune funzionalità potrebbero essere sospese. Effettua il pagamento per sbloccare l&apos;accesso.
              </p>
            </div>
            <button onClick={openStripePortal} className={styles.bannerBtn}>
              Paga Ora
            </button>
          </div>
        )}

        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Piani ed Abbonamenti</h2>
            <p className={styles.description}>
              Gestisci l&apos;abbonamento mensile, i posti dei membri (seats) ed accedi alle impostazioni di fatturazione Stripe.
            </p>
          </div>
          <button onClick={openStripePortal} className={styles.portalBtn}>
            Gestisci su Stripe
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        <div className={styles.grid}>
          {subscriptions.length === 0 ? (
            <div className={styles.noSubscriptionsCard}>
              <CreditCard className="w-12 h-12 text-slate-300 dark:text-slate-700" />
              <h3>Nessun abbonamento attivo</h3>
              <p>Abilita una delle applicazioni verticali o API di KALEX nel catalogo servizi per iniziare.</p>
            </div>
          ) : (
            subscriptions.map(sub => {
              const assigned = assignedSeats[sub.service.serviceId] || [];
              const maxSeats = sub.seats;

              return (
                <div key={sub.service.serviceId} className={styles.subCard}>
                  <div className={styles.subCardHeader}>
                    <div>
                      <h3 className={styles.subTitle}>{sub.service.name || sub.service.serviceId}</h3>
                      <span className={`${styles.badge} ${(sub.status === "active" || sub.status === "trialing") ? styles.badgeActive : styles.badgePastDue}`}>
                        {t(`subscription.status.${sub.status as "active" | "trialing" | "past_due" | "inactive" | "suspended"}`)}
                      </span>
                    </div>
                    <div className={styles.seatsCount}>
                      Postazioni: <strong>{assigned.length} / {maxSeats}</strong>
                    </div>
                  </div>

                  <div className={styles.seatsSection}>
                    <h4 className={styles.seatsTitle}>Assegnazione Licenze (Seats)</h4>
                    {loadingMembers ? (
                      <div className={styles.spinner} />
                    ) : (
                      <div className={styles.membersList}>
                        {members.map(member => {
                          if (!member.user) return null;
                          const isAssigned = assigned.includes(member.user.uid);
                          const isUpdating = updatingSeats === `${sub.service.serviceId}_${member.user.uid}`;

                          return (
                            <div key={member.user.uid} className={styles.memberRow}>
                              <div className={styles.memberInfo}>
                                <span className={styles.memberName}>
                                  {member.user.fullName || member.user.email}
                                  {member.user.uid === currentUid && (
                                    <span style={{ fontSize: "0.8rem", opacity: 0.7, marginLeft: "0.25rem" }} className="text-slate-400 font-normal">
                                      (Tu)
                                    </span>
                                  )}
                                </span>
                                <span className={styles.memberRole}>{member.role}</span>
                              </div>
                              {(() => {
                                const isSubUpdating = updatingSeats !== null && updatingSeats.startsWith(`${sub.service.serviceId}_`);
                                const isLimitReached = !isAssigned && assigned.length >= maxSeats;
                                const isBaseService = sub.service.serviceId === "a57173e2-89cd-4cbb-8452-40f42bf6e1e2" || sub.service.serviceId === "c8d197e8-468f-4d43-a6d1-419b48c4cf1d";
                                const isOwnerRow = member.role === "owner";
                                const isBtnDisabled = isUpdating || isSubUpdating || isLimitReached || (isBaseService && isOwnerRow && isAssigned);

                                return (
                                  <button
                                    onClick={() => toggleSeat(sub.service.serviceId, member.user!.uid, maxSeats)}
                                    disabled={isBtnDisabled}
                                    className={`${styles.seatBtn} ${isAssigned ? styles.seatBtnAssigned : styles.seatBtnUnassigned}`}
                                  >
                                    {isUpdating ? (
                                      "Aggiornamento..."
                                    ) : isAssigned ? (
                                      <>
                                        <UserCheck className="w-3.5 h-3.5" />
                                        Assegnato
                                      </>
                                    ) : isLimitReached ? (
                                      "Limite Raggiunto"
                                    ) : (
                                      "Assegna"
                                    )}
                                  </button>
                                );
                              })()}
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
