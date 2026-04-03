import type { Product } from "@/types";

export const products: Product[] = [
  {
    id: 1,
    name: "Activated Charcoal",
    slug: "activated-charcoal",
    tag: "Detox",
    price: 180,
    color: "#4A3728",
    description:
      "Deep cleansing activated charcoal soap that draws out impurities and toxins from the skin.",
    featured: true,
    media: [
      {
        id: "mock-1-cover",
        type: "image",
        role: "cover",
        url: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=1200&q=80",
        alt: "Activated charcoal soap bar styled with charcoal dust and linen",
        sortOrder: 0,
      },
      {
        id: "mock-1-gallery",
        type: "image",
        role: "gallery",
        url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
        alt: "Close-up artisan soap texture and foam",
        sortOrder: 1,
      },
    ],
  },
  {
    id: 2,
    name: "Lavender & Clay",
    slug: "lavender-clay",
    tag: "Calming",
    price: 160,
    color: "#6B7FA0",
    description:
      "Soothing lavender essential oil combined with French clay for a calming, purifying experience.",
    featured: true,
    media: [
      {
        id: "mock-2-cover",
        type: "image",
        role: "cover",
        url: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&w=1200&q=80",
        alt: "Lavender soap bars with dried flowers on a neutral tray",
        sortOrder: 0,
      },
    ],
  },
  {
    id: 3,
    name: "Goat Milk & Honey",
    slug: "goat-milk-honey",
    tag: "Gentle",
    price: 170,
    color: "#C5B49A",
    description:
      "Rich, creamy lather from goat milk and raw honey. Perfect for sensitive and dry skin.",
    featured: true,
    media: [
      {
        id: "mock-3-cover",
        type: "image",
        role: "cover",
        url: "https://images.unsplash.com/photo-1584305574647-acf3d335f4dd?auto=format&fit=crop&w=1200&q=80",
        alt: "Creamy handmade soap bars beside milk and honey props",
        sortOrder: 0,
      },
      {
        id: "mock-3-video",
        type: "video",
        role: "video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=1200&q=80",
        alt: "Short product making video preview",
        sortOrder: 1,
      },
    ],
  },
  {
    id: 4,
    name: "Coffee & Olive Oil",
    slug: "coffee-olive-oil",
    tag: "Exfoliating",
    price: 165,
    color: "#8B7355",
    description:
      "Ground coffee gently exfoliates while olive oil deeply moisturizes. Great for morning routines.",
    featured: true,
    media: [
      {
        id: "mock-4-cover",
        type: "image",
        role: "cover",
        url: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
        alt: "Coffee-toned soap bars and beans arranged on stone",
        sortOrder: 0,
      },
    ],
  },
  {
    id: 5,
    name: "Rose & Shea Butter",
    slug: "rose-shea-butter",
    tag: "Nourishing",
    price: 190,
    color: "#B8868B",
    description:
      "Luxurious rose absolute with shea butter. Deeply nourishing for mature and dry skin types.",
    media: [
      {
        id: "mock-5-cover",
        type: "image",
        role: "cover",
        url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
        alt: "Rose-toned artisan soap next to petals and soft fabric",
        sortOrder: 0,
      },
    ],
  },
  {
    id: 6,
    name: "Eucalyptus & Mint",
    slug: "eucalyptus-mint",
    tag: "Refreshing",
    price: 155,
    color: "#7A9A7E",
    description:
      "Invigorating eucalyptus and peppermint oils. Perfect for an energizing morning shower.",
    media: [
      {
        id: "mock-6-cover",
        type: "image",
        role: "cover",
        url: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=1200&q=80",
        alt: "Refreshing green soap bars with eucalyptus leaves",
        sortOrder: 0,
      },
    ],
  },
  {
    id: 7,
    name: "Turmeric & Oat",
    slug: "turmeric-oat",
    tag: "Brightening",
    price: 175,
    color: "#C9A84C",
    description:
      "Turmeric brightens and evens skin tone while oats soothe and calm irritated skin.",
    media: [
      {
        id: "mock-7-cover",
        type: "image",
        role: "cover",
        url: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=1200&q=80",
        alt: "Golden turmeric soap on ceramic with oats",
        sortOrder: 0,
      },
    ],
  },
  {
    id: 8,
    name: "Olive Oil Classic",
    slug: "olive-oil-classic",
    tag: "Traditional",
    price: 150,
    color: "#8B8B3A",
    description:
      "Pure Castile-style soap made with 100% extra virgin olive oil. The classic of Denizli.",
    media: [
      {
        id: "mock-8-cover",
        type: "image",
        role: "cover",
        url: "https://images.unsplash.com/photo-1607006483225-2f78f3032b16?auto=format&fit=crop&w=1200&q=80",
        alt: "Classic olive oil soap bars stacked with olive branches",
        sortOrder: 0,
      },
    ],
  },
];
