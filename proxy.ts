import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

function getLocaleFromRequest(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get("accept-language") ?? "";

  const langMap: Record<string, Locale> = {
    en: "en",
    tr: "tr",
    de: "de",
    fa: "fa",
    ar: "ar",
  };

  for (const lang of acceptLanguage.split(",")) {
    const code = lang.split(";")[0].trim().toLowerCase().slice(0, 2);
    if (langMap[code] && locales.includes(langMap[code])) {
      return langMap[code];
    }
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  const locale = getLocaleFromRequest(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
