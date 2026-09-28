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
  notificacoes: 262, // abaixo do relógio; a 4ª termina em y≈1212 no Reels
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
  chipDonoTop: number;
  tituloNoiteTop: number;
  tituloTamanho: number;
  celularNoite: { top: number; escala: number };
  // Cena 3
  dado: { numeroTop: number; textoTop: number; fonteTop: number };
  // Cena 4
  viradaCentroY: number;
  // Cena 5
  chipDemoTop: number;
  celularDemo: { top: number; escala: number };
  // Cena 6
  beneficios: { tituloTop: number; itensTop: number; itemEspaco: number };
  // Cena 7
  chamada: { logoTop: number; tituloTop: number; subTop: number; setaTop: number };
};

// Reels: tudo que importa entre y=260 e y=1240, a 64 px das laterais. A parte
// de baixo do celular (tela vazia / campo de digitar) entra na faixa coberta:
// é só decoração.
const reels: Layout = {
  largura: 1080,
  altura: 1920,
  lado: 64,
  faixas: { topo: 250, base: 1250 },
  chipDonoTop: 282,
  tituloNoiteTop: 372,
  tituloTamanho: 80, // 2 linhas terminam em y≈540, antes do celular (560)
  celularNoite: { top: 560, escala: 1 },
  dado: { numeroTop: 380, textoTop: 700, fonteTop: 960 },
  viradaCentroY: 750,
  chipDemoTop: 296,
  // o fim da área das mensagens fica em y ≈ 1238
  celularDemo: { top: 410, escala: 1 },
  beneficios: { tituloTop: 300, itensTop: 560, itemEspaco: 150 },
  chamada: { logoTop: 290, tituloTop: 500, subTop: 740, setaTop: 1040 },
};

// Feed: não há interface por cima; celular menor e títulos acima dele.
const feed: Layout = {
  largura: 1080,
  altura: 1350,
  lado: 64,
  faixas: null,
  chipDonoTop: 64,
  tituloNoiteTop: 150,
  tituloTamanho: 76,
  celularNoite: { top: 340, escala: 0.8 },
  dado: { numeroTop: 190, textoTop: 500, fonteTop: 760 },
  viradaCentroY: 640,
  chipDemoTop: 64,
  celularDemo: { top: 176, escala: 0.86 },
  beneficios: { tituloTop: 110, itensTop: 360, itemEspaco: 140 },
  chamada: { logoTop: 150, tituloTop: 350, subTop: 600, setaTop: 1000 },
};

export const getLayout = (formato: Formato): Layout => (formato === "feed" ? feed : reels);
