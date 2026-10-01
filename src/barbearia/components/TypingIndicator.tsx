import React from "react";
import { useCurrentFrame } from "remotion";
import { cores, raio, sombra } from "../theme";

// "Digitando...": balão da assistente com 3 pontos pulsando.
export const TypingIndicator: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        alignSelf: "flex-start",
        display: "flex",
        gap: 9,
        padding: "20px 24px",
        background: cores.menta,
        borderRadius: raio.balao,
        borderBottomLeftRadius: 8,
        boxShadow: sombra.balao,
      }}
    >
      {[0, 1, 2].map((i) => {
        const onda = 0.5 + 0.5 * Math.sin(frame * 0.6 - i * 1.1);
        return (
          <div
            key={i}
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              background: cores.marca,
              opacity: 0.35 + 0.65 * onda,
              transform: `scale(${0.75 + 0.35 * onda})`,
            }}
          />
        );
      })}
    </div>
  );
};
