import { z } from "zod";
import {
  baseSiteLocaleCode,
  isValidSiteLocaleCode,
} from "@/modules/site-content/locales";

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

const assetPathSchema = z
  .string()
  .trim()
  .refine(
    (value) => isValidAssetReference(value),
    "Must be a valid URL or a site asset path",
  );

const requiredAssetPathSchema = z
  .string()
  .trim()
  .min(1)
  .refine(
    (value) => value.startsWith("/") || isValidAssetReference(value),
    "Must be a valid URL or a site asset path",
  );

export const productQuerySchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
});

export const productFilterSchema = z.object({
  tag: z.string().min(1).max(50).optional(),
  featured: z.enum(["true", "false"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().regex(/^\+?[\d\s-]{7,20}$/, "Invalid phone number").optional(),
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

export const siteContentSchema = z.object({
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
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  next: z.string().optional().default(""),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;
export type ProductFilter = z.infer<typeof productFilterSchema>;
export type ContactForm = z.infer<typeof contactFormSchema>;
export type ProductAdminForm = z.infer<typeof productAdminSchema>;
export type AdminLoginForm = z.infer<typeof adminLoginSchema>;
export type SiteContentForm = z.infer<typeof siteContentSchema>;
export type SiteContentLocaleForm = z.infer<typeof siteContentLocaleSchema>;
export type MediaAssetForm = z.infer<typeof mediaAssetSchema>;
export type SiteLocaleForm = z.infer<typeof siteLocaleSchema>;
