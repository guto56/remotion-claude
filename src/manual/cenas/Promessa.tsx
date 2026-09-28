import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CORES, MOMENTOS, TEXTO_CENTRAL, TEXTOS } from "../../config";
import { flutua, FONTES, pop, progresso } from "../base";
import { PageSheet } from "../components/PageSheet";
import { Palavras } from "../components/Palavras";
import { PaperBackground } from "../components/PaperBackground";

const M = MOMENTOS.promessa;
// Leque das 5 miniaturas (da esquerda para a direita)
const LEQUE = [
  { rot: -12, x: -230, y: 40 },
  { rot: -6, x: -115, y: 12 },
  { rot: 0, x: 0, y: 0 },
  { rot: 6, x: 115, y: 12 },
  { rot: 12, x: 230, y: 40 },
];
const MINIATURA = 270;
const CENTRO_LEQUE = { x: 540, y: 1040 };

// Cena 2: "Comece pelo básico." + as 5 páginas abrindo em leque.
export const CenaPromessa: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const texto = { left: TEXTO_CENTRAL.left, width: TEXTO_CENTRAL.width, position: "absolute" as const };

  return (
    <AbsoluteFill>
      <PaperBackground />
      {/* Título e subtítulo empilhados (o título pode quebrar em duas linhas) */}
      <div style={{ ...texto, top: 290, display: "flex", flexDirection: "column", gap: 30 }}>
        <Palavras
          texto={TEXTOS.promessaTitulo}
          inicio={M.titulo}
          style={{ fontFamily: FONTES.poppins, fontWeight: 500, fontSize: 72, lineHeight: 1.15, color: CORES.texto }}
        />
        <Palavras
          texto={TEXTOS.promessaSub}
          inicio={M.sub}
          sublinhado={M.sublinhado as [number, number]}
          style={{
            fontFamily: FONTES.poppins,
            fontWeight: 400,
            fontSize: 50,
            lineHeight: 1.35,
            color: CORES.textoSecundario,
          }}
        />
      </div>

      {/* Leque: cada folha dá um "pop" a cada 6 frames; o conjunto balança devagar */}
      <div
        style={{
          position: "absolute",
          left: CENTRO_LEQUE.x,
          top: CENTRO_LEQUE.y,
          transform: `scale(${1 + 0.035 * progresso(frame, 0, 135)}) rotate(${flutua(frame, 0, 0.8, 150)}deg)`,
        }}
      >
        {LEQUE.map((f, i) => {
          const p = pop(frame, fps, M.miniaturas + i * M.miniaturaIntervalo);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: f.x - MINIATURA / 2,
                top: f.y - (MINIATURA * 1.414) / 2,
                transform: `rotate(${f.rot}deg) scale(${p})`,
                transformOrigin: "50% 90%",
                opacity: Math.min(1, p * 3),
              }}
            >
              <PageSheet pagina={i + 1} largura={MINIATURA} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
