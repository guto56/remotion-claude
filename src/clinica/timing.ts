// ============================================================
// TEMPOS do anúncio "Clínica" (30 fps). Frames absolutos do vídeo.
// ============================================================

export const FPS = 30;
export const DURACAO = 660; // 22 s

export const CENAS = {
  gancho: 0, // 1: gancho (0–60)
  dor: 60, // 2: dor (60–150)
  virada: 150, // 3: virada (150–195)
  demo: 195, // 4: demonstração (195–465)
  beneficios: 465, // 5: benefícios (465–570)
  chamada: 570, // 6: chamada (570–660)
  fim: 660,
};

// Transições (a cena que entra começa no frame da tabela acima; a que sai
// continua por baixo durante a transição)
export const TRANSICAO = {
  virada: 20, // círculo verde (clip-path)
  demoParaBeneficios: 12, // slide da direita
  beneficiosParaChamada: 12, // wipe de baixo
};

export const MOVIMENTO = {
  mola: { damping: 14, mass: 0.6 }, // entradas
  saida: 8, // frames das saídas
  palavra: 3, // stagger dos títulos, palavra por palavra
  digitando: 12, // "digitando..." antes de cada balão da assistente
  zoomCelular: 0.04, // zoom contínuo do celular em cada cena
};

// Cena 1
export const GANCHO = {
  titulo: 2, // "Sua recepção não dá conta do WhatsApp?"
  tituloSai: 58,
  notificacoes: [6, 16, 26, 36], // uma a cada 10 frames
  vibra: 6, // frames de vibração a cada notificação
};

// Cena 2
export const DOR = {
  cinza: [60, 72], // notificações ficam cinza
  encolhe: 60, // celular vai para 80%
  relogio: [72, 112], // 16:42 -> 17:20
  titulo1: [65, 97], // "...e o cliente sem resposta." (entra, começa a sair)
  titulo2: 105, // "Ele marca com outro."
};

// Cena 3 (a virada continua no topo enquanto o celular da cena 4 entra)
export const VIRADA = {
  titulo: 158, // entra durante o círculo
  sobe: 195, // encolhe e sobe para o topo, junto com o celular
  sai: 221, // sai antes da etiqueta "Respondeu em 3 segundos"
};

// Cena 4
export const DEMO = {
  entraCelular: 195,
  // cliente, assistente, cliente, assistente. A espera entre a 1ª resposta e o
  // cliente seguinte é maior que 25 frames para dar tempo de ler a resposta.
  mensagens: [205, 229, 300, 324],
  etiqueta: 229, // junto com a 1ª resposta
  aviso: 430, // aviso ao dono desce do topo do celular
};

// Cena 5 (frames dentro da cena)
export const BENEFICIOS = { titulo: 6, itens: 18, intervalo: 18 };

// Cena 6 (frames dentro da cena). A partir de `parado` nada mais se mexe
// (últimos 15 frames, para o loop do Reels não cortar o texto).
export const CHAMADA = { logo: 2, titulo: 8, preco: 26, sub: 38, seta: 48, parado: 75 };

// Locução (voz Felipe, Cartesia): [id do arquivo em public/clinica/voz/,
// frame em que começa, duração em frames]. As durações vêm de
// scripts/gerar-voz.py; se gerar de novo, atualize aqui e confira que uma fala
// não encosta na outra.
export const VOZ: [string, number, number][] = [
  ["gancho", 4, 46], // cena 1 (até 50; o título sai no 58)
  ["dor", 64, 82], // cena 2 (até 146)
  ["virada", 156, 56], // cena 3 (até 212; o título sai no 221)
  ["demo", 234, 127], // cena 4, com a 1ª resposta (até 361)
  ["aviso", 432, 28], // aviso ao dono (até 460)
  ["beneficios", 472, 75], // cena 5 (até 547)
  ["cta", 576, 53], // cena 6 (até 629, antes dos 15 frames parados)
];
