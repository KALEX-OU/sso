"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, AlertCircle } from "lucide-react";
import { Button } from "../ui";
import { useClaims } from "../../lib/auth";
import { MODULE_REGISTRY, getModulePolicyForContext, getModuleInfo } from "../../lib/resources.config";
import { LOCALIZATION } from "./form.localization";
import { FIELD_DEPENDENCIES } from "./form.dependencies";
import { FieldRenderer } from "./FieldRenderer";
import { useUIStrings, fmtUI, type UIStrings } from "../../lib/ui.localization";

// Generatore Zod dinamico (messaggi di validazione localizzati via `v`)
function buildZodSchema(moduleId: string, allowedFields: string[], fieldsOrder: string[], v: UIStrings["validation"]): z.ZodObject<Record<string, z.ZodTypeAny>> {
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
      fieldSchema = z.number({ message: v.number });
    } else if (field.type === "Timestamp") {
      fieldSchema = z.string().or(z.date());
    } else if (field.type === "Any") {
      fieldSchema = z.unknown();
    }

    const val = field.validation || {};

    if (fieldSchema instanceof z.ZodString) {
      // Applica PRIMA tutte le rifiniture di stringa (mentre è ancora una ZodString),
      // POI required/optional. Se si rendesse optional prima, `fieldSchema` diventerebbe
      // una ZodUnion e le successive .regex()/.min()/.email() lancerebbero
      // "TypeError: regex is not a function" (crash su campi opzionali con format, es. P.IVA/SDI).
      let strSchema: z.ZodString = fieldSchema;

      if (val.min) {
        strSchema = strSchema.min(val.min, fmtUI(v.min, { n: val.min }));
      }
      if (val.max) {
        strSchema = strSchema.max(val.max, fmtUI(v.max, { n: val.max }));
      }
      if (val.email) {
        strSchema = strSchema.email(v.email);
      }
      if (val.format === "vat") {
        strSchema = strSchema.regex(/^[A-Z0-9]{2,15}$/i, v.vat);
      }
      if (val.format === "personal_id") {
        strSchema = strSchema.regex(/^[A-Z0-9]{16}$/i, v.personalId);
      }
      if (val.format === "sdi") {
        strSchema = strSchema.regex(/^[A-Z0-9]{7}$/i, v.sdi);
      }

      // required/optional/enum vanno applicati PER ULTIMI (cambiano il tipo dello schema).
      if (val.enum) {
        fieldSchema = z.enum(val.enum as [string, ...string[]]);
      } else if (val.required) {
        fieldSchema = strSchema.min(1, v.required);
      } else {
        fieldSchema = strSchema.optional().or(z.literal(""));
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
  submitLabel,
  className = "",
  t
}: FormProps) {
  const { role, claims, loading: authLoading } = useClaims();
  const s = useUIStrings();
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
    resolver: zodResolver(buildZodSchema(moduleId, allowedFields, fieldsOrder, s.validation)),
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
        <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-secondary"></span>
      </div>
    );
  }

  if (!policy || (!policy.canCreate && !policy.canUpdate)) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-2xl border border-red-200 dark:border-red-900/50 text-xs font-bold flex items-center gap-2">
        <AlertCircle className="w-4 h-4" />
        <span>{s.form.noPermission}</span>
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
      setErrorAlert(err instanceof Error ? err.message : s.form.submitError);
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

          // E4.3a: lo switch di rendering del singolo campo è estratto in FieldRenderer.tsx
          return (
            <FieldRenderer
              key={fieldKey}
              fieldKey={fieldKey}
              field={field}
              control={control}
              errors={errors}
              isBusy={isSubmitting || isPending}
              isDisabledField={disabledFields.includes(fieldKey)}
              initialData={initialData}
              tLocalEntry={tLocal[fieldKey]}
              t={t}
            />
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
              <Save className="w-4 h-4" /> {submitLabel ?? s.common.save}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
