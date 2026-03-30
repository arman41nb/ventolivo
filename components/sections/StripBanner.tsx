import type { Dictionary } from "@/i18n";

interface StripBannerProps {
  dict?: Dictionary;
}

export default function StripBanner({ dict }: StripBannerProps) {
  const items = dict?.stripBanner.items ?? [
    "Handcrafted",
    "Natural Ingredients",
    "No Chemicals",
    "Made in Denizli",
  ];

  return (
    <div className="bg-brown px-[2.5rem] py-[0.8rem] flex gap-[3rem] justify-center">
      {items.map((item) => (
        <span
          key={item}
          className="text-[11px] tracking-[1.5px] uppercase text-white/[0.8]"
        >
          — {item}
        </span>
      ))}
    </div>
  );
}
