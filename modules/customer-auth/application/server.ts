import "server-only";

import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import type { BuyerIntentRecord, CustomerAdminInsights, CustomerSessionIdentity } from "@/types";
import { enforceCustomerAuthRateLimit } from "@/lib/rate-limit";
import {
  countBuyerIntentRecords,
  countBuyerIntentRecordsSince,
  countCustomerUsers,
  countDistinctBuyerCustomersSince,
  createBuyerIntentRecord,
  createCustomerSessionRecord,
  createCustomerUserRecord,
  deleteCustomerSessionRecord,
  deleteExpiredCustomerSessions,
  getCustomerBuyerIntentRecords,
  getCustomerSessionRecordById,
  getCustomerUserRecordByEmail,
  getRecentBuyerIntentRecords,
  getRecentCustomerUserRecords,
  markCustomerUserLogin,
  updateCustomerUserProfileRecord,
} from "../infrastructure/customer-auth-store";
import {
  isActiveCustomerStatus,
  normalizeCustomerEmail,
  normalizeCustomerName,
  normalizeCustomerPhone,
} from "../domain/customer-user";
import { hashCustomerPassword, verifyCustomerPassword } from "../domain/password";
import {
  createSessionToken,
  createSignedCustomerSessionCookieValue,
  getCustomerSessionCookieName,
  getCustomerSessionCookieOptions,
  getCustomerSessionTtlSeconds,
  getExpiredCustomerSessionCookieOptions,
  hashSessionToken,
  verifyCustomerSessionCookieValue,
} from "../domain/session";

interface AuthenticateCustomerInput {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}

interface RegisterCustomerInput {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  marketingConsent?: boolean;
  ipAddress?: string;
  userAgent?: string;
}

interface SignInCustomerWithGoogleInput {
  email: string;
  fullName: string;
  avatarUrl?: string;
  ipAddress?: string;
  userAgent?: string;
}

interface RecordBuyerIntentInput {
  customerUserId?: number;
  productId?: number;
  locale: string;
  channel?: string;
  source?: string;
  note?: string;
}

type PersistedCustomerIdentity = {
  id: number;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  phone?: string | null;
  status: string;
  marketingConsent: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date | null;
};

export type AuthenticateCustomerResult =
  | { ok: true }
  | {
      ok: false;
      reason: "invalid_credentials" | "disabled" | "rate_limited";
      retryAfterSeconds?: number;
    };

export type RegisterCustomerResult =
  | {
      ok: true;
      user: PersistedCustomerIdentity;
    }
  | {
      ok: false;
      reason: "email_taken" | "rate_limited";
      retryAfterSeconds?: number;
    };

export type SignInCustomerWithGoogleResult =
  | { ok: true }
  | {
      ok: false;
      reason: "disabled";
    };

function getCustomerAuthRateLimitKey(input: {
  email?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  return [
    normalizeCustomerEmail(input.email ?? "") || "unknown",
    input.ipAddress?.trim() || "no-ip",
    input.userAgent?.trim() || "no-agent",
  ].join(":");
}

function mapCustomerIdentity(identity: PersistedCustomerIdentity): CustomerSessionIdentity["user"] {
  return {
    id: identity.id,
    email: identity.email,
    fullName: identity.fullName,
    avatarUrl: identity.avatarUrl ?? undefined,
    phone: identity.phone ?? undefined,
    status: identity.status === "disabled" ? "disabled" : "active",
    marketingConsent: identity.marketingConsent,
    createdAt: identity.createdAt,
    updatedAt: identity.updatedAt,
    lastLoginAt: identity.lastLoginAt ?? undefined,
  };
}

async function setCustomerSessionCookieValue(value: string) {
  const cookieStore = await cookies();

  cookieStore.set(getCustomerSessionCookieName(), value, getCustomerSessionCookieOptions());
}

export async function clearCustomerSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(getCustomerSessionCookieName(), "", getExpiredCustomerSessionCookieOptions());
}

async function issueCustomerSession(
  sessionIdentity: PersistedCustomerIdentity,
  details: {
    ipAddress?: string;
    userAgent?: string;
  },
): Promise<CustomerSessionIdentity> {
  await deleteExpiredCustomerSessions();

  const plainToken = createSessionToken();
  const expiresAt = new Date(Date.now() + getCustomerSessionTtlSeconds() * 1000);
  const session = await createCustomerSessionRecord({
    customerUserId: sessionIdentity.id,
    tokenHash: await hashSessionToken(plainToken),
    expiresAt,
    ipAddress: details.ipAddress,
    userAgent: details.userAgent,
  });

  const cookieValue = await createSignedCustomerSessionCookieValue({
    sid: session.id,
    token: plainToken,
    sub: sessionIdentity.email,
    exp: Math.floor(expiresAt.getTime() / 1000),
  });

  await setCustomerSessionCookieValue(cookieValue);

  return {
    sessionId: session.id,
    expiresAt,
    user: mapCustomerIdentity(sessionIdentity),
  };
}

