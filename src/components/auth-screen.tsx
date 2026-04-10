"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/auth/auth-provider";
import { useI18n } from "@/i18n/i18n-provider";

type AuthMode = "sign-in" | "sign-up";

function isValidEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value);
}

function formatAuthError(message: string | null, t: ReturnType<typeof useI18n>["t"]) {
  if (!message) {
    return t.common.genericError;
  }

  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("invalid login credentials")) {
    return t.auth.invalidCredentials;
  }

  if (normalizedMessage.includes("email not confirmed")) {
    return t.auth.emailNotConfirmed;
  }

  if (normalizedMessage.includes("user already registered")) {
    return t.auth.accountExists;
  }

  if (normalizedMessage.includes("signups not allowed")) {
    return t.auth.signUpDisabled;
  }

  return t.common.genericError;
}

export function AuthScreen() {
  const { t } = useI18n();
  const { authStatus, signIn, signUp } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authStatus === "authenticated") {
      router.replace("/");
    }
  }, [authStatus, router]);

  const validate = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return t.auth.validationEmailRequired;
    }

    if (!isValidEmail(trimmedEmail)) {
      return t.auth.validationEmailInvalid;
    }

    if (!password) {
      return t.auth.validationPasswordRequired;
    }

    if (password.length < 6) {
      return t.auth.validationPasswordLength;
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();

    setErrorMessage(null);
    setSuccessMessage(null);

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setSubmitting(true);

    try {
      if (mode === "sign-in") {
        const result = await signIn(email.trim(), password);

        if (result.error) {
          setErrorMessage(formatAuthError(result.error, t));
          return;
        }

        router.replace("/");
        return;
      }

      const result = await signUp(email.trim(), password);

      if (result.error) {
        setErrorMessage(formatAuthError(result.error, t));
        return;
      }

      if (result.emailConfirmationRequired) {
        setSuccessMessage(t.auth.signUpSuccessBody);
        setMode("sign-in");
        return;
      }

      router.replace("/");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-xl flex-1 px-4 py-6 pb-[calc(env(safe-area-inset-bottom)+2rem)]">
      <div className="w-full">
        <p className="app-accent-text text-sm font-medium">{t.auth.eyebrow}</p>
        <h1 className="app-text mt-2 text-3xl font-semibold">{t.auth.title}</h1>
        <p className="app-muted mt-3 text-base leading-7">{t.auth.intro}</p>

        <div className="app-card mt-6 rounded-lg p-4">
          <div className="app-soft flex rounded-lg p-1">
            <button
              aria-pressed={mode === "sign-in"}
              className={`min-h-12 flex-1 rounded-md px-4 text-sm font-semibold outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)] ${
                mode === "sign-in" ? "app-surface app-text shadow-sm" : "app-muted"
              }`}
              onClick={() => {
                setMode("sign-in");
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              type="button"
            >
              {t.auth.signInTab}
            </button>
            <button
              aria-pressed={mode === "sign-up"}
              className={`min-h-12 flex-1 rounded-md px-4 text-sm font-semibold outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)] ${
                mode === "sign-up" ? "app-surface app-text shadow-sm" : "app-muted"
              }`}
              onClick={() => {
                setMode("sign-up");
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              type="button"
            >
              {t.auth.signUpTab}
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="app-text mb-2 block text-sm font-medium">
                {t.auth.emailLabel}
              </span>
              <input
                autoCapitalize="none"
                autoComplete="email"
                className="app-input app-button h-14 w-full rounded-md px-4 text-base outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)]"
                inputMode="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t.auth.emailPlaceholder}
                type="email"
                value={email}
              />
            </label>

            <label className="block">
              <span className="app-text mb-2 block text-sm font-medium">
                {t.auth.passwordLabel}
              </span>
              <input
                autoComplete={
                  mode === "sign-in" ? "current-password" : "new-password"
                }
                className="app-input app-button h-14 w-full rounded-md px-4 text-base outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)]"
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t.auth.passwordPlaceholder}
                type="password"
                value={password}
              />
            </label>
          </div>

          {errorMessage ? (
            <div className="mt-4 rounded-lg border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3 text-sm leading-6 text-[var(--danger)]">
              {errorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div className="mt-4 rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-3 text-sm leading-6 text-[var(--accent-text)]">
              {successMessage}
            </div>
          ) : null}

          <button
            className="app-primary-button mt-5 flex min-h-12 w-full items-center justify-center rounded-md px-4 text-base font-semibold outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)] disabled:opacity-50"
            disabled={submitting || authStatus === "loading"}
            onClick={() => void handleSubmit()}
            type="button"
          >
            {submitting
              ? t.auth.submitting
              : mode === "sign-in"
                ? t.auth.submitSignIn
                : t.auth.submitSignUp}
          </button>

          <p className="app-muted mt-4 text-sm leading-6">{t.auth.helper}</p>
        </div>

        <div className="mt-5">
          <Link
            className="app-accent-text inline-flex min-h-11 items-center text-sm font-semibold"
            href="/"
          >
            {t.auth.backHome}
          </Link>
        </div>
      </div>
    </section>
  );
}
