import { z } from "zod";
import { baseSiteLocaleCode, isValidSiteLocaleCode } from "@/modules/site-content";
import { MEDIA_FRAMING_LIMITS } from "@/modules/media";

function isValidAssetReference(value: string): boolean {
  if (value.length === 0) {
    return true;
  }

  if (value.startsWith("/")) {
    return true;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export const assetPathSchema = z
  .string()
  .trim()
  .refine((value) => isValidAssetReference(value), "Must be a valid URL or a site asset path");

export const requiredAssetPathSchema = z
  .string()
  .trim()
  .min(1)
  .refine(
    (value) => value.startsWith("/") || isValidAssetReference(value),
    "Must be a valid URL or a site asset path",
  );

export const productQuerySchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
});

export const productFilterSchema = z.object({
  tag: z.string().min(1).max(50).optional(),
  featured: z.enum(["true", "false"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const blogPostQuerySchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(160)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
});

export const blogPostFilterSchema = z.object({
  tag: z.string().trim().min(1).max(60).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s-]{7,20}$/, "Invalid phone number")
    .optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
  productId: z.number().int().positive().optional(),
});

export const productAdminSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  tag: z.string().trim().min(1, "Tag is required").max(50),
  price: z.coerce.number().int().min(0, "Price must be zero or greater"),
  color: z
    .string()
    .trim()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Color must be a valid hex code"),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(1000),
  ingredients: z.string().optional().default(""),
  weight: z.string().trim().max(30).optional().default(""),
  featured: z.boolean().optional().default(false),
});

export const blogAdminSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(160, "Slug is too long")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  title: z.string().trim().min(4, "Title is too short").max(160, "Title is too long"),
  summary: z.string().trim().min(20, "Summary is too short").max(320, "Summary is too long"),
  content: z.string().trim().min(1, "Content is required"),
  tags: z.string().trim().max(500).optional().default(""),
  coverImage: assetPathSchema,
  coverAlt: z.string().trim().max(160).optional().default(""),
  seoTitle: z.string().trim().max(70).optional().default(""),
  seoDescription: z.string().trim().max(160).optional().default(""),
  status: z.enum(["draft", "published"]).default("draft"),
  publishedAt: z.string().trim().optional().default(""),
});

const themeColorSchema = z
  .string()
  .trim()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Theme colors must be valid hex codes");

