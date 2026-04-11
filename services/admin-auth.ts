import "server-only";

export {
  authenticateAdmin,
  clearAdminSessionCookie,
  getAdminSessionCookieName,
  getAdminSession,
  getAdminSessionFromRequest,
  getAdminRegistrationState,
  getExpiredAdminSessionCookieOptions,
  getRecentAdminAuditLogEntries,
  getAdminSessionRecoveryPath,
  getSafeAdminNextPath,
  isAuthenticatedAdminRequest,
  isAdminAuthenticatedRequest,
  logoutAdminSession,
  recordAdminAuditLog,
  registerAdmin,
  requireAdminSession,
} from "@/modules/admin-auth";
