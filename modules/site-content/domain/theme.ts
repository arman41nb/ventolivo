import type {
  StorefrontThemePreset,
  StorefrontThemeRecipe,
  StorefrontThemeSettings,
} from "@/types";

export const SITE_THEME_PRESETS_KEY = "__siteThemePresets";

interface HslColor {
  h: number;
  s: number;
  l: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizeHue(value: number) {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "").trim();
  const parts =
    normalized.length === 3
      ? normalized.split("").map((value) => `${value}${value}`)
      : [normalized.slice(0, 2), normalized.slice(2, 4), normalized.slice(4, 6)];

  return {
    r: Number.parseInt(parts[0], 16),
    g: Number.parseInt(parts[1], 16),
    b: Number.parseInt(parts[2], 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0"))
    .join("")}`;
}

function rgbToHsl(r: number, g: number, b: number): HslColor {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const lightness = (max + min) / 2;

  if (delta === 0) {
    return { h: 0, s: 0, l: lightness * 100 };
  }

  const saturation =
    lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

  let hue = 0;

  switch (max) {
    case red:
      hue = (green - blue) / delta + (green < blue ? 6 : 0);
      break;
    case green:
      hue = (blue - red) / delta + 2;
      break;
    default:
      hue = (red - green) / delta + 4;
      break;
  }

  return {
    h: normalizeHue(hue * 60),
    s: saturation * 100,
    l: lightness * 100,
  };
}

function hslToHex({ h, s, l }: HslColor) {
  const saturation = clamp(s, 0, 100) / 100;
  const lightness = clamp(l, 0, 100) / 100;
  const hue = normalizeHue(h) / 360;

  if (saturation === 0) {
    const gray = lightness * 255;
    return rgbToHex(gray, gray, gray);
  }

  const q =
    lightness < 0.5
      ? lightness * (1 + saturation)
      : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;

  const hueToRgb = (t: number) => {
    let next = t;

    if (next < 0) next += 1;
    if (next > 1) next -= 1;
    if (next < 1 / 6) return p + (q - p) * 6 * next;
    if (next < 1 / 2) return q;
    if (next < 2 / 3) return p + (q - p) * (2 / 3 - next) * 6;
    return p;
  };

  return rgbToHex(
    hueToRgb(hue + 1 / 3) * 255,
    hueToRgb(hue) * 255,
    hueToRgb(hue - 1 / 3) * 255,
  );
}

function toHsl(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

function withHsl(hex: string, mutate: (color: HslColor) => HslColor) {
  return hslToHex(mutate(toHsl(hex)));
}

function createSurfaceColor(seed: HslColor, lightness: number, saturation = 22) {
  return hslToHex({
    h: seed.h,
    s: clamp(Math.min(seed.s, saturation), 8, 28),
    l: clamp(lightness, 0, 100),
  });
}

function createTextColor(seed: HslColor, lightness: number, saturation = 22, hueShift = 0) {
  return hslToHex({
    h: normalizeHue(seed.h + hueShift),
    s: clamp(Math.min(seed.s, saturation), 10, 26),
    l: clamp(lightness, 8, 30),
  });
}

export function generateStorefrontThemeFromSeed(
  seedHex: string,
  recipe: StorefrontThemeRecipe = "balanced",
): StorefrontThemeSettings {
  const seed = toHsl(seedHex);
  const primary = hslToHex({
    h: seed.h,
    s: clamp(Math.max(seed.s, 34), 34, recipe === "bold" ? 78 : 68),
    l: clamp(recipe === "soft" ? Math.min(seed.l, 48) : seed.l, 34, 58),
  });

  const primaryStrong = withHsl(primary, (color) => ({
    h: normalizeHue(color.h + (recipe === "bold" ? -6 : -3)),
    s: clamp(color.s + (recipe === "bold" ? 8 : 4), 28, 84),
    l: clamp(color.l - (recipe === "soft" ? 12 : 18), 18, 42),
  }));

  const accentHueShift =
    recipe === "soft" ? 26 : recipe === "bold" ? 154 : 42;

  const accent = hslToHex({
    h: normalizeHue(seed.h + accentHueShift),
    s: clamp(recipe === "soft" ? seed.s * 0.42 : seed.s * 0.68, 24, 62),
    l: clamp(recipe === "bold" ? 42 : 46, 34, 56),
  });

  const canvasStart = createSurfaceColor(seed, recipe === "bold" ? 95 : 96, 20);
  const canvasMid = createSurfaceColor(seed, recipe === "bold" ? 91 : 93, 22);
  const canvasEnd = createSurfaceColor(
    { ...seed, h: normalizeHue(seed.h + (recipe === "soft" ? 12 : 8)) },
    recipe === "bold" ? 87 : 89,
    26,
  );
  const surface = createSurfaceColor(seed, 94, 20);
  const surfaceAlt = createSurfaceColor(
    { ...seed, h: normalizeHue(seed.h + 8) },
    recipe === "bold" ? 88 : 90,
    26,
  );
  const surfaceRaised = createSurfaceColor(seed, 98, 14);
  const heading = createTextColor(seed, recipe === "soft" ? 14 : 13, 18, -6);
  const text = createTextColor(seed, recipe === "soft" ? 22 : 20, 18, -4);
  const muted = createTextColor(seed, 48, 16, 2);
  const border = createSurfaceColor(
    { ...seed, h: normalizeHue(seed.h + 6) },
    recipe === "bold" ? 80 : 82,
    24,
  );

  return {
    themeCanvasStart: canvasStart,
    themeCanvasMid: canvasMid,
    themeCanvasEnd: canvasEnd,
    themeSurface: surface,
    themeSurfaceAlt: surfaceAlt,
    themeSurfaceRaised: surfaceRaised,
    themePrimary: primary,
    themePrimaryStrong: primaryStrong,
    themeAccent: accent,
    themeText: text,
    themeHeading: heading,
    themeMuted: muted,
    themeBorder: border,
    themeFooterStart: primaryStrong,
    themeFooterEnd: withHsl(primaryStrong, (color) => ({
      h: color.h,
      s: clamp(color.s + 4, 22, 86),
      l: clamp(color.l - 10, 10, 26),
    })),
  };
}

export const storefrontThemePresets: StorefrontThemePreset[] = [
  {
    id: "ventolivo-classic",
    name: "Ventolivo Classic",
    description: "Warm artisanal neutrals with olive highlights.",
    recipe: "balanced",
    settings: generateStorefrontThemeFromSeed("#6b4f3a", "balanced"),
  },
  {
    id: "rose-atelier",
    name: "Rose Atelier",
    description: "Soft rose-beige luxury with a calm boutique feel.",
    recipe: "soft",
    settings: generateStorefrontThemeFromSeed("#b7747f", "soft"),
  },
  {
    id: "mediterranean-olive",
    name: "Mediterranean Olive",
    description: "Fresh olive-forward palette for herbal, natural positioning.",
    recipe: "balanced",
    settings: generateStorefrontThemeFromSeed("#72804d", "balanced"),
  },
  {
    id: "amber-spice",
    name: "Amber Spice",
    description: "A richer amber direction with stronger contrast and depth.",
    recipe: "bold",
    settings: generateStorefrontThemeFromSeed("#a25d2a", "bold"),
  },
  {
    id: "coastal-mineral",
    name: "Coastal Mineral",
    description: "Muted mineral blue with a premium spa-like atmosphere.",
    recipe: "soft",
    settings: generateStorefrontThemeFromSeed("#68879d", "soft"),
  },
];
