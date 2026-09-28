import { evolvePath } from "@remotion/paths";
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CORES, MOMENTOS, SAFE, TEXTO_CENTRAL, TEXTOS } from "../../config";
import { clamp, flutua, FONTES, progresso, suave } from "../base";
import { BrushDrop } from "../components/BrushDrop";
import { Palavras } from "../components/Palavras";
import { PaperBackground } from "../components/PaperBackground";

const M = MOMENTOS.gancho;
const BANNER = { top: SAFE.top, altura: 280 };
// Seta à mão ao lado da gota, da cabeça para a ponta
const SETA = "M 738 742 C 832 862 832 1082 762 1232";
const PONTA_SETA = "M 762 1232 l 32 -24 M 762 1232 l -2 -40";

// Cena 1: banner com a pergunta + gota verde sendo pintada no centro.
export const CenaGancho: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pBanner = suave(frame, fps, 0, 22);
  const contorno = progresso(frame, M.contorno[0], M.contorno[1]);
  const preenchimento = interpolate(frame, M.preenchimento, [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const seta = evolvePath(progresso(frame, M.seta, M.seta + 16), SETA);
  const pontaSeta = progresso(frame, M.seta + 14, M.seta + 20);
  const pRotulo = suave(frame, fps, M.seta + 8);

  return (
    <AbsoluteFill>
      <PaperBackground />
      {/* Banner verde descendo do topo */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: BANNER.top,
          height: BANNER.altura,
          backgroundColor: CORES.verde,
          display: "flex",
          alignItems: "center",
          boxShadow: "0 12px 30px rgba(46,58,35,0.18)",
          transform: `translateY(${(1 - pBanner) * -(BANNER.top + BANNER.altura)}px)`,
        }}
      >
        <Palavras
          texto={TEXTOS.gancho}
          inicio={8}
          style={{
            marginLeft: TEXTO_CENTRAL.left,
            width: TEXTO_CENTRAL.width,
            fontFamily: FONTES.poppins,
            fontWeight: 300,
            fontSize: 64,
            lineHeight: 1.18,
            letterSpacing: "0.03em",
            color: CORES.branco,
          }}
        />
      </div>

      {/* Gota grande: contorno se desenha e a tinta entra da cabeça para a ponta */}
      <div
        style={{
          position: "absolute",
          left: 540,
          top: 1000 + flutua(frame, 0, 8, 120),
          transform: `translate(-50%, -50%) scale(${1 + 0.03 * progresso(frame, 0, 135)})`,
        }}
      >
        <BrushDrop
          cor={CORES.verde}
          altura={620}
          rotacao={-18}
          contorno={contorno}
          preenchimento={preenchimento}
        />
      </div>

      {/* Seta à mão mostrando o sentido da pincelada */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <path
          d={SETA}
          fill="none"
          stroke={CORES.texto}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={seta.strokeDasharray}
          strokeDashoffset={seta.strokeDashoffset}
        />
        <path
          d={PONTA_SETA}
          fill="none"
          stroke={CORES.texto}
          strokeWidth={5}
          strokeLinecap="round"
          opacity={pontaSeta}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 540,
          width: SAFE.right - 540,
          top: 1275,
          textAlign: "center",
          fontFamily: FONTES.caveat,
          fontWeight: 600,
          fontSize: 54,
          color: CORES.texto,
          opacity: pRotulo,
          transform: `translateY(${(1 - pRotulo) * 20}px) rotate(-4deg)`,
        }}
      >
        {TEXTOS.setaGota}
      </div>
    </AbsoluteFill>
  );
};
