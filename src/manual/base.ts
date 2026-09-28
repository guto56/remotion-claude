import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { interpolate, spring } from "remotion";
import { ANIM } from "../config";

const poppins = loadPoppins("normal", {
  weights: ["300", "400", "500", "700"],
  subsets: ["latin"],
});
const caveat = loadCaveat("normal", { weights: ["600"], subsets: ["latin"] });

export const FONTES = {
  poppins: poppins.fontFamily, // títulos Light maiúsculo, destaques Medium
  caveat: caveat.fontFamily, // só detalhes "escritos à mão"
};

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Entrada padrão: spring suave (damping 200). `duracao` fixa o tempo em frames.
export const suave = (frame: number, fps: number, inicio: number, duracao = 24) =>
  spring({ frame: frame - inicio, fps, config: ANIM.suave, durationInFrames: duracao });

// "Pop": spring com overshoot (damping ~12). Só para miniaturas e passos.
export const pop = (frame: number, fps: number, inicio: number) =>
  spring({ frame: frame - inicio, fps, config: ANIM.pop });

// Flutuação lenta (nunca deixa um frame totalmente parado)
export const flutua = (frame: number, fase = 0, amplitude = 1, periodo = 90) =>
  Math.sin(((frame + fase) / periodo) * Math.PI * 2) * amplitude;

// 0 -> 1 linear entre dois frames
export const progresso = (frame: number, de: number, ate: number) =>
  interpolate(frame, [de, ate], [0, 1], clamp);

// ID seguro para usar em url(#...) de SVG
export const idSvg = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, "");
