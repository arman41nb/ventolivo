import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { defaultLocale, isValidLocale } from "@/i18n/config";
import { env } from "@/lib/env";
import { createSessionToken } from "@/modules/customer-auth";
import { getSafeCustomerNextPath } from "@/services/customer-auth";

const GOOGLE_OAUTH_STATE_COOKIE = "ventolivo_google_oauth_state";

function encodeStatePayload(payload: { nonce: string; locale: string; next: string }) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export async function GET(request: NextRequest) {
  const rawLocale = request.nextUrl.searchParams.get("locale") ?? defaultLocale;
  const locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const nextPath = getSafeCustomerNextPath(
    request.nextUrl.searchParams.get("next") ?? undefined,
    locale,
  );

  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    const fallback = new URL(`/${locale}/account/login`, request.url);
    fallback.searchParams.set("mode", "signin");
    fallback.searchParams.set("error", "google-unavailable");
    if (nextPath) {
      fallback.searchParams.set("next", nextPath);
    }
    return NextResponse.redirect(fallback);
  }

  const nonce = createSessionToken();
  const state = encodeStatePayload({
    nonce,
    locale,
    next: nextPath,
  });
  const redirectUri = new URL("/api/account/oauth/google/callback", env.NEXT_PUBLIC_SITE_URL);
  const googleUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  googleUrl.searchParams.set("client_id", env.GOOGLE_CLIENT_ID);
  googleUrl.searchParams.set("redirect_uri", redirectUri.toString());
  googleUrl.searchParams.set("response_type", "code");
  googleUrl.searchParams.set("scope", "openid email profile");
  googleUrl.searchParams.set("prompt", "select_account");
  googleUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(googleUrl);
  response.cookies.set({
    name: GOOGLE_OAUTH_STATE_COOKIE,
    value: nonce,
    httpOnly: true,
    secure: env.NEXT_PUBLIC_SITE_URL.startsWith("https://"),
    sameSite: "lax",
    maxAge: 60 * 10,
    path: "/",
  });

  return response;
}
