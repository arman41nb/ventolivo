import { env } from "@/lib/env";

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

export async function getApplicationHealth(): Promise<ApplicationHealth> {
  const checks = [await getDatabaseHealthCheck()];

  return {
    status: checks.some((check) => check.status === "error") ? "degraded" : "ok",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    version: getVersion(),
    checks,
  };
}
