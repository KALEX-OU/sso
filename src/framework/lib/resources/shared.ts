// framework/src/lib/resources/shared.ts
// Costanti e tipi condivisi della SSOT. Questo file NON deve avere import:
// è compilato anche dal backend api (NodeNext) dove le altre lib del framework non esistono.

// Forma "runtime-friendly" del registro applicazioni/moduli (usata da getRegistryApp).
// Vive nella SSOT (non in types.ts) perché descrive la forma del registro stesso;
// types.ts la ri-esporta per retrocompatibilità dei consumer frontend.
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

export const STRIPE_TAX_CODE_KEYS = [
  "txcd_10103000",
  "txcd_10102000",
  "txcd_10101000",
  "txcd_10104000",
  "txcd_20030000",
  "txcd_10503000",
  "txcd_00000000",
  "txcd_99999999"
] as const;
