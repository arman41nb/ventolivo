export interface MediaTransformPlacement {
  offsetX?: number;
  offsetY?: number;
  scale?: number;
}

export interface MediaTransformConfig {
  baseX?: number;
  baseY?: number;
  baseRotate?: number;
  baseScale?: number;
  motionX?: number;
  motionY?: number;
  motionRotate?: number;
  motionScale?: number;
  placementXFactor?: number;
  placementYFactor?: number;
  placementScaleFactor?: number;
}

function round(value: number) {
  return Number(value.toFixed(4));
}

export function clampProgress(rawProgress: number): number {
  if (Number.isNaN(rawProgress) || !Number.isFinite(rawProgress)) {
    return 0;
  }

  return Math.min(Math.max(rawProgress, 0), 1);
}

export function buildMediaTransform(
  rawProgress: number,
  placement: MediaTransformPlacement | undefined,
  config: MediaTransformConfig,
): string {
  const progress = clampProgress(rawProgress);
  const offsetX = placement?.offsetX ?? 0;
  const offsetY = placement?.offsetY ?? 0;
  const scale = placement?.scale ?? 100;
  const translateX =
    (config.baseX ?? 0) +
    progress * (config.motionX ?? 0) +
    offsetX * (config.placementXFactor ?? 1);
  const translateY =
    (config.baseY ?? 0) +
    progress * (config.motionY ?? 0) +
    offsetY * (config.placementYFactor ?? 1);
  const rotate =
    (config.baseRotate ?? 0) + progress * (config.motionRotate ?? 0);
  const scaled =
    ((config.baseScale ?? 1) + progress * (config.motionScale ?? 0)) *
    (1 + ((scale - 100) / 100) * (config.placementScaleFactor ?? 1));

  return `translate3d(${round(translateX)}px, ${round(translateY)}px, 0) rotate(${round(
    rotate,
  )}deg) scale(${round(scaled)})`;
}

export function buildTranslateScaleTransform(
  rawProgress: number,
  placement: MediaTransformPlacement | undefined,
  config: Omit<MediaTransformConfig, "baseRotate" | "motionRotate">,
): string {
  const progress = clampProgress(rawProgress);
  const offsetX = placement?.offsetX ?? 0;
  const offsetY = placement?.offsetY ?? 0;
  const scale = placement?.scale ?? 100;
  const translateX =
    (config.baseX ?? 0) +
    progress * (config.motionX ?? 0) +
    offsetX * (config.placementXFactor ?? 1);
  const translateY =
    (config.baseY ?? 0) +
    progress * (config.motionY ?? 0) +
    offsetY * (config.placementYFactor ?? 1);
  const scaled =
    ((config.baseScale ?? 1) + progress * (config.motionScale ?? 0)) *
    (1 + ((scale - 100) / 100) * (config.placementScaleFactor ?? 1));

  return `translate3d(${round(translateX)}px, ${round(translateY)}px, 0) scale(${round(
    scaled,
  )})`;
}
