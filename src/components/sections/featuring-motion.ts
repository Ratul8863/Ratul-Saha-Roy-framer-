/**
 * Fixed navy frame in center.
 * Flat images tilt (baka) off-center and straighten (soja) into the frame.
 */
export const FEATURING_EASE = [0.16, 1, 0.3, 1] as const;

export const SCROLL_SPRING = {
  stiffness: 130,
  damping: 28,
  mass: 0.36,
  restDelta: 0.0008,
} as const;

export const META_TRANSITION = {
  duration: 0.35,
  ease: FEATURING_EASE,
} as const;

export const NUMBER_TRANSITION = {
  duration: 0.45,
  ease: FEATURING_EASE,
} as const;

export const LIST_TRANSITION = {
  duration: 0.35,
  ease: FEATURING_EASE,
} as const;

export const DEFAULT_FEATURED_INDEX = 2;

/** Frame box — shared by FixedFrame + StackCard alignment */
export const FRAME_TOP = "12%";
export const FRAME_WIDTH = "min(38%, 560px)";

/**
 * local = floatIndex - cardIndex
 * 0 = seated straight inside the fixed frame
 */
export const CARD_LOCAL = [-1.1, -0.55, 0, 0.55, 1.1] as const;

export const CARD_Y = [230, 110, 0, -120, -240] as const;
export const CARD_X = [0, 0, 0, 55, 120] as const;

/** Strong off-center tilt → 0° in the frame */
export const CARD_ROTATE_X = [14, 7, 0, -7, -14] as const;
export const CARD_ROTATE_Y = [-8, -3, 0, 16, 32] as const;
export const CARD_ROTATE_Z = [5, 2, 0, -3, -7] as const;

export const CARD_SCALE = [0.9, 0.96, 1, 0.95, 0.88] as const;
export const CARD_OPACITY = [0.4, 0.85, 1, 0.85, 0.35] as const;
export const CARD_BLUR = [5, 2, 0, 2, 5] as const;

export function listOpacityForDistance(distance: number): number {
  if (distance === 0) return 1;
  if (distance === 1) return 0.2;
  if (distance === 2) return 0.14;
  return 0.1;
}
