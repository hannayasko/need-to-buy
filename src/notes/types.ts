export type NoteListMode = "checklist" | "bullet";

export type NoteItem = {
  checked: boolean;
  id: string;
  text: string;
};

export type NoteRecord = {
  created_at: string;
  id: string;
  is_pinned: boolean;
  owner_id: string;
  title: string;
  updated_at: string;
};

export type NoteItemRecord = {
  content: string;
  created_at: string;
  font_size: number;
  id: string;
  is_checked: boolean;
  is_underlined: boolean;
  item_type: string;
  note_id: string;
  sort_order: number;
  updated_at: string;
};

export type Note = {
  createdAt: number;
  fontSize: number;
  id: string;
  is_pinned: boolean;
  items: NoteItem[];
  listMode: NoteListMode;
  shared: boolean;
  title: string;
  underline: boolean;
  updatedAt: number;
};

export type NotesStatus = "loading" | "ready" | "error";

export type NotesStorageMode = "guest" | "cloud";
