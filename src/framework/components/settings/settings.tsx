"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useDashboard } from "../layouts/DashboardContext";
import { fetchAuthedClient } from "../../lib/api";
import { Card, CardBody, Tabs, Tab, TabList, Button, Input, Label } from "../ui";
import { Form } from "../layouts/Form";
import {
  User as UserIcon,
  Camera,
  Upload,
  Trash2,
  Lock,
  Key,
  Shield,
  Trash,
  Check,
  AlertTriangle,
  Eye,
  EyeOff,
  Copy
} from "lucide-react";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  multiFactor,
  getMultiFactorResolver,
  TotpMultiFactorGenerator,
  type MultiFactorInfo,
  type MultiFactorResolver,
  type TotpSecret
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage, forceCleanSession } from "../../lib/auth";

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
  const { user, dbData, showToast, claims, refreshClaims } = useDashboard();
  const [activeTab, setActiveTab] = useState("user");

  // Stato per l'avatar
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [prevAvatarUrl, setPrevAvatarUrl] = useState<string | null>(null);

  const currentAvatarUrl = dbData?.user?.avatarUrl || user?.photoURL || null;
  if (currentAvatarUrl !== prevAvatarUrl) {
    setPrevAvatarUrl(currentAvatarUrl);
    setAvatarPreview(currentAvatarUrl);
  }

  // Stati per il modulo Cambio Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordPending, setPasswordPending] = useState(false);

  // Stati per la 2FA (MFA) — enrollment nativo Firebase via app di autenticazione (fattore TOTP).
  // L'SMS è stato rimosso: reCAPTCHA Enterprise (App Check) e il phone auth di Firebase non
  // coesistono sul web (conflitto SDK), e il TOTP è comunque il metodo 2FA raccomandato
  // (NIST scoraggia l'SMS per SIM-swap/SS7).
  const [mfaStep, setMfaStep] = useState<"idle" | "totp-verify">("idle");
  const [mfaPending, setMfaPending] = useState(false);
  const [totpSecret, setTotpSecret] = useState<TotpSecret | null>(null);
  const [totpUri, setTotpUri] = useState("");
  const [totpCode, setTotpCode] = useState("");

  // Stati per la gestione sessioni/dispositivi (3.2)
  interface DeviceSession {
    id: string;
    createdAt: string;
    lastSeenAt: string;
    userAgent: string;
    ip: string;
    current: boolean;
  }
  const [deviceSessions, setDeviceSessions] = useState<DeviceSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionRevokePending, setSessionRevokePending] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stati per il Dialog di Riautenticazione Generale
  const [reauthOpen, setReauthOpen] = useState(false);
  const [reauthPassword, setReauthPassword] = useState("");
  const [reauthPending, setReauthPending] = useState(false);
  const [onReauthSuccess, setOnReauthSuccess] = useState<(() => Promise<void>) | null>(null);
  // Se la reauth richiede il secondo fattore (utente con MFA TOTP attiva), si risolve col
  // codice dell'app di autenticazione prima di completare la riautenticazione.
  const [reauthMfaResolver, setReauthMfaResolver] = useState<MultiFactorResolver | null>(null);
  const [reauthMfaCode, setReauthMfaCode] = useState("");
  const [reauthMfaHint, setReauthMfaHint] = useState("");
  const [reauthMfaTotpUid, setReauthMfaTotpUid] = useState("");

  // Stati per l'Eliminazione GDPR
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletePending, setDeletePending] = useState(false);

  const [uploading, setUploading] = useState(false);
  // Fattori MFA registrati (app di autenticazione TOTP), letti dallo stato Firebase del client e
  // ricalcolati ad ogni render: dopo enroll/unenroll il setState locale (mfaPending) forza il refresh.
  const enrolledFactors: MultiFactorInfo[] = user ? multiFactor(user).enrolledFactors : [];
  const is2faActive = enrolledFactors.length > 0;
  // Firebase consente al più UN fattore TOTP per utente: il pulsante di enrollment si nasconde se già presente
  const hasTotpFactor = enrolledFactors.some((f) => f.factorId === TotpMultiFactorGenerator.FACTOR_ID);

  // Ruolo dell'utente loggato nell'organizzazione (uRole / role fallback)
  const activeRole = claims?.uRole || claims?.role;
  const isOrgManager = activeRole === "owner" || activeRole === "admin";
  const currentTab = isOrgManager ? activeTab : "user";

  const displayName = dbData?.user?.fullName || user?.displayName || user?.email?.split("@")[0] || "Utente";
  const roleName = activeRole ? String(activeRole).toUpperCase() : "VIEWER";

  // Inizializzazione Dati Form
  const currentUserData = dbData?.user;
  const userInitialData = useMemo(() => {
    if (!currentUserData) return {};
    return {
      fullName: currentUserData.fullName || "",
      email: currentUserData.email || user?.email || "",
      mobile: currentUserData.mobile || "",
      locale: currentUserData.locale || "en",
      theme: currentUserData.theme || "dark",
      avatarUrl: currentUserData.avatarUrl || ""
    };
  }, [currentUserData, user?.email]);

  const activeOrgRelation = dbData?.userOrganizations_on_user?.[0];
  const activeOrg = activeOrgRelation?.organization as unknown as OrganizationData | undefined;
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

  // Funzione per validare la forza della password
  const passwordStrength = useMemo(() => {
    if (!newPassword) return null;
    if (newPassword.length < 6) return { text: "Corta (Min 6)", color: "text-danger bg-danger/10 border-danger/20", width: "w-1/4" };
    
    let score = 0;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;
    
    if (score === 0) return { text: "Debole", color: "text-orange-500 bg-orange-500/10 border-orange-500/20", width: "w-2/4" };
    if (score === 1 || score === 2) return { text: "Media", color: "text-amber-500 bg-amber-500/10 border-amber-500/20", width: "w-3/4" };
    return { text: "Forte", color: "text-success bg-success/10 border-success/20", width: "w-full" };
  }, [newPassword]);

  // Challenge di Riautenticazione
  const closeReauth = () => {
    setReauthOpen(false);
    setReauthPassword("");
    setOnReauthSuccess(null);
    setReauthMfaResolver(null);
    setReauthMfaCode("");
    setReauthMfaHint("");
  };

  const executeWithReauthChallenge = (action: () => Promise<void>) => {
    setOnReauthSuccess(() => action);
    setReauthPassword("");
    setReauthMfaResolver(null);
    setReauthMfaCode("");
    setReauthMfaHint("");
    setReauthOpen(true);
  };

  const handleReauthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;

    try {
      setReauthPending(true);
      const credential = EmailAuthProvider.credential(user.email, reauthPassword);
      await reauthenticateWithCredential(user, credential);
      // Reauth completata senza secondo fattore.
      const pending = onReauthSuccess;
      closeReauth();
      showToast("Riautenticazione completata con successo.", "success");
      if (pending) await pending();
    } catch (err) {
      const authErr = err as { code?: string };
      // Utente con MFA (TOTP) attiva: la reauth richiede il secondo fattore → codice dell'app.
      if (authErr.code === "auth/multi-factor-auth-required") {
        try {
          const resolver = getMultiFactorResolver(auth, err as Parameters<typeof getMultiFactorResolver>[1]);
          const totpHint = resolver.hints.find((h) => h.factorId === TotpMultiFactorGenerator.FACTOR_ID);
          if (!totpHint) {
            throw new Error("Nessun secondo fattore TOTP risolvibile disponibile.");
          }
          setReauthMfaResolver(resolver);
          setReauthMfaTotpUid(totpHint.uid);
          setReauthMfaHint(totpHint.displayName || "la tua app di autenticazione");
          setReauthMfaCode("");
          showToast("Inserisci il codice della tua app di autenticazione per confermare l'identità.", "info");
        } catch (mfaErr) {
          console.error("[Reauth MFA] Errore avvio secondo fattore:", mfaErr);
          showToast("Impossibile avviare la verifica del secondo fattore.", "error");
        }
        return;
      }
      console.error("[Reauth] Errore:", err);
      showToast(
        authErr.code === "auth/wrong-password" || authErr.code === "auth/invalid-credential"
          ? "Password attuale errata o non valida."
          : "Riautenticazione non riuscita. Riprova.",
        "error"
      );
    } finally {
      setReauthPending(false);
    }
  };

  // Secondo step della reauth: verifica il codice TOTP del fattore esistente e completa la reauth.
  const handleReauthMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reauthMfaResolver || !reauthMfaCode) return;
    try {
      setReauthPending(true);
      const assertion = TotpMultiFactorGenerator.assertionForSignIn(reauthMfaTotpUid, reauthMfaCode);
      await reauthMfaResolver.resolveSignIn(assertion);
      const pending = onReauthSuccess;
      closeReauth();
      showToast("Identità confermata con successo.", "success");
      if (pending) await pending();
    } catch (err) {
      console.error("[Reauth MFA] Errore verifica:", err);
      showToast("Codice di verifica non valido o scaduto.", "error");
    } finally {
      setReauthPending(false);
    }
  };

  // Submit Dati Utente Semplici
  const handleUserSubmit = async (data: Record<string, unknown>, idempotencyKey: string) => {
    try {
      const userId = claims?.uId || user?.uid;
      if (!userId) throw new Error("Utente non identificato.");

      const resData = await fetchAuthedClient<Record<string, unknown>>(`/api/user/${userId}`, {
        method: "POST",
        headers: { "Idempotency-Key": idempotencyKey },
        body: JSON.stringify({ ...data, avatarUrl: avatarPreview || "" })
      });

      if (!resData.success) {
        throw new Error(resData.error?.message || "Errore durante l'aggiornamento del profilo.");
      }

      await refreshClaims();
      showToast("Profilo utente aggiornato con successo.", "success");
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Caricamento / Rimozione Avatar
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("L'immagine supera la dimensione massima consentita di 2MB.", "error");
      return;
    }

    try {
      setUploading(true);
      const userId = claims?.uId || user?.uid;
      if (!userId) throw new Error("Utente non identificato.");

      const organizationId = claims?.orgId || dbData?.user?.organizationId || "default";
      const storageRef = ref(storage, `organizations/${organizationId}/users/${userId}/avatar_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      const { updateProfile } = await import("firebase/auth");
      if (user) {
        await updateProfile(user, { photoURL: downloadUrl });
      }

      await fetchAuthedClient<Record<string, unknown>>(`/api/user/${userId}`, {
        method: "POST",
        body: JSON.stringify({
          fullName: dbData?.user?.fullName || "",
          mobile: dbData?.user?.mobile || "",
          locale: dbData?.user?.locale || "en",
          theme: dbData?.user?.theme || "dark",
          avatarUrl: downloadUrl
        })
      });

      setAvatarPreview(downloadUrl);
      await refreshClaims();
      showToast("Avatar del profilo caricato ed allineato con successo.", "success");
    } catch (err) {
      console.error(err);
      showToast("Impossibile caricare l'immagine dell'avatar.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarRemove = async () => {
    try {
      setUploading(true);
      const userId = claims?.uId || user?.uid;
      if (!userId) throw new Error("Utente non identificato.");

      const { updateProfile } = await import("firebase/auth");
      if (user) {
        await updateProfile(user, { photoURL: "" });
      }

      await fetchAuthedClient<Record<string, unknown>>(`/api/user/${userId}`, {
        method: "POST",
        body: JSON.stringify({
          fullName: dbData?.user?.fullName || "",
          mobile: dbData?.user?.mobile || "",
          locale: dbData?.user?.locale || "en",
          theme: dbData?.user?.theme || "dark",
          avatarUrl: ""
        })
      });

      setAvatarPreview(null);
      await refreshClaims();
      showToast("Avatar rimosso correttamente.", "success");
    } catch (err) {
      console.error(err);
      showToast("Impossibile rimuovere l'avatar.", "error");
    } finally {
      setUploading(false);
    }
  };

  // Cambio Password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword !== confirmPassword) {
      showToast("Le nuove password inserite non corrispondono.", "error");
      return;
    }

    const action = async () => {
      try {
        setPasswordPending(true);
        await updatePassword(user, newPassword);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        showToast("Password aggiornata con successo.", "success");
      } catch (err) {
        const authErr = err as { code?: string };
        if (authErr.code === "auth/requires-recent-login") {
          executeWithReauthChallenge(action);
        } else {
          console.error(err);
          showToast("Errore durante il cambio password. Riprova.", "error");
        }
      } finally {
        setPasswordPending(false);
      }
    };

    // Tenta il cambio (reautenticando prima se possibile)
    try {
      setPasswordPending(true);
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("Password aggiornata con successo.", "success");
    } catch (err) {
      const authErr = err as { code?: string };
      if (authErr.code === "auth/requires-recent-login" || authErr.code === "auth/wrong-password" || authErr.code === "auth/invalid-credential") {
        showToast("Credenziali non corrette per procedere al cambio password.", "error");
      } else {
        await action();
      }
    } finally {
      setPasswordPending(false);
    }
  };

  const resetMfaFlow = () => {
    setMfaStep("idle");
    setTotpSecret(null);
    setTotpUri("");
    setTotpCode("");
  };

  // Gestione centralizzata degli errori MFA. Due casi richiedono una riautenticazione con la
  // password prima di gestire i fattori, dopodiché l'azione viene ritentata:
  //  - auth/requires-recent-login: Firebase esige un login recente per modificare i fattori;
  //  - auth/unsupported-first-factor: la sessione client è stata stabilita via custom token
  //    (bootstrap SSO), il cui first-factor "custom" non consente l'enrollment MFA. La reauth
  //    con EmailAuthProvider porta il first-factor a email/password e sblocca l'operazione.
  const handleMfaError = (err: unknown, retriableAction: () => Promise<void>) => {
    const authErr = err as { code?: string; message?: string };
    if (
      authErr.code === "auth/requires-recent-login" ||
      authErr.code === "auth/unsupported-first-factor"
    ) {
      showToast("Per sicurezza, conferma la password per gestire la 2FA.", "info");
      executeWithReauthChallenge(retriableAction);
      return;
    }
    console.error("[MFA]", err);
    const msg =
      authErr.code === "auth/invalid-verification-code"
        ? "Codice di verifica non valido."
        : authErr.code === "auth/code-expired"
          ? "Codice scaduto. Richiedine uno nuovo."
          : authErr.code === "auth/maximum-second-factor-count-exceeded"
            ? "Hai raggiunto il numero massimo di fattori registrati."
            : authErr.code === "auth/operation-not-allowed"
              ? "Questo metodo di verifica non è abilitato sul progetto. Contatta l'amministratore."
              : err instanceof Error
                ? err.message
                : "Errore durante l'operazione di autenticazione a due fattori.";
    showToast(msg, "error");
  };

  // === 2FA VIA APP DI AUTENTICAZIONE (fattore TOTP, nativo Firebase — 0.7) ===
  // Il provider TOTP è abilitato a livello progetto via scripts/enable-totp-mfa.ts (Admin SDK;
  // la console non espone il toggle). Enrollment: generateSecret → l'utente registra la chiave
  // nella sua app (link otpauth o chiave manuale) → verifica del primo codice → enroll.
  const startTotpEnrollment = async () => {
    if (!user) return;
    const action = async () => {
      setMfaPending(true);
      try {
        const session = await multiFactor(user).getSession();
        const secret = await TotpMultiFactorGenerator.generateSecret(session);
        setTotpSecret(secret);
        setTotpUri(secret.generateQrCodeUrl(user.email || "account KALEX", "KALEX"));
        setTotpCode("");
        setMfaStep("totp-verify");
      } catch (err) {
        handleMfaError(err, action);
      } finally {
        setMfaPending(false);
      }
    };
    await action();
  };

  const confirmTotpEnrollment = async () => {
    if (!user || !totpSecret || totpCode.length < 6) return;
    const action = async () => {
      setMfaPending(true);
      try {
        const assertion = TotpMultiFactorGenerator.assertionForEnrollment(totpSecret, totpCode);
        await multiFactor(user).enroll(assertion, "App di autenticazione");
        await user.reload();
        resetMfaFlow();
        showToast("App di autenticazione registrata: 2FA via codice TOTP attiva.", "success");
        await refreshClaims();
      } catch (err) {
        handleMfaError(err, action);
      } finally {
        setMfaPending(false);
      }
    };
    await action();
  };

  const copyTotpSecret = async () => {
    if (!totpSecret) return;
    try {
      await navigator.clipboard.writeText(totpSecret.secretKey);
      showToast("Chiave segreta copiata negli appunti.", "success");
    } catch {
      showToast("Impossibile copiare: seleziona e copia la chiave manualmente.", "error");
    }
  };

  // === SESSIONI / DISPOSITIVI ATTIVI (3.2) ===
  const loadDeviceSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const res = await fetchAuthedClient<{ success: boolean; sessions: DeviceSession[] }>("/api/auth/sessions", { method: "GET" });
      if (res.success && res.data && Array.isArray(res.data.sessions)) {
        setDeviceSessions(res.data.sessions);
      }
    } catch (err) {
      console.warn("[Settings] Impossibile caricare le sessioni attive:", err);
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Deferred per evitare setState sincrono nell'effect (cascading renders)
    void Promise.resolve().then(() => loadDeviceSessions());
  }, [loadDeviceSessions]);

  const revokeDeviceSession = async (session: DeviceSession) => {
    setSessionRevokePending(session.id);
    try {
      const res = await fetchAuthedClient<Record<string, unknown>>(`/api/auth/sessions/${session.id}`, { method: "DELETE" });
      if (!res.success) {
        throw new Error(res.error?.message || "Impossibile disconnettere il dispositivo.");
      }
      if (session.current) {
        // Disconnessa la sessione di QUESTO device: si completa con un logout pulito
        await forceCleanSession();
        window.location.assign("/auth");
        return;
      }
      showToast("Dispositivo disconnesso.", "success");
      await loadDeviceSessions();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Impossibile disconnettere il dispositivo.", "error");
    } finally {
      setSessionRevokePending("");
    }
  };

  // Etichetta leggibile del device a partire dallo user agent (best-effort, solo display)
  const describeDevice = (userAgent: string): string => {
    const ua = userAgent.toLowerCase();
    const os = ua.includes("android") ? "Android"
      : (ua.includes("iphone") || ua.includes("ipad")) ? "iOS"
        : ua.includes("mac os") ? "macOS"
          : ua.includes("windows") ? "Windows"
            : ua.includes("linux") ? "Linux" : "Dispositivo";
    const browser = ua.includes("edg/") ? "Edge"
      : ua.includes("chrome/") ? "Chrome"
        : ua.includes("safari/") && !ua.includes("chrome/") ? "Safari"
          : ua.includes("firefox/") ? "Firefox" : "Browser";
    return `${browser} · ${os}`;
  };

  // === DISATTIVAZIONE DI UN FATTORE (con re-auth imposta da Firebase) ===
  const unenrollFactor = async (factor: MultiFactorInfo) => {
    if (!user) return;
    const action = async () => {
      setMfaPending(true);
      try {
        await multiFactor(user).unenroll(factor);
        await user.reload();
        showToast("Fattore di autenticazione disattivato.", "success");
        await refreshClaims();
      } catch (err) {
        handleMfaError(err, action);
      } finally {
        setMfaPending(false);
      }
    };
    await action();
  };

  // Eliminazione GDPR Account
  const handlePurgeAccount = async () => {
    if (deleteConfirmText !== "ELIMINA") {
      showToast("Digita 'ELIMINA' per confermare.", "error");
      return;
    }

    const action = async () => {
      try {
        setDeletePending(true);
        const userId = claims?.uId || user?.uid;
        if (!userId) throw new Error("Utente non identificato.");

        // 1. Chiama l'endpoint del backend per eliminare i dati da PostgreSQL, team e Firestore
        const resData = await fetchAuthedClient<Record<string, unknown>>(`/api/user/${userId}`, {
          method: "DELETE"
        });

        if (!resData.success) {
          throw new Error(resData.error?.message || "Errore nel backend durante l'autocancellazione.");
        }

        // 2. Rimuove l'utente client-side da Firebase Auth
        if (user) {
          await user.delete();
        }

        showToast("Account e dati eliminati con successo.", "success");
        setDeleteOpen(false);
        
        // 3. Pulisce la sessione locale e cookie
        await forceCleanSession();
        window.location.href = "/auth";
      } catch (err) {
        const authErr = err as { code?: string };
        if (authErr.code === "auth/requires-recent-login") {
          executeWithReauthChallenge(action);
        } else {
          console.error(err);
          showToast(err instanceof Error ? err.message : "Errore durante l'eliminazione dell'account.", "error");
        }
      } finally {
        setDeletePending(false);
      }
    };

    await action();
  };

  // Gestione Submit Organizzazione
  const handleOrgSubmit = async (data: Record<string, unknown>, idempotencyKey: string) => {
    if (!activeOrg) return;

    try {
      const resData = await fetchAuthedClient<Record<string, unknown>>(`/api/organization/${activeOrg.orgId}`, {
        method: "POST",
        headers: { "Idempotency-Key": idempotencyKey },
        body: JSON.stringify({
          ...data,
          metadata: activeOrg.metadata || null
        })
      });

      if (!resData.success) {
        throw new Error(resData.error?.message || "Errore durante l'aggiornamento dell'organizzazione.");
      }

      showToast("Impostazioni dell'organizzazione salvate con successo. Ricalcolo claims in corso...", "success");
      
      if (user) {
        await user.getIdTokenResult(true);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  
  // Stati per la gestione della chiave API personale dell'utente
  const [apiKeyData, setApiKeyData] = useState<{
    hasKey: boolean;
    keyHash?: string;
    name?: string;
    isActive?: boolean;
    createdAt?: string;
  } | null>(null);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [loadingApiKey, setLoadingApiKey] = useState(false);

  const fetchUserApiKey = useCallback(async () => {
    const userId = claims?.uId || user?.uid;
    if (!userId) return;
    try {
      setLoadingApiKey(true);
      const res = await fetchAuthedClient<{
        success: boolean;
        hasKey: boolean;
        keyHash?: string;
        name?: string;
        isActive?: boolean;
        createdAt?: string;
      }>(`/api/user/${userId}/apikey`);
      if (res.success && res.data) {
        setApiKeyData({
          hasKey: res.data.hasKey,
          keyHash: res.data.keyHash,
          name: res.data.name,
          isActive: res.data.isActive,
          createdAt: res.data.createdAt
        });
      }
    } catch (err) {
      console.warn("Impossibile caricare la chiave API personale:", err);
    } finally {
      setLoadingApiKey(false);
    }
  }, [claims?.uId, user?.uid]);

  const handleGenerateApiKey = async () => {
    const userId = claims?.uId || user?.uid;
    if (!userId) return;
    try {
      setLoadingApiKey(true);
      setGeneratedKey(null);
      const res = await fetchAuthedClient<{
        success: boolean;
        apiKey: string;
        keyHash: string;
        message: string;
      }>(`/api/user/${userId}/apikey`, {
        method: "POST"
      });
      if (res.success && res.data) {
        setGeneratedKey(res.data.apiKey);
        showToast("Chiave API personale generata con successo.", "success");
        await fetchUserApiKey();
      } else {
        showToast("Errore durante la generazione della chiave API.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Impossibile generare la chiave API.", "error");
    } finally {
      setLoadingApiKey(false);
    }
  };

  useEffect(() => {
    if (user) {
      Promise.resolve().then(() => {
        fetchUserApiKey();
      });
    }
  }, [user, fetchUserApiKey]);

  return (
    <div className="klx-settings-container">
      <div>
        <h1 className="klx-settings-header-title">
          <UserIcon className="w-5 h-5 text-violet-500" /> Impostazioni Account & Azienda
        </h1>
        <p className="klx-settings-header-desc">
          Gestisci le preferenze di profilo, la sicurezza e la conformità legale dell&apos;account.
        </p>
      </div>

      {isOrgManager ? (
        <Tabs
          selectedKey={currentTab}
          onSelectionChange={(key) => setActiveTab(key as string)}
          aria-label="Impostazioni"
          className="w-full"
        >
          <TabList className="klx-settings-tabs-list">
            <Tab
              id="user"
              className="klx-settings-tab-trigger"
            >
              Profilo & Sicurezza
            </Tab>
            <Tab
              id="organization"
              className="klx-settings-tab-trigger"
            >
              Dati Organizzazione
            </Tab>
          </TabList>
        </Tabs>
      ) : null}

      {/* ========================================== */}
      {/* TAB 1: PROFILO & SICUREZZA                 */}
      {/* ========================================== */}
      {currentTab === "user" && (
        <div className="space-y-8">
          <div className="klx-settings-grid">
            {/* Form Profilo Base */}
            <Card className="lg:col-span-2 klx-settings-card">
              <CardBody>
                <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-violet-500" />
                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
                      Informazioni Personali
                    </h2>
                  </div>
                </div>
                <Form
                  moduleId="user"
                  initialData={userInitialData}
                  fieldsOrder={["fullName", "email", "mobile", "locale", "theme"]}
                  disabledFields={is2faActive ? ["email", "mobile"] : ["email"]}
                  onSubmit={handleUserSubmit}
                  submitLabel="Salva Profilo"
                />
              </CardBody>
            </Card>

            {/* Scheda Profilo e Upload Avatar */}
            <Card className="lg:col-span-1 klx-settings-card flex flex-col h-full justify-between items-center">
              <CardBody className="flex flex-col items-center justify-between h-full w-full py-2">
                <div className="flex flex-col items-center w-full space-y-5">
                  <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-white/10 pb-4 w-full">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-violet-500" />
                      <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
                        Immagine del Profilo
                      </h2>
                    </div>
                  </div>

                  {/* Foto Profilo Circolare con Hover Upload */}
                  <div className="klx-settings-profile-avatar-wrapper">
                    {uploading ? (
                      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white gap-2">
                        <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-violet-500"></span>
                        <span className="text-[9px] font-bold uppercase tracking-widest">Caricamento</span>
                      </div>
                    ) : (
                      <>
                        {avatarPreview ? (
                          <Image src={avatarPreview} alt="Avatar" fill sizes="144px" unoptimized className="object-cover" />
                        ) : (
                          <span className="text-4xl font-black text-slate-400 dark:text-slate-600 select-none">
                            {displayName.substring(0, 2).toUpperCase()}
                          </span>
                        )}

                        <label className="klx-settings-avatar-hover-overlay gap-1 select-none">
                          <Camera className="w-5 h-5 text-violet-400" />
                          <span className="text-[8px] font-extrabold uppercase tracking-widest">Sfoglia</span>
                          <input type="file" accept="image/*" className="klx-settings-avatar-input" onChange={handleAvatarChange} />
                        </label>
                      </>
                    )}
                  </div>

                  {/* Dettagli Profilo */}
                  <div className="text-center space-y-1 w-full px-2">
                    <h4 className="klx-settings-profile-name truncate">
                      {displayName}
                    </h4>
                    <p className="klx-settings-profile-email truncate">
                      {user?.email || "Nessuna email associata"}
                    </p>
                    <div className="klx-settings-profile-badge">
                      <Shield className="w-3 h-3" /> {roleName}
                    </div>
                  </div>
                </div>

                {/* Pulsanti Interazione */}
                <div className="flex gap-2.5 w-full mt-8 justify-center">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    isDisabled={uploading}
                    variant="primary"
                    icon={<Upload className="w-3.5 h-3.5" />}
                  >
                    Carica
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="klx-settings-avatar-input"
                    onChange={handleAvatarChange}
                  />
                  {avatarPreview && (
                    <Button
                      onClick={handleAvatarRemove}
                      isDisabled={uploading}
                      variant="ghost"
                      icon={<Trash2 className="w-3.5 h-3.5" />}
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20 hover:border-red-500/30"
                    >
                      Rimuovi
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
          {/* Griglia responsive a due colonne per Password e 2FA */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SEC 2: CAMBIO PASSWORD */}
            <Card className="klx-settings-card--full">
              <CardBody>
                <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
                  <Key className="w-4 h-4 text-violet-500" />
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
                    Sicurezza Password e Credenziali
                  </h2>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="flex flex-col gap-1.5 w-full">
                    <Label className="text-xs font-bold text-slate-700 dark:text-gray-300">
                      Password Corrente
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Digita la password attuale"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-primary rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 w-full">
                    <Label className="text-xs font-bold text-slate-700 dark:text-gray-300">
                      Nuova Password
                    </Label>
                    <Input
                      type="password"
                      placeholder="Minimo 6 caratteri"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-primary rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full"
                    />
                    {passwordStrength && (
                      <div className="space-y-1.5 mt-1">
                        <div className="klx-settings-strength-meter-container">
                          <div className={`klx-settings-strength-meter-bar ${passwordStrength.width} ${
                            passwordStrength.text === "Forte" ? "bg-success" : passwordStrength.text === "Media" ? "bg-amber-500" : "bg-danger"
                          }`} />
                        </div>
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${passwordStrength.color}`}>
                          Robustezza: {passwordStrength.text}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 w-full">
                    <Label className="text-xs font-bold text-slate-700 dark:text-gray-300">
                      Conferma Nuova Password
                    </Label>
                    <Input
                      type="password"
                      placeholder="Ripeti la nuova password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-primary rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      isDisabled={passwordPending}
                      variant="primary"
                    >
                      {passwordPending ? "Salvataggio..." : "Aggiorna Password"}
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>

            {/* SEC 3: 2FA (app di autenticazione — TOTP) */}
            <Card className="klx-settings-card--full">
              <CardBody>
                <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-violet-500" />
                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
                      Autenticazione a Due Fattori (2FA)
                    </h2>
                  </div>
                  <div>
                    {is2faActive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider bg-success/15 border border-success/30 text-success rounded-full animate-pulse">
                        <Check className="w-3 h-3" /> Attiva
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-400 rounded-full">
                        Disattivata
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">
                    L&apos;autenticazione a due fattori (2FA) aggiunge un livello di sicurezza al tuo account: all&apos;accesso ti verrà chiesto un codice generato dalla tua <strong>app di autenticazione</strong> (Google Authenticator, 1Password, Authy…). Conserva la chiave segreta in un luogo sicuro: se perdi l&apos;accesso all&apos;app, potrai recuperare l&apos;account tramite un amministratore.
                  </p>

                  {/* Fattori attualmente registrati */}
                  {enrolledFactors.length > 0 && (
                    <div className="space-y-2">
                      {enrolledFactors.map((factor) => (
                        <div
                          key={factor.uid}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-950/40 px-3.5 py-2.5"
                        >
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-success" />
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-800 dark:text-white">
                                {factor.displayName || (factor.factorId === TotpMultiFactorGenerator.FACTOR_ID ? "App di autenticazione" : "Fattore 2FA")}
                              </span>
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                {factor.factorId === TotpMultiFactorGenerator.FACTOR_ID ? "Codice TOTP (app)" : "Fattore legacy"}
                              </span>
                            </div>
                          </div>
                          <Button
                            onClick={() => unenrollFactor(factor)}
                            isDisabled={mfaPending}
                            variant="danger-soft"
                          >
                            Rimuovi
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Avvio enrollment: app di autenticazione (TOTP) */}
                  {mfaStep === "idle" && !hasTotpFactor && (
                    <div className="pt-2">
                      <Button
                        onClick={startTotpEnrollment}
                        isDisabled={mfaPending}
                        variant="primary"
                      >
                        Attiva con app di autenticazione
                      </Button>
                    </div>
                  )}

                  {/* Enrollment app di autenticazione (TOTP): chiave manuale / link otpauth + verifica primo codice */}
                  {mfaStep === "totp-verify" && totpSecret && (
                    <div className="flex flex-col gap-3 pt-2">
                      <Label className="text-xs font-bold text-slate-700 dark:text-gray-300">
                        Registra la chiave nella tua app di autenticazione
                      </Label>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400 leading-relaxed">
                        Apri la tua app (Google Authenticator, 1Password, Authy…) e aggiungi un account
                        inserendo la <strong>chiave segreta</strong> qui sotto (oppure, da mobile, tocca il link diretto).
                        Poi inserisci il codice a 6 cifre generato dall&apos;app per confermare.
                      </p>
                      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-950/40 px-3.5 py-2.5">
                        <code className="text-xs font-mono tracking-wider text-slate-800 dark:text-white break-all flex-1">
                          {totpSecret.secretKey}
                        </code>
                        <button
                          type="button"
                          onClick={copyTotpSecret}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-white outline-none bg-transparent border-none cursor-pointer flex-shrink-0"
                          aria-label="Copia chiave segreta"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      {totpUri && (
                        <a
                          href={totpUri}
                          className="text-[10px] font-extrabold uppercase tracking-wider text-violet-500 hover:text-violet-400 self-start"
                        >
                          Apri direttamente nell&apos;app di autenticazione
                        </a>
                      )}
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          maxLength={6}
                          placeholder="6 cifre"
                          value={totpCode}
                          onChange={(e) => setTotpCode(e.target.value)}
                          className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-primary rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full text-center tracking-widest font-mono text-lg"
                        />
                        <Button
                          onClick={confirmTotpEnrollment}
                          isDisabled={mfaPending || totpCode.length < 6}
                          variant="primary"
                        >
                          Conferma Codice
                        </Button>
                      </div>
                      <button
                        type="button"
                        onClick={resetMfaFlow}
                        className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 hover:text-slate-500 outline-none bg-transparent border-none cursor-pointer self-start"
                      >
                        Annulla
                      </button>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* SEC 3B: SESSIONI / DISPOSITIVI ATTIVI (3.2) */}
          <Card className="klx-settings-card--full">
            <CardBody>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
                    Sessioni attive
                  </h3>
                </div>
                <Button onClick={() => void loadDeviceSessions()} isDisabled={sessionsLoading} variant="ghost">
                  Aggiorna
                </Button>
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed mb-4">
                I dispositivi con una sessione KALEX attiva. Se non riconosci un dispositivo, disconnettilo e cambia subito la password.
              </p>
              {sessionsLoading && deviceSessions.length === 0 ? (
                <p className="text-xs text-slate-400">Caricamento sessioni…</p>
              ) : deviceSessions.length === 0 ? (
                <p className="text-xs text-slate-400">Nessuna sessione registrata (le sessioni precedenti a questa funzione compariranno al prossimo accesso).</p>
              ) : (
                <div className="space-y-2">
                  {deviceSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-950/40 px-3.5 py-2.5"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          {describeDevice(session.userAgent)}
                          {session.current && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-success/15 border border-success/30 text-success rounded-full">
                              Questo dispositivo
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate">
                          IP {session.ip} · ultimo accesso {session.lastSeenAt ? new Date(session.lastSeenAt).toLocaleString() : "—"}
                        </span>
                      </div>
                      <Button
                        onClick={() => void revokeDeviceSession(session)}
                        isDisabled={sessionRevokePending === session.id}
                        variant="danger-soft"
                      >
                        {sessionRevokePending === session.id ? "Disconnessione…" : "Disconnetti"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* SEC 4: CHIAVE API PERSONALE */}
          <Card className="klx-settings-card--full">
            <CardBody>
              <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-violet-500" />
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
                    Chiave API Personale & Accesso Programmatico
                  </h2>
                </div>
                {apiKeyData?.hasKey && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider bg-success/15 border border-success/30 text-success rounded-full">
                    <Check className="w-3 h-3" /> Attiva
                  </span>
                )}
              </div>

              <div className="space-y-6">
                <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed max-w-3xl">
                  Una chiave API personale ti consente di autenticarti e consumare le API centralizzate di KALEX tramite script esterni, cURL o client IoT. La chiave erediterà automaticamente lo stesso livello di permessi (RBAC) e la stessa associazione aziendale del tuo utente reale.
                </p>

                {/* Banner di visualizzazione della chiave in chiaro appena generata */}
                {generatedKey && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-3">
                    <div className="flex items-center gap-2 text-amber-500">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">CONSERVA LA CHIAVE API ADESSO!</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-gray-300 leading-relaxed">
                      Per motivi di sicurezza, questa chiave viene mostrata in chiaro <strong>solo adesso</strong>. Copiala immediatamente e conservala in un password manager o in un luogo sicuro. Non sarà possibile recuperarla successivamente.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                      <input
                        type="text"
                        readOnly
                        value={generatedKey}
                        className="bg-slate-900/60 border border-amber-500/30 text-amber-400 font-mono text-xs rounded-2xl px-3.5 py-2 flex-1 h-[44px] outline-none select-all w-full min-w-0"
                      />
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedKey);
                          showToast("Chiave API copiata negli appunti.", "success");
                        }}
                        variant="primary"
                        icon={<Copy className="w-3.5 h-3.5" />}
                        className="shrink-0"
                      >
                        Copia
                      </Button>
                    </div>
                  </div>
                )}

                {loadingApiKey ? (
                  <div className="flex items-center gap-2 text-slate-400 py-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-violet-500"></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Caricamento dettagli chiave...</span>
                  </div>
                ) : apiKeyData?.hasKey ? (
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-5 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-white/5 rounded-2xl">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase">Hash Identificativo:</span>
                        <code className="text-xs text-slate-800 dark:text-violet-400 font-mono font-bold break-all bg-white dark:bg-black/30 px-2 py-0.5 rounded border border-slate-200 dark:border-white/5">
                          {apiKeyData.keyHash}
                        </code>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-gray-400">
                        Generata il: <span className="font-bold">{apiKeyData.createdAt ? new Date(apiKeyData.createdAt).toLocaleDateString() : "-"}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleGenerateApiKey}
                        isDisabled={loadingApiKey}
                        variant="ghost"
                        icon={<Key className="w-3.5 h-3.5" />}
                      >
                        Rigenera Chiave
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2">
                    <Button
                      onClick={handleGenerateApiKey}
                      isDisabled={loadingApiKey}
                      variant="primary"
                      icon={<Key className="w-3.5 h-3.5" />}
                    >
                      Genera Chiave API Personale
                    </Button>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* SEC 5: DANGEROUS ZONE GDPR */}
          <Card className="klx-settings-card--danger">
            <CardBody>
              <div className="flex items-center gap-2 mb-6 border-b border-red-500/20 pb-4">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-red-700 dark:text-red-400">
                  Zona Pericolosa - Rimozione Account (GDPR EU)
                </h2>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-2xl">
                  <p className="text-xs font-bold text-red-800 dark:text-red-400">
                    Questa azione è irreversibile.
                  </p>
                  <p className="text-xs text-red-600/80 dark:text-red-400/60 leading-relaxed">
                    In conformità con il Regolamento Generale sulla Protezione dei Dati (GDPR Art. 17 - Diritto all&apos;oblio), l&apos;eliminazione cancellerà permanentemente tutti i tuoi dati da PostgreSQL, team e file in cloud. L&apos;azione non può essere annullata.
                  </p>
                </div>
                <Button
                  onClick={() => setDeleteOpen(true)}
                  variant="danger"
                  icon={<Trash className="w-3.5 h-3.5" />}
                >
                  Elimina Account
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: DATI FISCALI ORGANIZZAZIONE          */}
      {/* ========================================== */}
      {currentTab === "organization" && isOrgManager && (
        <Card className="klx-settings-card">
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

      {/* ========================================== */}
      {/* DIALOG DI CONFIRMA ELIMINAZIONE GDPR       */}
      {/* ========================================== */}
      {deleteOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border border-red-500/30 bg-slate-950 rounded-3xl p-6 shadow-2xl relative">
            <CardBody className="space-y-4">
              <div className="flex items-center gap-3 text-red-500">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-base font-extrabold uppercase tracking-wider">
                  Cancellazione Definitiva
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tutti i tuoi dati personali, l&apos;accesso ai servizi e la configurazione associata verranno eliminati permanentemente. Per confermare, digita <span className="font-bold text-white uppercase tracking-widest font-mono bg-red-950 px-1 rounded">ELIMINA</span> nello spazio sottostante.
              </p>
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Digita ELIMINA per confermare"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="bg-white/5 dark:bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-white outline-none w-full text-center font-bold tracking-widest"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteOpen(false);
                    setDeleteConfirmText("");
                  }}
                  className="px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-widest bg-transparent border border-slate-800 hover:bg-slate-900 text-slate-400 rounded-xl cursor-pointer active:scale-95 transition-all"
                >
                  Annulla
                </button>
                <button
                  type="button"
                  onClick={handlePurgeAccount}
                  disabled={deletePending || deleteConfirmText !== "ELIMINA"}
                  className="px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-widest bg-red-600 hover:bg-red-700 disabled:bg-red-900/50 disabled:text-red-400/50 disabled:cursor-not-allowed text-white rounded-xl active:scale-95 transition-all border-none flex items-center gap-1 shadow-lg"
                >
                  {deletePending ? "Eliminazione..." : "Conferma Eliminazione"}
                </button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* ========================================== */}
      {/* DIALOG DI RIAUTENTICAZIONE MODALE          */}
      {/* ========================================== */}
      {reauthOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border border-violet-500/20 bg-slate-950 rounded-3xl p-6 shadow-2xl relative">
            <CardBody className="space-y-4">
              <div className="flex items-center gap-3 text-violet-500">
                <Lock className="w-5 h-5" />
                <h3 className="text-base font-extrabold uppercase tracking-wider">
                  Riautenticazione Richiesta
                </h3>
              </div>

              {reauthMfaResolver ? (
                <>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Hai la verifica in due passaggi attiva. Inserisci il codice generato da <strong>{reauthMfaHint}</strong> per confermare la tua identità.
                  </p>
                  <form onSubmit={handleReauthMfaVerify} className="space-y-4">
                    <Input
                      type="text"
                      maxLength={6}
                      placeholder="Codice a 6 cifre"
                      required
                      value={reauthMfaCode}
                      onChange={(e) => setReauthMfaCode(e.target.value)}
                      className="bg-white/5 dark:bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-white outline-none w-full text-center tracking-widest font-mono text-lg"
                    />
                    <div className="flex gap-3 justify-end pt-2">
                      <button
                        type="button"
                        onClick={closeReauth}
                        className="px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-widest bg-transparent border border-slate-800 hover:bg-slate-900 text-slate-400 rounded-xl cursor-pointer active:scale-95 transition-all"
                      >
                        Annulla
                      </button>
                      <button
                        type="submit"
                        disabled={reauthPending || reauthMfaCode.length < 6}
                        className="px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-widest bg-secondary hover:bg-violet-700 text-white rounded-xl active:scale-95 transition-all border-none flex items-center gap-1 shadow-lg cursor-pointer"
                      >
                        {reauthPending ? "Verifica..." : "Conferma codice"}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Per procedere con questa operazione sensibile sulla sicurezza, devi confermare la tua identità inserendo la tua password attuale.
                  </p>
                  <form onSubmit={handleReauthSubmit} className="space-y-4">
                    <Input
                      type="password"
                      placeholder="Password attuale"
                      required
                      value={reauthPassword}
                      onChange={(e) => setReauthPassword(e.target.value)}
                      className="bg-white/5 dark:bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-white outline-none w-full"
                    />
                    <div className="flex gap-3 justify-end pt-2">
                      <button
                        type="button"
                        onClick={closeReauth}
                        className="px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-widest bg-transparent border border-slate-800 hover:bg-slate-900 text-slate-400 rounded-xl cursor-pointer active:scale-95 transition-all"
                      >
                        Annulla
                      </button>
                      <button
                        type="submit"
                        disabled={reauthPending || !reauthPassword}
                        className="px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-widest bg-secondary hover:bg-violet-700 text-white rounded-xl active:scale-95 transition-all border-none flex items-center gap-1 shadow-lg cursor-pointer"
                      >
                        {reauthPending ? "Verifica..." : "Riconferma"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Settings;
