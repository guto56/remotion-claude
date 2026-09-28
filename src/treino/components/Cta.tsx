import { Bookmark } from "lucide-react";
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { INICIO } from "../edl";
import { FINAL } from "../layout";
import { entra, opacidade } from "../lib";
import { textos } from "../roteiro";
import { cores, fontes } from "../theme";

// Chamada final (salvar o treino). Fica completa até o último frame.
export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inicio = INICIO.final + 14;
  if (frame < inicio) return null;
  const p = entra(frame, fps, inicio, 12);
  const pSub = entra(frame, fps, inicio + 8);
  // O ícone "salva" (preenche) logo depois
  const salvo = entra(frame, fps, inicio + 16, 10);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: FINAL.ctaTop,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "24px 44px",
            borderRadius: 999,
            background: cores.destaque,
            color: cores.tinta,
            fontFamily: fontes.impacto,
            fontSize: 56,
            lineHeight: 1,
            boxShadow: "0 0 60px rgba(212,255,58,0.35), 0 20px 50px rgba(0,0,0,0.5)",
            opacity: opacidade(p * 2),
            transform: `translateY(${(1 - p) * 60}px) scale(${0.85 + 0.15 * p})`,
          }}
        >
          <Bookmark
            size={50}
            strokeWidth={2.6}
            color={cores.tinta}
            fill={salvo > 0.5 ? cores.tinta : "none"}
            style={{ transform: `scale(${1 + 0.2 * Math.sin(Math.PI * opacidade(salvo))})` }}
          />
          {textos.cta}
        </div>
        <div
          style={{
            fontFamily: fontes.ui,
            fontWeight: 600,
            fontSize: 32,
            color: "rgba(255,255,255,0.8)",
            opacity: opacidade(pSub),
            transform: `translateY(${(1 - pSub) * 16}px)`,
          }}
        >
          {textos.ctaSub}
        </div>
      </div>
    </AbsoluteFill>
  );
};
