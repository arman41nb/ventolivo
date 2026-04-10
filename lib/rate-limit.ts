import "server-only";

import { env } from "@/lib/env";

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitEntry>();

function getNow() {
  return Date.now();
}

function getOrCreateBucket(key: string, windowMs: number): RateLimitEntry {
  const now = getNow();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const entry = {
      count: 0,
      resetAt: now + windowMs,
    };
    buckets.set(key, entry);
    return entry;
  }

  return existing;
}

function applyRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const bucket = getOrCreateBucket(key, windowMs);
  const now = getNow();

  if (bucket.count >= limit) {
    return {
      allowed: false,
      limit,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;

  return {
    allowed: true,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

async function applyDatabaseRateLimit(
  scope: string,
  identifier: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const { prisma } = await import("@/db");

  return prisma.$transaction(async (transaction) => {
    const now = new Date();
    const key = {
      scope_identifier: {
        scope,
        identifier,
      },
    };
    const existing = await transaction.rateLimitBucket.findUnique({
      where: key,
    });

    if (!existing || existing.resetAt <= now) {
      const resetAt = new Date(now.getTime() + windowMs);
      const bucket = await transaction.rateLimitBucket.upsert({
        where: key,
        update: {
          count: 1,
          resetAt,
        },
        create: {
          scope,
          identifier,
          count: 1,
          resetAt,
        },
      });

      return {
        allowed: true,
        limit,
        remaining: Math.max(0, limit - bucket.count),
        retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt.getTime() - now.getTime()) / 1000)),
      };
    }

    if (existing.count >= limit) {
      return {
        allowed: false,
        limit,
        remaining: 0,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((existing.resetAt.getTime() - now.getTime()) / 1000),
        ),
      };
    }

    const updatedBucket = await transaction.rateLimitBucket.update({
      where: key,
      data: {
        count: {
          increment: 1,
        },
      },
    });

    return {
      allowed: true,
      limit,
      remaining: Math.max(0, limit - updatedBucket.count),
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((updatedBucket.resetAt.getTime() - now.getTime()) / 1000),
      ),
    };
  });
}

async function applyConfiguredRateLimit(
  scope: string,
  identifier: string,
  limit: number,
): Promise<RateLimitResult> {
  if (env.RATE_LIMIT_DRIVER === "database") {
    return applyDatabaseRateLimit(scope, identifier, limit, env.RATE_LIMIT_WINDOW_MS);
  }

  return applyRateLimit(`${scope}:${identifier}`, limit, env.RATE_LIMIT_WINDOW_MS);
}

export async function enforceMediaUploadRateLimit(identifier: string): Promise<RateLimitResult> {
  return applyConfiguredRateLimit("media-upload", identifier, env.RATE_LIMIT_MAX_MEDIA_UPLOADS);
}

export async function enforceTranslationRateLimit(identifier: string): Promise<RateLimitResult> {
  return applyConfiguredRateLimit(
    "translation",
    identifier,
    env.RATE_LIMIT_MAX_TRANSLATION_REQUESTS,
  );
}

export function resetRateLimitBuckets() {
  buckets.clear();
}
