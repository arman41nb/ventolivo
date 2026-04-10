import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const defaultDatabaseUrl = `file:${path.join(os.tmpdir(), "ventolivo", "e2e.db").replace(/\\/g, "/")}`;
const databaseUrl =
  process.env.PLAYWRIGHT_DATABASE_URL ?? process.env.DATABASE_URL ?? defaultDatabaseUrl;
const standaloneServerCandidates = [
  path.resolve(process.cwd(), "build", "next", "standalone", "server.js"),
  path.resolve(process.cwd(), ".next", "standalone", "server.js"),
];
const standaloneServerPath = standaloneServerCandidates.find((candidate) => existsSync(candidate));

function normalizeDatabaseUrl(url) {
  if (!url.startsWith("file:./")) {
    return url;
  }

  return `file:${path.resolve(process.cwd(), url.replace(/^file:\.\//, "")).replace(/\\/g, "/")}`;
}

function getDatabaseFilePath(url) {
  return path.resolve(process.cwd(), normalizeDatabaseUrl(url).replace(/^file:/, ""));
}

const resolvedDatabaseUrl = normalizeDatabaseUrl(databaseUrl);

function removeIfExists(filePath) {
  if (existsSync(filePath)) {
    rmSync(filePath, { force: true });
  }
}

function runPrismaDbPush() {
  const result =
    process.platform === "win32"
      ? spawnSync(
          "cmd.exe",
          ["/d", "/s", "/c", "npx prisma db push --config prisma.e2e.config.ts"],
          {
            cwd: process.cwd(),
            env: {
              ...process.env,
              DATABASE_URL: resolvedDatabaseUrl,
              PLAYWRIGHT_DATABASE_URL: resolvedDatabaseUrl,
            },
            stdio: "inherit",
          },
        )
      : spawnSync("npx", ["prisma", "db", "push", "--config", "prisma.e2e.config.ts"], {
          cwd: process.cwd(),
          env: {
            ...process.env,
            DATABASE_URL: resolvedDatabaseUrl,
            PLAYWRIGHT_DATABASE_URL: resolvedDatabaseUrl,
          },
          stdio: "inherit",
        });

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (!standaloneServerPath) {
  console.error("Standalone server was not found. Run `npm run build` before `npm run test:e2e`.");
  process.exit(1);
}

const databaseFilePath = getDatabaseFilePath(resolvedDatabaseUrl);
mkdirSync(path.dirname(databaseFilePath), { recursive: true });
removeIfExists(databaseFilePath);
removeIfExists(`${databaseFilePath}-journal`);
writeFileSync(databaseFilePath, "", { encoding: "utf8" });
runPrismaDbPush();

const serverProcess = spawn(process.execPath, [standaloneServerPath], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    DATABASE_URL: resolvedDatabaseUrl,
  },
  stdio: "inherit",
});

const forwardSignal = (signal) => {
  if (!serverProcess.killed) {
    serverProcess.kill(signal);
  }
};

process.on("SIGINT", () => forwardSignal("SIGINT"));
process.on("SIGTERM", () => forwardSignal("SIGTERM"));

serverProcess.on("exit", (code) => {
  process.exit(code ?? 0);
});
