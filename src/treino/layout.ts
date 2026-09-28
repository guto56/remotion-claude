// ============================================================
// POSIÇÕES do vídeo "Treino de segunda", por formato.
// "reels" = 1080x1920 (9:16) | "youtube" = 1920x1080 (16:9)
// ============================================================

export type Formato = "reels" | "youtube";

type Caixa = { left: number; width: number; top: number; height: number };

export type LayoutTreino = {
  width: number;
  height: number;
  // Olhos na tela quando há zoom (o enquadramento de cada corte fica em roteiro.ts)
  olhosY: number;
  // reels: o vídeo encolhe e vira um card de lado (3D).
  // youtube: a câmera reenquadra (rosto num terço) e escurece a lateral.
  cardLateral: boolean;
  titulo: Caixa & { alinhar: "center" | "left"; meio: boolean; tamanho: number };
  semana: { top: number; escala: number };
  legenda: { top: number; lado: number; tamanho: number };
  // Palavra gigante: "linha" = PEITO + TRÍCEPS lado a lado; "pilha" = um embaixo do outro
  palavra: { top: number; left: number; right: number; pilha: boolean; gigante: number; dupla: number };
  // escala: aumenta o bloco inteiro (16:9); origem: ponto fixo da escala
  importante: Caixa & { escala: number };
  ficha: Caixa & { escala: number; origem: string };
  // Final: quanto a ficha anda/cresce e onde fica a chamada
  final: { fichaDx: number; fichaDy: number; fichaEscala: number; cta: Caixa };
};

// Reels: tudo que importa entre y=260 e y=1240, a 64 px das laterais
const reels: LayoutTreino = {
  width: 1080,
  height: 1920,
  olhosY: 820,
  cardLateral: true,
  titulo: { left: 64, width: 952, top: 292, height: 260, alinhar: "center", meio: false, tamanho: 104 },
  semana: { top: 312, escala: 1 },
  legenda: { top: 302, lado: 64, tamanho: 86 },
  palavra: { top: 286, left: 0, right: 0, pilha: false, gigante: 250, dupla: 118 },
  importante: { left: 590, width: 426, top: 260, height: 980, escala: 1 },
  ficha: { left: 64, width: 426, top: 260, height: 980, escala: 1, origem: "center" },
  // ficha vai para o centro (540 - centro da coluna) e cresce
  final: { fichaDx: 540 - (64 + 426 / 2), fichaDy: -100, fichaEscala: 1.28, cta: { left: 0, width: 1080, top: 1040, height: 200 } },
};

// YouTube: margens de ~110 px; legendas no terço de baixo
const youtube: LayoutTreino = {
  width: 1920,
  height: 1080,
  olhosY: 470,
  cardLateral: false,
  titulo: { left: 110, width: 800, top: 0, height: 1080, alinhar: "left", meio: true, tamanho: 132 },
  semana: { top: 870, escala: 1.25 },
  legenda: { top: 846, lado: 200, tamanho: 84 },
  palavra: { top: 300, left: 110, right: 1000, pilha: true, gigante: 300, dupla: 150 },
  importante: { left: 1060, width: 620, top: 0, height: 1080, escala: 1.2 },
  ficha: { left: 110, width: 600, top: 0, height: 1080, escala: 1.2, origem: "left center" },
  // ficha fica onde está; a chamada entra no lugar do rosto
  final: { fichaDx: 0, fichaDy: 0, fichaEscala: 1, cta: { left: 900, width: 910, top: 0, height: 1080 } },
};

export const getLayoutTreino = (formato: Formato): LayoutTreino =>
  formato === "youtube" ? youtube : reels;

// Rosto no vídeo original (fração da largura/altura): usado para centralizar
export const ROSTO = { x: 0.458, olhos: 0.537 };

// Reels: quando o vídeo vira um card de lado (para abrir espaço aos gráficos)
export const PLANO = {
  escala: 0.46, // 1080x1920 -> 497x883
  centroY: 750, // meio da área segura
  esquerdaX: 304, // card à esquerda (cena "O importante")
  direitaX: 776, // card à direita (ficha do treino)
  giro: 10, // graus de rotateY
  raio: 88, // cantos arredondados (antes da escala)
};
