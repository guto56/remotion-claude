import { Easing, interpolate, spring } from "remotion";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Entrada padrão: spring rápido, com leve overshoot.
export const entra = (frame: number, fps: number, inicio: number, damping = 15) =>
  spring({ frame: frame - inicio, fps, config: { damping, mass: 0.6 } });

// Saída: 1 -> 0 em `dur` frames a partir de `inicio`.
export const sai = (frame: number, inicio: number, dur = 8) =>
  interpolate(frame, [inicio, inicio + dur], [1, 0], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });

export const opacidade = (p: number) => Math.min(1, Math.max(0, p));

// "PEITO + [TRÍCEPS]" -> [{ texto: "PEITO + ", destaque: false }, { texto: "TRÍCEPS", destaque: true }]
export const partes = (texto: string) =>
  texto
    .split(/(\[[^\]]+\])/)
    .filter(Boolean)
    .map((p) =>
      p.startsWith("[")
        ? { texto: p.slice(1, -1), destaque: true }
        : { texto: p, destaque: false },
    );
