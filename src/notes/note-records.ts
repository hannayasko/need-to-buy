import type { Note, NoteItem, NoteListMode, NoteRecord } from "./types";

const defaultFontSize = 17;
export const noteRecordSelect =
  "id, owner_id, title, is_pinned, created_at, updated_at";

function createItem(text: string, index: number): NoteItem {
  return {
    checked: index === 0,
    id: `item-${index + 1}`,
    text,
  };
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

  if (value instanceof Date) {
    return value.getTime();
  }

  return fallback;
}

export function sortNotes(notes: Note[]) {
  return [...notes].sort((left, right) => {
    if (left.is_pinned !== right.is_pinned) {
      return left.is_pinned ? -1 : 1;
    }

    return right.updatedAt - left.updatedAt;
  });
}

export function normalizeNoteRow(row: NoteRecord): Note {
  const createdAt = normalizeTimestamp(row.created_at, Date.now());
  const updatedAt = normalizeTimestamp(row.updated_at, createdAt);
  const listMode: NoteListMode = "checklist";

  return {
    createdAt,
    fontSize: defaultFontSize,
    id: typeof row.id === "string" && row.id.length > 0 ? row.id : `note-${createdAt}`,
    is_pinned: Boolean(row.is_pinned),
    items: [createItem("", 0)],
    listMode,
    shared: false,
    title: typeof row.title === "string" ? row.title : "",
    underline: false,
    updatedAt,
  };
}

export function buildCreateNoteInput(ownerId: string, title: string) {
  const now = new Date().toISOString();

  return {
    created_at: now,
    is_pinned: false,
    owner_id: ownerId,
    title,
    updated_at: now,
  };
}

export function buildNoteUpdateInput(note: Note) {
  return {
    is_pinned: note.is_pinned,
    title: note.title,
    updated_at: new Date(note.updatedAt).toISOString(),
  };
}
