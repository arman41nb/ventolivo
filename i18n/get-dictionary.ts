import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Locale } from "./config";
import type { Dictionary } from "./types";

const dictionaryFiles: Record<Locale, string> = {
  en: "en.json",
  tr: "tr.json",
  de: "de.json",
  fa: "fa.json",
  ar: "ar.json",
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const filePath = path.join(
    process.cwd(),
    "i18n",
    "dictionaries",
    dictionaryFiles[locale],
  );
  const fileContents = await readFile(filePath, "utf8");

  return JSON.parse(fileContents) as Dictionary;
}
