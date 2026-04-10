import { be } from "./locales/be";
import { de } from "./locales/de";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import { hi } from "./locales/hi";
import { ja } from "./locales/ja";
import { pl } from "./locales/pl";
import { pt } from "./locales/pt";
import { ru } from "./locales/ru";
import { uk } from "./locales/uk";
import { zh } from "./locales/zh";
import type { Locale } from "./config";
import type { DeepPartial, Messages } from "./types";

function mergeMessages<T>(base: T, override: DeepPartial<T>): T {
  const result = { ...base };

  for (const key of Object.keys(override) as Array<keyof T>) {
    const baseValue = base[key];
    const overrideValue = override[key];

    if (
      Array.isArray(overrideValue) ||
      overrideValue === undefined ||
      overrideValue === null ||
      typeof overrideValue !== "object" ||
      typeof baseValue !== "object" ||
      baseValue === null
    ) {
      result[key] = overrideValue as T[keyof T];
      continue;
    }

    result[key] = mergeMessages(
      baseValue as NonNullable<T[keyof T]>,
      overrideValue as DeepPartial<NonNullable<T[keyof T]>>,
    ) as T[keyof T];
  }

  return result;
}

export const messages: Record<Locale, Messages> = {
  en,
  de: mergeMessages(en, de),
  ru: mergeMessages(en, ru),
  be: mergeMessages(en, be),
  uk: mergeMessages(en, uk),
  pl: mergeMessages(en, pl),
  es: mergeMessages(en, es),
  fr: mergeMessages(en, fr),
  pt: mergeMessages(en, pt),
  hi: mergeMessages(en, hi),
  zh: mergeMessages(en, zh),
  ja: mergeMessages(en, ja),
};
