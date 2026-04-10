"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/i18n-provider";
import type { Locale } from "@/i18n/config";
import { CheckIcon, GlobeIcon } from "./icons";
import { MobileSheet } from "./mobile-sheet";

export function LanguageSwitcher() {
  const { locale, localeOptions, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        aria-label={t.nav.language}
        className="app-icon-button flex h-11 items-center gap-2 rounded-md border px-3 text-sm font-medium outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)]"
        onClick={() => setOpen(true)}
        type="button"
      >
        <GlobeIcon />
        <span>{locale.toUpperCase()}</span>
      </button>

      <MobileSheet
        onClose={() => setOpen(false)}
        open={open}
        title={t.nav.language}
      >
        <div className="flex flex-col gap-2">
          {localeOptions.map((option) => {
            const selected = option.code === locale;

            return (
              <button
                aria-pressed={selected}
                className={`flex min-h-14 items-center justify-between rounded-md border px-4 py-3 text-left outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)] ${
                  selected
                    ? "app-accent-chip border-transparent"
                    : "app-button"
                }`}
                key={option.code}
                onClick={() => {
                  setLocale(option.code as Locale);
                  setOpen(false);
                }}
                type="button"
              >
                <span className="text-base font-medium">{option.label}</span>
                {selected ? <CheckIcon /> : null}
              </button>
            );
          })}
        </div>
      </MobileSheet>
    </>
  );
}
