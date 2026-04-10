import type { HeroForegroundMedia, SiteContentSettings } from "@/types";
import {
  buildMediaTransform,
  buildTranslateScaleTransform,
  MEDIA_FRAMING_LIMITS,
} from "@/modules/media";
import { defaultSiteContentSettings } from "./defaults";

const fallbackHeroImageUrl =
  "/uploads/media/1775316749688-6ecaa607-e084-4337-91d8-84fe7c998834-natural-yogurt-soap-from-ventolivo-removebg-preview.png";
const fallbackAccentImageUrl = "/uploads/media/pastel-pink-candle-holder-removebg-preview.png";

type HeroMediaInput = Partial<
  Pick<
    SiteContentSettings,
    | "heroImageUrl"
    | "heroImageAlt"
    | "heroAccentImageUrl"
    | "heroAccentImageAlt"
    | "heroImageOffsetX"
    | "heroImageOffsetY"
    | "heroImageScale"
    | "heroAccentImageOffsetX"
    | "heroAccentImageOffsetY"
    | "heroAccentImageScale"
    | "heroForegroundMedia"
  >
>;

export interface HeroSceneMediaState {
  heroImageUrl: string;
  heroImageAlt: string;
  heroAccentImageUrl: string;
  heroAccentImageAlt: string;
  heroImageOffsetX: number;
  heroImageOffsetY: number;
  heroImageScale: number;
  heroAccentImageOffsetX: number;
  heroAccentImageOffsetY: number;
  heroAccentImageScale: number;
  heroForegroundMedia: HeroForegroundMedia;
}

export interface HeroSceneTransforms {
  imageTransform: string;
  accentTransform: string;
  stageTransform: string;
  processCardTransform: string;
  naturalCardTransform: string;
  glowTransform: string;
  soapShadowTransform: string;
  accentShadowTransform: string;
}

export function getHeroSceneMediaState(
  settings?: HeroMediaInput,
  brandName = "Ventolivo",
): HeroSceneMediaState {
  return {
    heroImageUrl:
      settings?.heroImageUrl ||
      fallbackHeroImageUrl ||
      defaultSiteContentSettings.heroImageUrl ||
      "",
    heroImageAlt:
      settings?.heroImageAlt ||
      defaultSiteContentSettings.heroImageAlt ||
      `${brandName} hero product`,
    heroAccentImageUrl:
      settings?.heroAccentImageUrl ||
      fallbackAccentImageUrl ||
      defaultSiteContentSettings.heroAccentImageUrl ||
      "",
    heroAccentImageAlt:
      settings?.heroAccentImageAlt ||
      defaultSiteContentSettings.heroAccentImageAlt ||
      `${brandName} accent product`,
    heroImageOffsetX: settings?.heroImageOffsetX ?? MEDIA_FRAMING_LIMITS.offset.defaultValue,
    heroImageOffsetY: settings?.heroImageOffsetY ?? MEDIA_FRAMING_LIMITS.offset.defaultValue,
    heroImageScale: settings?.heroImageScale ?? MEDIA_FRAMING_LIMITS.scale.defaultValue,
    heroAccentImageOffsetX:
      settings?.heroAccentImageOffsetX ?? MEDIA_FRAMING_LIMITS.offset.defaultValue,
    heroAccentImageOffsetY:
      settings?.heroAccentImageOffsetY ?? MEDIA_FRAMING_LIMITS.offset.defaultValue,
    heroAccentImageScale: settings?.heroAccentImageScale ?? MEDIA_FRAMING_LIMITS.scale.defaultValue,
    heroForegroundMedia: settings?.heroForegroundMedia ?? "hero",
  };
}

export function getHeroSceneLayerOrder(foregroundMedia: HeroForegroundMedia | undefined) {
  const heroOnTop = foregroundMedia !== "accent";

  return {
    heroImageZIndex: heroOnTop ? 20 : 18,
    accentImageZIndex: heroOnTop ? 18 : 20,
  };
}

export function getHeroSceneTransforms(
  rawScrollProgress: number,
  media: Pick<
    HeroSceneMediaState,
    | "heroImageOffsetX"
    | "heroImageOffsetY"
    | "heroImageScale"
    | "heroAccentImageOffsetX"
    | "heroAccentImageOffsetY"
    | "heroAccentImageScale"
  >,
): HeroSceneTransforms {
  const heroPlacement = {
    offsetX: media.heroImageOffsetX,
    offsetY: media.heroImageOffsetY,
    scale: media.heroImageScale,
  };
  const accentPlacement = {
    offsetX: media.heroAccentImageOffsetX,
    offsetY: media.heroAccentImageOffsetY,
    scale: media.heroAccentImageScale,
  };

  return {
    imageTransform: buildMediaTransform(rawScrollProgress, heroPlacement, {
      baseX: -18,
      baseY: -132,
      baseRotate: -4.2,
      baseScale: 1.12,
      motionX: 8,
      motionY: 12,
      motionRotate: 1.9,
      motionScale: 0.025,
    }),
    accentTransform: buildMediaTransform(rawScrollProgress, accentPlacement, {
      baseX: 10,
      baseY: 30,
      baseRotate: 1.6,
      baseScale: 1.08,
      motionX: -4,
      motionY: 6,
      motionRotate: -0.9,
      motionScale: 0.02,
    }),
    stageTransform: buildTranslateScaleTransform(rawScrollProgress, undefined, {
      motionX: 6,
      motionY: -4,
    }),
    processCardTransform: buildTranslateScaleTransform(rawScrollProgress, undefined, {
      motionX: -3,
      motionY: 7,
    }),
    naturalCardTransform: buildTranslateScaleTransform(rawScrollProgress, undefined, {
      motionX: -2,
      motionY: -5,
    }),
    glowTransform: buildTranslateScaleTransform(rawScrollProgress, undefined, {
      motionX: -8,
      motionY: 10,
      baseScale: 1,
      motionScale: 0.04,
    }),
    soapShadowTransform: buildTranslateScaleTransform(rawScrollProgress, undefined, {
      motionX: 7,
      motionY: 10,
      baseScale: 1,
      motionScale: 0.03,
    }),
    accentShadowTransform: buildTranslateScaleTransform(rawScrollProgress, accentPlacement, {
      motionX: 4,
      motionY: 7,
      baseScale: 1,
      motionScale: 0.03,
      placementXFactor: 0.35,
      placementYFactor: 0.3,
      placementScaleFactor: 0.24,
    }),
  };
}
