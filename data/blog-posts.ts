import type { BlogPost } from "@/types";

const now = new Date();

export const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "benefits-of-cold-process-soap",
    title: "Why Cold Process Soap Is Better for Skin Health",
    summary:
      "Cold process soap keeps naturally formed glycerin in each bar and avoids harsh detergents found in many mass-market cleansers.",
    content: [
      "Cold process soap is made at lower temperatures, which helps preserve delicate oils and plant-based compounds.",
      "",
      "## What makes it skin friendly",
      "- Naturally retained glycerin helps lock in moisture.",
      "- Plant oils provide gentle cleansing without stripping skin barriers.",
      "- Small-batch curing improves bar hardness and longevity.",
      "",
      "## Practical tip",
      "Pick bars with transparent ingredient lists and avoid synthetic fragrance overload when you have sensitive skin.",
    ].join("\n"),
    tags: ["soap", "skin-care", "ingredients"],
    coverImage: "/uploads/media/blog-cold-process.jpg",
    coverAlt: "Handmade cold process soap bars on a wooden tray",
    seoTitle: "Cold Process Soap Benefits for Healthy Skin",
    seoDescription:
      "Learn why cold process soap can be gentler for skin, from retained glycerin to nutrient-rich plant oils.",
    status: "published",
    publishedAt: new Date("2026-01-10T08:30:00.000Z"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    slug: "how-to-choose-natural-soap",
    title: "How to Choose a Truly Natural Soap Bar",
    summary:
      "A quick framework to read labels, spot greenwashing, and choose artisan soaps with cleaner formulations.",
    content: [
      "Choosing natural soap starts with reading labels critically.",
      "",
      "## Label checklist",
      "- Look for recognizable oils and butters as top ingredients.",
      "- Avoid products that list many synthetic colorants and detergents.",
      "- Prefer products that disclose curing method and batch transparency.",
      "",
      "## Avoid this trap",
      "The phrase \"natural inspired\" often signals marketing copy, not formulation quality.",
    ].join("\n"),
    tags: ["buying-guide", "natural-soap"],
    coverImage: "/uploads/media/blog-natural-soap.jpg",
    coverAlt: "Natural soap bars with botanical ingredients",
    status: "published",
    publishedAt: new Date("2026-02-03T09:00:00.000Z"),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    slug: "soap-storage-guide",
    title: "Soap Storage Guide: Make Each Bar Last Longer",
    summary:
      "Simple habits that extend soap life, improve hygiene, and reduce waste in your daily routine.",
    content: [
      "Good storage can double the practical life of a handmade soap bar.",
      "",
      "## Storage rules",
      "- Keep soap on a draining tray between uses.",
      "- Avoid direct streams of water when not actively washing.",
      "- Store backup bars in a cool, dry place with airflow.",
      "",
      "## Bonus",
      "Cut large bars into halves so only one piece is in active use at a time.",
    ].join("\n"),
    tags: ["care-tips", "soap"],
    status: "draft",
    createdAt: now,
    updatedAt: now,
  },
];

