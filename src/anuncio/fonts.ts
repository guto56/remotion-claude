import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";

// Carrega só os pesos usados, para a renderização ficar rápida.
const montserrat = loadMontserrat("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// 700 é usado no negrito das mensagens (*texto*); 600 ficava fraco demais.
const inter = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

// Emojis usam a fonte do sistema: Noto Color Emoji no Linux, Apple/Segoe como reserva.
const EMOJI = '"Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji"';

export const fontFamilies = {
  title: `${montserrat.fontFamily}, ${EMOJI}, sans-serif`,
  ui: `${inter.fontFamily}, ${EMOJI}, sans-serif`,
};
