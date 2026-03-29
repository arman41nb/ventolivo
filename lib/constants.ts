import type { NavLink, SocialLink } from "@/types";

export const SITE_NAME = "Ventolivo";
export const SITE_TAGLINE = "Handcrafted Artisan Soaps";
export const SITE_DESCRIPTION =
  "Handcrafted artisan soaps made with natural oils and botanicals. Made in Denizli.";

export const SITE_URL = "https://ventolivo.com";

export const WHATSAPP_NUMBER = "";
export const WHATSAPP_BASE_URL = "https://wa.me";

export const CURRENCY = "₺";

export const NAV_LINKS: NavLink[] = [
  { label: "Products", href: "/products" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Instagram", href: "#" },
  { label: "WhatsApp", href: `${WHATSAPP_BASE_URL}/` },
];

export const FEATURES = [
  {
    title: "Cold Process",
    text: "Traditional cold-process method preserving all natural glycerin and nutrients.",
  },
  {
    title: "Small Batches",
    text: "Each batch is made in small quantities to ensure maximum quality and freshness.",
  },
  {
    title: "100% Natural",
    text: "Only plant-based oils, butters, and botanicals. Nothing artificial, ever.",
  },
] as const;

export const STRIP_ITEMS = [
  "Handcrafted",
  "Natural Ingredients",
  "No Chemicals",
  "Made in Denizli",
] as const;

export const GRID_BREAKPOINTS = {
  sm: 2,
  lg: 4,
} as const;
