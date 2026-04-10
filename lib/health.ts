import { env } from "@/lib/env";
import { getMediaStorage } from "@/modules/media/infrastructure/storage";

export type HealthCheckStatus = "ok" | "skipped" | "error";

export interface HealthCheckResult {
  name: string;
  status: HealthCheckStatus;
  durationMs: number;
  detail?: string;
}

export interface ApplicationHealth {
  status: "ok" | "degraded";
  timestamp: string;
  uptimeSeconds: number;
  version: string;
  checks: HealthCheckResult[];
}

function getVersion() {
  return (
    process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ??
    process.env.npm_package_version ??
    "development"
  );
}

function getErrorDetail(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected error";
}

async function getDatabaseHealthCheck(): Promise<HealthCheckResult> {
  const startedAt = Date.now();

  if (!env.DATABASE_URL) {
    return {
      name: "database",
      status: "skipped",
      detail: "DATABASE_URL is not configured.",
      durationMs: Date.now() - startedAt,
    };
  }

  try {
    const { prisma } = await import("@/db");
    await prisma.$queryRaw`SELECT 1`;

    return {
      name: "database",
      status: "ok",
      durationMs: Date.now() - startedAt,
    };
  } catch (error) {
    return {
      name: "database",
      status: "error",
      detail: getErrorDetail(error),
      durationMs: Date.now() - startedAt,
    };
  }
}

async function getStorageHealthCheck(): Promise<HealthCheckResult> {
  const startedAt = Date.now();

  try {
    await getMediaStorage().probe();

    return {
      name: "storage",
      status: "ok",
      detail:
        env.MEDIA_STORAGE_DRIVER === "local"
          ? `driver=${env.MEDIA_STORAGE_DRIVER}; path=${env.MEDIA_LOCAL_UPLOAD_DIR}`
          : `driver=${env.MEDIA_STORAGE_DRIVER}; bucket=${env.MEDIA_S3_BUCKET}; endpoint=${env.MEDIA_S3_ENDPOINT}`,
      durationMs: Date.now() - startedAt,
    };
  } catch (error) {
    return {
      name: "storage",
      status: "error",
      detail: getErrorDetail(error),
      durationMs: Date.now() - startedAt,
    };
  }
}

async function getConfigHealthCheck(): Promise<HealthCheckResult> {
  const startedAt = Date.now();
  const issues: string[] = [];

  if (!env.NEXT_PUBLIC_SITE_URL) {
    issues.push("NEXT_PUBLIC_SITE_URL is missing.");
  }

  if (env.DATABASE_URL && (!env.ADMIN_SESSION_SECRET || env.ADMIN_SESSION_SECRET.length < 32)) {
    issues.push("ADMIN_SESSION_SECRET should be set to at least 32 characters.");
  }

  return {
    name: "config",
    status: issues.length === 0 ? "ok" : "error",
    detail: issues.length > 0 ? issues.join(" ") : undefined,
    durationMs: Date.now() - startedAt,
  };
}

async function getRateLimitHealthCheck(): Promise<HealthCheckResult> {
  const startedAt = Date.now();

  return {
    name: "rate-limit",
    status: "ok",
    detail: `driver=${env.RATE_LIMIT_DRIVER}; windowMs=${env.RATE_LIMIT_WINDOW_MS}`,
    durationMs: Date.now() - startedAt,
  };
}

export async function getApplicationHealth(): Promise<ApplicationHealth> {
  const checks = await Promise.all([
    getConfigHealthCheck(),
    getDatabaseHealthCheck(),
    getStorageHealthCheck(),
    getRateLimitHealthCheck(),
  ]);

  return {
    status: checks.some((check) => check.status === "error") ? "degraded" : "ok",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    version: getVersion(),
    checks,
  };
}
