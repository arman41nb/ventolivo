import { cache } from "react";
import ar from "./dictionaries/ar.json";
import de from "./dictionaries/de.json";
import en from "./dictionaries/en.json";
import fa from "./dictionaries/fa.json";
import tr from "./dictionaries/tr.json";
import { defaultLocale, getLocaleCandidates, type Locale } from "./config";
import type { Dictionary } from "./types";

function normalizeDictionary(dictionary: unknown): Dictionary {
  const candidate = dictionary as Partial<Dictionary>;
  const admin = candidate.admin ?? en.admin;
  const dashboard = admin.dashboard ?? en.admin.dashboard;
  const navigation = admin.navigation ?? en.admin.navigation;
  const mediaLibrary = admin.mediaLibrary ?? en.admin.mediaLibrary;
  const siteStudio = admin.siteStudio ?? en.admin.siteStudio;
  const create = admin.create ?? en.admin.create;
  const inventory = admin.inventory ?? en.admin.inventory;
  const form = admin.form ?? en.admin.form;
  const shell = admin.shell ?? en.admin.shell;
  const translationAssistant =
    admin.translationAssistant ?? en.admin.translationAssistant;
  const productEditor = admin.productEditor ?? en.admin.productEditor;
  const siteTranslationAssistant =
    admin.siteTranslationAssistant ?? en.admin.siteTranslationAssistant;
  const siteLocalesManager =
    admin.siteLocalesManager ?? en.admin.siteLocalesManager;
  const mediaManager = admin.mediaManager ?? en.admin.mediaManager;
  const status = admin.status ?? en.admin.status;

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
      navigation: {
        ...en.admin.navigation,
        ...navigation,
      },
      shell: {
        ...en.admin.shell,
        ...shell,
      },
      mediaLibrary: {
        ...en.admin.mediaLibrary,
        ...mediaLibrary,
      },
      siteStudio: {
        ...en.admin.siteStudio,
        ...siteStudio,
      },
      login: {
        ...en.admin.login,
        ...(admin.login ?? {}),
      },
      create: {
        ...en.admin.create,
        ...create,
      },
      inventory: {
        ...en.admin.inventory,
        ...inventory,
      },
      form: {
        ...en.admin.form,
        ...form,
      },
      translationAssistant: {
        ...en.admin.translationAssistant,
        ...translationAssistant,
      },
      productEditor: {
        ...en.admin.productEditor,
        ...productEditor,
        tabs: {
          ...en.admin.productEditor.tabs,
          ...(productEditor.tabs ?? {}),
        },
      },
      siteTranslationAssistant: {
        ...en.admin.siteTranslationAssistant,
        ...siteTranslationAssistant,
      },
      siteLocalesManager: {
        ...en.admin.siteLocalesManager,
        ...siteLocalesManager,
      },
      mediaManager: {
        ...en.admin.mediaManager,
        ...mediaManager,
      },
      status: {
        ...en.admin.status,
        ...status,
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
  for (const candidate of getLocaleCandidates(locale)) {
    const dictionary = dictionaries[candidate];

    if (dictionary) {
      return dictionary;
    }
  }

  return dictionaries[defaultLocale];
});
