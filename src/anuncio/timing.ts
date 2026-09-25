// ============================================================
// TEMPOS (em frames; 30 frames = 1 segundo)
//
// SCENES = frame absoluto em que cada cena começa no vídeo.
// Os tempos dentro de cada cena são RELATIVOS ao início dela
// (ex.: DOR.titulo2 = 60 -> 75 + 60 = frame 135 do vídeo).
// ============================================================

export const FPS = 30;

export const SCENES = {
  gancho: 0, // Cena 1 (0 a 2,5 s)
  dor: 75, // Cena 2 (2,5 a 6 s)
  dado: 180, // Cena 3 (6 a 9 s)
  virada: 270, // Cena 4 (9 a 10,5 s)
  demo: 315, // Cena 5 (10,5 a 22 s)
  beneficios: 660, // Cena 6 (22 a 25,5 s)
  cta: 765, // Cena 7 (25,5 a 30 s)
  fim: 900, // duração total
};

// Duração das transições entre blocos de cenas.
export const TRANSITIONS = {
  noiteParaDado: 12, // fade (cena 2 -> 3)
  circulo: 20, // círculo verde que revela o fundo claro (cena 3 -> 4)
  paraCta: 15, // slide de baixo pra cima (cena 6 -> 7)
};

// Estilo de animação
export const MOTION = {
  spring: { damping: 14, mass: 0.6 }, // entradas
  exitFrames: 8, // saídas
  wordStagger: 3, // atraso entre palavras dos títulos
  typingFrames: 18, // "digitando..." antes de cada mensagem da assistente
  messageGrowFrames: 10, // rolagem suave do chat quando entra mensagem
  chipFrames: 60, // quanto tempo cada pílula fica na tela (2 s)
  phoneZoom: 0.04, // zoom contínuo do celular (1 -> 1.04)
};

// Cena 1: relativo a SCENES.gancho
export const GANCHO = {
  titulo: -6, // negativo = a primeira palavra já aparece no frame 0
  tituloSai: 68,
  primeiraNotificacao: -3, // negativo = já está entrando no frame 0
  notificacaoACada: 8,
  notificacoes: 7, // o badge conta até esse número
  maxVisiveis: 5,
  vibracao: 6, // frames de vibração por notificação
};

// Cena 2: relativo a SCENES.dor
export const DOR = {
  encolhe: 0, // celular vai para 80% e notificações ficam cinza
  relogioInicio: 4, // relógio 23:41 -> 08:30
  relogioFim: 48,
  mensagem: 30, // balão do paciente sem resposta
  titulo1: 15, // "Quando você responde de manhã..."
  titulo1Sai: 52,
  titulo2: 60, // "...ele já marcou na concorrente."
};

// Cena 3: relativo a SCENES.dado
export const DADO = {
  contagemFim: 45, // número termina de contar (1 -> 21)
  texto: 14,
  fonte: 34,
};

// Cena 4: relativo a SCENES.virada (o círculo roda nos primeiros frames)
export const VIRADA = {
  titulo: 6,
};

// Cena 5: relativo a SCENES.demo
export const DEMO = {
  tituloSai: 8, // título da cena 4 sobe e some
  celularEntra: 8,
  // Frame em que cada mensagem de copy.chat.mensagens aparece.
  // Mensagens da assistente mostram "digitando..." nos 18 frames anteriores.
  mensagens: [30, 64, 130, 164, 236, 270],
  // Índice da mensagem que dispara cada pílula
  chipResposta: 1,
  chipAgenda: 3,
  chipAgendou: 5,
  brilhoConfirmacao: 292, // pulso na borda do balão de confirmação
};

// Cena 6: relativo a SCENES.beneficios
export const BENEFICIOS = {
  celularSai: 0,
  titulo: 4,
  itens: [22, 34, 46], // um a cada 12 frames
  pulso: 70, // os checks dão um "pulo" em sequência (mantém a tela viva)
};

// Cena 7: relativo a SCENES.cta
export const CTA = {
  logo: 4,
  empresa: 10,
  titulo: 16,
  chamada: 34,
  subtexto: 50,
  seta: 60,
};
