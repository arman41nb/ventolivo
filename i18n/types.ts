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
  seo: {
    siteName: string;
    tagline: string;
    description: string;
  };
}
