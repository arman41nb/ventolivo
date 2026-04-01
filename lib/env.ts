import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://ventolivo.com"),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().optional().default(""),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  PRODUCTS_DATA_SOURCE: z.enum(["mock", "database"]).default("mock"),
  ADMIN_USERNAME: z.string().optional(),
  ADMIN_PASSWORD: z.string().optional(),
  ADMIN_SESSION_SECRET: z.string().optional(),
  LIBRETRANSLATE_URL: z.string().url().optional(),
  LIBRETRANSLATE_API_KEY: z.string().optional(),
});

function validateEnv() {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    DATABASE_URL: process.env.DATABASE_URL,
    PRODUCTS_DATA_SOURCE: process.env.PRODUCTS_DATA_SOURCE,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
    LIBRETRANSLATE_URL: process.env.LIBRETRANSLATE_URL,
    LIBRETRANSLATE_API_KEY: process.env.LIBRETRANSLATE_API_KEY,
  });

  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }

  if (parsed.data.PRODUCTS_DATA_SOURCE === "database" && !parsed.data.DATABASE_URL) {
    throw new Error("DATABASE_URL is required when PRODUCTS_DATA_SOURCE=database");
  }

  return parsed.data;
}

export const env = validateEnv();
export type Env = z.infer<typeof envSchema>;
