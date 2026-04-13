"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { useI18n } from "@/i18n/i18n-provider";
import { useNotes } from "@/notes/notes-provider";
import {
  ArrowLeftIcon,
  BulletListIcon,
  ChecklistIcon,
  FontSizeDownIcon,
  FontSizeUpIcon,
  PinIcon,
  PlusIcon,
  SharedIcon,
  TuneIcon,
  UnderlineIcon,
} from "./icons";
import { MobileSheet } from "./mobile-sheet";

type FormatButtonProps = {
  active?: boolean;
  ariaLabel: string;
  children: ReactNode;
  onClick: () => void;
};

function createItemId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `item-${Date.now()}`;
}

function FormatButton({
  active = false,
  ariaLabel,
  children,
  onClick,
}: FormatButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      aria-pressed={active}
      className={`flex h-12 w-12 items-center justify-center rounded-md border outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)] ${
        active ? "app-accent-chip border-transparent" : "app-icon-button"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export function NoteEditor({ noteId }: { noteId: string }) {
  const { t } = useI18n();
  const { errorMessage, notes, reloadNotes, status, updateNote } = useNotes();
  const [formatOpen, setFormatOpen] = useState(false);

  const note = useMemo(
    () => notes.find((currentNote) => currentNote.id === noteId) ?? null,
    [noteId, notes],
  );

  if (status === "loading") {
    return (
      <section className="mx-auto w-full max-w-xl px-4 py-8">
        <div className="app-card rounded-lg px-4 py-6">
          <h1 className="app-text text-2xl font-semibold">
            {t.editor.loadingTitle}
          </h1>
          <p className="app-muted mt-3 text-base leading-7">
            {t.editor.loadingBody}
          </p>
        </div>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="mx-auto w-full max-w-xl px-4 py-8">
        <div className="app-card rounded-lg px-4 py-6">
          <h1 className="app-text text-2xl font-semibold">
            {t.editor.errorTitle}
          </h1>
          <p className="app-muted mt-3 text-base leading-7">
            {t.editor.errorBody}
          </p>
          <div className="mt-5 flex gap-3">
            <button
              className="app-button min-h-12 rounded-md px-4 text-base font-medium outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)]"
              onClick={() => void reloadNotes()}
              type="button"
            >
              {t.common.retry}
            </button>
            <Link
              className="app-accent-text inline-flex min-h-12 items-center text-sm font-semibold"
              href="/"
            >
              {t.editor.backHome}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!note) {
    return (
      <section className="mx-auto w-full max-w-xl px-4 py-8">
        <div className="app-card rounded-lg px-4 py-6">
          <h1 className="app-text text-2xl font-semibold">
            {t.editor.missingNoteTitle}
          </h1>
          <p className="app-muted mt-3 text-base leading-7">
            {t.editor.missingNoteBody}
          </p>
          <Link
            className="app-accent-text mt-5 inline-flex min-h-11 items-center text-sm font-semibold"
            href="/"
          >
            {t.editor.backHome}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="mx-auto w-full max-w-xl px-4 py-4 pb-[calc(env(safe-area-inset-bottom)+7rem)]">
        <div className="flex items-center gap-3">
          <Link
            className="app-muted inline-flex min-h-11 items-center gap-2 rounded-md px-1 text-sm font-medium outline-none transition hover:text-[var(--accent-strong)] focus:ring-2 focus:ring-[var(--focus-ring)]"
            href="/"
          >
            <ArrowLeftIcon />
            <span>{t.editor.backHome}</span>
          </Link>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {note.is_pinned ? (
            <span className="app-chip inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-sm font-medium">
              <PinIcon height={16} width={16} />
              {t.home.pinned}
            </span>
          ) : null}
          {note.shared ? (
            <span className="app-chip inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-sm font-medium">
              <SharedIcon height={16} width={16} />
              {t.home.shared}
            </span>
          ) : null}
          <span className="app-chip rounded-md px-2.5 py-1 text-sm font-medium">
            {note.listMode === "checklist"
              ? t.editor.checklistMode
              : t.editor.bulletMode}
          </span>
        </div>

        <div className="mt-5">
          <label>
            <span className="sr-only">{t.editor.titleLabel}</span>
            <input
              aria-label={t.editor.titleLabel}
              className="app-input w-full bg-transparent text-3xl font-semibold outline-none"
              onChange={(event) =>
                updateNote(note.id, (currentNote) => ({
                  ...currentNote,
                  title: event.target.value,
                }))
              }
              value={note.title}
            />
          </label>
        </div>

        {errorMessage ? (
          <div className="mt-4 rounded-lg border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3 text-sm leading-6 text-[var(--danger)]">
            {t.common.genericError}
          </div>
        ) : null}

        <p className="app-muted mt-3 text-sm leading-6">{t.editor.panelHint}</p>

        <section aria-label={t.editor.listLabel} className="mt-6">
          <div className="space-y-3">
            {note.items.map((item) => (
              <div
                className="app-card flex min-h-14 items-start gap-3 rounded-lg px-3 py-3"
                key={item.id}
              >
                {note.listMode === "checklist" ? (
                  <input
                    aria-label={`${item.text || t.editor.itemPlaceholder}: ${
                      item.checked ? t.editor.checked : t.editor.unchecked
                    }`}
                    checked={item.checked}
                    className="mt-1 h-6 w-6 shrink-0 rounded-md accent-[var(--accent)]"
                    onChange={() =>
                      updateNote(note.id, (currentNote) => ({
                        ...currentNote,
                        items: currentNote.items.map((currentItem) =>
                          currentItem.id === item.id
                            ? {
                                ...currentItem,
                                checked: !currentItem.checked,
                              }
                            : currentItem,
                        ),
                      }))
                    }
                    type="checkbox"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="app-accent-text mt-2 inline-flex h-5 w-5 shrink-0 items-center justify-center"
                  >
                    <svg fill="currentColor" height="8" viewBox="0 0 8 8" width="8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                  </span>
                )}

                <input
                  aria-label={t.editor.itemPlaceholder}
                  className={`app-input min-h-11 flex-1 bg-transparent py-1 outline-none ${
                    note.underline ? "underline decoration-2 underline-offset-4" : ""
                  }`}
                  onChange={(event) =>
                    updateNote(note.id, (currentNote) => ({
                      ...currentNote,
                      items: currentNote.items.map((currentItem) =>
                        currentItem.id === item.id
                          ? {
                              ...currentItem,
                              text: event.target.value,
                            }
                          : currentItem,
                      ),
                    }))
                  }
                  placeholder={t.editor.itemPlaceholder}
                  style={{ fontSize: `${note.fontSize}px` }}
                  value={item.text}
                />
              </div>
            ))}
          </div>
        </section>
      </section>

      <div className="app-surface app-divider fixed inset-x-0 bottom-0 z-40 border-t">
        <div className="mx-auto flex w-full max-w-xl items-center gap-3 px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
          <button
            className="app-primary-button flex min-h-12 flex-1 items-center justify-center gap-2 rounded-md px-4 text-base font-semibold outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)]"
            onClick={() =>
              updateNote(note.id, (currentNote) => ({
                ...currentNote,
                items: [
                  ...currentNote.items,
                  {
                    checked: false,
                    id: createItemId(),
                    text: "",
                  },
                ],
              }))
            }
            type="button"
          >
            <PlusIcon />
            <span>{t.editor.addItem}</span>
          </button>

          <button
            aria-label={t.editor.formatting}
            className="app-icon-button flex h-12 w-12 items-center justify-center rounded-md border outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)]"
            onClick={() => setFormatOpen(true)}
            type="button"
          >
            <TuneIcon />
          </button>
        </div>
      </div>

      <MobileSheet
        onClose={() => setFormatOpen(false)}
        open={formatOpen}
        title={t.editor.formatting}
      >
        <div className="space-y-5">
          <div>
            <p className="app-muted text-sm font-medium">{t.editor.listMode}</p>
            <div className="mt-2 flex gap-2">
              <FormatButton
                active={note.listMode === "checklist"}
                ariaLabel={t.editor.checkboxList}
                onClick={() =>
                  updateNote(note.id, (currentNote) => ({
                    ...currentNote,
                    listMode: "checklist",
                  }))
                }
              >
                <ChecklistIcon />
              </FormatButton>
              <FormatButton
                active={note.listMode === "bullet"}
                ariaLabel={t.editor.bulletList}
                onClick={() =>
                  updateNote(note.id, (currentNote) => ({
                    ...currentNote,
                    listMode: "bullet",
                  }))
                }
              >
                <BulletListIcon />
              </FormatButton>
            </div>
          </div>

          <div>
            <p className="app-muted text-sm font-medium">{t.editor.fontSize}</p>
            <div className="mt-2 flex items-center gap-2">
              <FormatButton
                ariaLabel={t.editor.decreaseFont}
                onClick={() =>
                  updateNote(note.id, (currentNote) => ({
                    ...currentNote,
                    fontSize: Math.max(15, currentNote.fontSize - 1),
                  }))
                }
              >
                <FontSizeDownIcon />
              </FormatButton>
              <div className="app-soft app-text flex h-12 min-w-20 items-center justify-center rounded-md border border-[var(--border)] px-3 text-base font-semibold">
                {note.fontSize}px
              </div>
              <FormatButton
                ariaLabel={t.editor.increaseFont}
                onClick={() =>
                  updateNote(note.id, (currentNote) => ({
                    ...currentNote,
                    fontSize: Math.min(24, currentNote.fontSize + 1),
                  }))
                }
              >
                <FontSizeUpIcon />
              </FormatButton>
            </div>
          </div>

          <div>
            <p className="app-muted text-sm font-medium">{t.editor.underline}</p>
            <div className="mt-2">
              <FormatButton
                active={note.underline}
                ariaLabel={t.editor.underline}
                onClick={() =>
                  updateNote(note.id, (currentNote) => ({
                    ...currentNote,
                    underline: !currentNote.underline,
                  }))
                }
              >
                <UnderlineIcon />
              </FormatButton>
            </div>
          </div>

          <p className="app-muted text-sm leading-6">{t.editor.panelHint}</p>
        </div>
      </MobileSheet>
    </>
  );
}
