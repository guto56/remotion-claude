import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";

// ============================================================
// IDENTIDADE VISUAL do anúncio "Barbearia": cores, fontes e tamanhos.
// ============================================================

const montserrat = loadMontserrat("normal", { weights: ["700", "800"], subsets: ["latin"] });
const inter = loadInter("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

// Emojis usam a fonte do sistema (Noto Color Emoji no Linux)
const EMOJI = '"Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji"';

export const cores = {
  marca: "#0F766E", // verde marca
  noite: "#0B1F1D", // fundo escuro
  menta: "#DCF5EE", // balão da assistente
  claro: "#F5FBF9", // fundo claro
  branco: "#FFFFFF",
  texto: "#111827", // texto escuro
  cinza: "#6B7280", // texto secundário
  balaoCliente: "#FFFFFF",
  bordaCliente: "#E5E7EB",
  amarelo: "#FFD400", // destaque
  vermelho: "#EF4444", // dor
  corpoCelular: "#050908",
  telaBloqueio: "linear-gradient(180deg, #17332F 0%, #081412 100%)",
  telaConversa: "#EAF2EF",
};

export const fontes = {
  titulo: `${montserrat.fontFamily}, ${EMOJI}, sans-serif`, // Montserrat 800/700
  ui: `${inter.fontFamily}, ${EMOJI}, sans-serif`, // Inter 400/500/600
};

export const tipo = {
  titulo: 84, // títulos (76 a 92)
  tituloLinha: 1.05,
  chip: 40, // "BARBEARIA E SALÃO:" (Montserrat 800)
  etiqueta: 32, // "Respondeu em 3 segundos"
  conversa: 32, // balões (Inter 500)
  horaBalao: 20, // hora do balão (Inter 400)
  aviso: 25, // aviso ao dono (Inter 600)
  checklist: 40, // benefícios (Inter 600)
  preco: 44, // "A partir de R$ 189/mês" (Montserrat 700)
  subtitulo: 30, // "Toque em Enviar mensagem..." (Inter 500)
  logo: 120,
};

export const raio = { balao: 28, chip: 999, preco: 28 };

export const sombra = {
  balao: "0 8px 24px rgba(0,0,0,0.12)",
  celular: "0 40px 90px rgba(0,0,0,0.45)",
};

// Cor do título e do destaque conforme o fundo
export const tons = {
  escuro: { texto: cores.branco, destaque: cores.amarelo },
  claro: { texto: cores.texto, destaque: cores.marca },
};
export type Tom = keyof typeof tons;
