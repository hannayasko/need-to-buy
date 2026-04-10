"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "@/i18n/i18n-provider";
import { CloseIcon } from "./icons";

type MobileSheetProps = {
  children: ReactNode;
  onClose: () => void;
  open: boolean;
  title: string;
};

export function MobileSheet({
  children,
  onClose,
  open,
  title,
}: MobileSheetProps) {
  const { t } = useI18n();

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div aria-modal="true" className="fixed inset-0 z-[80]" role="dialog">
      <button
        aria-label={t.common.close}
        className="app-overlay absolute inset-0"
        onClick={onClose}
        type="button"
      />

      <div className="app-sheet absolute inset-x-0 bottom-0 z-10 mx-auto w-full max-w-xl rounded-t-lg">
        <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-[var(--surface-strong)]" />
        <div className="app-divider flex items-center justify-between gap-3 border-b px-4 py-4">
          <h2 className="app-text text-base font-semibold">{title}</h2>
          <button
            aria-label={t.common.close}
            className="app-icon-button flex h-11 w-11 items-center justify-center rounded-md border outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)]"
            onClick={onClose}
            type="button"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-4 py-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
