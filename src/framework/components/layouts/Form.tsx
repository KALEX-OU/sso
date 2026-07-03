"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, AlertCircle, Copy, Check } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { TextField } from "../ui/TextField";
import { Label } from "../ui/Label";
import { Textarea } from "../ui/TextArea";
import { Select, SelectTrigger, SelectValue, SelectPopover, ListBox, ListBoxItem } from "../ui/Select";
import { Checkbox } from "../ui/Checkbox";
import { useClaims } from "../../lib/auth";
import { MODULE_REGISTRY, getModulePolicyForContext, getModuleInfo } from "../../lib/resources.config";

interface OptionItem {
  value: string;
  label: string;
}

// Dizionario di Traduzione e Localizzazione
const LOCALIZATION: Record<string, Record<string, Record<string, { label: string; placeholder?: string; options?: OptionItem[] }>>> = {
  it: {
    user: {
      fullName: { label: "Nome e Cognome", placeholder: "E.g. Mario Rossi" },
      email: { label: "Email (Sola Lettura)", placeholder: "E.g. mario@example.com" },
      mobile: { label: "Telefono Cellulare", placeholder: "E.g. +39 347 1234567" },
      locale: {
        label: "Lingua dell'Interfaccia",
        options: [
          { value: "it", label: "Italiano (IT)" },
          { value: "en", label: "English (EN)" },
          { value: "es", label: "Español (ES)" }
        ]
      },
      theme: {
        label: "Tema Grafico",
        options: [
          { value: "light", label: "Tema Chiaro (Light)" },
          { value: "dark", label: "Tema Scuro (Dark)" }
        ]
      },
      avatarUrl: { label: "URL Avatar", placeholder: "E.g. https://..." }
    },
    organization: {
      name: { label: "Ragione Sociale / Nome", placeholder: "E.g. KALEX S.r.l." },
      type: {
        label: "Tipologia Organizzazione",
        options: [
          { value: "personal", label: "Personale (B2C / Consumatore)" },
          { value: "business", label: "Azienda / Libero Professionista (B2B)" },
          { value: "government", label: "Ente Pubblico / Pubblica Amministrazione (B2G)" },
          { value: "education", label: "Istituzione Educativa / Università (B2E)" }
        ]
      },
      country: { label: "Paese", placeholder: "E.g. IT" },
      vatNumber: { label: "Partita IVA", placeholder: "E.g. IT01234567890" },
      fiscalCode: { label: "Codice Fiscale", placeholder: "E.g. RSSMRA80A01H501U" },
      address: { label: "Indirizzo Sede", placeholder: "E.g. Via Roma 1, 00100 Roma RM" },
      billingAddress: { label: "Indirizzo di Fatturazione", placeholder: "E.g. Via Roma 1, 00100 Roma RM" },
      sdiCode: { label: "Codice Destinatario (SDI)", placeholder: "E.g. SUBM19N" },
      officeCode: { label: "Codice Univoco Ufficio (iPA)", placeholder: "E.g. UF23N9" },
      cigCode: { label: "Codice CIG (Gara)", placeholder: "E.g. Z123456789" },
      cupCode: { label: "Codice CUP (Progetto)", placeholder: "E.g. G12345678901234" }
    },
    thing: {
      name: { label: "Nome Dispositivo", placeholder: "E.g. Sensore Temperatura A" },
      type: {
        label: "Tipo Dispositivo",
        options: [
          { value: "sensor", label: "Sensore" },
          { value: "camera", label: "Telecamera" },
          { value: "gateway", label: "Gateway" },
          { value: "controller", label: "Controller" }
        ]
      },
      status: { label: "Stato" },
      metadata: { label: "Metadati Hardware (JSON)", placeholder: 'e.g. {"firmware": "v1.2.0"}' }
    },
    apikey: {
      name: { label: "Nome Chiave", placeholder: "E.g. Integrazione CRM" },
      description: { label: "Descrizione", placeholder: "E.g. Usata per caricare le info sui sensori" },
      ipWhitelist: { label: "IP Whitelist (Separati da virgole)", placeholder: "E.g. 192.168.1.1, 93.40.10.99" },
      isTest: { label: "Sandbox Test Key" },
      permissions: { label: "Permessi (Array JSON Scopes)", placeholder: 'e.g. [{"moduleId": "thing", "canCreate": true}]' }
    }
  },
  en: {
    user: {
      fullName: { label: "Full Name", placeholder: "E.g. John Doe" },
      email: { label: "Email (Read Only)", placeholder: "E.g. john@example.com" },
      mobile: { label: "Mobile Phone", placeholder: "E.g. +39 347 1234567" },
      locale: {
        label: "Interface Language",
        options: [
          { value: "it", label: "Italian (IT)" },
          { value: "en", label: "English (EN)" },
          { value: "es", label: "Spanish (ES)" }
        ]
      },
      theme: {
        label: "Graphic Theme",
        options: [
          { value: "light", label: "Light Theme" },
          { value: "dark", label: "Dark Theme" }
        ]
      },
      avatarUrl: { label: "Avatar URL", placeholder: "E.g. https://..." }
    },
    organization: {
      name: { label: "Organization Name", placeholder: "E.g. KALEX Ltd." },
      type: {
        label: "Organization Type",
        options: [
          { value: "personal", label: "Personal (B2C / Consumer)" },
          { value: "business", label: "Business / Freelancer (B2B)" },
          { value: "government", label: "Public Administration (B2G)" },
          { value: "education", label: "Educational Institution (B2E)" }
        ]
      },
      country: { label: "Country", placeholder: "E.g. IT" },
      vatNumber: { label: "VAT Number", placeholder: "E.g. IT01234567890" },
      fiscalCode: { label: "Tax Code", placeholder: "E.g. RSSMRA80A01H501U" },
      address: { label: "Registered Office Address", placeholder: "E.g. 1 Main St, London" },
      billingAddress: { label: "Billing Address", placeholder: "E.g. 1 Main St, London" },
      sdiCode: { label: "SDI Recipient Code", placeholder: "E.g. SUBM19N" },
      officeCode: { label: "iPA Office Code", placeholder: "E.g. UF23N9" },
      cigCode: { label: "CIG Code (Tender)", placeholder: "E.g. Z123456789" },
      cupCode: { label: "CUP Code (Project)", placeholder: "E.g. G12345678901234" }
    },
    thing: {
      name: { label: "Device Name", placeholder: "E.g. Temp Sensor A" },
      type: {
        label: "Device Type",
        options: [
          { value: "sensor", label: "Sensor" },
          { value: "camera", label: "Camera" },
          { value: "gateway", label: "Gateway" },
          { value: "controller", label: "Controller" }
        ]
      },
      status: { label: "Status" },
      metadata: { label: "Hardware Metadata (JSON)", placeholder: 'e.g. {"firmware": "v1.2.0"}' }
    },
    apikey: {
      name: { label: "Key Name", placeholder: "E.g. CRM Integration" },
      description: { label: "Description", placeholder: "E.g. Used for sensor APIs" },
      ipWhitelist: { label: "IP Whitelist (Comma separated)", placeholder: "E.g. 192.168.1.1, 93.40.10.99" },
      isTest: { label: "Sandbox Test Key" },
      permissions: { label: "Permissions (JSON Scopes Array)", placeholder: 'e.g. [{"moduleId": "thing", "canCreate": true}]' }
    }
  },
  es: {
    user: {
      fullName: { label: "Nombre y Apellido", placeholder: "Ej. Mario Rossi" },
      email: { label: "Correo Electrónico (Solo Lectura)", placeholder: "Ej. mario@example.com" },
      mobile: { label: "Teléfono Móvil", placeholder: "Ej. +39 347 1234567" },
      locale: {
        label: "Idioma de la Interfaz",
        options: [
          { value: "it", label: "Italiano (IT)" },
          { value: "en", label: "Inglés (EN)" },
          { value: "es", label: "Español (ES)" }
        ]
      },
      theme: {
        label: "Tema Gráfico",
        options: [
          { value: "light", label: "Tema Claro" },
          { value: "dark", label: "Tema Oscuro" }
        ]
      },
      avatarUrl: { label: "URL del Avatar", placeholder: "Ej. https://..." }
    },
    organization: {
      name: { label: "Razón Social / Nombre", placeholder: "Ej. KALEX S.r.l." },
      type: {
        label: "Tipo de Organización",
        options: [
          { value: "personal", label: "Personal (B2C / Consumidor)" },
          { value: "business", label: "Empresa / Profesional (B2B)" },
          { value: "government", label: "Administración Pública (B2G)" },
          { value: "education", label: "Institución Educativa (B2E)" }
        ]
      },
      country: { label: "País", placeholder: "Ej. IT" },
      vatNumber: { label: "Número de IVA", placeholder: "Ej. IT01234567890" },
      fiscalCode: { label: "Código Fiscal", placeholder: "Ej. RSSMRA80A01H501U" },
      address: { label: "Dirección de la Sede", placeholder: "Ej. Via Roma 1, Roma" },
      billingAddress: { label: "Dirección de Facturación", placeholder: "Ej. Via Roma 1, Roma" },
      sdiCode: { label: "Código SDI", placeholder: "Ej. SUBM19N" },
      officeCode: { label: "Código iPA", placeholder: "Ej. UF23N9" },
      cigCode: { label: "Código CIG", placeholder: "Ej. Z123456789" },
      cupCode: { label: "Código CUP", placeholder: "Ej. G12345678901234" }
    },
    thing: {
      name: { label: "Nombre del Dispositivo", placeholder: "Ej. Sensor de Temp" },
      type: {
        label: "Tipo de Dispositivo",
        options: [
          { value: "sensor", label: "Sensor" },
          { value: "camera", label: "Cámara" },
          { value: "gateway", label: "Gateway" },
          { value: "controller", label: "Controlador" }
        ]
      },
      status: { label: "Estado" },
      metadata: { label: "Metadatos de Hardware (JSON)", placeholder: 'ej. {"firmware": "v1.2.0"}' }
    },
    apikey: {
      name: { label: "Nombre de la Clave", placeholder: "Ej. Integración de CRM" },
      description: { label: "Descripción", placeholder: "Ej. Usada para APIs de sensores" },
      ipWhitelist: { label: "Lista Blanca de IP (Separados por comas)", placeholder: "Ej. 192.168.1.1, 93.40.10.99" },
      isTest: { label: "Clave de Prueba de Sandbox" },
      permissions: { label: "Permisos (JSON Scopes Array)", placeholder: 'ej. [{"moduleId": "thing", "canCreate": true}]' }
    }
  }
};

