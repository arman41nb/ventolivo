import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { defaultLocale, isValidLocale } from "@/i18n/config";
import { env } from "@/lib/env";
import { getSafeCustomerNextPath, signInCustomerWithGoogle } from "@/services/customer-auth";

const GOOGLE_OAUTH_STATE_COOKIE = "ventolivo_google_oauth_state";

interface GoogleOAuthStatePayload {
  nonce: string;
  locale: string;
  next: string;
}

function decodeStatePayload(rawValue: string | null): GoogleOAuthStatePayload | null {
  if (!rawValue) {
    return null;
  }

  try {
    const decoded = Buffer.from(rawValue, "base64url").toString("utf8");
    const parsed = JSON.parse(decoded) as GoogleOAuthStatePayload;

    if (!parsed.nonce || !parsed.locale || !parsed.next) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function redirectToLogin(request: NextRequest, input: { locale: string; error: string; next?: string }) {
  const redirectUrl = new URL(`/${input.locale}/account/login`, request.url);
  redirectUrl.searchParams.set("mode", "signin");
  redirectUrl.searchParams.set("error", input.error);

  if (input.next) {
    redirectUrl.searchParams.set("next", input.next);
  }

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set({
    name: GOOGLE_OAUTH_STATE_COOKIE,
    value: "",
    httpOnly: true,
    secure: env.NEXT_PUBLIC_SITE_URL.startsWith("https://"),
    sameSite: "lax",
    maxAge: 0,
    expires: new Date(0),
    path: "/",
  });
  return response;
}

async function exchangeGoogleCode(code: string, redirectUri: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID ?? "",
      client_secret: env.GOOGLE_CLIENT_SECRET ?? "",
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as {
    access_token?: string;
    id_token?: string;
  };
}

async function fetchGoogleUserProfile(accessToken: string) {
  const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!profileResponse.ok) {
    return null;
  }

  return (await profileResponse.json()) as {
    email?: string;
    email_verified?: boolean;
    name?: string;
    picture?: string;
  };
}

function decodeGoogleIdTokenPayload(idToken: string | undefined) {
  if (!idToken) {
    return null;
  }

  const segments = idToken.split(".");

  if (segments.length < 2) {
    return null;
  }

  try {
    const decoded = Buffer.from(segments[1], "base64url").toString("utf8");
    return JSON.parse(decoded) as {
      email?: string;
      email_verified?: boolean;
      name?: string;
      picture?: string;
    };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const rawState = request.nextUrl.searchParams.get("state");
  const state = decodeStatePayload(rawState);
  const rawLocale = state?.locale ?? defaultLocale;
  const locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const nextPath = getSafeCustomerNextPath(state?.next, locale);
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");
  const stateCookie = request.cookies.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;

  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    return redirectToLogin(request, {
      locale,
      error: "google-unavailable",
      next: nextPath,
    });
  }

  if (error) {
    return redirectToLogin(request, {
      locale,
      error: "google-denied",
      next: nextPath,
    });
  }

  if (!state || !stateCookie || state.nonce !== stateCookie) {
    return redirectToLogin(request, {
      locale,
      error: "google-failed",
      next: nextPath,
    });
  }

  if (!code) {
    return redirectToLogin(request, {
      locale,
      error: "google-failed",
      next: nextPath,
    });
  }

  const redirectUri = new URL("/api/account/oauth/google/callback", env.NEXT_PUBLIC_SITE_URL).toString();
  const tokenPayload = await exchangeGoogleCode(code, redirectUri);

  if (!tokenPayload?.access_token) {
    return redirectToLogin(request, {
      locale,
      error: "google-failed",
      next: nextPath,
    });
  }

  const profile = await fetchGoogleUserProfile(tokenPayload.access_token);
  const idTokenPayload = decodeGoogleIdTokenPayload(tokenPayload.id_token);
  const resolvedProfile = {
    email: profile?.email ?? idTokenPayload?.email,
    email_verified: profile?.email_verified ?? idTokenPayload?.email_verified,
    name: profile?.name ?? idTokenPayload?.name,
    picture: profile?.picture ?? idTokenPayload?.picture,
  };

  if (!resolvedProfile.email || resolvedProfile.email_verified === false) {
    return redirectToLogin(request, {
      locale,
      error: "google-failed",
      next: nextPath,
    });
  }

  const authResult = await signInCustomerWithGoogle({
    email: resolvedProfile.email,
    fullName: resolvedProfile.name?.trim() || resolvedProfile.email,
    avatarUrl: resolvedProfile.picture,
    ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
  });

  if (!authResult.ok) {
    return redirectToLogin(request, {
      locale,
      error: authResult.reason === "disabled" ? "disabled" : "google-failed",
      next: nextPath,
    });
  }

  const response = NextResponse.redirect(new URL(nextPath, request.url));
  response.cookies.set({
    name: GOOGLE_OAUTH_STATE_COOKIE,
    value: "",
    httpOnly: true,
    secure: env.NEXT_PUBLIC_SITE_URL.startsWith("https://"),
    sameSite: "lax",
    maxAge: 0,
    expires: new Date(0),
    path: "/",
  });
  return response;
}
