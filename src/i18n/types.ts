export type Messages = {
  common: {
    close: string;
    cancel: string;
    create: string;
    delete: string;
    genericError: string;
    retry: string;
    save: string;
  };
  app: {
    name: string;
    tagline: string;
  };
  nav: {
    home: string;
    language: string;
    toggleTheme: string;
    lightMode: string;
    darkMode: string;
    signIn: string;
    signOut: string;
  };
  home: {
    eyebrow: string;
    title: string;
    intro: string;
    noteLabel: string;
    openNote: string;
    itemPreview: string;
    pinned: string;
    shared: string;
    updatedToday: string;
    actions: string;
    newNote: string;
    createCollection: string;
    titlePlaceholder: string;
    pin: string;
    unpin: string;
    rename: string;
    renameCollection: string;
    deleteCollection: string;
    deleteConfirmTitle: string;
    deleteConfirmBody: string;
    shareWith: string;
    markShared: string;
    emptyPreview: string;
    emptyState: string;
    loadingTitle: string;
    loadingBody: string;
    authRequiredTitle: string;
    authRequiredBody: string;
    errorTitle: string;
    errorBody: string;
    devModeHint: string;
  };
  editor: {
    backHome: string;
    mockBadge: string;
    titleLabel: string;
    listLabel: string;
    itemPlaceholder: string;
    addItem: string;
    formatting: string;
    showFormatting: string;
    hideFormatting: string;
    checkboxList: string;
    bulletList: string;
    decreaseFont: string;
    increaseFont: string;
    underline: string;
    fontSize: string;
    listMode: string;
    checklistMode: string;
    bulletMode: string;
    panelHint: string;
    checked: string;
    unchecked: string;
    missingNoteTitle: string;
    missingNoteBody: string;
    loadingTitle: string;
    loadingBody: string;
    authRequiredTitle: string;
    authRequiredBody: string;
    errorTitle: string;
    errorBody: string;
  };
  auth: {
    backHome: string;
    eyebrow: string;
    title: string;
    intro: string;
    signInTab: string;
    signUpTab: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    submitSignIn: string;
    submitSignUp: string;
    submitting: string;
    signOutLoading: string;
    openButton: string;
    helper: string;
    signUpSuccessBody: string;
    invalidCredentials: string;
    emailNotConfirmed: string;
    accountExists: string;
    signUpDisabled: string;
    validationEmailRequired: string;
    validationEmailInvalid: string;
    validationPasswordRequired: string;
    validationPasswordLength: string;
  };
  mockNote: {
    title: string;
    summary: string;
    items: string[];
  };
};

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<unknown>
    ? T[K]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};
