import { env } from "@/lib/env";

export const siteConfig = {
  name: "Ventolivo",
  tagline: "Handcrafted Artisan Soaps",
  description: "Handcrafted artisan soaps made with natural oils and botanicals. Made in Denizli.",
  url: env.NEXT_PUBLIC_SITE_URL,
  currency: "TL ",
  whatsapp: {
    number: env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    baseUrl: "https://wa.me",
  },
} as const;
