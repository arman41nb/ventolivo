export type CustomerUserStatus = "active" | "disabled";

export interface CustomerUser {
  id: number;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  status: CustomerUserStatus;
  marketingConsent: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface CustomerSessionIdentity {
  sessionId: string;
  user: CustomerUser;
  expiresAt: Date;
}

export interface BuyerIntentRecord {
  id: string;
  locale: string;
  channel: string;
  source?: string;
  note?: string;
  createdAt: Date;
  product?: {
    id: number;
    slug: string;
    name: string;
    price: number;
  };
  customer?: {
    id: number;
    fullName: string;
    email: string;
    avatarUrl?: string;
  };
}

export interface CustomerAdminInsightUser {
  id: number;
  fullName: string;
  email: string;
  avatarUrl?: string;
  phone?: string;
  status: CustomerUserStatus;
  marketingConsent: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  intentCount: number;
}

export interface CustomerAdminInsights {
  totals: {
    users: number;
    intents: number;
    intentsInWindow: number;
    activeBuyersInWindow: number;
  };
  recentUsers: CustomerAdminInsightUser[];
  recentIntents: BuyerIntentRecord[];
}
