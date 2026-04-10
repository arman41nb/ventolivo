import { prisma } from "./client";

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

function serializeAuditMetadata(metadata: CreateAuditLogInput["metadata"]) {
  if (!metadata) {
    return null;
  }

  return typeof metadata === "string" ? metadata : JSON.stringify(metadata);
}

export async function dbCountAdminUsers(): Promise<number> {
  return prisma.adminUser.count();
}

export async function dbGetAdminUserByUsername(username: string) {
  return prisma.adminUser.findUnique({
    where: { username },
  });
}

export async function dbCreateAdminUser(input: { username: string; passwordHash: string }) {
  return prisma.adminUser.create({
    data: {
      username: input.username,
      passwordHash: input.passwordHash,
      lastLoginAt: new Date(),
    },
  });
}

export async function dbMarkAdminUserLogin(adminUserId: number) {
  return prisma.adminUser.update({
    where: { id: adminUserId },
    data: { lastLoginAt: new Date() },
  });
}

export async function dbCreateAdminSession(input: CreateAdminSessionInput) {
  return prisma.adminSession.create({
    data: {
      adminUserId: input.adminUserId,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
    },
  });
}

export async function dbDeleteAdminSession(id: string) {
  await prisma.adminSession.deleteMany({
    where: { id },
  });
}

export async function dbDeleteExpiredAdminSessions() {
  await prisma.adminSession.deleteMany({
    where: {
      expiresAt: {
        lte: new Date(),
      },
    },
  });
}

export async function dbGetAdminSessionById(id: string) {
  if (!id || id.trim().length === 0) {
    return null;
  }

  return prisma.adminSession.findUnique({
    where: { id },
    include: { adminUser: true },
  });
}

export async function dbCreateAuditLog(input: CreateAuditLogInput) {
  return prisma.auditLog.create({
    data: {
      action: input.action,
      adminUserId: input.adminUserId ?? null,
      actorLabel: input.actorLabel ?? null,
      targetType: input.targetType ?? null,
      targetId: input.targetId ?? null,
      metadata: serializeAuditMetadata(input.metadata),
    },
  });
}

export async function dbGetRecentAuditLogs(limit = 8) {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      adminUser: true,
    },
  });
}
