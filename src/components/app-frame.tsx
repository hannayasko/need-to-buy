"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useI18n } from "@/i18n/i18n-provider";
import { AuthActionButton } from "./auth-action-button";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

export function AppFrame({ children }: { children: ReactNode }) {
  const { t } = useI18n();

  return (
    <div className="app-page min-h-screen">
      <header className="app-surface sticky top-0 z-30 border-b app-divider backdrop-blur">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-3 px-4 py-3 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
          <Link
            className="min-w-0 rounded-md outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
            href="/"
          >
            <span className="flex items-center gap-3">
              <Image
                aria-hidden="true"
                alt=""
                className="h-6 w-6"
                height={24}
                src="/file.svg"
                width={24}
              />
              <span className="app-text min-w-0 truncate text-base font-semibold">
                {t.app.name}
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <AuthActionButton />
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
