import { cookies } from "next/headers";
import { env } from "@/lib/env";
import {
  dbCountAdminUsers,
  dbCreateAdminSession,
  dbCreateAdminUser,
  dbCreateAuditLog,
  dbDeleteAdminSession,
  dbDeleteExpiredAdminSessions,
  dbGetAdminSessionById,
  dbGetAdminUserByUsername,
  dbGetRecentAuditLogs,
  dbMarkAdminUserLogin,
} from "@/db";
import type { AdminAuditLogEntry, AdminSessionIdentity } from "@/types";
import {
  createSessionToken,
  createSignedSessionCookieValue,
  getAdminSessionCookieName,
  getAdminSessionTtlSeconds,
  hashSessionToken,
  verifySessionCookieValue,
} from "./session";
import { hashAdminPassword, verifyAdminPassword } from "./password";

interface AuthenticateAdminInput {
  username: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}

async function setAdminSessionCookieValue(value: string) {
  const cookieStore = await cookies();

  cookieStore.set(getAdminSessionCookieName(), value, {
    httpOnly: true,
    secure: env.NEXT_PUBLIC_SITE_URL.startsWith("https://"),
    sameSite: "lax",
    maxAge: getAdminSessionTtlSeconds(),
    path: "/",
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(getAdminSessionCookieName(), "", {
    httpOnly: true,
    secure: env.NEXT_PUBLIC_SITE_URL.startsWith("https://"),
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

async function bootstrapFirstAdminIfAllowed(
  username: string,
  password: string,
) {
  const adminCount = await dbCountAdminUsers();

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

  const adminUser = await dbCreateAdminUser({
    username,
    passwordHash: await hashAdminPassword(password),
  });

  await dbCreateAuditLog({
    action: "admin.bootstrap",
    adminUserId: adminUser.id,
    actorLabel: adminUser.username,
    metadata: "Initial admin account was provisioned from bootstrap environment variables.",
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
  await dbDeleteExpiredAdminSessions();

  const plainToken = createSessionToken();
  const expiresAt = new Date(
    Date.now() + getAdminSessionTtlSeconds() * 1000,
  );
  const session = await dbCreateAdminSession({
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

export async function authenticateAdmin(
  input: AuthenticateAdminInput,
): Promise<boolean> {
  const username = input.username.trim();
  let adminUser = await dbGetAdminUserByUsername(username);

  if (!adminUser) {
    adminUser = await bootstrapFirstAdminIfAllowed(username, input.password);
  }

  if (!adminUser) {
    await dbCreateAuditLog({
      action: "admin.login_failed",
      actorLabel: username,
      metadata: "Unknown username.",
    });
    return false;
  }

  const isValidPassword = await verifyAdminPassword(
    input.password,
    adminUser.passwordHash,
  );

  if (!isValidPassword) {
    await dbCreateAuditLog({
      action: "admin.login_failed",
      adminUserId: adminUser.id,
      actorLabel: adminUser.username,
      metadata: "Invalid password.",
    });
    return false;
  }

  await dbMarkAdminUserLogin(adminUser.id);
  await issueAdminSession(
    { id: adminUser.id, username: adminUser.username },
    {
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    },
  );
  await dbCreateAuditLog({
    action: "admin.login_succeeded",
    adminUserId: adminUser.id,
    actorLabel: adminUser.username,
    metadata: "Admin signed in successfully.",
  });

  return true;
}

export async function getAdminSession(): Promise<AdminSessionIdentity | null> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(getAdminSessionCookieName())?.value;
  // This reader is used from Server Components, so invalid cookies are cleared
  // by a Route Handler instead of mutating response cookies during render.
  const payload = await verifySessionCookieValue(cookieValue);

  if (!payload) {
    return null;
  }

  if (!payload.sid || payload.sid.trim().length === 0 || !payload.token) {
    return null;
  }

  const session = await dbGetAdminSessionById(payload.sid);

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

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    throw new Error("Unauthorized admin action");
  }

  return session;
}

export async function logoutAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    await clearAdminSessionCookie();
    return;
  }

  await dbDeleteAdminSession(session.sessionId);
  await dbCreateAuditLog({
    action: "admin.logout",
    adminUserId: session.user.id,
    actorLabel: session.user.username,
    metadata: "Admin signed out.",
  });
  await clearAdminSessionCookie();
}

export async function recordAdminAuditLog(input: {
  action: string;
  adminUserId?: number;
  actorLabel?: string;
  targetType?: string;
  targetId?: string;
  metadata?: string;
}) {
  await dbCreateAuditLog(input);
}

export async function getRecentAdminAuditLogEntries(
  limit = 8,
): Promise<AdminAuditLogEntry[]> {
  const logs = await dbGetRecentAuditLogs(limit);

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
