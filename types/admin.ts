export interface AdminUser {
  id: number;
  username: string;
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
