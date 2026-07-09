import type { NextConfig } from "next";

// Security headers (piano Identity Center 4.6).
// CSP: allowlist calibrata sullo stack reale (Firebase Auth/Firestore/App Check, reCAPTCHA
// Enterprise, Google Maps, Stripe). 'unsafe-inline'/'unsafe-eval' restano necessari a
// Next/React e agli SDK Google: la protezione primaria è il blocco delle ORIGINI estranee
// (script-src/connect-src), object-src 'none' e frame-ancestors 'none' (anti-clickjacking).
// ⚠️ Se si aggiunge un servizio esterno nuovo (SDK/endpoint), va aggiunto qui, altrimenti
// il browser lo blocca in prod: verificare in staging dopo ogni modifica.
// Dominio base per-ambiente (dev.kalexs.com / staging.kalexs.com / kalexs.com), guidato da env.
const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN?.trim() || "kalexs.com";

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://apis.google.com https://js.stripe.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  `connect-src 'self' https://*.googleapis.com https://*.google.com https://*.${BASE_DOMAIN} wss://*.firebaseio.com https://*.firebaseio.com https://api.stripe.com https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com`,
  "frame-src https://www.google.com https://recaptcha.google.com https://js.stripe.com https://hooks.stripe.com https://*.firebaseapp.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests"
].join("; ");

const SECURITY_HEADERS = [
  // 2 anni, sottodomini inclusi: l'intera suite vive su *.kalexs.com in HTTPS
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), payment=(self)" }
];

const nextConfig: NextConfig = {
  // Output standalone: bundle minimale (server.js + dipendenze tracciate) per immagini Docker slim.
  output: "standalone",
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS
      }
    ];
  }
};

export default nextConfig;
