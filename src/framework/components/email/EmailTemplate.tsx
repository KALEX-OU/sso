/** @jsxImportSource react */
// NB: l'api compila con jsxImportSource hono/jsx (tsconfig): il pragma sopra
// forza il runtime REACT per questo file (renderToStaticMarkup richiede
// elementi React veri). Nei frontend il pragma coincide col default.
import React from "react";

/**
 * Template email transazionale del framework — card DS `email/EmailTemplate`.
 *
 * Fonte unica del layout email (prima: stringa HTML cablata in api/lib/email.ts).
 * Viene renderizzato:
 * - dall'API a invio (renderToStaticMarkup, avvolto in <!doctype>+<head> dal chiamante);
 * - nel catalogo Claude Design come card (gruppo email) per l'editing visivo.
 *
 * Regole email-safe (client di posta, non browser):
 * - SOLO stili inline: niente classi, niente <style>, niente CSS variables;
 * - layout a blocchi semplici (max-width) — niente flex/grid;
 * - logo in TINTA UNITA (il gradient-text con background-clip sparisce in
 *   diversi client: difetto del vecchio template, qui corretto);
 * - link del pulsante: solo http(s), tutto il resto degrada a "#".
 * Le stringhe arrivano GIÀ localizzate dal chiamante (i18n dell'api).
 */
export interface EmailTemplateColors {
  background: string;
  card: string;
  cardBorder: string;
  heading: string;
  text: string;
  muted: string;
  primary: string;
  accent: string;
  footerBackground: string;
}

/** Palette di default: design scuro KALEX (coerente col template storico). */
export const EMAIL_DEFAULT_COLORS: EmailTemplateColors = {
  background: "#07080d",
  card: "#0d0e15",
  cardBorder: "#271e3d",
  heading: "#ffffff",
  text: "#94a3b8",
  muted: "#475569",
  primary: "#a855f7",
  accent: "#ec4899",
  footerBackground: "#0b0c12",
};

export interface EmailTemplateProps {
  title: string;
  /** Corpo del messaggio (testo semplice, già localizzato). */
  body: string;
  buttonLabel?: string;
  buttonUrl?: string;
  /** Testo di fallback sotto il pulsante ("Se il pulsante non funziona…"). */
  linkFallbackText?: string;
  /** Riga informativa del footer (già localizzata). */
  footerText: string;
  /** Riga copyright; default derivata da brandName. */
  copyrightText?: string;
  brandName?: string;
  colors?: Partial<EmailTemplateColors>;
}

// L'URL finisce in un href: consenti SOLO http(s) (blocca javascript:/data:).
const safeUrl = (url?: string): string => {
  const trimmed = String(url ?? "").trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : "#";
};

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  title,
  body,
  buttonLabel,
  buttonUrl,
  linkFallbackText,
  footerText,
  copyrightText,
  brandName = "KALEX",
  colors: colorOverrides,
}) => {
  const c: EmailTemplateColors = { ...EMAIL_DEFAULT_COLORS, ...colorOverrides };
  const href = safeUrl(buttonUrl);
  const copyright = copyrightText ?? `© ${brandName}. All rights reserved.`;

  const divider: React.CSSProperties = {
    height: "1px",
    background: `linear-gradient(90deg, transparent, ${c.primary}33, transparent)`,
    margin: "20px 0",
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: c.background,
        padding: "40px 0",
        fontFamily:
          "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
        color: c.text,
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: c.card,
          border: `1px solid ${c.cardBorder}`,
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        {/* Header brand */}
        <div
          style={{
            padding: "30px 40px 20px 40px",
            textAlign: "center",
            borderBottom: `1px solid ${c.primary}1a`,
          }}
        >
          <div
            style={{
              fontSize: "32px",
              fontWeight: 800,
              letterSpacing: "4px",
              color: c.primary,
              margin: 0,
            }}
          >
            {brandName}
          </div>
        </div>

        {/* Contenuto */}
        <div style={{ padding: "40px", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              margin: "0 0 20px 0",
              color: c.heading,
              letterSpacing: "-0.5px",
            }}
          >
            {title}
          </h1>
          <p style={{ fontSize: "16px", lineHeight: 1.6, color: c.text, margin: "0 0 35px 0" }}>
            {body}
          </p>

          {buttonLabel && buttonUrl && (
            <>
              <div style={{ marginBottom: "35px" }}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    padding: "14px 35px",
                    background: `linear-gradient(135deg, ${c.primary} 0%, ${c.accent} 100%)`,
                    backgroundColor: c.primary,
                    color: "#ffffff",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: "15px",
                    borderRadius: "9999px",
                    letterSpacing: "0.5px",
                  }}
                >
                  {buttonLabel}
                </a>
              </div>

              <div style={divider}></div>

              {linkFallbackText && (
                <p
                  style={{
                    fontSize: "11px",
                    color: c.muted,
                    wordBreak: "break-all",
                    margin: "20px 0 0 0",
                    textAlign: "center",
                  }}
                >
                  {linkFallbackText}
                  <br />
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: c.primary, fontWeight: 700, textDecoration: "underline" }}
                  >
                    {href}
                  </a>
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "25px 40px",
            textAlign: "center",
            backgroundColor: c.footerBackground,
            borderTop: `1px solid ${c.primary}0d`,
            fontSize: "12px",
            color: c.muted,
          }}
        >
          <div>{copyright}</div>
          <div style={divider}></div>
          <div>{footerText}</div>
        </div>
      </div>
    </div>
  );
};

EmailTemplate.displayName = "EmailTemplate";
