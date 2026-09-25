import { Easing, interpolate, spring } from "remotion";
import { MOTION } from "../timing";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Entrada padrão: spring (damping 14, mass 0.6). Vai de 0 a ~1 (com leve overshoot).
export const enter = (frame: number, fps: number, start: number) =>
  spring({ frame: frame - start, fps, config: MOTION.spring });

// Saída padrão: 1 -> 0 em 8 frames a partir de `start`. Antes disso vale 1.
export const exit = (frame: number, start: number | undefined) =>
  start === undefined
    ? 1
    : interpolate(frame, [start, start + MOTION.exitFrames], [1, 0], {
        ...clamp,
        easing: Easing.in(Easing.cubic),
      });

// Opacidade a partir de um spring (sem passar de 1 no overshoot).
export const fadeFrom = (progress: number) => Math.min(1, Math.max(0, progress));

// Zoom contínuo do celular (1 -> 1.04) ao longo de um intervalo.
export const slowZoom = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [1, 1 + MOTION.phoneZoom], clamp);

export const clamped = clamp;