export const siteContentSchema = z.object({
  themeCanvasStart: themeColorSchema,
  themeCanvasMid: themeColorSchema,
  themeCanvasEnd: themeColorSchema,
  themeSurface: themeColorSchema,
  themeSurfaceAlt: themeColorSchema,
  themeSurfaceRaised: themeColorSchema,
  themePrimary: themeColorSchema,
  themePrimaryStrong: themeColorSchema,
  themeAccent: themeColorSchema,
  themeText: themeColorSchema,
  themeHeading: themeColorSchema,
  themeMuted: themeColorSchema,
  themeBorder: themeColorSchema,
  themeFooterStart: themeColorSchema,
  themeFooterEnd: themeColorSchema,
  brandName: z.string().trim().min(1).max(80),
  logoMode: z.enum(["text", "image"]).default("text"),
  logoText: z.string().trim().min(1).max(80),
  logoImageUrl: assetPathSchema,
  logoAltText: z.string().trim().max(120).default(""),
  navbarLinkProducts: z.string().trim().min(1).max(40),
  navbarLinkAbout: z.string().trim().min(1).max(40),
  navbarLinkContact: z.string().trim().min(1).max(40),
  navbarCtaLabel: z.string().trim().min(1).max(80),
  heroSubtitle: z.string().trim().min(1).max(120),
  heroTitleLine1: z.string().trim().min(1).max(120),
  heroTitleLine2: z.string().trim().min(1).max(120),
  heroTitleLine3: z.string().trim().min(1).max(120),
  heroDescription: z.string().trim().min(1).max(500),
  heroPrimaryButtonLabel: z.string().trim().min(1).max(80),
  heroSecondaryButtonLabel: z.string().trim().min(1).max(80),
  heroBadgeValue: z.string().trim().min(1).max(40),
  heroBadgeLabel: z.string().trim().min(1).max(60),
  heroImageUrl: assetPathSchema,
  heroImageAlt: z.string().trim().max(120).default(""),
  heroAccentImageUrl: assetPathSchema,
  heroAccentImageAlt: z.string().trim().max(120).default(""),
  heroAccentImageOffsetX: z.coerce
    .number()
    .finite()
    .min(MEDIA_FRAMING_LIMITS.offset.min)
    .max(MEDIA_FRAMING_LIMITS.offset.max)
    .default(MEDIA_FRAMING_LIMITS.offset.defaultValue),
  heroAccentImageOffsetY: z.coerce
    .number()
    .finite()
    .min(MEDIA_FRAMING_LIMITS.offset.min)
    .max(MEDIA_FRAMING_LIMITS.offset.max)
    .default(MEDIA_FRAMING_LIMITS.offset.defaultValue),
  heroAccentImageScale: z.coerce
    .number()
    .finite()
    .min(MEDIA_FRAMING_LIMITS.scale.min)
    .max(MEDIA_FRAMING_LIMITS.scale.max)
    .default(MEDIA_FRAMING_LIMITS.scale.defaultValue),
  heroForegroundMedia: z.enum(["hero", "accent"]).default("hero"),
  heroImageOffsetX: z.coerce
    .number()
    .finite()
    .min(MEDIA_FRAMING_LIMITS.offset.min)
    .max(MEDIA_FRAMING_LIMITS.offset.max)
    .default(MEDIA_FRAMING_LIMITS.offset.defaultValue),
  heroImageOffsetY: z.coerce
    .number()
    .finite()
    .min(MEDIA_FRAMING_LIMITS.offset.min)
    .max(MEDIA_FRAMING_LIMITS.offset.max)
    .default(MEDIA_FRAMING_LIMITS.offset.defaultValue),
  heroImageScale: z.coerce
    .number()
    .finite()
    .min(MEDIA_FRAMING_LIMITS.scale.min)
    .max(MEDIA_FRAMING_LIMITS.scale.max)
    .default(MEDIA_FRAMING_LIMITS.scale.defaultValue),
  storyEyebrow: z.string().trim().min(1).max(120),
  storyTitle: z.string().trim().min(1).max(220),
  storyLead: z.string().trim().min(1).max(240),
  storyBody: z.string().trim().min(1).max(1200),
  storyClosing: z.string().trim().min(1).max(180),
  storyRitualLabel: z.string().trim().min(1).max(80),
  storyMomentsLabel: z.string().trim().min(1).max(80),
  storyMomentsValue: z.string().trim().min(1).max(220),
  storyDetailLabel: z.string().trim().min(1).max(80),
  storyDetailText: z.string().trim().min(1).max(220),
  storyStudyLabel: z.string().trim().min(1).max(80),
  storyStudyText: z.string().trim().min(1).max(120),
  stripBannerItem1: z.string().trim().min(1).max(80),
  stripBannerItem2: z.string().trim().min(1).max(80),
  stripBannerItem3: z.string().trim().min(1).max(80),
  stripBannerItem4: z.string().trim().min(1).max(80),
  featuredProductsTitle: z.string().trim().min(1).max(120),
  featuredProductsViewAllLabel: z.string().trim().min(1).max(80),
  aboutSubtitle: z.string().trim().min(1).max(120),
  aboutTitleLine1: z.string().trim().min(1).max(120),
  aboutTitleLine2: z.string().trim().min(1).max(120),
  aboutDescription: z.string().trim().min(1).max(700),
  aboutButtonLabel: z.string().trim().min(1).max(80),
  aboutImageUrl: assetPathSchema,
  aboutImageAlt: z.string().trim().max(120).default(""),
  feature1Title: z.string().trim().min(1).max(80),
  feature1Text: z.string().trim().min(1).max(240),
  feature2Title: z.string().trim().min(1).max(80),
  feature2Text: z.string().trim().min(1).max(240),
  feature3Title: z.string().trim().min(1).max(80),
  feature3Text: z.string().trim().min(1).max(240),
  ctaTitleLine1: z.string().trim().min(1).max(120),
  ctaTitleLine2: z.string().trim().min(1).max(120),
  ctaDescription: z.string().trim().min(1).max(500),
  ctaButtonLabel: z.string().trim().min(1).max(80),
  footerCopyrightText: z.string().trim().min(1).max(180),
});

export const siteContentLocaleSchema = siteContentSchema.pick({
  navbarLinkProducts: true,
  navbarLinkAbout: true,
  navbarLinkContact: true,
  navbarCtaLabel: true,
  heroSubtitle: true,
  heroTitleLine1: true,
  heroTitleLine2: true,
  heroTitleLine3: true,
  heroDescription: true,
  heroPrimaryButtonLabel: true,
  heroSecondaryButtonLabel: true,
  heroBadgeValue: true,
  heroBadgeLabel: true,
  storyEyebrow: true,
  storyTitle: true,
  storyLead: true,
  storyBody: true,
  storyClosing: true,
  storyRitualLabel: true,
  storyMomentsLabel: true,
  storyMomentsValue: true,
  storyDetailLabel: true,
  storyDetailText: true,
  storyStudyLabel: true,
  storyStudyText: true,
  stripBannerItem1: true,
  stripBannerItem2: true,
  stripBannerItem3: true,
  stripBannerItem4: true,
  featuredProductsTitle: true,
  featuredProductsViewAllLabel: true,
  aboutSubtitle: true,
  aboutTitleLine1: true,
  aboutTitleLine2: true,
  aboutDescription: true,
  aboutButtonLabel: true,
  feature1Title: true,
  feature1Text: true,
  feature2Title: true,
  feature2Text: true,
  feature3Title: true,
  feature3Text: true,
  ctaTitleLine1: true,
  ctaTitleLine2: true,
  ctaDescription: true,
  ctaButtonLabel: true,
  footerCopyrightText: true,
});

