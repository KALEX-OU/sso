"use client";

/**
 * AUTH v1.2 — pagina di REGISTRAZIONE (docs/AUTH_V1_2_PLAN.md).
 *
 * Route dedicata: qui vivono RHF + VIES + Places + geo-IP + persistenza
 * sessionStorage e la creazione account; la UI è del componente DS
 * AuthFormRegister dentro la shell condivisa. L'avviso "verifica email"
 * post-signup è uno step in pagina (AuthVerifyNotice).
 */

import React, { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { auth, fetchWithAppCheck } from "@/lib/firebase/client";
import { signOut } from "firebase/auth";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalLoader } from "@/framework/components/ui";
import {
  AuthFormRegister,
  RegisterAccountType,
  RegisterTextField,
} from "@/framework/components/auth/AuthFormRegister";
import { AuthVerifyNotice } from "@/framework/components/auth/AuthVerifyNotice";
import { useI18n, useCurrentLocale } from "@/locales/client";
import {
  RegisterSchema,
  RegisterInput,
  EU_COUNTRIES,
  EU_COUNTRY_NAMES,
  EU_COUNTRY_FLAGS,
  validateVatNumber,
} from "@/lib/validation/auth";
import { AuthPortalShell, preserveAuthQuery, useAuthBrand } from "../_shared/auth-portal";

