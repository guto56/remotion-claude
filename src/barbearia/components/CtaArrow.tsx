import { ArrowDown } from "lucide-react";
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, entra, op } from "../lib";
import { cores } from "../theme";

const CICLO = 20; // frames de cada pulo
const PULO = 20; // px

// Seta amarela apontando para o botão do anúncio, pulando para baixo. O pulo
// some suavemente até `paraEm` e a seta fica parada daí em diante.
export const CtaArrow: React.FC<{ inicio: number; paraEm: number }> = ({ inicio, paraEm }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = entra(frame, fps, inicio);
  const fase = (((frame - inicio) % CICLO) + CICLO) % CICLO;
  const amplitude = interpolate(frame, [inicio, inicio + 6, paraEm - 10, paraEm], [0, 1, 1, 0], clamp);
  const pulo = PULO * amplitude * Math.sin((fase / CICLO) * Math.PI);

  return (
    <div
      style={{
        width: 150,
        height: 150,
        borderRadius: 75,
        background: cores.amarelo,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 50px rgba(255,212,0,0.45)",
        opacity: op(p),
        transform: `translateY(${pulo}px) scale(${0.5 + 0.5 * p})`,
      }}
    >
      <ArrowDown size={96} color={cores.noite} strokeWidth={3.4} />
    </div>
  );
};
