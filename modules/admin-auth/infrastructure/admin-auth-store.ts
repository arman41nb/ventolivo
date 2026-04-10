interface CreateAdminSessionInput {
  adminUserId: number;
  tokenHash: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

interface CreateAuditLogInput {
  action: string;
  adminUserId?: number;
  actorLabel?: string;
  targetType?: string;
  targetId?: string;
  metadata?: string | Record<string, unknown>;
}

export async function countAdminUsers(): Promise<number> {
  const { dbCountAdminUsers } = await import("@/db");
  return dbCountAdminUsers();
}

export async function getAdminUserRecordByUsername(username: string) {
  const { dbGetAdminUserByUsername } = await import("@/db");
  return dbGetAdminUserByUsername(username);
}

export async function createAdminUserRecord(input: { username: string; passwordHash: string }) {
  const { dbCreateAdminUser } = await import("@/db");
  return dbCreateAdminUser(input);
}

export async function markAdminUserLogin(adminUserId: number) {
  const { dbMarkAdminUserLogin } = await import("@/db");
  return dbMarkAdminUserLogin(adminUserId);
}

export async function createAdminSessionRecord(input: CreateAdminSessionInput) {
  const { dbCreateAdminSession } = await import("@/db");
  return dbCreateAdminSession(input);
}

export async function deleteAdminSessionRecord(id: string) {
  const { dbDeleteAdminSession } = await import("@/db");
  return dbDeleteAdminSession(id);
}

export async function deleteExpiredAdminSessions() {
  const { dbDeleteExpiredAdminSessions } = await import("@/db");
  return dbDeleteExpiredAdminSessions();
}

export async function getAdminSessionRecordById(id: string) {
  const { dbGetAdminSessionById } = await import("@/db");
  return dbGetAdminSessionById(id);
}

export async function createAuditLogRecord(input: CreateAuditLogInput) {
  const { dbCreateAuditLog } = await import("@/db");
  return dbCreateAuditLog(input);
}

export async function getRecentAuditLogRecords(limit = 8) {
  const { dbGetRecentAuditLogs } = await import("@/db");
  return dbGetRecentAuditLogs(limit);
}
