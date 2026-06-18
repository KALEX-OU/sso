import { z } from "zod";

export const EU_COUNTRIES = [
  "AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "EL", "ES", "FI", "FR", "HR", "HU",
  "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK"
] as const;

export type EUCountryCode = typeof EU_COUNTRIES[number];

// Mappa dei nomi dei paesi europei nelle lingue supportate
export const EU_COUNTRY_NAMES: Record<EUCountryCode, { it: string; en: string; es: string }> = {
  AT: { it: "Austria", en: "Austria", es: "Austria" },
  BE: { it: "Belgio", en: "Belgium", es: "Bélgica" },
  BG: { it: "Bulgaria", en: "Bulgaria", es: "Bulgaria" },
  CY: { it: "Cipro", en: "Cyprus", es: "Chipre" },
  CZ: { it: "Repubblica Ceca", en: "Czech Republic", es: "República Checa" },
  DE: { it: "Germania", en: "Germany", es: "Alemania" },
  DK: { it: "Danimarca", en: "Denmark", es: "Dinamarca" },
  EE: { it: "Estonia", en: "Estonia", es: "Estonia" },
  EL: { it: "Grecia", en: "Greece", es: "Grecia" },
  ES: { it: "Spagna", en: "Spain", es: "España" },
  FI: { it: "Finlandia", en: "Finland", es: "Finlandia" },
  FR: { it: "Francia", en: "France", es: "Francia" },
  HR: { it: "Croazia", en: "Croatia", es: "Croacia" },
  HU: { it: "Ungheria", en: "Hungary", es: "Hungría" },
  IE: { it: "Irlanda", en: "Ireland", es: "Irlanda" },
  IT: { it: "Italia", en: "Italy", es: "Italia" },
  LT: { it: "Lituania", en: "Lithuania", es: "Lituania" },
  LU: { it: "Lussemburgo", en: "Luxembourg", es: "Lussemburgo" },
  LV: { it: "Lettonia", en: "Latvia", es: "Letonia" },
  MT: { it: "Malta", en: "Malta", es: "Malta" },
  NL: { it: "Paesi Bassi", en: "Netherlands", es: "Países Bajos" },
  PL: { it: "Polonia", en: "Poland", es: "Polonia" },
  PT: { it: "Portogallo", en: "Portugal", es: "Portugal" },
  RO: { it: "Romania", en: "Romania", es: "Rumanía" },
  SE: { it: "Svezia", en: "Sweden", es: "Suecia" },
  SI: { it: "Slovenia", en: "Slovenia", es: "Eslovenia" },
  SK: { it: "Slovacchia", en: "Slovakia", es: "Eslovaquia" }
};

// Mappa delle emoji delle bandiere per ciascun paese europeo
export const EU_COUNTRY_FLAGS: Record<EUCountryCode, string> = {
  AT: "🇦🇹", BE: "🇧🇪", BG: "🇧🇬", CY: "🇨🇾", CZ: "🇨🇿", DE: "🇩🇪", DK: "🇩🇰", EE: "🇪🇪", EL: "🇬🇷", ES: "🇪🇸",
  FI: "🇫🇮", FR: "🇫🇷", HR: "🇭🇷", HU: "🇭🇺", IE: "🇮🇪", IT: "🇮🇹", LT: "🇱🇹", LU: "🇱🇺", LV: "🇱🇻", MT: "🇲🇹",
  NL: "🇳🇱", PL: "🇵🇱", PT: "🇵🇹", RO: "🇷🇴", SE: "🇸🇪", SI: "🇸🇮", SK: "🇸🇰"
};

// Regex per la Partita IVA di ciascun paese (senza il prefisso del codice nazione di 2 lettere)
export const VAT_REGEX: Record<EUCountryCode, RegExp> = {
  AT: /^U[0-9]{8}$/, // Austria
  BE: /^0?[0-9]{9}$/, // Belgio
  BG: /^[0-9]{9,10}$/, // Bulgaria
  CY: /^[0-9]{8}[A-Z]$/, // Cipro
  CZ: /^[0-9]{8,10}$/, // Repubblica Ceca
  DE: /^[0-9]{9}$/, // Germania
  DK: /^[0-9]{8}$/, // Danimarca
  EE: /^[0-9]{9}$/, // Estonia
  EL: /^[0-9]{9}$/, // Grecia
  ES: /^[0-9A-Z][0-9]{7}[0-9A-Z]$/, // Spagna
  FI: /^[0-9]{8}$/, // Finlandia
  FR: /^[0-9A-Z]{2}[0-9]{9}$/, // Francia
  HR: /^[0-9]{11}$/, // Croazia
  HU: /^[0-9]{8}$/, // Ungheria
  IE: /^[0-9]{7}[A-Z]{1,2}$|^[0-9][A-Z][0-9]{5}[A-Z]$/, // Irlanda
  IT: /^[0-9]{11}$/, // Italia
  LT: /^[0-9]{9,12}$/, // Lituania
  LU: /^[0-9]{8}$/, // Lussemburgo
  LV: /^[0-9]{11}$/, // Lettonia
  MT: /^[0-9]{8}$/, // Malta
  NL: /^[0-9]{9}B[0-9]{2}$/, // Paesi Bassi
  PL: /^[0-9]{10}$/, // Polonia
  PT: /^[0-9]{9}$/, // Portogallo
  RO: /^[0-9]{2,10}$/, // Romania
  SE: /^[0-9]{12}$/, // Svezia
  SI: /^[0-9]{8}$/, // Slovenia
  SK: /^[0-9]{10}$/ // Slovacchia
};

