"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/auth/auth-provider";
import { useI18n } from "@/i18n/i18n-provider";
import { useTheme } from "@/theme/theme-provider";
import { MobileSheet } from "./mobile-sheet";
import { SettingsIcon } from "./icons";

export function SettingsSheet() {
  const { authStatus, signOut, user } = useAuth();
  const { locale, localeOptions, setLocale, t } = useI18n();
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  return (
    <>
      <button
        aria-label={t.settings.button}
        className="app-button inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)]"
        onClick={() => setOpen(true)}
        type="button"
      >
        <SettingsIcon height={18} width={18} />
        <span>{t.settings.button}</span>
      </button>

      <MobileSheet
        onClose={() => setOpen(false)}
        open={open}
        title={t.settings.title}
      >
        <div className="space-y-5">
          <section className="app-soft rounded-lg px-4 py-4">
            <p className="app-muted text-sm font-medium">{t.settings.account}</p>

            {authStatus === "loading" ? (
              <div className="mt-3 space-y-2">
                <div aria-hidden="true" className="app-card h-4 w-28 rounded-full" />
                <div aria-hidden="true" className="app-card h-11 w-full rounded-md" />
              </div>
            ) : null}

            {authStatus === "authenticated" ? (
              <div className="mt-3 space-y-3">
                <div>
                  <p className="app-text text-base font-semibold">
                    {user?.email ?? t.settings.accountReady}
                  </p>
                  <p className="app-muted mt-1 text-sm leading-6">
                    {t.settings.accountReady}
                  </p>
                </div>
                <button
                  className="app-button flex min-h-12 w-full items-center justify-center rounded-md px-4 text-base font-medium outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)] disabled:opacity-50"
                  disabled={submitting}
                  onClick={() => {
                    setSubmitting(true);

                    void signOut().then((result) => {
                      setSubmitting(false);

                      if (!result.error) {
                        setOpen(false);
                        router.push("/");
                      }
                    });
                  }}
                  type="button"
                >
                  {submitting ? t.auth.signOutLoading : t.nav.signOut}
                </button>
              </div>
            ) : null}

            {authStatus === "signed-out" ? (
              <div className="mt-3 space-y-3">
                <p className="app-muted text-sm leading-6">{t.settings.guestBody}</p>
                {pathname !== "/auth" ? (
                  <button
                    className="app-primary-button flex min-h-12 w-full items-center justify-center rounded-md px-4 text-base font-semibold outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)]"
                    onClick={() => {
                      setOpen(false);
                      router.push("/auth");
                    }}
                    type="button"
                  >
                    {t.settings.signInCta}
                  </button>
                ) : null}
              </div>
            ) : null}
          </section>

          <section>
            <p className="app-muted text-sm font-medium">{t.settings.theme}</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                aria-pressed={theme === "light"}
                className={`min-h-12 rounded-md px-4 text-base font-medium outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)] ${
                  theme === "light" ? "app-accent-chip" : "app-button"
                }`}
                onClick={() => setTheme("light")}
                type="button"
              >
                {t.nav.lightMode}
              </button>
              <button
                aria-pressed={theme === "dark"}
                className={`min-h-12 rounded-md px-4 text-base font-medium outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)] ${
                  theme === "dark" ? "app-accent-chip" : "app-button"
                }`}
                onClick={() => setTheme("dark")}
                type="button"
              >
                {t.nav.darkMode}
              </button>
            </div>
          </section>

          <section>
            <label className="block">
              <span className="app-muted text-sm font-medium">
                {t.settings.language}
              </span>
              <select
                className="app-input app-button mt-2 h-14 w-full rounded-md px-4 text-base outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)]"
                onChange={(event) => setLocale(event.target.value as typeof locale)}
                value={locale}
              >
                {localeOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </section>
        </div>
      </MobileSheet>
    </>
  );
}
