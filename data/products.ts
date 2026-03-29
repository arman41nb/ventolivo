export interface Product {
  id: number;
  name: string;
  tag: string;
  price: number;
  color: string;
  description: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Activated Charcoal",
    tag: "Detox",
    price: 180,
    color: "#4A3728",
    description:
      "Deep cleansing activated charcoal soap that draws out impurities and toxins from the skin.",
  },
  {
    id: 2,
    name: "Lavender & Clay",
    tag: "Calming",
    price: 160,
    color: "#6B7FA0",
    description:
      "Soothing lavender essential oil combined with French clay for a calming, purifying experience.",
  },
  {
    id: 3,
    name: "Goat Milk & Honey",
    tag: "Gentle",
    price: 170,
    color: "#C5B49A",
    description:
      "Rich, creamy lather from goat milk and raw honey. Perfect for sensitive and dry skin.",
  },
  {
    id: 4,
    name: "Coffee & Olive Oil",
    tag: "Exfoliating",
    price: 165,
    color: "#8B7355",
    description:
      "Ground coffee gently exfoliates while olive oil deeply moisturizes. Great for morning routines.",
  },
  {
    id: 5,
    name: "Rose & Shea Butter",
    tag: "Nourishing",
    price: 190,
    color: "#B8868B",
    description:
      "Luxurious rose absolute with shea butter. Deeply nourishing for mature and dry skin types.",
  },
  {
    id: 6,
    name: "Eucalyptus & Mint",
    tag: "Refreshing",
    price: 155,
    color: "#7A9A7E",
    description:
      "Invigorating eucalyptus and peppermint oils. Perfect for an energizing morning shower.",
  },
  {
    id: 7,
    name: "Turmeric & Oat",
    tag: "Brightening",
    price: 175,
    color: "#C9A84C",
    description:
      "Turmeric brightens and evens skin tone while oats soothe and calm irritated skin.",
  },
  {
    id: 8,
    name: "Olive Oil Classic",
    tag: "Traditional",
    price: 150,
    color: "#8B8B3A",
    description:
      "Pure Castile-style soap made with 100% extra virgin olive oil. The classic of Denizli.",
  },
];
