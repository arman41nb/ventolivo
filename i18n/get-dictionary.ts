import { cache } from "react";
import ar from "./dictionaries/ar.json";
import de from "./dictionaries/de.json";
import en from "./dictionaries/en.json";
import fa from "./dictionaries/fa.json";
import tr from "./dictionaries/tr.json";
import type { Locale } from "./config";
import type { Dictionary } from "./types";

const dictionaries: Record<Locale, Dictionary> = {
  en,
  tr,
  de,
  fa,
  ar,
};

export const getDictionary = cache(async (locale: Locale): Promise<Dictionary> => {
  return dictionaries[locale];
});
