"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { defaultLocale, isLocale, localeOptions, type Locale } from "./config";
import { messages } from "./messages";
import type { Messages } from "./types";

const localeStorageKey = "need-to-buy-locale";
const localeChangeEvent = "need-to-buy-locale-change";

type I18nContextValue = {
  locale: Locale;
  localeOptions: typeof localeOptions;
  setLocale: (locale: Locale) => void;
  t: Messages;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function getStoredLocale(): Locale {
  if (typeof window === "undefined") {
    return defaultLocale;
  }

  const savedLocale = window.localStorage.getItem(localeStorageKey);

  return isLocale(savedLocale) ? savedLocale : defaultLocale;
}

function getServerLocale(): Locale {
  return defaultLocale;
}

function subscribeToLocale(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(localeChangeEvent, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(localeChangeEvent, callback);
  };
}

function setStoredLocale(locale: Locale) {
  window.localStorage.setItem(localeStorageKey, locale);
  window.dispatchEvent(new Event(localeChangeEvent));
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getStoredLocale,
    getServerLocale,
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      localeOptions,
      setLocale: setStoredLocale,
      t: messages[locale],
    }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}
