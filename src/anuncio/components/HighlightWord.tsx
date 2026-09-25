import React from "react";
import { useCurrentFrame } from "remotion";

// Palavra destacada. Com `shakeFrom`, treme de leve ao entrar (ex.: "concorrente").
export const HighlightWord: React.FC<{
  children: React.ReactNode;
  color: string;
  shakeFrom?: number;
}> = ({ children, color, shakeFrom }) => {
  const frame = useCurrentFrame();
  let x = 0;
  if (shakeFrom !== undefined && frame >= shakeFrom) {
    const t = frame - shakeFrom;
    x = Math.sin(t * 1.8) * 10 * Math.max(0, 1 - t / 18);
  }
  return (
    <span style={{ color, display: "inline-block", translate: `${x}px 0px` }}>
      {children}
    </span>
  );
};
