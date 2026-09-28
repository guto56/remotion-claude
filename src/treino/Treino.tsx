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
import { H, W } from "./layout";
import { clamp } from "./lib";
import { cores } from "./theme";
import { TreinoAudio } from "./TreinoAudio";

export const treinoSchema = z.object({
  showSafeZone: z.boolean(), // faixas cobertas pelo Instagram
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
const Grao: React.FC = () => {
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

export const Treino: React.FC<z.infer<typeof treinoSchema>> = ({
  showSafeZone,
  withAudio,
}) => {
  const frame = useCurrentFrame();
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
      <Plano esquerda={esquerda} direita={direita} fim={fim}>
        <Camera />
      </Plano>
      <Clarao />
      <Titulo />
      <Semana />
      <Legendas />
      <PalavraGigante />
      <Importante lado={esquerda} />
      <Ficha lado={direita} fim={fim} />
      <Cta />
      <Grao />
      {withAudio ? <TreinoAudio /> : null}
      {showSafeZone ? <SafeZoneOverlay layout={getLayout("reels")} /> : null}
    </AbsoluteFill>
  );
};
