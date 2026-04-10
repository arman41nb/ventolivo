import type { Dictionary } from "@/i18n";
import type { SiteContentLocaleFields, SiteContentSettings } from "@/types";

export interface StorefrontContent {
  brandName: string;
  navbar: {
    stripItems: [string, string, string, string];
    links: {
      products: string;
      about: string;
      contact: string;
    };
    ctaLabel: string;
  };
  hero: {
    subtitle: string;
    title: {
      line1: string;
      line2: string;
      line3: string;
    };
    description: string;
    primaryButtonLabel: string;
    secondaryButtonLabel: string;
    badge: {
      value: string;
      label: string;
    };
  };
  storySection: Dictionary["storySection"];
  featuredProducts: {
    title: string;
    viewAllLabel: string;
    orderLabel: string;
  };
  about: {
    subtitle: string;
    title: {
      line1: string;
      line2: string;
    };
    description: string;
    buttonLabel: string;
    chips: [string, string, string];
  };
  features: {
    items: [
      { key: "coldProcess"; title: string; text: string },
      { key: "smallBatches"; title: string; text: string },
      { key: "natural"; title: string; text: string },
    ];
  };
  cta: {
    eyebrow: string;
    title: {
      line1: string;
      line2: string;
    };
    description: string;
    buttonLabel: string;
    quote: string;
  };
  footer: {
    description: string;
    copyright: string;
    links: {
      products: string;
      about: string;
      contact: string;
    };
    featureLabels: [string, string, string];
  };
  products: {
    badge: string;
    title: string;
    orderLabel: string;
    ingredientsLabel: string;
  };
}

