export interface Dictionary {
  navbar: {
    links: {
      products: string;
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
  admin: {
    badge: string;
    title: string;
    description: string;
    dataSourceLabel: string;
    lastActionLabel: string;
    disabledMessage: string;
    dashboard: {
      logout: string;
      productManager: string;
      stats: {
        products: string;
        featured: string;
      };
      recentProductsBadge: string;
      recentProductsTitle: string;
      openProductManager: string;
      roadmapBadge: string;
      roadmapTitle: string;
      roadmapItems: string[];
    };
    create: {
      badge: string;
      title: string;
      submit: string;
    };
    inventory: {
      badge: string;
      title: string;
      save: string;
      delete: string;
      pathLabel: string;
      managerDescription: string;
      backToDashboard: string;
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
