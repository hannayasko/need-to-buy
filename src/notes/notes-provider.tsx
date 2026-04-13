"use client";

import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/auth/auth-provider";
import { supabase } from "@/lib/supabase";
import { createGuestNote, loadGuestNotes, saveGuestNotes } from "./guest-note-store";
import {
  buildNoteItemUpsertInput,
  groupNoteItemsByNoteId,
  noteItemRecordSelect,
  normalizeCloudNote,
} from "./note-item-records";
import {
  buildCreateNoteInput,
  buildNoteUpdateInput,
  noteRecordSelect,
  sortNotes,
} from "./note-records";
import type {
  Note,
  NoteItemRecord,
  NoteRecord,
  NotesStatus,
  NotesStorageMode,
} from "./types";

type NotesContextValue = {
  createNote: (title: string) => Promise<string | null>;
  deleteNote: (noteId: string) => Promise<void>;
  errorMessage: string | null;
  notes: Note[];
  reloadNotes: () => Promise<void>;
  renameNote: (noteId: string, title: string) => Promise<void>;
  setNoteShared: (noteId: string, shared: boolean) => void;
  status: NotesStatus;
  storageMode: NotesStorageMode;
  togglePinned: (noteId: string) => Promise<void>;
  updateNote: (noteId: string, updater: (note: Note) => Note) => void;
};

const noteSaveDelayMs = 400;
const genericNotesError = "Something went wrong. Please try again.";
const NotesContext = createContext<NotesContextValue | null>(null);

function buildNotInClause(values: string[]) {
  return `(${values.map((value) => JSON.stringify(value)).join(",")})`;
}

function logNotesError(error: unknown) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  console.error("Notes request failed.", error);
}

function wait(delayMs: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, delayMs);
  });
}

