"use client";

import React, { useState } from "react";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { Copy, Check } from "lucide-react";
import { Input, TextField, Label, Textarea, Select, SelectTrigger, SelectValue, SelectPopover, ListBox, ListBoxItem, Checkbox } from "../ui";
import type { FieldConfig } from "../../lib/resources.config";
import type { OptionItem } from "./form.localization";
import { useUIStrings } from "../../lib/ui.localization";

// E4.3a — Renderer di un singolo campo del Form dinamico, estratto meccanicamente da Form.tsx.
// Contiene lo switch di rendering (Boolean/Select/Textarea/Input/hidden) basato su Controller
// di react-hook-form, il rendering premium dei campi disabilitati (DisabledFieldWrapper) e la
// risoluzione delle etichette (i18n via `t` con fallback alla localizzazione statica del modulo).

interface DisabledFieldWrapperProps {
  label: string;
  value: string;
}

function DisabledFieldWrapper({ label, value }: DisabledFieldWrapperProps) {
  const s = useUIStrings();
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
              title={s.common.copyToClipboard}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-success" />
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

// Voce di localizzazione statica del campo (stessa forma delle entry di LOCALIZATION).
interface FieldLocalizationEntry {
  label: string;
  placeholder?: string;
  options?: OptionItem[];
}

export interface FieldRendererProps {
  fieldKey: string;
  field: FieldConfig;
  control: Control<Record<string, unknown>>;
  errors: FieldErrors<Record<string, unknown>>;
  /** true durante submit/pending del form: disabilita gli input */
  isBusy: boolean;
  /** true se il campo è elencato in disabledFields (rendering statico premium) */
  isDisabledField: boolean;
  initialData: Record<string, unknown>;
  tLocalEntry?: FieldLocalizationEntry;
  t?: (key: string) => string;
}

export function FieldRenderer({
  fieldKey,
  field,
  control,
  errors,
  isBusy,
  isDisabledField,
  initialData,
  tLocalEntry,
  t
}: FieldRendererProps) {
  const isRequired = !!field.validation?.required;

  const defaultLabel = tLocalEntry?.label || fieldKey;
  const defaultPlaceholder = tLocalEntry?.placeholder || "";

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
  if (isDisabledField && field.type !== "Boolean") {
    const staticValue = initialData && fieldKey in initialData && initialData[fieldKey] !== null && initialData[fieldKey] !== undefined
      ? String(initialData[fieldKey])
      : "-";
    return (
      <div className={colSpanClass}>
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
            isDisabled={isBusy}
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
  } else if (field.validation?.enum || tLocalEntry?.options) {
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
      resolvedOptions = (tLocalEntry?.options || (field.validation?.enum || []).map((v: string) => ({ value: v, label: v }))) as OptionItem[];
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
            isDisabled={isBusy}
          >
            <Label className="text-xs font-bold text-slate-700 dark:text-gray-300">
              {resolvedLabel} {isRequired && <span className="text-danger ms-0.5">*</span>}
            </Label>
            <SelectTrigger className="klx-select-trigger">
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
              {resolvedLabel} {isRequired && <span className="text-danger ms-0.5">*</span>}
            </Label>
            <Textarea
              aria-label={resolvedLabel}
              placeholder={resolvedPlaceholder}
              disabled={isBusy}
              value={value === undefined || value === null ? "" : (typeof value === "object" ? JSON.stringify(value) : (value as string))}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                const val = e.target.value;
                onChange(val);
              }}
              onBlur={onBlur}
              className={`bg-surface-2 border ${errors[fieldKey] ? "border-red-500 focus:border-red-500" : "border-line focus:border-primary"} rounded-2xl px-3.5 py-2 flex items-center min-h-[80px] text-sm text-ink outline-none w-full transition-all`}
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
              {resolvedLabel} {isRequired && <span className="text-danger ms-0.5">*</span>}
            </Label>
            <Input
              type={field.type === "Float" ? "number" : "text"}
              aria-label={resolvedLabel}
              placeholder={resolvedPlaceholder}
              disabled={isBusy}
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
              className={errors[fieldKey] ? "klx-input--error" : ""}
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
    <div className={field.hidden ? "hidden" : colSpanClass}>
      {inputContent}
    </div>
  );
}
