import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CORES, MOMENTOS } from "../../config";
import { flutua, progresso, suave } from "../base";
import { CTA } from "../components/CTA";
import { PageSheet } from "../components/PageSheet";
import { PaperBackground } from "../components/PaperBackground";

const M = MOMENTOS.cta;
// Pilha das 5 páginas, levemente rotacionadas (a de cima é a página 1)
const PILHA = [
  { pagina: 5, rot: 8, x: 34 },
  { pagina: 4, rot: -7, x: -30 },
  { pagina: 3, rot: 5, x: 18 },
  { pagina: 2, rot: -4, x: -14 },
  { pagina: 1, rot: -1, x: 0 },
];
const LARGURA = 360;
const CENTRO = { x: 540, y: 880 };

// Cena 5: fundo verde, páginas subindo empilhadas e a chamada final.
export const CenaCta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <PaperBackground cor={CORES.verde} />
      <div
        style={{
          position: "absolute",
          left: CENTRO.x,
          top: CENTRO.y + flutua(frame, 0, 5, 140),
          transform: `scale(${1 + 0.04 * progresso(frame, 0, 150)})`,
        }}
      >
        {PILHA.map((f, i) => {
          const p = suave(frame, fps, M.paginas + i * 4, 26);
          return (
            <div
              key={f.pagina}
              style={{
                position: "absolute",
                left: f.x - LARGURA / 2,
                top: -(LARGURA * 1.414) / 2,
                transform: `translateY(${(1 - p) * 1100}px) rotate(${f.rot * (0.6 + 0.4 * p)}deg)`,
              }}
            >
              <PageSheet pagina={f.pagina} largura={LARGURA} />
            </div>
          );
        })}
      </div>
      <CTA botaoTop={1170} />
    </AbsoluteFill>
  );
};
