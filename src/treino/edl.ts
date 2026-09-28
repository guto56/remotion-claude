// GERADO por scripts/treino/preparar.py: não edite à mão.
// Cortes do vídeo original (public/treino/video.mp4) e momentos-chave, em frames.

export const FPS = 30;
export const DURACAO = 958;

export type Clipe = { nome: string; de: number; frames: number; trimBefore: number; rate: number };

export const CLIPES: Clipe[] = [
  { nome: "hoje", de: 0, frames: 22, trimBefore: 36, rate: 1.1 },
  { nome: "falar", de: 22, frames: 25, trimBefore: 66, rate: 1.1 },
  { nome: "academia", de: 47, frames: 83, trimBefore: 105, rate: 1.1 },
  { nome: "nas", de: 130, frames: 15, trimBefore: 206, rate: 1.1 },
  { nome: "segunda", de: 145, frames: 22, trimBefore: 232, rate: 1.1 },
  { nome: "importante", de: 167, frames: 134, trimBefore: 284, rate: 1.1 },
  { nome: "aquecer", de: 301, frames: 66, trimBefore: 454, rate: 1.1 },
  { nome: "gosto", de: 367, frames: 68, trimBefore: 548, rate: 1.1 },
  { nome: "amanha", de: 435, frames: 38, trimBefore: 635, rate: 1.1 },
  { nome: "faco", de: 473, frames: 35, trimBefore: 704, rate: 1.1 },
  { nome: "peito", de: 508, frames: 21, trimBefore: 835, rate: 1.1 },
  { nome: "triceps", de: 529, frames: 35, trimBefore: 918, rate: 1.1 },
  { nome: "crucifixo", de: 564, frames: 109, trimBefore: 1055, rate: 1.1 },
  { nome: "tres", de: 673, frames: 90, trimBefore: 1232, rate: 1.1 },
  { nome: "supino", de: 763, frames: 34, trimBefore: 1362, rate: 1.1 },
  { nome: "deles", de: 797, frames: 20, trimBefore: 1446, rate: 1.1 },
  { nome: "completo", de: 817, frames: 51, trimBefore: 1501, rate: 1.1 },
  { nome: "final", de: 868, frames: 90, trimBefore: 1557, rate: 0.55 },
];

// Frame em que cada clipe começa, pelo nome.
export const INICIO = {
  hoje: 0,
  falar: 22,
  academia: 47,
  nas: 130,
  segunda: 145,
  importante: 167,
  aquecer: 301,
  gosto: 367,
  amanha: 435,
  faco: 473,
  peito: 508,
  triceps: 529,
  crucifixo: 564,
  tres: 673,
  supino: 763,
  deles: 797,
  completo: 817,
  final: 868,
} as const;

// Frame em que cada palavra-chave é dita.
export const MOMENTO = {
  segunda: 149,
  importante: 170,
  desgaste: 252,
  aquecer: 344,
  peito: 511,
  triceps: 531,
  aquecerPeito: 589,
  crucifixo: 649,
  tres: 733,
  supino: 775,
  completoTriceps: 852,
} as const;

// Legendas: [palavra, frame]. [colchetes] = destaque.
export const LEGENDA = {
  gosto: [["EU", 384], ["GOSTO", 388], ["DE", 397], ["TREINAR", 400], ["NA", 413], ["[SEGUNDA]", 420]] as [string, number][],
  amanha: [["É", 439], ["O", 442], ["QUE", 443], ["EU", 445], ["VOU", 447], ["TREINAR", 451], ["[AMANHÃ]", 459]] as [string, number][],
  faco: [["EU", 475], ["FAÇO...", 485]] as [string, number][],
};
