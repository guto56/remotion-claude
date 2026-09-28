import type { LucideIcon } from "lucide-react";
import React from "react";
import { fontes, raio } from "../theme";

// Chip de segmento: "DONO DE NEGÓCIO:" (amarelo) ou os chips da demonstração
// (verde marca, com ícone).
export const SegmentChip: React.FC<{
  texto: string;
  fundo: string;
  cor: string;
  tamanho: number; // px da fonte (Montserrat 800)
  Icone?: LucideIcon;
  style?: React.CSSProperties;
}> = ({ texto, fundo, cor, tamanho, Icone, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: tamanho * 0.36,
      padding: `${tamanho * 0.34}px ${tamanho * 0.7}px`,
      borderRadius: raio.chip,
      background: fundo,
      color: cor,
      fontFamily: fontes.titulo,
      fontWeight: 800,
      fontSize: tamanho,
      lineHeight: 1.1,
      whiteSpace: "nowrap",
      boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
      ...style,
    }}
  >
    {Icone ? <Icone size={tamanho * 1.05} strokeWidth={2.6} /> : null}
    {texto}
  </div>
);
