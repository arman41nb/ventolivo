import { defineConfig } from "prisma/config";

const databaseUrl = process.env.PLAYWRIGHT_DATABASE_URL ?? process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("PLAYWRIGHT_DATABASE_URL or DATABASE_URL must be set for e2e database setup.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
});
