"use client";

import type { CSSProperties, ReactNode } from "react";
import SceneImage from "@/components/media/SceneImage";
import type {
  HeroSceneMediaState,
  HeroSceneTransforms,
} from "@/modules/site-content/hero-scene";
import { getHeroSceneLayerOrder } from "@/modules/site-content/hero-scene";

interface HeroStageSlotProps {
  className: string;
  contentClassName?: string;
  style?: CSSProperties;
}

type HeroStageSlotRenderer = (
  content: ReactNode,
  props: HeroStageSlotProps,
) => ReactNode;

interface HeroVisualStageProps {
  brandName: string;
  media: HeroSceneMediaState;
  transforms: HeroSceneTransforms;
  renderHeroImage?: HeroStageSlotRenderer;
  renderAccentImage?: HeroStageSlotRenderer;
  renderBrandBadge?: HeroStageSlotRenderer;
}

function renderSlot(
  content: ReactNode,
  props: HeroStageSlotProps,
  renderer?: HeroStageSlotRenderer,
) {
  if (renderer) {
    return renderer(content, props);
  }

  return (
    <div className={props.className} style={props.style}>
      <div className={props.contentClassName}>{content}</div>
    </div>
  );
}

export default function HeroVisualStage({
  brandName,
  media,
  transforms,
  renderHeroImage,
  renderAccentImage,
  renderBrandBadge,
}: HeroVisualStageProps) {
  const layerOrder = getHeroSceneLayerOrder(media.heroForegroundMedia);

  return (
    <div className="relative min-h-[420px] sm:min-h-[500px] lg:min-h-[680px]">
      <div
        className="absolute inset-x-[5%] top-[11%] bottom-[14%] rounded-[48px] border border-white/52 bg-[linear-gradient(180deg,rgba(255,255,255,0.54),rgba(246,237,228,0.3))] shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_32px_62px_rgba(109,82,58,0.08)] transition-transform duration-300"
        style={{ transform: transforms.stageTransform }}
      />
      <div
        className="absolute right-[2%] top-[17%] h-[58%] w-[30%] rounded-[40px] border border-white/50 bg-[linear-gradient(180deg,rgba(255,250,246,0.7),rgba(246,236,230,0.36))] shadow-[inset_0_1px_0_rgba(255,255,255,0.76)] transition-transform duration-300"
        style={{ transform: transforms.stageTransform }}
      />
      <div
        className="absolute left-[9%] top-[10%] h-[54%] w-[78%] rounded-[999px] bg-[radial-gradient(circle_at_46%_42%,rgba(255,255,255,0.98),rgba(255,255,255,0.8)_34%,rgba(239,228,217,0.26)_66%,transparent_84%)] transition-transform duration-300"
        style={{ transform: transforms.glowTransform }}
      />
      <div
        className="absolute left-[18%] bottom-[14%] h-16 w-[62%] rounded-full bg-[radial-gradient(circle,rgba(109,77,53,0.3),rgba(109,77,53,0.08)_42%,transparent_74%)] blur-2xl transition-transform duration-300"
        style={{ transform: transforms.soapShadowTransform }}
      />
      <div
        className="absolute bottom-[16%] right-[10%] z-[16] h-10 w-[30%] min-w-[160px] rounded-full bg-[radial-gradient(circle,rgba(164,119,141,0.2),rgba(164,119,141,0.08)_42%,transparent_74%)] blur-xl transition-transform duration-300"
        style={{ transform: transforms.accentShadowTransform }}
      />

      {renderSlot(
        <SceneImage
          src={media.heroAccentImageUrl}
          alt={media.heroAccentImageAlt}
          label="Accent image"
          hint="Use the framing controls to move and scale this layer."
          imageClassName="h-full w-full object-contain opacity-95 drop-shadow-[0_24px_36px_rgba(93,61,39,0.16)]"
          placeholderClassName="aspect-square drop-shadow-[0_24px_36px_rgba(93,61,39,0.12)]"
        />,
        {
          className:
            "absolute bottom-[7%] right-[6%] z-[18] aspect-square w-[32%] min-w-[170px] max-w-[250px] transition-transform duration-300",
          contentClassName: "h-full w-full",
          style: {
            transform: transforms.accentTransform,
            transformOrigin: "bottom right",
            zIndex: layerOrder.accentImageZIndex,
          },
        },
        renderAccentImage,
      )}

      {renderSlot(
        <SceneImage
          src={media.heroImageUrl}
          alt={media.heroImageAlt}
          label="Hero image"
          hint="Use the framing controls to move and scale this layer."
          imageClassName="hero-product-reveal w-full object-contain drop-shadow-[0_42px_60px_rgba(78,54,37,0.28)]"
          placeholderClassName="aspect-[4/3] w-full drop-shadow-[0_42px_60px_rgba(78,54,37,0.14)]"
        />,
        {
          className:
            "absolute left-[-5%] top-[-8%] z-20 w-[108%] max-w-[940px] transition-transform duration-300",
          contentClassName: "w-full",
          style: {
            transform: transforms.imageTransform,
            transformOrigin: "bottom center",
            zIndex: layerOrder.heroImageZIndex,
          },
        },
        renderHeroImage,
      )}

      {renderSlot(
        <span className="rounded-full border border-white/62 bg-[rgba(255,252,247,0.88)] px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-[#ab8a72] shadow-[0_14px_28px_rgba(105,81,61,0.06)] backdrop-blur-xl">
          {brandName}
        </span>,
        {
          className: "absolute left-[9%] top-[6.5%] z-30 w-fit",
        },
        renderBrandBadge,
      )}
    </div>
  );
}