export async function registerCustomer(input: RegisterCustomerInput): Promise<RegisterCustomerResult> {
  const normalizedEmail = normalizeCustomerEmail(input.email);
  const rateLimit = await enforceCustomerAuthRateLimit(
    getCustomerAuthRateLimitKey({
      email: normalizedEmail,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    }),
  );

  if (!rateLimit.allowed) {
    return {
      ok: false,
      reason: "rate_limited",
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    };
  }

  const existingUser = await getCustomerUserRecordByEmail(normalizedEmail);

  if (existingUser) {
    return {
      ok: false,
      reason: "email_taken",
    };
  }

  const customerUser = await createCustomerUserRecord({
    email: normalizedEmail,
    fullName: normalizeCustomerName(input.fullName),
    phone: normalizeCustomerPhone(input.phone),
    passwordHash: await hashCustomerPassword(input.password),
    marketingConsent: input.marketingConsent ?? false,
    status: "active",
  });

  const lastLoginAt = new Date();
  await markCustomerUserLogin(customerUser.id);
  await issueCustomerSession(
    {
      ...customerUser,
      lastLoginAt,
    },
    {
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    },
  );

  return {
    ok: true,
    user: {
      ...customerUser,
      lastLoginAt,
    },
  };
}

export async function signInCustomerWithGoogle(
  input: SignInCustomerWithGoogleInput,
): Promise<SignInCustomerWithGoogleResult> {
  const normalizedEmail = normalizeCustomerEmail(input.email);
  const normalizedFullName = normalizeCustomerName(input.fullName);
  const normalizedAvatarUrl = input.avatarUrl?.trim() || null;
  const existingCustomer = await getCustomerUserRecordByEmail(normalizedEmail);

  if (existingCustomer && !isActiveCustomerStatus(existingCustomer.status)) {
    return {
      ok: false,
      reason: "disabled",
    };
  }

  const customerUser =
    existingCustomer ??
    (await createCustomerUserRecord({
      email: normalizedEmail,
      fullName: normalizedFullName,
      avatarUrl: normalizedAvatarUrl ?? undefined,
      passwordHash: await hashCustomerPassword(createSessionToken()),
      status: "active",
      marketingConsent: false,
    }));

  const customerUserWithProfile =
    existingCustomer &&
    (existingCustomer.fullName !== normalizedFullName ||
      (normalizedAvatarUrl && existingCustomer.avatarUrl !== normalizedAvatarUrl))
      ? await updateCustomerUserProfileRecord(existingCustomer.id, {
          fullName: normalizedFullName,
          avatarUrl: normalizedAvatarUrl,
        })
      : customerUser;

  const lastLoginAt = new Date();
  await markCustomerUserLogin(customerUserWithProfile.id);
  await issueCustomerSession(
    {
      ...customerUserWithProfile,
      lastLoginAt,
    },
    {
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    },
  );

  return { ok: true };
}

export async function authenticateCustomer(
  input: AuthenticateCustomerInput,
): Promise<AuthenticateCustomerResult> {
  const normalizedEmail = normalizeCustomerEmail(input.email);
  const rateLimit = await enforceCustomerAuthRateLimit(
    getCustomerAuthRateLimitKey({
      email: normalizedEmail,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    }),
  );

  if (!rateLimit.allowed) {
    return {
      ok: false,
      reason: "rate_limited",
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    };
  }

  const customerUser = await getCustomerUserRecordByEmail(normalizedEmail);

  if (!customerUser) {
    return {
      ok: false,
      reason: "invalid_credentials",
    };
  }

  if (!isActiveCustomerStatus(customerUser.status)) {
    return {
      ok: false,
      reason: "disabled",
    };
  }

  const isValidPassword = await verifyCustomerPassword(input.password, customerUser.passwordHash);

  if (!isValidPassword) {
    return {
      ok: false,
      reason: "invalid_credentials",
    };
  }

  const lastLoginAt = new Date();
  await markCustomerUserLogin(customerUser.id);
  await issueCustomerSession(
    {
      ...customerUser,
      lastLoginAt,
    },
    {
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    },
  );

  return { ok: true };
}

