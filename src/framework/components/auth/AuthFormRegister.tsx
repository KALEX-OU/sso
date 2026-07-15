"use client";

import React from "react";
import {
  Building2,
  FileDigit,
  FileText,
  Fingerprint,
  GraduationCap,
  Hash,
  Landmark,
  Lock,
  Mail,
  MapPin,
  User as UserIcon,
} from "lucide-react";
import {
  Checkbox,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Select,
  SelectPopover,
  SelectTrigger,
  SelectValue,
} from "../ui";
import { AuthForm } from "./AuthForm";
import { useUIStrings } from "../../lib/ui.localization";

/**
 * Form di registrazione multi-tipo — card DS `auth/AuthFormRegister`.
 *
 * Presentazionale e controllato: la logica (RHF, VIES, Places, geo-IP) resta al
 * consumer; qui vivono SOLO campi coerenti (pill klx, icona per campo), la
 * visibilità per tipo account/paese e gli indicatori di stato VIES.
 */
export type RegisterAccountType = "personal" | "business" | "government" | "education";

export type RegisterTextField =
  | "fullName"
  | "email"
  | "password"
  | "vatNumber"
  | "companyName"
  | "sdiCode"
  | "officeCode"
  | "cigCode"
  | "cupCode";

export interface RegisterCountryOption {
  code: string;
  name: string;
  flag: string;
}

export type VatStatus = "idle" | "validating" | "verified" | "warning" | "offline";

export interface RegisterAddressProps {
  value: string;
  onChange: (value: string) => void;
  predictions: ReadonlyArray<{ description: string; placeId: string }>;
  onSelectPrediction: (prediction: { description: string; placeId: string }) => void;
  validating?: boolean;
}

export interface AuthFormRegisterProps {
  regType: RegisterAccountType;
  onTypeChange: (type: RegisterAccountType) => void;
  country: string;
  onCountryChange: (code: string) => void;
  countries: ReadonlyArray<RegisterCountryOption>;
  values: Record<RegisterTextField, string>;
  onFieldChange: (field: RegisterTextField, value: string) => void;
  acceptTerms: boolean;
  onAcceptTermsChange: (value: boolean) => void;
  errors?: Partial<Record<RegisterTextField | "country" | "acceptTerms", string>>;
  /** Stato della validazione VIES sulla P.IVA (solo tipi organizzazione). */
  vatStatus?: VatStatus;
  /** Ragione sociale arrivata dal VIES → campo bloccato. */
  nameFromVies?: boolean;
  /** Indirizzo attivo (residenza per privato, sede legale editabile per org). */
  address: RegisterAddressProps;
  /** Indirizzo sede legale arrivato dal VIES → textarea sola lettura al posto del campo. */
  lockedAddress?: string | null;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  /** Link a privacy/termini nel consenso (costruiti dalla pagina con la query
   *  OAuth preservata). Se assenti, il consenso resta testo semplice. */
  privacyHref?: string;
  termsHref?: string;
  loading?: boolean;
  canSubmit?: boolean;
  gradientClassName?: string;
  formRef?: React.Ref<HTMLFormElement>;
  className?: string;
}

/* Esempi di nome legati al PAESE fiscale (non sono stringhe UI da localizzare). */
const NAME_EXAMPLES: Record<string, string> = {
  IT: "Mario Rossi",
  ES: "Juan Pérez",
};

const strengthOf = (password: string): 0 | 1 | 2 | 3 => {
  if (password.length < 6) return 0;
  if (password.length < 10) return 1;
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/.test(password) ? 3 : 2;
};

const STRENGTH_BAR: Record<0 | 1 | 2 | 3, string> = {
  0: "w-[20%] bg-danger",
  1: "w-[50%] bg-warning",
  2: "w-[75%] bg-warning",
  3: "w-[100%] bg-success",
};

