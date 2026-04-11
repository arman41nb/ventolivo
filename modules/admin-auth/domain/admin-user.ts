export const adminUserRoles = ["owner", "manager"] as const;
export type AdminUserRole = (typeof adminUserRoles)[number];

export const adminUserStatuses = ["active", "disabled"] as const;
export type AdminUserStatus = (typeof adminUserStatuses)[number];

export function normalizeAdminUsername(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizeAdminEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizeAdminIdentifier(value: string): string {
  return value.trim().toLowerCase();
}

export function getDefaultAdminRole(adminCount: number): AdminUserRole {
  return adminCount === 0 ? "owner" : "manager";
}

export function isActiveAdminStatus(status: string | null | undefined): status is AdminUserStatus {
  return status === "active";
}
