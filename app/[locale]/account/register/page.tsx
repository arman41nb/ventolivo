import { notFound, redirect } from "next/navigation";
import { isValidLocale } from "@/i18n/config";

export default async function CustomerRegisterPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const { next } = await searchParams;
  redirect(
    `/${locale}/account/login?mode=register${next ? `&next=${encodeURIComponent(next)}` : ""}`,
  );
}
