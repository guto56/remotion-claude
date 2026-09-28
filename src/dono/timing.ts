// ============================================================
// TEMPOS do anúncio "Dono" (30 fps). Frames absolutos do vídeo, a não ser
// quando indicado "dentro da cena/conversa".
// ============================================================

export const FPS = 30;
export const DURACAO = 900;

export const CENAS = {
  gancho: 0, // 1: gancho para o dono (0–60)
  dor: 60, // 2: dor (60–165)
  dado: 165, // 3: dado (165–240)
  virada: 240, // 4: virada (240–285)
  demo: 285, // 5: 3 negócios, 3 finais (285–705)
  beneficios: 705, // 6: benefícios (705–795)
  chamada: 795, // 7: chamada (795–900)
  fim: 900,
};

// Transições entre as sequências (a cena que entra começa no frame da tabela
// acima; a que sai continua por baixo durante a transição)
export const TRANSICAO = {
  noiteParaDado: 10, // fade
  virada: 20, // círculo verde (clip-path)
  demoParaBeneficios: 15, // wipe (o celular sai para baixo)
  beneficiosParaChamada: 12, // slide
  conversa: 12, // slide horizontal da tela do celular entre as conversas
};

export const MOVIMENTO = {
  mola: { damping: 14, mass: 0.6 }, // entradas
  saida: 8, // frames das saídas
  palavra: 3, // stagger dos títulos, palavra por palavra
  digitando: 12, // "digitando..." antes de cada balão da assistente
  zoomCelular: 0.04, // zoom contínuo do celular em cada cena
};

// Cena 1 e 2 (frames absolutos)
export const NOITE = {
  titulo: 2, // "Seu cliente chamou às 23h."
  notificacoes: [6, 16, 26, 36], // uma a cada 10 frames
  vibra: 6, // frames de vibração a cada notificação
  cinza: [60, 72], // notificações ficam cinza
  encolhe: 62, // celular vai para 80%
  relogio: [74, 112], // 23:41 -> 08:30
  titulo1: [70, 112], // "Quando você responde de manhã..." (entra, sai)
  titulo2: 115, // "...ele já comprou do concorrente."
};

// Cena 3 (frames absolutos)
export const DADO = {
  contaDe: 170,
  contaAte: 210, // termina no 21x, com pulso
  texto: 184,
  fonte: 200,
};

// Cena 4 (frames absolutos)
export const VIRADA = { titulo: 244, tituloSai: 290 };

// Cena 5: cada conversa dura 140 frames; momentos dentro da conversa
export const CONVERSA = {
  duracao: 140,
  mensagens: [6, 30, 58, 82], // cliente, assistente, cliente, assistente
  aviso: 96, // aviso ao dono desce do topo
  avisoDura: 30,
  entraCelular: 285, // celular sobe (frame absoluto)
};

// Cena 6 (frames dentro da cena)
export const BENEFICIOS = { titulo: 6, itens: 16, intervalo: 15 };

// Cena 7 (frames dentro da cena)
export const CHAMADA = { logo: 2, titulo: 8, sub: 30, seta: 40 };

// Locução: [id do arquivo em public/dono/voz/, frame em que começa]
export const VOZ: [string, number][] = [
  ["gancho", 4],
  ["dor", 72],
  ["dado", 170],
  ["virada", 244],
  ["agenda", 318],
  ["orcamento", 458],
  ["pedido", 598],
  ["beneficios", 712],
  ["cta", 804],
];
