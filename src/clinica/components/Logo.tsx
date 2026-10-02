import React from "react";
import { Img } from "remotion";
import { optionalStaticFile } from "../../anuncio/lib/static";
import { cores, fontes } from "../theme";

// Logo de public/logo.png num círculo branco (a logo é verde e o fundo da
// chamada é escuro). Sem o arquivo, mostra as iniciais "CA".
export const Logo: React.FC<{ tamanho: number }> = ({ tamanho }) => {
  const src = optionalStaticFile("logo.png");
  return (
    <div
      style={{
        width: tamanho,
        height: tamanho,
        borderRadius: tamanho / 2,
        background: cores.branco,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 12px 34px rgba(0,0,0,0.35)",
        color: cores.marca,
        fontFamily: fontes.titulo,
        fontWeight: 800,
        fontSize: tamanho * 0.4,
      }}
    >
      {src ? <Img src={src} style={{ width: "66%", height: "66%", objectFit: "contain" }} /> : "CA"}
    </div>
  );
};
