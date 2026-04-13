"use client";

import type { Note } from "./types";

const guestNotesStorageKey = "need-to-buy-guest-notes";
const defaultFontSize = 17;

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeTimestamp(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsedValue = Date.parse(value);

    if (!Number.isNaN(parsedValue)) {
      return parsedValue;
    }
  }

  return fallback;
}

function createBlankItem(index = 0) {
  return {
    checked: false,
    id: createId(`guest-item-${index + 1}`),
    text: "",
  };
}

function isGuestNote(note: Note | null): note is Note {
  return note !== null;
}

function normalizeGuestNote(value: unknown): Note | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<Note>;
  const createdAt = normalizeTimestamp(candidate.createdAt, Date.now());
  const updatedAt = normalizeTimestamp(candidate.updatedAt, createdAt);
  const items = Array.isArray(candidate.items)
    ? candidate.items
        .map((item, index) => {
          if (!item || typeof item !== "object") {
            return null;
          }

          const currentItem = item as Partial<Note["items"][number]>;

          return {
            checked: typeof currentItem.checked === "boolean" ? currentItem.checked : false,
            id:
              typeof currentItem.id === "string" && currentItem.id.length > 0
                ? currentItem.id
                : createId(`guest-item-${index + 1}`),
            text: typeof currentItem.text === "string" ? currentItem.text : "",
          };
        })
        .filter((item): item is Note["items"][number] => item !== null)
    : [];

  return {
    createdAt,
    fontSize:
      typeof candidate.fontSize === "number" && Number.isFinite(candidate.fontSize)
        ? Math.min(24, Math.max(15, candidate.fontSize))
        : defaultFontSize,
    id:
      typeof candidate.id === "string" && candidate.id.length > 0
        ? candidate.id
        : createId("guest-note"),
    is_pinned: Boolean(candidate.is_pinned),
    items: items.length > 0 ? items : [createBlankItem()],
    listMode: candidate.listMode === "bullet" ? "bullet" : "checklist",
    shared: Boolean(candidate.shared),
    title: typeof candidate.title === "string" ? candidate.title : "",
    underline: Boolean(candidate.underline),
    updatedAt,
  };
}

export function createGuestNote(title: string): Note {
  const now = Date.now();

  return {
    createdAt: now,
    fontSize: defaultFontSize,
    id: createId("guest-note"),
    is_pinned: false,
    items: [createBlankItem()],
    listMode: "checklist",
    shared: false,
    title,
    underline: false,
    updatedAt: now,
  };
}

export function loadGuestNotes() {
  if (typeof window === "undefined") {
    return [] as Note[];
  }

  const rawValue = window.localStorage.getItem(guestNotesStorageKey);

  if (!rawValue) {
    return [] as Note[];
  }

  try {
    const parsedValue = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      window.localStorage.removeItem(guestNotesStorageKey);
      return [] as Note[];
    }

    return parsedValue
      .map((note) => normalizeGuestNote(note))
      .filter(isGuestNote);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Unable to read guest notes.", error);
    }

    window.localStorage.removeItem(guestNotesStorageKey);

    return [] as Note[];
  }
}

export function saveGuestNotes(notes: Note[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(guestNotesStorageKey, JSON.stringify(notes));
}
