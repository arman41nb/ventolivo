import { defaultLocale, isValidLocale, type Locale } from "@/i18n/config";

function normalizeAdminLocale(locale: string): Locale {
  return isValidLocale(locale) ? locale : defaultLocale;
}

export function getSafeAdminNextPath(next: string | undefined, locale: string): string {
  const normalizedLocale = normalizeAdminLocale(locale);

  if (next?.startsWith(`/${normalizedLocale}/admin`)) {
    return next;
  }

  return `/${normalizedLocale}/admin`;
}

export function getAdminSessionRecoveryPath(input: { locale: string; next?: string }): string {
  const locale = normalizeAdminLocale(input.locale);
  const searchParams = new URLSearchParams({
    locale,
    next: getSafeAdminNextPath(input.next, locale),
  });

  return `/api/admin/session/clear?${searchParams.toString()}`;
}
