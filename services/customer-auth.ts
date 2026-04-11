import "server-only";

export {
  authenticateCustomer,
  clearCustomerSessionCookie,
  getCustomerAdminInsights,
  getCustomerBuyerIntents,
  getCustomerSession,
  getCustomerSessionFromRequest,
  getCustomerSessionCookieName,
  getExpiredCustomerSessionCookieOptions,
  getCustomerSessionRecoveryPath,
  getSafeCustomerNextPath,
  logoutCustomerSession,
  recordBuyerIntent,
  registerCustomer,
  signInCustomerWithGoogle,
  requireCustomerSession,
} from "@/modules/customer-auth";
