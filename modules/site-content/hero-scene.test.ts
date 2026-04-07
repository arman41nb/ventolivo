import { describe, expect, it } from "vitest";
import {
  getHeroSceneLayerOrder,
  getHeroSceneMediaState,
} from "./hero-scene";

describe("getHeroSceneMediaState", () => {
  it("falls back to the main hero image being on top", () => {
    const state = getHeroSceneMediaState();

    expect(state.heroForegroundMedia).toBe("hero");
  });

  it("preserves the configured foreground image", () => {
    const state = getHeroSceneMediaState({
      heroForegroundMedia: "accent",
    });

    expect(state.heroForegroundMedia).toBe("accent");
  });
});

describe("getHeroSceneLayerOrder", () => {
  it("keeps the main hero image above the accent image by default", () => {
    expect(getHeroSceneLayerOrder("hero")).toEqual({
      heroImageZIndex: 20,
      accentImageZIndex: 18,
    });
  });

  it("can bring the accent image to the front", () => {
    expect(getHeroSceneLayerOrder("accent")).toEqual({
      heroImageZIndex: 18,
      accentImageZIndex: 20,
    });
  });
});
