import { fontFamilies } from "./fonts";

// ============================================================
// IDENTIDADE VISUAL: mude aqui cores, fontes e tamanhos.
// ============================================================

export const colors = {
  brand: "#0F766E", // verde marca
  brandLight: "#14B8A6", // fim do degradê do banner da empresa
  night: "#0B1F1D", // verde escuro (fundo noturno)
  mint: "#DCF5EE", // balão enviado pela assistente
  light: "#F5FBF9", // fundo claro
  white: "#FFFFFF",
  text: "#111827", // texto escuro
  textMuted: "#6B7280", // cinza texto secundário
  clientBubble: "#FFFFFF", // balão do cliente
  clientBorder: "#E5E7EB", // borda do balão do cliente
  yellow: "#FFD400", // destaque
  red: "#EF4444", // dor / badge
  chatBackground: "#EAF2EF", // fundo da conversa dentro do celular
  lockScreenTop: "#17332F", // papel de parede da tela de bloqueio
  lockScreenBottom: "#081412",
  phoneBody: "#050908",
};

export const fonts = {
  title: fontFamilies.title, // Montserrat 800/700
  ui: fontFamilies.ui, // Inter 400/500/600/700
};

export const type = {
  headline: 84, // títulos (76 a 92)
  headlineLineHeight: 1.05,
  ctaTitle: 88,
  chat: 34, // texto da conversa
  chatTime: 22, // horário dentro do balão
  chip: 34,
  checklist: 48,
  statNumber: 260,
  statText: 56,
  statSource: 28,
};

export const radius = {
  bubble: 28,
  chip: 999,
};

export const shadow = {
  soft: "0 8px 24px rgba(0,0,0,0.12)",
  phone: "0 40px 90px rgba(0,0,0,0.45)",
};

// Cor do título e do destaque conforme o fundo.
export const headlineTones = {
  dark: { text: colors.white, highlight: colors.yellow }, // fundo escuro
  light: { text: colors.text, highlight: colors.brand }, // fundo claro
};
