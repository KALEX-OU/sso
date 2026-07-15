"use client";

import React, { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { auth, fetchWithAppCheck } from "@/lib/firebase/client";
import {
  onAuthStateChanged,
  User,
  signOut,
  signInWithEmailAndPassword,
  getMultiFactorResolver,
  TotpMultiFactorGenerator,
  MultiFactorResolver
} from "firebase/auth";

interface GoogleAccountsIdInitializeOptions {
  client_id: string;
  callback: (response: { credential: string }) => void;
  auto_select?: boolean;
}

interface GoogleAccountsIdPromptNotification {
  isNotDisplayed: () => boolean;
  getNotDisplayedReason: () => string;
  isSkippedMoment: () => boolean;
  getSkippedReason: () => string;
  isDismissedMoment: () => boolean;
  getDismissedReason: () => string;
}

interface GoogleAccounts {
  id: {
    initialize: (options: GoogleAccountsIdInitializeOptions) => void;
    prompt: (callback?: (notification: GoogleAccountsIdPromptNotification) => void) => void;
    cancel: () => void;
  };
}

declare global {
  interface Window {
    google?: {
      accounts: GoogleAccounts;
    };
  }
}
// E5.1: import dai wrapper del framework (vietato @heroui/react nelle pagine app).
// NB: il wrapper Card racchiude i children in un body `p-5`: i padding root sono
// stati ridotti di conseguenza per mantenere l'ingombro precedente.
import {
  Button,
  Card,
  CardContent,
  TextField,
  Label,
  Input,
  FieldError,
  InputGroup,
  InputGroupPrefix,
  InputGroupSuffix,
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopover,
  ListBox,
  ListBoxItem,
  Checkbox,
  GlobalLoader
} from "@/framework/components/ui";
// L2: shell auth del framework — split 1/3-2/3 con landmark main/aside.
import { AuthLayout } from "@/framework/components/auth/AuthLayout";
import { AuthForm } from "@/framework/components/auth/AuthForm";
import { useTheme } from "next-themes";
import { useI18n, useChangeLocale, useCurrentLocale } from "@/locales/client";
import { Sun, Moon, Globe, Mail, Lock, User as UserIcon } from "lucide-react";
import { useBrand } from "@/framework/components/providers/BrandProvider";
import { useForm, SubmitHandler, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterSchema,
  RegisterInput,
  LoginSchema,
  LoginInput,
  EU_COUNTRIES,
  EU_COUNTRY_NAMES,
  EU_COUNTRY_FLAGS,
  validateVatNumber
} from "@/lib/validation/auth";

// Configurazione estetica dei brand verticali.
// `name: null` = il nome segue il brand white-label attivo (useBrand, E5.1):
// niente identità cablata nel markup per la voce di default.
const BRAND_CONFIGS: Record<
  string,
  {
    name: string | null;
    subtitleKey: string;
    logoColor: string;
    bgGradientLight: string;
    bgGradientDark: string;
    glowColorLight: string;
    glowColorDark: string;
  }
> = {
  satefy: {
    name: "SATEFY",
    subtitleKey: "auth.subtitle",
    logoColor: "from-success to-teal-500",
    bgGradientLight: "from-success/10 via-slate-50 to-teal-100/20",
    bgGradientDark: "from-success/10 via-slate-950 to-teal-950/15",
    glowColorLight: "bg-success/5",
    glowColorDark: "bg-success/10"
  },
  standlo: {
    name: "STANDLO",
    subtitleKey: "auth.subtitle",
    logoColor: "from-cyan-400 to-blue-500",
    bgGradientLight: "from-cyan-100/40 via-slate-50 to-blue-100/20",
    bgGradientDark: "from-cyan-950/25 via-slate-950 to-blue-950/15",
    glowColorLight: "bg-cyan-500/5",
    glowColorDark: "bg-cyan-500/10"
  },
  default: {
    name: null,
    subtitleKey: "auth.subtitle",
    logoColor: "from-secondary to-accent",
    bgGradientLight: "from-secondary/10 via-slate-50 to-accent/20",
    bgGradientDark: "from-secondary/15 via-slate-950 to-accent/15",
    glowColorLight: "bg-secondary/5",
    glowColorDark: "bg-secondary/10"
  }
};



// Google One Tap tracking variables disabled

function AuthPortal() {
  const t = useI18n();
  const currentLocale = useCurrentLocale();
  const changeLocale = useChangeLocale();
  // Brand white-label attivo (identità/copyright): mai cablare "KALEX" nel markup (E5.1).
  const wlBrand = useBrand();

  const getErrorMessage = useCallback((errorObj?: { message?: string }) => {
    if (!errorObj || !errorObj.message) return "";
    if (errorObj.message.startsWith("validation.")) {
      return t(errorObj.message as Parameters<typeof t>[0]);
    }
    return errorObj.message;
  }, [t]);
  const { setTheme, resolvedTheme } = useTheme();

  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("client_id") || "default";
  const redirectUri = searchParams.get("redirect_uri");
  // PKCE (3.1): challenge generato dalla RP, va inoltrato tale e quale a /api/auth/code
  const codeChallenge = searchParams.get("code_challenge");
  // Suffisso per i link interni (privacy/termini) che devono preservare i parametri OAuth
  const pkcePreserveParams = codeChallenge ? `&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256` : "";
  const state = searchParams.get("state") || "";

  const brand = BRAND_CONFIGS[clientId] || BRAND_CONFIGS.default;
  // Nome effettivo: i verticali hanno un nome proprio, il default segue il white-label.
  const brandName = brand.name ?? wlBrand.name;
  const isDark = resolvedTheme === "dark";
  const activeGlowColor = isDark ? brand.glowColorDark : brand.glowColorLight;

  const [isLogin, setIsLogin] = useState(true);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [mounted, setMounted] = useState(false);
  // White-label (§3-bis): nome dell'org risolto dall'host (sottodominio o dominio custom).
  const [tenantName, setTenantName] = useState<string | null>(null);
  // Nome mostrato nel logo: l'org risolta dall'host ha la precedenza sul brand statico.
  const displayBrandName = tenantName || brandName;

  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");

  // Stati per Multi-Factor Authentication (MFA) — solo TOTP (app di autenticazione).
  // L'SMS è stato rimosso: reCAPTCHA Enterprise (App Check) e il phone auth di Firebase non
  // coesistono sul web, e il TOTP è comunque il metodo 2FA raccomandato (NIST scoraggia l'SMS).
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaResolver, setMfaResolver] = useState<MultiFactorResolver | null>(null);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaHint, setMfaHint] = useState("");
  const [mfaLoading, setMfaLoading] = useState(false);
  const [mfaTotpUid, setMfaTotpUid] = useState("");
  // Recovery MFA con codice di backup (173): l'email è catturata al momento del challenge MFA.
  const [mfaEmail, setMfaEmail] = useState("");
  const [showBackupRecover, setShowBackupRecover] = useState(false);
  const [backupCode, setBackupCode] = useState("");
  const [backupRecoverLoading, setBackupRecoverLoading] = useState(false);
  const [backupRecoverMsg, setBackupRecoverMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [isVatValidating, setIsVatValidating] = useState(false);
  const [viesAddress, setViesAddress] = useState("");
  const [isVatVerified, setIsVatVerified] = useState(false);
  const [isViesOffline, setIsViesOffline] = useState(false);
  const [isVatWarning, setIsVatWarning] = useState(false);
  const [isNameFromVies, setIsNameFromVies] = useState(false);
  const [isAddressFromVies, setIsAddressFromVies] = useState(false);
  const [vatCoordinates, setVatCoordinates] = useState<{ latitude: number; longitude: number; altitude: number | null } | null>(null);
  const geoFetchingRef = useRef(false);

  // Stati per Google Places Autocomplete (New)
  const [addressPredictions, setAddressPredictions] = useState<Array<{ description: string; placeId: string }>>([]);
  const [isAddressValidating, setIsAddressValidating] = useState(false);
  const [manualAddressInput, setManualAddressInput] = useState("");
  const [selectedAddressDetails, setSelectedAddressDetails] = useState<unknown>(null);

  // Forza il rendering client-side per evitare warning di mismatch idrati
  useEffect(() => {
    let active = true;
    setTimeout(() => {
      if (active) setMounted(true);
    }, 0);
    return () => {
      active = false;
    };
  }, []);

  // White-label (§3-bis): risolve il nome dell'org dal dominio tenant. Il login gira sempre sull'host
  // di sistema (sso.<base>), quindi l'host del tenant si ricava dal `redirect_uri` (l'URL da cui
  // l'utente proviene, es. https://acme.kalexs.com/...); fallback all'host corrente. Best-effort.
  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        let host = window.location.hostname;
        if (redirectUri) {
          try {
            host = new URL(redirectUri).hostname;
          } catch {
            // redirect_uri non è un URL valido: si usa l'host corrente.
          }
        }
        const res = await fetch(`/api/public/tenant?host=${encodeURIComponent(host)}`);
        if (!res.ok) return;
        const json = (await res.json()) as { found?: boolean; tenant?: { name?: string } };
        if (active && json.found && json.tenant?.name) {
          setTenantName(json.tenant.name);
        }
      } catch {
        // Nessun branding tenant: si resta sul brand statico.
      }
    })();
    return () => {
      active = false;
    };
  }, [redirectUri]);

  const loginFormRef = useRef<HTMLFormElement | null>(null);
  const registerFormRef = useRef<HTMLFormElement | null>(null);

  // React Hook Form per Login
  const {
    handleSubmit: handleSubmitLogin,
    setValue: setValueLogin,
    getValues: getValuesLogin,
    control: controlLogin,
    formState: { errors: errorsLogin }
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true
    }
  });

  // React Hook Form per Registrazione
  const {
    register: registerReg,
    handleSubmit: handleSubmitReg,
    setValue: setValueReg,
    setError: setErrorReg,
    control: controlReg,
    formState: { errors: errorsReg, isValid: isValidReg }
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
    defaultValues: {
      regType: "personal",
      country: currentLocale === "es" ? "ES" : "IT",
      acceptTerms: false as unknown as true,
      fullName: "",
      email: "",
      password: "",
      companyName: "",
      vatNumber: "",
      sdiCode: "",
      officeCode: "",
      cigCode: "",
      cupCode: ""
    }
  });

  // Sincronizzazione degli eventi di input nativi (es. autofill / suggerimento password del browser) con lo stato di React Hook Form
  useEffect(() => {
    const formEl = loginFormRef.current;
    if (!formEl) return;

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target && target.name) {
        const name = target.name as keyof LoginInput;
        const val = target.value;
        setValueLogin(name, val, { shouldValidate: true, shouldDirty: true });
      }
    };

    formEl.addEventListener("input", handleNativeInput);
    formEl.addEventListener("change", handleNativeInput);
    return () => {
      formEl.removeEventListener("input", handleNativeInput);
      formEl.removeEventListener("change", handleNativeInput);
    };
  }, [setValueLogin]);

  useEffect(() => {
    const formEl = registerFormRef.current;
    if (!formEl) return;

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target && target.name) {
        const name = target.name as keyof RegisterInput;
        const val = target.value;
        setValueReg(name, val, { shouldValidate: true, shouldDirty: true });
      }
    };

    formEl.addEventListener("input", handleNativeInput);
    formEl.addEventListener("change", handleNativeInput);
    return () => {
      formEl.removeEventListener("input", handleNativeInput);
      formEl.removeEventListener("change", handleNativeInput);
    };
  }, [setValueReg]);

  const regType = useWatch({ control: controlReg, name: "regType" }) || "personal";
  const country = useWatch({ control: controlReg, name: "country" }) || "IT";
  const passwordReg = useWatch({ control: controlReg, name: "password" }) || "";
  const vatNumberValue = useWatch({ control: controlReg, name: "vatNumber" }) || "";
  const emailRegValue = useWatch({ control: controlReg, name: "email" }) || "";
  // Binding controllato per il wrapper Input (E5.1): il wrapper è sempre controllato
  // (value di default ""), quindi ogni campo registrato con RHF espone il valore via useWatch.
  const fullNameRegValue = useWatch({ control: controlReg, name: "fullName" }) || "";
  const sdiCodeValue = useWatch({ control: controlReg, name: "sdiCode" }) || "";
  const officeCodeValue = useWatch({ control: controlReg, name: "officeCode" }) || "";
  const cigCodeValue = useWatch({ control: controlReg, name: "cigCode" }) || "";
  const cupCodeValue = useWatch({ control: controlReg, name: "cupCode" }) || "";
  const emailLoginValue = useWatch({ control: controlLogin, name: "email" }) || "";
  const passwordLoginValue = useWatch({ control: controlLogin, name: "password" }) || "";
  const rememberMeLoginValue = useWatch({ control: controlLogin, name: "rememberMe" }) ?? true;

  // Automatismo Geo-IP per il paese di default e la lingua locale iniziale (attivo sia per login che per registrazione)
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
          // Resetta in caso di fallimento per permettere un tentativo successivo
          geoFetchingRef.current = false;
        });
    }
  }, [mounted, setValueReg]);

  // Caricamento dei dati salvati nel form da sessionStorage
  useEffect(() => {
    if (!isLogin && mounted) {
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
    }
  }, [isLogin, mounted, setValueReg]);

  // Persistenza manuale degli stati indirizzo in sessionStorage
  useEffect(() => {
    if (!isLogin && mounted) {
      sessionStorage.setItem("sso_vies_address", viesAddress);
      sessionStorage.setItem("sso_manual_address", manualAddressInput);
      if (vatCoordinates) {
        sessionStorage.setItem("sso_vat_coordinates", JSON.stringify(vatCoordinates));
      } else {
        sessionStorage.removeItem("sso_vat_coordinates");
      }
    }
  }, [viesAddress, manualAddressInput, vatCoordinates, isLogin, mounted]);

  // Salvataggio automatico dello stato del form in sessionStorage
  const registerValues = useWatch({ control: controlReg });
  useEffect(() => {
    if (!isLogin && mounted) {
      sessionStorage.setItem("sso_register_form", JSON.stringify(registerValues));
    }
  }, [registerValues, isLogin, mounted]);

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
          coordinates?: { latitude: number; longitude: number; altitude: number | null } | null
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
        body: JSON.stringify({ input: query, country: cCode })
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
              altitude: null
            });
            setManualAddressInput(data.details.formattedAddress || addressText);
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
          setManualAddressInput(data.formattedAddress || addressText);
          setSelectedAddressDetails(null);
        }
      }
    } catch (err) {
      console.warn("Address geocoding failed:", err);
    } finally {
      setIsAddressValidating(false);
    }
  }, []);

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

  const handleSSORedirect = useCallback(async (currentUser: User) => {
    if (!redirectUri) return;
    setRedirecting(true);
    try {
      const idToken = await currentUser.getIdToken();
      const response = await fetchWithAppCheck("/api/auth/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          clientId,
          redirectUri,
          ...(codeChallenge ? { codeChallenge, codeChallengeMethod: "S256" } : {})
        })
      });
      const data = (await response.json()) as { 
        success?: boolean; 
        error?: string | { message: string }; 
        code?: string 
      };
      if (data.error || data.success === false) {
        const errMsg = typeof data.error === "object" && data.error ? data.error.message : (data.error as string) || "Errore durante la generazione del codice SSO.";
        throw new Error(errMsg);
      }
      try {
        const targetUrl = new URL(redirectUri);
        targetUrl.searchParams.set("code", data.code || "");
        targetUrl.searchParams.set("state", state || "");
        window.location.href = targetUrl.toString();
      } catch (urlErr) {
        console.error("Errore nel parsing del redirectUri:", urlErr);
        window.location.href = `${redirectUri}${redirectUri.includes("?") ? "&" : "?"}code=${data.code}&state=${encodeURIComponent(state)}`;
      }
    } catch (err) {
      console.error("SSO Redirect error:", err);
      const message = err instanceof Error ? err.message : "Errore durante il reindirizzamento.";
      setError(message);
      setRedirecting(false);
    }
  }, [redirectUri, clientId, state, codeChallenge]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Se non è verificato localmente, ricarica lo stato per sincronizzarlo con il server
        if (!currentUser.emailVerified) {
          try {
            console.log("[Auth State Change] User not verified locally, reloading...");
            await currentUser.reload();
            console.log("[Auth State Change] User reloaded. Verified status:", currentUser.emailVerified);
            if (currentUser.emailVerified) {
              console.log("[Auth State Change] Force refreshing ID token to update claims...");
              await currentUser.getIdToken(true);
            }
          } catch (e) {
            console.error("Error reloading user on auth state change:", e);
          }
        }

        if (currentUser.emailVerified) {
          setNeedsVerification(false);
          
          const syncSessionAndRedirect = async () => {
            if (redirecting) return;
            setRedirecting(true);
            try {
              // 1. Chiama /api/auth/session per impostare il cookie HttpOnly lato server
              const idToken = await currentUser.getIdToken();
              // "Ricordami": letto live dal form (getValues, no ref/global → passa react-hooks). Al login
              // riflette la scelta dell'utente; sui page-load è il default true. Determina la persistenza
              // del cookie server (rememberMe=false → cookie di sessione).
              const rememberChoice = getValuesLogin("rememberMe");
              const sessionRes = await fetchWithAppCheck("/api/auth/session", {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${idToken}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ rememberMe: rememberChoice })
              });
              if (!sessionRes.ok) {
                throw new Error("Impossibile sincronizzare la sessione server-side.");
              }
              
              // 2. Prosegui con il redirect SSO o dashboard
              if (redirectUri) {
                await handleSSORedirect(currentUser);
              } else {
                const redirectTo = searchParams.get("redirectTo");
                if (redirectTo && redirectTo.startsWith("/")) {
                  const hasLocale = /^\/(it|en|es)(\/|$)/.test(redirectTo);
                  if (hasLocale) {
                    router.push(redirectTo);
                  } else {
                    router.push(`/${currentLocale}${redirectTo}`);
                  }
                } else {
                  router.push(`/${currentLocale}/dashboard`);
                }
              }
            } catch (err) {
              console.error("[Auth Sincronizzazione Sessione] Errore:", err);
              setError("Errore durante l'attivazione della sessione sicura.");
              setRedirecting(false);
            }
          };
          
          void syncSessionAndRedirect();
        } else {
          setNeedsVerification(true);
        }
      } else {
        setNeedsVerification(false);
      }
    });
    return () => unsubscribe();
  }, [redirectUri, redirecting, handleSSORedirect, router, currentLocale, searchParams, getValuesLogin]);



  const handleCheckVerification = async () => {
    setError("");
    setLoading(true);
    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          await auth.currentUser.getIdToken(true); // Forza il refresh del token per aggiornare i claims
          setNeedsVerification(false);
          if (redirectUri && !redirecting) {
            handleSSORedirect(auth.currentUser);
          }
        } else {
          setError("L'indirizzo email non è ancora stato verificato. Controlla la tua casella di posta.");
        }
      }
    } catch (err) {
      console.error("Error checking verification status:", err);
      setError("Errore durante la verifica dello stato dell'email.");
    } finally {
      setLoading(false);
    }
  };


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
            "Authorization": `Bearer ${idToken}`
          }
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
        setError("Nessuna sessione attiva rilevata. Per favore, clicca su 'Torna al login' ed esegui l'accesso per poter richiedere l'email di verifica.");
      }
    } catch (err) {
      console.error("Error resending verification:", err);
      const errMsg = err instanceof Error ? err.message : "Errore durante l'invio dell'email di verifica.";
      setError(errMsg);
    } finally {
      setResendLoading(false);
    }
  };

  // onSubmit per Login
  const onSubmitLogin: SubmitHandler<LoginInput> = async (data) => {
    setError("");
    setLoading(true);
    try {
      const { setPersistence, browserLocalPersistence, browserSessionPersistence } = await import("firebase/auth");
      await setPersistence(auth, data.rememberMe ? browserLocalPersistence : browserSessionPersistence);
      
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      
      if (!userCredential.user.emailVerified) {
        setNeedsVerification(true);
      }
    } catch (err) {
      const errCode = (err && typeof err === "object" && "code" in err && typeof (err as { code: unknown }).code === "string")
        ? (err as { code: string }).code
        : "unknown";
      
      if (errCode !== "auth/multi-factor-auth-required") {
        console.error("Login error:", err);
      }
      
      // Gestione del secondo fattore (MFA) richiesto
      if (errCode === "auth/multi-factor-auth-required") {
        try {
          const resolver = getMultiFactorResolver(auth, err as Parameters<typeof getMultiFactorResolver>[1]);

          // Solo fattore TOTP (app di autenticazione): non richiede invio, si chiede subito il codice.
          const totpInfoOptions = resolver.hints.find((h) => h.factorId === TotpMultiFactorGenerator.FACTOR_ID);
          if (!totpInfoOptions) {
            throw new Error("Nessun secondo fattore TOTP risolvibile disponibile per questo account.");
          }

          setMfaResolver(resolver);
          setMfaRequired(true);
          setMfaEmail(data.email);
          setMfaTotpUid(totpInfoOptions.uid);
          setMfaHint(totpInfoOptions.displayName || "la tua app di autenticazione");
          setLoading(false);
          return;
        } catch (mfaErr) {
          console.error("Error initializing MFA:", mfaErr);
          setError("Errore durante l'inizializzazione del secondo fattore di autenticazione.");
          setLoading(false);
          return;
        }
      }
      
      // Gestione errori di credenziali errate
      let errMsg = "Errore durante l'accesso.";
      if (errCode === "auth/wrong-password" || errCode === "auth/user-not-found" || errCode === "auth/invalid-credential") {
        errMsg = "Credenziali non valide.";
      } else if (err instanceof Error && err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
      setLoading(false);
    }
  };

  // Recovery MFA con codice di backup (173): reimposta i fattori MFA lato server, poi l'utente
  // ri-accede con la sola password (il reset degrada a password-only, non concede accesso).
  const handleBackupRecover = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!backupCode.trim() || !mfaEmail) return;
    setBackupRecoverMsg(null);
    setBackupRecoverLoading(true);
    try {
      const res = await fetchWithAppCheck("/api/auth/mfa/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: mfaEmail, code: backupCode.trim() })
      });
      const data = (await res.json().catch(() => ({}))) as { reset?: boolean };
      if (res.ok && data.reset) {
        setBackupRecoverMsg({ type: "ok", text: t("auth.mfaBackupResetOk") });
        setMfaResolver(null);
        setBackupCode("");
      } else {
        setBackupRecoverMsg({ type: "err", text: t("auth.mfaBackupInvalid") });
      }
    } catch {
      setBackupRecoverMsg({ type: "err", text: t("auth.mfaBackupError") });
    } finally {
      setBackupRecoverLoading(false);
    }
  };

  const handleVerifyMfaCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaResolver || !mfaCode) return;
    setError("");
    setMfaLoading(true);
    try {
      const multiFactorAssertion = TotpMultiFactorGenerator.assertionForSignIn(mfaTotpUid, mfaCode);
      const userCredential = await mfaResolver.resolveSignIn(multiFactorAssertion);
      
      setMfaRequired(false);
      setMfaResolver(null);
      
      if (!userCredential.user.emailVerified) {
        setNeedsVerification(true);
      }
    } catch (err) {
      console.error("MFA verification error:", err);
      let errMsg = "Codice di verifica non valido.";
      if (err instanceof Error && err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setMfaLoading(false);
    }
  };

  // onSubmit per Registrazione
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
        signupIp: "", // Sarà popolato lato server tramite l'IP della richiesta
        signupCountry: data.country,
        userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "",
        timezone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "",
        detectedLocale: currentLocale,
        viesAddress: viesAddress || "",
        coordinates: vatCoordinates
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
        metadata: clientMetadata
      };

      const response = await fetchWithAppCheck("/api/auth/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerPayload)
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

      // Warm-up post-registrazione (P1-98): l'utente Firebase è creato ASINCRONA-mente dal task
      // in background. Prima ritentavamo /login fino a 10× ravvicinati (2.5s) → si ESAURIVA il
      // rate-limiter del login (10/10min), bloccando il login reale e i successivi. Ora:
      //  - attesa iniziale (il task tipicamente crea l'utente in pochi secondi) → nel caso comune
      //    UN solo /login riesce;
      //  - pochi tentativi (5 < 10) con backoff ESPONENZIALE → le chiamate restano sotto il rate-limit.
      const LOGIN_POLL_MAX_ATTEMPTS = 5;
      const LOGIN_POLL_BASE_MS = 3000;
      let loggedIn = false;
      await new Promise(resolve => setTimeout(resolve, LOGIN_POLL_BASE_MS));
      for (let attempt = 1; attempt <= LOGIN_POLL_MAX_ATTEMPTS && !loggedIn; attempt++) {
        try {
          const loginResponse = await fetchWithAppCheck("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: data.email, password: data.password })
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
          // Backoff esponenziale (6s → 12s → 24s → 48s): spread sotto il rate-limit del login.
          await new Promise(resolve => setTimeout(resolve, LOGIN_POLL_BASE_MS * Math.pow(2, attempt)));
        }
      }
      if (!loggedIn) {
        console.warn("Creazione account in background più lenta del previsto: l'utente eseguirà il login manuale dopo la verifica email.");
      }

      setNeedsVerification(true);
      sessionStorage.removeItem("sso_register_form"); // Rimuovi dati salvati
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

  // Google Sign-In disabled



  if (!mounted) return null;

  if (redirecting) {
    return <GlobalLoader message={t("auth.success")} subMessage={t("auth.redirecting")} />;
  }



  if (needsVerification) {
    return (
      <AuthLayout>
        {/* Left Column (Forms and Dynamic States) */}
        <AuthLayout.Form className="lg:p-20">
          {/* Ambient Glow — RTL: fisico voluto, centraggio simmetrico (left-1/2 + -translate-x-1/2); con start-1/2 il translate fisico non centrerebbe in RTL */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full filter blur-[100px] pointer-events-none ${activeGlowColor} opacity-50`}></div>

          {/* Floating Header per selezione Tema & Lingua */}
          <div className="absolute top-6 end-6 flex items-center gap-2 z-50">
            {/* Selettore Lingua a discesa */}
            <div className="relative">
              <Button
                unstyled
                variant="ghost"
                size="sm"
                className="border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800/80 backdrop-blur-md text-slate-800 dark:text-white cursor-pointer rounded-full px-3.5 py-1.5 flex items-center gap-1.5 text-xs font-bold transition-all"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="uppercase text-[10px] tracking-wider">{currentLocale}</span>
              </Button>
              {langMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setLangMenuOpen(false)}></div>
                  <div className="absolute end-0 mt-2 w-36 origin-top-right rtl:origin-top-left rounded-2xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl z-45 p-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      type="button"
                      onClick={() => {
                        changeLocale("it");
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                        currentLocale === "it"
                          ? "bg-secondary/10 text-secondary"
                          : "text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5"
                      }`}
                    >
                      <span className="text-sm">🇮🇹</span> Italiano
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        changeLocale("en");
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                        currentLocale === "en"
                          ? "bg-secondary/10 text-secondary"
                          : "text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5"
                      }`}
                    >
                      <span className="text-sm">🇬🇧</span> English
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        changeLocale("es");
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                        currentLocale === "es"
                          ? "bg-secondary/10 text-secondary"
                          : "text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5"
                      }`}
                    >
                      <span className="text-sm">🇪🇸</span> Español
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Toggle Tema */}
            <Button
              unstyled
              isIconOnly
              variant="ghost"
              size="sm"
              className="border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800/80 backdrop-blur-md text-slate-800 dark:text-white cursor-pointer rounded-full transition-all"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              {resolvedTheme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </Button>
          </div>

          <Card className="max-w-md w-full border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/35 dark:bg-slate-950/25 backdrop-blur-2xl shadow-2xl p-1 relative z-10 rounded-3xl transition-all">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
                <Mail className="w-8 h-8 text-slate-800 dark:text-white" />
              </div>

              <h2 className="text-2xl font-bold mb-3 tracking-tight text-slate-900 dark:text-white">{t("auth.verifyEmailTitle")}</h2>
              <p className="text-slate-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                {t("auth.verifyEmailDesc", { email: emailRegValue || auth.currentUser?.email || "" })}
              </p>

              {error && (
                <div className="bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-500/20 text-red-800 dark:text-red-300 rounded-2xl p-3 text-xs mb-4 text-center font-medium w-full">
                  {error}
                </div>
              )}

              {resendSuccess && (
                <div className="bg-success/10 border border-success/25 dark:border-success/20 text-success rounded-2xl p-3 text-xs mb-4 text-center font-medium w-full">
                  {resendSuccess}
                </div>
              )}

              <div className="space-y-3 w-full">
                <Button
                  unstyled
                  onClick={handleCheckVerification}
                  isDisabled={loading}
                  className={`w-full py-6 font-bold bg-gradient-to-r ${brand.logoColor} text-slate-950 rounded-xl active:scale-[0.98] transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2`}
                >
                  {loading && <span className="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent"></span>}
                  {t("auth.verifyEmailButton")}
                </Button>

                <Button
                  unstyled
                  onClick={handleResendVerification}
                  isDisabled={resendLoading}
                  variant="outline"
                  className="w-full py-6 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-white text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {resendLoading && <span className="animate-spin rounded-full h-4 w-4 border-2 border-slate-800 dark:border-white border-t-transparent"></span>}
                  {t("auth.resendEmailButton")}
                </Button>

                <button
                  type="button"
                  onClick={async () => {
                    setError("");
                    await signOut(auth);
                    setNeedsVerification(false);
                  }}
                  className="text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white text-xs font-semibold underline mt-4 cursor-pointer block mx-auto bg-transparent border-0"
                >
                  {t("auth.backToLogin")}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Footer sotto la Card */}
          <div className="mt-8 text-center text-xs text-slate-500 dark:text-gray-500 relative z-10 flex flex-col sm:flex-row items-center gap-3">
            <p>{wlBrand.copyright} · {t("auth.rightsReserved")}</p>
            <span className="hidden sm:inline text-slate-300 dark:text-gray-600">|</span>
            <div className="flex gap-3">
              <a href={`/${currentLocale}/privacy?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri || "")}&state=${encodeURIComponent(state)}${pkcePreserveParams}`} className="hover:text-slate-800 dark:hover:text-white transition-colors">Privacy Policy</a>
              <a href={`/${currentLocale}/terms?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri || "")}&state=${encodeURIComponent(state)}${pkcePreserveParams}`} className="hover:text-white dark:hover:text-white transition-colors">Termini</a>
            </div>
          </div>
        </AuthLayout.Form>

        {/* Right Column (Marketing panel) */}
        {renderMarketingPanel({ ...brand, name: brandName }, t, isDark)}
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      {/* Left Column (Forms and Dynamic States) */}
      <AuthLayout.Form className="lg:p-16">
        {/* Ambient Glow — RTL: fisico voluto, centraggio simmetrico (left-1/2 + -translate-x-1/2); con start-1/2 il translate fisico non centrerebbe in RTL */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full filter blur-[100px] pointer-events-none ${activeGlowColor} opacity-50`}></div>

        {/* Floating Header per selezione Tema & Lingua */}
        <div className="absolute top-6 end-6 flex items-center gap-2 z-50">
          {/* Selettore Lingua a discesa */}
          <div className="relative">
            <Button
              unstyled
              variant="ghost"
              size="sm"
              className="border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800/80 backdrop-blur-md text-slate-800 dark:text-white cursor-pointer rounded-full px-3.5 py-1.5 flex items-center gap-1.5 text-xs font-bold transition-all"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="uppercase text-[10px] tracking-wider">{currentLocale}</span>
            </Button>
            {langMenuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setLangMenuOpen(false)}></div>
                <div className="absolute end-0 mt-2 w-36 origin-top-right rtl:origin-top-left rounded-2xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl z-45 p-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    type="button"
                    onClick={() => {
                      changeLocale("it");
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                      currentLocale === "it"
                        ? "bg-secondary/10 text-secondary"
                        : "text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="text-sm">🇮🇹</span> Italiano
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      changeLocale("en");
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                      currentLocale === "en"
                        ? "bg-secondary/10 text-secondary"
                        : "text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="text-sm">🇬🇧</span> English
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      changeLocale("es");
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                      currentLocale === "es"
                        ? "bg-secondary/10 text-secondary"
                        : "text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="text-sm">🇪🇸</span> Español
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Toggle Tema */}
          <Button
            unstyled
            isIconOnly
            variant="ghost"
            size="sm"
            className="border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800/80 backdrop-blur-md text-slate-800 dark:text-white cursor-pointer rounded-full transition-all"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            {resolvedTheme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </Button>
        </div>

        <Card className="max-w-xl w-full border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/35 backdrop-blur-2xl shadow-2xl p-1 sm:p-3 relative z-10 rounded-3xl transition-all">
          <CardContent className="p-4">
            {/* Brand Logo & Title */}
            <div className="text-center mb-8">
              <span className={`text-4xl font-extrabold bg-gradient-to-r ${brand.logoColor} bg-clip-text text-transparent tracking-tighter`}>
                {displayBrandName}
              </span>
              <p className="text-slate-500 dark:text-gray-400 text-xs font-semibold mt-2 tracking-wide uppercase">
                {t("auth.subtitle")}
              </p>
            </div>

            {error && (
              <div className="bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-500/20 text-red-800 dark:text-red-300 rounded-2xl p-3 text-xs mb-6 text-center font-medium w-full">
                {error}
              </div>
            )}

            {mfaRequired ? (
              /* FORM DI VERIFICA CODICE MFA (app di autenticazione — TOTP) */
              <form onSubmit={handleVerifyMfaCode} className="space-y-5">
                <div className="text-center mb-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">
                    {t("auth.mfaTitle")}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    {t("auth.mfaTotpPrompt", { factor: mfaHint })}
                  </p>
                </div>

                <TextField className="flex flex-col gap-1.5 w-full">
                  <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">
                    {t("auth.mfaCode")}
                  </Label>
                  <InputGroup className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus-within:!border-secondary rounded-2xl px-3.5 py-2 flex items-center h-[48px] transition-all w-full">
                    <Input
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      className="bg-transparent border-0 outline-none w-full h-full text-sm text-slate-900 dark:text-white placeholder:text-slate-400 text-center tracking-widest font-mono text-lg"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      required
                    />
                  </InputGroup>
                </TextField>

                <Button
                  unstyled
                  type="submit"
                  isDisabled={mfaLoading}
                  className={`w-full py-6 font-bold bg-gradient-to-r ${brand.logoColor} text-slate-950 rounded-xl active:scale-[0.98] transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 mt-6`}
                >
                  {mfaLoading && <span className="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent"></span>}
                  {t("auth.mfaSubmit")}
                </Button>

                {/* Recovery con codice di backup (173): per chi ha perso il dispositivo TOTP */}
                {!showBackupRecover ? (
                  <button
                    type="button"
                    onClick={() => { setShowBackupRecover(true); setBackupRecoverMsg(null); }}
                    className="w-full text-center text-[11px] font-semibold text-slate-400 hover:text-secondary dark:hover:text-secondary underline mt-2 cursor-pointer bg-transparent border-0 outline-none block"
                  >
                    {t("auth.mfaBackupCta")}
                  </button>
                ) : (
                  <div className="flex flex-col gap-2 mt-2 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 p-3">
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 leading-relaxed">{t("auth.mfaBackupPrompt")}</p>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="XXXXX-XXXXX"
                        className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus:border-primary rounded-2xl px-3 py-2 h-[44px] text-sm text-slate-900 dark:text-white outline-none w-full text-center tracking-wider font-mono"
                        value={backupCode}
                        onChange={(e) => setBackupCode(e.target.value)}
                      />
                      <Button
                        unstyled
                        type="button"
                        onClick={() => void handleBackupRecover()}
                        isDisabled={backupRecoverLoading || !backupCode.trim()}
                        className="px-4 font-bold bg-slate-800 dark:bg-white/10 text-white rounded-xl cursor-pointer whitespace-nowrap"
                      >
                        {t("auth.mfaBackupSubmit")}
                      </Button>
                    </div>
                    {backupRecoverMsg && (
                      <p className={`text-[11px] font-semibold ${backupRecoverMsg.type === "ok" ? "text-success" : "text-red-500"}`}>
                        {backupRecoverMsg.text}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => { setShowBackupRecover(false); setBackupRecoverMsg(null); setBackupCode(""); }}
                      className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-500 self-start bg-transparent border-0 cursor-pointer outline-none"
                    >
                      {t("auth.mfaBackupCancel")}
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMfaRequired(false);
                    setMfaResolver(null);
                    setError("");
                  }}
                  className="w-full text-center text-xs font-semibold text-secondary hover:underline mt-4 cursor-pointer bg-transparent border-0 outline-none block"
                >
                  {t("auth.backToLogin")}
                </button>
              </form>
            ) : isLogin ? (
              /* FORM DI LOGIN — componente DS auth/AuthForm (campi klx globali) */
              <AuthForm
                formRef={loginFormRef}
                email={emailLoginValue}
                password={passwordLoginValue}
                rememberMe={rememberMeLoginValue}
                onEmailChange={(v) => setValueLogin("email", v, { shouldValidate: true, shouldDirty: true })}
                onPasswordChange={(v) => setValueLogin("password", v, { shouldValidate: true, shouldDirty: true })}
                onRememberMeChange={(v) => setValueLogin("rememberMe", v)}
                onSubmit={handleSubmitLogin(onSubmitLogin)}
                onForgotPassword={() => router.push(`/${currentLocale}/auth/reset-password`)}
                emailError={getErrorMessage(errorsLogin.email)}
                passwordError={getErrorMessage(errorsLogin.password)}
                loading={loading}
              />
            ) : (
              /* FORM DI REGISTRAZIONE CON HEROUI V3 */
              <form ref={registerFormRef} onSubmit={handleSubmitReg(onSubmitRegister)} className="space-y-5">
                {/* Tipo di account */}
                <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-slate-950/50 rounded-2xl border border-slate-200/50 dark:border-white/5 mb-2">
                  {(["personal", "business", "government", "education"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setValueReg("regType", type)}
                      className={`py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all capitalize cursor-pointer ${
                        regType === type
                          ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-white/5"
                          : "text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white"
                      }`}
                    >
                      {type === "personal" ? t("auth.typePersonal") : type === "business" ? t("auth.typeBusiness") : type === "government" ? t("auth.typeGovernment") : t("auth.typeEducation")}
                    </button>
                  ))}
                </div>

                {/* Nome completo */}
                <TextField isInvalid={!!errorsReg.fullName} className="flex flex-col gap-1.5 w-full">
                  <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">
                    {t("auth.name")}
                  </Label>
                  <InputGroup className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus-within:!border-secondary rounded-2xl px-3.5 py-2 flex items-center h-[48px] transition-all w-full">
                    <InputGroupPrefix className="flex items-center justify-center me-2">
                      <UserIcon className="text-slate-400 flex-shrink-0 w-4 h-4" />
                    </InputGroupPrefix>
                    <Input
                      type="text"
                      placeholder={country === "IT"
                        ? "Mario Rossi"
                        : country === "ES"
                        ? "Juan Pérez"
                        : "John Doe"}
                      autoComplete="name"
                      className="bg-transparent border-0 outline-none w-full h-full text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                      {...registerReg("fullName")}
                      value={fullNameRegValue}
                    />
                  </InputGroup>
                  <FieldError className="text-[11px] font-medium text-red-500 block mt-1">{getErrorMessage(errorsReg.fullName)}</FieldError>
                </TextField>

                {/* Email */}
                <TextField isInvalid={!!errorsReg.email} className="flex flex-col gap-1.5 w-full">
                  <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">
                    {t("auth.email")}
                  </Label>
                  <InputGroup className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus-within:!border-secondary rounded-2xl px-3.5 py-2 flex items-center h-[48px] transition-all w-full">
                    <InputGroupPrefix className="flex items-center justify-center me-2">
                      <Mail className="text-slate-400 flex-shrink-0 w-4 h-4" />
                    </InputGroupPrefix>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      autoComplete="username"
                      className="bg-transparent border-0 outline-none w-full h-full text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                      {...registerReg("email")}
                      value={emailRegValue}
                    />
                  </InputGroup>
                  <FieldError className="text-[11px] font-medium text-red-500 block mt-1">{getErrorMessage(errorsReg.email)}</FieldError>
                </TextField>

                {/* Password con meter */}
                <div className="space-y-1">
                  <TextField isInvalid={!!errorsReg.password} className="flex flex-col gap-1.5 w-full">
                    <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">
                      {t("auth.password")}
                    </Label>
                    <InputGroup className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus-within:!border-secondary rounded-2xl px-3.5 py-2 flex items-center h-[48px] transition-all w-full">
                      <InputGroupPrefix className="flex items-center justify-center me-2">
                        <Lock className="text-slate-400 flex-shrink-0 w-4 h-4" />
                      </InputGroupPrefix>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="bg-transparent border-0 outline-none w-full h-full text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                        {...registerReg("password")}
                        value={passwordReg}
                      />
                    </InputGroup>
                    <FieldError className="text-[11px] font-medium text-red-500 block mt-1">{getErrorMessage(errorsReg.password)}</FieldError>
                  </TextField>
                  {passwordReg.length > 0 && (
                    <div className="mt-2 space-y-1 px-1">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                        <span>{t("auth.passwordStrength")}</span>
                        <span>
                          {passwordReg.length < 6
                            ? t("auth.passwordTooShort")
                            : passwordReg.length < 10
                            ? t("auth.passwordWeak")
                            : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/.test(passwordReg)
                            ? t("auth.passwordStrong")
                            : t("auth.passwordMedium")}
                        </span>
                      </div>
                      <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordReg.length < 6
                              ? "w-[20%] bg-red-500"
                              : passwordReg.length < 10
                              ? "w-[50%] bg-orange-500"
                              : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/.test(passwordReg)
                              ? "w-[100%] bg-success"
                              : "w-[75%] bg-yellow-500"
                          }`}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sezione Privato: Nazione Fiscale */}
                {regType === "personal" && (
                  <Controller
                    name="country"
                    control={controlReg}
                    render={({ field }) => (
                      <Select
                        selectedKey={field.value}
                        onSelectionChange={(key: string | number | null) => {
                          // Niente cast `as`: risolve la chiave contro la lista tipizzata dei paesi
                          const code = EU_COUNTRIES.find((c) => c === key);
                          if (code) field.onChange(code);
                        }}
                        isInvalid={!!errorsReg.country}
                        className="flex flex-col gap-1.5 w-full"
                      >
                        <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">{t("auth.fiscalCountry")}</Label>
                        <SelectTrigger className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus-within:!border-secondary rounded-2xl px-3.5 py-2 flex items-center justify-between h-[48px] w-full text-sm text-slate-900 dark:text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectPopover className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-1.5 max-h-[300px] overflow-y-auto z-50">
                          <ListBox className="outline-none">
                            {EU_COUNTRIES.map((code) => {
                              const name = EU_COUNTRY_NAMES[code][currentLocale as "it" | "en" | "es"] || EU_COUNTRY_NAMES[code].en;
                              const flag = EU_COUNTRY_FLAGS[code];
                              return (
                                <ListBoxItem id={code} key={code} textValue={`${flag} ${name}`} className="w-full text-start px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5">
                                  <span className="text-base leading-none">{flag}</span>
                                  <span className="text-xs">{name} ({code})</span>
                                </ListBoxItem>
                              );
                            })}
                          </ListBox>
                        </SelectPopover>
                        <FieldError className="text-[11px] font-medium text-red-500 block mt-1">{getErrorMessage(errorsReg.country)}</FieldError>
                      </Select>
                    )}
                  />
                )}

                {/* Sezione Privato: Codice Fiscale / NIF (Opzionale) */}
                {regType === "personal" && (
                  <TextField isInvalid={!!errorsReg.vatNumber} className="flex flex-col gap-1.5 w-full mt-3">
                    <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">
                      {country === "IT"
                        ? t("auth.vatNumberPersonalIT")
                        : country === "ES"
                        ? t("auth.vatNumberPersonalES")
                        : t("auth.vatNumberPersonalGeneric")}
                    </Label>
                    <InputGroup className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus-within:!border-secondary rounded-2xl px-3.5 py-2 flex items-center h-[48px] w-full">
                      <Input
                        type="text"
                        placeholder={country === "IT"
                          ? t("auth.vatNumberPersonalPlaceholderIT")
                          : country === "ES"
                          ? t("auth.vatNumberPersonalPlaceholderES")
                          : t("auth.vatNumberPersonalPlaceholderGeneric")}
                        className="bg-transparent border-0 outline-none w-full h-full text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0"
                        {...registerReg("vatNumber")}
                        value={vatNumberValue}
                      />
                    </InputGroup>
                    <FieldError className="text-[11px] font-medium text-red-500 block mt-1">{getErrorMessage(errorsReg.vatNumber)}</FieldError>
                  </TextField>
                )}

                {/* Sezione Privato: Indirizzo di residenza con Autocomplete */}
                {regType === "personal" && (
                  <div className="flex flex-col gap-1.5 w-full relative">
                    <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">
                      {t("auth.residenceAddress")}
                    </label>
                    <div className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus-within:!border-secondary rounded-2xl px-3.5 py-2.5 flex items-center h-[48px] transition-all w-full">
                      <input
                        type="text"
                        placeholder={t("auth.addressPlaceholder")}
                        value={manualAddressInput}
                        onChange={(e) => {
                          setManualAddressInput(e.target.value);
                          fetchAddressPredictions(e.target.value, country);
                        }}
                        className="bg-transparent border-0 outline-none w-full h-full text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0"
                      />
                      {isAddressValidating && (
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-secondary border-t-transparent ms-2 shrink-0"></span>
                      )}
                    </div>
                    
                    {/* Lista dei suggerimenti di autocompletamento per privato */}
                    {addressPredictions.length > 0 && (
                      <div className="absolute top-[76px] start-0 end-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-1.5 z-50 max-h-[180px] overflow-y-auto">
                        <ul className="outline-none space-y-0.5">
                          {addressPredictions.map((pred) => (
                            <li
                              key={pred.placeId}
                              onClick={() => {
                                setManualAddressInput(pred.description);
                                handleSelectAddress(pred.description, country, pred.placeId);
                              }}
                              className="w-full text-start px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5"
                            >
                              <svg className="h-3.5 w-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="truncate">{pred.description}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Campi condizionali per Business / Government / Education */}
                {regType !== "personal" && (
                  <div className="space-y-4 p-4 bg-slate-100/50 dark:bg-slate-950/30 border border-slate-200 dark:border-white/5 rounded-2xl mt-4 animate-in fade-in duration-300">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                      {t("auth.orgDetails")} ({
                        regType === "business"
                          ? t("auth.typeBusiness")
                          : regType === "government"
                          ? t("auth.typeGovernment")
                          : t("auth.typeEducation")
                      })
                    </h3>

                    {/* Nazione Fiscale & Partita IVA Affiancati in Griglia */}
                    <div className="grid grid-cols-12 gap-3">
                      <div className="col-span-5">
                        <Controller
                          name="country"
                          control={controlReg}
                          render={({ field }) => (
                            <Select
                              selectedKey={field.value}
                              onSelectionChange={(key: string | number | null) => {
                                // Niente cast `as`: risolve la chiave contro la lista tipizzata dei paesi
                                const code = EU_COUNTRIES.find((c) => c === key);
                                if (code) field.onChange(code);
                              }}
                              isInvalid={!!errorsReg.country}
                              className="flex flex-col gap-1.5 w-full"
                            >
                              <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">{t("auth.country")}</Label>
                              <SelectTrigger className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus-within:!border-secondary rounded-2xl px-3.5 py-2 flex items-center justify-between h-[48px] w-full text-sm text-slate-900 dark:text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectPopover className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-1.5 max-h-[300px] overflow-y-auto z-50">
                                <ListBox className="outline-none">
                                  {EU_COUNTRIES.map((code) => {
                                    const name = EU_COUNTRY_NAMES[code][currentLocale as "it" | "en" | "es"] || EU_COUNTRY_NAMES[code].en;
                                    const flag = EU_COUNTRY_FLAGS[code];
                                    return (
                                      <ListBoxItem id={code} key={code} textValue={`${flag} ${code}`} className="w-full text-start px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5">
                                        <span className="text-base leading-none">{flag}</span>
                                        <span className="text-xs">{name} ({code})</span>
                                      </ListBoxItem>
                                    );
                                  })}
                                </ListBox>
                              </SelectPopover>
                              <FieldError className="text-[11px] font-medium text-red-500 block mt-1">{getErrorMessage(errorsReg.country)}</FieldError>
                            </Select>
                          )}
                        />
                      </div>

                      <div className="col-span-7">
                        <TextField isInvalid={!!errorsReg.vatNumber} className="flex flex-col gap-1.5 w-full">
                          <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">
                            {country === "IT"
                              ? t("auth.vatNumberIT")
                              : country === "ES"
                              ? t("auth.vatNumberES")
                              : t("auth.vatNumberGeneric")}
                          </Label>
                          <InputGroup className={`bg-white/50 dark:bg-slate-950/40 border transition-all rounded-2xl px-3.5 py-2 flex items-center h-[48px] w-full ${
                            isVatVerified
                              ? "border-success shadow-[0_0_10px_rgba(16,185,129,0.15)] focus-within:!border-success"
                              : isVatWarning
                              ? "border-warning shadow-[0_0_10px_color-mix(in_srgb,var(--klx-warning)_15%,transparent)] focus-within:!border-warning"
                              : "border-slate-200 dark:border-white/10 focus-within:!border-secondary"
                          }`}>
                            <Input
                              type="text"
                              placeholder={`${country}123456789`}
                              className="bg-transparent border-0 outline-none w-full h-full text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                              {...registerReg("vatNumber")}
                              value={vatNumberValue}
                            />
                            {(isVatValidating || isVatVerified || isVatWarning) && (
                              <InputGroupSuffix className="flex items-center justify-center ms-2">
                                {isVatValidating ? (
                                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-secondary border-t-transparent"></span>
                                ) : isVatVerified ? (
                                  <div className="flex items-center justify-center">
                                    <span className="flex h-2 w-2 relative me-1">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                                    </span>
                                    <svg className="h-4 w-4 text-success stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center text-warning">
                                    <svg className="h-4 w-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                  </div>
                                )}
                              </InputGroupSuffix>
                            )}
                          </InputGroup>
                          <FieldError className="text-[11px] font-medium text-red-500 block mt-1">{getErrorMessage(errorsReg.vatNumber)}</FieldError>
                        </TextField>
                      </div>
                    </div>

                    {isVatVerified && (
                      <div className="text-[10px] text-success font-bold uppercase tracking-wider mt-1 flex items-center gap-1.5 animate-in fade-in duration-300">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-success"></span>
                        {t("auth.viesValidated")}
                      </div>
                    )}

                    {isVatWarning && !isViesOffline && (
                      <div className="text-[10px] text-warning font-bold uppercase tracking-wider mt-1 flex items-start gap-1.5 animate-in fade-in duration-300 leading-normal max-w-xl">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-warning shrink-0 mt-1"></span>
                        <span>{t("auth.vatWarningInfo")}</span>
                      </div>
                    )}

                    {/* VIES Offline Alert */}
                    {isViesOffline && (
                      <div className="bg-warning/15 dark:bg-warning/10 border border-warning/40 dark:border-warning/20 text-warning rounded-xl p-3 text-xs flex items-start gap-2">
                        <svg className="h-4 w-4 text-warning shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <p className="font-bold">{t("auth.viesOfflineWarning")}</p>
                        </div>
                      </div>
                    )}

                    {/* Campi denominazione ed indirizzo visibili solo se validati o in caso di offline del VIES */}
                    <div className={`space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300 ${
                      (isVatVerified || isVatWarning || isViesOffline) ? "block" : "hidden"
                    }`}>
                      {/* Ragione Sociale */}
                      <TextField isInvalid={!!errorsReg.companyName} className="flex flex-col gap-1.5 w-full">
                        <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">
                          {regType === "business"
                            ? t("auth.companyNameBusiness")
                            : regType === "government"
                            ? t("auth.companyNameGovernment")
                            : t("auth.companyNameEducation")}
                        </Label>
                        <InputGroup className={`border transition-all rounded-2xl px-3.5 py-2 flex items-center h-[48px] w-full ${
                          (isVatVerified && isNameFromVies)
                            ? "bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-white/5 text-slate-500 cursor-not-allowed"
                            : "bg-white/50 dark:bg-slate-950/40 border-slate-200 dark:border-white/10 focus-within:!border-secondary"
                        }`}>
                          <Controller
                            name="companyName"
                            control={controlReg}
                            render={({ field }) => (
                              <Input
                                type="text"
                                readOnly={isVatVerified && isNameFromVies}
                                placeholder={
                                  regType === "business"
                                    ? t("auth.companyNamePlaceholderBusiness")
                                    : regType === "government"
                                    ? t("auth.companyNamePlaceholderGovernment")
                                    : t("auth.companyNamePlaceholderEducation")
                                }
                                className={`bg-transparent border-0 outline-none w-full h-full text-sm text-slate-900 dark:text-white placeholder:text-slate-400 ${
                                  (isVatVerified && isNameFromVies) ? "cursor-not-allowed opacity-75" : ""
                                }`}
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                ref={field.ref}
                                             />
                            )}
                          />
                        </InputGroup>
                        <FieldError className="text-[11px] font-medium text-red-500 block mt-1">{getErrorMessage(errorsReg.companyName)}</FieldError>
                      </TextField>

                      {/* Indirizzo Sede Legale (dati VIES) */}
                      <div className="space-y-1 relative">
                        <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                          {t("auth.legalAddress")}
                        </label>
                        {(isVatVerified && isAddressFromVies) ? (
                          <textarea
                            rows={2}
                            readOnly={true}
                            value={viesAddress}
                            className="w-full px-4 py-3 border rounded-xl text-sm bg-slate-100 dark:bg-slate-950/50 border-slate-200 dark:border-white/5 text-slate-500 cursor-not-allowed resize-none focus:outline-none"
                          />
                        ) : (
                          <>
                            <div className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus-within:!border-secondary rounded-xl px-3.5 py-2.5 flex items-center w-full">
                              <input
                                type="text"
                                placeholder={t("auth.addressPlaceholder")}
                                value={viesAddress}
                                onChange={(e) => {
                                  setViesAddress(e.target.value);
                                  fetchAddressPredictions(e.target.value, country);
                                }}
                                className="bg-transparent border-0 outline-none w-full text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0"
                              />
                              {isAddressValidating && (
                                <span className="animate-spin rounded-full h-4 w-4 border-2 border-secondary border-t-transparent ms-2 shrink-0"></span>
                              )}
                            </div>
                            
                            {/* Suggerimenti Places per azienda */}
                            {addressPredictions.length > 0 && (
                              <div className="absolute top-[68px] start-0 end-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-1.5 z-50 max-h-[180px] overflow-y-auto">
                                <ul className="outline-none space-y-0.5">
                                  {addressPredictions.map((pred) => (
                                    <li
                                      key={pred.placeId}
                                      onClick={() => {
                                        setViesAddress(pred.description);
                                        handleSelectAddress(pred.description, country, pred.placeId);
                                      }}
                                      className="w-full text-start px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5"
                                    >
                                      <svg className="h-3.5 w-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                      </svg>
                                      <span className="truncate">{pred.description}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Campi specifici per l'Italia */}
                    {country === "IT" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        {regType === "business" && (
                          <div className="col-span-2">
                            <TextField isInvalid={!!errorsReg.sdiCode} className="flex flex-col gap-1.5 w-full">
                              <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">
                                {t("auth.sdiCode")}
                              </Label>
                              <InputGroup className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus-within:!border-secondary rounded-2xl px-3.5 py-2 flex items-center h-[48px] transition-all w-full">
                                <Input
                                  type="text"
                                  placeholder={t("auth.sdiPlaceholder")}
                                  maxLength={7}
                                  className="bg-transparent border-0 outline-none w-full h-full text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                                  {...registerReg("sdiCode")}
                                  value={sdiCodeValue}
                                />
                              </InputGroup>
                              <FieldError className="text-[11px] font-medium text-red-500 block mt-1">{getErrorMessage(errorsReg.sdiCode)}</FieldError>
                            </TextField>
                          </div>
                        )}

                        {regType === "government" && (
                          <>
                            <div className="col-span-1">
                              <TextField isInvalid={!!errorsReg.officeCode} className="flex flex-col gap-1.5 w-full">
                                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">
                                  {t("auth.officeCode")}
                                </Label>
                                <InputGroup className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus-within:!border-secondary rounded-2xl px-3.5 py-2 flex items-center h-[48px] transition-all w-full">
                                  <Input
                                    type="text"
                                    placeholder={t("auth.officePlaceholder")}
                                    maxLength={6}
                                    className="bg-transparent border-0 outline-none w-full h-full text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                                    {...registerReg("officeCode")}
                                    value={officeCodeValue}
                                  />
                                </InputGroup>
                                <FieldError className="text-[11px] font-medium text-red-500 block mt-1">{getErrorMessage(errorsReg.officeCode)}</FieldError>
                              </TextField>
                            </div>

                            <div className="col-span-1">
                              <TextField isInvalid={!!errorsReg.cigCode} className="flex flex-col gap-1.5 w-full">
                                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">
                                  {t("auth.cigCode")}
                                </Label>
                                <InputGroup className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus-within:!border-secondary rounded-2xl px-3.5 py-2 flex items-center h-[48px] transition-all w-full">
                                  <Input
                                    type="text"
                                    placeholder="CIG"
                                    className="bg-transparent border-0 outline-none w-full h-full text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                                    {...registerReg("cigCode")}
                                    value={cigCodeValue}
                                  />
                                </InputGroup>
                                <FieldError className="text-[11px] font-medium text-red-500 block mt-1">{getErrorMessage(errorsReg.cigCode)}</FieldError>
                              </TextField>
                            </div>

                            <div className="col-span-2">
                              <TextField isInvalid={!!errorsReg.cupCode} className="flex flex-col gap-1.5 w-full">
                                <Label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-0.5">
                                  {t("auth.cupCode")}
                                </Label>
                                <InputGroup className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 focus-within:!border-secondary rounded-2xl px-3.5 py-2 flex items-center h-[48px] transition-all w-full">
                                  <Input
                                    type="text"
                                    placeholder="CUP"
                                    className="bg-transparent border-0 outline-none w-full h-full text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                                    {...registerReg("cupCode")}
                                    value={cupCodeValue}
                                  />
                                </InputGroup>
                                <FieldError className="text-[11px] font-medium text-red-500 block mt-1">{getErrorMessage(errorsReg.cupCode)}</FieldError>
                              </TextField>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Accettazione Termini */}
                <Controller
                  name="acceptTerms"
                  control={controlReg}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <div className="mt-4 flex items-center">
                        <Checkbox
                          id="acceptTerms"
                          isSelected={!!field.value}
                          onChange={field.onChange}
                          className="text-xs text-slate-600 dark:text-slate-400 select-none cursor-pointer flex items-center gap-3"
                        >
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                          <Checkbox.Content>
                            <Label className="text-xs text-slate-600 dark:text-slate-400 select-none cursor-pointer">
                              {t("auth.acceptTerms")}
                            </Label>
                          </Checkbox.Content>
                        </Checkbox>
                      </div>
                      {errorsReg.acceptTerms && (
                        <p className="text-[11px] font-medium text-red-500 block mt-1">
                          {getErrorMessage(errorsReg.acceptTerms)}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Button
                  unstyled
                  type="submit"
                  isDisabled={loading || !isValidReg}
                  className={`w-full py-6 font-bold bg-gradient-to-r ${brand.logoColor} text-slate-950 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-6 ${
                    (loading || !isValidReg)
                      ? "opacity-50 cursor-not-allowed"
                      : "active:scale-[0.98] cursor-pointer hover:shadow-xl"
                  }`}
                >
                  {loading && <span className="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent"></span>}
                  {t("auth.register")}
                </Button>
              </form>
            )}

            {/* Toggle Login/Signup */}
            <div className="mt-8 text-center text-xs text-slate-500 dark:text-gray-400">
              {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-slate-900 dark:text-white font-bold hover:underline ms-1 cursor-pointer bg-transparent border-0 font-sans"
              >
                {isLogin ? t("auth.registerNow") : t("auth.loginHere")}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer sotto la Card */}
        <div className="mt-8 text-center text-xs text-slate-500 dark:text-gray-500 relative z-10 flex flex-col sm:flex-row items-center gap-3">
          <p>{wlBrand.copyright} · {t("auth.rightsReserved")}</p>
          <span className="hidden sm:inline text-slate-300 dark:text-gray-600">|</span>
          <div className="flex gap-3">
            <a href={`/${currentLocale}/privacy?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri || "")}&state=${encodeURIComponent(state)}${pkcePreserveParams}`} className="hover:text-slate-800 dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href={`/${currentLocale}/terms?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri || "")}&state=${encodeURIComponent(state)}${pkcePreserveParams}`} className="hover:text-slate-800 dark:hover:text-white transition-colors">Termini</a>
          </div>
        </div>
      </AuthLayout.Form>

      {/* Right Column (Marketing panel) */}
      {renderMarketingPanel({ ...brand, name: brandName }, t, isDark)}
    </AuthLayout>
  );
}

// Helper to render the premium marketing panel
function renderMarketingPanel(
  brand: {
    logoColor: string;
    name: string;
    bgGradientLight: string;
    bgGradientDark: string;
    glowColorLight: string;
    glowColorDark: string;
  },
  t: ReturnType<typeof useI18n>,
  isDark: boolean
) {
  const glowColor = isDark ? brand.glowColorDark : brand.glowColorLight;

  return (
    <AuthLayout.Aside>
      {/* Radial glow — RTL: fisico voluto, centraggio simmetrico (left-1/2 + -translate-x-1/2) */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full filter blur-[150px] pointer-events-none ${glowColor} opacity-75 transition-all duration-700`}></div>
      
      {/* Decorative vector grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Top Brand Logo - Rimossi per richiesta utente */}

      {/* Marketing Content */}
      <div className="relative z-10 my-auto max-w-lg space-y-6 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-gray-300 transition-all">
          <span className="flex h-2 w-2 rounded-full bg-success animate-pulse"></span>
          {t("auth.ecosystemBadge")}
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
          {t("auth.marketingTitle")}
        </h1>
        
        <p className="text-slate-600 dark:text-gray-400 text-base leading-relaxed">
          {t("auth.marketingDesc", { brandName: brand.name })}
        </p>

        {/* Feature list */}
        <div className="space-y-4 pt-4 w-full">
          {[
            { title: t("auth.feat1Title"), desc: t("auth.feat1Desc") },
            { title: t("auth.feat2Title"), desc: t("auth.feat2Desc") },
            { title: t("auth.feat3Title"), desc: t("auth.feat3Desc") }
          ].map((feat, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300 w-full text-start">
              <div className={`h-10 w-10 shrink-0 rounded-xl bg-gradient-to-r ${brand.logoColor} flex items-center justify-center font-bold text-slate-950 dark:text-slate-950 text-sm shadow-sm`}>
                {i + 1}
              </div>
              <div className="text-start">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{feat.title}</h3>
                <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer of Marketing panel */}
      <div className="relative z-10 flex justify-between items-center text-xs text-gray-500">
      </div>
    </AuthLayout.Aside>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<GlobalLoader />}>
      <AuthPortal />
    </Suspense>
  );
}
