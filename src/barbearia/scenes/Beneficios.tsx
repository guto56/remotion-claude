import React from "react";
import { AbsoluteFill } from "remotion";
import { copy } from "../copy";
import type { Layout } from "../layout";
import { cores, tipo } from "../theme";
import { BENEFICIOS } from "../timing";
import { ChecklistItem } from "../components/ChecklistItem";
import { KineticHeadline } from "../components/KineticHeadline";

// Cena 5 (465–570): título e os 4 benefícios (um a cada 18 frames). Frames
// relativos ao início da cena.
export const Beneficios: React.FC<{ layout: Layout }> = ({ layout }) => (
  <AbsoluteFill style={{ backgroundColor: cores.claro }}>
    <div style={{ position: "absolute", top: layout.beneficios.tituloTop, left: layout.lado, right: layout.lado }}>
      <KineticHeadline texto={copy.beneficiosTitulo} inicio={BENEFICIOS.titulo} tom="claro" tamanho={tipo.titulo} />
    </div>
    <div
      style={{
        position: "absolute",
        top: layout.beneficios.itensTop,
        left: layout.lado,
        right: layout.lado,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* bloco centralizado, itens alinhados à esquerda entre si */}
      <div style={{ display: "flex", flexDirection: "column", gap: layout.beneficios.itemEspaco - 60 }}>
        {copy.beneficios.map((item, i) => (
          <ChecklistItem key={item} texto={item} inicio={BENEFICIOS.itens + i * BENEFICIOS.intervalo} />
        ))}
      </div>
    </div>
  </AbsoluteFill>
);
