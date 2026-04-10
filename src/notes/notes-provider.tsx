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
import {
  buildCreateNoteInput,
  buildNoteUpdateInput,
  noteRecordSelect,
  normalizeNoteRow,
  sortNotes,
} from "./note-records";
import type { Note, NoteRecord, NotesStatus } from "./types";

type NotesContextValue = {
  createNote: (title: string) => Promise<string | null>;
  deleteNote: (noteId: string) => Promise<void>;
  errorMessage: string | null;
  isUsingDevUser: boolean;
  notes: Note[];
  reloadNotes: () => Promise<void>;
  renameNote: (noteId: string, title: string) => Promise<void>;
  setNoteShared: (noteId: string, shared: boolean) => void;
  status: NotesStatus;
  togglePinned: (noteId: string) => Promise<void>;
  updateNote: (noteId: string, updater: (note: Note) => Note) => void;
};

const noteSaveDelayMs = 400;
const genericNotesError = "Something went wrong. Please try again.";
const NotesContext = createContext<NotesContextValue | null>(null);

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const notesRef = useRef<Note[]>([]);
  const ownerIdRef = useRef<string | null>(null);
  const saveTimersRef = useRef<Map<string, number>>(new Map());

  const replaceNotes = useCallback((nextNotes: Note[]) => {
    const sortedNotes = sortNotes(nextNotes);
    notesRef.current = sortedNotes;
    setNotes(sortedNotes);
  }, []);

  const updateLocalNotes = useCallback(
    (updater: (currentNotes: Note[]) => Note[]) => {
      setNotes((currentNotes) => {
        const nextNotes = sortNotes(updater(currentNotes));
        notesRef.current = nextNotes;

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

  const saveNoteNow = useCallback(async (note: Note) => {
    const ownerId = ownerIdRef.current;

    if (!ownerId) {
      return;
    }

    clearQueuedSave(note.id);

    const { error } = await supabase
      .from("notes")
      .update(buildNoteUpdateInput(note))
      .eq("id", note.id)
      .eq("owner_id", ownerId);

    if (error) {
      throw error;
    }
  }, [clearQueuedSave]);

  const loadNotes = useCallback(
    async (ownerId = ownerIdRef.current) => {
      if (!ownerId) {
        clearAllQueuedSaves();
        replaceNotes([]);
        setErrorMessage(null);
        setStatus("no-user");

        return;
      }

      setStatus("loading");
      setErrorMessage(null);

      try {
        const data = await requestNotes(ownerId);

        replaceNotes(data.map((row) => normalizeNoteRow(row)));
        setStatus("ready");
      } catch (error) {
        clearAllQueuedSaves();
        replaceNotes([]);
        setStatus("error");
        handleSupabaseError(error);
      }
    },
    [clearAllQueuedSaves, handleSupabaseError, replaceNotes, requestNotes],
  );

  const queueNoteSave = useCallback((note: Note) => {
    if (typeof window === "undefined") {
      return;
    }

    clearQueuedSave(note.id);

    const timeoutId = window.setTimeout(async () => {
      saveTimersRef.current.delete(note.id);

      try {
        await saveNoteNow(note);
      } catch (error) {
        handleSupabaseError(error);
        void loadNotes();
      }
    }, noteSaveDelayMs);

    saveTimersRef.current.set(note.id, timeoutId);
  }, [clearQueuedSave, handleSupabaseError, loadNotes, saveNoteNow]);

  useEffect(() => {
    if (authStatus === "loading") {
      setStatus("loading");
      return;
    }

    if (!user?.id) {
      ownerIdRef.current = null;
      clearAllQueuedSaves();
      replaceNotes([]);
      setErrorMessage(null);
      setStatus("no-user");

      return;
    }

    ownerIdRef.current = user.id;
    void loadNotes(user.id);
  }, [authStatus, clearAllQueuedSaves, loadNotes, replaceNotes, user?.id]);

  useEffect(
    () => () => {
      clearAllQueuedSaves();
    },
    [clearAllQueuedSaves],
  );

  const value: NotesContextValue = {
    createNote: async (title) => {
      const ownerId = ownerIdRef.current;
      const nextTitle = title.trim();

      if (!ownerId || !nextTitle) {
        return null;
      }

      setErrorMessage(null);

      try {
        const { data, error } = await supabase
          .from("notes")
          .insert(buildCreateNoteInput(ownerId, nextTitle))
          .select(noteRecordSelect)
          .single();

        if (error) {
          throw error;
        }

        const nextNote = normalizeNoteRow(data);

        updateLocalNotes((currentNotes) => [nextNote, ...currentNotes]);

        return nextNote.id;
      } catch (error) {
        handleSupabaseError(error);

        return null;
      }
    },
    deleteNote: async (noteId) => {
      const ownerId = ownerIdRef.current;

      if (!ownerId) {
        return;
      }

      setErrorMessage(null);
      clearQueuedSave(noteId);
      updateLocalNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== noteId),
      );

      try {
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
    isUsingDevUser: false,
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
      updateLocalNotes((currentNotes) =>
        currentNotes.map((note) => (note.id === noteId ? nextNote : note)),
      );

      try {
        await saveNoteNow(nextNote);
      } catch (error) {
        handleSupabaseError(error);
        await loadNotes();
      }
    },
    setNoteShared: (noteId, shared) => {
      updateLocalNotes((currentNotes) =>
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
      updateLocalNotes((currentNotes) =>
        currentNotes.map((note) => (note.id === noteId ? nextNote : note)),
      );

      try {
        await saveNoteNow(nextNote);
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
      updateLocalNotes((currentNotes) =>
        currentNotes.map((note) => (note.id === noteId ? nextNote : note)),
      );

      if (currentNote.title !== nextNote.title) {
        queueNoteSave(nextNote);
      }
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
