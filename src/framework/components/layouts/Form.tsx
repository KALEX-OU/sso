"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, AlertCircle, Copy, Check } from "lucide-react";
import { Button, Input, TextField, Label, Textarea, Select, SelectTrigger, SelectValue, SelectPopover, ListBox, ListBoxItem, Checkbox } from "../ui";
import { useClaims } from "../../lib/auth";
import { MODULE_REGISTRY, getModulePolicyForContext, getModuleInfo } from "../../lib/resources.config";
import { LOCALIZATION, type OptionItem } from "./form.localization";
import { FIELD_DEPENDENCIES } from "./form.dependencies";

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
        <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-violet-500"></span>
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
