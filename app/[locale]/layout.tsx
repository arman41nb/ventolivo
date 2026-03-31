import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDirection, isValidLocale, locales } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { I18nProvider } from "@/hooks/useI18n";
import { AppProvider } from "@/stores";
import { generatePageMetadata } from "@/lib/seo";
import "../globals.css";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

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
  const dir = getDirection(locale);
  const dictionary = await getDictionary(locale);

  return (
    <html lang={locale} dir={dir} className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AppProvider>
          <I18nProvider dictionary={dictionary} locale={locale}>
            {children}
          </I18nProvider>
        </AppProvider>
      </body>
    </html>
  );
}
