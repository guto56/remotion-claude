import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { INICIO, LEGENDA } from "../edl";
import type { LayoutTreino } from "../layout";
import { entra, opacidade, partes, sai } from "../lib";
import { cores, fontes, sombraTexto } from "../theme";

// Legendas só em alguns trechos (edl.ts > LEGENDA). Cada palavra entra
// quando é dita; o bloco some quando começa o próximo.
const GRUPOS: { palavras: [string, number][]; ate: number }[] = [
  { palavras: LEGENDA.gosto, ate: LEGENDA.amanha[0][1] - 1 },
  { palavras: LEGENDA.amanha, ate: INICIO.faco },
  { palavras: LEGENDA.faco, ate: INICIO.peito },
];

export const Legendas: React.FC<{ layout: LayoutTreino }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grupo = GRUPOS.find((g) => frame >= g.palavras[0][1] - 2 && frame < g.ate + 6);
  if (!grupo) return null;
  const o = sai(frame, grupo.ate, 5);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: layout.legenda.top,
          left: layout.legenda.lado,
          right: layout.legenda.lado,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: 22,
          fontFamily: fontes.impacto,
          fontSize: layout.legenda.tamanho,
          lineHeight: 1.08,
          textShadow: sombraTexto,
          opacity: o,
        }}
      >
        {grupo.palavras.map(([palavra, em]) => {
          const p = entra(frame, fps, em - 2, 12);
          const { texto, destaque } = partes(palavra)[0];
          return (
            <span
              key={`${palavra}-${em}`}
              style={{
                display: "inline-block",
                color: destaque ? cores.destaque : cores.branco,
                opacity: opacidade(p * 2),
                transform: `translateY(${(1 - p) * 26}px) scale(${0.82 + 0.18 * p})`,
              }}
            >
              {texto}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
