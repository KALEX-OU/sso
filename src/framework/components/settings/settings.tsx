"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useDashboard } from "../layouts/DashboardContext";
import { fetchAuthedClient } from "../../lib/api";
import { Card, CardBody } from "../ui/Card";
import { Tabs, Tab, TabList } from "../ui/Tabs";
import { Form } from "../layouts/Form";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
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
  multiFactor
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, forceCleanSession } from "../../lib/auth";

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

  // Stati per la 2FA (MFA)
  const [mfaPhoneNumber, setMfaPhoneNumber] = useState("");
  const [mfaOtpCode, setMfaOtpCode] = useState("");
  const [mfaStep, setMfaStep] = useState<"idle" | "verify" | "otp">("idle");
  const [mfaPending, setMfaPending] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodesDialog, setShowBackupCodesDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stati per il Dialog di Riautenticazione Generale
  const [reauthOpen, setReauthOpen] = useState(false);
  const [reauthPassword, setReauthPassword] = useState("");
  const [reauthPending, setReauthPending] = useState(false);
  const [onReauthSuccess, setOnReauthSuccess] = useState<(() => Promise<void>) | null>(null);

  // Stati per l'Eliminazione GDPR
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletePending, setDeletePending] = useState(false);

  const [uploading, setUploading] = useState(false);
  const is2faActive = user ? multiFactor(user).enrolledFactors.length > 0 : false;

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
  const executeWithReauthChallenge = (action: () => Promise<void>) => {
    setOnReauthSuccess(() => action);
    setReauthPassword("");
    setReauthOpen(true);
  };

  const handleReauthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;

    try {
      setReauthPending(true);
      const credential = EmailAuthProvider.credential(user.email, reauthPassword);
      await reauthenticateWithCredential(user, credential);
      setReauthOpen(false);
      showToast("Riautenticazione completata con successo.", "success");
      
      if (onReauthSuccess) {
        await onReauthSuccess();
      }
    } catch (err) {
      console.error("[Reauth] Errore:", err);
      showToast("Password attuale errata o non valida.", "error");
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

  // 2FA - SMS OTP Verification
  const startMfaEnrollment = async () => {
    if (!user || !mfaPhoneNumber) return;

    try {
      setMfaPending(true);

      const res = await fetchAuthedClient<{ success: boolean; error?: string; message?: string }>(`/api/user/${user.uid}/mfa/send`, {
        method: "POST",
        body: JSON.stringify({ phoneNumber: mfaPhoneNumber })
      });

      if (!res.success) {
        throw new Error(res.error?.message || "Errore durante l'invio del codice di verifica.");
      }

      setMfaStep("otp");
      showToast("Codice di verifica SMS inviato al telefono.", "success");
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : "Errore nell'invio dell'SMS. Controlla il formato (es. +393471234567).", "error");
    } finally {
      setMfaPending(false);
    }
  };

  const confirmMfaEnrollment = async () => {
    if (!user || !mfaOtpCode) return;

    try {
      setMfaPending(true);

      const res = await fetchAuthedClient<{ success: boolean; error?: string; backupCodes?: string[] }>(`/api/user/${user.uid}/mfa/verify`, {
        method: "POST",
        body: JSON.stringify({ phoneNumber: mfaPhoneNumber, code: mfaOtpCode })
      });

      if (!res.success) {
        throw new Error(res.error?.message || "Codice OTP non valido o scaduto.");
      }

      const generatedCodes = res.data?.backupCodes;
      if (generatedCodes && generatedCodes.length > 0) {
        setBackupCodes(generatedCodes);
        setShowBackupCodesDialog(true);
      }

      setMfaStep("idle");
      setMfaPhoneNumber("");
      setMfaOtpCode("");
      showToast("Autenticazione a due fattori (2FA) attivata correttamente.", "success");
      if (!(generatedCodes && generatedCodes.length > 0)) {
        await refreshClaims();
      }
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : "Codice OTP non valido o scaduto.", "error");
    } finally {
      setMfaPending(false);
    }
  };

  const disableMfa = async () => {
    try {
      setMfaPending(true);
      const res = await fetchAuthedClient<{ success: boolean; error?: string }>(`/api/user/${user!.uid}/mfa/disable`, {
        method: "POST"
      });
      if (!res.success) {
        throw new Error(res.error?.message || "Impossibile disattivare la 2FA.");
      }
      setMfaStep("idle");
      showToast("2FA disattivata con successo.", "success");
      await refreshClaims();
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : "Impossibile disattivare la 2FA.", "error");
    } finally {
      setMfaPending(false);
    }
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
      {/* Contenitore invisibile per Recaptcha di Firebase */}
      <div id="recaptcha-container" className="hidden"></div>

      <div>
        <h1 className="klx-settings-header-title">
          <UserIcon className="w-5 h-5 text-purple-500" /> Impostazioni Account & Azienda
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
                    <UserIcon className="w-4 h-4 text-purple-500" />
                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
                      Informazioni Personali
                    </h2>
                  </div>
                </div>
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

            {/* Scheda Profilo e Upload Avatar */}
            <Card className="lg:col-span-1 klx-settings-card flex flex-col h-full justify-between items-center">
              <CardBody className="flex flex-col items-center justify-between h-full w-full py-2">
                <div className="flex flex-col items-center w-full space-y-5">
                  <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-white/10 pb-4 w-full">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-purple-500" />
                      <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
                        Immagine del Profilo
                      </h2>
                    </div>
                  </div>

                  {/* Foto Profilo Circolare con Hover Upload */}
                  <div className="klx-settings-profile-avatar-wrapper">
                    {uploading ? (
                      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white gap-2">
                        <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-purple-500"></span>
                        <span className="text-[9px] font-bold uppercase tracking-widest">Caricamento</span>
                      </div>
                    ) : (
                      <>
                        {avatarPreview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-4xl font-black text-slate-400 dark:text-slate-600 select-none">
                            {displayName.substring(0, 2).toUpperCase()}
                          </span>
                        )}

                        <label className="klx-settings-avatar-hover-overlay gap-1 select-none">
                          <Camera className="w-5 h-5 text-purple-400" />
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
                  <Key className="w-4 h-4 text-purple-500" />
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

            {/* SEC 3: 2FA (SMS DUAL STEP) */}
            <Card className="klx-settings-card--full">
              <CardBody>
                <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-500" />
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
                    L&apos;autenticazione a due fattori (2FA) aggiunge un ulteriore livello di sicurezza al tuo account. All&apos;accesso, ti verrà richiesto un codice OTP inviato sul tuo numero di telefono principale.
                  </p>

                  {is2faActive ? (
                    <div className="pt-2">
                      <Button
                        onClick={disableMfa}
                        isDisabled={mfaPending}
                        variant="danger-soft"
                      >
                        Disattiva 2FA
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {mfaStep === "idle" && (
                        <div className="pt-2">
                          <Button
                            onClick={() => setMfaStep("verify")}
                            variant="primary"
                          >
                            Configura 2FA via SMS
                          </Button>
                        </div>
                      )}

                      {mfaStep === "verify" && (
                        <div className="flex flex-col gap-3 pt-2">
                          <Label className="text-xs font-bold text-slate-700 dark:text-gray-300">
                            Inserisci Numero di Cellulare
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              type="tel"
                              placeholder="E.g. +393471234567"
                              value={mfaPhoneNumber}
                              onChange={(e) => setMfaPhoneNumber(e.target.value)}
                              className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-primary rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full"
                            />
                            <Button
                              onClick={startMfaEnrollment}
                              isDisabled={mfaPending || !mfaPhoneNumber}
                              variant="primary"
                            >
                              Invia SMS
                            </Button>
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-gray-400">
                            Inserisci il prefisso internazionale (es. +39 per l&apos;Italia).
                          </span>
                        </div>
                      )}

                      {mfaStep === "otp" && (
                        <div className="flex flex-col gap-3 pt-2">
                          <Label className="text-xs font-bold text-slate-700 dark:text-gray-300">
                            Inserisci Codice OTP Ricevuto
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              type="text"
                              maxLength={6}
                              placeholder="6 cifre"
                              value={mfaOtpCode}
                              onChange={(e) => setMfaOtpCode(e.target.value)}
                              className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-primary rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full text-center tracking-widest font-mono text-lg"
                            />
                            <Button
                              onClick={confirmMfaEnrollment}
                              isDisabled={mfaPending || mfaOtpCode.length < 6}
                              variant="primary"
                            >
                              Conferma Codice
                            </Button>
                          </div>
                          <button
                            type="button"
                            onClick={() => setMfaStep("verify")}
                            className="text-[10px] font-extrabold uppercase tracking-wider text-purple-500 hover:text-purple-400 text-left outline-none self-start bg-transparent border-none cursor-pointer mt-1"
                          >
                            Modifica Numero Telefono
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* SEC 4: CHIAVE API PERSONALE */}
          <Card className="klx-settings-card--full">
            <CardBody>
              <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-purple-500" />
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
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-purple-500"></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Caricamento dettagli chiave...</span>
                  </div>
                ) : apiKeyData?.hasKey ? (
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-5 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-white/5 rounded-2xl">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase">Hash Identificativo:</span>
                        <code className="text-xs text-slate-800 dark:text-purple-400 font-mono font-bold break-all bg-white dark:bg-black/30 px-2 py-0.5 rounded border border-slate-200 dark:border-white/5">
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
      {/* DIALOG CODICI DI RECUPERO 2FA              */}
      {/* ========================================== */}
      {showBackupCodesDialog && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border border-purple-500/20 bg-slate-950 rounded-3xl p-6 shadow-2xl relative text-center">
            <CardBody className="space-y-4 items-center">
              <div className="mx-auto bg-purple-500/10 p-3 rounded-full w-12 h-12 flex items-center justify-center text-purple-500">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold uppercase tracking-wider text-white">
                Codici di Recupero Generati
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Salva questi codici di backup in un luogo sicuro. Non saranno mostrati nuovamente. Puoi usarli per accedere al tuo account se perdi l&apos;accesso al telefono.
              </p>
              
              <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 my-2 select-text">
                <ul className="font-mono text-base text-slate-200 space-y-2 list-none p-0 m-0">
                  {backupCodes.map((code) => (
                    <li key={code} className="tracking-widest font-bold">
                      {code}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-2 w-full pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const text = backupCodes.join("\n");
                    void navigator.clipboard.writeText(text);
                    showToast("Codici di recupero copiati negli appunti.", "success");
                  }}
                  className="w-full px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-widest bg-white/5 hover:bg-white/10 text-white rounded-xl active:scale-95 transition-all border border-slate-800 flex items-center justify-center gap-1 shadow-lg cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  Copia tutti i codici
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const text = `KALEX 2FA BACKUP CODES\nGenerati il: ${new Date().toLocaleString()}\n\n${backupCodes.join("\n")}`;
                    const blob = new Blob([text], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `kalex_backup_codes_${user?.email || "user"}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                    showToast("File dei codici scaricato con successo.", "success");
                  }}
                  className="w-full px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-widest bg-white/5 hover:bg-white/10 text-white rounded-xl active:scale-95 transition-all border border-slate-800 flex items-center justify-center gap-1 shadow-lg cursor-pointer"
                >
                  Scarica come file .txt
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setShowBackupCodesDialog(false);
                    setBackupCodes([]);
                    showToast("Sessione in fase di aggiornamento. Reindirizzamento al login...", "success");
                    await new Promise((resolve) => setTimeout(resolve, 800));
                    void forceCleanSession();
                  }}
                  className="w-full px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-widest bg-purple-600 hover:bg-purple-700 text-white rounded-xl active:scale-95 transition-all border-none flex items-center justify-center gap-1 shadow-lg cursor-pointer mt-2"
                >
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Ho salvato i codici
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
          <Card className="max-w-md w-full border border-purple-500/20 bg-slate-950 rounded-3xl p-6 shadow-2xl relative">
            <CardBody className="space-y-4">
              <div className="flex items-center gap-3 text-purple-500">
                <Lock className="w-5 h-5" />
                <h3 className="text-base font-extrabold uppercase tracking-wider">
                  Riautenticazione Richiesta
                </h3>
              </div>
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
                    onClick={() => {
                      setReauthOpen(false);
                      setReauthPassword("");
                      setOnReauthSuccess(null);
                    }}
                    className="px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-widest bg-transparent border border-slate-800 hover:bg-slate-900 text-slate-400 rounded-xl cursor-pointer active:scale-95 transition-all"
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    disabled={reauthPending || !reauthPassword}
                    className="px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-widest bg-purple-600 hover:bg-purple-700 text-white rounded-xl active:scale-95 transition-all border-none flex items-center gap-1 shadow-lg cursor-pointer"
                  >
                    {reauthPending ? "Verifica..." : "Riconferma"}
                  </button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Settings;