export function resolveStorefrontContent(
  dictionary: Dictionary,
  siteSettings: SiteContentSettings,
  localizedContent?: Partial<SiteContentLocaleFields>,
): StorefrontContent {
  const resolveText = <
    Key extends keyof SiteContentLocaleFields,
    Fallback extends string,
  >(
    key: Key,
    baseValue: SiteContentSettings[Key],
    fallbackValue: Fallback,
  ): string =>
    localizedContent?.[key]?.trim() || (!localizedContent ? String(baseValue) : "") || fallbackValue;

  const brandName = siteSettings.brandName || siteSettings.logoText || "Ventolivo";
  const navbarLinks = {
    products: resolveText(
      "navbarLinkProducts",
      siteSettings.navbarLinkProducts,
      dictionary.navbar.links.products,
    ),
    about: resolveText("navbarLinkAbout", siteSettings.navbarLinkAbout, dictionary.navbar.links.about),
    contact: resolveText(
      "navbarLinkContact",
      siteSettings.navbarLinkContact,
      dictionary.navbar.links.contact,
    ),
  };

  return {
    brandName,
    navbar: {
      stripItems: [
        siteSettings.stripBannerItem1 || dictionary.stripBanner.items[0],
        siteSettings.stripBannerItem2 || dictionary.stripBanner.items[1],
        siteSettings.stripBannerItem3 || dictionary.stripBanner.items[2],
        siteSettings.stripBannerItem4 || dictionary.stripBanner.items[3],
      ],
      links: navbarLinks,
      ctaLabel: resolveText("navbarCtaLabel", siteSettings.navbarCtaLabel, dictionary.navbar.cta),
    },
    hero: {
      subtitle: resolveText("heroSubtitle", siteSettings.heroSubtitle, dictionary.hero.subtitle),
      title: {
        line1: resolveText("heroTitleLine1", siteSettings.heroTitleLine1, dictionary.hero.title.line1),
        line2: resolveText("heroTitleLine2", siteSettings.heroTitleLine2, dictionary.hero.title.line2),
        line3: resolveText("heroTitleLine3", siteSettings.heroTitleLine3, dictionary.hero.title.line3),
      },
      description: resolveText("heroDescription", siteSettings.heroDescription, dictionary.hero.description),
      primaryButtonLabel: resolveText(
        "heroPrimaryButtonLabel",
        siteSettings.heroPrimaryButtonLabel,
        dictionary.hero.shopNow,
      ),
      secondaryButtonLabel: resolveText(
        "heroSecondaryButtonLabel",
        siteSettings.heroSecondaryButtonLabel,
        dictionary.hero.ourStory,
      ),
      badge: {
        value: resolveText("heroBadgeValue", siteSettings.heroBadgeValue, dictionary.hero.badge.value),
        label: resolveText("heroBadgeLabel", siteSettings.heroBadgeLabel, dictionary.hero.badge.label),
      },
    },
    storySection: {
      eyebrow: resolveText("storyEyebrow", siteSettings.storyEyebrow, dictionary.storySection.eyebrow),
      title: resolveText("storyTitle", siteSettings.storyTitle, dictionary.storySection.title),
      lead: resolveText("storyLead", siteSettings.storyLead, dictionary.storySection.lead),
      body: resolveText("storyBody", siteSettings.storyBody, dictionary.storySection.body),
      closing: resolveText("storyClosing", siteSettings.storyClosing, dictionary.storySection.closing),
      ritualLabel: resolveText(
        "storyRitualLabel",
        siteSettings.storyRitualLabel,
        dictionary.storySection.ritualLabel,
      ),
      momentsLabel: resolveText(
        "storyMomentsLabel",
        siteSettings.storyMomentsLabel,
        dictionary.storySection.momentsLabel,
      ),
      momentsValue: resolveText(
        "storyMomentsValue",
        siteSettings.storyMomentsValue,
        dictionary.storySection.momentsValue,
      ),
      detailLabel: resolveText(
        "storyDetailLabel",
        siteSettings.storyDetailLabel,
        dictionary.storySection.detailLabel,
      ),
      detailText: resolveText(
        "storyDetailText",
        siteSettings.storyDetailText,
        dictionary.storySection.detailText,
      ),
      studyLabel: resolveText(
        "storyStudyLabel",
        siteSettings.storyStudyLabel,
        dictionary.storySection.studyLabel,
      ),
      studyText: resolveText(
        "storyStudyText",
        siteSettings.storyStudyText,
        dictionary.storySection.studyText,
      ),
    },
    featuredProducts: {
      title: resolveText(
        "featuredProductsTitle",
        siteSettings.featuredProductsTitle,
        dictionary.featuredProducts.title,
      ),
      viewAllLabel: resolveText(
        "featuredProductsViewAllLabel",
        siteSettings.featuredProductsViewAllLabel,
        dictionary.featuredProducts.viewAll,
      ),
      orderLabel: dictionary.products.card.orderVia,
    },
    about: {
      subtitle: resolveText("aboutSubtitle", siteSettings.aboutSubtitle, dictionary.about.subtitle),
      title: {
        line1: resolveText("aboutTitleLine1", siteSettings.aboutTitleLine1, dictionary.about.title.line1),
        line2: resolveText("aboutTitleLine2", siteSettings.aboutTitleLine2, dictionary.about.title.line2),
      },
      description: resolveText("aboutDescription", siteSettings.aboutDescription, dictionary.about.description),
      buttonLabel: resolveText("aboutButtonLabel", siteSettings.aboutButtonLabel, dictionary.about.learnMore),
      chips: [
        resolveText("stripBannerItem1", siteSettings.stripBannerItem1, dictionary.stripBanner.items[0]),
        resolveText("stripBannerItem2", siteSettings.stripBannerItem2, dictionary.stripBanner.items[1]),
        resolveText("stripBannerItem4", siteSettings.stripBannerItem4, dictionary.stripBanner.items[3]),
      ],
    },
    features: {
      items: [
        {
          key: "coldProcess",
          title: resolveText(
            "feature1Title",
            siteSettings.feature1Title,
            dictionary.features.items.coldProcess.title,
          ),
          text: resolveText(
            "feature1Text",
            siteSettings.feature1Text,
            dictionary.features.items.coldProcess.text,
          ),
        },
        {
          key: "smallBatches",
          title: resolveText(
            "feature2Title",
            siteSettings.feature2Title,
            dictionary.features.items.smallBatches.title,
          ),
          text: resolveText(
            "feature2Text",
            siteSettings.feature2Text,
            dictionary.features.items.smallBatches.text,
          ),
        },
        {
          key: "natural",
          title: resolveText(
            "feature3Title",
            siteSettings.feature3Title,
            dictionary.features.items.natural.title,
          ),
          text: resolveText(
            "feature3Text",
            siteSettings.feature3Text,
            dictionary.features.items.natural.text,
          ),
        },
      ],
    },
    cta: {
      eyebrow: navbarLinks.contact,
      title: {
        line1: resolveText("ctaTitleLine1", siteSettings.ctaTitleLine1, dictionary.cta.title.line1),
        line2: resolveText("ctaTitleLine2", siteSettings.ctaTitleLine2, dictionary.cta.title.line2),
      },
      description: resolveText("ctaDescription", siteSettings.ctaDescription, dictionary.cta.description),
      buttonLabel: resolveText("ctaButtonLabel", siteSettings.ctaButtonLabel, dictionary.cta.button),
      quote: resolveText("aboutDescription", siteSettings.aboutDescription, dictionary.about.description),
    },
    footer: {
      description: resolveText("heroDescription", siteSettings.heroDescription, dictionary.seo.description),
      copyright: resolveText(
        "footerCopyrightText",
        siteSettings.footerCopyrightText,
        dictionary.footer.copyright,
      ),
      links: navbarLinks,
      featureLabels: [
        navbarLinks.products,
        resolveText("aboutSubtitle", siteSettings.aboutSubtitle, dictionary.about.subtitle),
        resolveText("ctaButtonLabel", siteSettings.ctaButtonLabel, dictionary.cta.button),
      ],
    },
    products: {
      badge: dictionary.products.badge,
      title: dictionary.products.title,
      orderLabel: dictionary.products.card.orderVia,
      ingredientsLabel: dictionary.admin.form.ingredients,
    },
  };
}
