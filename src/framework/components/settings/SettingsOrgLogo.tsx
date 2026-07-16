"use client";

import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useDashboard } from "../layouts/DashboardContext";
import { fetchAuthedClient } from "../../lib/api";
import { organizationSettingsSchema } from "../../lib/schemas/api";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../../lib/auth";
import { Card, CardBody, Button } from "../ui";
import { Building2, ImagePlus, Trash2 } from "lucide-react";
import { useI18n } from "@/locales/client";

/**
 * Card "Logo aziendale" della pagina Organizzazione — upload del logo
 * white-label dell'org su Firebase Storage (organizations/{orgId}/branding/,
 * rules: solo owner/admin, immagini ≤5MiB) con persistenza del download URL
 * in `metadata.logoUrl` dell'organizzazione (stesso POST dei dati fiscali).
 * Il logo alimenta il branding per-org (§3-bis).
 */
export function SettingsOrgLogo() {
  const { dbData, showToast } = useDashboard();
  const t = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const rawOrganization = dbData?.organization;
  const activeOrg = useMemo(() => {
    if (!rawOrganization) return undefined;
    const parsed = organizationSettingsSchema.safeParse(rawOrganization);
    return parsed.success ? parsed.data : undefined;
  }, [rawOrganization]);

  const metadata = (activeOrg?.metadata || {}) as Record<string, unknown>;
  const currentLogoUrl = typeof metadata.logoUrl === "string" ? metadata.logoUrl : undefined;
  const [logoUrl, setLogoUrl] = useState<string | undefined>(currentLogoUrl);

  // Persiste metadata.logoUrl con lo stesso endpoint dei dati fiscali,
  // rimandando i campi correnti (l'update organizzazione non è parziale).
  const persistLogoUrl = async (nextLogoUrl: string | null) => {
    if (!activeOrg) return;
    const resData = await fetchAuthedClient<Record<string, unknown>>(`/api/organization/${activeOrg.orgId}`, {
      method: "POST",
      body: JSON.stringify({
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
        address: activeOrg.address || "",
        metadata: { ...metadata, logoUrl: nextLogoUrl }
      })
    });
    if (!resData.success) {
      throw new Error(resData.error?.message || t("settings.toast.orgUpdateError"));
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeOrg) return;
    try {
      setUploading(true);
      const storageRef = ref(storage, `organizations/${activeOrg.orgId}/branding/logo_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      await persistLogoUrl(downloadUrl);
      setLogoUrl(downloadUrl);
      showToast(t("settings.org.logoSaved"), "success");
    } catch (err) {
      console.error("[SettingsOrgLogo] Errore upload logo:", err);
      showToast(t("settings.org.logoUploadFail"), "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleLogoRemove = async () => {
    if (!activeOrg || !logoUrl) return;
    try {
      setUploading(true);
      // Best-effort: rimuove il file dal bucket (l'URL è la fonte di verità nei metadata).
      try {
        await deleteObject(ref(storage, logoUrl));
      } catch {
        // File già assente o URL esterno: si procede con la sola pulizia dei metadata.
      }
      await persistLogoUrl(null);
      setLogoUrl(undefined);
      showToast(t("settings.org.logoRemoved"), "success");
    } catch (err) {
      console.error("[SettingsOrgLogo] Errore rimozione logo:", err);
      showToast(t("settings.org.logoUploadFail"), "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="klx-settings-card">
      <CardBody>
        <div className="flex items-center justify-between mb-6 border-b border-line pb-4">
          <div className="flex items-center gap-2">
            <ImagePlus className="w-4 h-4 text-secondary" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-ink">
              {t("settings.org.logoTitle")}
            </h2>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative w-36 h-36 rounded-2xl border border-line bg-surface-2 flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              /* Il download URL contiene il token: renderizzabile ovunque (login §3-bis incluso). */
              <Image src={logoUrl} alt={t("settings.org.logoTitle")} fill sizes="144px" unoptimized className="object-contain p-2" />
            ) : (
              <Building2 className="w-10 h-10 text-ink-muted" />
            )}
          </div>
          <p className="text-xs text-ink-muted leading-relaxed max-w-[240px]">{t("settings.org.logoDesc")}</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => void handleLogoUpload(e)}
            className="hidden"
            aria-label={t("settings.org.logoUpload")}
          />
          <div className="flex gap-2">
            <Button
              onClick={() => fileInputRef.current?.click()}
              isDisabled={uploading || !activeOrg}
              variant="primary"
              icon={<ImagePlus className="w-3.5 h-3.5" />}
            >
              {uploading ? t("settings.profile.uploading") : t("settings.org.logoUpload")}
            </Button>
            {logoUrl && (
              <Button
                onClick={() => void handleLogoRemove()}
                isDisabled={uploading}
                variant="danger-soft"
                icon={<Trash2 className="w-3.5 h-3.5" />}
              >
                {t("settings.org.logoRemove")}
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
