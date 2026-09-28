import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { z } from "zod";
import { SafeZoneOverlay } from "../anuncio/components/SafeZoneOverlay";
import { getLayout } from "../anuncio/layout";
import { Camera, Plano } from "./Camera";
import { Cta } from "./components/Cta";
import { Ficha } from "./components/Ficha";
import { Importante } from "./components/Importante";
import { Legendas } from "./components/Legendas";
import { Clarao, PalavraGigante } from "./components/PalavraGigante";
import { Semana } from "./components/Semana";
import { Titulo } from "./components/Titulo";
import { INICIO } from "./edl";
import { getLayoutTreino } from "./layout";
import { clamp } from "./lib";
import { cores } from "./theme";
import { TreinoAudio } from "./TreinoAudio";

export const treinoSchema = z.object({
  formato: z.enum(["reels", "youtube"]),
  showSafeZone: z.boolean(), // faixas cobertas pelo Instagram (só Reels)
  withAudio: z.boolean(),
});

const ENTRA = 16; // frames para o vídeo ir para o lado
const VOLTA = 12; // frames para voltar à tela cheia

// 0 = tela cheia; 1 = vídeo de lado, entre `de` e `ate`
const deLado = (frame: number, de: number, ate: number) =>
  interpolate(frame, [de, de + ENTRA], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  }) *
  interpolate(frame, [ate, ate + VOLTA], [1, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

// Granulação de filme por cima de tudo: mosaico de uma textura de ruído,
// deslocado a cada frame
const GRAO = 512;
const Grao: React.FC<{ width: number; height: number }> = ({ width: W, height: H }) => {
  const frame = useCurrentFrame();
  const x = Math.floor(random(`gx-${frame}`) * GRAO);
  const y = Math.floor(random(`gy-${frame}`) * GRAO);
  const colunas = Math.ceil(W / GRAO) + 1;
  const linhas = Math.ceil(H / GRAO) + 1;
  return (
    <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.08, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          transform: `translate(${-x}px, ${-y}px)`,
          display: "grid",
          gridTemplateColumns: `repeat(${colunas}, ${GRAO}px)`,
        }}
      >
        {Array.from({ length: colunas * linhas }, (_, i) => (
          <Img key={i} src={staticFile("treino/grao.png")} style={{ width: GRAO, height: GRAO }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 16:9: degradês escuros do lado dos textos (o vídeo continua em tela cheia)
const Sombras: React.FC<{ esquerda: number; direita: number; baixo: number }> = ({
  esquerda,
  direita,
  baixo,
}) => (
  <>
    <AbsoluteFill
      style={{
        opacity: esquerda,
        background:
          "linear-gradient(to right, rgba(9,9,10,0.9) 0%, rgba(9,9,10,0.72) 32%, rgba(9,9,10,0) 58%)",
      }}
    />
    <AbsoluteFill
      style={{
        opacity: direita,
        background:
          "linear-gradient(to left, rgba(9,9,10,0.9) 0%, rgba(9,9,10,0.72) 36%, rgba(9,9,10,0) 62%)",
      }}
    />
    <AbsoluteFill
      style={{
        opacity: baixo,
        background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 28%, rgba(0,0,0,0) 50%)",
      }}
    />
  </>
);

// 0..1 entre `de` e `ate`, com rampas de `rampa` frames
const janela = (frame: number, de: number, ate: number, rampa = 8) =>
  interpolate(frame, [de - rampa, de, ate, ate + rampa], [0, 1, 1, 0], clamp);

export const Treino: React.FC<z.infer<typeof treinoSchema>> = ({
  formato,
  showSafeZone,
  withAudio,
}) => {
  const frame = useCurrentFrame();
  const layout = getLayoutTreino(formato);
  const esquerda = deLado(frame, INICIO.importante, INICIO.gosto);
  const direita = deLado(frame, INICIO.crucifixo, INICIO.final + 2);
  // Final: o vídeo volta a ocupar a tela, desfocado e escuro, atrás da ficha
  const fim = interpolate(frame, [INICIO.final + 2, INICIO.final + 2 + VOLTA], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: cores.fundo }}>
      {/* Brilho verde-limão atrás do card, só aparece quando o vídeo encolhe */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 78% 38%, rgba(212,255,58,0.10), rgba(212,255,58,0) 45%), radial-gradient(circle at 20% 70%, rgba(212,255,58,0.07), rgba(212,255,58,0) 40%)",
        }}
      />
      {/* Reels: o vídeo vira um card de lado. 16:9: fica em tela cheia e a câmera reenquadra */}
      <Plano
        esquerda={layout.cardLateral ? esquerda : 0}
        direita={layout.cardLateral ? direita : 0}
        fim={fim}
        gradienteTopo={layout.cardLateral}
        width={layout.width}
        height={layout.height}
      >
        <Camera formato={formato} />
      </Plano>
      {layout.cardLateral ? null : (
        <Sombras
          // texto à esquerda: gancho, "PEITO + TRÍCEPS" e a ficha
          esquerda={Math.max(
            janela(frame, 0, INICIO.nas, 8),
            janela(frame, INICIO.peito, INICIO.final + 200, 6),
          )}
          direita={esquerda}
          // legendas e faixa da semana embaixo
          baixo={Math.max(
            janela(frame, INICIO.nas, INICIO.importante, 6),
            janela(frame, INICIO.gosto + 10, INICIO.peito, 6),
          )}
        />
      )}
      <Clarao />
      <Titulo formato={formato} layout={layout} />
      <Semana layout={layout} />
      <Legendas layout={layout} />
      <PalavraGigante layout={layout} />
      <Importante lado={esquerda} layout={layout} />
      <Ficha lado={direita} fim={fim} layout={layout} />
      <Cta layout={layout} />
      <Grao width={layout.width} height={layout.height} />
      {withAudio ? <TreinoAudio /> : null}
      {showSafeZone && formato === "reels" ? <SafeZoneOverlay layout={getLayout("reels")} /> : null}
    </AbsoluteFill>
  );
};
