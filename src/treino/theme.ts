import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ============================================================
// VISUAL do vídeo "Treino de segunda": cores, fontes e tamanhos.
// ============================================================

const anton = loadAnton("normal", { weights: ["400"], subsets: ["latin"] });
const inter = loadInter("normal", {
  weights: ["500", "600", "700", "800"],
  subsets: ["latin"],
});

export const cores = {
  fundo: "#0B0B0C", // atrás do vídeo quando ele vira um card
  destaque: "#D4FF3A", // verde-limão (palavras em destaque, ícones)
  branco: "#FFFFFF",
  cinza: "rgba(255,255,255,0.62)",
  card: "rgba(24,24,27,0.9)",
  borda: "rgba(255,255,255,0.10)",
  tinta: "#0B0B0C", // texto sobre o verde-limão
};

export const fontes = {
  impacto: anton.fontFamily, // títulos, legendas, nomes dos exercícios
  ui: inter.fontFamily, // rótulos e textos pequenos
};

export const tamanho = {
  titulo: 104, // gancho do frame 0
  legenda: 86,
  palavraGigante: 250, // "PEITO"
  palavraDupla: 118, // "PEITO + TRÍCEPS"
  rotulo: 26, // "O IMPORTANTE", "TREINO DE SEGUNDA"
  card: 50,
  ficha: 52,
};

// Sombra dos textos que ficam sobre o vídeo
export const sombraTexto = "0 4px 24px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.5)";
