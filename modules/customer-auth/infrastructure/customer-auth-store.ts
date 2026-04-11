interface CreateCustomerSessionInput {
  customerUserId: number;
  tokenHash: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

interface CreateBuyerIntentInput {
  customerUserId?: number;
  productId?: number;
  locale: string;
  channel?: string;
  source?: string;
  note?: string;
}

export async function countCustomerUsers(): Promise<number> {
  const { dbCountCustomerUsers } = await import("@/db");
  return dbCountCustomerUsers();
}

export async function getCustomerUserRecordById(id: number) {
  const { dbGetCustomerUserById } = await import("@/db");
  return dbGetCustomerUserById(id);
}

export async function getCustomerUserRecordByEmail(email: string) {
  const { dbGetCustomerUserByEmail } = await import("@/db");
  return dbGetCustomerUserByEmail(email);
}

export async function createCustomerUserRecord(input: {
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  status?: string;
  passwordHash: string;
  marketingConsent?: boolean;
}) {
  const { dbCreateCustomerUser } = await import("@/db");
  return dbCreateCustomerUser(input);
}

export async function updateCustomerUserProfileRecord(
  customerUserId: number,
  input: {
    fullName?: string;
    avatarUrl?: string | null;
  },
) {
  const { dbUpdateCustomerUserProfile } = await import("@/db");
  return dbUpdateCustomerUserProfile(customerUserId, input);
}

export async function markCustomerUserLogin(customerUserId: number) {
  const { dbMarkCustomerUserLogin } = await import("@/db");
  return dbMarkCustomerUserLogin(customerUserId);
}

export async function createCustomerSessionRecord(input: CreateCustomerSessionInput) {
  const { dbCreateCustomerSession } = await import("@/db");
  return dbCreateCustomerSession(input);
}

export async function deleteCustomerSessionRecord(id: string) {
  const { dbDeleteCustomerSession } = await import("@/db");
  return dbDeleteCustomerSession(id);
}

export async function deleteExpiredCustomerSessions() {
  const { dbDeleteExpiredCustomerSessions } = await import("@/db");
  return dbDeleteExpiredCustomerSessions();
}

export async function getCustomerSessionRecordById(id: string) {
  const { dbGetCustomerSessionById } = await import("@/db");
  return dbGetCustomerSessionById(id);
}

export async function createBuyerIntentRecord(input: CreateBuyerIntentInput) {
  const { dbCreateBuyerIntent } = await import("@/db");
  return dbCreateBuyerIntent(input);
}

export async function countBuyerIntentRecords() {
  const { dbCountBuyerIntents } = await import("@/db");
  return dbCountBuyerIntents();
}

export async function countBuyerIntentRecordsSince(since: Date) {
  const { dbCountBuyerIntentsSince } = await import("@/db");
  return dbCountBuyerIntentsSince(since);
}

export async function countDistinctBuyerCustomersSince(since: Date) {
  const { dbCountDistinctCustomersWithIntentSince } = await import("@/db");
  return dbCountDistinctCustomersWithIntentSince(since);
}

export async function getRecentCustomerUserRecords(limit = 12) {
  const { dbGetRecentCustomerUsers } = await import("@/db");
  return dbGetRecentCustomerUsers(limit);
}

export async function getRecentBuyerIntentRecords(limit = 20) {
  const { dbGetRecentBuyerIntents } = await import("@/db");
  return dbGetRecentBuyerIntents(limit);
}

export async function getCustomerBuyerIntentRecords(customerUserId: number, limit = 12) {
  const { dbGetBuyerIntentsForCustomer } = await import("@/db");
  return dbGetBuyerIntentsForCustomer(customerUserId, limit);
}
