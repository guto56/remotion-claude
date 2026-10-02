import { Check } from "lucide-react";
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { entra, op } from "../lib";
import { cores, fontes, tipo } from "../theme";

// Item da lista de benefícios: check verde marca + texto escuro (Inter 600).
export const ChecklistItem: React.FC<{ texto: string; inicio: number }> = ({ texto, inicio }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = entra(frame, fps, inicio);
  const check = entra(frame, fps, inicio + 4);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        opacity: op(p),
        transform: `translateX(${(1 - p) * -60}px)`,
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          flexShrink: 0,
          background: cores.marca,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${0.6 + 0.4 * check})`,
        }}
      >
        <Check size={38} color={cores.branco} strokeWidth={3.5} />
      </div>
      <div
        style={{
          fontFamily: fontes.ui,
          fontWeight: 600,
          fontSize: tipo.checklist,
          lineHeight: 1.2,
          color: cores.texto,
        }}
      >
        {texto}
      </div>
    </div>
  );
};