// Logica delle dipendenze condizionali
const FIELD_DEPENDENCIES: Record<string, (values: Record<string, unknown>) => Record<string, boolean>> = {
  organization: (values) => {
    const type = (values?.type as string) || "business";
    return {
      vatNumber: type !== "personal",
      fiscalCode: ["personal", "business"].includes(type),
      sdiCode: type === "business",
      officeCode: type === "government",
      cigCode: type === "government",
      cupCode: type === "government"
    };
  }
};

// Generatore Zod dinamico
function buildZodSchema(moduleId: string, allowedFields: string[], fieldsOrder: string[]): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const moduleConfig = getModuleInfo(moduleId);
  if (!moduleConfig) return z.object({}) as z.ZodObject<Record<string, z.ZodTypeAny>>;

  const shape: Record<string, z.ZodTypeAny> = {};

  const fieldsToValidate = fieldsOrder.length > 0
    ? allowedFields.filter(f => fieldsOrder.includes(f))
    : allowedFields;

  for (const fieldKey of fieldsToValidate) {
    const field = moduleConfig.fields[fieldKey];
    if (!field) continue;

    let fieldSchema: z.ZodTypeAny = z.string();

    if (field.type === "Boolean") {
      fieldSchema = z.boolean();
    } else if (field.type === "Float") {
      fieldSchema = z.number({ message: "Deve essere un numero" });
    } else if (field.type === "Timestamp") {
      fieldSchema = z.string().or(z.date());
    } else if (field.type === "Any") {
      fieldSchema = z.unknown();
    }

    const val = field.validation || {};

    if (fieldSchema instanceof z.ZodString) {
      if (val.required) {
        fieldSchema = fieldSchema.min(1, "Campo obbligatorio");
      } else {
        fieldSchema = fieldSchema.optional().or(z.literal(""));
      }

      if (val.min) {
        fieldSchema = (fieldSchema as z.ZodString).min(val.min, `Minimo ${val.min} caratteri`);
      }
      if (val.max) {
        fieldSchema = (fieldSchema as z.ZodString).max(val.max, `Massimo ${val.max} caratteri`);
      }
      if (val.email) {
        fieldSchema = (fieldSchema as z.ZodString).email("Email non valida");
      }
      if (val.enum) {
        fieldSchema = z.enum(val.enum as [string, ...string[]]);
      }
      if (val.format === "vat") {
        fieldSchema = (fieldSchema as z.ZodString).regex(/^[A-Z0-9]{2,15}$/i, "Partita IVA non valida");
      }
      if (val.format === "personal_id") {
        fieldSchema = (fieldSchema as z.ZodString).regex(/^[A-Z0-9]{16}$/i, "Codice Fiscale non valido (16 caratteri)");
      }
      if (val.format === "sdi") {
        fieldSchema = (fieldSchema as z.ZodString).regex(/^[A-Z0-9]{7}$/i, "Codice SDI non valido (7 caratteri)");
      }
    } else {
      if (val.required) {
        // Obbligatorio
      } else {
        fieldSchema = fieldSchema.optional().nullable();
      }
    }

    shape[fieldKey] = fieldSchema;
  }

  return z.object(shape) as z.ZodObject<Record<string, z.ZodTypeAny>>;
}

