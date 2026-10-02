import { Easing, interpolate, spring } from "remotion";
import { MOVIMENTO } from "./timing";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Entrada padrão: spring (damping 14, mass 0.6). Vai de 0 a ~1 com leve overshoot.
export const entra = (frame: number, fps: number, inicio: number) =>
  spring({ frame: frame - inicio, fps, config: MOVIMENTO.mola });

// Saída padrão: 1 -> 0 em 8 frames a partir de `inicio` (antes disso vale 1).
export const sai = (frame: number, inicio: number | undefined) =>
  inicio === undefined
    ? 1
    : interpolate(frame, [inicio, inicio + MOVIMENTO.saida], [1, 0], {
        ...clamp,
        easing: Easing.in(Easing.cubic),
      });

// Opacidade a partir de um spring (sem passar de 1 no overshoot)
export const op = (p: number) => Math.min(1, Math.max(0, p));

// Zoom contínuo do celular (1 -> 1.04) ao longo de um intervalo
export const zoomLento = (frame: number, de: number, ate: number) =>
  interpolate(frame, [de, ate], [1, 1 + MOVIMENTO.zoomCelular], clamp);
