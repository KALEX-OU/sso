import type { User as FirebaseUser } from "firebase/auth";

export interface CustomClaims {
  orgId?: string;
  role?: string;
  confirmed?: boolean;
  loc?: string;
  thm?: string;
  country?: string;
  seats?: string[];
  services?: Record<string, { status: string; tier: string | null }>;
  perms?: Record<string, number>;
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

export interface RegistryModule {
  name?: string;
  rolePolicies: Record<
    string,
    {
      canRead?: boolean;
      canList?: boolean;
      canCreate?: boolean;
      canUpdate?: boolean;
      canDelete?: boolean;
    }
  >;
}

export interface RegistryApp {
  name: string;
  enabled: boolean;
  modules: Record<string, RegistryModule>;
}

export interface RefreshClaimsResponse {
  success: boolean;
}
