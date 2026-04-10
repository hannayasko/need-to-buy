"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useI18n } from "@/i18n/i18n-provider";
import { useNotes } from "@/notes/notes-provider";
import {
  DotsIcon,
  EditIcon,
  PinIcon,
  PlusIcon,
  ShareIcon,
  SharedIcon,
  TrashIcon,
} from "./icons";
import { MobileSheet } from "./mobile-sheet";

function previewItems(items: { text: string }[]) {
  return items
    .map((item) => item.text.trim())
    .filter(Boolean)
    .slice(0, 3);
}

export function HomePage() {
  const { t } = useI18n();
  const router = useRouter();
  const {
    createNote,
    deleteNote,
    errorMessage,
    isUsingDevUser,
    notes,
    reloadNotes,
    renameNote,
    setNoteShared,
    status,
    togglePinned,
  } = useNotes();
  const [actionsNoteId, setActionsNoteId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === actionsNoteId) ?? null,
    [actionsNoteId, notes],
  );

  const openRename = () => {
    if (!selectedNote) {
      return;
    }

    setTitleDraft(selectedNote.title);
    setRenameOpen(true);
  };

  const submitCreate = async () => {
    const nextTitle = titleDraft.trim();

    if (!nextTitle) {
      return;
    }

    const noteId = await createNote(nextTitle);

    if (noteId) {
      setTitleDraft("");
      setCreateOpen(false);
    }
  };

  const submitRename = async () => {
    if (!selectedNote) {
      return;
    }

    const nextTitle = titleDraft.trim();

    if (!nextTitle) {
      return;
    }

    await renameNote(selectedNote.id, nextTitle);
    setRenameOpen(false);
    setActionsNoteId(null);
    setTitleDraft("");
  };

  const confirmDelete = async () => {
    if (!selectedNote) {
      return;
    }

    await deleteNote(selectedNote.id);
    setDeleteOpen(false);
    setActionsNoteId(null);
  };

  return (
    <>
      <section className="mx-auto w-full max-w-xl px-4 py-6 pb-[calc(env(safe-area-inset-bottom)+6.5rem)]">
        <div>
          <p className="app-accent-text text-sm font-medium">{t.home.eyebrow}</p>
          <h1 className="app-text mt-2 text-3xl font-semibold">{t.home.title}</h1>
          <p className="app-muted mt-3 text-base leading-7">{t.home.intro}</p>
          {isUsingDevUser ? (
            <p className="app-muted mt-2 text-sm leading-6">{t.home.devModeHint}</p>
          ) : null}
        </div>

        {status === "ready" && errorMessage ? (
          <div className="mt-4 rounded-lg border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3 text-sm leading-6 text-[var(--danger)]">
            {t.common.genericError}
          </div>
        ) : null}

        <div className="mt-6 space-y-4">
          {status === "loading" ? (
            <div className="app-card rounded-lg px-4 py-6">
              <h2 className="app-text text-lg font-semibold">{t.home.loadingTitle}</h2>
              <p className="app-muted mt-3 text-base leading-7">
                {t.home.loadingBody}
              </p>
            </div>
          ) : null}

          {status === "no-user" ? (
            <div className="app-card rounded-lg px-4 py-6">
              <h2 className="app-text text-lg font-semibold">
                {t.home.authRequiredTitle}
              </h2>
              <p className="app-muted mt-3 text-base leading-7">
                {t.home.authRequiredBody}
              </p>
              <button
                className="app-primary-button mt-5 min-h-12 rounded-md px-4 text-base font-semibold outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)]"
                onClick={() => router.push("/auth")}
                type="button"
              >
                {t.auth.openButton}
              </button>
            </div>
          ) : null}

          {status === "error" ? (
            <div className="app-card rounded-lg px-4 py-6">
              <h2 className="app-text text-lg font-semibold">{t.home.errorTitle}</h2>
              <p className="app-muted mt-3 text-base leading-7">{t.home.errorBody}</p>
              <button
                className="app-button mt-5 min-h-12 rounded-md px-4 text-base font-medium outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)]"
                onClick={() => void reloadNotes()}
                type="button"
              >
                {t.common.retry}
              </button>
            </div>
          ) : null}

          {status === "ready" && notes.length === 0 ? (
            <div className="app-card rounded-lg px-4 py-6">
              <p className="app-muted text-base leading-7">{t.home.emptyState}</p>
            </div>
          ) : null}

          {status === "ready"
            ? notes.map((note) => {
                const items = previewItems(note.items);
                const noteHref = `/notes/${note.id}`;

                return (
                  <article
                    aria-label={note.title}
                    className="app-card cursor-pointer rounded-lg p-4 transition-transform duration-150 active:scale-[0.99] focus-within:ring-2 focus-within:ring-[var(--focus-ring)]"
                    key={note.id}
                    onClick={() => router.push(noteHref)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        router.push(noteHref);
                      }
                    }}
                    role="link"
                    tabIndex={0}
                  >
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <h2 className="app-text text-2xl font-semibold">{note.title}</h2>
                        <p className="app-muted mt-2 text-sm">{t.home.updatedToday}</p>

                        <div className="mt-3 flex flex-wrap gap-2">
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
                        </div>

                        <ul aria-label={t.home.itemPreview} className="mt-4 space-y-2">
                          {items.length > 0 ? (
                            items.map((item) => (
                              <li
                                className="app-soft app-text truncate rounded-md px-3 py-3 text-base"
                                key={item}
                              >
                                {item}
                              </li>
                            ))
                          ) : (
                            <li className="app-soft app-muted rounded-md px-3 py-3 text-base">
                              {t.home.emptyPreview}
                            </li>
                          )}
                        </ul>
                      </div>

                      <button
                        aria-label={t.home.actions}
                        className="app-icon-button flex h-11 w-11 shrink-0 items-center justify-center rounded-md border outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)]"
                        onClick={(event) => {
                          event.stopPropagation();
                          setActionsNoteId(note.id);
                        }}
                        onKeyDown={(event) => {
                          event.stopPropagation();
                        }}
                        type="button"
                      >
                        <DotsIcon />
                      </button>
                    </div>
                  </article>
                );
              })
            : null}
        </div>
      </section>

      <div className="app-surface app-divider fixed inset-x-0 bottom-0 z-40 border-t">
        <div className="mx-auto flex w-full max-w-xl items-center gap-3 px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
          <button
            className="app-primary-button flex min-h-12 flex-1 items-center justify-center gap-2 rounded-md px-4 text-base font-semibold outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)] disabled:opacity-50"
            disabled={status === "loading"}
            onClick={() => {
              if (status === "no-user") {
                router.push("/auth");
                return;
              }

              if (status !== "ready") {
                return;
              }

              setTitleDraft("");
              setCreateOpen(true);
            }}
            type="button"
          >
            <PlusIcon />
            <span>{status === "no-user" ? t.auth.openButton : t.home.newNote}</span>
          </button>
        </div>
      </div>

      <MobileSheet
        onClose={() => {
          setActionsNoteId(null);
          setRenameOpen(false);
          setDeleteOpen(false);
        }}
        open={Boolean(selectedNote) && !renameOpen && !deleteOpen}
        title={selectedNote?.title ?? t.home.actions}
      >
        {selectedNote ? (
          <div className="space-y-3">
            <div className="app-soft rounded-lg px-4 py-4">
              <h2 className="app-text text-lg font-semibold">{t.home.actions}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedNote.is_pinned ? (
                  <span className="app-chip rounded-md px-2.5 py-1 text-sm font-medium">
                    {t.home.pinned}
                  </span>
                ) : null}
                {selectedNote.shared ? (
                  <span className="app-chip rounded-md px-2.5 py-1 text-sm font-medium">
                    {t.home.shared}
                  </span>
                ) : null}
              </div>
            </div>

            <button
              className="app-button flex min-h-14 w-full items-center gap-3 rounded-md px-4 py-3 text-left text-base font-medium outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)]"
              onClick={() => {
                void togglePinned(selectedNote.id);
                setActionsNoteId(null);
              }}
              type="button"
            >
              <PinIcon />
              <span>{selectedNote.is_pinned ? t.home.unpin : t.home.pin}</span>
            </button>

            <button
              className="app-button flex min-h-14 w-full items-center gap-3 rounded-md px-4 py-3 text-left text-base font-medium outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)]"
              onClick={openRename}
              type="button"
            >
              <EditIcon />
              <span>{t.home.rename}</span>
            </button>

            <button
              className="app-button flex min-h-14 w-full items-center gap-3 rounded-md px-4 py-3 text-left text-base font-medium outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)]"
              onClick={() => {
                setNoteShared(selectedNote.id, true);
                setActionsNoteId(null);
              }}
              type="button"
            >
              <ShareIcon />
              <span>{t.home.shareWith}</span>
            </button>

            <button
              className="flex min-h-14 w-full items-center gap-3 rounded-md border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3 text-left text-base font-medium text-[var(--danger)] outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)]"
              onClick={() => setDeleteOpen(true)}
              type="button"
            >
              <TrashIcon />
              <span>{t.common.delete}</span>
            </button>
          </div>
        ) : null}
      </MobileSheet>

      <MobileSheet
        onClose={() => {
          setCreateOpen(false);
          setTitleDraft("");
        }}
        open={createOpen}
        title={t.home.createCollection}
      >
        <div className="space-y-4">
          <label className="block">
            <span className="sr-only">{t.home.titlePlaceholder}</span>
            <input
              aria-label={t.home.titlePlaceholder}
              className="app-input app-button h-14 w-full rounded-md px-4 text-base outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)]"
              onChange={(event) => setTitleDraft(event.target.value)}
              placeholder={t.home.titlePlaceholder}
              value={titleDraft}
            />
          </label>

          <div className="flex gap-3">
            <button
              className="app-button min-h-12 flex-1 rounded-md px-4 text-base font-medium outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)]"
              onClick={() => {
                setCreateOpen(false);
                setTitleDraft("");
              }}
              type="button"
            >
              {t.common.cancel}
            </button>
            <button
              className="app-primary-button min-h-12 flex-1 rounded-md px-4 text-base font-semibold outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)] disabled:opacity-50"
              disabled={titleDraft.trim().length === 0}
              onClick={() => void submitCreate()}
              type="button"
            >
              {t.common.create}
            </button>
          </div>
        </div>
      </MobileSheet>

      <MobileSheet
        onClose={() => {
          setRenameOpen(false);
          setTitleDraft("");
        }}
        open={renameOpen}
        title={t.home.renameCollection}
      >
        <div className="space-y-4">
          <label className="block">
            <span className="sr-only">{t.home.titlePlaceholder}</span>
            <input
              aria-label={t.home.titlePlaceholder}
              className="app-input app-button h-14 w-full rounded-md px-4 text-base outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)]"
              onChange={(event) => setTitleDraft(event.target.value)}
              placeholder={t.home.titlePlaceholder}
              value={titleDraft}
            />
          </label>

          <div className="flex gap-3">
            <button
              className="app-button min-h-12 flex-1 rounded-md px-4 text-base font-medium outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)]"
              onClick={() => {
                setRenameOpen(false);
                setTitleDraft("");
              }}
              type="button"
            >
              {t.common.cancel}
            </button>
            <button
              className="app-primary-button min-h-12 flex-1 rounded-md px-4 text-base font-semibold outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)] disabled:opacity-50"
              disabled={titleDraft.trim().length === 0}
              onClick={() => void submitRename()}
              type="button"
            >
              {t.common.save}
            </button>
          </div>
        </div>
      </MobileSheet>

      <MobileSheet
        onClose={() => setDeleteOpen(false)}
        open={deleteOpen}
        title={t.home.deleteConfirmTitle}
      >
        <div className="space-y-4">
          <p className="app-muted text-base leading-7">{t.home.deleteConfirmBody}</p>
          <div className="flex gap-3">
            <button
              className="app-button min-h-12 flex-1 rounded-md px-4 text-base font-medium outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)]"
              onClick={() => setDeleteOpen(false)}
              type="button"
            >
              {t.common.cancel}
            </button>
            <button
              className="app-danger-button min-h-12 flex-1 rounded-md px-4 text-base font-semibold outline-none transition focus:ring-2 focus:ring-[var(--focus-ring)]"
              onClick={() => void confirmDelete()}
              type="button"
            >
              {t.common.delete}
            </button>
          </div>
        </div>
      </MobileSheet>
    </>
  );
}
