import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../lib";
import { cores, fontes, tipo } from "../theme";

// Número gigante contando de 1 até `ate`, com sufixo ("21x") e pulso no fim.
export const StatCounter: React.FC<{ ate: number; sufixo: string; de: number; fim: number }> = ({
  ate,
  sufixo,
  de,
  fim,
}) => {
  const frame = useCurrentFrame();
  const valor = Math.round(
    interpolate(frame, [de, fim], [1, ate], { ...clamp, easing: Easing.out(Easing.cubic) }),
  );
  const pulso = interpolate(frame, [fim, fim + 5, fim + 12], [1, 1.08, 1], clamp);
  const entrada = interpolate(frame, [de - 4, de + 4], [0, 1], clamp);

  return (
    <div
      style={{
        fontFamily: fontes.titulo,
        fontWeight: 800,
        fontSize: tipo.numero,
        lineHeight: 1,
        color: cores.amarelo,
        textAlign: "center",
        fontVariantNumeric: "tabular-nums",
        opacity: entrada,
        transform: `scale(${pulso * (0.9 + 0.1 * entrada)})`,
      }}
    >
      {valor}
      {sufixo}
    </div>
  );
};
