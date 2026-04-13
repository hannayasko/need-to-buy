import { normalizeNoteRow } from "./note-records";
import type { Note, NoteItemRecord, NoteListMode, NoteRecord } from "./types";

const defaultFontSize = 17;

export const noteItemRecordSelect =
  "id, note_id, content, is_checked, item_type, font_size, is_underlined, sort_order, created_at, updated_at";

function normalizeListMode(value: string): NoteListMode {
  return value === "bullet" ? "bullet" : "checklist";
}

function normalizeFontSize(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return defaultFontSize;
  }

  return Math.min(24, Math.max(15, value));
}

function sortNoteItems(items: NoteItemRecord[]) {
  return [...items].sort((left, right) => {
    if (left.sort_order !== right.sort_order) {
      return left.sort_order - right.sort_order;
    }

    return left.created_at.localeCompare(right.created_at);
  });
}

export function buildNoteItemUpsertInput(note: Note) {
  const now = new Date(note.updatedAt).toISOString();
  const itemType = note.listMode === "bullet" ? "bullet" : "checklist";

  return note.items.map((item, index) => ({
    content: item.text,
    created_at: now,
    font_size: note.fontSize,
    id: item.id,
    is_checked: item.checked,
    is_underlined: note.underline,
    item_type: itemType,
    note_id: note.id,
    sort_order: index,
    updated_at: now,
  }));
}

export function groupNoteItemsByNoteId(items: NoteItemRecord[]) {
  return items.reduce<Record<string, NoteItemRecord[]>>((groups, item) => {
    const noteItems = groups[item.note_id] ?? [];

    noteItems.push(item);
    groups[item.note_id] = noteItems;

    return groups;
  }, {});
}

export function normalizeCloudNote(
  noteRow: NoteRecord,
  itemRows: NoteItemRecord[] | undefined,
) {
  const baseNote = normalizeNoteRow(noteRow);

  if (!itemRows || itemRows.length === 0) {
    return baseNote;
  }

  const sortedItems = sortNoteItems(itemRows);
  const firstItem = sortedItems[0];

  return {
    ...baseNote,
    fontSize: normalizeFontSize(firstItem.font_size),
    items: sortedItems.map((item) => ({
      checked: Boolean(item.is_checked),
      id: item.id,
      text: typeof item.content === "string" ? item.content : "",
    })),
    listMode: normalizeListMode(firstItem.item_type),
    underline: Boolean(firstItem.is_underlined),
  };
}
