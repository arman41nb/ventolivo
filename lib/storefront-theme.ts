import type { CSSProperties } from "react";
import type { StorefrontThemeSettings } from "@/types";

function expandHexChannel(value: string) {
  return value.length === 1 ? `${value}${value}` : value;
}

function hexToRgbChannels(value: string) {
  const normalized = value.trim().replace("#", "");
  const [red, green, blue] =
    normalized.length === 3
      ? normalized.split("").map((channel) => expandHexChannel(channel))
      : [normalized.slice(0, 2), normalized.slice(2, 4), normalized.slice(4, 6)];

  return `${Number.parseInt(red, 16)} ${Number.parseInt(green, 16)} ${Number.parseInt(blue, 16)}`;
}

export function buildStorefrontThemeStyle(
  theme: StorefrontThemeSettings,
): CSSProperties & Record<string, string> {
  return {
    "--theme-color-cream": theme.themeSurface,
    "--theme-color-warm": theme.themeSurfaceAlt,
    "--theme-color-brown": theme.themePrimary,
    "--theme-color-dark": theme.themeHeading,
    "--theme-color-olive": theme.themeAccent,
    "--theme-color-text": theme.themeText,
    "--theme-color-muted": theme.themeMuted,
    "--storefront-canvas-start": theme.themeCanvasStart,
    "--storefront-canvas-mid": theme.themeCanvasMid,
    "--storefront-canvas-end": theme.themeCanvasEnd,
    "--storefront-surface": theme.themeSurface,
    "--storefront-surface-alt": theme.themeSurfaceAlt,
    "--storefront-surface-raised": theme.themeSurfaceRaised,
    "--storefront-primary": theme.themePrimary,
    "--storefront-primary-strong": theme.themePrimaryStrong,
    "--storefront-accent": theme.themeAccent,
    "--storefront-text": theme.themeText,
    "--storefront-heading": theme.themeHeading,
    "--storefront-muted": theme.themeMuted,
    "--storefront-border": theme.themeBorder,
    "--storefront-footer-start": theme.themeFooterStart,
    "--storefront-footer-end": theme.themeFooterEnd,
    "--storefront-primary-rgb": hexToRgbChannels(theme.themePrimary),
    "--storefront-primary-strong-rgb": hexToRgbChannels(theme.themePrimaryStrong),
    "--storefront-accent-rgb": hexToRgbChannels(theme.themeAccent),
    "--storefront-text-rgb": hexToRgbChannels(theme.themeText),
    "--storefront-heading-rgb": hexToRgbChannels(theme.themeHeading),
    "--storefront-muted-rgb": hexToRgbChannels(theme.themeMuted),
    "--storefront-border-rgb": hexToRgbChannels(theme.themeBorder),
    "--storefront-footer-start-rgb": hexToRgbChannels(theme.themeFooterStart),
    "--storefront-footer-end-rgb": hexToRgbChannels(theme.themeFooterEnd),
    "--storefront-surface-rgb": hexToRgbChannels(theme.themeSurface),
    "--storefront-surface-alt-rgb": hexToRgbChannels(theme.themeSurfaceAlt),
    "--storefront-surface-raised-rgb": hexToRgbChannels(theme.themeSurfaceRaised),
  };
}
