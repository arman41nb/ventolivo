export type AdminUserRole = "owner" | "manager";
export type AdminUserStatus = "active" | "disabled";

export interface AdminUser {
  id: number;
  username: string;
  email?: string;
  displayName?: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface AdminAuditLogEntry {
  id: string;
  action: string;
  actorLabel: string;
  targetType?: string;
  targetId?: string;
  metadata?: string;
  createdAt: Date;
}

export interface AdminSessionIdentity {
  sessionId: string;
  user: AdminUser;
  expiresAt: Date;
}
