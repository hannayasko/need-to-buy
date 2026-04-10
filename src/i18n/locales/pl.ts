import type { DeepPartial, Messages } from "../types";

export const pl: DeepPartial<Messages> = {
  common: {
    close: "Zamknij",
    cancel: "Anuluj",
    create: "Utworz",
    delete: "Usun",
    save: "Zapisz",
  },
  nav: {
    home: "Notatki zakupowe",
    language: "Jezyk",
    toggleTheme: "Przelacz motyw",
    lightMode: "Tryb jasny",
    darkMode: "Tryb ciemny",
  },
  home: {
    eyebrow: "Wspolne notatki zakupowe",
    title: "Notatki zakupowe",
    intro:
      "Tworz kolekcje, przypinaj najwazniejsze i szybko otwieraj listy zakupow na telefonie.",
    noteLabel: "Lista",
    openNote: "Otworz liste",
    pinned: "Przypieta",
    shared: "Wspolna",
    updatedToday: "Zaktualizowano dzis",
    actions: "Akcje",
    newNote: "Nowa lista",
    createCollection: "Utworz liste",
    titlePlaceholder: "Nazwa listy",
    pin: "Przypnij",
    unpin: "Odepnij",
    rename: "Zmien nazwe",
    renameCollection: "Zmien nazwe listy",
    deleteCollection: "Usun liste",
    deleteConfirmTitle: "Usunac te liste?",
    deleteConfirmBody: "Ta lista zostanie usunieta z twoich notatek.",
    shareWith: "Udostepnij",
    markShared: "Oznacz jako wspolna",
    emptyPreview: "Brak elementow",
    emptyState: "Utworz pierwsza liste, aby zaczac.",
  },
  editor: {
    backHome: "Wroc do list",
    mockBadge: "Lista",
    titleLabel: "Nazwa listy",
    panelHint: "Zadbaj o to, aby lista byla czytelna podczas zakupow.",
    missingNoteTitle: "Nie znaleziono listy",
    missingNoteBody:
      "Ta lista mogla zostac usunieta albo nalezy do innego konta.",
  },
};
