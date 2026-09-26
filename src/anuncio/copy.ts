// ============================================================
// TEXTOS DO ANÚNCIO: edite aqui sem mexer no resto do código.
//
// Nos títulos, [colchetes] marcam a palavra destacada:
//   "Seu cliente chamou às [23h]."  -> "23h" em amarelo/verde
// Nas mensagens do chat, *asteriscos* viram negrito (como no WhatsApp)
// e \n quebra a linha (\n\n = novo parágrafo).
// ============================================================

export const copy = {
  // Cena 1: gancho. Cada composição usa um deles.
  gancho: {
    dor: "Seu cliente chamou às [23h].",
    pergunta: "Quanto tempo seu negócio [demora] pra responder?",
  },

  // Cena 1: notificações da tela de bloqueio
  notificacao: {
    titulo: "Nova mensagem",
    quando: "agora",
  },

  // Cena 2: dor
  dor: {
    titulo1: "Quando você responde de manhã...",
    titulo2: "...ele já fechou com a [concorrente].", // destaque em vermelho, com tremida
    mensagemCliente: "Oi, quanto custa?",
    horaMensagem: "23:41",
    relogioDe: "23:41", // relógio da tela de bloqueio avança de...
    relogioAte: "08:30", // ...até
  },

  // Cena 3: dado
  dado: {
    numero: 21, // conta de 1 até este número
    sufixo: "x",
    texto: "mais chance de fechar respondendo em até 5 minutos",
    fonte: "Estudo MIT / InsideSales com 15 mil leads",
  },

  // Cena 4: virada
  virada: {
    titulo: "E se seu negócio respondesse em [3 segundos]?",
  },

  // Cena 5: demonstração
  chat: {
    nomeEmpresa: "Sua Empresa",
    status: "online",
    placeholder: "Mensagem",
    banner: {
      titulo: "Sua Empresa",
      subtitulo: "Atendimento rápido, 24h",
    },
    // "cliente" fica à direita (branco); "assistente" à esquerda (menta).
    // tipo "imagem" = balão com o banner; tipo "confirmacao" = balão com borda verde.
    // Os momentos em que cada uma entra ficam em timing.ts (DEMO.mensagens).
    mensagens: [
      { de: "cliente", texto: "Oi, quanto custa?", hora: "23:41" },
      {
        de: "assistente",
        tipo: "imagem",
        texto:
          "Oi, tudo bem? 😊 Aqui é a Lia, da Sua Empresa. O atendimento é *R$ 180*. Como posso te chamar?",
        hora: "23:41",
      },
      { de: "cliente", texto: "Maria", hora: "23:42" },
      {
        de: "assistente",
        texto:
          "Prazer, Maria! Os horários mais próximos são:\n\n• *Hoje*, às 18:30\n• *Amanhã*, às 09:00\n• *Amanhã*, às 14:30\n\nAlgum desses fica bom?",
        hora: "23:42",
      },
      { de: "cliente", texto: "amanhã 9h", hora: "23:42" },
      {
        de: "assistente",
        tipo: "confirmacao",
        texto:
          "✅ *Horário confirmado!*\n\n📅 *Sexta-feira, 26/09*\n🕐 *09:00*\n\nTe mando um lembrete na véspera 😉",
        hora: "23:42",
      },
    ],
    // Agenda 3D que aparece ao lado do celular (CalendarCard3D)
    // dia = índice em `dias`; horários em "HH:MM" (a grade vai de 08:00 a 20:00)
    agenda: {
      dias: ["Qui", "Sex", "Sáb"],
      datas: ["25", "26", "27"],
      hoje: 0, // "Qui 25" aparece marcado como hoje
      // Horários oferecidos no chat (acendem em sequência)
      livres: [
        { dia: 0, de: "18:30", ate: "19:30" },
        { dia: 1, de: "09:00", ate: "10:00" },
        { dia: 1, de: "14:30", ate: "15:30" },
      ],
      // Blocos cinza, para parecer uma agenda de verdade
      ocupados: [
        { dia: 0, de: "08:00", ate: "09:30" },
        { dia: 0, de: "10:00", ate: "12:00" },
        { dia: 0, de: "13:00", ate: "14:00" },
        { dia: 0, de: "15:30", ate: "17:30" },
        { dia: 1, de: "10:00", ate: "11:30" },
        { dia: 1, de: "12:30", ate: "13:30" },
        { dia: 1, de: "16:00", ate: "18:00" },
        { dia: 2, de: "08:00", ate: "10:00" },
        { dia: 2, de: "10:30", ate: "12:30" },
        { dia: 2, de: "14:00", ate: "15:00" },
      ],
      // Bloco criado quando o horário é confirmado (tem que ser um dos livres)
      evento: { dia: 1, de: "09:00", ate: "10:00", texto: "Maria · 09:00" },
    },
    // Pílulas flutuantes (os ícones ficam em scenes/LightScene.tsx)
    chips: {
      resposta: "Respondeu em 3 segundos",
      agenda: "Horários reais da agenda",
      agendou: "Agendou sozinha",
    },
  },

  // Cena 6: benefícios
  beneficios: {
    titulo: "Enquanto isso, você [só atende].",
    itens: [
      "Responde 24h, 7 dias por semana",
      "Tira dúvidas, qualifica e agenda sozinha",
      "Lembra o cliente e reduz faltas",
    ],
  },

  // Cena 7: chamada final
  cta: {
    empresa: "Corso Automação",
    titulo: "Quer isso no seu negócio?",
    chamada: "Toque em [Enviar mensagem] e teste agora",
    subtexto: "Quem vai te responder é a nossa assistente.",
  },

  // Locução: o que está GRAVADO em public/voz/<id>.mp3 (voz do Cartesia).
  // Mudar aqui não muda o som: é preciso gravar a fala de novo.
  // Atenção: a gravação atual ainda fala "clínica" e "paciente".
  // Os momentos de cada fala ficam em timing.ts (VOZ).
  locucao: {
    "gancho-dor": "Seu paciente te chamou às onze da noite.",
    "gancho-pergunta": "Quanto tempo sua clínica demora pra responder?",
    dor: "De manhã... o paciente já marcou na concorrente.",
    dado: "Cinco minutos fazem toda a diferença.",
    virada: "E se sua clínica respondesse em três segundos?",
    "demo-1": "Ela responde na hora, a qualquer hora.",
    "demo-2": "Mostra os horários reais da sua agenda...",
    "demo-3": "E agenda o paciente sozinha.",
    beneficios: "Enquanto isso, você só atende.",
    cta: "Quer isso na sua clínica? Toque em enviar mensagem.",
  },
} as const;

export type ChatMessage = {
  de: "cliente" | "assistente";
  tipo?: "imagem" | "confirmacao";
  texto: string;
  hora: string;
};
