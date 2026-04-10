import type { Dictionary } from "@/i18n";
import type { SiteContentSettings } from "@/types";

interface StripBannerMarqueeProps {
  dict?: Dictionary;
  siteSettings?: SiteContentSettings;
}

export default function StripBannerMarquee({ dict, siteSettings }: StripBannerMarqueeProps) {
  const items = [
    siteSettings?.stripBannerItem1 ?? dict?.stripBanner.items?.[0],
    siteSettings?.stripBannerItem2 ?? dict?.stripBanner.items?.[1],
    siteSettings?.stripBannerItem3 ?? dict?.stripBanner.items?.[2],
    siteSettings?.stripBannerItem4 ?? dict?.stripBanner.items?.[3],
  ].filter((item): item is string => Boolean(item));

  return (
    <div className="bg-brown px-4 py-4 md:px-6">
      <div className="mx-auto flex max-w-[1380px] flex-wrap items-center justify-center gap-x-8 gap-y-2 text-center">
        {items.map((item) => (
          <span key={item} className="text-[11px] uppercase tracking-[0.18em] text-cream/85">
            - {item}
          </span>
        ))}
      </div>
    </div>
  );
}
