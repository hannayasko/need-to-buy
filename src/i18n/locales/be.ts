import type { DeepPartial, Messages } from "../types";

export const be: DeepPartial<Messages> = {
  common: {
    close: "Закрыць",
    cancel: "Скасаваць",
    create: "Стварыць",
    delete: "Выдаліць",
    save: "Захаваць",
  },
  nav: {
    home: "Спісы",
    language: "Мова",
    toggleTheme: "Пераключыць тэму",
    lightMode: "Светлая тэма",
    darkMode: "Цёмная тэма",
  },
  home: {
    eyebrow: "Тэставая прастора",
    title: "Спісы",
    intro:
      "Стварайце калекцыі, замацоўвайце важныя і хутка адкрывайце спісы пакупак з тэлефона.",
    noteLabel: "Спіс",
    openNote: "Адкрыць спіс",
    pinned: "Замацавана",
    shared: "Агульная",
    updatedToday: "Абноўлена сёння",
    actions: "Дзеянні",
    newNote: "Новы спіс",
    createCollection: "Стварыць спіс",
    titlePlaceholder: "Назва спіса",
    pin: "Замацаваць",
    unpin: "Адмацаваць",
    rename: "Перайменаваць",
    renameCollection: "Перайменаваць спіс",
    deleteCollection: "Выдаліць спіс",
    deleteConfirmTitle: "Выдаліць гэты спіс?",
    deleteConfirmBody:
      "Гэта тэставая калекцыя будзе выдалена толькі з лакальнага стану на гэтай прыладзе.",
    shareWith: "Падзяліцца з",
    markShared: "Пазначыць як агульную",
    emptyPreview: "Пакуль няма пунктаў",
    emptyState: "Стварыце першы спіс, каб пачаць.",
  },
  editor: {
    backHome: "Назад да спісаў",
    mockBadge: "Спіс",
    titleLabel: "Назва спіса",
    panelHint: "Фарматаванне пакуль захоўваецца толькі лакальна на гэтай прыладзе.",
    missingNoteTitle: "Спіс не знойдзены",
    missingNoteBody:
      "Магчыма, яна была выдалена з лакальнага стану на гэтай прыладзе.",
  },
};
