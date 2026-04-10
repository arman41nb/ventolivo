import { describe, expect, it } from "vitest";
import {
  getAdminSessionRecoveryPath,
  getSafeAdminNextPath,
} from "./domain/navigation";

describe("getSafeAdminNextPath", () => {
  it("keeps locale-scoped admin paths", () => {
    expect(getSafeAdminNextPath("/fa/admin/products", "fa")).toBe("/fa/admin/products");
  });

  it("falls back to the locale admin root for unsafe paths", () => {
    expect(getSafeAdminNextPath("/products", "fa")).toBe("/fa/admin");
  });

  it("keeps syntactically valid locale codes for admin paths", () => {
    expect(getSafeAdminNextPath("/zz/admin", "zz")).toBe("/zz/admin");
  });
});

describe("getAdminSessionRecoveryPath", () => {
  it("builds the clear-session redirect with a safe next target", () => {
    expect(
      getAdminSessionRecoveryPath({
        locale: "tr",
        next: "/tr/admin/media",
      }),
    ).toBe("/api/admin/session/clear?locale=tr&next=%2Ftr%2Fadmin%2Fmedia");
  });
});
