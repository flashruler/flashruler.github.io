export interface ParticleThemeColors {
  /** Raw "r, g, b" string — used as rgba(${color}, ${alpha}) */
  particleColor: string;
  lineColor: string;
  background: string;
}

export interface ParticleConfig {
  /** Fixed particle count. Set to null to use densityFactor instead. */
  count: number | null;
  /** Particles per 10,000 px² of canvas area. Used when count is null. */
  densityFactor: number;

  sizeMin: number;   // px
  sizeMax: number;   // px

  speedMin: number;  // px/frame
  speedMax: number;  // px/frame

  particleOpacity: number; // 0–1

  connectLines: boolean;
  /** Max distance (px) between two particles before a line is drawn */
  connectionDistance: number;
  /** Multiplier for line alpha based on distance (0–1) */
  lineOpacityFactor: number;

  mouseRepel: boolean;
  mouseRepelRadius: number;   // px
  mouseRepelStrength: number; // 0–1

  dark: ParticleThemeColors;
  light: ParticleThemeColors;

  /** Target FPS cap */
  maxFps: number;
  /** Pause animation when the browser tab is hidden */
  pauseOnHidden: boolean;
}

export const particleConfig: ParticleConfig = {
  count: null,
  densityFactor: 6,

  sizeMin: 1.5,
  sizeMax: 3.5,

  speedMin: 0.08,
  speedMax: 0.35,

  particleOpacity: 0.04,

  connectLines: true,
  connectionDistance: 130,
  lineOpacityFactor: 0.05,

  mouseRepel: true,
  mouseRepelRadius: 90,
  mouseRepelStrength: 0.12,

  dark: {
    particleColor: "160, 185, 210",
    lineColor: "160, 185, 210",
    background: "transparent",
  },
  light: {
    particleColor: "120, 140, 160",
    lineColor: "120, 140, 160",
    background: "transparent",
  },

  maxFps: 60,
  pauseOnHidden: true,
};
