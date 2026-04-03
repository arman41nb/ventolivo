import { describe, expect, it } from "vitest";
import {
  getAdminSessionRecoveryPath,
  getSafeAdminNextPath,
} from "./navigation";

describe("getSafeAdminNextPath", () => {
  it("keeps locale-scoped admin paths", () => {
    expect(getSafeAdminNextPath("/fa/admin/products", "fa")).toBe(
      "/fa/admin/products",
    );
  });

  it("falls back to the locale admin root for unsafe paths", () => {
    expect(getSafeAdminNextPath("/products", "fa")).toBe("/fa/admin");
  });

  it("falls back to the default locale when the locale is invalid", () => {
    expect(getSafeAdminNextPath("/zz/admin", "zz")).toBe("/en/admin");
  });
});

describe("getAdminSessionRecoveryPath", () => {
  it("builds the clear-session redirect with a safe next target", () => {
    expect(
      getAdminSessionRecoveryPath({
        locale: "tr",
        next: "/tr/admin/media",
      }),
    ).toBe(
      "/api/admin/session/clear?locale=tr&next=%2Ftr%2Fadmin%2Fmedia",
    );
  });
});
