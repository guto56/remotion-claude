import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { CORES, SAFE } from "../../config";
import { FONTES, suave } from "../base";
import { Palavras } from "./Palavras";

// Legenda de cada página: fundo verde, cantos de 40 px, título (Medium),
// descrição (Light) e o contador "1/5" escrito à mão à direita.
export const LabelChip: React.FC<{
  titulo: string;
  descricao: string;
  contador: string;
  inicio: number;
  top: number;
  altura: number;
}> = ({ titulo, descricao, contador, inicio, top, altura }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = suave(frame, fps, inicio);

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        width: SAFE.right - SAFE.left,
        top,
        height: altura,
        borderRadius: 40,
        backgroundColor: CORES.verde,
        boxShadow: "0 14px 30px rgba(46,58,35,0.25)",
        display: "flex",
        alignItems: "center",
        padding: "0 44px",
        gap: 24,
        opacity: p,
        transform: `translateY(${(1 - p) * 40}px)`,
      }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, color: CORES.branco }}>
        <Palavras
          texto={titulo}
          inicio={inicio + 4}
          alinhar="flex-start"
          style={{ fontFamily: FONTES.poppins, fontWeight: 500, fontSize: 44, lineHeight: 1.15 }}
        />
        <Palavras
          texto={descricao}
          inicio={inicio + 10}
          alinhar="flex-start"
          style={{ fontFamily: FONTES.poppins, fontWeight: 300, fontSize: 31, lineHeight: 1.25, opacity: 0.95 }}
        />
      </div>
      <div
        style={{
          fontFamily: FONTES.caveat,
          fontWeight: 600,
          fontSize: 60,
          color: CORES.verdeClaro,
          transform: "rotate(-6deg)",
          opacity: suave(frame, fps, inicio + 12),
        }}
      >
        {contador}
      </div>
    </div>
  );
};
