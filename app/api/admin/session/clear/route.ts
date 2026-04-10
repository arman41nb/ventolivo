import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { defaultLocale, isValidLocale } from "@/i18n/config";
import {
  getAdminSessionCookieName,
  getExpiredAdminSessionCookieOptions,
  getSafeAdminNextPath,
} from "@/services/admin-auth";

export async function GET(request: NextRequest) {
  const rawLocale = request.nextUrl.searchParams.get("locale") ?? defaultLocale;
  const locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const nextPath = getSafeAdminNextPath(
    request.nextUrl.searchParams.get("next") ?? undefined,
    locale,
  );
  const redirectUrl = new URL(`/${locale}/admin/login`, request.url);

  redirectUrl.searchParams.set("next", nextPath);

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set({
    name: getAdminSessionCookieName(),
    value: "",
    ...getExpiredAdminSessionCookieOptions(),
  });

  return response;
}
