import React, { useState, useEffect, useCallback, useRef } from "react";
import { CreditCard, UserCheck, ExternalLink, AlertCircle } from "lucide-react";
import { BaseModuleLayout } from "../layouts/BaseModuleLayout";
import { useBrand } from "../providers/BrandProvider";
import { useUIStrings, fmtUI } from "../../lib/ui.localization";
import {
  apiErrorMessage,
  subscriptionListResponseSchema,
  seatMutationResponseSchema,
  portalSessionResponseSchema,
  type SubscriptionItem
} from "../../lib/schemas/api";

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
  const brand = useBrand();
  const s = useUIStrings();
  // Ref alle stringhe correnti: le callback leggono sempre l'ultima lingua
  // senza aggiungere `s` alle dipendenze (il cambio lingua non ri-innesca i fetch).
  const sRef = useRef(s);
  useEffect(() => {
    sRef.current = s;
  }, [s]);
  const [loading, setLoading] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [updatingSeats, setUpdatingSeats] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  const loadSubscriptions = useCallback(async () => {
    try {
      const res = await fetchAuthed("/api/subscription/list");
      // Validazione Zod della risposta (E3.5): payload malformato → log + errore i18n, mai dato corrotto.
      const parsed = subscriptionListResponseSchema.safeParse(await res.json());
      if (!parsed.success) {
        console.error("[SubscriptionModule] Risposta /subscription/list non conforme allo schema:", parsed.error);
        setError(sRef.current.modules.subscription.errLoadSubs);
        return;
      }
      const data = parsed.data;
      if (data.success) {
        setSubscriptions(data.items ?? data.subscriptions ?? []);
      } else {
        setError(apiErrorMessage(data) ?? sRef.current.modules.subscription.errLoadSubs);
      }
    } catch (err) {
      console.error("[SubscriptionModule] Load Subs Error:", err);
      setError(sRef.current.modules.subscription.errLoadData);
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
      setError(sRef.current.modules.subscription.errLoadData);
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
      showToast(s.modules.subscription.noAdminPrivileges, "error");
      return;
    }

    const currentAssigned = assignedSeats[serviceId] || [];
    const isAssigned = currentAssigned.includes(memberUid);

    if (!isAssigned && currentAssigned.length >= maxSeats) {
      showToast(fmtUI(s.modules.subscription.seatLimitReached, { max: maxSeats }), "error");
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
        if (!email) throw new Error(s.modules.subscription.emailNotFound);

        res = await fetchAuthed("/api/subscription/seat/assign", {
          method: "POST",
          body: JSON.stringify({ serviceId, email })
        });
      }

      // Validazione Zod dell'ack seat assign/revoke
      const parsed = seatMutationResponseSchema.safeParse(await res.json());
      if (!parsed.success) {
        console.error("[SubscriptionModule] Risposta seat non conforme allo schema:", parsed.error);
        showToast(sRef.current.modules.subscription.errSeatUpdate, "error");
        return;
      }
      const data = parsed.data;
      if (data.success) {
        let updated: string[];
        if (isAssigned) {
          updated = currentAssigned.filter(id => id !== memberUid);
          showToast(s.modules.subscription.seatRevoked, "success");
        } else {
          updated = [...currentAssigned, memberUid];
          showToast(s.modules.subscription.seatAssigned, "success");
        }
        
        setAssignedSeats(prev => ({
          ...prev,
          [serviceId]: updated
        }));
      } else {
        showToast(apiErrorMessage(data) ?? s.modules.subscription.errSeatUpdate, "error");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      showToast(fmtUI(s.modules.subscription.errSeatUpdateDetail, { message }), "error");
    } finally {
      setUpdatingSeats(null);
    }
  };

  const openStripePortal = async () => {
    showToast(s.modules.subscription.portalRedirect, "info");
    try {
      const res = await fetchAuthed("/api/stripe/portal-session", {
        method: "POST",
        body: JSON.stringify({ returnUrl: window.location.href })
      });
      // Validazione Zod della risposta del portale (riusa lo schema Stripe condiviso)
      const parsed = portalSessionResponseSchema.safeParse(await res.json());
      if (!parsed.success) {
        console.error("[SubscriptionModule] Risposta portale non conforme allo schema:", parsed.error);
        showToast(sRef.current.modules.subscription.errPortalOpen, "error");
        return;
      }
      const data = parsed.data;
      if (data.success && data.url) {
        window.location.assign(data.url);
      } else {
        showToast(s.modules.subscription.errPortalOpen, "error");
      }
    } catch (err) {
      console.error(err);
      showToast(s.modules.subscription.errStripeServer, "error");
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
              <strong className="text-sm font-extrabold uppercase tracking-wider block mb-1">{s.modules.subscription.pastDueTitle}</strong>
              <p className="text-xs opacity-90">
                {s.modules.subscription.pastDueBodyPrefix} <strong>{activeOrgName}</strong> {s.modules.subscription.pastDueBodySuffix}
              </p>
            </div>
            <button onClick={openStripePortal} className="sm:ms-auto px-4 py-2 bg-danger text-white font-extrabold uppercase text-xs rounded-xl shadow-md active:scale-95 transition-all cursor-pointer">
              {s.modules.subscription.payNow}
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">{s.modules.subscription.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {s.modules.subscription.description}
            </p>
          </div>
          <button onClick={openStripePortal} className="inline-flex items-center gap-2 px-4 py-2 bg-default-100 hover:bg-default-200 border border-divider text-foreground font-bold text-sm rounded-xl active:scale-95 transition-all cursor-pointer">
            {s.modules.subscription.manageOnStripe}
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {subscriptions.length === 0 ? (
            <div className="col-span-full border border-divider border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3 bg-content1/50">
              <CreditCard className="w-12 h-12 text-slate-300 dark:text-slate-700" />
              <h3 className="font-bold text-lg">{s.modules.subscription.emptyTitle}</h3>
              <p className="text-xs text-muted-foreground">{fmtUI(s.modules.subscription.emptyBody, { brand: brand.name })}</p>
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
                      {s.modules.subscription.seatsLabel} <strong>{assigned.length} / {maxSeats}</strong>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">{s.modules.subscription.seatAssignmentTitle}</h4>
                    {loadingMembers ? (
                      <div className="w-8 h-8 rounded-full border-2 border-divider border-t-secondary animate-spin mx-auto my-4" />
                    ) : (
                      <div className="flex flex-col gap-2">
                        {members.map(member => {
                          if (!member.user) return null;
                          const isAssigned = assigned.includes(member.user.uid);
                          const isUpdating = updatingSeats === `${sub.service.serviceId}_${member.user.uid}`;

                          return (
                            <div key={member.user.uid} className="flex items-center justify-between gap-4 p-3 bg-default-50/50 rounded-xl border border-divider/40">
                              <div className="flex flex-col text-start">
                                <span className="text-xs font-bold text-foreground">{member.user.fullName || member.user.email}</span>
                                <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">{member.role}</span>
                              </div>
                              <button
                                onClick={() => toggleSeat(sub.service.serviceId, member.user!.uid, maxSeats)}
                                disabled={isUpdating}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-95 ${isAssigned ? "bg-secondary/10 text-secondary dark:text-secondary border border-secondary/20" : "bg-default-100 border border-divider hover:bg-default-200 text-foreground"}`}
                              >
                                {isUpdating ? (
                                  s.modules.subscription.updating
                                ) : isAssigned ? (
                                  <>
                                    <UserCheck className="w-3.5 h-3.5" />
                                    {s.modules.subscription.assigned}
                                  </>
                                ) : (
                                  s.modules.subscription.assign
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
