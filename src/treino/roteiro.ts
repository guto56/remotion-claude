// ============================================================
// TEXTOS E ENQUADRAMENTOS do vídeo "Treino de segunda".
// [colchetes] marcam a palavra em verde-limão.
// Os cortes e os momentos (em frames) ficam em edl.ts (gerado).
// ============================================================

export const textos = {
  // Gancho: já aparece completo no frame 0 (capa). Uma versão por formato.
  titulo: {
    reels: ["O MELHOR TREINO", "[PRA SEGUNDA-FEIRA]"],
    youtube: ["O MELHOR", "TREINO PRA", "[SEGUNDA-FEIRA]"],
  },
  semana: ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"],
  diaDestaque: 1,
  importante: {
    rotulo: "O IMPORTANTE",
    frase: "é começar com um treino que...",
    itens: ["NÃO DESGASTA\nO CORPO", "AQUECE BEM"],
  },
  palavraGigante: "PEITO",
  palavraDupla: ["PEITO", "+ TRÍCEPS"],
  ficha: {
    rotulo: "TREINO DE SEGUNDA",
    titulo: "PEITO + [TRÍCEPS]",
    crucifixo: "CRUCIFIXO",
    aquecimento: "AQUECIMENTO",
    tres: "+3 EXERCÍCIOS",
    supino: "SUPINO",
    triceps: "TRÍCEPS",
    finalizacao: "FINALIZAÇÃO",
  },
  cta: "SALVA ESSE TREINO",
  ctaSub: "pra sua próxima segunda",
};

// Enquadramento de cada clipe (nome do clipe em edl.ts), por formato.
// z: zoom (1 = altura inteira do vídeo original). x: desloca o rosto na
// horizontal a partir do centro da tela (px). Durante o clipe a câmera ainda
// avança 2,5% devagar.
// soco: entra com um zoom rápido (ênfase).
// vem + suave: em vez de cortar seco, a câmera sai de `vem` e desliza até o
// enquadramento em `suave` frames (mudança de ângulo).
type Quadro = { z: number; x?: number };
export type Enquadramento = Quadro & { soco?: boolean; vem?: Quadro; suave?: number };

const reels: Record<string, Enquadramento> = {
  hoje: { z: 1.0 },
  falar: { z: 1.12, x: -24 },
  academia: { z: 1.0, x: 20 },
  nas: { z: 1.1 },
  segunda: { z: 1.22, soco: true },
  importante: { z: 1.0 },
  aquecer: { z: 1.1 },
  gosto: { z: 1.0, x: -30 },
  amanha: { z: 1.12, x: 24 },
  faco: { z: 1.0 },
  peito: { z: 1.24, soco: true },
  triceps: { z: 1.1, x: -18, soco: true },
  crucifixo: { z: 1.0 },
  tres: { z: 1.1 },
  supino: { z: 1.2 },
  deles: { z: 1.04 },
  completo: { z: 1.12 },
  final: { z: 1.05 },
};

// 16:9: o vídeo original já é 16:9 em 4K, então dá para fechar até ~1,9x.
// Rosto à direita (x > 0) quando o texto fica à esquerda, e vice-versa.
const youtube: Record<string, Enquadramento> = {
  hoje: { z: 1.5, x: 340 },
  falar: { z: 1.64, x: 300 },
  academia: { z: 1.5, x: 340 },
  nas: { z: 1.2 },
  segunda: { z: 1.5, soco: true },
  importante: { z: 1.3, x: -340, vem: { z: 1.5 }, suave: 18 },
  aquecer: { z: 1.44, x: -320 },
  gosto: { z: 1.16, vem: { z: 1.44, x: -320 }, suave: 14 },
  amanha: { z: 1.4, x: 20 },
  faco: { z: 1.2 },
  peito: { z: 1.85, x: 300, soco: true },
  triceps: { z: 1.6, x: 320, soco: true },
  crucifixo: { z: 1.5, x: 350 },
  tres: { z: 1.62, x: 350 },
  supino: { z: 1.76, x: 340, soco: true },
  deles: { z: 1.55, x: 350 },
  completo: { z: 1.68, x: 340 },
  final: { z: 1.5, x: 350 },
};

export const ENQUADRAMENTO = { reels, youtube };
