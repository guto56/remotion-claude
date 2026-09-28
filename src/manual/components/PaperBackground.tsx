import React, { useId } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CORES, VIDEO } from "../../config";
import { flutua, idSvg } from "../base";
import { BrushDrop } from "./BrushDrop";

type Decoracao = {
  forma: "gota" | "folha";
  cor: string;
  x: number; // centro, em px
  y: number;
  altura: number;
  rotacao: number;
  opacidade: number; // 0.15 a 0.25
  fase: number;
};

// Gotas e folhinhas nos cantos, fora da área de texto (x 80–930, y 240–1500)
const CANTOS: Decoracao[] = [
  { forma: "gota", cor: CORES.rosa, x: 70, y: 120, altura: 110, rotacao: -35, opacidade: 0.22, fase: 0 },
  { forma: "folha", cor: CORES.verdeFolha, x: 990, y: 150, altura: 120, rotacao: 30, opacidade: 0.2, fase: 20 },
  { forma: "gota", cor: CORES.lilas, x: 1010, y: 820, altura: 100, rotacao: 160, opacidade: 0.18, fase: 45 },
  { forma: "folha", cor: CORES.verdeFolha, x: 110, y: 1640, altura: 130, rotacao: -20, opacidade: 0.2, fase: 10 },
  { forma: "gota", cor: CORES.amarelo, x: 300, y: 1790, altura: 90, rotacao: 60, opacidade: 0.24, fase: 70 },
  { forma: "gota", cor: CORES.laranja, x: 960, y: 1700, altura: 110, rotacao: 200, opacidade: 0.18, fase: 35 },
  { forma: "gota", cor: CORES.vermelho, x: 40, y: 900, altura: 80, rotacao: 10, opacidade: 0.15, fase: 55 },
];

// Fundo de papel off-white (ou verde, na chamada final) com granulação sutil,
// vinheta leve e decorações flutuando devagar nos cantos.
export const PaperBackground: React.FC<{ cor?: string; decoracao?: boolean }> = ({
  cor = CORES.papel,
  decoracao = true,
}) => {
  const frame = useCurrentFrame();
  const id = idSvg(useId());

  return (
    <AbsoluteFill style={{ backgroundColor: cor }}>
      {/* Granulação do papel (feTurbulence, ~4%) */}
      <svg width={VIDEO.width} height={VIDEO.height} style={{ position: "absolute", opacity: 0.04 }}>
        <filter id={`${id}-grao`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="7" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id}-grao)`} />
      </svg>
      {/* Vinheta leve */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 58%, rgba(60,50,30,0.12) 100%)",
        }}
      />
      {decoracao
        ? CANTOS.map((d, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: d.x,
                top: d.y + flutua(frame, d.fase, 10, 140),
                transform: "translate(-50%, -50%)",
                opacity: d.opacidade,
              }}
            >
              <BrushDrop
                forma={d.forma}
                cor={d.cor}
                altura={d.altura}
                rotacao={d.rotacao + flutua(frame, d.fase * 2, 5, 170)}
              />
            </div>
          ))
        : null}
    </AbsoluteFill>
  );
};
