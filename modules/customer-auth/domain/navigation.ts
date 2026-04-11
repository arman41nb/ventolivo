import { defaultLocale, isValidLocale, type Locale } from "@/i18n/config";

function normalizeLocale(locale: string): Locale {
  return isValidLocale(locale) ? locale : defaultLocale;
}

export function getSafeCustomerNextPath(next: string | undefined, locale: string): string {
  const normalizedLocale = normalizeLocale(locale);

  if (
    next?.startsWith(`/${normalizedLocale}/`) &&
    !next.startsWith(`/${normalizedLocale}/admin`) &&
    !next.startsWith("/api/")
  ) {
    return next;
  }

  return `/${normalizedLocale}/account`;
}

export function getCustomerSessionRecoveryPath(input: { locale: string; next?: string }): string {
  const locale = normalizeLocale(input.locale);
  const searchParams = new URLSearchParams({
    locale,
    next: getSafeCustomerNextPath(input.next, locale),
  });

  return `/api/account/session/clear?${searchParams.toString()}`;
}
