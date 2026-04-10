export const localeOptions = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "ru", label: "Русский" },
  { code: "be", label: "Беларуская" },
  { code: "uk", label: "Українська" },
  { code: "pl", label: "Polski" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "pt", label: "Português" },
  { code: "hi", label: "हिन्दी" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
] as const;

export type Locale = (typeof localeOptions)[number]["code"];

export const defaultLocale: Locale = "en";

export function isLocale(value: string | null): value is Locale {
  return localeOptions.some((option) => option.code === value);
}
