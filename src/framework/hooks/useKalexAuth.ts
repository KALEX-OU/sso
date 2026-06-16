import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";

export interface CustomClaims {
  orgId?: string;
  role?: string;
  confirmed?: boolean;
  loc?: string;
  thm?: string;
  seats?: string[];
  perms?: Record<string, number>;
}

export function useKalexAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [claims, setClaims] = useState<CustomClaims | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const tokenResult = await currentUser.getIdTokenResult(true);
          const customClaims = tokenResult.claims as CustomClaims;
          setClaims({
            orgId: customClaims.orgId,
            role: customClaims.role,
            confirmed: customClaims.confirmed,
            loc: customClaims.loc,
            thm: customClaims.thm,
            seats: customClaims.seats || [],
            perms: customClaims.perms || {}
          });
        } catch (err) {
          console.error("[useKalexAuth] Errore caricamento claims:", err);
          setClaims(null);
        }
      } else {
        setClaims(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    const auth = getAuth();
    await signOut(auth);
  };

  const loginRedirect = (clientId: string) => {
    const ssoUrl = process.env.NEXT_PUBLIC_SSO_URL || "https://sso.kalex.cloud";
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    window.location.href = `${ssoUrl}/login?client_id=${clientId}&redirect_uri=${encodeURIComponent(currentUrl)}`;
  };

  const registerRedirect = (clientId: string) => {
    const ssoUrl = process.env.NEXT_PUBLIC_SSO_URL || "https://sso.kalex.cloud";
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    window.location.href = `${ssoUrl}/register?client_id=${clientId}&redirect_uri=${encodeURIComponent(currentUrl)}`;
  };

  return {
    user,
    loading,
    claims,
    orgId: claims?.orgId,
    role: claims?.role,
    confirmed: claims?.confirmed,
    locale: claims?.loc,
    theme: claims?.thm,
    seats: claims?.seats || [],
    perms: claims?.perms || {},
    logout,
    loginRedirect,
    registerRedirect
  };
}
