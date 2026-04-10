"use client";

import { useI18n } from "@/i18n/i18n-provider";
import { useTheme } from "@/theme/theme-provider";
import { MoonIcon, SunIcon } from "./icons";

export function ThemeToggle() {
  const { t } = useI18n();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";
  const label = isDark ? t.nav.lightMode : t.nav.darkMode;

  return (
    <button
      aria-label={`${t.nav.toggleTheme}: ${label}`}
      className="app-icon-button flex h-11 w-11 items-center justify-center rounded-md border outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)]"
      onClick={toggleTheme}
      type="button"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
