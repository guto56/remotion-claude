import { ArrowDown } from "lucide-react";
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { entra, op } from "../lib";
import { cores } from "../theme";

// Seta amarela grande apontando para o botão do anúncio, pulsando
// (translateY 0 -> 20 -> 0 em loop de 20 frames).
export const CtaArrow: React.FC<{ inicio: number }> = ({ inicio }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = entra(frame, fps, inicio);
  const fase = (((frame - inicio) % 20) + 20) % 20;
  const pulo = 20 * Math.sin((fase / 20) * Math.PI);

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
