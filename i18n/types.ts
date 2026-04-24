export interface Dictionary {
  navbar: {
    links: {
      products: string;
      blog?: string;
      about: string;
      contact: string;
    };
    cta: string;
  };
  hero: {
    subtitle: string;
    title: {
      line1: string;
      line2: string;
      line3: string;
    };
    description: string;
    shopNow: string;
    ourStory: string;
    badge: {
      value: string;
      label: string;
    };
  };
  storySection: {
    eyebrow: string;
    title: string;
    lead: string;
    body: string;
    closing: string;
    ritualLabel: string;
    momentsLabel: string;
    momentsValue: string;
    detailLabel: string;
    detailText: string;
    studyLabel: string;
    studyText: string;
  };
  stripBanner: {
    items: string[];
  };
  featuredProducts: {
    title: string;
    viewAll: string;
  };
  about: {
    subtitle: string;
    title: {
      line1: string;
      line2: string;
    };
    description: string;
    learnMore: string;
  };
  features: {
    items: {
      coldProcess: {
        title: string;
        text: string;
      };
      smallBatches: {
        title: string;
        text: string;
      };
      natural: {
        title: string;
        text: string;
      };
    };
  };
  cta: {
    title: {
      line1: string;
      line2: string;
    };
    description: string;
    button: string;
  };
  footer: {
    copyright: string;
  };
  products: {
    badge: string;
    title: string;
    card: {
      orderVia: string;
    };
  };
  account: {
    badge: string;
    nav: {
      signIn: string;
      register: string;
      signInRegister: string;
      account: string;
      signOut: string;
    };
    login: {
      title: string;
      description: string;
      email: string;
      password: string;
      submit: string;
      invalidCredentials: string;
      rateLimited: string;
      accountDisabled: string;
      loggedOut: string;
      continueWithGoogle: string;
      googleUnavailable: string;
      googleDenied: string;
      googleFailed: string;
      registerPrompt: string;
      registerLinkLabel: string;
    };
    register: {
      title: string;
      description: string;
      fullName: string;
      email: string;
      phone: string;
      password: string;
      confirmPassword: string;
      marketingConsent: string;
      submit: string;
      invalidForm: string;
      emailTaken: string;
      rateLimited: string;
      loginPrompt: string;
      loginLinkLabel: string;
      passwordHint: string;
    };
    dashboard: {
      title: string;
      description: string;
      fullName: string;
      email: string;
      intentCount: string;
      browseProducts: string;
      intentHistoryBadge: string;
      intentHistoryTitle: string;
      noIntents: string;
      unknownProduct: string;
    };
  };
  admin: {
    badge: string;
    title: string;
    description: string;
    dataSourceLabel: string;
    lastActionLabel: string;
    disabledMessage: string;
    navigation: {
      dashboard: string;
      translations: string;
      products: string;
      blog?: string;
      customers: string;
      media: string;
      siteContent: string;
      theme: string;
    };
    shell: {
      localeSwitcher: string;
    };
    dashboard: {
      logout: string;
      productManager: string;
      manageAccess: string;
      sessionExpires: string;
      stats: {
        products: string;
        featured: string;
      };
      recentProductsBadge: string;
      recentProductsTitle: string;
      openProductManager: string;
      activityBadge: string;
      activityTitle: string;
      activityFallback: string;
    };
    login: {
      title: string;
      description: string;
      kicker: string;
      identifier: string;
      password: string;
      submit: string;
      invalidCredentials: string;
      rateLimited: string;
      accountDisabled: string;
      loggedOut: string;
      bootstrapHint: string;
      setupNotice: string;
      registerLinkLabel: string;
    };
    register: {
      title: string;
      description: string;
      kicker: string;
      displayName: string;
      email: string;
      username: string;
      password: string;
      confirmPassword: string;
      setupToken: string;
      submit: string;
      created: string;
      invalidForm: string;
      usernameTaken: string;
      emailTaken: string;
      registrationClosed: string;
      insufficientPermissions: string;
      setupTokenRequired: string;
      setupTokenInvalid: string;
      rateLimited: string;
      signInLinkLabel: string;
      dashboardLinkLabel: string;
      firstAdminHint: string;
      teamHint: string;
      setupTokenHint: string;
    };
    customers: {
      title: string;
      description: string;
      usersBadge: string;
      intentsBadge: string;
      intentsWindow: string;
      activeBuyersWindow: string;
      recentUsersTitle: string;
      recentIntentsTitle: string;
      anonymousCustomer: string;
      unknownProduct: string;
      marketingConsent: string;
      noMarketingConsent: string;
      noRecentUsers: string;
      noRecentIntents: string;
    };
    mediaLibrary: {
      title: string;
      description: string;
      updated: string;
    };
    siteStudio: {
      title: string;
      description: string;
      updated: string;
    };
    themeStudio: {
      title: string;
      description: string;
      updated: string;
    };
    create: {
      badge: string;
      title: string;
      submit: string;
    };
    inventory: {
      badge: string;
      title: string;
      edit: string;
      save: string;
      delete: string;
      pathLabel: string;
      managerDescription: string;
      backToDashboard: string;
      backToProducts: string;
      searchPlaceholder: string;
      catalogBadge: string;
      visibleProducts: string;
      visibleProductsPlural: string;
      translationsTitle: string;
    };
    form: {
      name: string;
      slug: string;
      tag: string;
      price: string;
      color: string;
      weight: string;
      ingredients: string;
      ingredientsPlaceholder: string;
      description: string;
      featured: string;
    };
    translationAssistant: {
      sourceLanguage: string;
      targetLanguages: string;
      emptyOnly: string;
      fillBaseFields: string;
      selectTargetLanguage: string;
      translating: string;
      translateButton: string;
      unavailable: string;
      updated: string;
      providerPrefix: string;
      targetLocales: string;
      overwriteAllowed: string;
    };
    productEditor: {
      workspaceBadge: string;
      workspaceTitle: string;
      workspaceDescription: string;
      libraryImages: string;
      libraryVideos: string;
      activeLocales: string;
      tabs: {
        library: string;
        manual: string;
        translations: string;
      };
      libraryCoverTitle: string;
      libraryCoverDescription: string;
      noLibraryCover: string;
      noLibraryCoverDescription: string;
      libraryGalleryTitle: string;
      libraryGalleryDescription: string;
      libraryVideoTitle: string;
      libraryVideoDescription: string;
      noLibraryVideo: string;
      noLibraryVideoDescription: string;
      manualMediaTitle: string;
      manualMediaDescription: string;
      coverImageUrl: string;
      coverImageAlt: string;
      videoUrl: string;
      videoThumbnailUrl: string;
      galleryImages: string;
      galleryImagesPlaceholder: string;
      translationsTitle: string;
      translationsDescription: string;
      localeEditors: string;
      localesWithSavedData: string;
      hasContent: string;
      empty: string;
      currentEditorLocale: string;
      currentEditorLocaleDescription: string;
    };
    siteTranslationAssistant: {
      badge: string;
      title: string;
      description: string;
      targetLanguagesSelected: string;
      stagedTranslationSets: string;
      sourceLanguage: string;
      targetLanguages: string;
      onlyEmptyFields: string;
      translateButton: string;
      translating: string;
      fillCurrentFields: string;
      selectTargetLanguage: string;
      ready: string;
      unavailable: string;
      providerPrefix: string;
    };
    siteLocalesManager: {
      badge: string;
      title: string;
      description: string;
      stagedUntilSave: string;
      activeLanguages: string;
      baseLocaleLocked: string;
      baseLocale: string;
      currentEditor: string;
      openInStudio: string;
      removeFromDraft: string;
      localeHelp: string;
      label: string;
      direction: string;
      addLanguage: string;
      addLanguageTitle: string;
      addLanguageDescription: string;
      usePresetPicker: string;
      addCustomLocale: string;
      findLanguage: string;
      searchPlaceholder: string;
      noPresetResults: string;
      stagedDraft: string;
      draftPlaceholder: string;
      clearDraft: string;
      code: string;
      saveToDraft: string;
      draftSavedHint: string;
      invalidLocale: string;
      duplicateLocale: string;
    };
    mediaManager: {
      uploadTitle: string;
      uploadDescription: string;
      controlsBadge: string;
      controlsTitle: string;
      controlsDescription: string;
      totalAssets: string;
      images: string;
      videos: string;
      searchAssets: string;
      searchPlaceholder: string;
      all: string;
      addExternalAsset: string;
      hideExternalAssetForm: string;
      assetType: string;
      assetUrl: string;
      altText: string;
      thumbnailUrl: string;
      label: string;
      saveExternalAsset: string;
      untitledAsset: string;
      noAltText: string;
      collapseEditor: string;
      editDetails: string;
      saveAsset: string;
      deleteAsset: string;
      noMatchingAssets: string;
    };
    errors: {
      slugConflict: string;
    };
    status: {
      created: string;
      updated: string;
      deleted: string;
    };
  };
  seo: {
    siteName: string;
    tagline: string;
    description: string;
  };
}
