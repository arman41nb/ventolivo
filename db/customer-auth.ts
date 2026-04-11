import { prisma } from "./client";

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

function hasUnknownAvatarUrlArgument(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message.includes("Unknown argument `avatarUrl`") ||
    error.message.includes("Unknown arg `avatarUrl`")
  );
}

export async function dbCountCustomerUsers(): Promise<number> {
  return prisma.customerUser.count();
}

export async function dbGetCustomerUserByEmail(email: string) {
  return prisma.customerUser.findUnique({
    where: { email },
  });
}

export async function dbGetCustomerUserById(id: number) {
  return prisma.customerUser.findUnique({
    where: { id },
  });
}

export async function dbCreateCustomerUser(input: {
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  passwordHash: string;
  marketingConsent?: boolean;
  status?: string;
}) {
  const baseData = {
    email: input.email,
    fullName: input.fullName,
    phone: input.phone ?? null,
    passwordHash: input.passwordHash,
    marketingConsent: input.marketingConsent ?? false,
    status: input.status ?? "active",
  };

  try {
    return await prisma.customerUser.create({
      data: {
        ...baseData,
        avatarUrl: input.avatarUrl ?? null,
      },
    });
  } catch (error) {
    if (!hasUnknownAvatarUrlArgument(error)) {
      throw error;
    }

    console.warn(
      "[customer-auth] prisma client does not recognize `avatarUrl`; creating customer without avatarUrl.",
    );

    return prisma.customerUser.create({
      data: baseData,
    });
  }
}

export async function dbUpdateCustomerUserProfile(
  customerUserId: number,
  input: {
    fullName?: string;
    avatarUrl?: string | null;
  },
) {
  const baseData = {
    ...(input.fullName ? { fullName: input.fullName } : {}),
  };

  try {
    return await prisma.customerUser.update({
      where: { id: customerUserId },
      data: {
        ...baseData,
        ...(Object.prototype.hasOwnProperty.call(input, "avatarUrl")
          ? { avatarUrl: input.avatarUrl ?? null }
          : {}),
      },
    });
  } catch (error) {
    if (!hasUnknownAvatarUrlArgument(error)) {
      throw error;
    }

    console.warn(
      "[customer-auth] prisma client does not recognize `avatarUrl`; updating customer profile without avatarUrl.",
    );

    return prisma.customerUser.update({
      where: { id: customerUserId },
      data: baseData,
    });
  }
}

export async function dbMarkCustomerUserLogin(customerUserId: number) {
  return prisma.customerUser.update({
    where: { id: customerUserId },
    data: { lastLoginAt: new Date() },
  });
}

export async function dbCreateCustomerSession(input: CreateCustomerSessionInput) {
  return prisma.customerSession.create({
    data: {
      customerUserId: input.customerUserId,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
    },
  });
}

export async function dbDeleteCustomerSession(id: string) {
  await prisma.customerSession.deleteMany({
    where: { id },
  });
}

export async function dbDeleteExpiredCustomerSessions() {
  await prisma.customerSession.deleteMany({
    where: {
      expiresAt: {
        lte: new Date(),
      },
    },
  });
}

export async function dbGetCustomerSessionById(id: string) {
  if (!id || id.trim().length === 0) {
    return null;
  }

  return prisma.customerSession.findUnique({
    where: { id },
    include: { customerUser: true },
  });
}

export async function dbCreateBuyerIntent(input: CreateBuyerIntentInput) {
  return prisma.buyerIntent.create({
    data: {
      customerUserId: input.customerUserId ?? null,
      productId: input.productId ?? null,
      locale: input.locale,
      channel: input.channel ?? "whatsapp",
      source: input.source ?? null,
      note: input.note ?? null,
    },
  });
}

export async function dbCountBuyerIntents(): Promise<number> {
  return prisma.buyerIntent.count();
}

export async function dbCountBuyerIntentsSince(since: Date): Promise<number> {
  return prisma.buyerIntent.count({
    where: {
      createdAt: {
        gte: since,
      },
    },
  });
}

export async function dbCountDistinctCustomersWithIntentSince(since: Date): Promise<number> {
  const rows = await prisma.buyerIntent.findMany({
    where: {
      createdAt: {
        gte: since,
      },
      customerUserId: {
        not: null,
      },
    },
    distinct: ["customerUserId"],
    select: {
      customerUserId: true,
    },
  });

  return rows.length;
}

export async function dbGetRecentCustomerUsers(limit = 12) {
  return prisma.customerUser.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      email: true,
      fullName: true,
      avatarUrl: true,
      phone: true,
      status: true,
      marketingConsent: true,
      createdAt: true,
      updatedAt: true,
      lastLoginAt: true,
      _count: {
        select: {
          buyerIntents: true,
        },
      },
    },
  });
}

export async function dbGetRecentBuyerIntents(limit = 20) {
  return prisma.buyerIntent.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      customerUser: {
        select: {
          id: true,
          email: true,
          fullName: true,
          avatarUrl: true,
        },
      },
      product: {
        select: {
          id: true,
          slug: true,
          name: true,
          price: true,
        },
      },
    },
  });
}

export async function dbGetBuyerIntentsForCustomer(customerUserId: number, limit = 12) {
  return prisma.buyerIntent.findMany({
    where: {
      customerUserId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    include: {
      product: {
        select: {
          id: true,
          slug: true,
          name: true,
          price: true,
        },
      },
    },
  });
}
