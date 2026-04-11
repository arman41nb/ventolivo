import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  defaultLocale,
  getLocaleCandidates,
  isValidLocale,
  localePreferenceCookieName,
  locales,
} from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { isAdminAuthenticatedRequest } from "@/services/admin-auth";

function withLocalePreference(response: NextResponse, locale: string) {
  response.cookies.set(localePreferenceCookieName, locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}

function getLocaleFromRequest(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(localePreferenceCookieName)?.value;

  if (cookieLocale) {
    const cookieCandidates = getLocaleCandidates(cookieLocale);

    for (const candidate of cookieCandidates) {
      if (locales.includes(candidate)) {
        return candidate;
      }
    }

    const [exactCookieLocale] = cookieCandidates;

    if (exactCookieLocale && isValidLocale(exactCookieLocale)) {
      return exactCookieLocale;
    }
  }

  const acceptLanguage = request.headers.get("accept-language") ?? "";

  for (const language of acceptLanguage.split(",")) {
    const [rawLocale] = language.split(";");

    for (const candidate of getLocaleCandidates(rawLocale ?? "")) {
      if (locales.includes(candidate)) {
        return candidate;
      }
    }
  }

  return defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAdminPath(pathname)) {
    return enforceAdminAuth(request);
  }

  const pathnameHasLocale = hasLocalePrefix(pathname);

  if (pathnameHasLocale) {
    const locale = getPathLocale(pathname);
    return locale ? withLocalePreference(NextResponse.next(), locale) : NextResponse.next();
  }

  const locale = getLocaleFromRequest(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;

  return withLocalePreference(NextResponse.redirect(request.nextUrl), locale);
}

function getPathLocale(pathname: string): string | null {
  const locale = pathname.split("/")[1] ?? "";
  return isValidLocale(locale) ? locale : null;
}

function hasLocalePrefix(pathname: string): boolean {
  return getPathLocale(pathname) !== null;
}

function isAdminPath(pathname: string): boolean {
  return pathname.split("/")[2] === "admin" && hasLocalePrefix(pathname);
}

function isAdminLoginPath(pathname: string): boolean {
  return pathname.split("/")[2] === "admin" && pathname.split("/")[3] === "login";
}

function isAdminRegisterPath(pathname: string): boolean {
  return pathname.split("/")[2] === "admin" && pathname.split("/")[3] === "register";
}

async function enforceAdminAuth(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = pathname.split("/")[1] || defaultLocale;
  const isAuthenticated = await isAdminAuthenticatedRequest(request);

  if (isAdminLoginPath(pathname)) {
    if (isAuthenticated) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = pathname.replace(/\/login$/, "");
      redirectUrl.search = "";
      return withLocalePreference(NextResponse.redirect(redirectUrl), locale);
    }

    return withLocalePreference(NextResponse.next(), locale);
  }

  if (isAdminRegisterPath(pathname)) {
    return withLocalePreference(NextResponse.next(), locale);
  }

  if (!isAuthenticated) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${locale}/admin/login`;
    redirectUrl.searchParams.set("next", pathname);
    return withLocalePreference(NextResponse.redirect(redirectUrl), locale);
  }

  return withLocalePreference(NextResponse.next(), locale);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
