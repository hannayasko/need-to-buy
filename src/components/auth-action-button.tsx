"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/auth/auth-provider";
import { useI18n } from "@/i18n/i18n-provider";

export function AuthActionButton() {
  const { t } = useI18n();
  const { authStatus, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  if (authStatus === "loading") {
    return (
      <div
        aria-hidden="true"
        className="app-soft h-11 w-20 rounded-md"
      />
    );
  }

  if (authStatus === "authenticated") {
    return (
      <button
        className="app-button flex min-h-11 items-center justify-center rounded-md px-3 text-sm font-medium outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)] disabled:opacity-50"
        disabled={submitting}
        onClick={() => {
          setSubmitting(true);

          void signOut().then((result) => {
            setSubmitting(false);

            if (!result.error) {
              router.push("/");
            }
          });
        }}
        type="button"
      >
        {submitting ? t.auth.signOutLoading : t.nav.signOut}
      </button>
    );
  }

  if (pathname === "/auth") {
    return null;
  }

  return (
    <Link
      className="app-button inline-flex min-h-11 items-center justify-center rounded-md px-3 text-sm font-medium outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)]"
      href="/auth"
    >
      {t.nav.signIn}
    </Link>
  );
}
