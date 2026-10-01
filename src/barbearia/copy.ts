// ============================================================
// TEXTOS DO ANÚNCIO "BARBEARIA": edite aqui sem mexer no resto do código.
//
// Nos títulos, [colchetes] marcam a palavra destacada:
//   "Ele marca com [outro]."  -> "outro" destacado
// Nas mensagens, *asteriscos* viram negrito (sem aparecer os asteriscos)
// e \n quebra a linha.
// ============================================================

export type Mensagem = {
  de: "cliente" | "assistente";
  texto: string;
  hora: string;
  confirma?: boolean; // borda verde (balão de confirmação)
};

export const copy = {
  // Cena 1: gancho
  chip: "BARBEARIA E SALÃO:",
  gancho: "Você com a [tesoura] na mão...",
  bloqueio: {
    relogio: "16:42",
    // Na cena 2 o relógio avança até aqui (o tempo passa sem resposta).
    // Para deixar parado, use o mesmo valor de `relogio`.
    relogioAte: "17:20",
    data: "sábado, 10 de outubro",
    notificacao: "Nova mensagem",
    quando: "agora",
    previas: ["Tem horário hoje?", "Quanto tá corte e barba?", "Dá pra encaixar às 18h?", "Oi?? Alguém aí?"],
  },

  // Cena 2: dor
  dor1: "...e o cliente [sem resposta].",
  dor2: "Ele marca com [outro].", // destaque em vermelho, com tremida

  // Cena 3: virada
  virada: "Agora quem responde é a sua [assistente].",

  // Cena 4: demonstração
  etiqueta: "Respondeu em 3 segundos",
  negocio: "Barbearia do Pedro",
  status: "online",
  placeholder: "Mensagem",
  mensagens: [
    { de: "cliente", texto: "Oi, tem horário hoje pra corte e barba?", hora: "16:42" },
    {
      de: "assistente",
      texto: "Oi! Tem sim 😊 Corte e barba fica *R$ 70* (1h). Hoje tenho:\n• *17:30*\n• *19:00*\nPrefere algum barbeiro?",
      hora: "16:42",
    },
    { de: "cliente", texto: "17:30 com o Pedro", hora: "16:43" },
    {
      de: "assistente",
      texto: "Fechado! ✅ *Corte e barba* com *Pedro*, hoje às *17:30*. Te mando um lembrete antes do horário.",
      hora: "16:43",
      confirma: true,
    },
  ] as Mensagem[],
  aviso: {
    titulo: "📅 Novo agendamento",
    detalhe: "Corte e barba · Pedro · hoje 17:30",
  },

  // Cena 5: benefícios
  beneficiosTitulo: "Enquanto você corta, [ela]:",
  beneficios: [
    "Responde na hora, 24h por dia",
    "Agenda com o profissional livre",
    "Lembra o cliente antes do horário",
    "Te avisa a cada agendamento",
  ],

  // Cena 6: chamada
  cta: "Veja funcionando [agora] no WhatsApp",
  preco: "A partir de R$ 189/mês",
  ctaSub: "Toque em Enviar mensagem e teste você mesmo",

  // Locução (voz Felipe, Cartesia). Mudar aqui não muda o som: é preciso
  // gerar a fala de novo (python3 scripts/gerar-voz.py barbearia).
  // Momentos em timing.ts (VOZ).
  locucao: {
    gancho: "Você, com a tesoura na mão...",
    dor: "E o cliente, sem resposta, marca com outro.",
    virada: "Agora quem responde é a sua assistente.",
    demo: "Ela responde em segundos, mostra os horários e já agenda com o barbeiro.",
    aviso: "E te avisa na hora.",
    beneficios: "Enquanto você corta, ela atende vinte e quatro horas.",
    cta: "Toque em enviar mensagem e teste agora.",
  },
};