/**
 * Convalida formale del formato di una Partita IVA basata sul paese UE selezionato.
 * Accetta Partite IVA con o senza prefisso nazione.
 */
export function validateVatNumber(vat: string, country: EUCountryCode): boolean {
  const cleanVat = vat.replace(/[\s-]/g, "").toUpperCase();
  let vatToCheck = cleanVat;
  const prefix = cleanVat.substring(0, 2);
  
  // Rimuove il prefisso del paese se presente per effettuare la validazione regex specifica
  if (prefix === country || (country === "EL" && prefix === "GR")) {
    vatToCheck = cleanVat.substring(2);
  }
  
  const regex = VAT_REGEX[country];
  return regex ? regex.test(vatToCheck) : false;
}

export const RegisterSchema = z.object({
  fullName: z.string().min(1, { message: "Il nome completo è richiesto." }),
  email: z.string().email({ message: "Inserisci un indirizzo email valido." }),
  password: z.string().min(6, { message: "La password deve contenere almeno 6 caratteri." }),
  acceptTerms: z.literal(true, {
    message: "Devi accettare la privacy policy e i termini di servizio per procedere."
  }),
  regType: z.enum(["personal", "business", "government", "education"]),
  country: z.enum(EU_COUNTRIES),
  
  // Campi aziendali condizionali
  companyName: z.string().optional(),
  vatNumber: z.string().optional(),
  sdiCode: z.string().optional(),
  officeCode: z.string().optional(),
  cigCode: z.string().optional(),
  cupCode: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.regType === "personal") {
    if (data.vatNumber && data.vatNumber.trim() !== "") {
      const val = data.vatNumber.trim().toUpperCase();
      if (data.country === "IT") {
        const cfRegex = /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/i;
        if (!cfRegex.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["vatNumber"],
            message: "Il formato del Codice Fiscale non è valido."
          });
        }
      } else if (data.country === "ES") {
        const nifRegex = /^[0-9XYZ][0-9]{7}[A-Z]$/i;
        if (!nifRegex.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["vatNumber"],
            message: "Il formato del NIF/NIE non è valido."
          });
        }
      }
    }
  } else {
    // Ragione Sociale è obbligatoria per B2B / B2G / EDU
    if (!data.companyName || data.companyName.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["companyName"],
        message: "La ragione sociale è richiesta."
      });
    }

    // Partita IVA obbligatoria per B2B / B2G
    if (data.regType !== "education") {
      if (!data.vatNumber || data.vatNumber.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["vatNumber"],
          message: "La partita IVA è richiesta."
        });
      } else if (!validateVatNumber(data.vatNumber, data.country)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["vatNumber"],
          message: `Il formato della Partita IVA non è valido per il paese selezionato (${data.country}).`
        });
      }
    }

    // Validazioni specifiche per l'Italia (SDI e OfficeCode)
    if (data.country === "IT") {
      if (data.regType === "business" && data.sdiCode && data.sdiCode.trim() !== "") {
        if (!/^[A-Z0-9]{7}$/i.test(data.sdiCode)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["sdiCode"],
            message: "Il codice destinatario SDI deve essere di esattamente 7 caratteri alfanumerici."
          });
        }
      }

      if (data.regType === "government") {
        if (!data.officeCode || data.officeCode.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["officeCode"],
            message: "Il codice ufficio PA (IPA) è richiesto."
          });
        } else if (!/^[A-Z0-9]{6}$/i.test(data.officeCode)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["officeCode"],
            message: "Il codice ufficio PA deve essere di esattamente 6 caratteri alfanumerici."
          });
        }
      }
    }
  }
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email({ message: "Inserisci un indirizzo email valido." }),
  password: z.string().min(1, { message: "La password è richiesta." }),
  rememberMe: z.boolean().optional()
});

export type LoginInput = z.infer<typeof LoginSchema>;
