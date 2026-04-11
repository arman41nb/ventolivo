export const customerUserStatuses = ["active", "disabled"] as const;
export type CustomerUserStatus = (typeof customerUserStatuses)[number];

export function normalizeCustomerEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizeCustomerName(value: string): string {
  return value.trim();
}

export function normalizeCustomerPhone(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : undefined;
}

export function isActiveCustomerStatus(
  status: string | null | undefined,
): status is CustomerUserStatus {
  return status === "active";
}
