import React from "react";
import { AbsoluteFill } from "remotion";
import { copy } from "../copy";
import type { Layout } from "../layout";
import { cores, tipo } from "../theme";
import { BENEFICIOS } from "../timing";
import { ChecklistItem } from "../components/ChecklistItem";
import { KineticHeadline } from "../components/KineticHeadline";

// Cena 6 (705–795): fundo verde marca, título e os 4 benefícios (um a cada 15
// frames). Frames relativos ao início da cena.
export const Beneficios: React.FC<{ layout: Layout }> = ({ layout }) => (
  <AbsoluteFill style={{ backgroundColor: cores.marca }}>
    <div style={{ position: "absolute", top: layout.beneficios.tituloTop, left: layout.lado, right: layout.lado }}>
      <KineticHeadline texto={copy.beneficiosTitulo} inicio={BENEFICIOS.titulo} tom="marca" tamanho={tipo.titulo} />
    </div>
    <div
      style={{
        position: "absolute",
        top: layout.beneficios.itensTop,
        left: layout.lado + 20,
        right: layout.lado,
        display: "flex",
        flexDirection: "column",
        gap: layout.beneficios.itemEspaco - 110,
      }}
    >
      {copy.beneficios.map((item, i) => (
        <ChecklistItem key={item} texto={item} inicio={BENEFICIOS.itens + i * BENEFICIOS.intervalo} />
      ))}
    </div>
  </AbsoluteFill>
);
