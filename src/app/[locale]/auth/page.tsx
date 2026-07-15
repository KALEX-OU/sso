/**
 * AUTH v1.2 — `/auth` resta l'entry point cablato nelle RP: redirect server-side
 * a `/auth/login` preservando i parametri OAuth/PKCE (docs/AUTH_V1_2_PLAN.md).
 * Login e registrazione vivono nelle route dedicate `login/` e `register/`.
 */

import { redirect } from "next/navigation";

const PRESERVED_PARAMS = ["client_id", "redirect_uri", "state", "code_challenge", "code_challenge_method", "redirectTo"] as const;

export default async function AuthIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const sp = await searchParams;

  const out = new URLSearchParams();
  for (const key of PRESERVED_PARAMS) {
    const value = sp[key];
    if (typeof value === "string" && value) out.set(key, value);
  }
  const qs = out.toString();

  redirect(`/${locale}/auth/login${qs ? `?${qs}` : ""}`);
}
