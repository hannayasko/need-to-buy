import type { DeepPartial, Messages } from "../types";

export const de: DeepPartial<Messages> = {
  common: {
    close: "Schliessen",
    cancel: "Abbrechen",
    create: "Erstellen",
    delete: "Loeschen",
    save: "Speichern",
  },
  app: {
    tagline: "Geteilte Sammlungen fuer alltaegliche Einkaeufe.",
  },
  nav: {
    home: "Einkaufsnotizen",
    language: "Sprache",
    toggleTheme: "Thema wechseln",
    lightMode: "Heller Modus",
    darkMode: "Dunkler Modus",
  },
  home: {
    eyebrow: "Geteilte Einkaufsnotizen",
    title: "Einkaufsnotizen",
    intro:
      "Starte eine Sammlung, hefte wichtige an und halte Einkaufslisten auf dem Handy schnell griffbereit.",
    noteLabel: "Liste",
    openNote: "Liste oeffnen",
    pinned: "Angeheftet",
    shared: "Geteilt",
    updatedToday: "Heute aktualisiert",
    actions: "Aktionen",
    newNote: "Neue Liste",
    createCollection: "Liste erstellen",
    titlePlaceholder: "Listenname",
    pin: "Anheften",
    unpin: "Loesen",
    rename: "Umbenennen",
    renameCollection: "Liste umbenennen",
    deleteCollection: "Liste loeschen",
    deleteConfirmTitle: "Diese Liste loeschen?",
    deleteConfirmBody: "Diese Liste wird aus deinen Notizen entfernt.",
    shareWith: "Teilen mit",
    markShared: "Als geteilt markieren",
    emptyPreview: "Noch keine Eintraege",
    emptyState: "Erstelle deine erste Liste, um loszulegen.",
  },
  editor: {
    backHome: "Zurueck zu Listen",
    mockBadge: "Liste",
    titleLabel: "Listenname",
    panelHint: "Halte die Liste beim Einkaufen leicht lesbar.",
    missingNoteTitle: "Liste nicht gefunden",
    missingNoteBody:
      "Diese Liste wurde moeglicherweise entfernt oder gehoert zu einem anderen Konto.",
  },
  mockNote: {
    title: "Einkaeufe fuers Wochenende",
    summary: "Eine kleine Liste fuer den naechsten Einkauf.",
    items: ["Milch", "Brot", "Aepfel"],
  },
};
