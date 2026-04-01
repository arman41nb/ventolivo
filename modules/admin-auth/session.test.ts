import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

describe("admin session auth", () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.ADMIN_SESSION_SECRET;
  });

  it("rejects session token creation when the admin secret is missing", async () => {
    const { createAdminSessionToken } = await import("./session");

    await expect(createAdminSessionToken("admin")).rejects.toThrow(
      "ADMIN_SESSION_SECRET must be set to a long random value before admin auth can be used",
    );
  });

  it("rejects session token creation when the admin secret is too short", async () => {
    process.env.ADMIN_SESSION_SECRET = "too-short";

    const { createAdminSessionToken } = await import("./session");

    await expect(createAdminSessionToken("admin")).rejects.toThrow(
      "ADMIN_SESSION_SECRET must be set to a long random value before admin auth can be used",
    );
  });

  it("creates verifiable session tokens when the admin secret is strong", async () => {
    process.env.ADMIN_SESSION_SECRET = "0123456789abcdef0123456789abcdef";

    const { createAdminSessionToken, verifyAdminSessionToken } = await import(
      "./session"
    );

    const token = await createAdminSessionToken("admin");
    const session = await verifyAdminSessionToken(token);

    expect(session?.sub).toBe("admin");
    expect(session?.exp).toBeTypeOf("number");
  });

  it("rejects tampered session tokens", async () => {
    process.env.ADMIN_SESSION_SECRET = "0123456789abcdef0123456789abcdef";

    const { createAdminSessionToken, verifyAdminSessionToken } = await import(
      "./session"
    );

    const token = await createAdminSessionToken("admin");
    const [payload] = token.split(".");
    const tamperedToken = `${payload}.invalid-signature`;

    await expect(verifyAdminSessionToken(tamperedToken)).resolves.toBeNull();
  });
});
