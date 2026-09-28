// ============================================================
// VÍDEO "MANUAL DE PINTURA PARA INICIANTES" (composição ManualPintura)
// Tudo que dá para ajustar sem mexer nos componentes: durações, cores,
// textos, focos das páginas e volumes. Os componentes ficam em src/manual/.
// ============================================================

// ---------------------------------------------------------------- vídeo

export const VIDEO = { width: 1080, height: 1920, fps: 30, duracao: 1200 };

// Cenas no tempo final (frames). As transições ficam por conta do
// TransitionSeries: cada cena "sobra" alguns frames para cobrir a transição.
export const CENAS = {
  gancho: { inicio: 0, fim: 120 },
  promessa: { inicio: 120, fim: 240 },
  paginas: { inicio: 240, fim: 900 },
  vidro: { inicio: 900, fim: 1050 },
  cta: { inicio: 1050, fim: 1200 },
};

export const TRANSICAO = {
  cena: 15, // fade 1→2 e 4→5; wipe da esquerda 2→3 e 3→4
  pagina: 12, // slide da direita para a esquerda entre as páginas
};

// Área segura do Reels: textos entre x 80 e 930 (nada nos 150 px da direita)
// e entre y 240 e 1500 (nada nos 400 px de baixo).
export const SAFE = { left: 80, right: 930, top: 240, bottom: 1500 };
// Texto centralizado em x=540 sem passar de x=930: faixa de 150 a 930
export const TEXTO_CENTRAL = { left: 150, width: 780 };

// ---------------------------------------------------------------- visual

export const CORES = {
  verde: "#5E7F3A",
  texto: "#2E3A23",
  textoSecundario: "#555555",
  papel: "#FAF8F2",
  verdeClaro: "#EEF3E6",
  branco: "#FFFFFF",
  rosa: "#E98AA6",
  lilas: "#9C82D4",
  vermelho: "#D9434B",
  amarelo: "#F4C542",
  laranja: "#F2994A",
  verdeFolha: "#6E9A43",
};

export const SOMBRA_PAPEL = "0 20px 40px rgba(0,0,0,.18)";

// Animação
export const ANIM = {
  suave: { damping: 200 }, // entradas
  pop: { damping: 12 }, // só os "pops"
  palavraIntervalo: 3, // frames entre uma palavra e a próxima
  palavraDuracao: 12, // frames de cada palavra (fade + subida)
  palavraSubida: 20, // px
};

// ---------------------------------------------------------------- textos

export const TEXTOS = {
  gancho: "É INICIANTE E QUER APRENDER A PINTAR VIDROS?",
  setaGota: "pressione… e puxe",
  promessaTitulo: "Comece pelo básico.",
  // [colchetes] = verde, com sublinhado à mão
  promessaSub: "[5 folhas] de treino prontas pra imprimir",
  passos: ["Imprima a folha", "Coloque por baixo do vidro", "Pinte seguindo o desenho"],
  ctaTitulo: "MANUAL DE PINTURA PARA INICIANTES",
  ctaSub: "Folhas, flores e frutos · 5 páginas",
  ctaBotao: "[TEXTO DO CTA]",
  ctaPerfil: "[@PERFIL]",
};

// ---------------------------------------------------------------- páginas
// foco: ponto (em % da largura/altura da página) onde fica o desenho colorido
// que serve de modelo. O zoom da Cena 3 vai até ele.

export const PAGINAS = [
  { arquivo: "pages/page-1.png", titulo: "01 · Pinceladas básicas", descricao: "Gota em 6 direções, vírgula e folha", foco: { x: 12, y: 35 } },
  { arquivo: "pages/page-2.png", titulo: "02 · Folhas e caules", descricao: "Traço de caule, ramos e nervuras", foco: { x: 17, y: 50 } },
  { arquivo: "pages/page-3.png", titulo: "03 · Flores", descricao: "5 pétalas, margarida e pontinhos", foco: { x: 16, y: 23 } },
  { arquivo: "pages/page-4.png", titulo: "04 · Tulipas e composição", descricao: "Botões e um ramo florido completo", foco: { x: 27, y: 67 } },
  { arquivo: "pages/page-5.png", titulo: "05 · Frutos", descricao: "Cerejas, uvas, morangos e laranjinhas", foco: { x: 18, y: 45 } },
];
export const PAGINA_PROPORCAO = 297 / 210; // A4 (altura / largura)

export const CENA3 = {
  porPagina: 132, // frames de cada página
  larguraFolha: 900,
  centroFolha: { x: 540, y: 800 },
  zoom: { de: 20, ate: 110, escala: 1.7 }, // frames dentro da página
  // onde o ponto de foco termina na tela: um pouco à esquerda do centro, para
  // aparecerem também os contornos de treino à direita do modelo
  alvoZoom: { x: 440, y: 760 },
  chip: { top: 1300, altura: 180 },
};

// ---------------------------------------------------------------- áudio

// false = vídeo sem som. Arquivos que faltarem em public/audio/ são pulados.
export const AUDIO_ENABLED = true;

export const AUDIO = {
  musica: { arquivo: "audio/musica.mp3", volume: 0.3, fadeIn: 15, fadeOut: 45 },
  // [arquivo, frame no vídeo final, volume]
  efeitos: [
    ["audio/pincel.mp3", 22, 0.4],
    // pops das miniaturas (Cena 2, a cada 6 frames)
    ["audio/pop.mp3", 120 + 44, 0.4],
    ["audio/pop.mp3", 120 + 50, 0.4],
    ["audio/pop.mp3", 120 + 56, 0.4],
    ["audio/pop.mp3", 120 + 62, 0.4],
    ["audio/pop.mp3", 120 + 68, 0.4],
    // papel entrando e whoosh entre as páginas (Cena 3)
    ["audio/papel.mp3", 240, 0.4],
    ["audio/whoosh.mp3", 240 + 132, 0.25],
    ["audio/papel.mp3", 240 + 132, 0.35],
    ["audio/whoosh.mp3", 240 + 264, 0.25],
    ["audio/papel.mp3", 240 + 264, 0.35],
    ["audio/whoosh.mp3", 240 + 396, 0.25],
    ["audio/papel.mp3", 240 + 396, 0.35],
    ["audio/whoosh.mp3", 240 + 528, 0.25],
    ["audio/papel.mp3", 240 + 528, 0.35],
    // passos (Cena 4)
    ["audio/pop.mp3", 900 + 4, 0.35],
    ["audio/pop.mp3", 900 + 44, 0.35],
    ["audio/pop.mp3", 900 + 84, 0.35],
    // botão do CTA (Cena 5)
    ["audio/sino.mp3", 1050 + 60, 0.4],
  ] as [string, number, number][],
};

// Momentos dentro de cada cena (frames desde o início da cena)
export const MOMENTOS = {
  gancho: { contorno: [20, 45], preenchimento: [40, 65], seta: 58 },
  promessa: { titulo: 6, sub: 18, sublinhado: [44, 64], miniaturas: 44, miniaturaIntervalo: 6 },
  vidro: { vidro: [14, 40], passos: [4, 44, 84], pintura: [96, 126] },
  cta: { paginas: 6, titulo: 14, sub: 34, botao: 60, perfil: 70 },
};
