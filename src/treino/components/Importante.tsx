import { Flame, ShieldCheck } from "lucide-react";
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { INICIO, MOMENTO } from "../edl";
import type { LayoutTreino } from "../layout";
import { entra, opacidade } from "../lib";
import { textos } from "../roteiro";
import { cores, fontes, tamanho } from "../theme";

const ICONES = [ShieldCheck, Flame];

// Coluna da direita na cena "O importante": rótulo, frase e dois cards.
// `lado` (0..1) é o quanto o vídeo já foi para o canto (entra e sai junto).
export const Importante: React.FC<{ lado: number; layout: LayoutTreino }> = ({
  lado,
  layout,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (lado <= 0.001) return null;
  const { rotulo, frase, itens } = textos.importante;
  const momentos = [MOMENTO.desgaste, MOMENTO.aquecer];
  // A frase entra quando ele diz "começar"
  const pFrase = entra(frame, fps, MOMENTO.importante + 40);
  const pRotulo = entra(frame, fps, INICIO.importante + 8);

  return (
    <AbsoluteFill
      style={{
        opacity: opacidade(lado * 1.4 - 0.2),
        transform: `translateX(${(1 - lado) * 60}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: layout.importante.left,
          width: layout.importante.width,
          top: layout.importante.top,
          height: layout.importante.height,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 22,
          transform: `scale(${layout.importante.escala})`,
          transformOrigin: "left center",
        }}
      >
        <div
          style={{
            fontFamily: fontes.ui,
            fontWeight: 800,
            fontSize: tamanho.rotulo,
            letterSpacing: "0.2em",
            color: cores.destaque,
            opacity: opacidade(pRotulo),
            transform: `translateY(${(1 - pRotulo) * 20}px)`,
          }}
        >
          {rotulo}
        </div>
        <div
          style={{
            fontFamily: fontes.ui,
            fontWeight: 600,
            fontSize: 36,
            lineHeight: 1.25,
            color: "rgba(255,255,255,0.88)",
            marginBottom: 14,
            opacity: opacidade(pFrase),
            transform: `translateY(${(1 - pFrase) * 20}px)`,
          }}
        >
          {frase}
        </div>
        {itens.map((item, i) => {
          const p = entra(frame, fps, momentos[i]);
          const Icone = ICONES[i];
          return (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "24px 24px",
                borderRadius: 28,
                background: cores.card,
                border: `2px solid ${cores.borda}`,
                boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
                opacity: opacidade(p),
                transform: `translateX(${(1 - p) * 80}px) scale(${0.9 + 0.1 * p})`,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  flexShrink: 0,
                  background: cores.destaque,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${0.5 + 0.5 * entra(frame, fps, momentos[i] + 4, 9)})`,
                }}
              >
                <Icone size={40} color={cores.tinta} strokeWidth={2.6} />
              </div>
              <div
                style={{
                  fontFamily: fontes.impacto,
                  fontSize: tamanho.card,
                  lineHeight: 1.04,
                  color: cores.branco,
                  whiteSpace: "pre-line",
                }}
              >
                {item}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