export function NotesProvider({ children }: { children: ReactNode }) {
  const { authStatus, user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [status, setStatus] = useState<NotesStatus>("loading");
  const [storageMode, setStorageMode] = useState<NotesStorageMode>("guest");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const notesRef = useRef<Note[]>([]);
  const ownerIdRef = useRef<string | null>(null);
  const saveTimersRef = useRef<Map<string, number>>(new Map());
  const loadRunRef = useRef(0);

  const replaceNotes = useCallback((nextNotes: Note[]) => {
    const sortedNotes = sortNotes(nextNotes);

    notesRef.current = sortedNotes;
    setNotes(sortedNotes);
  }, []);

  const updateNotesState = useCallback(
    (updater: (currentNotes: Note[]) => Note[]) => {
      setNotes((currentNotes) => {
        const nextNotes = sortNotes(updater(currentNotes));

        notesRef.current = nextNotes;

        return nextNotes;
      });
    },
    [],
  );

  const updateGuestNotesState = useCallback(
    (updater: (currentNotes: Note[]) => Note[]) => {
      setNotes((currentNotes) => {
        const nextNotes = sortNotes(updater(currentNotes));

        notesRef.current = nextNotes;
        saveGuestNotes(nextNotes);

        return nextNotes;
      });
    },
    [],
  );

  const clearQueuedSave = useCallback((noteId: string) => {
    const timeoutId = saveTimersRef.current.get(noteId);

    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
      saveTimersRef.current.delete(noteId);
    }
  }, []);

  const clearAllQueuedSaves = useCallback(() => {
    for (const timeoutId of saveTimersRef.current.values()) {
      window.clearTimeout(timeoutId);
    }

    saveTimersRef.current.clear();
  }, []);

  const handleSupabaseError = useCallback((error: unknown) => {
    logNotesError(error);
    setErrorMessage(genericNotesError);
  }, []);

  const beginLoad = useCallback(() => {
    const runId = loadRunRef.current + 1;

    loadRunRef.current = runId;

    return runId;
  }, []);

  const requestNotes = useCallback(async (ownerId: string) => {
    let lastError: unknown = null;

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const { data, error } = await supabase
        .from("notes")
        .select(noteRecordSelect)
        .eq("owner_id", ownerId)
        .order("is_pinned", { ascending: false })
        .order("updated_at", { ascending: false });

      if (!error) {
        return (data ?? []) as NoteRecord[];
      }

      lastError = error;

      if (attempt === 0) {
        await wait(250);
      }
    }

    throw lastError;
  }, []);

  const requestNoteItems = useCallback(async (noteIds: string[]) => {
    if (noteIds.length === 0) {
      return [] as NoteItemRecord[];
    }

    const { data, error } = await supabase
      .from("note_items")
      .select(noteItemRecordSelect)
      .in("note_id", noteIds)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []) as NoteItemRecord[];
  }, []);

  const saveCloudNoteNow = useCallback(
    async (note: Note) => {
      const ownerId = ownerIdRef.current;

      if (!ownerId) {
        return;
      }

      clearQueuedSave(note.id);

      const { error: noteError } = await supabase
        .from("notes")
        .update(buildNoteUpdateInput(note))
        .eq("id", note.id)
        .eq("owner_id", ownerId);

      if (noteError) {
        throw noteError;
      }

      const itemRows = buildNoteItemUpsertInput(note);

      if (itemRows.length === 0) {
        const { error: deleteAllError } = await supabase
          .from("note_items")
          .delete()
          .eq("note_id", note.id);

        if (deleteAllError) {
          throw deleteAllError;
        }

        return;
      }

      const { error: upsertError } = await supabase
        .from("note_items")
        .upsert(itemRows, { onConflict: "id" });

      if (upsertError) {
        throw upsertError;
      }

      const { error: deleteRemovedError } = await supabase
        .from("note_items")
        .delete()
        .eq("note_id", note.id)
        .not("id", "in", buildNotInClause(itemRows.map((item) => item.id)));

      if (deleteRemovedError) {
        throw deleteRemovedError;
      }
    },
    [clearQueuedSave],
  );

  const loadGuestState = useCallback(async () => {
    const runId = beginLoad();

    clearAllQueuedSaves();
    ownerIdRef.current = null;
    setStatus("loading");
    setStorageMode("guest");
    setErrorMessage(null);

    const guestNotes = loadGuestNotes();

    if (loadRunRef.current !== runId) {
      return;
    }

    replaceNotes(guestNotes);
    setStatus("ready");
  }, [beginLoad, clearAllQueuedSaves, replaceNotes]);

  const loadCloudState = useCallback(
    async (ownerId: string) => {
      const runId = beginLoad();

      setStatus("loading");
      setStorageMode("cloud");
      setErrorMessage(null);

      try {
        const noteRows = await requestNotes(ownerId);
        const itemRows = await requestNoteItems(noteRows.map((note) => note.id));

        if (loadRunRef.current !== runId) {
          return;
        }

        const noteItemsByNoteId = groupNoteItemsByNoteId(itemRows);

        replaceNotes(
          noteRows.map((noteRow) =>
            normalizeCloudNote(noteRow, noteItemsByNoteId[noteRow.id]),
          ),
        );
        setStatus("ready");
      } catch (error) {
        if (loadRunRef.current !== runId) {
          return;
        }

        clearAllQueuedSaves();
        replaceNotes([]);
        setStatus("error");
        handleSupabaseError(error);
      }
    },
    [
      beginLoad,
      clearAllQueuedSaves,
      handleSupabaseError,
      replaceNotes,
      requestNoteItems,
      requestNotes,
    ],
  );

  const loadNotes = useCallback(async () => {
    if (authStatus === "loading") {
      setStatus("loading");
      return;
    }

    if (user?.id) {
      ownerIdRef.current = user.id;
      await loadCloudState(user.id);
      return;
    }

    await loadGuestState();
  }, [authStatus, loadCloudState, loadGuestState, user?.id]);

  const queueCloudSave = useCallback(
    (note: Note) => {
      if (typeof window === "undefined") {
        return;
      }

      clearQueuedSave(note.id);

      const timeoutId = window.setTimeout(async () => {
        saveTimersRef.current.delete(note.id);

        try {
          await saveCloudNoteNow(note);
        } catch (error) {
          handleSupabaseError(error);
          void loadNotes();
        }
      }, noteSaveDelayMs);

      saveTimersRef.current.set(note.id, timeoutId);
    },
    [clearQueuedSave, handleSupabaseError, loadNotes, saveCloudNoteNow],
  );

  useEffect(() => {
    void loadNotes();
  }, [loadNotes]);

  useEffect(
    () => () => {
      clearAllQueuedSaves();
    },
    [clearAllQueuedSaves],
  );

  const value: NotesContextValue = {
    createNote: async (title) => {
      const nextTitle = title.trim();

      if (!nextTitle) {
        return null;
      }

      setErrorMessage(null);

      if (storageMode === "guest") {
        const nextNote = createGuestNote(nextTitle);

        updateGuestNotesState((currentNotes) => [nextNote, ...currentNotes]);

        return nextNote.id;
      }

      const ownerId = ownerIdRef.current;

      if (!ownerId) {
        return null;
      }

      try {
        const { data, error } = await supabase
          .from("notes")
          .insert(buildCreateNoteInput(ownerId, nextTitle))
          .select(noteRecordSelect)
          .single();

        if (error) {
          throw error;
        }

        const nextNote = normalizeCloudNote(data, undefined);

        updateNotesState((currentNotes) => [nextNote, ...currentNotes]);

        return nextNote.id;
      } catch (error) {
        handleSupabaseError(error);

        return null;
      }
    },
    deleteNote: async (noteId) => {
      setErrorMessage(null);
      clearQueuedSave(noteId);

      if (storageMode === "guest") {
        updateGuestNotesState((currentNotes) =>
          currentNotes.filter((note) => note.id !== noteId),
        );
        return;
      }

      const ownerId = ownerIdRef.current;

      if (!ownerId) {
        return;
      }

      updateNotesState((currentNotes) =>
        currentNotes.filter((note) => note.id !== noteId),
      );

      try {
        const { error: deleteItemsError } = await supabase
          .from("note_items")
          .delete()
          .eq("note_id", noteId);

        if (deleteItemsError) {
          throw deleteItemsError;
        }

        const { error } = await supabase
          .from("notes")
          .delete()
          .eq("id", noteId)
          .eq("owner_id", ownerId);

        if (error) {
          throw error;
        }
      } catch (error) {
        handleSupabaseError(error);
        await loadNotes();
      }
    },
    errorMessage,
    notes,
    reloadNotes: loadNotes,
    renameNote: async (noteId, title) => {
      const nextTitle = title.trim();
      const currentNote = notesRef.current.find((note) => note.id === noteId);

      if (!currentNote || !nextTitle) {
        return;
      }

      const nextNote = {
        ...currentNote,
        title: nextTitle,
        updatedAt: Date.now(),
      };

      setErrorMessage(null);

      if (storageMode === "guest") {
        updateGuestNotesState((currentNotes) =>
          currentNotes.map((note) => (note.id === noteId ? nextNote : note)),
        );
        return;
      }

      updateNotesState((currentNotes) =>
        currentNotes.map((note) => (note.id === noteId ? nextNote : note)),
      );

      try {
        await saveCloudNoteNow(nextNote);
      } catch (error) {
        handleSupabaseError(error);
        await loadNotes();
      }
    },
    setNoteShared: (noteId, shared) => {
      const updateState =
        storageMode === "guest" ? updateGuestNotesState : updateNotesState;

      updateState((currentNotes) =>
        currentNotes.map((note) =>
          note.id === noteId
            ? {
                ...note,
                shared,
                updatedAt: Date.now(),
              }
            : note,
        ),
      );
    },
    status,
    storageMode,
    togglePinned: async (noteId) => {
      const currentNote = notesRef.current.find((note) => note.id === noteId);

      if (!currentNote) {
        return;
      }

      const nextNote = {
        ...currentNote,
        is_pinned: !currentNote.is_pinned,
        updatedAt: Date.now(),
      };

      setErrorMessage(null);

      if (storageMode === "guest") {
        updateGuestNotesState((currentNotes) =>
          currentNotes.map((note) => (note.id === noteId ? nextNote : note)),
        );
        return;
      }

      updateNotesState((currentNotes) =>
        currentNotes.map((note) => (note.id === noteId ? nextNote : note)),
      );

      try {
        await saveCloudNoteNow(nextNote);
      } catch (error) {
        handleSupabaseError(error);
        await loadNotes();
      }
    },
    updateNote: (noteId, updater) => {
      const currentNote = notesRef.current.find((note) => note.id === noteId);

      if (!currentNote) {
        return;
      }

      const nextNote = {
        ...updater(currentNote),
        updatedAt: Date.now(),
      };

      setErrorMessage(null);

      if (storageMode === "guest") {
        updateGuestNotesState((currentNotes) =>
          currentNotes.map((note) => (note.id === noteId ? nextNote : note)),
        );
        return;
      }

      updateNotesState((currentNotes) =>
        currentNotes.map((note) => (note.id === noteId ? nextNote : note)),
      );
      queueCloudSave(nextNote);
    },
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const context = useContext(NotesContext);

  if (!context) {
    throw new Error("useNotes must be used within NotesProvider");
  }

  return context;
}
