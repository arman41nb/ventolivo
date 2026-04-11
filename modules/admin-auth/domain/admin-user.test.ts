import { describe, expect, it } from "vitest";
import {
  getDefaultAdminRole,
  isActiveAdminStatus,
  normalizeAdminEmail,
  normalizeAdminIdentifier,
  normalizeAdminUsername,
} from "./admin-user";

describe("admin user helpers", () => {
  it("normalizes usernames, emails, and identifiers to lowercase trimmed values", () => {
    expect(normalizeAdminUsername("  Owner.Admin  ")).toBe("owner.admin");
    expect(normalizeAdminEmail("  TEAM@VENTOLIVO.COM  ")).toBe("team@ventolivo.com");
    expect(normalizeAdminIdentifier("  Admin@Ventolivo.com  ")).toBe("admin@ventolivo.com");
  });

  it("assigns owner to the first admin and manager to the rest", () => {
    expect(getDefaultAdminRole(0)).toBe("owner");
    expect(getDefaultAdminRole(3)).toBe("manager");
  });

  it("detects active status safely", () => {
    expect(isActiveAdminStatus("active")).toBe(true);
    expect(isActiveAdminStatus("disabled")).toBe(false);
    expect(isActiveAdminStatus(undefined)).toBe(false);
  });
});