// Helper puro/esterno per la generazione della chiave di idempotenza per soddisfare le regole di purezza di React Compiler
function generateIdempotencyKey(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : "idem_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

interface DisabledFieldWrapperProps {
  label: string;
  value: string;
}

function DisabledFieldWrapper({ label, value }: DisabledFieldWrapperProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label className="text-xs font-bold text-slate-700 dark:text-gray-300">
        {label}
      </Label>
      <div className="bg-slate-100/30 dark:bg-slate-950/20 backdrop-blur-sm border border-slate-200/50 dark:border-white/5 rounded-2xl px-3.5 py-2 flex items-center justify-between h-[48px] text-sm text-slate-800 dark:text-slate-200 select-none">
        <span className="font-semibold truncate">{value || "-"}</span>
        <div className="flex items-center gap-2">
          {value && (
            <button
              type="button"
              onClick={handleCopy}
              className="text-slate-400 hover:text-slate-200 p-1 hover:bg-white/5 rounded-lg active:scale-95 transition-all cursor-pointer border-none bg-transparent outline-none flex items-center justify-center"
              title="Copia negli appunti"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface FormProps {
  moduleId: string;
  initialData?: Record<string, unknown>;
  fieldsOrder?: string[];
  disabledFields?: string[];
  onSubmit: (data: Record<string, unknown>, idempotencyKey: string) => Promise<void>;
  submitLabel?: string;
  className?: string;
  t?: (key: string) => string;
}

export function Form({
  moduleId,
  initialData = {},
  fieldsOrder = [],
  disabledFields = [],
  onSubmit,
  submitLabel = "Salva",
  className = "",
  t
}: FormProps) {
  const { role, claims, loading: authLoading } = useClaims();
  const [isPending, setIsPending] = useState(false);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);

  // Rileva lingua dai claims (loc), fallback a "it"
  const lang = claims?.loc || "it";
  const tLocal = LOCALIZATION[lang]?.[moduleId] || LOCALIZATION["it"]?.[moduleId] || {};

  // Risolve la policy di sicurezza ed estrae i campi consentiti
  const policy = useMemo(() => {
    if (authLoading || !role) return null;
    
    // Ottiene il tipo di ruolo dell'organizzazione (buyer | seller | both) dall'app corrente "sso"
    const appRoles = claims?.orgRoles as Record<string, "buyer" | "seller" | "both"> | undefined;
    const orgContext = appRoles?.sso || "buyer";
    
    const activeUserRole = (role || "viewer") as "owner" | "admin" | "member" | "viewer" | "device";
    return getModulePolicyForContext(
      moduleId as keyof typeof MODULE_REGISTRY,
      activeUserRole,
      orgContext
    );
  }, [moduleId, role, claims, authLoading]);

  const allowedFields = useMemo(() => {
    return policy ? Array.from(policy.allowedFields) : [];
  }, [policy]);

  // Watch dei valori del form per la logica dei campi condizionali
  const {
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
    control
  } = useForm<Record<string, unknown>>({
    resolver: zodResolver(buildZodSchema(moduleId, allowedFields, fieldsOrder)),
    defaultValues: initialData
  });

  // Ripristina o imposta i dati quando initialData cambia asincronamente
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      reset(initialData);
    }
  }, [initialData, reset]);

  // Gestione del prompt "Dirty State" per avvisare di modifiche non salvate
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const watchedValues = useWatch({ control });

  // Determina la visibilità di un campo in base alle dipendenze
  const isFieldVisible = useCallback((fieldKey: string) => {
    if (FIELD_DEPENDENCIES[moduleId]) {
      const visibilityMap = FIELD_DEPENDENCIES[moduleId](watchedValues);
      if (visibilityMap[fieldKey] === false) {
        return false;
      }
    }
    return true;
  }, [moduleId, watchedValues]);

  // Filtra ed ordina i campi in base alle regole configurate
  const orderedFields = useMemo(() => {
    const visible = allowedFields.filter(isFieldVisible);
    const moduleConfig = getModuleInfo(moduleId);
    
    // 1. Se nel registro risorse sono specificati formFields, usiamo solo quelli (filtrati per autorizzazioni)
    const configFormFields = moduleConfig?.formFields;
    if (configFormFields && configFormFields.length > 0) {
      return configFormFields.filter(fieldKey => visible.includes(fieldKey));
    }
    
    // 2. Se non ci sono formFields ma viene passato fieldsOrder come prop, lo usiamo sia come filtro che come ordinamento
    if (fieldsOrder && fieldsOrder.length > 0) {
      return fieldsOrder.filter(fieldKey => visible.includes(fieldKey));
    }
    
    // 3. Altrimenti (fallback), filtriamo i campi con render !== false e li ordiniamo per order
    const filtered = visible.filter(fieldKey => {
      const fieldConfig = moduleConfig?.fields?.[fieldKey];
      return fieldConfig?.render !== false;
    });
    
    return [...filtered].sort((a, b) => {
      const fieldA = moduleConfig?.fields?.[a];
      const fieldB = moduleConfig?.fields?.[b];
      const orderA = fieldA?.order ?? 999;
      const orderB = fieldB?.order ?? 999;
      return orderA - orderB;
    });
  }, [allowedFields, fieldsOrder, moduleId, isFieldVisible]);

  if (authLoading) {
    return (
      <div className="flex justify-center p-6">
        <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-purple-500"></span>
      </div>
    );
  }

  if (!policy || (!policy.canCreate && !policy.canUpdate)) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-2xl border border-red-200 dark:border-red-900/50 text-xs font-bold flex items-center gap-2">
        <AlertCircle className="w-4 h-4" />
        <span>Non si dispone dei permessi necessari per compilare questo modulo.</span>
      </div>
    );
  }

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    setErrorAlert(null);
    setIsPending(true);

    const idempotencyKey = generateIdempotencyKey();

    try {
      const cleanedData: Record<string, unknown> = {};
      for (const fieldKey of orderedFields) {
        if (isFieldVisible(fieldKey) && allowedFields.includes(fieldKey)) {
          cleanedData[fieldKey] = data[fieldKey];
        }
      }

      await onSubmit(cleanedData, idempotencyKey);
    } catch (err) {
      console.error(err);
      setErrorAlert(err instanceof Error ? err.message : "Errore durante la sottomissione.");
    } finally {
      setIsPending(false);
    }
  };

  const moduleConfig = getModuleInfo(moduleId);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={`space-y-6 ${className}`}>
      {errorAlert && (
        <div className="p-4 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-2xl border border-red-200 dark:border-red-900/50 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorAlert}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orderedFields.map((fieldKey) => {
          const fields = moduleConfig?.fields;
          const field = fields?.[fieldKey];
          if (!field) return null;

          const isRequired = !!field.validation?.required;

          const defaultLabel = tLocal[fieldKey]?.label || fieldKey;
          const defaultPlaceholder = tLocal[fieldKey]?.placeholder || "";
          
          let resolvedLabel = defaultLabel;
          let resolvedPlaceholder = defaultPlaceholder;
          
          if (t) {
            const keyLabel = `fields.${fieldKey}.label`;
            const keyPlaceholder = `fields.${fieldKey}.placeholder`;
            const transLabel = t(keyLabel);
            const transPlaceholder = t(keyPlaceholder);
            if (transLabel !== keyLabel) resolvedLabel = transLabel;
            if (transPlaceholder !== keyPlaceholder) resolvedPlaceholder = transPlaceholder;
          }

          const colSpanClass = field.colSpan === 2 ? "col-span-1 md:col-span-2" : "col-span-1";

          // Rendering Premium per i campi disabilitati (eccetto Booleani)
          if (disabledFields.includes(fieldKey) && field.type !== "Boolean") {
            const staticValue = initialData && fieldKey in initialData && initialData[fieldKey] !== null && initialData[fieldKey] !== undefined
              ? String(initialData[fieldKey])
              : "-";
            return (
              <div key={fieldKey} className={colSpanClass}>
                <DisabledFieldWrapper
                  label={resolvedLabel}
                  value={staticValue}
                />
              </div>
            );
          }

          let inputContent = null;

          if (field.hidden) {
            inputContent = (
              <Controller
                name={fieldKey}
                control={control}
                render={({ field: { value } }) => (
                  <input
                    type="hidden"
                    value={value === undefined || value === null ? "" : String(value)}
                  />
                )}
              />
            );
          } else if (field.type === "Boolean") {
            inputContent = (
              <Controller
                name={fieldKey}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox
                    isSelected={!!value}
                    onChange={onChange}
                    isDisabled={isSubmitting || isPending}
                    className="pt-2"
                  >
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <span className="text-xs font-semibold text-slate-700 dark:text-gray-300">
                      {resolvedLabel}
                    </span>
                  </Checkbox>
                )}
              />
            );
          } else if (field.validation?.enum || tLocal[fieldKey]?.options) {
            let resolvedOptions: OptionItem[] = [];
            if (t) {
              const enumValues = (field.validation?.enum || []) as string[];
              resolvedOptions = enumValues.map(v => {
                const optKey = `fields.${fieldKey}.options.${v}`;
                const transOpt = t(optKey);
                return {
                  value: v,
                  label: transOpt !== optKey ? transOpt : v
                };
              });
            }
            if (resolvedOptions.length === 0) {
              resolvedOptions = (tLocal[fieldKey]?.options || (field.validation?.enum || []).map((v: string) => ({ value: v, label: v }))) as OptionItem[];
            }

            inputContent = (
              <Controller
                name={fieldKey}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Select
                    selectedKey={value as string}
                    onSelectionChange={(key) => onChange((key as string) || "")}
                    className="flex flex-col gap-1.5 w-full"
                    isDisabled={isSubmitting || isPending}
                  >
                    <Label className="text-xs font-bold text-slate-700 dark:text-gray-300">
                      {resolvedLabel} {isRequired && <span className="text-danger ml-0.5">*</span>}
                    </Label>
                    <SelectTrigger className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus-within:!border-primary focus-within:shadow-[0_0_12px_rgba(79,70,229,0.15)] rounded-2xl px-3.5 py-2 flex items-center justify-between h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full transition-all cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectPopover className="bg-slate-950 border border-slate-900 rounded-2xl shadow-2xl p-1.5 text-slate-200 min-w-[240px] z-50">
                      <ListBox className="space-y-1 outline-none">
                        {resolvedOptions.map((opt: OptionItem) => (
                          <ListBoxItem
                            key={opt.value}
                            id={opt.value}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors hover:bg-slate-900 hover:text-white outline-none"
                          >
                            {opt.label}
                          </ListBoxItem>
                        ))}
                      </ListBox>
                    </SelectPopover>
                  </Select>
                )}
              />
            );
          } else if (field.type === "Any") {
            inputContent = (
              <Controller
                name={fieldKey}
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField className="flex flex-col gap-1.5 w-full">
                    <Label className="text-xs font-bold text-slate-700 dark:text-gray-300">
                      {resolvedLabel} {isRequired && <span className="text-danger ml-0.5">*</span>}
                    </Label>
                    <Textarea
                      placeholder={resolvedPlaceholder}
                      disabled={isSubmitting || isPending}
                      value={value === undefined || value === null ? "" : (typeof value === "object" ? JSON.stringify(value) : (value as string))}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        const val = e.target.value;
                        onChange(val);
                      }}
                      onBlur={onBlur}
                      className={`bg-white/50 dark:bg-slate-950/40 border ${errors[fieldKey] ? "border-red-500 focus:border-red-500" : "border-slate-200 dark:border-white/10 focus:border-primary"} rounded-2xl px-3.5 py-2 flex items-center min-h-[80px] text-sm text-slate-900 dark:text-white outline-none w-full transition-all`}
                    />
                    {errors[fieldKey] && (
                      <span className="text-[10px] text-red-500 font-semibold mt-0.5">
                        {String(errors[fieldKey]?.message)}
                      </span>
                    )}
                  </TextField>
                )}
              />
            );
          } else {
            inputContent = (
              <Controller
                name={fieldKey}
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField className="flex flex-col gap-1.5 w-full">
                    <Label className="text-xs font-bold text-slate-700 dark:text-gray-300">
                      {resolvedLabel} {isRequired && <span className="text-danger ml-0.5">*</span>}
                    </Label>
                    <Input
                      type={field.type === "Float" ? "number" : "text"}
                      placeholder={resolvedPlaceholder}
                      disabled={isSubmitting || isPending}
                      value={value === undefined || value === null ? "" : (value as string)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const val = e.target.value;
                        if (field.type === "Float") {
                          onChange(val === "" ? "" : Number(val));
                        } else {
                          onChange(val);
                        }
                      }}
                      onBlur={onBlur}
                      className={`bg-white/50 dark:bg-slate-950/40 border ${errors[fieldKey] ? "border-red-500 focus:border-red-500" : "border-slate-200 dark:border-white/10 focus:border-primary"} rounded-2xl px-3.5 py-2 flex items-center h-[48px] text-sm text-slate-900 dark:text-white outline-none w-full transition-all`}
                    />
                    {errors[fieldKey] && (
                      <span className="text-[10px] text-red-500 font-semibold mt-0.5">
                        {String(errors[fieldKey]?.message)}
                      </span>
                    )}
                  </TextField>
                )}
              />
            );
          }

          return (
            <div key={fieldKey} className={field.hidden ? "hidden" : colSpanClass}>
              {inputContent}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          isDisabled={isSubmitting || isPending}
          variant="primary"
        >
          {isSubmitting || isPending ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-3.5 w-3.5 border-t-2 border-white"></span>
              Salvataggio...
            </span>
          ) : (
            <>
              <Save className="w-4 h-4" /> {submitLabel}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
