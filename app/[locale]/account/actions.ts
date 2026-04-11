"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { customerLoginSchema, customerRegistrationSchema } from "@/lib/validations";
import {
  authenticateCustomer,
  getSafeCustomerNextPath,
  logoutCustomerSession,
  registerCustomer,
} from "@/services/customer-auth";

function getStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function loginCustomerAction(formData: FormData) {
  const locale = getStringValue(formData, "locale") || "en";
  const next = getStringValue(formData, "next");
  const result = customerLoginSchema.safeParse({
    email: getStringValue(formData, "email"),
    password: getStringValue(formData, "password"),
    next,
  });

  if (!result.success) {
    redirect(
      `/${locale}/account/login?mode=signin&error=invalid${
        next ? `&next=${encodeURIComponent(next)}` : ""
      }`,
    );
  }

  const headerStore = await headers();
  const authenticationResult = await authenticateCustomer({
    email: result.data.email,
    password: result.data.password,
    ipAddress: headerStore.get("x-forwarded-for")?.split(",")[0]?.trim(),
    userAgent: headerStore.get("user-agent") ?? undefined,
  });

  if (!authenticationResult.ok) {
    const error =
      authenticationResult.reason === "rate_limited"
        ? "rate-limit"
        : authenticationResult.reason === "disabled"
          ? "disabled"
          : "credentials";

    redirect(
      `/${locale}/account/login?mode=signin&error=${error}${
        result.data.next ? `&next=${encodeURIComponent(result.data.next)}` : ""
      }`,
    );
  }

  redirect(getSafeCustomerNextPath(result.data.next, locale));
}

export async function registerCustomerAction(formData: FormData) {
  const locale = getStringValue(formData, "locale") || "en";
  const next = getStringValue(formData, "next");
  const result = customerRegistrationSchema.safeParse({
    fullName: getStringValue(formData, "fullName"),
    email: getStringValue(formData, "email"),
    phone: getStringValue(formData, "phone"),
    password: getStringValue(formData, "password"),
    confirmPassword: getStringValue(formData, "confirmPassword"),
    marketingConsent: getStringValue(formData, "marketingConsent") === "on",
  });

  if (!result.success) {
    redirect(
      `/${locale}/account/login?mode=register&error=invalid${
        next ? `&next=${encodeURIComponent(next)}` : ""
      }`,
    );
  }

  const headerStore = await headers();
  const registrationResult = await registerCustomer({
    fullName: result.data.fullName,
    email: result.data.email,
    phone: result.data.phone,
    password: result.data.password,
    marketingConsent: result.data.marketingConsent,
    ipAddress: headerStore.get("x-forwarded-for")?.split(",")[0]?.trim(),
    userAgent: headerStore.get("user-agent") ?? undefined,
  });

  if (!registrationResult.ok) {
    const error =
      registrationResult.reason === "rate_limited"
        ? "rate-limit"
        : registrationResult.reason === "email_taken"
          ? "email"
          : "invalid";

    redirect(
      `/${locale}/account/login?mode=register&error=${error}${
        next ? `&next=${encodeURIComponent(next)}` : ""
      }`,
    );
  }

  redirect(getSafeCustomerNextPath(next, locale));
}

export async function logoutCustomerAction(formData: FormData) {
  const locale = getStringValue(formData, "locale") || "en";
  await logoutCustomerSession();
  redirect(`/${locale}/account/login?status=logged-out`);
}
