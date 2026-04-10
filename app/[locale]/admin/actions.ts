"use server";

import { cookies } from "next/headers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminLoginSchema } from "@/lib/validations";
import { authenticateAdmin, getSafeAdminNextPath, logoutAdminSession } from "@/services/admin-auth";

function getStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function loginAdminAction(formData: FormData) {
  const result = adminLoginSchema.safeParse({
    username: getStringValue(formData, "username"),
    password: getStringValue(formData, "password"),
    next: getStringValue(formData, "next"),
  });

  if (!result.success) {
    redirect(`/en/admin/login?error=invalid`);
  }

  const locale = getStringValue(formData, "locale") || "en";
  const headerStore = await headers();
  const isAuthenticated = await authenticateAdmin({
    username: result.data.username,
    password: result.data.password,
    ipAddress: headerStore.get("x-forwarded-for")?.split(",")[0]?.trim(),
    userAgent: headerStore.get("user-agent") ?? undefined,
  });

  if (!isAuthenticated) {
    redirect(`/${locale}/admin/login?error=credentials`);
  }

  redirect(getSafeAdminNextPath(result.data.next, locale));
}

export async function logoutAdminAction(formData?: FormData) {
  const locale =
    (formData ? getStringValue(formData, "locale") : "") ||
    ((await cookies()).get("NEXT_LOCALE")?.value ?? "en");

  await logoutAdminSession();
  redirect(`/${locale}/admin/login?status=logged-out`);
}
