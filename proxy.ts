import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { isAdminAuthenticatedRequest } from "@/modules/admin-auth/session";

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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAdminPath(pathname)) {
    return enforceAdminAuth(request);
  }

  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  const locale = getLocaleFromRequest(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(request.nextUrl);
}

function isAdminPath(pathname: string): boolean {
  return locales.some(
    (locale) =>
      pathname === `/${locale}/admin` || pathname.startsWith(`/${locale}/admin/`),
  );
}

function isAdminLoginPath(pathname: string): boolean {
  return locales.some((locale) => pathname === `/${locale}/admin/login`);
}

async function enforceAdminAuth(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = await isAdminAuthenticatedRequest(request);

  if (isAdminLoginPath(pathname)) {
    if (isAuthenticated) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = pathname.replace(/\/login$/, "");
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const redirectUrl = request.nextUrl.clone();
    const locale = pathname.split("/")[1] || defaultLocale;
    redirectUrl.pathname = `/${locale}/admin/login`;
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
