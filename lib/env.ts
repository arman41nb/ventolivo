import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://ventolivo.com"),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().optional().default(""),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  PRODUCTS_DATA_SOURCE: z.enum(["mock", "database"]).default("mock"),
  MEDIA_STORAGE_DRIVER: z.enum(["local", "s3"]).default("local"),
  MEDIA_LOCAL_UPLOAD_DIR: z.string().trim().min(1).default("public/uploads/media"),
  MEDIA_PUBLIC_BASE_PATH: z
    .string()
    .trim()
    .startsWith("/")
    .default("/uploads/media"),
  MEDIA_S3_ENDPOINT: z.string().url().optional(),
  MEDIA_S3_REGION: z.string().trim().min(1).default("us-east-1"),
  MEDIA_S3_BUCKET: z.string().trim().min(1).optional(),
  MEDIA_S3_ACCESS_KEY_ID: z.string().trim().min(1).optional(),
  MEDIA_S3_SECRET_ACCESS_KEY: z.string().trim().min(1).optional(),
  MEDIA_S3_PUBLIC_BASE_URL: z.string().url().optional(),
  MEDIA_S3_FORCE_PATH_STYLE: z.coerce.boolean().default(true),
  MEDIA_S3_KEY_PREFIX: z.string().trim().default("media"),
  ADMIN_USERNAME: z.string().optional(),
  ADMIN_PASSWORD: z.string().optional(),
  ADMIN_SESSION_SECRET: z.string().optional(),
  LIBRETRANSLATE_URL: z.string().url().optional(),
  LIBRETRANSLATE_API_KEY: z.string().optional(),
  RATE_LIMIT_DRIVER: z.enum(["memory", "database"]).default("memory"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX_MEDIA_UPLOADS: z.coerce.number().int().positive().default(10),
  RATE_LIMIT_MAX_TRANSLATION_REQUESTS: z.coerce.number().int().positive().default(20),
});

function validateEnv() {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    DATABASE_URL: process.env.DATABASE_URL,
    PRODUCTS_DATA_SOURCE: process.env.PRODUCTS_DATA_SOURCE,
    MEDIA_STORAGE_DRIVER: process.env.MEDIA_STORAGE_DRIVER,
    MEDIA_LOCAL_UPLOAD_DIR: process.env.MEDIA_LOCAL_UPLOAD_DIR,
    MEDIA_PUBLIC_BASE_PATH: process.env.MEDIA_PUBLIC_BASE_PATH,
    MEDIA_S3_ENDPOINT: process.env.MEDIA_S3_ENDPOINT,
    MEDIA_S3_REGION: process.env.MEDIA_S3_REGION,
    MEDIA_S3_BUCKET: process.env.MEDIA_S3_BUCKET,
    MEDIA_S3_ACCESS_KEY_ID: process.env.MEDIA_S3_ACCESS_KEY_ID,
    MEDIA_S3_SECRET_ACCESS_KEY: process.env.MEDIA_S3_SECRET_ACCESS_KEY,
    MEDIA_S3_PUBLIC_BASE_URL: process.env.MEDIA_S3_PUBLIC_BASE_URL,
    MEDIA_S3_FORCE_PATH_STYLE: process.env.MEDIA_S3_FORCE_PATH_STYLE,
    MEDIA_S3_KEY_PREFIX: process.env.MEDIA_S3_KEY_PREFIX,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
    LIBRETRANSLATE_URL: process.env.LIBRETRANSLATE_URL,
    LIBRETRANSLATE_API_KEY: process.env.LIBRETRANSLATE_API_KEY,
    RATE_LIMIT_DRIVER: process.env.RATE_LIMIT_DRIVER,
    RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
    RATE_LIMIT_MAX_MEDIA_UPLOADS: process.env.RATE_LIMIT_MAX_MEDIA_UPLOADS,
    RATE_LIMIT_MAX_TRANSLATION_REQUESTS: process.env.RATE_LIMIT_MAX_TRANSLATION_REQUESTS,
  });

  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }

  if (parsed.data.PRODUCTS_DATA_SOURCE === "database" && !parsed.data.DATABASE_URL) {
    throw new Error("DATABASE_URL is required when PRODUCTS_DATA_SOURCE=database");
  }

  if (parsed.data.RATE_LIMIT_DRIVER === "database" && !parsed.data.DATABASE_URL) {
    throw new Error("DATABASE_URL is required when RATE_LIMIT_DRIVER=database");
  }

  if (
    parsed.data.MEDIA_STORAGE_DRIVER === "s3" &&
    (!parsed.data.MEDIA_S3_ENDPOINT ||
      !parsed.data.MEDIA_S3_BUCKET ||
      !parsed.data.MEDIA_S3_ACCESS_KEY_ID ||
      !parsed.data.MEDIA_S3_SECRET_ACCESS_KEY)
  ) {
    throw new Error(
      "MEDIA_S3_ENDPOINT, MEDIA_S3_BUCKET, MEDIA_S3_ACCESS_KEY_ID, and MEDIA_S3_SECRET_ACCESS_KEY are required when MEDIA_STORAGE_DRIVER=s3",
    );
  }

  return parsed.data;
}

export const env = validateEnv();
export type Env = z.infer<typeof envSchema>;
