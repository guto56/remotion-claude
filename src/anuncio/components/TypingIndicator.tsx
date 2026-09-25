import React from "react";
import { useCurrentFrame } from "remotion";
import { colors, radius, shadow } from "../theme";

// "Digitando...": balão da assistente com 3 pontos pulsando.
export const TypingIndicator: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        alignSelf: "flex-start",
        display: "flex",
        gap: 10,
        padding: "24px 28px",
        background: colors.mint,
        borderRadius: radius.bubble,
        borderBottomLeftRadius: 8,
        boxShadow: shadow.soft,
      }}
    >
      {[0, 1, 2].map((i) => {
        const wave = 0.5 + 0.5 * Math.sin(frame * 0.55 - i * 1.1);
        return (
          <div
            key={i}
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              background: colors.brand,
              opacity: 0.35 + 0.65 * wave,
              scale: 0.75 + 0.35 * wave,
            }}
          />
        );
      })}
    </div>
  );
};
