export const MEDIA_FRAMING_LIMITS = {
  offset: {
    min: -640,
    max: 640,
    step: 1,
    defaultValue: 0,
  },
  scale: {
    min: 20,
    max: 360,
    step: 1,
    defaultValue: 100,
  },
} as const;
