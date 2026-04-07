import type { ReactNode } from "react";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { logoutAdminAction } from "@/app/[locale]/admin/actions";
import { getSiteLocales } from "@/modules/site-content";
import AdminShellClient from "@/components/admin/AdminShellClient";

interface AdminShellProps {
  locale: Locale;
  dictionary: Dictionary;
  title: string;
  description: string;
  children: ReactNode;
  sessionSummary?: {
    username: string;
    expiresLabel: string;
  };
  navItems?: Array<{
    href: string;
    label: string;
    active?: boolean;
  }>;
  primaryAction?: {
    href: string;
    label: string;
  };
  secondaryAction?: {
    href: string;
    label: string;
  };
  immersivePreview?: boolean;
}

export default async function AdminShell({
  locale,
  dictionary,
  title,
  description,
  children,
  sessionSummary,
  navItems,
  primaryAction,
  secondaryAction,
  immersivePreview = false,
}: AdminShellProps) {
  const supportedLocales = await getSiteLocales();
  const activeItem = navItems?.find((item) => item.active);

  return (
    <AdminShellClient
      locale={locale}
      dictionary={dictionary}
      title={title}
      description={description}
      sessionSummary={sessionSummary}
      navItems={navItems}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      supportedLocales={supportedLocales}
      activeItemLabel={activeItem?.label}
      immersivePreview={immersivePreview}
      logoutAction={logoutAdminAction}
    >
      {children}
    </AdminShellClient>
  );
}
