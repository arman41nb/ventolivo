import "server-only";

import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import type { AdminAuditLogEntry, AdminSessionIdentity } from "@/types";
import { env } from "@/lib/env";
import { enforceAdminAuthRateLimit } from "@/lib/rate-limit";
import {
  countAdminUsers,
  createAdminSessionRecord,
  createAdminUserRecord,
  createAuditLogRecord,
  deleteAdminSessionRecord,
  deleteExpiredAdminSessions,
  getAdminSessionRecordById,
  getAdminUserRecordByEmail,
  getAdminUserRecordByIdentifier,
  getAdminUserRecordByUsername,
  getRecentAuditLogRecords,
  markAdminUserLogin,
} from "../infrastructure/admin-auth-store";
import {
  getDefaultAdminRole,
  isActiveAdminStatus,
  normalizeAdminEmail,
  normalizeAdminIdentifier,
  normalizeAdminUsername,
} from "../domain/admin-user";
import { hashAdminPassword, verifyAdminPassword } from "../domain/password";
import {
  createSessionToken,
  createSignedSessionCookieValue,
  getAdminSessionCookieName,
  getAdminSessionCookieOptions,
  getAdminSessionTtlSeconds,
  getExpiredAdminSessionCookieOptions,
  hashSessionToken,
  verifySessionCookieValue,
} from "../domain/session";

interface AuthenticateAdminInput {
  identifier: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}

interface RegisterAdminInput {
  username: string;
  email: string;
  displayName: string;
  password: string;
  setupToken?: string;
  creator?: {
    id: number;
    username: string;
    role: "owner" | "manager";
    status: "active" | "disabled";
  };
  ipAddress?: string;
  userAgent?: string;
}

type PersistedAdminIdentity = {
  id: number;
  username: string;
  email?: string | null;
  displayName?: string | null;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date | null;
};

export type AuthenticateAdminResult =
  | { ok: true }
  | {
      ok: false;
      reason: "invalid_credentials" | "disabled" | "rate_limited";
      retryAfterSeconds?: number;
    };

export type RegisterAdminResult =
  | {
      ok: true;
      mode: "setup" | "team";
      user: PersistedAdminIdentity;
    }
  | {
      ok: false;
      reason:
        | "registration_closed"
        | "username_taken"
        | "email_taken"
        | "rate_limited"
        | "insufficient_permissions"
        | "setup_token_required"
        | "invalid_setup_token";
      retryAfterSeconds?: number;
    };

