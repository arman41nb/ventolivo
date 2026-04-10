import type { Locale } from "@/i18n/config";

export type AdminSectionKey = "dashboard" | "translations" | "products" | "media" | "siteContent";

export interface AdminNavigationLabels {
  dashboard: string;
  translations: string;
  products: string;
  media: string;
  siteContent: string;
}

export function getAdminNavItems(
  locale: Locale,
  activeSection: AdminSectionKey,
  labels: AdminNavigationLabels,
) {
  return [
    {
      href: `/${locale}/admin`,
      label: labels.dashboard,
      active: activeSection === "dashboard",
    },
    {
      href: `/${locale}/admin/translations`,
      label: labels.translations,
      active: activeSection === "translations",
    },
    {
      href: `/${locale}/admin/products`,
      label: labels.products,
      active: activeSection === "products",
    },
    {
      href: `/${locale}/admin/media`,
      label: labels.media,
      active: activeSection === "media",
    },
    {
      href: `/${locale}/admin/site`,
      label: labels.siteContent,
      active: activeSection === "siteContent",
    },
  ];
}
