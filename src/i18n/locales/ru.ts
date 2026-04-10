import type { DeepPartial, Messages } from "../types";

export const ru: DeepPartial<Messages> = {
  common: {
    close: "Закрыть",
    cancel: "Отмена",
    create: "Создать",
    delete: "Удалить",
    save: "Сохранить",
  },
  app: {
    tagline: "Общие коллекции для повседневных покупок.",
  },
  nav: {
    home: "Списки",
    language: "Язык",
    toggleTheme: "Переключить тему",
    lightMode: "Светлая тема",
    darkMode: "Темная тема",
  },
  home: {
    eyebrow: "Тестовое пространство",
    title: "Списки",
    intro:
      "Создавайте коллекции, закрепляйте важные и быстро открывайте списки покупок с телефона.",
    noteLabel: "Список",
    openNote: "Открыть список",
    pinned: "Закреплено",
    shared: "Общая",
    updatedToday: "Обновлено сегодня",
    actions: "Действия",
    newNote: "Новый список",
    createCollection: "Создать список",
    titlePlaceholder: "Название списка",
    pin: "Закрепить",
    unpin: "Открепить",
    rename: "Переименовать",
    renameCollection: "Переименовать список",
    deleteCollection: "Удалить список",
    deleteConfirmTitle: "Удалить этот список?",
    deleteConfirmBody:
      "Эта тестовая коллекция будет удалена только из локального состояния на этом устройстве.",
    shareWith: "Поделиться с",
    markShared: "Отметить как общую",
    emptyPreview: "Пока нет пунктов",
    emptyState: "Создайте первый список, чтобы начать.",
  },
  editor: {
    backHome: "Назад к спискам",
    mockBadge: "Список",
    titleLabel: "Название списка",
    panelHint: "Форматирование пока сохраняется только локально на этом устройстве.",
    missingNoteTitle: "Список не найден",
    missingNoteBody:
      "Возможно, она была удалена из локального состояния на этом устройстве.",
  },
  mockNote: {
    title: "Покупки на выходные",
    summary: "Небольшой список для следующего похода в магазин.",
    items: ["Молоко", "Хлеб", "Яблоки"],
  },
};
