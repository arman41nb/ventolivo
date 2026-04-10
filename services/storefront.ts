import "server-only";

import { defaultLocale, type Locale } from "@/i18n";
import { getDictionary } from "@/i18n";
import {
  getSiteContentSettings,
  getSiteContentTranslation,
  getSiteLocales,
} from "@/services/site-content";
import { resolveStorefrontContent, type StorefrontContent } from "@/modules/site-content";

export interface StorefrontData {
  content: StorefrontContent;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  siteSettings: Awaited<ReturnType<typeof getSiteContentSettings>>;
  supportedLocales: Awaited<ReturnType<typeof getSiteLocales>>;
}

export async function getStorefrontData(locale: Locale): Promise<StorefrontData> {
  const [dictionary, siteSettings, supportedLocales, localizedContent] = await Promise.all([
    getDictionary(locale),
    getSiteContentSettings(),
    getSiteLocales(),
    locale === defaultLocale ? Promise.resolve(undefined) : getSiteContentTranslation(locale),
  ]);

  return {
    content: resolveStorefrontContent(dictionary, siteSettings, localizedContent),
    dictionary,
    siteSettings,
    supportedLocales,
  };
}
