"use client";

import React, { useState, useMemo, useRef } from "react";
import Image from "next/image";
import { useDashboard } from "../layouts/DashboardContext";
import { fetchAuthedClient } from "../../lib/api";
import { Card, CardBody, Button } from "../ui";
import { Form } from "../layouts/Form";
import {
  User as UserIcon,
  Camera,
  Upload,
  Trash2,
  Shield
} from "lucide-react";
import { multiFactor } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../lib/auth";
import { useUIStrings } from "../../lib/ui.localization";
import { useI18n, useChangeLocale, useCurrentLocale } from "@/locales/client";
import { useTheme } from "next-themes";

// E4.2 — Sezione "Profilo" delle impostazioni, estratta meccanicamente da settings.tsx:
// form dati personali (fullName, email, mobile, locale, tema) + scheda avatar con
// upload/rimozione su Firebase Storage. Applica subito theme/locale scelti (P1-91).

export function SettingsProfile() {
  const { user, dbData, showToast, claims, refreshClaims } = useDashboard();
  const t = useI18n();
  const s = useUIStrings();
  // P1-91: setter reali per applicare theme/locale scelti nelle impostazioni (prima "dead settings").
  const changeLocale = useChangeLocale();
  const currentLocale = useCurrentLocale();
  const { setTheme } = useTheme();

  // Stato per l'avatar
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [prevAvatarUrl, setPrevAvatarUrl] = useState<string | null>(null);

  const currentAvatarUrl = dbData?.user?.avatarUrl || user?.photoURL || null;
  if (currentAvatarUrl !== prevAvatarUrl) {
    setPrevAvatarUrl(currentAvatarUrl);
    setAvatarPreview(currentAvatarUrl);
  }

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fattori MFA registrati letti dallo stato Firebase del client: se la 2FA è attiva,
  // email e mobile diventano campi disabilitati nel form profilo.
  const is2faActive = user ? multiFactor(user).enrolledFactors.length > 0 : false;

  // Ruolo dell'utente loggato nell'organizzazione (uRole / role fallback)
  const activeRole = claims?.uRole || claims?.role;

  const displayName = dbData?.user?.fullName || user?.displayName || user?.email?.split("@")[0] || t("settings.profile.defaultUser");
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

  // Submit Dati Utente Semplici
  const handleUserSubmit = async (data: Record<string, unknown>, idempotencyKey: string) => {
    try {
      const userId = claims?.uId || user?.uid;
      if (!userId) throw new Error(t("settings.toast.userNotIdentified"));

      const resData = await fetchAuthedClient<Record<string, unknown>>(`/api/user/${userId}/profile`, {
        method: "POST",
        headers: { "Idempotency-Key": idempotencyKey },
        body: JSON.stringify({ ...data, avatarUrl: avatarPreview || "" })
      });

      if (!resData.success) {
        throw new Error(resData.error?.message || t("settings.toast.profileUpdateError"));
      }

      await refreshClaims();

      // P1-91: applica SUBITO theme e locale scelti (prima erano salvati ma non applicati).
      // - next-themes: setTheme persiste su localStorage e lo script SSR lo riapplica al reload.
      // - next-international: changeLocale imposta il cookie Next-Locale (onorato dal middleware
      //   i18n in proxy.ts) e REDIRIGE alla lingua scelta → va chiamato per ultimo.
      const newTheme = typeof data.theme === "string" ? data.theme : undefined;
      if (newTheme === "light" || newTheme === "dark") {
        setTheme(newTheme);
      }
      showToast(t("settings.toast.profileUpdated"), "success");

      const newLocale = typeof data.locale === "string" ? data.locale : undefined;
      if ((newLocale === "it" || newLocale === "en" || newLocale === "es") && newLocale !== currentLocale) {
        changeLocale(newLocale);
      }
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
      showToast(t("settings.toast.imgTooLarge"), "error");
      return;
    }

    try {
      setUploading(true);
      const userId = claims?.uId || user?.uid;
      if (!userId) throw new Error(t("settings.toast.userNotIdentified"));

      const organizationId = claims?.orgId || dbData?.user?.organizationId || "default";
      const storageRef = ref(storage, `organizations/${organizationId}/users/${userId}/avatar_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      const { updateProfile } = await import("firebase/auth");
      if (user) {
        await updateProfile(user, { photoURL: downloadUrl });
      }

      await fetchAuthedClient<Record<string, unknown>>(`/api/user/${userId}/profile`, {
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
      showToast(t("settings.toast.avatarUploaded"), "success");
    } catch (err) {
      console.error(err);
      showToast(t("settings.toast.avatarUploadFail"), "error");
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarRemove = async () => {
    try {
      setUploading(true);
      const userId = claims?.uId || user?.uid;
      if (!userId) throw new Error(t("settings.toast.userNotIdentified"));

      const { updateProfile } = await import("firebase/auth");
      if (user) {
        await updateProfile(user, { photoURL: "" });
      }

      await fetchAuthedClient<Record<string, unknown>>(`/api/user/${userId}/profile`, {
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
      showToast(t("settings.toast.avatarRemoved"), "success");
    } catch (err) {
      console.error(err);
      showToast(t("settings.toast.avatarRemoveFail"), "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="klx-settings-grid">
      {/* Form Profilo Base */}
      <Card className="lg:col-span-2 klx-settings-card">
        <CardBody>
          <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-secondary" />
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
                {t("settings.profile.personalInfo")}
              </h2>
            </div>
          </div>
          <Form
            moduleId="user"
            initialData={userInitialData}
            fieldsOrder={["fullName", "email", "mobile", "locale", "theme"]}
            disabledFields={is2faActive ? ["email", "mobile"] : ["email"]}
            onSubmit={handleUserSubmit}
            submitLabel={t("settings.profile.submit")}
          />
        </CardBody>
      </Card>

      {/* Scheda Profilo e Upload Avatar */}
      <Card className="lg:col-span-1 klx-settings-card flex flex-col h-full justify-between items-center">
        <CardBody className="flex flex-col items-center justify-between h-full w-full py-2">
          <div className="flex flex-col items-center w-full space-y-5">
            <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-white/10 pb-4 w-full">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-secondary" />
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
                  {t("settings.profile.imageTitle")}
                </h2>
              </div>
            </div>

            {/* Foto Profilo Circolare con Hover Upload */}
            <div className="klx-settings-profile-avatar-wrapper">
              {uploading ? (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white gap-2">
                  <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-secondary"></span>
                  <span className="text-[9px] font-bold uppercase tracking-widest">{t("settings.profile.uploading")}</span>
                </div>
              ) : (
                <>
                  {avatarPreview ? (
                    <Image src={avatarPreview} alt={s.settings.avatarAlt} fill sizes="144px" unoptimized className="object-cover" />
                  ) : (
                    <span className="text-4xl font-black text-slate-400 dark:text-slate-600 select-none">
                      {displayName.substring(0, 2).toUpperCase()}
                    </span>
                  )}

                  <label className="klx-settings-avatar-hover-overlay gap-1 select-none">
                    <Camera className="w-5 h-5 text-secondary" />
                    <span className="text-[8px] font-extrabold uppercase tracking-widest">{t("settings.profile.browse")}</span>
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
                {user?.email || t("settings.profile.noEmail")}
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
              {t("settings.profile.upload")}
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
                {t("settings.profile.removeAvatar")}
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
