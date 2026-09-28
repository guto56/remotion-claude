import { Check } from "lucide-react";
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { entra, op } from "../lib";
import { cores, fontes, tipo } from "../theme";

// Item da lista de benefícios: check amarelo + texto branco (Montserrat 700).
export const ChecklistItem: React.FC<{ texto: string; inicio: number }> = ({ texto, inicio }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = entra(frame, fps, inicio);
  const check = entra(frame, fps, inicio + 4);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 26,
        opacity: op(p),
        transform: `translateX(${(1 - p) * -60}px)`,
      }}
    >
      <div
        style={{
          width: 62,
          height: 62,
          borderRadius: 31,
          flexShrink: 0,
          background: cores.amarelo,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${0.6 + 0.4 * check})`,
        }}
      >
        <Check size={40} color={cores.noite} strokeWidth={3.5} />
      </div>
      <div
        style={{
          fontFamily: fontes.titulo,
          fontWeight: 700,
          fontSize: tipo.checklist,
          lineHeight: 1.18,
          color: cores.branco,
          paddingTop: 3,
          textWrap: "balance",
        }}
      >
        {texto}
      </div>
    </div>
  );
};