function getAdminAuthRateLimitKey(input: {
  identifier?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  return [
    normalizeAdminIdentifier(input.identifier ?? "") || "unknown",
    input.ipAddress?.trim() || "no-ip",
    input.userAgent?.trim() || "no-agent",
  ].join(":");
}

function mapAdminIdentity(identity: PersistedAdminIdentity): AdminSessionIdentity["user"] {
  return {
    id: identity.id,
    username: identity.username,
    email: identity.email ?? undefined,
    displayName: identity.displayName ?? undefined,
    role: identity.role === "manager" ? "manager" : "owner",
    status: identity.status === "disabled" ? "disabled" : "active",
    createdAt: identity.createdAt,
    updatedAt: identity.updatedAt,
    lastLoginAt: identity.lastLoginAt ?? undefined,
  };
}

async function setAdminSessionCookieValue(value: string) {
  const cookieStore = await cookies();

  cookieStore.set(getAdminSessionCookieName(), value, getAdminSessionCookieOptions());
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(getAdminSessionCookieName(), "", getExpiredAdminSessionCookieOptions());
}

async function bootstrapFirstAdminIfAllowed(identifier: string, password: string) {
  const adminCount = await countAdminUsers();

  if (adminCount > 0) {
    return null;
  }

  const bootstrapUsername = env.ADMIN_USERNAME?.trim();
  const bootstrapPassword = env.ADMIN_PASSWORD;

  if (!bootstrapUsername || !bootstrapPassword) {
    return null;
  }

  if (normalizeAdminIdentifier(identifier) !== normalizeAdminUsername(bootstrapUsername)) {
    return null;
  }

  if (password !== bootstrapPassword) {
    return null;
  }

  const adminUser = await createAdminUserRecord({
    username: normalizeAdminUsername(bootstrapUsername),
    displayName: bootstrapUsername,
    role: "owner",
    status: "active",
    passwordHash: await hashAdminPassword(password),
  });

  await createAuditLogRecord({
    action: "admin.bootstrap",
    adminUserId: adminUser.id,
    actorLabel: adminUser.displayName ?? adminUser.username,
    metadata: {
      event: "Initial admin account was provisioned from bootstrap environment variables.",
    },
  });

  return adminUser;
}

async function issueAdminSession(
  sessionIdentity: PersistedAdminIdentity,
  details: {
    ipAddress?: string;
    userAgent?: string;
  },
): Promise<AdminSessionIdentity> {
  await deleteExpiredAdminSessions();

  const plainToken = createSessionToken();
  const expiresAt = new Date(Date.now() + getAdminSessionTtlSeconds() * 1000);
  const session = await createAdminSessionRecord({
    adminUserId: sessionIdentity.id,
    tokenHash: await hashSessionToken(plainToken),
    expiresAt,
    ipAddress: details.ipAddress,
    userAgent: details.userAgent,
  });

  const cookieValue = await createSignedSessionCookieValue({
    sid: session.id,
    token: plainToken,
    sub: sessionIdentity.username,
    exp: Math.floor(expiresAt.getTime() / 1000),
  });

  await setAdminSessionCookieValue(cookieValue);

  return {
    sessionId: session.id,
    expiresAt,
    user: mapAdminIdentity(sessionIdentity),
  };
}

export async function getAdminRegistrationState() {
  const adminCount = await countAdminUsers();

  return {
    adminCount,
    isFirstAdminSetup: adminCount === 0,
    setupTokenRequired: adminCount === 0 && Boolean(env.ADMIN_SETUP_TOKEN?.trim()),
  };
}

export async function authenticateAdmin(
  input: AuthenticateAdminInput,
): Promise<AuthenticateAdminResult> {
  const identifier = input.identifier.trim();
  const rateLimit = await enforceAdminAuthRateLimit(
    getAdminAuthRateLimitKey({
      identifier,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    }),
  );

  if (!rateLimit.allowed) {
    await createAuditLogRecord({
      action: "admin.login_rate_limited",
      actorLabel: identifier,
      metadata: {
        identifier,
        retryAfterSeconds: rateLimit.retryAfterSeconds,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    });

    return {
      ok: false,
      reason: "rate_limited",
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    };
  }

  const normalizedIdentifier = normalizeAdminIdentifier(identifier);
  let adminUser = await getAdminUserRecordByIdentifier(identifier);

  if (!adminUser && normalizedIdentifier !== identifier) {
    adminUser = await getAdminUserRecordByIdentifier(normalizedIdentifier);
  }

  if (!adminUser) {
    adminUser = await bootstrapFirstAdminIfAllowed(identifier, input.password);
  }

  if (!adminUser) {
    await createAuditLogRecord({
      action: "admin.login_failed",
      actorLabel: identifier,
      metadata: {
        reason: "unknown_identifier",
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    });

    return {
      ok: false,
      reason: "invalid_credentials",
    };
  }

  if (!isActiveAdminStatus(adminUser.status)) {
    await createAuditLogRecord({
      action: "admin.login_blocked",
      adminUserId: adminUser.id,
      actorLabel: adminUser.displayName ?? adminUser.username,
      metadata: {
        reason: "inactive_account",
        status: adminUser.status,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    });

    return {
      ok: false,
      reason: "disabled",
    };
  }

  const isValidPassword = await verifyAdminPassword(input.password, adminUser.passwordHash);

  if (!isValidPassword) {
    await createAuditLogRecord({
      action: "admin.login_failed",
      adminUserId: adminUser.id,
      actorLabel: adminUser.displayName ?? adminUser.username,
      metadata: {
        reason: "invalid_password",
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    });

    return {
      ok: false,
      reason: "invalid_credentials",
    };
  }

  const lastLoginAt = new Date();
  await markAdminUserLogin(adminUser.id);
  await issueAdminSession(
    {
      ...adminUser,
      lastLoginAt,
    },
    {
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    },
  );
  await createAuditLogRecord({
    action: "admin.login_succeeded",
    adminUserId: adminUser.id,
    actorLabel: adminUser.displayName ?? adminUser.username,
    metadata: {
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    },
  });

  return { ok: true };
}

export async function registerAdmin(input: RegisterAdminInput): Promise<RegisterAdminResult> {
  const rateLimit = await enforceAdminAuthRateLimit(
    getAdminAuthRateLimitKey({
      identifier: `${input.username}:${input.email}`,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    }),
  );

  if (!rateLimit.allowed) {
    await createAuditLogRecord({
      action: "admin.register_rate_limited",
      actorLabel: input.email,
      metadata: {
        username: input.username,
        retryAfterSeconds: rateLimit.retryAfterSeconds,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    });

    return {
      ok: false,
      reason: "rate_limited",
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    };
  }

  const registrationState = await getAdminRegistrationState();
  const normalizedUsername = normalizeAdminUsername(input.username);
  const normalizedEmail = normalizeAdminEmail(input.email);
  const isSetupRegistration = registrationState.isFirstAdminSetup;

  if (!isSetupRegistration) {
    if (!input.creator) {
      return {
        ok: false,
        reason: "registration_closed",
      };
    }

    if (input.creator.role !== "owner" || input.creator.status !== "active") {
      await createAuditLogRecord({
        action: "admin.register_blocked",
        adminUserId: input.creator.id,
        actorLabel: input.creator.username,
        metadata: {
          reason: "insufficient_permissions",
          creatorRole: input.creator.role,
          creatorStatus: input.creator.status,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        },
      });

      return {
        ok: false,
        reason: "insufficient_permissions",
      };
    }
  }

  if (isSetupRegistration && env.ADMIN_SETUP_TOKEN?.trim()) {
    const providedToken = input.setupToken?.trim() ?? "";

    if (!providedToken) {
      return {
        ok: false,
        reason: "setup_token_required",
      };
    }

    if (providedToken !== env.ADMIN_SETUP_TOKEN.trim()) {
      await createAuditLogRecord({
        action: "admin.register_failed",
        actorLabel: normalizedEmail,
        metadata: {
          reason: "invalid_setup_token",
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        },
      });

      return {
        ok: false,
        reason: "invalid_setup_token",
      };
    }
  }

  const [existingUsername, existingEmail] = await Promise.all([
    getAdminUserRecordByUsername(normalizedUsername),
    getAdminUserRecordByEmail(normalizedEmail),
  ]);

  if (existingUsername) {
    return {
      ok: false,
      reason: "username_taken",
    };
  }

  if (existingEmail) {
    return {
      ok: false,
      reason: "email_taken",
    };
  }

  const adminUser = await createAdminUserRecord({
    username: normalizedUsername,
    email: normalizedEmail,
    displayName: input.displayName.trim(),
    role: getDefaultAdminRole(registrationState.adminCount),
    status: "active",
    passwordHash: await hashAdminPassword(input.password),
  });

  const metadata = {
    registeredUsername: adminUser.username,
    registeredEmail: adminUser.email,
    registeredRole: adminUser.role,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
  };

  if (isSetupRegistration) {
    const lastLoginAt = new Date();
    await markAdminUserLogin(adminUser.id);
    await issueAdminSession(
      {
        ...adminUser,
        lastLoginAt,
      },
      {
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    );
    await createAuditLogRecord({
      action: "admin.register_owner",
      adminUserId: adminUser.id,
      actorLabel: adminUser.displayName ?? adminUser.username,
      metadata,
    });

    return {
      ok: true,
      mode: "setup",
      user: {
        ...adminUser,
        lastLoginAt,
      },
    };
  }

  await createAuditLogRecord({
    action: "admin.register_admin",
    adminUserId: input.creator?.id,
    actorLabel: input.creator?.username,
    targetType: "admin_user",
    targetId: String(adminUser.id),
    metadata,
  });

  return {
    ok: true,
    mode: "team",
    user: adminUser,
  };
}

async function resolveAdminSession(cookieValue: string | undefined): Promise<AdminSessionIdentity | null> {
  const payload = await verifySessionCookieValue(cookieValue);

  if (!payload || !payload.sid || payload.sid.trim().length === 0 || !payload.token) {
    return null;
  }

  const session = await getAdminSessionRecordById(payload.sid);

  if (!session || session.expiresAt.getTime() <= Date.now()) {
    return null;
  }

  if (!isActiveAdminStatus(session.adminUser.status)) {
    return null;
  }

  const tokenHash = await hashSessionToken(payload.token);

  if (session.tokenHash !== tokenHash) {
    return null;
  }

  return {
    sessionId: session.id,
    expiresAt: session.expiresAt,
    user: mapAdminIdentity(session.adminUser),
  };
}

export async function getAdminSession(): Promise<AdminSessionIdentity | null> {
  const cookieStore = await cookies();
  return resolveAdminSession(cookieStore.get(getAdminSessionCookieName())?.value);
}

export async function getAdminSessionFromRequest(
  request: NextRequest,
): Promise<AdminSessionIdentity | null> {
  return resolveAdminSession(request.cookies.get(getAdminSessionCookieName())?.value);
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    throw new Error("Unauthorized admin action");
  }

  return session;
}

export async function isAuthenticatedAdminRequest(request: NextRequest): Promise<boolean> {
  return Boolean(await getAdminSessionFromRequest(request));
}

export async function logoutAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    await clearAdminSessionCookie();
    return;
  }

  await deleteAdminSessionRecord(session.sessionId);
  await createAuditLogRecord({
    action: "admin.logout",
    adminUserId: session.user.id,
    actorLabel: session.user.displayName ?? session.user.username,
    metadata: {
      sessionId: session.sessionId,
    },
  });
  await clearAdminSessionCookie();
}

export async function recordAdminAuditLog(input: {
  action: string;
  adminUserId?: number;
  actorLabel?: string;
  targetType?: string;
  targetId?: string;
  metadata?: string | Record<string, unknown>;
}) {
  await createAuditLogRecord(input);
}

export async function getRecentAdminAuditLogEntries(limit = 8): Promise<AdminAuditLogEntry[]> {
  const logs = await getRecentAuditLogRecords(limit);

  return logs.map((log) => ({
    id: log.id,
    action: log.action,
    actorLabel:
      log.adminUser?.displayName ?? log.adminUser?.username ?? log.actorLabel ?? "system",
    targetType: log.targetType ?? undefined,
    targetId: log.targetId ?? undefined,
    metadata: log.metadata ?? undefined,
    createdAt: log.createdAt,
  }));
}
