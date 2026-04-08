import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { I18nProvider } from "@/hooks/useI18n";
import { generatePageMetadata } from "@/lib/seo";
import { getSiteLocales } from "@/modules/site-content/server";
import "../globals.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const siteLocales = await getSiteLocales();

  if (!siteLocales.some((siteLocale) => siteLocale.code === locale)) {
    return {};
  }

  const dict = await getDictionary(locale);
  const baseMetadata = generatePageMetadata({
    title: `${dict.seo.siteName} - ${dict.seo.tagline}`,
    description: dict.seo.description,
  });

  return {
    ...baseMetadata,
    title: {
      default: `${dict.seo.siteName} - ${dict.seo.tagline}`,
      template: `%s | ${dict.seo.siteName}`,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: rawLocale } = await params;

  if (!isValidLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const [siteLocales, dictionary] = await Promise.all([getSiteLocales(), getDictionary(locale)]);
  const localeConfig = siteLocales.find((siteLocale) => siteLocale.code === locale);

  if (!localeConfig) {
    notFound();
  }

  return (
    <html lang={locale} dir={localeConfig.direction} className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <I18nProvider dictionary={dictionary} locale={locale}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
