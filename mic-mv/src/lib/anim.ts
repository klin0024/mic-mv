import { Easing, interpolate, random } from "remotion";

export const FPS = 30;

// Clamped interpolate with a gentle ease — used by the many small SVG layers.
export const ip = (
  frame: number,
  input: number[],
  output: number[],
  easing: (t: number) => number = Easing.bezier(0.33, 0, 0.2, 1),
) =>
  interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

// Seconds -> frames
export const s = (sec: number) => Math.round(sec * FPS);

// Pop-in scale with a small overshoot
export const pop = (frame: number, start: number, dur = 14) =>
  interpolate(frame, [start, start + dur * 0.65, start + dur], [0, 1.12, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

// Fade window: in over `fade` frames at `start`, out over `fade` frames at `end`
export const win = (frame: number, start: number, end: number, fade = 12) =>
  interpolate(frame, [start, start + fade, end - fade, end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const rand = (seed: string | number) => random(seed);

export const FONT_UI = '"Microsoft JhengHei", "Noto Sans TC", "PingFang TC", sans-serif';
export const FONT_HAND = '"TW-Kai", "DFKai-SB", "BiauKai", "KaiTi", serif';
