import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { INICIO, MOMENTO } from "../edl";
import type { LayoutTreino } from "../layout";
import { entra, opacidade, sai } from "../lib";
import { textos } from "../roteiro";
import { cores, fontes } from "../theme";

// Faixa da semana: aparece no "nas" e acende o SEG no "segunda-feira".
export const Semana: React.FC<{ layout: LayoutTreino }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inicio = INICIO.nas;
  const fim = INICIO.importante;
  if (frame < inicio || frame > fim + 8) return null;
  const o = sai(frame, fim, 6);
  const acende = entra(frame, fps, MOMENTO.segunda, 11);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: layout.semana.top,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 12,
          opacity: o,
          transform: `translateY(${(1 - o) * -30}px) scale(${layout.semana.escala})`,
          transformOrigin: "center top",
        }}
      >
        {textos.semana.map((dia, i) => {
          const p = entra(frame, fps, inicio + i * 2);
          const ativo = i === textos.diaDestaque;
          const a = ativo ? acende : 0;
          return (
            <div
              key={dia}
              style={{
                width: 116,
                height: 76,
                borderRadius: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: fontes.ui,
                fontWeight: 800,
                fontSize: 28,
                letterSpacing: "0.04em",
                color: a > 0.5 ? cores.tinta : "rgba(255,255,255,0.78)",
                background:
                  a > 0
                    ? `rgba(212,255,58,${opacidade(a)})`
                    : "rgba(20,20,22,0.55)",
                border: `2px solid ${a > 0 ? cores.destaque : "rgba(255,255,255,0.16)"}`,
                boxShadow: a > 0 ? `0 0 ${40 * opacidade(a)}px rgba(212,255,58,0.55)` : undefined,
                opacity: opacidade(p) * (ativo ? 1 : interpolate(acende, [0, 1], [1, 0.55])),
                transform: `translateY(${(1 - p) * 30}px) scale(${1 + 0.14 * a})`,
              }}
            >
              {dia}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
