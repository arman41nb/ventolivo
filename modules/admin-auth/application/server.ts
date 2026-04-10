import "server-only";

import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import type { AdminAuditLogEntry, AdminSessionIdentity } from "@/types";
import {
  countAdminUsers,
  createAdminSessionRecord,
  createAdminUserRecord,
  createAuditLogRecord,
  deleteAdminSessionRecord,
  deleteExpiredAdminSessions,
  getAdminSessionRecordById,
  getAdminUserRecordByUsername,
  getRecentAuditLogRecords,
  markAdminUserLogin,
} from "../infrastructure/admin-auth-store";
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
import { env } from "@/lib/env";

interface AuthenticateAdminInput {
  username: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}

async function setAdminSessionCookieValue(value: string) {
  const cookieStore = await cookies();

  cookieStore.set(getAdminSessionCookieName(), value, getAdminSessionCookieOptions());
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(getAdminSessionCookieName(), "", getExpiredAdminSessionCookieOptions());
}

async function bootstrapFirstAdminIfAllowed(username: string, password: string) {
  const adminCount = await countAdminUsers();

  if (adminCount > 0) {
    return null;
  }

  if (
    !env.ADMIN_USERNAME ||
    !env.ADMIN_PASSWORD ||
    username !== env.ADMIN_USERNAME ||
    password !== env.ADMIN_PASSWORD
  ) {
    return null;
  }

  const adminUser = await createAdminUserRecord({
    username,
    passwordHash: await hashAdminPassword(password),
  });

  await createAuditLogRecord({
    action: "admin.bootstrap",
    adminUserId: adminUser.id,
    actorLabel: adminUser.username,
    metadata: {
      event: "Initial admin account was provisioned from bootstrap environment variables.",
    },
  });

  return adminUser;
}

async function issueAdminSession(
  sessionIdentity: {
    id: number;
    username: string;
  },
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
    user: {
      id: sessionIdentity.id,
      username: sessionIdentity.username,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
}

export async function authenticateAdmin(input: AuthenticateAdminInput): Promise<boolean> {
  const username = input.username.trim();
  let adminUser = await getAdminUserRecordByUsername(username);

  if (!adminUser) {
    adminUser = await bootstrapFirstAdminIfAllowed(username, input.password);
  }

  if (!adminUser) {
    await createAuditLogRecord({
      action: "admin.login_failed",
      actorLabel: username,
      metadata: {
        reason: "unknown_username",
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    });
    return false;
  }

  const isValidPassword = await verifyAdminPassword(input.password, adminUser.passwordHash);

  if (!isValidPassword) {
    await createAuditLogRecord({
      action: "admin.login_failed",
      adminUserId: adminUser.id,
      actorLabel: adminUser.username,
      metadata: {
        reason: "invalid_password",
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    });
    return false;
  }

  await markAdminUserLogin(adminUser.id);
  await issueAdminSession(
    { id: adminUser.id, username: adminUser.username },
    {
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    },
  );
  await createAuditLogRecord({
    action: "admin.login_succeeded",
    adminUserId: adminUser.id,
    actorLabel: adminUser.username,
    metadata: {
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    },
  });

  return true;
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

  const tokenHash = await hashSessionToken(payload.token);

  if (session.tokenHash !== tokenHash) {
    return null;
  }

  return {
    sessionId: session.id,
    expiresAt: session.expiresAt,
    user: {
      id: session.adminUser.id,
      username: session.adminUser.username,
      createdAt: session.adminUser.createdAt,
      updatedAt: session.adminUser.updatedAt,
      lastLoginAt: session.adminUser.lastLoginAt ?? undefined,
    },
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
    actorLabel: session.user.username,
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
    actorLabel: log.adminUser?.username ?? log.actorLabel ?? "system",
    targetType: log.targetType ?? undefined,
    targetId: log.targetId ?? undefined,
    metadata: log.metadata ?? undefined,
    createdAt: log.createdAt,
  }));
}
