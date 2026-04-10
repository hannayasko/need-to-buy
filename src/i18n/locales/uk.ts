import type { DeepPartial, Messages } from "../types";

export const uk: DeepPartial<Messages> = {
  common: {
    close: "Закрити",
    cancel: "Скасувати",
    create: "Створити",
    delete: "Видалити",
    save: "Зберегти",
  },
  nav: {
    home: "Списки",
    language: "Мова",
    toggleTheme: "Перемкнути тему",
    lightMode: "Світла тема",
    darkMode: "Темна тема",
  },
  home: {
    eyebrow: "Тестовий простір",
    title: "Списки",
    intro:
      "Створюйте колекції, закріплюйте важливі та швидко відкривайте списки покупок із телефона.",
    noteLabel: "Список",
    openNote: "Відкрити список",
    pinned: "Закріплено",
    shared: "Спільна",
    updatedToday: "Оновлено сьогодні",
    actions: "Дії",
    newNote: "Новий список",
    createCollection: "Створити список",
    titlePlaceholder: "Назва списку",
    pin: "Закріпити",
    unpin: "Відкріпити",
    rename: "Перейменувати",
    renameCollection: "Перейменувати список",
    deleteCollection: "Видалити список",
    deleteConfirmTitle: "Видалити цей список?",
    deleteConfirmBody:
      "Ця тестова колекція буде видалена лише з локального стану на цьому пристрої.",
    shareWith: "Поділитися з",
    markShared: "Позначити як спільну",
    emptyPreview: "Поки немає пунктів",
    emptyState: "Створіть перший список, щоб почати.",
  },
  editor: {
    backHome: "Назад до списків",
    mockBadge: "Список",
    titleLabel: "Назва списку",
    panelHint: "Форматування поки зберігається лише локально на цьому пристрої.",
    missingNoteTitle: "Список не знайдено",
    missingNoteBody:
      "Можливо, її було видалено з локального стану на цьому пристрої.",
  },
};
