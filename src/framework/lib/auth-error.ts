/**
 * Narrowing UNICO degli errori Firebase Auth (Z2, DS_FOUNDATION_HARDENING_PLAN):
 * sostituisce i `err as { code?: string }` sparsi in settings/auth. Il cast
 * pragmatico vive solo qui; per errori non-oggetto ritorna un oggetto vuoto.
 */
export interface AuthErrorLike {
  code?: string;
  message?: string;
}

export function toAuthError(err: unknown): AuthErrorLike {
  if (typeof err === "object" && err !== null) {
    return err as AuthErrorLike;
  }
  return {};
}
