"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDashboard } from "../layout";
import { Globe, Search, Filter, ShieldCheck, Cpu, Cloud, ArrowRight } from "lucide-react";
import { Button, Chip } from "@heroui/react";
import { useI18n, useCurrentLocale } from "@/locales/client";
import { fetchAuthed } from "@/lib/firebase/client";

interface ApplicationItem {
  appId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  serviceId: string | null;
  purchasable: boolean;
  priceText: string | null;
  priceModel: string | null;
  subscriptionStatus: string;
  subscriptionTier: string | null;
}

export default function ApplicationPage() {
  const { dbData, showToast } = useDashboard();
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useI18n();
  const localeParam = useCurrentLocale();

  const [services, setServices] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activatingService, setActivatingService] = useState<string | null>(null);
  const [seatsMap, setSeatsMap] = useState<Record<string, number>>({});

  const hasSessionId = searchParams.get("session_id");
  const isSuccess = searchParams.get("checkout") === "success" || searchParams.get("checkout_success") === "true" || searchParams.get("checkout") === "cancel";
  const shouldRedirect = !!(hasSessionId || isSuccess);

  const activeOrgRelation = dbData?.userOrganizations_on_user?.[0];
  const activeOrg = activeOrgRelation?.organization;
  const activeRole = activeOrgRelation?.role;
  const organizationId = activeOrg?.orgId;
  const organizationType = activeOrg?.type;

  // Reindirizzamento immediato per sessioni legacy di checkout verso /subscription
  useEffect(() => {
    if (shouldRedirect) {
      router.replace(`/service/subscription?${searchParams.toString()}`);
    }
  }, [shouldRedirect, searchParams, router]);

  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAuthed("/api/application/list");
      if (res.status === 200) {
        const text = await res.text();
        const data = text ? JSON.parse(text) as { success: boolean; items?: ApplicationItem[] } : null;
        if (data?.success) {
          setServices(data.items || []);
        } else {
          showToast(t("application.load_error"), "error");
        }
      } else {
        showToast(t("application.load_error"), "error");
      }
    } catch (err) {
      console.error("[ApplicationPage] Load Error:", err);
      showToast(t("application.connection_error"), "error");
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  }, [showToast, t]);

  useEffect(() => {
    if (organizationId && !shouldRedirect) {
      const timer = setTimeout(() => {
        void loadServices();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [organizationId, shouldRedirect, loadServices]);

  const handleSeatsChange = (appId: string, val: number) => {
    setSeatsMap(prev => ({
      ...prev,
      [appId]: Math.max(1, Math.min(100, val))
    }));
  };

  const getSeats = (appId: string) => {
    if (organizationType === "personal") {
      return 1;
    }
    return seatsMap[appId] || 1;
  };

  const renderTotalPrice = (priceText: string | null, seats: number) => {
    if (!priceText || seats <= 1) return null;
    const match = priceText.match(/(\d+)/);
    if (!match) return null;
    const unitPrice = parseInt(match[1]);
    const currencySymbol = priceText.replace(/[\d\s/a-zA-Z]/g, "") || "€";
    const period = priceText.includes("mese") ? "mese" : priceText.includes("anno") ? "anno" : "periodo";
    const total = unitPrice * seats;
    return `${t("application.total_price_text") || "Totale stimato:"} ${currencySymbol}${total} / ${period}`;
  };

  const handleActivateService = async (serviceId: string, seats: number) => {
    if (activeRole !== "owner" && activeRole !== "admin") {
      showToast(t("application.only_owner_admin"), "error");
      return;
    }

    setActivatingService(serviceId);
    try {
      showToast(t("application.checkout_redirect"), "info");
      const res = await fetchAuthed("/api/stripe/subscription", {
        method: "POST",
        body: JSON.stringify({
          serviceId,
          seats
        })
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) as { success: boolean; url?: string; error?: { message?: string } } : null;
      if (data?.success && data.url) {
        window.location.assign(data.url);
      } else {
        const errorMsg = data?.error?.message || t("application.payment_init_error");
        showToast(errorMsg, "error");
        setActivatingService(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      showToast(`${t("application.activation_error")}: ${message}`, "error");
      setActivatingService(null);
    }
  };

  const handleResolvePayment = async () => {
    if (activeRole !== "owner" && activeRole !== "admin") {
      showToast(t("application.only_owner_admin"), "error");
      return;
    }

    setActivatingService("stripe_portal");
    try {
      showToast(t("application.portal_redirect"), "info");
      const res = await fetchAuthed("/api/stripe/subscription/portal", {
        method: "POST",
        body: JSON.stringify({
          returnUrl: window.location.href
        })
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) as { success: boolean; url?: string; error?: { message?: string } } : null;
      if (data?.success && data.url) {
        window.location.assign(data.url);
      } else {
        const errorMsg = data?.error?.message || t("application.portal_init_error");
        showToast(errorMsg, "error");
        setActivatingService(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      showToast(`${t("application.portal_error")}: ${message}`, "error");
      setActivatingService(null);
    }
  };

  const getServiceIcon = (appId: string) => {
    switch (appId) {
      case "safety":
        return ShieldCheck;
      case "standlo":
        return Cpu;
      default:
        return Cloud;
    }
  };

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-sm text-slate-500 dark:text-gray-400">
            Nessuna organizzazione selezionata o in corso di caricamento...
          </p>
        </div>
      </div>
    );
  }

  if (shouldRedirect) {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white">
        <span className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></span>
        <h3 className="text-lg font-bold">Reindirizzamento in corso...</h3>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in font-sans">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-4 w-72 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>

        {/* Navigation Card Skeleton */}
        <div className="h-24 w-full bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />

        {/* Filters Skeleton */}
        <div className="flex gap-3">
          <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
              </div>
              <div className="border-t border-slate-200 dark:border-white/10 pt-4 flex justify-between">
                <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight uppercase text-slate-900 dark:text-white">{t("application.title")}</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400">{t("application.description")}</p>
        </div>
      </div>

      {/* Box Navigazione Premium */}
      <div className="border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t("application.nav_card_title")}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t("application.nav_card_desc")}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto shrink-0">
          <Button
            onClick={() => router.push(`/${localeParam}/service/subscription`)}
            className="flex-1 md:flex-initial bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white font-bold text-xs py-2.5 rounded-xl transition-all duration-300"
          >
            {t("application.btn_subscriptions")}
          </Button>
          <Button
            onClick={() => router.push(`/${localeParam}/service/checkout`)}
            className="flex-1 md:flex-initial bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white font-bold text-xs py-2.5 rounded-xl transition-all duration-300"
          >
            {t("application.btn_orders")}
          </Button>
        </div>
      </div>

      {/* Barra di ricerca e filtri */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("good.search_placeholder")}
            className="w-full pl-10 pr-4 py-2.5 bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-white"
          />
        </div>
        <Button variant="ghost" className="border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-bold text-xs py-2.5 rounded-xl">
          <Filter className="w-4 h-4 inline mr-1" /> {t("good.filter_btn")}
        </Button>
      </div>

      {/* Grid delle applicazioni */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-200 dark:border-white/10 rounded-3xl">
          <Globe className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 dark:text-slate-400">{t("application.load_error")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredServices.map((app) => {
            const isSubscribed = app.subscriptionStatus === "active" || app.subscriptionStatus === "trialing";
            const isPastDue = app.subscriptionStatus === "past_due";
            const activeTier = app.subscriptionTier;
            const isActive = !app.purchasable || isSubscribed || isPastDue;
            const IconComponent = getServiceIcon(app.appId);

            return (
              <div
                key={app.appId}
                className="border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex gap-1.5 items-center">
                      {isPastDue ? (
                        <Chip variant="soft" className="bg-red-500/10 text-red-600 dark:text-red-400 font-black uppercase text-[9px]">
                          {t("application.past_due")}
                        </Chip>
                      ) : isActive ? (
                        <Chip variant="soft" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black uppercase text-[9px]">
                          {t("application.active")}
                        </Chip>
                      ) : null}
                      {isActive && activeTier && (
                        <Chip variant="soft" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 font-black uppercase text-[9px]">
                          {activeTier}
                        </Chip>
                      )}
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{app.name}</h3>
                  <p className="text-xs font-semibold text-slate-400 mb-4">{app.description || t("application.no_description")}</p>
                </div>

                <div className="border-t border-slate-200 dark:border-white/10 pt-4 space-y-4">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-slate-400">Prezzo:</span>
                    <span className="text-slate-700 dark:text-slate-300 font-bold">{app.priceText || t("application.price_included")}</span>
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    {isPastDue ? (
                      <Button
                        onClick={() => handleResolvePayment()}
                        isDisabled={activatingService !== null}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold text-xs py-2.5 rounded-xl transition-all duration-300"
                      >
                        {activatingService === "stripe_portal" ? t("application.loading") : t("application.resolve_payment")}
                      </Button>
                    ) : isActive ? (
                      <Button isDisabled className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500 font-bold text-xs py-2.5 rounded-xl cursor-not-allowed">
                        {t("application.already_enabled")}
                      </Button>
                    ) : app.purchasable ? (
                      <div className="space-y-3 w-full">
                        {organizationType === "personal" ? (
                          <p className="text-[10px] text-slate-500 dark:text-gray-400 italic">
                            {t("application.personal_limit")}
                          </p>
                        ) : (
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                              {t("application.seats_label") || "Licenze:"}
                            </span>
                            <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white/50 dark:bg-slate-900/50">
                              <button
                                type="button"
                                onClick={() => handleSeatsChange(app.appId, getSeats(app.appId) - 1)}
                                className="px-2 py-0.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-extrabold text-xs"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min={1}
                                max={100}
                                value={getSeats(app.appId)}
                                onChange={(e) => handleSeatsChange(app.appId, parseInt(e.target.value) || 1)}
                                className="w-8 text-center bg-transparent text-[11px] font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-slate-800 dark:text-white"
                              />
                              <button
                                type="button"
                                onClick={() => handleSeatsChange(app.appId, getSeats(app.appId) + 1)}
                                className="px-2 py-0.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-extrabold text-xs"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )}

                        {renderTotalPrice(app.priceText, getSeats(app.appId)) && (
                          <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400 text-right">
                            {renderTotalPrice(app.priceText, getSeats(app.appId))}
                          </div>
                        )}

                        <Button
                          onClick={() => handleActivateService(app.serviceId!, getSeats(app.appId))}
                          isDisabled={activatingService !== null || !app.serviceId}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition-all duration-300"
                        >
                          {activatingService === app.serviceId ? t("application.activating") : (
                            <span className="flex items-center justify-center gap-1">
                              {t("application.activate")}
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <Button isDisabled className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500 font-bold text-xs py-2.5 rounded-xl cursor-not-allowed">
                        {t("application.base_plan")}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
