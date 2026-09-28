import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { INICIO, MOMENTO } from "../edl";
import type { LayoutTreino } from "../layout";
import { clamp, entra, opacidade, sai } from "../lib";
import { textos } from "../roteiro";
import { cores, fontes, sombraTexto } from "../theme";

// "PEITO" gigante no "peito"; no "tríceps" ele encolhe e entra "+ TRÍCEPS"
// (ao lado no Reels, embaixo no 16:9).
export const PalavraGigante: React.FC<{ layout: LayoutTreino }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inicio = MOMENTO.peito;
  const fim = INICIO.crucifixo;
  if (frame < inicio - 1 || frame > fim + 8) return null;

  const { pilha, gigante, dupla } = layout.palavra;
  const pPeito = entra(frame, fps, inicio - 1, 11);
  const pTriceps = entra(frame, fps, MOMENTO.triceps - 1, 12);
  const o = sai(frame, fim, 6);
  const tamPeito = interpolate(pTriceps, [0, 1], [gigante, dupla]);
  // Tremida curta na entrada de cada palavra
  const tremida = (desde: number) =>
    Math.sin((frame - desde) * 2.4) * interpolate(frame - desde, [0, 8], [10, 0], clamp);
  const dx = frame < MOMENTO.triceps ? tremida(inicio) : tremida(MOMENTO.triceps);
  const [primeira, segunda] = textos.palavraDupla;
  const t = opacidade(pTriceps);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: layout.palavra.top,
          left: layout.palavra.left,
          right: layout.palavra.right,
          display: "flex",
          flexDirection: pilha ? "column" : "row",
          justifyContent: pilha ? "flex-start" : "center",
          alignItems: pilha ? "flex-start" : "baseline",
          fontFamily: fontes.impacto,
          lineHeight: pilha ? 0.98 : 1,
          textShadow: sombraTexto,
          opacity: o,
          transform: `translate(${dx}px, ${(1 - o) * -40}px)`,
        }}
      >
        <span
          style={{
            fontSize: tamPeito,
            color: cores.branco,
            opacity: opacidade(pPeito * 2),
            transform: `scale(${1.35 - 0.35 * pPeito})`,
            transformOrigin: pilha ? "left center" : "center",
          }}
        >
          {frame < MOMENTO.triceps - 1 ? textos.palavraGigante : primeira}
        </span>
        <span
          style={{
            fontSize: dupla * t,
            color: cores.destaque,
            marginLeft: pilha ? 0 : 26 * t,
            opacity: opacidade(pTriceps * 2),
            whiteSpace: "nowrap",
          }}
        >
          {segunda}
        </span>
      </div>
    </AbsoluteFill>
  );
};

// Clarão branco rápido nas batidas do "PEITO" e do "TRÍCEPS"
export const Clarao: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = (em: number) => interpolate(frame, [em, em + 1, em + 6], [0, 0.28, 0], clamp);
  const v = Math.max(flash(MOMENTO.peito - 1), flash(MOMENTO.triceps - 1));
  if (v <= 0) return null;
  return <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${v})` }} />;
};
