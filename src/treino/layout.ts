// ============================================================
// POSIÇÕES do vídeo "Treino de segunda" (1080x1920, Reels).
// ============================================================

export const W = 1080;
export const H = 1920;

// Tudo que importa fica entre y=260 e y=1240, a 64 px das laterais
export const SAFE = { top: 260, bottom: 1240, side: 64 };

// Topo dos textos que ficam sobre o vídeo (gancho, legendas, "PEITO")
export const TEXTO_TOPO = 292;

// Rosto no vídeo original (fração da largura/altura): usado para centralizar
export const ROSTO = { x: 0.458, olhos: 0.537 };
export const OLHOS_Y = 820; // altura dos olhos na tela quando há zoom (o mais alto possível)

// Quando o vídeo vira um card de lado (para abrir espaço aos gráficos)
export const PLANO = {
  escala: 0.46, // 1080x1920 -> 497x883
  centroY: 750, // meio da área segura
  esquerdaX: 304, // card à esquerda (cena "O importante")
  direitaX: 776, // card à direita (ficha do treino)
  giro: 10, // graus de rotateY
  raio: 88, // cantos arredondados (antes da escala)
};

// Colunas dos gráficos ao lado do vídeo
export const COLUNA = {
  importante: { left: 590, width: 426 },
  ficha: { left: 64, width: 426 },
};

// Final: ficha centralizada e a chamada embaixo
export const FINAL = { fichaEscala: 1.28, fichaSobe: -100, ctaTop: 1040 };
