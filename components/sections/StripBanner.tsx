import type { Dictionary } from "@/i18n";
import type { SiteContentSettings } from "@/types";

interface StripBannerProps {
  dict?: Dictionary;
  siteSettings?: SiteContentSettings;
}

export default function StripBanner({ dict, siteSettings }: StripBannerProps) {
  const items = [
    siteSettings?.stripBannerItem1 ?? dict?.stripBanner.items?.[0],
    siteSettings?.stripBannerItem2 ?? dict?.stripBanner.items?.[1],
    siteSettings?.stripBannerItem3 ?? dict?.stripBanner.items?.[2],
    siteSettings?.stripBannerItem4 ?? dict?.stripBanner.items?.[3],
  ].filter((item): item is string => Boolean(item));

  return (
    <div className="bg-brown px-[2.5rem] py-[0.8rem] flex gap-[3rem] justify-center">
      {items.map((item) => (
        <span key={item} className="text-[11px] tracking-[1.5px] uppercase text-white/[0.8]">
          — {item}
        </span>
      ))}
    </div>
  );
}
