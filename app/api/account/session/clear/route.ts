import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { defaultLocale, isValidLocale } from "@/i18n/config";
import {
  getCustomerSessionCookieName,
  getExpiredCustomerSessionCookieOptions,
  getSafeCustomerNextPath,
} from "@/services/customer-auth";

export async function GET(request: NextRequest) {
  const rawLocale = request.nextUrl.searchParams.get("locale") ?? defaultLocale;
  const locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const nextPath = getSafeCustomerNextPath(
    request.nextUrl.searchParams.get("next") ?? undefined,
    locale,
  );
  const redirectUrl = new URL(`/${locale}/account/login`, request.url);

  redirectUrl.searchParams.set("next", nextPath);

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set({
    name: getCustomerSessionCookieName(),
    value: "",
    ...getExpiredCustomerSessionCookieOptions(),
  });

  return response;
}
