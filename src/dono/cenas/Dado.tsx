import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { copy } from "../copy";
import type { Layout } from "../layout";
import { entra, op } from "../lib";
import { cores, fontes, tipo } from "../theme";
import { CENAS, DADO } from "../timing";
import { KineticHeadline } from "../components/KineticHeadline";
import { StatCounter } from "../components/StatCounter";

// Cena 3 (165–240): "21x" contando + a frase + a fonte do dado.
// Frames aqui são relativos ao início da cena.
export const Dado: React.FC<{ layout: Layout }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t0 = CENAS.dado;
  const pFonte = entra(frame, fps, DADO.fonte - t0);

  return (
    <AbsoluteFill style={{ backgroundColor: cores.noite }}>
      <div style={{ position: "absolute", top: layout.dado.numeroTop, left: 0, right: 0 }}>
        <StatCounter ate={copy.dado.numero} sufixo={copy.dado.sufixo} de={DADO.contaDe - t0} fim={DADO.contaAte - t0} />
      </div>
      <div style={{ position: "absolute", top: layout.dado.textoTop, left: layout.lado + 30, right: layout.lado + 30 }}>
        <KineticHeadline
          texto={copy.dado.texto}
          inicio={DADO.texto - t0}
          tom="escuro"
          tamanho={tipo.numeroTexto}
          peso={700}
          style={{ lineHeight: 1.18 }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: layout.dado.fonteTop,
          left: layout.lado,
          right: layout.lado,
          textAlign: "center",
          fontFamily: fontes.ui,
          fontWeight: 500,
          fontSize: tipo.fonte,
          color: "rgba(255,255,255,0.6)",
          opacity: op(pFonte),
          transform: `translateY(${(1 - pFonte) * 16}px)`,
        }}
      >
        {copy.dado.fonte}
      </div>
    </AbsoluteFill>
  );
};
