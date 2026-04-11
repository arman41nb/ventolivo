"use server";

import { cookies } from "next/headers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminLoginSchema, adminRegistrationSchema } from "@/lib/validations";
import {
  authenticateAdmin,
  getAdminSession,
  getSafeAdminNextPath,
  logoutAdminSession,
  registerAdmin,
} from "@/services/admin-auth";

function getStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function loginAdminAction(formData: FormData) {
  const locale = getStringValue(formData, "locale") || "en";
  const result = adminLoginSchema.safeParse({
    identifier: getStringValue(formData, "identifier"),
    password: getStringValue(formData, "password"),
    next: getStringValue(formData, "next"),
  });

  if (!result.success) {
    redirect(`/${locale}/admin/login?error=invalid`);
  }

  const headerStore = await headers();
  const authenticationResult = await authenticateAdmin({
    identifier: result.data.identifier,
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

    redirect(`/${locale}/admin/login?error=${error}`);
  }

  redirect(getSafeAdminNextPath(result.data.next, locale));
}

export async function registerAdminAction(formData: FormData) {
  const locale = getStringValue(formData, "locale") || "en";
  const result = adminRegistrationSchema.safeParse({
    displayName: getStringValue(formData, "displayName"),
    email: getStringValue(formData, "email"),
    username: getStringValue(formData, "username"),
    password: getStringValue(formData, "password"),
    confirmPassword: getStringValue(formData, "confirmPassword"),
    setupToken: getStringValue(formData, "setupToken"),
  });

  if (!result.success) {
    redirect(`/${locale}/admin/register?error=invalid`);
  }

  const headerStore = await headers();
  const session = await getAdminSession();
  const registrationResult = await registerAdmin({
    ...result.data,
    creator: session
      ? {
          id: session.user.id,
          username: session.user.username,
          role: session.user.role,
          status: session.user.status,
        }
      : undefined,
    ipAddress: headerStore.get("x-forwarded-for")?.split(",")[0]?.trim(),
    userAgent: headerStore.get("user-agent") ?? undefined,
  });

  if (!registrationResult.ok) {
    const errorMap = {
      registration_closed: "closed",
      username_taken: "username",
      email_taken: "email",
      rate_limited: "rate-limit",
      insufficient_permissions: "forbidden",
      setup_token_required: "setup-token-required",
      invalid_setup_token: "setup-token-invalid",
    } as const;

    redirect(`/${locale}/admin/register?error=${errorMap[registrationResult.reason]}`);
  }

  if (registrationResult.mode === "team") {
    redirect(`/${locale}/admin/register?status=created`);
  }

  redirect(`/${locale}/admin`);
}

export async function logoutAdminAction(formData?: FormData) {
  const locale =
    (formData ? getStringValue(formData, "locale") : "") ||
    ((await cookies()).get("NEXT_LOCALE")?.value ?? "en");

  await logoutAdminSession();
  redirect(`/${locale}/admin/login?status=logged-out`);
}
