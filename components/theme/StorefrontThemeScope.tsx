import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { buildStorefrontThemeStyle } from "@/lib/storefront-theme";
import type { StorefrontThemeSettings } from "@/types";

interface StorefrontThemeScopeProps {
  settings: StorefrontThemeSettings;
  className?: string;
  children: ReactNode;
}

export default function StorefrontThemeScope({
  settings,
  className,
  children,
}: StorefrontThemeScopeProps) {
  return (
    <div className={cn("storefront-theme-scope", className)} style={buildStorefrontThemeStyle(settings)}>
      {children}
    </div>
  );
}
