import type React from "react";
import * as LucideIcons from "lucide-react";
import type { LucideIconName } from "./resources.config";

/**
 * Resolver UNICO delle icone Lucide dinamiche (Z3, DS_FOUNDATION_HARDENING_PLAN):
 * prima triplicato identico in application/UserSidebar/UserCommandPalette.
 * L'unico narrowing `as` del lookup dinamico vive QUI (l'indice `keyof typeof
 * LucideIcons` include anche export non-componente: il fallback copre i buchi).
 */
export type LucideIconComponent = React.ComponentType<{ className?: string }>;

export function resolveLucideIcon(
  iconName: LucideIconName | undefined,
  fallback: LucideIconComponent
): LucideIconComponent {
  if (!iconName) return fallback;
  const IconComponent = LucideIcons[iconName] as LucideIconComponent;
  return IconComponent || fallback;
}