export const AuthFormRegister: React.FC<AuthFormRegisterProps> = ({
  regType,
  onTypeChange,
  country,
  onCountryChange,
  countries,
  values,
  onFieldChange,
  acceptTerms,
  onAcceptTermsChange,
  errors = {},
  vatStatus = "idle",
  nameFromVies = false,
  address,
  lockedAddress = null,
  onSubmit,
  privacyHref,
  termsHref,
  loading = false,
  canSubmit = true,
  gradientClassName,
  formRef,
  className = "",
}) => {
  const s = useUIStrings();
  const r = s.auth.register;
  const isPersonal = regType === "personal";
  const strength = strengthOf(values.password);

  const typeLabel: Record<RegisterAccountType, string> = {
    personal: r.typePersonal,
    business: r.typeBusiness,
    government: r.typeGovernment,
    education: r.typeEducation,
  };

  const companyIcon =
    regType === "government" ? <Landmark className="w-4 h-4" /> :
    regType === "education" ? <GraduationCap className="w-4 h-4" /> :
    <Building2 className="w-4 h-4" />;

  const vatSuffix =
    vatStatus === "validating" ? (
      <span className="animate-spin rounded-full h-4 w-4 border-2 border-secondary border-t-transparent"></span>
    ) : vatStatus === "verified" ? (
      <span className="flex items-center text-success">
        <span className="flex h-2 w-2 relative me-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
        </span>
        <svg className="h-4 w-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    ) : vatStatus === "warning" ? (
      <svg className="h-4 w-4 stroke-[3] text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ) : undefined;

  const vatStateClass =
    vatStatus === "verified" ? "klx-input--success" : vatStatus === "warning" ? "klx-input--warning" : "";

  const vatLabel = isPersonal
    ? (country === "IT" ? r.vatNumberPersonalIT : country === "ES" ? r.vatNumberPersonalES : r.vatNumberPersonalGeneric)
    : (country === "IT" ? r.vatNumberIT : country === "ES" ? r.vatNumberES : r.vatNumberGeneric);

  const vatPlaceholder = isPersonal
    ? (country === "IT" ? r.vatNumberPersonalPlaceholderIT : country === "ES" ? r.vatNumberPersonalPlaceholderES : r.vatNumberPersonalPlaceholderGeneric)
    : `${country}123456789`;

  const companyLabel =
    regType === "government" ? r.companyNameGovernment :
    regType === "education" ? r.companyNameEducation :
    r.companyNameBusiness;

  const companyPlaceholder =
    regType === "government" ? r.companyNamePlaceholderGovernment :
    regType === "education" ? r.companyNamePlaceholderEducation :
    r.companyNamePlaceholderBusiness;

  const countrySelect = (label: string) => (
    <Select
      selectedKey={country}
      onSelectionChange={(key: string | number | null) => {
        const code = countries.find((c) => c.code === key)?.code;
        if (code) onCountryChange(code);
      }}
      isInvalid={!!errors.country}
      className="flex flex-col gap-1.5 w-full"
    >
      <Label className="klx-label">{label}</Label>
      <SelectTrigger className="klx-select-trigger">
        <SelectValue />
      </SelectTrigger>
      <SelectPopover className="klx-select-popover">
        <ListBox className="outline-none">
          {/* Item SENZA classi: layout/tipografia/stati = standard HeroUI
              (.list-box-item); solo l'emoji bandiera ha una taglia sua. */}
          {countries.map((c) => (
            <ListBoxItem id={c.code} key={c.code} textValue={`${c.flag} ${c.name}`}>
              <span className="text-base leading-none">{c.flag}</span>
              <span>{c.name} ({c.code})</span>
            </ListBoxItem>
          ))}
        </ListBox>
      </SelectPopover>
      {errors.country && (
        <span className="text-[10px] text-danger font-semibold mt-0.5">{errors.country}</span>
      )}
    </Select>
  );

  const addressInput = (label: string) => (
    <div className="flex flex-col gap-1.5 w-full relative">
      <Input
        type="text"
        name="address"
        label={label}
        placeholder={r.addressPlaceholder}
        icon={<MapPin className="w-4 h-4" />}
        suffix={address.validating ? (
          <span className="animate-spin rounded-full h-4 w-4 border-2 border-secondary border-t-transparent"></span>
        ) : undefined}
        value={address.value}
        onValueChange={address.onChange}
      />
      {address.predictions.length > 0 && (
        <div className="absolute top-full mt-1 start-0 end-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-1.5 z-50 max-h-[180px] overflow-y-auto">
          <ul className="outline-none space-y-0.5">
            {address.predictions.map((pred) => (
              <li
                key={pred.placeId}
                onClick={() => address.onSelectPrediction(pred)}
                className="w-full text-start px-3 py-2 rounded-xl transition-colors flex items-center gap-2 cursor-pointer text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5"
              >
                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{pred.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <AuthForm
      onSubmit={onSubmit}
      submitLabel={r.register}
      loading={loading}
      canSubmit={canSubmit}
      gradientClassName={gradientClassName}
      formRef={formRef}
      className={className}
    >
      {/* Tipo di account */}
      <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-slate-950/50 rounded-2xl border border-slate-200/50 dark:border-white/5 mb-2">
        {(["personal", "business", "government", "education"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onTypeChange(type)}
            className={`py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all capitalize cursor-pointer ${
              regType === type
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-white/5"
                : "text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            {typeLabel[type]}
          </button>
        ))}
      </div>

      {/* Nome completo */}
      <Input
        type="text"
        name="fullName"
        autoComplete="name"
        label={r.name}
        placeholder={NAME_EXAMPLES[country] ?? "John Doe"}
        icon={<UserIcon className="w-4 h-4" />}
        value={values.fullName}
        onValueChange={(v) => onFieldChange("fullName", v)}
        error={errors.fullName}
      />

      {/* Email */}
      <Input
        type="email"
        name="email"
        autoComplete="username"
        label={s.auth.emailLabel}
        placeholder={s.auth.emailPlaceholder}
        icon={<Mail className="w-4 h-4" />}
        value={values.email}
        onValueChange={(v) => onFieldChange("email", v)}
        error={errors.email}
      />

      {/* Password + misuratore di robustezza */}
      <div>
        <Input
          type="password"
          name="password"
          autoComplete="new-password"
          label={s.auth.passwordLabel}
          placeholder={s.auth.passwordPlaceholder}
          icon={<Lock className="w-4 h-4" />}
          value={values.password}
          onValueChange={(v) => onFieldChange("password", v)}
          error={errors.password}
        />
        {values.password.length > 0 && (
          <div className="mt-2 space-y-1 px-1">
            <div className="flex justify-between text-[10px] font-semibold text-slate-500">
              <span>{r.passwordStrength}</span>
              <span>
                {strength === 0 ? r.passwordTooShort : strength === 1 ? r.passwordWeak : strength === 3 ? r.passwordStrong : r.passwordMedium}
              </span>
            </div>
            <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-300 ${STRENGTH_BAR[strength]}`}></div>
            </div>
          </div>
        )}
      </div>

      {isPersonal ? (
        <>
          {/* Privato: nazione fiscale, CF/NIF opzionale, indirizzo di residenza */}
          {countrySelect(r.fiscalCountry)}

          <Input
            type="text"
            name="vatNumber"
            label={vatLabel}
            placeholder={vatPlaceholder}
            icon={<Fingerprint className="w-4 h-4" />}
            value={values.vatNumber}
            onValueChange={(v) => onFieldChange("vatNumber", v)}
            error={errors.vatNumber}
          />

          {addressInput(r.residenceAddress)}
        </>
      ) : (
        /* Organizzazione: box dettagli con VIES */
        <div className="space-y-4 p-4 bg-slate-100/50 dark:bg-slate-950/30 border border-slate-200 dark:border-white/5 rounded-2xl mt-4 animate-in fade-in duration-300">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
            {r.orgDetails} ({typeLabel[regType]})
          </h3>

          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 sm:col-span-5">{countrySelect(r.country)}</div>
            <div className="col-span-12 sm:col-span-7">
              <Input
                type="text"
                name="vatNumber"
                label={vatLabel}
                placeholder={vatPlaceholder}
                icon={<FileDigit className="w-4 h-4" />}
                suffix={vatSuffix}
                className={vatStateClass}
                value={values.vatNumber}
                onValueChange={(v) => onFieldChange("vatNumber", v)}
                error={errors.vatNumber}
              />
            </div>
          </div>

          {vatStatus === "verified" && (
            <div className="text-[10px] text-success font-bold uppercase tracking-wider mt-1 flex items-center gap-1.5 animate-in fade-in duration-300">
              <span className="flex h-1.5 w-1.5 rounded-full bg-success"></span>
              {r.viesValidated}
            </div>
          )}

          {vatStatus === "warning" && (
            <div className="text-[10px] text-warning font-bold uppercase tracking-wider mt-1 flex items-start gap-1.5 animate-in fade-in duration-300 leading-normal max-w-xl">
              <span className="flex h-1.5 w-1.5 rounded-full bg-warning shrink-0 mt-1"></span>
              <span>{r.vatWarningInfo}</span>
            </div>
          )}

          {vatStatus === "offline" && (
            <div className="bg-warning/15 dark:bg-warning/10 border border-warning/40 dark:border-warning/20 text-warning rounded-xl p-3 text-xs flex items-start gap-2">
              <svg className="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="font-bold">{r.viesOfflineWarning}</p>
            </div>
          )}

          {/* Denominazione e sede legale: visibili dopo la validazione (o VIES offline) */}
          {(vatStatus === "verified" || vatStatus === "warning" || vatStatus === "offline") && (
            <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Input
                type="text"
                name="companyName"
                label={companyLabel}
                placeholder={companyPlaceholder}
                icon={companyIcon}
                readOnly={vatStatus === "verified" && nameFromVies}
                className={vatStatus === "verified" && nameFromVies ? "klx-input--locked" : ""}
                value={values.companyName}
                onValueChange={(v) => onFieldChange("companyName", v)}
                error={errors.companyName}
              />

              {lockedAddress ? (
                <div className="space-y-1">
                  <label className="klx-label block">{r.legalAddress}</label>
                  <textarea
                    rows={2}
                    readOnly
                    value={lockedAddress}
                    className="w-full px-4 py-3 border rounded-xl text-sm bg-slate-100 dark:bg-slate-950/50 border-slate-200 dark:border-white/5 text-slate-500 cursor-not-allowed resize-none focus:outline-none"
                  />
                </div>
              ) : (
                addressInput(r.legalAddress)
              )}
            </div>
          )}

          {/* Campi specifici per l'Italia */}
          {country === "IT" && regType === "business" && (
            <Input
              type="text"
              name="sdiCode"
              maxLength={7}
              label={r.sdiCode}
              placeholder={r.sdiPlaceholder}
              icon={<Hash className="w-4 h-4" />}
              value={values.sdiCode}
              onValueChange={(v) => onFieldChange("sdiCode", v)}
              error={errors.sdiCode}
            />
          )}

          {country === "IT" && regType === "government" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <Input
                type="text"
                name="officeCode"
                maxLength={6}
                label={r.officeCode}
                placeholder={r.officePlaceholder}
                icon={<Hash className="w-4 h-4" />}
                value={values.officeCode}
                onValueChange={(v) => onFieldChange("officeCode", v)}
                error={errors.officeCode}
              />
              <Input
                type="text"
                name="cigCode"
                label={r.cigCode}
                placeholder="CIG"
                icon={<FileText className="w-4 h-4" />}
                value={values.cigCode}
                onValueChange={(v) => onFieldChange("cigCode", v)}
                error={errors.cigCode}
              />
              <div className="sm:col-span-2">
                <Input
                  type="text"
                  name="cupCode"
                  label={r.cupCode}
                  placeholder="CUP"
                  icon={<FileText className="w-4 h-4" />}
                  value={values.cupCode}
                  onValueChange={(v) => onFieldChange("cupCode", v)}
                  error={errors.cupCode}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Accettazione termini */}
      <div className="flex flex-col gap-1 w-full">
        <div className="mt-4 flex items-center">
          <Checkbox
            isSelected={acceptTerms}
            onChange={onAcceptTermsChange}
            className="text-xs text-slate-600 dark:text-slate-400 select-none cursor-pointer flex items-center gap-3"
          >
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Content>
              <Label className="text-xs text-slate-600 dark:text-slate-400 select-none cursor-pointer">
                {privacyHref && termsHref ? (
                  <>
                    {r.acceptTermsPrefix}{" "}
                    <a
                      href={privacyHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold hover:text-secondary"
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      {r.privacyPolicy}
                    </a>{" "}
                    {r.acceptTermsConj}{" "}
                    <a
                      href={termsHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold hover:text-secondary"
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      {r.termsOfService}
                    </a>
                    {r.acceptTermsSuffix}
                  </>
                ) : (
                  r.acceptTerms
                )}
              </Label>
            </Checkbox.Content>
          </Checkbox>
        </div>
        {errors.acceptTerms && (
          <p className="text-[11px] font-medium text-danger block mt-1">{errors.acceptTerms}</p>
        )}
      </div>

    </AuthForm>
  );
};

AuthFormRegister.displayName = "AuthFormRegister";
