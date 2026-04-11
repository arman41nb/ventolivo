import type { NextRequest } from "next/server";
import { env } from "@/lib/env";

const SESSION_COOKIE_NAME = "ventolivo_customer_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

export interface CustomerSessionCookiePayload {
  sid: string;
  token: string;
  sub: string;
  exp: number;
}

function getSessionSecret(): string {
  const configuredSecret = env.CUSTOMER_SESSION_SECRET?.trim() || env.ADMIN_SESSION_SECRET?.trim();

  if (configuredSecret && configuredSecret.length >= 32) {
    return configuredSecret;
  }

  throw new Error(
    "CUSTOMER_SESSION_SECRET (or ADMIN_SESSION_SECRET fallback) must be set to a long random value before customer auth can be used",
  );
}

function encodeBase64Url(input: Uint8Array): string {
  let binary = "";

  for (const byte of input) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(input: string): Uint8Array {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);

  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function signValue(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));

  return encodeBase64Url(new Uint8Array(signature));
}

export function createSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return encodeBase64Url(bytes);
}

export async function hashSessionToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));

  return encodeBase64Url(new Uint8Array(digest));
}

export function getCustomerSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

export function getCustomerSessionTtlSeconds() {
  return SESSION_TTL_SECONDS;
}

export function getCustomerSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: env.NEXT_PUBLIC_SITE_URL.startsWith("https://"),
    sameSite: "lax" as const,
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  };
}

export function getExpiredCustomerSessionCookieOptions() {
  return {
    ...getCustomerSessionCookieOptions(),
    expires: new Date(0),
    maxAge: 0,
  };
}

export async function createSignedCustomerSessionCookieValue(
  payload: CustomerSessionCookiePayload,
): Promise<string> {
  const encodedPayload = encodeBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await signValue(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export async function verifyCustomerSessionCookieValue(
  token: string | undefined,
): Promise<CustomerSessionCookiePayload | null> {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = await signValue(encodedPayload);

  if (expectedSignature !== signature) {
    return null;
  }

  try {
    const decodedPayload = JSON.parse(
      new TextDecoder().decode(decodeBase64Url(encodedPayload)),
    ) as CustomerSessionCookiePayload;

    if (decodedPayload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return decodedPayload;
  } catch {
    return null;
  }
}

export async function isCustomerAuthenticatedRequest(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifyCustomerSessionCookieValue(token);
  return Boolean(session);
}
