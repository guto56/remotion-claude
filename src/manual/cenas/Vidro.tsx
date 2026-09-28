import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CORES, MOMENTOS, PAGINA_PROPORCAO, SAFE, TEXTOS } from "../../config";
import { clamp, flutua, FONTES, pop, progresso, suave } from "../base";
import { BrushDrop } from "../components/BrushDrop";
import { GlassPlate } from "../components/GlassPlate";
import { PageSheet } from "../components/PageSheet";
import { Palavras } from "../components/Palavras";
import { PaperBackground } from "../components/PaperBackground";

const M = MOMENTOS.vidro;
const FOLHA = { largura: 520, top: 270 };
const ALTURA_FOLHA = FOLHA.largura * PAGINA_PROPORCAO;
const VIDRO = { largura: 590, altura: ALTURA_FOLHA + 60 };
const PASSOS = { top: 1090, intervalo: 128, circulo: 76 };

// Cena 4: a página 3 menor, uma placa de vidro desliza por cima e os três
// passos entram um de cada vez. No último, uma pétala é pintada sobre o vidro.
export const CenaVidro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pVidro = suave(frame, fps, M.vidro[0], M.vidro[1] - M.vidro[0]);
  const kenBurns = 1 + 0.03 * progresso(frame, 0, 165);
  const pintura = interpolate(frame, M.pintura, [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });

  return (
    <AbsoluteFill>
      <PaperBackground />
      <div
        style={{
          position: "absolute",
          left: 540,
          top: FOLHA.top + ALTURA_FOLHA / 2,
          transform: `translate(-50%, -50%) scale(${kenBurns}) translateY(${flutua(frame, 0, 4, 150)}px)`,
        }}
      >
        <PageSheet pagina={3} largura={FOLHA.largura} />
        {/* Placa de vidro deslizando da direita para cima da folha */}
        <GlassPlate
          largura={VIDRO.largura}
          altura={VIDRO.altura}
          style={{
            position: "absolute",
            left: (FOLHA.largura - VIDRO.largura) / 2,
            top: (ALTURA_FOLHA - VIDRO.altura) / 2,
            transform: `translateX(${(1 - pVidro) * 760}px) rotate(${-2 + 1.5 * pVidro}deg)`,
          }}
        />
        {/* Pincelada sobre o vidro, em cima do desenho (passo 3) */}
        <div style={{ position: "absolute", left: 250, top: 150, opacity: pintura > 0 ? 1 : 0 }}>
          <BrushDrop cor={CORES.rosa} altura={120} rotacao={24} preenchimento={pintura} />
        </div>
      </div>

      {TEXTOS.passos.map((passo, i) => {
        const p = pop(frame, fps, M.passos[i]);
        return (
          <div
            key={passo}
            style={{
              position: "absolute",
              left: SAFE.left + 30,
              right: 1080 - SAFE.right,
              top: PASSOS.top + i * PASSOS.intervalo,
              display: "flex",
              alignItems: "center",
              gap: 28,
            }}
          >
            <div
              style={{
                width: PASSOS.circulo,
                height: PASSOS.circulo,
                borderRadius: PASSOS.circulo / 2,
                flexShrink: 0,
                backgroundColor: CORES.verde,
                color: CORES.branco,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONTES.poppins,
                fontWeight: 500,
                fontSize: 38,
                opacity: Math.min(1, p * 3),
                transform: `scale(${p})`,
              }}
            >
              {i + 1}
            </div>
            <Palavras
              texto={passo}
              inicio={M.passos[i] + 3}
              alinhar="flex-start"
              style={{ fontFamily: FONTES.poppins, fontWeight: 400, fontSize: 46, color: CORES.texto }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
