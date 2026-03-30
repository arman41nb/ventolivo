"use client";

import { createContext, useContext } from "react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n";

interface I18nContextValue {
  dictionary: Dictionary;
  locale: Locale;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  dictionary,
  locale,
}: {
  children: React.ReactNode;
  dictionary: Dictionary;
  locale: Locale;
}) {
  return (
    <I18nContext.Provider value={{ dictionary, locale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export function useDictionary(): Dictionary {
  return useI18n().dictionary;
}

export function useLocale(): Locale {
  return useI18n().locale;
}
