import { ArrowDown } from "lucide-react";
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { enter, fadeFrom } from "../lib/motion";
import { colors } from "../theme";

// Seta amarela apontando para o botão do anúncio. Pulsa 0 -> 20 -> 0 px a cada 24 frames.
export const CtaArrow: React.FC<{ start: number; top: number }> = ({
  start,
  top,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, start);
  const t = Math.max(0, frame - start);
  const bounce = 10 - 10 * Math.cos((2 * Math.PI * t) / 24);

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: fadeFrom(p),
        scale: 0.5 + 0.5 * p,
      }}
    >
      <div
        style={{
          translate: `0px ${bounce}px`,
          filter: "drop-shadow(0 0 24px rgba(255,212,0,0.45))",
        }}
      >
        <ArrowDown size={120} color={colors.yellow} strokeWidth={3} />
      </div>
    </div>
  );
};
