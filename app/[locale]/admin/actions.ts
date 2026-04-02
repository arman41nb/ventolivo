"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminLoginSchema } from "@/lib/validations";
import { env } from "@/lib/env";
import {
  clearAdminSessionCookie,
  requireAdminSession,
  setAdminSessionCookie,
} from "@/modules/admin-auth/session";

function getStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getSafeNextPath(next: string, locale: string) {
  return next.startsWith(`/${locale}/admin`) ? next : `/${locale}/admin`;
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

  if (
    result.data.username !== env.ADMIN_USERNAME ||
    result.data.password !== env.ADMIN_PASSWORD
  ) {
    redirect(`/${locale}/admin/login?error=credentials`);
  }

  await setAdminSessionCookie(result.data.username);
  redirect(getSafeNextPath(result.data.next, locale));
}

export async function logoutAdminAction(formData?: FormData) {
  await requireAdminSession();

  const locale =
    (formData ? getStringValue(formData, "locale") : "") ||
    ((await cookies()).get("NEXT_LOCALE")?.value ?? "en");

  await clearAdminSessionCookie();
  redirect(`/${locale}/admin/login?status=logged-out`);
}
