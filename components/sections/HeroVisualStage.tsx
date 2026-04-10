"use client";

import type { CSSProperties, ReactNode } from "react";
import SceneImage from "@/components/media/SceneImage";
import type { HeroSceneMediaState, HeroSceneTransforms } from "@/modules/site-content";
import { getHeroSceneLayerOrder } from "@/modules/site-content";

interface HeroStageSlotProps {
  className: string;
  contentClassName?: string;
  style?: CSSProperties;
}

type HeroStageSlotRenderer = (content: ReactNode, props: HeroStageSlotProps) => ReactNode;

interface HeroVisualStageProps {
  brandName: string;
  media: HeroSceneMediaState;
  transforms: HeroSceneTransforms;
  renderHeroImage?: HeroStageSlotRenderer;
  renderAccentImage?: HeroStageSlotRenderer;
  renderBrandBadge?: HeroStageSlotRenderer;
  heroImageMotionClassName?: string;
  heroImageWrapperClassName?: string;
  accentImageMotionClassName?: string;
  accentImageWrapperClassName?: string;
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
  heroImageMotionClassName = "hero-product-reveal",
  heroImageWrapperClassName = "",
  accentImageMotionClassName = "",
  accentImageWrapperClassName = "",
}: HeroVisualStageProps) {
  const layerOrder = getHeroSceneLayerOrder(media.heroForegroundMedia);

  return (
    <div className="relative min-h-[420px] sm:min-h-[500px] lg:min-h-[680px]">
      <div className="pointer-events-none absolute left-[8%] top-[15%] h-[34%] w-[66%] rounded-[999px] bg-[radial-gradient(circle,rgba(255,255,255,0.88),rgba(255,255,255,0.14)_62%,transparent_76%)] hero-stage-atmosphere hero-stage-atmosphere-delay-1 sm:left-[10%] sm:w-[56%]" />
      <div className="pointer-events-none absolute right-[2%] top-[13%] h-[34%] w-[34%] rounded-[999px] bg-[radial-gradient(circle,rgba(233,214,195,0.62),rgba(233,214,195,0.12)_58%,transparent_74%)] hero-stage-atmosphere hero-stage-atmosphere-delay-2 sm:right-[4%] sm:w-[28%]" />
      <div className="pointer-events-none absolute left-[14%] top-[19%] h-px w-[48%] bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.88),rgba(255,255,255,0))] hero-stage-line" />
      <div
        className="absolute inset-x-[3%] top-[11%] bottom-[12%] rounded-[34px] border border-white/52 bg-[linear-gradient(180deg,rgba(255,255,255,0.54),rgba(246,237,228,0.3))] shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_24px_44px_rgba(109,82,58,0.08)] transition-transform duration-300 sm:inset-x-[5%] sm:bottom-[14%] sm:rounded-[48px] sm:shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_32px_62px_rgba(109,82,58,0.08)]"
        style={{ transform: transforms.stageTransform }}
      />
      <div
        className="absolute right-[1%] top-[18%] h-[56%] w-[34%] rounded-[28px] border border-white/50 bg-[linear-gradient(180deg,rgba(255,250,246,0.7),rgba(246,236,230,0.36))] shadow-[inset_0_1px_0_rgba(255,255,255,0.76)] transition-transform duration-300 sm:right-[2%] sm:w-[30%] sm:rounded-[40px]"
        style={{ transform: transforms.stageTransform }}
      />
      <div
        className="absolute left-[6%] top-[12%] h-[50%] w-[86%] rounded-[999px] bg-[radial-gradient(circle_at_46%_42%,rgba(255,255,255,0.98),rgba(255,255,255,0.8)_34%,rgba(239,228,217,0.26)_66%,transparent_84%)] transition-transform duration-300 sm:left-[9%] sm:top-[10%] sm:h-[54%] sm:w-[78%]"
        style={{ transform: transforms.glowTransform }}
      />
      <div
        className="absolute left-[16%] bottom-[14%] h-14 w-[66%] rounded-full bg-[radial-gradient(circle,rgba(109,77,53,0.3),rgba(109,77,53,0.08)_42%,transparent_74%)] blur-2xl transition-transform duration-300 sm:left-[18%] sm:h-16 sm:w-[62%]"
        style={{ transform: transforms.soapShadowTransform }}
      />
      <div
        className="absolute bottom-[16%] right-[8%] z-[16] h-8 w-[34%] min-w-[120px] rounded-full bg-[radial-gradient(circle,rgba(164,119,141,0.2),rgba(164,119,141,0.08)_42%,transparent_74%)] blur-xl transition-transform duration-300 sm:right-[10%] sm:h-10 sm:w-[30%] sm:min-w-[160px]"
        style={{ transform: transforms.accentShadowTransform }}
      />

      {renderSlot(
        <SceneImage
          src={media.heroAccentImageUrl}
          alt={media.heroAccentImageAlt}
          label="Accent image"
          hint="Use the framing controls to move and scale this layer."
          imageClassName={`${accentImageMotionClassName} h-full w-full object-contain opacity-95 drop-shadow-[0_24px_36px_rgba(93,61,39,0.16)]`.trim()}
          placeholderClassName="aspect-square drop-shadow-[0_24px_36px_rgba(93,61,39,0.12)]"
        />,
        {
          className:
            "absolute bottom-[6%] right-[4%] z-[18] aspect-square w-[36%] min-w-[126px] max-w-[188px] transition-transform duration-300 sm:bottom-[7%] sm:right-[6%] sm:w-[32%] sm:min-w-[170px] sm:max-w-[250px]",
          contentClassName: `h-full w-full ${accentImageWrapperClassName}`.trim(),
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
          imageClassName={`${heroImageMotionClassName} w-full object-contain drop-shadow-[0_42px_60px_rgba(78,54,37,0.28)]`.trim()}
          placeholderClassName="aspect-[4/3] w-full drop-shadow-[0_42px_60px_rgba(78,54,37,0.14)]"
        />,
        {
          className:
            "absolute left-[-12%] top-[1%] z-20 w-[122%] max-w-[940px] transition-transform duration-300 sm:left-[-5%] sm:top-[-8%] sm:w-[108%]",
          contentClassName: `w-full ${heroImageWrapperClassName}`.trim(),
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
          className:
            "absolute left-[7%] top-[6%] z-30 w-fit sm:left-[9%] sm:top-[6.5%]",
        },
        renderBrandBadge,
      )}
    </div>
  );
}