async function resolveCustomerSession(
  cookieValue: string | undefined,
): Promise<CustomerSessionIdentity | null> {
  const payload = await verifyCustomerSessionCookieValue(cookieValue);

  if (!payload || !payload.sid || payload.sid.trim().length === 0 || !payload.token) {
    return null;
  }

  const session = await getCustomerSessionRecordById(payload.sid);

  if (!session || session.expiresAt.getTime() <= Date.now()) {
    return null;
  }

  if (!isActiveCustomerStatus(session.customerUser.status)) {
    return null;
  }

  const tokenHash = await hashSessionToken(payload.token);

  if (session.tokenHash !== tokenHash) {
    return null;
  }

  return {
    sessionId: session.id,
    expiresAt: session.expiresAt,
    user: mapCustomerIdentity(session.customerUser),
  };
}

export async function getCustomerSession(): Promise<CustomerSessionIdentity | null> {
  const cookieStore = await cookies();
  return resolveCustomerSession(cookieStore.get(getCustomerSessionCookieName())?.value);
}

export async function getCustomerSessionFromRequest(
  request: NextRequest,
): Promise<CustomerSessionIdentity | null> {
  return resolveCustomerSession(request.cookies.get(getCustomerSessionCookieName())?.value);
}

export async function requireCustomerSession() {
  const session = await getCustomerSession();

  if (!session) {
    throw new Error("Unauthorized customer action");
  }

  return session;
}

export async function logoutCustomerSession() {
  const session = await getCustomerSession();

  if (!session) {
    await clearCustomerSessionCookie();
    return;
  }

  await deleteCustomerSessionRecord(session.sessionId);
  await clearCustomerSessionCookie();
}

export async function recordBuyerIntent(input: RecordBuyerIntentInput) {
  await createBuyerIntentRecord({
    customerUserId: input.customerUserId,
    productId: input.productId,
    locale: input.locale,
    channel: input.channel ?? "whatsapp",
    source: input.source?.trim() || undefined,
    note: input.note?.trim() || undefined,
  });
}

function mapIntentRecord(record: Awaited<ReturnType<typeof getRecentBuyerIntentRecords>>[number]): BuyerIntentRecord {
  return {
    id: record.id,
    locale: record.locale,
    channel: record.channel,
    source: record.source ?? undefined,
    note: record.note ?? undefined,
    createdAt: record.createdAt,
    product: record.product
      ? {
          id: record.product.id,
          slug: record.product.slug,
          name: record.product.name,
          price: record.product.price,
        }
      : undefined,
    customer: record.customerUser
      ? {
          id: record.customerUser.id,
          fullName: record.customerUser.fullName,
          email: record.customerUser.email,
          avatarUrl: record.customerUser.avatarUrl ?? undefined,
        }
      : undefined,
  };
}

export async function getCustomerBuyerIntents(
  customerUserId: number,
  limit = 12,
): Promise<BuyerIntentRecord[]> {
  const intents = await getCustomerBuyerIntentRecords(customerUserId, limit);

  return intents.map((intent) => ({
    id: intent.id,
    locale: intent.locale,
    channel: intent.channel,
    source: intent.source ?? undefined,
    note: intent.note ?? undefined,
    createdAt: intent.createdAt,
    product: intent.product
      ? {
          id: intent.product.id,
          slug: intent.product.slug,
          name: intent.product.name,
          price: intent.product.price,
        }
      : undefined,
  }));
}

export async function getCustomerAdminInsights(input?: {
  recentUsersLimit?: number;
  recentIntentsLimit?: number;
  windowDays?: number;
}): Promise<CustomerAdminInsights> {
  const recentUsersLimit = Math.max(1, input?.recentUsersLimit ?? 12);
  const recentIntentsLimit = Math.max(1, input?.recentIntentsLimit ?? 20);
  const windowDays = Math.max(1, input?.windowDays ?? 30);
  const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);

  const [
    userCount,
    intentCount,
    intentCountInWindow,
    activeBuyerCountInWindow,
    recentUsers,
    recentIntents,
  ] = await Promise.all([
    countCustomerUsers(),
    countBuyerIntentRecords(),
    countBuyerIntentRecordsSince(since),
    countDistinctBuyerCustomersSince(since),
    getRecentCustomerUserRecords(recentUsersLimit),
    getRecentBuyerIntentRecords(recentIntentsLimit),
  ]);

  return {
    totals: {
      users: userCount,
      intents: intentCount,
      intentsInWindow: intentCountInWindow,
      activeBuyersInWindow: activeBuyerCountInWindow,
    },
    recentUsers: recentUsers.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      avatarUrl: user.avatarUrl ?? undefined,
      phone: user.phone ?? undefined,
      status: user.status === "disabled" ? "disabled" : "active",
      marketingConsent: user.marketingConsent,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt ?? undefined,
      intentCount: user._count.buyerIntents,
    })),
    recentIntents: recentIntents.map(mapIntentRecord),
  };
}
