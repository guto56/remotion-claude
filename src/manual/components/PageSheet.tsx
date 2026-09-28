import React from "react";
import { Img, staticFile } from "remotion";
import { PAGINA_PROPORCAO, PAGINAS, SOMBRA_PAPEL } from "../../config";

// Uma página do manual como papel de verdade: fundo branco e sombra suave.
// `sombra` só muda quando a folha é desenhada maior e reduzida com scale()
// (a sombra também é reduzida, então precisa ser proporcionalmente maior).
export const PageSheet: React.FC<{
  pagina: number; // 1 a 5
  largura: number;
  sombra?: string;
  style?: React.CSSProperties;
}> = ({ pagina, largura, sombra = SOMBRA_PAPEL, style }) => (
  <div
    style={{
      width: largura,
      height: largura * PAGINA_PROPORCAO,
      backgroundColor: "#FFFFFF",
      boxShadow: sombra,
      borderRadius: Math.max(2, largura * 0.006),
      overflow: "hidden",
      ...style,
    }}
  >
    <Img
      src={staticFile(PAGINAS[pagina - 1].arquivo)}
      style={{ width: "100%", height: "100%", maxWidth: "none", display: "block" }}
    />
  </div>
);
