// ============================================================
// TEXTOS E ENQUADRAMENTOS do vídeo "Treino de segunda".
// [colchetes] marcam a palavra em verde-limão.
// Os cortes e os momentos (em frames) ficam em edl.ts (gerado).
// ============================================================

export const textos = {
  // Gancho: já aparece completo no frame 0 (capa)
  titulo: ["O MELHOR TREINO", "[PRA SEGUNDA-FEIRA]"],
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

// Enquadramento de cada clipe (nome do clipe em edl.ts).
// z: zoom (1 = altura inteira do vídeo original). x: desloca o rosto na
// horizontal (px). Durante o clipe a câmera ainda avança 2,5% devagar.
// soco: entra com um zoom rápido (ênfase).
export type Enquadramento = { z: number; x?: number; soco?: boolean };

export const ENQUADRAMENTO: Record<string, Enquadramento> = {
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
