"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

const themeStorageKey = "need-to-buy-theme";
const themeChangeEvent = "need-to-buy-theme-change";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem(themeStorageKey);

  return savedTheme === "dark" || savedTheme === "light"
    ? savedTheme
    : getPreferredTheme();
}

function subscribeToTheme(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleMediaChange = () => {
    if (!window.localStorage.getItem(themeStorageKey)) {
      callback();
    }
  };

  window.addEventListener("storage", callback);
  window.addEventListener(themeChangeEvent, callback);
  mediaQuery.addEventListener("change", handleMediaChange);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(themeChangeEvent, callback);
    mediaQuery.removeEventListener("change", handleMediaChange);
  };
}

function getServerTheme(): Theme {
  return "light";
}

function setStoredTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem(themeStorageKey, theme);
  window.dispatchEvent(new Event(themeChangeEvent));
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getStoredTheme,
    getServerTheme,
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggleTheme: () => setStoredTheme(theme === "light" ? "dark" : "light"),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