export const storefrontThemeSettingsSchema = siteContentSchema.pick({
  themeCanvasStart: true,
  themeCanvasMid: true,
  themeCanvasEnd: true,
  themeSurface: true,
  themeSurfaceAlt: true,
  themeSurfaceRaised: true,
  themePrimary: true,
  themePrimaryStrong: true,
  themeAccent: true,
  themeText: true,
  themeHeading: true,
  themeMuted: true,
  themeBorder: true,
  themeFooterStart: true,
  themeFooterEnd: true,
});

export const storefrontThemePresetSchema = z.object({
  id: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(240).default(""),
  recipe: z.enum(["balanced", "soft", "bold"]).default("balanced"),
  settings: storefrontThemeSettingsSchema,
});

export const storefrontThemePresetListSchema = z.array(storefrontThemePresetSchema).max(24);

export const siteLocaleSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2)
    .max(16)
    .refine((value) => isValidSiteLocaleCode(value), "Invalid locale code"),
  label: z.string().trim().min(1).max(40),
  direction: z.enum(["ltr", "rtl"]),
});

export const siteLocalesSchema = z
  .array(siteLocaleSchema)
  .min(1)
  .superRefine((locales, context) => {
    const codes = locales.map((locale) => locale.code.trim().toLowerCase());
    const uniqueCodes = new Set(codes);

    if (uniqueCodes.size !== codes.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Locale codes must be unique",
      });
    }

    if (!uniqueCodes.has(baseSiteLocaleCode)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "The base locale is required",
      });
    }
  });

export const mediaAssetSchema = z.object({
  kind: z.enum(["image", "video"]),
  url: requiredAssetPathSchema,
  altText: z.string().trim().max(160).optional().default(""),
  thumbnailUrl: assetPathSchema.optional().default(""),
  label: z.string().trim().max(120).optional().default(""),
});

export const adminLoginSchema = z.object({
  identifier: z.string().trim().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
  next: z.string().optional().default(""),
});

const adminPasswordSchema = z
  .string()
  .min(10, "Password must be at least 10 characters")
  .max(128, "Password must be 128 characters or less")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/\d/, "Password must contain a number");

export const adminRegistrationSchema = z
  .object({
    displayName: z.string().trim().min(2, "Display name is required").max(80),
    email: z.string().trim().email("Email must be valid").max(120),
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(32, "Username must be 32 characters or less")
      .regex(
        /^[a-z0-9._-]+$/,
        "Username can contain lowercase letters, numbers, dots, underscores, and hyphens",
      ),
    password: adminPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm the password"),
    setupToken: z.string().trim().max(120).optional().default(""),
  })
  .superRefine((value, context) => {
    if (value.password !== value.confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

export const customerLoginSchema = z.object({
  email: z.string().trim().email("Email must be valid").max(120),
  password: z.string().min(1, "Password is required"),
  next: z.string().optional().default(""),
});

const customerPasswordSchema = z
  .string()
  .min(10, "Password must be at least 10 characters")
  .max(128, "Password must be 128 characters or less")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/\d/, "Password must contain a number");

export const customerRegistrationSchema = z
  .object({
    fullName: z.string().trim().min(2, "Full name is required").max(80),
    email: z.string().trim().email("Email must be valid").max(120),
    phone: z
      .string()
      .trim()
      .max(30)
      .optional()
      .default("")
      .refine(
        (value) => value.length === 0 || /^\+?[\d\s-]{7,20}$/.test(value),
        "Invalid phone number",
      ),
    password: customerPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm the password"),
    marketingConsent: z.boolean().optional().default(false),
  })
  .superRefine((value, context) => {
    if (value.password !== value.confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

export type ProductQuery = z.infer<typeof productQuerySchema>;
export type ProductFilter = z.infer<typeof productFilterSchema>;
export type BlogPostQuery = z.infer<typeof blogPostQuerySchema>;
export type BlogPostFilter = z.infer<typeof blogPostFilterSchema>;
export type ContactForm = z.infer<typeof contactFormSchema>;
export type ProductAdminForm = z.infer<typeof productAdminSchema>;
export type BlogAdminForm = z.infer<typeof blogAdminSchema>;
export type AdminLoginForm = z.infer<typeof adminLoginSchema>;
export type AdminRegistrationForm = z.infer<typeof adminRegistrationSchema>;
export type CustomerLoginForm = z.infer<typeof customerLoginSchema>;
export type CustomerRegistrationForm = z.infer<typeof customerRegistrationSchema>;
export type SiteContentForm = z.infer<typeof siteContentSchema>;
export type SiteContentLocaleForm = z.infer<typeof siteContentLocaleSchema>;
export type MediaAssetForm = z.infer<typeof mediaAssetSchema>;
export type SiteLocaleForm = z.infer<typeof siteLocaleSchema>;
