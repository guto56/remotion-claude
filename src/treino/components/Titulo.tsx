import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { INICIO } from "../edl";
import type { Formato, LayoutTreino } from "../layout";
import { clamp, partes, sai } from "../lib";
import { textos } from "../roteiro";
import { cores, fontes, sombraTexto } from "../theme";

// Gancho: completo desde o frame 0 (vira a capa). Sai quando começa o "nas".
export const Titulo: React.FC<{ formato: Formato; layout: LayoutTreino }> = ({
  formato,
  layout,
}) => {
  const frame = useCurrentFrame();
  const fim = INICIO.nas;
  if (frame > fim + 10) return null;
  const o = sai(frame, fim, 8);
  // "Respira" de leve (escala 1 -> 1.03) enquanto está na tela
  const escala = interpolate(frame, [0, fim], [1, 1.03], clamp);
  const t = layout.titulo;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: t.top,
          left: t.left,
          width: t.width,
          height: t.meio ? t.height : undefined,
          display: "flex",
          flexDirection: "column",
          justifyContent: t.meio ? "center" : "flex-start",
          textAlign: t.alinhar,
          fontFamily: fontes.impacto,
          fontSize: t.tamanho,
          lineHeight: 1.04,
          color: cores.branco,
          textShadow: sombraTexto,
          opacity: o,
          transform: `translateY(${(1 - o) * -40}px) scale(${escala})`,
          transformOrigin: t.alinhar === "left" ? "left center" : "center top",
        }}
      >
        {textos.titulo[formato].map((linha) => (
          <div key={linha}>
            {partes(linha).map((p) => (
              <span key={p.texto} style={{ color: p.destaque ? cores.destaque : undefined }}>
                {p.texto}
              </span>
            ))}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