function RegisterPortal() {
  const t = useI18n();
  const currentLocale = useCurrentLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { gradient } = useAuthBrand();
  const authQuery = preserveAuthQuery(searchParams);

  const getErrorMessage = useCallback((errorObj?: { message?: string }) => {
    if (!errorObj || !errorObj.message) return "";
    if (errorObj.message.startsWith("validation.")) {
      return t(errorObj.message as Parameters<typeof t>[0]);
    }
    return errorObj.message;
  }, [t]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");

  const [isVatValidating, setIsVatValidating] = useState(false);
  const [viesAddress, setViesAddress] = useState("");
  const [isVatVerified, setIsVatVerified] = useState(false);
  const [isViesOffline, setIsViesOffline] = useState(false);
  const [isVatWarning, setIsVatWarning] = useState(false);
  const [isNameFromVies, setIsNameFromVies] = useState(false);
  const [isAddressFromVies, setIsAddressFromVies] = useState(false);
  const [vatCoordinates, setVatCoordinates] = useState<{ latitude: number; longitude: number; altitude: number | null } | null>(null);
  const geoFetchingRef = useRef(false);

  // Google Places Autocomplete (New)
  const [addressPredictions, setAddressPredictions] = useState<Array<{ description: string; placeId: string }>>([]);
  const [isAddressValidating, setIsAddressValidating] = useState(false);
  const [manualAddressInput, setManualAddressInput] = useState("");
  const [selectedAddressDetails, setSelectedAddressDetails] = useState<unknown>(null);

  const registerFormRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    let active = true;
    setTimeout(() => {
      if (active) setMounted(true);
    }, 0);
    return () => {
      active = false;
    };
  }, []);

  const {
    handleSubmit: handleSubmitReg,
    setValue: setValueReg,
    setError: setErrorReg,
    control: controlReg,
    formState: { errors: errorsReg, isValid: isValidReg },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
    defaultValues: {
      regType: "personal",
      country: currentLocale === "es" ? "ES" : "IT",
      acceptTerms: false,
      fullName: "",
      email: "",
      password: "",
      companyName: "",
      vatNumber: "",
      sdiCode: "",
      officeCode: "",
      cigCode: "",
      cupCode: "",
    },
  });

  // Sync degli eventi nativi (autofill) con RHF
  useEffect(() => {
    const formEl = registerFormRef.current;
    if (!formEl) return;

    // SOLO i campi registrati in RHF: il listener serve a sincronizzare
    // l'autofill del browser. Campi non-RHF (es. indirizzo, stato locale React)
    // NON vanno toccati: il setValue fantasma innesca un re-render che
    // ripristina il valore del controlled input PRIMA che React dispatci
    // l'onChange → i caratteri digitati spariscono (bug campo indirizzo).
    const RHF_TEXT_FIELDS = new Set<keyof RegisterInput>([
      "fullName", "email", "password", "vatNumber", "companyName",
      "sdiCode", "officeCode", "cigCode", "cupCode",
    ]);
    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const name = target?.name as keyof RegisterInput | undefined;
      if (name && RHF_TEXT_FIELDS.has(name)) {
        setValueReg(name, target.value, { shouldValidate: true, shouldDirty: true });
      }
    };

    formEl.addEventListener("input", handleNativeInput);
    formEl.addEventListener("change", handleNativeInput);
    return () => {
      formEl.removeEventListener("input", handleNativeInput);
      formEl.removeEventListener("change", handleNativeInput);
    };
  }, [setValueReg, mounted, needsVerification]);

  const regType = useWatch({ control: controlReg, name: "regType" }) || "personal";
  const country = useWatch({ control: controlReg, name: "country" }) || "IT";
  const passwordReg = useWatch({ control: controlReg, name: "password" }) || "";
  const vatNumberValue = useWatch({ control: controlReg, name: "vatNumber" }) || "";
  const emailRegValue = useWatch({ control: controlReg, name: "email" }) || "";
  const fullNameRegValue = useWatch({ control: controlReg, name: "fullName" }) || "";
  const companyNameValueW = useWatch({ control: controlReg, name: "companyName" }) || "";
  const sdiCodeValue = useWatch({ control: controlReg, name: "sdiCode" }) || "";
  const officeCodeValue = useWatch({ control: controlReg, name: "officeCode" }) || "";
  const cigCodeValue = useWatch({ control: controlReg, name: "cigCode" }) || "";
  const cupCodeValue = useWatch({ control: controlReg, name: "cupCode" }) || "";
  const acceptTermsValue = useWatch({ control: controlReg, name: "acceptTerms" }) || false;

  // Geo-IP per il paese di default (una sola volta per sessione)
  useEffect(() => {
    if (mounted && !geoFetchingRef.current) {
      geoFetchingRef.current = true;
      fetchWithAppCheck("/api/geolocation/ip")
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data === "object" && "country_code" in data && typeof data.country_code === "string") {
            const detectedCountry = data.country_code.toUpperCase();
            const isEU = EU_COUNTRIES.includes(detectedCountry as typeof EU_COUNTRIES[number]);
            if (isEU) {
              const geoInitialized = sessionStorage.getItem("sso_geo_initialized");
              if (!geoInitialized) {
                setValueReg("country", detectedCountry as typeof EU_COUNTRIES[number]);
                sessionStorage.setItem("sso_geo_initialized", "true");
              }
            }
          }
        })
        .catch((err) => {
          console.warn("[Locale Trace] Errore rilevamento Geo-IP (ignorato):", err);
          geoFetchingRef.current = false;
        });
    }
  }, [mounted, setValueReg]);

  // Ripristino del form da sessionStorage
  useEffect(() => {
    if (!mounted) return;
    const saved = sessionStorage.getItem("sso_register_form");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<RegisterInput>;
        if (parsed.fullName) setValueReg("fullName", parsed.fullName);
        if (parsed.email) setValueReg("email", parsed.email);
        if (parsed.regType) setValueReg("regType", parsed.regType);
        if (parsed.country) setValueReg("country", parsed.country);
        if (parsed.companyName) setValueReg("companyName", parsed.companyName);
        if (parsed.vatNumber) setValueReg("vatNumber", parsed.vatNumber);
        if (parsed.sdiCode) setValueReg("sdiCode", parsed.sdiCode);
        if (parsed.officeCode) setValueReg("officeCode", parsed.officeCode);
        if (parsed.cigCode) setValueReg("cigCode", parsed.cigCode);
        if (parsed.cupCode) setValueReg("cupCode", parsed.cupCode);
      } catch (e) {
        console.warn("Failed to load saved form", e);
      }
    }
    const savedViesAddress = sessionStorage.getItem("sso_vies_address");
    const savedManualAddress = sessionStorage.getItem("sso_manual_address");
    const savedCoordinates = sessionStorage.getItem("sso_vat_coordinates");

    setTimeout(() => {
      if (savedViesAddress) setViesAddress(savedViesAddress);
      if (savedManualAddress) setManualAddressInput(savedManualAddress);
      if (savedCoordinates) {
        try {
          setVatCoordinates(JSON.parse(savedCoordinates) as {
            latitude: number;
            longitude: number;
            altitude: number | null;
          } | null);
        } catch {
          // Ignora
        }
      }
    }, 0);
  }, [mounted, setValueReg]);

  // Persistenza degli stati indirizzo
  useEffect(() => {
    if (mounted) {
      sessionStorage.setItem("sso_vies_address", viesAddress);
      sessionStorage.setItem("sso_manual_address", manualAddressInput);
      if (vatCoordinates) {
        sessionStorage.setItem("sso_vat_coordinates", JSON.stringify(vatCoordinates));
      } else {
        sessionStorage.removeItem("sso_vat_coordinates");
      }
    }
  }, [viesAddress, manualAddressInput, vatCoordinates, mounted]);

  // Salvataggio automatico del form
  const registerValues = useWatch({ control: controlReg });
  useEffect(() => {
    if (mounted) {
      sessionStorage.setItem("sso_register_form", JSON.stringify(registerValues));
    }
  }, [registerValues, mounted]);

  const handleVatAutoFill = useCallback(async (vat: string, cCode: typeof EU_COUNTRIES[number]) => {
    if (!vat || vat.length < 5) return;
    const cleanVat = vat.replace(/[\s-]/g, "").toUpperCase();
    setIsVatValidating(true);
    setIsVatVerified(false);
    setIsVatWarning(false);
    setIsViesOffline(false);
    setIsNameFromVies(false);
    setIsAddressFromVies(false);
    setVatCoordinates(null);
    try {
      const response = await fetchWithAppCheck(`/api/auth/vies?vat=${encodeURIComponent(cleanVat)}&country=${cCode}`);
      if (response.ok) {
        const data = (await response.json()) as {
          isValid: boolean;
          name?: string;
          address?: string;
          isOffline?: boolean;
          coordinates?: { latitude: number; longitude: number; altitude: number | null } | null;
        };
        if (data.isOffline) {
          setIsViesOffline(true);
          setValueReg("companyName", "");
          setViesAddress("");
          setVatCoordinates(null);
        } else if (data.isValid) {
          setIsVatVerified(true);
          setVatCoordinates(data.coordinates || null);

          if (data.name && data.name !== "---") {
            setValueReg("companyName", data.name, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            setIsNameFromVies(true);
          } else {
            setIsNameFromVies(false);
          }

          if (data.address && data.address !== "---") {
            setViesAddress(data.address);
            setIsAddressFromVies(true);
          } else {
            setIsAddressFromVies(false);
          }
        } else {
          setIsVatVerified(false);
          setIsVatWarning(true);
          setViesAddress("");
          setVatCoordinates(null);
        }
      }
    } catch (err) {
      console.warn("VIES Autocompilation check failed:", err);
      setIsViesOffline(true);
      setVatCoordinates(null);
    } finally {
      setIsVatValidating(false);
    }
  }, [setValueReg, setVatCoordinates]);

  const fetchAddressPredictions = useCallback(async (query: string, cCode: string) => {
    if (!query || query.trim().length < 3) {
      setAddressPredictions([]);
      return;
    }
    try {
      const response = await fetchWithAppCheck("/api/geolocation/autocomplete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: query, country: cCode }),
      });
      if (response.ok) {
        const data = (await response.json()) as { success: boolean; predictions: Array<{ description: string; placeId: string }> };
        if (data.success) {
          setAddressPredictions(data.predictions);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch address predictions:", err);
    }
  }, []);

  const handleSelectAddress = useCallback(async (addressText: string, cCode: string, placeId?: string) => {
    setAddressPredictions([]);
    setIsAddressValidating(true);
    try {
      if (placeId) {
        const response = await fetchWithAppCheck(`/api/geolocation/details?placeId=${placeId}`);
        if (response.ok) {
          const data = (await response.json()) as {
            success: boolean;
            details: {
              id: string;
              formattedAddress: string;
              addressComponents: unknown[];
              location: { latitude: number; longitude: number };
            };
          };
          if (data.success && data.details) {
            setVatCoordinates({
              latitude: data.details.location.latitude,
              longitude: data.details.location.longitude,
              altitude: null,
            });
            const formatted = data.details.formattedAddress || addressText;
            if (regType === "personal") {
              setManualAddressInput(formatted);
            } else {
              setViesAddress(formatted);
            }
            setSelectedAddressDetails(data.details);
            return;
          }
        }
      }

      const response = await fetchWithAppCheck(`/api/geolocation/geocode?address=${encodeURIComponent(addressText)}&country=${cCode}`);
      if (response.ok) {
        const data = (await response.json()) as {
          success: boolean;
          formattedAddress: string;
          coordinates: { latitude: number; longitude: number; altitude: number | null } | null;
        };
        if (data.success && data.coordinates) {
          setVatCoordinates(data.coordinates);
          const formatted = data.formattedAddress || addressText;
          if (regType === "personal") {
            setManualAddressInput(formatted);
          } else {
            setViesAddress(formatted);
          }
          setSelectedAddressDetails(null);
        }
      }
    } catch (err) {
      console.warn("Address geocoding failed:", err);
    } finally {
      setIsAddressValidating(false);
    }
  }, [regType]);

  // Validazione VIES debounced sul cambio P.IVA
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!vatNumberValue || vatNumberValue.trim() === "") {
        setIsVatVerified(false);
        setIsVatWarning(false);
        setIsViesOffline(false);
        setIsNameFromVies(false);
        setIsAddressFromVies(false);
        setViesAddress("");
        return;
      }

      if (regType !== "personal" && validateVatNumber(vatNumberValue, country)) {
        handleVatAutoFill(vatNumberValue, country);
      } else {
        setIsVatVerified(false);
        setIsVatWarning(false);
        setIsViesOffline(false);
        setIsNameFromVies(false);
        setIsAddressFromVies(false);
        setViesAddress("");
      }
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [vatNumberValue, country, regType, handleVatAutoFill]);

  const handleResendVerification = async () => {
    setError("");
    setResendLoading(true);
    try {
      if (auth.currentUser) {
        const idToken = await auth.currentUser.getIdToken();
        const response = await fetchWithAppCheck("/api/auth/send-verification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
          },
        });
        const resData = await response.json();
        if (response.ok && resData.success) {
          setResendSuccess("Email di verifica inviata con successo!");
          setTimeout(() => setResendSuccess(""), 5000);
        } else {
          const errCode = (resData.error && typeof resData.error === "object" && "message" in resData.error && typeof resData.error.message === "string")
            ? resData.error.message
            : "Errore durante il rinvio dell'email.";
          throw new Error(errCode);
        }
      } else {
        setError("Nessuna sessione attiva rilevata. Torna al login ed esegui l'accesso per richiedere l'email di verifica.");
      }
    } catch (err) {
      console.error("Error resending verification:", err);
      const errMsg = err instanceof Error ? err.message : "Errore durante l'invio dell'email di verifica.";
      setError(errMsg);
    } finally {
      setResendLoading(false);
    }
  };

  const onSubmitRegister: SubmitHandler<RegisterInput> = async (data) => {
    setError("");
    setLoading(true);
    try {
      if (isVatValidating) {
        setError("Convalida della Partita IVA in corso... Attendi un istante.");
        setLoading(false);
        return;
      }

      const clientMetadata = {
        signupIp: "", // Popolato lato server tramite l'IP della richiesta
        signupCountry: data.country,
        userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "",
        timezone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "",
        detectedLocale: currentLocale,
        viesAddress: viesAddress || "",
        coordinates: vatCoordinates,
      };

      const addressValue = data.regType === "personal" ? manualAddressInput : (viesAddress || manualAddressInput);
      const companyNameValue = data.regType === "personal" ? data.fullName : (data.companyName || data.fullName);

      const registerPayload = {
        email: data.email,
        password: data.password,
        companyName: companyNameValue,
        type: data.regType,
        country: data.country,
        vatNumber: data.vatNumber || undefined,
        sdiCode: data.sdiCode || undefined,
        officeCode: data.officeCode || undefined,
        cigCode: data.cigCode || undefined,
        cupCode: data.cupCode || undefined,
        address: addressValue || undefined,
        latitude: vatCoordinates ? vatCoordinates.latitude : undefined,
        longitude: vatCoordinates ? vatCoordinates.longitude : undefined,
        altitude: vatCoordinates ? vatCoordinates.altitude : undefined,
        addressDetails: selectedAddressDetails || undefined,
        metadata: clientMetadata,
      };

      const response = await fetchWithAppCheck("/api/auth/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerPayload),
      });

      const resData = (await response.json()) as {
        success: boolean;
        error?: { message: string; code?: string };
      };

      if (!response.ok || !resData.success) {
        const errObj = new Error(resData.error?.message || "Errore durante la registrazione.") as Error & { code?: string };
        if (resData.error?.code) {
          errObj.code = resData.error.code;
        }
        throw errObj;
      }

      // Warm-up post-registrazione (P1-98): l'utente Firebase è creato in background.
      // Attesa iniziale + pochi tentativi con backoff esponenziale (sotto il rate-limit login).
      const LOGIN_POLL_MAX_ATTEMPTS = 5;
      const LOGIN_POLL_BASE_MS = 3000;
      let loggedIn = false;
      await new Promise(resolve => setTimeout(resolve, LOGIN_POLL_BASE_MS));
      for (let attempt = 1; attempt <= LOGIN_POLL_MAX_ATTEMPTS && !loggedIn; attempt++) {
        try {
          const loginResponse = await fetchWithAppCheck("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: data.email, password: data.password }),
          });

          const loginResData = (await loginResponse.json()) as {
            success: boolean;
            customToken?: string;
          };

          if (loginResponse.ok && loginResData.success && loginResData.customToken) {
            const { signInWithCustomToken } = await import("firebase/auth");
            await signInWithCustomToken(auth, loginResData.customToken);
            loggedIn = true;
          }
        } catch (loginErr) {
          console.warn(`Account non ancora disponibile per il login (tentativo ${attempt}/${LOGIN_POLL_MAX_ATTEMPTS}):`, loginErr);
        }
        if (!loggedIn && attempt < LOGIN_POLL_MAX_ATTEMPTS) {
          await new Promise(resolve => setTimeout(resolve, LOGIN_POLL_BASE_MS * Math.pow(2, attempt)));
        }
      }
      if (!loggedIn) {
        console.warn("Creazione account in background più lenta del previsto: login manuale dopo la verifica email.");
      }

      setNeedsVerification(true);
      setLoading(false);
      sessionStorage.removeItem("sso_register_form");
    } catch (err) {
      console.error("Registration error:", err);
      const errCode = (err && typeof err === "object" && "code" in err && typeof (err as { code: unknown }).code === "string")
        ? (err as { code: string }).code
        : "unknown";

      if (errCode === "auth/duplicate-vat") {
        setErrorReg("vatNumber", { type: "manual", message: t("auth.duplicateVatError") });
      } else if (errCode === "auth/email-already-exists" || errCode === "auth/email-already-in-use" || (err instanceof Error && (err.message.includes("email-already-exists") || err.message.includes("email-already-in-use")))) {
        setErrorReg("email", { type: "manual", message: t("auth.duplicateEmailError") });
      } else {
        const message = err instanceof Error ? err.message : "Errore durante la registrazione.";
        setError(message);
      }
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (needsVerification) {
    return (
      <AuthPortalShell showHeader={false} cardClassName="max-w-md">
        <AuthVerifyNotice
          email={emailRegValue || auth.currentUser?.email || ""}
          error={error}
          resendSuccess={resendSuccess}
          onCheck={() => router.push(`/${currentLocale}/auth/login${authQuery}`)}
          onResend={() => void handleResendVerification()}
          onBack={() => {
            setError("");
            void signOut(auth).then(() => setNeedsVerification(false));
          }}
          resendLoading={resendLoading}
          gradientClassName={gradient}
        />
      </AuthPortalShell>
    );
  }

  const isPersonal = regType === "personal";
  const vatStatus = isVatValidating
    ? "validating"
    : isViesOffline
    ? "offline"
    : isVatVerified
    ? "verified"
    : isVatWarning
    ? "warning"
    : "idle";

  return (
    <AuthPortalShell
      error={error}
      belowCard={
        <div className="mt-8 text-center text-xs text-slate-500 dark:text-gray-400">
          {t("auth.hasAccount")}{" "}
          <Link
            href={`/${currentLocale}/auth/login${authQuery}`}
            className="text-slate-900 dark:text-white font-bold hover:underline ms-1 cursor-pointer"
          >
            {t("auth.loginHere")}
          </Link>
        </div>
      }
    >
      <AuthFormRegister
        formRef={registerFormRef}
        regType={regType as RegisterAccountType}
        onTypeChange={(type) => setValueReg("regType", type)}
        country={country}
        onCountryChange={(code) => {
          const valid = EU_COUNTRIES.find((c) => c === code);
          if (valid) setValueReg("country", valid, { shouldValidate: true });
        }}
        countries={EU_COUNTRIES
          // Paesi attivi al lancio: SOLO Italia e Spagna (owner, 2026-07-15).
          // Schema/VIES supportano tutta la UE: per riattivare gli altri paesi
          // rimuovere il filtro qui sotto (erano: AT BE BG CY CZ DE DK EE EL/GR
          // FI FR HR HU IE LT LU LV MT NL PL PT RO SE SI SK…).
          .filter((code) => code === "IT" || code === "ES")
          .map((code) => ({
            code,
            name: EU_COUNTRY_NAMES[code][currentLocale as "it" | "en" | "es"] || EU_COUNTRY_NAMES[code].en,
            flag: EU_COUNTRY_FLAGS[code],
          }))}
        values={{
          fullName: fullNameRegValue,
          email: emailRegValue,
          password: passwordReg,
          vatNumber: vatNumberValue,
          companyName: companyNameValueW,
          sdiCode: sdiCodeValue,
          officeCode: officeCodeValue,
          cigCode: cigCodeValue,
          cupCode: cupCodeValue,
        }}
        onFieldChange={(field: RegisterTextField, value: string) =>
          setValueReg(field, value, { shouldValidate: true, shouldDirty: true })
        }
        acceptTerms={!!acceptTermsValue}
        onAcceptTermsChange={(v) => setValueReg("acceptTerms", v, { shouldValidate: true })}
        errors={{
          fullName: getErrorMessage(errorsReg.fullName),
          email: getErrorMessage(errorsReg.email),
          password: getErrorMessage(errorsReg.password),
          country: getErrorMessage(errorsReg.country),
          vatNumber: getErrorMessage(errorsReg.vatNumber),
          companyName: getErrorMessage(errorsReg.companyName),
          sdiCode: getErrorMessage(errorsReg.sdiCode),
          officeCode: getErrorMessage(errorsReg.officeCode),
          cigCode: getErrorMessage(errorsReg.cigCode),
          cupCode: getErrorMessage(errorsReg.cupCode),
          acceptTerms: getErrorMessage(errorsReg.acceptTerms),
        }}
        vatStatus={vatStatus}
        nameFromVies={isNameFromVies}
        address={{
          value: isPersonal ? manualAddressInput : viesAddress,
          onChange: (value) => {
            if (isPersonal) {
              setManualAddressInput(value);
            } else {
              setViesAddress(value);
            }
            void fetchAddressPredictions(value, country);
          },
          predictions: addressPredictions,
          onSelectPrediction: (pred) => {
            if (isPersonal) {
              setManualAddressInput(pred.description);
            } else {
              setViesAddress(pred.description);
            }
            void handleSelectAddress(pred.description, country, pred.placeId);
          },
          validating: isAddressValidating,
        }}
        lockedAddress={isVatVerified && isAddressFromVies ? viesAddress : null}
        onSubmit={handleSubmitReg(onSubmitRegister)}
        loading={loading}
        canSubmit={isValidReg}
        gradientClassName={gradient}
      />
    </AuthPortalShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<GlobalLoader />}>
      <RegisterPortal />
    </Suspense>
  );
}
