import os from "node:os";
import path from "node:path";

export const e2ePort = Number(process.env.PLAYWRIGHT_PORT ?? 3100);

export const e2eBaseUrl = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${e2ePort}`;

function getDefaultDatabaseUrl() {
  const absolutePath = path.join(os.tmpdir(), "ventolivo", "e2e.db");
  return `file:${absolutePath.replace(/\\/g, "/")}`;
}

function toAbsoluteSqliteUrl(url: string) {
  if (!url.startsWith("file:./")) {
    return url;
  }

  const absolutePath = path.resolve(process.cwd(), url.replace(/^file:\.\//, ""));
  return `file:${absolutePath.replace(/\\/g, "/")}`;
}

export const e2eDatabaseUrl = toAbsoluteSqliteUrl(
  process.env.PLAYWRIGHT_DATABASE_URL ?? getDefaultDatabaseUrl(),
);

export const e2eAdminUsername = process.env.ADMIN_USERNAME ?? "admin";
export const e2eAdminPassword = process.env.ADMIN_PASSWORD ?? "AdminPass123!";
export const e2eAdminSecret =
  process.env.ADMIN_SESSION_SECRET ?? "0123456789abcdef0123456789abcdef";
