import { cache } from "react";
import ar from "./dictionaries/ar.json";
import de from "./dictionaries/de.json";
import en from "./dictionaries/en.json";
import fa from "./dictionaries/fa.json";
import tr from "./dictionaries/tr.json";
import type { Locale } from "./config";
import type { Dictionary } from "./types";

function normalizeDictionary(dictionary: unknown): Dictionary {
  const candidate = dictionary as Partial<Dictionary>;
  const admin = candidate.admin ?? en.admin;
  const dashboard = admin.dashboard ?? en.admin.dashboard;

  return {
    ...en,
    ...candidate,
    admin: {
      ...en.admin,
      ...admin,
      dashboard: {
        ...en.admin.dashboard,
        ...dashboard,
      },
      login: {
        ...en.admin.login,
        ...(admin.login ?? {}),
      },
    },
  };
}

const dictionaries: Record<string, Dictionary> = {
  en: normalizeDictionary(en),
  tr: normalizeDictionary(tr),
  de: normalizeDictionary(de),
  fa: normalizeDictionary(fa),
  ar: normalizeDictionary(ar),
};

export const getDictionary = cache(async (locale: Locale): Promise<Dictionary> => {
  return dictionaries[locale] ?? dictionaries.en;
});
