// ============================================================
// POSIÇÕES por formato (px do vídeo).
// "reels" = 1080x1920 (9:16) | "feed" = 1080x1350 (4:5)
// ============================================================

export type Formato = "reels" | "feed";

// Celular desenhado sempre em 540x960 e escalado.
export const CELULAR = {
  largura: 540,
  altura: 960,
  borda: 14,
  raio: 72,
  raioTela: 58,
  barraStatus: 50,
  cabecalho: 104, // cabeçalho da conversa
  entrada: 86, // campo "Mensagem"
  indicador: 30, // barra de gestos
  // tela de bloqueio (coordenadas dentro da tela)
  cadeado: 64,
  relogio: 90,
  notificacoes: 262, // abaixo do relógio; a 4ª termina em y≈1220 no Reels
  notificacaoAltura: 88,
  notificacaoEspaco: 8,
};

export type Layout = {
  largura: number;
  altura: number;
  lado: number; // margem lateral
  // Faixas cobertas pela interface (desenhadas com showSafeZone)
  faixas: { topo: number; base: number } | null;
  // Cenas 1–2
  chipTop: number;
  tituloNoiteTop: number;
  tituloNoiteTamanho: number;
  celularNoite: { top: number; escala: number };
  // Cena 3: título no meio; na cena 4 ele encolhe e sobe para o topo
  virada: { top: number; topoTop: number; topoEscala: number };
  // Cena 4
  etiquetaTop: number;
  celularDemo: { top: number; escala: number };
  // Cena 5
  beneficios: { tituloTop: number; itensTop: number; itemEspaco: number };
  // Cena 6
  chamada: { logoTop: number; tituloTop: number; precoTop: number; subTop: number; setaTop: number };
};

// Reels: tudo que importa entre y=260 e y=1240, a 64 px das laterais. A parte
// de baixo do celular (tela vazia / campo de digitar) entra na faixa coberta:
// é só decoração.
const reels: Layout = {
  largura: 1080,
  altura: 1920,
  lado: 64,
  faixas: { topo: 250, base: 1250 },
  chipTop: 262, // centro em y≈297
  tituloNoiteTop: 368,
  tituloNoiteTamanho: 80, // 2 linhas terminam em y≈536, antes do celular (560)
  celularNoite: { top: 560, escala: 1 },
  virada: { top: 600, topoTop: 270, topoEscala: 0.5 },
  etiquetaTop: 300,
  // o fim da área das mensagens fica em y≈1238
  celularDemo: { top: 410, escala: 1 },
  beneficios: { tituloTop: 330, itensTop: 600, itemEspaco: 140 },
  // a seta pula 20 px para baixo: no ponto mais baixo termina em y=1200
  chamada: { logoTop: 284, tituloTop: 456, precoTop: 690, subTop: 836, setaTop: 1030 },
};

// Feed: não há interface por cima; celular menor e títulos acima dele.
const feed: Layout = {
  largura: 1080,
  altura: 1350,
  lado: 64,
  faixas: null,
  chipTop: 56,
  tituloNoiteTop: 150,
  tituloNoiteTamanho: 76,
  celularNoite: { top: 340, escala: 0.8 },
  virada: { top: 440, topoTop: 50, topoEscala: 0.45 },
  etiquetaTop: 74,
  celularDemo: { top: 140, escala: 0.94 },
  beneficios: { tituloTop: 210, itensTop: 480, itemEspaco: 140 },
  chamada: { logoTop: 150, tituloTop: 310, precoTop: 540, subTop: 680, setaTop: 880 },
};

export const getLayout = (formato: Formato): Layout => (formato === "feed" ? feed : reels);
