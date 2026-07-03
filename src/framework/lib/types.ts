import type { User as FirebaseUser } from "firebase/auth";

export interface CustomClaims {
  uId?: string;
  uName?: string;
  uEmail?: string;
  uAvatar?: string;
  orgId?: string;
  orgName?: string;
  uRole?: string;
  role?: string;
  orgRoles?: Record<string, "buyer" | "seller" | "both">;
  confirmed?: boolean;
  loc?: string;
  thm?: string;
  lat?: number | null;
  lng?: number | null;
  alt?: number | null;
  country?: string;
  rbac?: {
    apps: {
      [appId: string]: {
        mode: "buyer" | "seller" | "both";
        expire: number;
        onboarded: boolean;
        [moduleName: string]: number | string | boolean;
      };
    };
  };
  [key: string]: unknown;
}

export interface UserOrganization {
  orgId: string;
  name: string;
  type: string;
  country: string;
  confirmed: boolean;
  role: string;
  isTest?: boolean;
  viesValidated?: boolean;
  subscriptions_on_organization?: Array<{
    subscriptionId: string;
    status: string;
    appId: string;
    cancelAtPeriodEnd?: boolean;
    currentPeriodEnd?: string;
    items?: unknown;
  }>;
  [key: string]: unknown;
}

export interface DashboardData {
  success: boolean;
  status?: string;
  message?: string;
  user?: {
    uid: string;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
    mobile: string | null;
    locale: string;
    theme: string;
    emailVerified: boolean;
    [key: string]: unknown;
  };
  organization?: UserOrganization | null;
  userOrganizations_on_user?: Array<{
    role: string;
    organization: UserOrganization;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

export interface DashboardContextType {
  user: FirebaseUser | null;
  claims: CustomClaims | null;
  loading: boolean;
  dbData: DashboardData | null;
  refreshClaims: (targetOrgId?: string) => Promise<void>;
  hasPermission: (module: string, action: "read" | "create" | "update" | "delete") => boolean;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  setError: (msg: string) => void;
}

export interface ToastState {
  message: string;
  type: "success" | "error" | "info";
}

// RegistryModule/RegistryApp sono definiti nella SSOT (resources/shared.ts): ri-esportati
// da qui per retrocompatibilità dei consumer frontend.
export type { RegistryApp, RegistryModule } from "./resources/shared";

export interface RefreshClaimsResponse {
  success: boolean;
}
