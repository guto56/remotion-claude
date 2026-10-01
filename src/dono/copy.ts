// ============================================================
// TEXTOS DO ANÚNCIO "DONO": edite aqui sem mexer no resto do código.
//
// Nos títulos, [colchetes] marcam a palavra destacada:
//   "Seu cliente chamou às [23h]."  -> "23h" em amarelo/verde
// Nas mensagens, *asteriscos* viram negrito (sem aparecer os asteriscos)
// e \n quebra a linha.
// ============================================================

export type Mensagem =
  | { de: "cliente" | "assistente"; texto: string; hora: string; confirma?: boolean }
  | { de: "cliente"; foto: string; hora: string }; // foto genérica com legenda

export type Conversa = {
  chip: string; // chip acima do celular
  icone: "agenda" | "orcamento" | "pedido"; // ícone do chip (lucide)
  negocio: string; // nome do negócio de exemplo
  status: string;
  mensagens: Mensagem[]; // 4 mensagens: cliente, assistente, cliente, assistente
  aviso: string; // aviso que o DONO recebe no WhatsApp dele
};

export const copy = {
  // Cena 1: gancho
  chipDono: "DONO DE NEGÓCIO:",
  gancho: "Seu cliente chamou às [23h].",
  bloqueio: {
    relogioDe: "23:41",
    relogioAte: "08:30",
    data: "quinta-feira, 25 de setembro",
    notificacao: "Nova mensagem",
    quando: "agora",
    previas: ["Tem horário amanhã?", "Quanto fica o portão?", "Ainda tem a camiseta M?", "Oi? Alguém aí?"],
  },

  // Cena 2: dor
  dor1: "Quando você responde de manhã...",
  dor2: "...ele já comprou do [concorrente].", // destaque em vermelho, com tremida

  // Cena 3: dado
  dado: {
    numero: 21, // conta de 1 até este número
    sufixo: "x",
    texto: "mais chance de avançar a venda respondendo em até 5 minutos",
    fonte: "Estudo MIT / InsideSales, 15 mil contatos",
  },

  // Cena 4: virada
  virada: "E se ele fosse atendido em [3 segundos]?",

  // Cena 5: demonstração (3 negócios, 3 finais)
  cronometro: "00:03",
  placeholder: "Mensagem",
  avisoRotulo: "Aviso para você",
  conversas: [
    {
      chip: "Clínicas e salões: AGENDA",
      icone: "agenda",
      negocio: "Studio Bella",
      status: "online",
      mensagens: [
        { de: "cliente", texto: "Tem horário amanhã?", hora: "23:41" },
        {
          de: "assistente",
          texto: "Tenho sim! 😊 Os mais próximos:\n• Amanhã, 09:00\n• Amanhã, 14:30\nQual fica melhor?",
          hora: "23:41",
        },
        { de: "cliente", texto: "9h", hora: "23:42" },
        {
          de: "assistente",
          texto: "✅ *Agendamento confirmado!*\n📅 Amanhã, 09:00\nTe lembro na véspera 😉",
          hora: "23:42",
          confirma: true,
        },
      ],
      aviso: "📅 Novo agendamento · Maria · amanhã 09:00",
    },
    {
      chip: "Prestadores: ORÇAMENTO",
      icone: "orcamento",
      negocio: "Serralheria Forte",
      status: "online",
      mensagens: [
        { de: "cliente", texto: "Quanto fica um portão de alumínio?", hora: "23:41" },
        {
          de: "assistente",
          texto: "Depende da medida! Me manda a largura e a altura do vão e uma foto do local 📸",
          hora: "23:41",
        },
        { de: "cliente", foto: "3m x 2m", hora: "23:42" },
        {
          de: "assistente",
          texto: "Perfeito! O técnico mede e passa o valor exato.\n✅ *Visita marcada: quinta, 10:00*",
          hora: "23:42",
          confirma: true,
        },
      ],
      aviso: "📅 Nova visita · João · portão 3m x 2m · qui 10:00",
    },
    {
      chip: "Lojas: FECHA O PEDIDO",
      icone: "pedido",
      negocio: "Loja Estilo",
      status: "online",
      mensagens: [
        { de: "cliente", texto: "Ainda tem a camiseta preta M?", hora: "23:41" },
        {
          de: "assistente",
          texto: "Tem sim! 🛍️ R$ 79, no Pix ou cartão. Pra qual endereço envio?",
          hora: "23:41",
        },
        { de: "cliente", texto: "Rua das Flores, 120", hora: "23:42" },
        {
          de: "assistente",
          texto: "✅ *Pedido anotado!*\nCamiseta preta M · R$ 79 · Pix\nJá te mando a chave 😉",
          hora: "23:42",
          confirma: true,
        },
      ],
      aviso: "🛍️ Novo pedido · Ana · camiseta M · R$ 79",
    },
  ] as Conversa[],

  // Cena 6: benefícios
  beneficiosTitulo: "Enquanto você trabalha, [ela]:",
  beneficios: [
    "Responde em segundos, 24h",
    "Agenda, orça e fecha pedidos",
    "Te avisa no seu WhatsApp",
    "Te passa a conversa quando você quiser",
  ],

  // Cena 7: chamada
  cta: "[Teste agora]: fale com a nossa assistente",
  ctaSub: "Para donos de negócio · Diagnóstico gratuito",

  // Locução (voz Felipe, Cartesia). Mudar aqui não muda o som: é preciso
  // gerar a fala de novo (python3 scripts/gerar-voz.py dono). Momentos em timing.ts (VOZ).
  locucao: {
    gancho: "Seu cliente te chamou às onze da noite.",
    dor: "Quando você responde de manhã, ele já comprou do concorrente.",
    dado: "Responder rápido dá vinte e uma vezes mais chance.",
    virada: "E se ele fosse atendido em três segundos?",
    agenda: "Na clínica ou no salão, ela agenda o horário.",
    orcamento: "No serviço, pede a foto e marca a visita.",
    pedido: "Na loja, fecha o pedido. E te avisa na hora.",
    beneficios: "Enquanto você trabalha, ela atende vinte e quatro horas.",
    cta: "Toque em enviar mensagem e teste agora.",
  },
};
