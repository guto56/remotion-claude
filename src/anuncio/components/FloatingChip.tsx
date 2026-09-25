import type { LucideIcon } from "lucide-react";
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { enter, exit, fadeFrom } from "../lib/motion";
import { colors, fonts, radius, shadow, type } from "../theme";
import { MOTION } from "../timing";

// Pílula branca com ícone que entra pela lateral e fica 2 s na tela.
export const FloatingChip: React.FC<{
  icon: LucideIcon;
  text: string;
  start: number;
  side: "left" | "right"; // de que lado entra (e onde encosta)
  top: number;
  margin: number;
}> = ({ icon: Icon, text, start, side, top, margin }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < start - 1 || frame > start + MOTION.chipFrames + MOTION.exitFrames) {
    return null;
  }
  const p = enter(frame, fps, start);
  const out = exit(frame, start + MOTION.chipFrames);
  const dir = side === "left" ? -1 : 1;
  const offscreen = 760;

  return (
    <div
      style={{
        position: "absolute",
        top,
        [side]: margin,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 32px 16px 24px",
        background: colors.white,
        borderRadius: radius.chip,
        boxShadow: shadow.soft,
        fontFamily: fonts.ui,
        fontWeight: 600,
        fontSize: type.chip,
        lineHeight: 1.2,
        color: colors.brand,
        whiteSpace: "nowrap",
        opacity: fadeFrom(p) * out,
        translate: `${dir * ((1 - p) * offscreen + (1 - out) * 200)}px 0px`,
      }}
    >
      <Icon size={38} strokeWidth={2.5} />
      {text}
    </div>
  );
};
