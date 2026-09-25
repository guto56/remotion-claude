// ============================================================
// TEXTOS DO ANÚNCIO: edite aqui sem mexer no resto do código.
//
// Nos títulos, [colchetes] marcam a palavra destacada:
//   "Seu paciente chamou às [23h]."  -> "23h" em amarelo/verde
// Nas mensagens do chat, *asteriscos* viram negrito (como no WhatsApp)
// e \n quebra a linha (\n\n = novo parágrafo).
// ============================================================

export const copy = {
  // Cena 1: gancho. Cada composição usa um deles.
  gancho: {
    dor: "Seu paciente chamou às [23h].",
    pergunta: "Quanto tempo sua clínica [demora] pra responder?",
  },

  // Cena 1: notificações da tela de bloqueio
  notificacao: {
    titulo: "Nova mensagem",
    quando: "agora",
  },

  // Cena 2: dor
  dor: {
    titulo1: "Quando você responde de manhã...",
    titulo2: "...ele já marcou na [concorrente].", // destaque em vermelho, com tremida
    mensagemPaciente: "Oi, quanto custa uma limpeza?",
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
    titulo: "E se sua clínica respondesse em [3 segundos]?",
  },

  // Cena 5: demonstração
  chat: {
    nomeClinica: "Clínica Sorriso",
    status: "online",
    placeholder: "Mensagem",
    banner: {
      titulo: "Clínica Sorriso",
      subtitulo: "Seu sorriso, nosso cuidado",
    },
    // "paciente" fica à direita (branco); "assistente" à esquerda (menta).
    // tipo "imagem" = balão com o banner; tipo "confirmacao" = balão com borda verde.
    // Os momentos em que cada uma entra ficam em timing.ts (DEMO.mensagens).
    mensagens: [
      { de: "paciente", texto: "Oi, quanto custa uma limpeza?", hora: "23:41" },
      {
        de: "assistente",
        tipo: "imagem",
        texto:
          "Oi, tudo bem? 😊 Aqui é a Lia, da Clínica Sorriso. A limpeza é *R$ 180*. Como posso te chamar?",
        hora: "23:41",
      },
      { de: "paciente", texto: "Maria", hora: "23:42" },
      {
        de: "assistente",
        texto:
          "Prazer, Maria! Os horários mais próximos são:\n\n• *Hoje*, às 18:30\n• *Amanhã*, às 09:00\n• *Amanhã*, às 14:30\n\nAlgum desses fica bom?",
        hora: "23:42",
      },
      { de: "paciente", texto: "amanhã 9h", hora: "23:42" },
      {
        de: "assistente",
        tipo: "confirmacao",
        texto:
          "✅ *Avaliação confirmada!*\n\n📅 *Sexta-feira, 26/09*\n🕐 *09:00*\n\nTe mando um lembrete na véspera 😉",
        hora: "23:42",
      },
    ],
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
      "Lembra o paciente e reduz faltas",
    ],
  },

  // Cena 7: chamada final
  cta: {
    empresa: "Corso Automação",
    titulo: "Quer isso na sua clínica?",
    chamada: "Toque em [Enviar mensagem] e teste agora",
    subtexto: "Quem vai te responder é a nossa assistente.",
  },

  // Locução: texto usado para GERAR os áudios de public/voz/<id>.mp3.
  // Mudar aqui não muda o som: é preciso gerar a fala de novo.
  // Os momentos de cada fala ficam em timing.ts (VOZ).
  locucao: {
    "gancho-dor": "Seu paciente te chamou às onze da noite.",
    "gancho-pergunta": "Quanto tempo sua clínica demora pra responder?",
    dor: "De manhã... ele já marcou na concorrente.",
    dado: "Cinco minutos fazem toda a diferença.",
    virada: "E se sua clínica respondesse em três segundos?",
    "demo-1": "Ela responde na hora, a qualquer hora.",
    "demo-2": "Mostra os horários reais da sua agenda...",
    "demo-3": "...e agenda o paciente sozinha.",
    beneficios: "Enquanto isso, você só atende.",
    cta: "Quer isso na sua clínica? Toque em enviar mensagem.",
  },
} as const;

export type ChatMessage = {
  de: "paciente" | "assistente";
  tipo?: "imagem" | "confirmacao";
  texto: string;
  hora: string;
};
