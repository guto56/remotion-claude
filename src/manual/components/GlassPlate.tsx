import React from "react";

// Placa de vidro: branco a 12%, borda branca a 40%, reflexo diagonal e sombra.
export const GlassPlate: React.FC<{
  largura: number;
  altura: number;
  style?: React.CSSProperties;
}> = ({ largura, altura, style }) => (
  <div
    style={{
      width: largura,
      height: altura,
      borderRadius: 18,
      border: "3px solid rgba(255,255,255,0.4)",
      // Sobre papel branco o branco some: uma linha escura fina marca a aresta
      // e um brilho interno dá a espessura do vidro
      boxShadow:
        "0 20px 40px rgba(0,0,0,0.18), 0 0 0 1.5px rgba(46,58,35,0.28), inset 0 0 0 6px rgba(255,255,255,0.35), inset 0 0 28px rgba(120,150,170,0.18)",
      // reflexo diagonal por cima do branco a 12%
      background:
        "linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.15) 22%, rgba(255,255,255,0) 36%, rgba(200,220,235,0.22) 46%, rgba(255,255,255,0.55) 52%, rgba(255,255,255,0) 62%), rgba(255,255,255,0.12)",
      ...style,
    }}
  />
);
