import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { CORES, MOMENTOS, SAFE, TEXTOS } from "../../config";
import { FONTES, pop, suave } from "../base";
import { Palavras } from "./Palavras";

const M = MOMENTOS.cta;

// Chamada final: título, subtítulo, botão em pílula (com pulso) e o perfil.
// `botaoTop`: onde começa o botão (abaixo da pilha de páginas, que a cena desenha).
export const CTA: React.FC<{ botaoTop: number }> = ({ botaoTop }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pBotao = pop(frame, fps, M.botao);
  const pulso = 1 + 0.035 * Math.sin(((frame - M.botao) / 36) * Math.PI * 2) * Math.min(1, pBotao);
  const pPerfil = suave(frame, fps, M.perfil);
  const largura = SAFE.right - SAFE.left;

  return (
    <>
      <div style={{ position: "absolute", left: SAFE.left, width: largura, top: SAFE.top + 40 }}>
        <Palavras
          texto={TEXTOS.ctaTitulo}
          inicio={M.titulo}
          style={{
            fontFamily: FONTES.poppins,
            fontWeight: 300,
            fontSize: 70,
            lineHeight: 1.12,
            letterSpacing: "0.05em",
            color: CORES.branco,
            textAlign: "center",
          }}
        />
        <Palavras
          texto={TEXTOS.ctaSub}
          inicio={M.sub}
          style={{
            marginTop: 26,
            fontFamily: FONTES.poppins,
            fontWeight: 400,
            fontSize: 38,
            color: "rgba(255,255,255,0.9)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: largura,
          top: botaoTop,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
        }}
      >
        <div
          style={{
            padding: "26px 64px",
            borderRadius: 999,
            backgroundColor: CORES.branco,
            color: CORES.verde,
            fontFamily: FONTES.poppins,
            fontWeight: 500,
            fontSize: 46,
            boxShadow: "0 18px 36px rgba(0,0,0,0.2)",
            opacity: Math.min(1, pBotao * 2),
            transform: `scale(${(0.6 + 0.4 * pBotao) * pulso})`,
          }}
        >
          {TEXTOS.ctaBotao}
        </div>
        <div
          style={{
            fontFamily: FONTES.poppins,
            fontWeight: 400,
            fontSize: 38,
            color: CORES.branco,
            opacity: pPerfil,
            transform: `translateY(${(1 - pPerfil) * 20}px)`,
          }}
        >
          {TEXTOS.ctaPerfil}
        </div>
      </div>
    </>
  );
};
