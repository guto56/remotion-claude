// ============================================================
// POSIÇÕES por formato (em px do vídeo).
// "reels" = 1080x1920 (9:16) | "feed" = 1080x1350 (4:5)
// ============================================================

export type Formato = "reels" | "feed";

// Geometria interna do celular (sempre desenhado em 560x1000 e escalado).
export const PHONE = {
  width: 560,
  height: 1000,
  bezel: 14,
  bodyRadius: 76,
  screenRadius: 62,
  statusBar: 54,
  // tela de bloqueio (coordenadas dentro da tela)
  lockIconTop: 62,
  lockClockTop: 104,
  notifTop: 264,
  notifHeight: 70,
  notifGap: 8,
  // conversa (coordenadas dentro da tela)
  chatHeader: 110,
  chatInput: 90,
  homeIndicator: 36,
};

export type Layout = {
  width: number;
  height: number;
  // Área onde fica tudo que importa.
  safe: { top: number; bottom: number; side: number };
  // Faixas vermelhas do showSafeZone (0 = não desenha).
  overlay: { top: number; bottom: number };
  headlineTop: number; // títulos no topo (cenas 1 e 2)
  headlineSize: number;
  night: {
    phoneTop: number;
    phoneScale: number;
    shrinkTo: number; // cena 2: celular diminui para 80%
    bubbleTop: number; // balão "sem resposta" da cena 2
  };
  demo: { phoneTop: number; phoneScale: number; chipTop: number };
  benefits: { titleTop: number; listTop: number };
  cta: {
    logoTop: number;
    nameTop: number;
    titleTop: number;
    lineTop: number;
    subTop: number;
    arrowTop: number;
  };
};

const reels: Layout = {
  width: 1080,
  height: 1920,
  safe: { top: 260, bottom: 1240, side: 64 },
  overlay: { top: 250, bottom: 670 },
  headlineTop: 276,
  headlineSize: 80, // 3 linhas de 80 px terminam em y≈528, antes do celular (560)
  night: { phoneTop: 560, phoneScale: 1, shrinkTo: 0.8, bubbleTop: 1112 },
  // A parte de baixo do celular (campo de digitar) entra na faixa coberta:
  // é só decoração, as mensagens terminam antes de y=1240.
  demo: { phoneTop: 364, phoneScale: 1, chipTop: 264 },
  benefits: { titleTop: 276, listTop: 650 },
  cta: {
    logoTop: 290,
    nameTop: 486,
    titleTop: 580,
    lineTop: 800,
    subTop: 950,
    arrowTop: 1090, // centro da seta em y≈1150
  },
};

// No feed não há interface por cima do vídeo: só as margens laterais.
const feed: Layout = {
  width: 1080,
  height: 1350,
  safe: { top: 64, bottom: 1286, side: 64 },
  overlay: { top: 0, bottom: 0 },
  headlineTop: 72,
  headlineSize: 76,
  night: { phoneTop: 340, phoneScale: 0.9, shrinkTo: 0.8, bubbleTop: 838 },
  demo: { phoneTop: 170, phoneScale: 0.95, chipTop: 70 },
  benefits: { titleTop: 300, listTop: 570 }, // centralizado (sem celular)
  cta: {
    logoTop: 120,
    nameTop: 316,
    titleTop: 410,
    lineTop: 630,
    subTop: 780,
    arrowTop: 1040,
  },
};

export const getLayout = (formato: Formato): Layout =>
  formato === "feed" ? feed : reels;
