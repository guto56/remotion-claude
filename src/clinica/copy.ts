// ============================================================
// TEXTOS DO ANÚNCIO "CLÍNICA": edite aqui sem mexer no resto do código.
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
  chip: "CLÍNICA E CONSULTÓRIO:",
  gancho: "Sua recepção não dá conta do [WhatsApp]?",
  bloqueio: {
    relogio: "21:17",
    // Na cena 2 o relógio avança até aqui (o tempo passa sem resposta).
    // Para deixar parado, use o mesmo valor de `relogio`.
    relogioAte: "22:05",
    data: "terça-feira, 13 de outubro",
    notificacao: "Nova mensagem",
    quando: "agora",
    previas: ["Vocês atendem amanhã?", "Quanto é a avaliação?", "Aceita convênio?", "Oi, alguém pode me responder?"],
  },

  // Cena 2: dor
  dor1: "Paciente [sem resposta] à noite...",
  dor2: "...marca em [outra clínica].", // destaque em vermelho, com tremida

  // Cena 3: virada
  virada: "Agora quem responde é a sua [assistente].",

  // Cena 4: demonstração
  etiqueta: "Respondeu em 3 segundos",
  negocio: "Clínica Sorriso",
  status: "online",
  placeholder: "Mensagem",
  mensagens: [
    { de: "cliente", texto: "Boa noite, quanto é a avaliação? Aceita convênio?", hora: "21:17" },
    {
      de: "assistente",
      texto: "Boa noite! 😊 A *avaliação é gratuita* e aceitamos *convênio*. Tenho:\n• *amanhã, 09:00*\n• *amanhã, 14:30*\nQual prefere?",
      hora: "21:17",
    },
    { de: "cliente", texto: "14:30", hora: "21:18" },
    {
      de: "assistente",
      texto: "Perfeito! ✅ *Avaliação* amanhã às *14:30*. Te mando um lembrete antes do horário.",
      hora: "21:18",
      confirma: true,
    },
  ] as Mensagem[],
  aviso: {
    titulo: "📅 Novo agendamento",
    detalhe: "Avaliação · amanhã 14:30",
  },

  // Cena 5: benefícios
  beneficiosTitulo: "Enquanto você atende, [ela]:",
  beneficios: [
    "Responde na hora, até de madrugada",
    "Tira dúvidas de preço e convênio",
    "Agenda e confirma o horário",
    "Lembra o paciente (menos faltas)",
  ],

  // Cena 6: chamada
  cta: "Veja funcionando [agora] no WhatsApp",
  preco: "A partir de R$ 189/mês",
  ctaSub: "Toque em Enviar mensagem e teste você mesmo",

  // Locução (voz Felipe, Cartesia). Mudar aqui não muda o som: é preciso
  // gerar a fala de novo (python3 scripts/gerar-voz.py clinica).
  // Momentos em timing.ts (VOZ).
  locucao: {
    gancho: "Sua recepção não dá conta do WhatsApp?",
    dor: "O paciente fica sem resposta e marca em outra clínica.",
    virada: "Agora quem responde é a sua assistente.",
    demo: "Ela responde em segundos, tira a dúvida do convênio e já agenda a avaliação.",
    aviso: "E te avisa na hora.",
    beneficios: "Enquanto você atende, ela cuida do WhatsApp.",
    cta: "Toque em enviar mensagem e teste agora.",
  },
};
