import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { copy } from "../copy";
import type { Layout } from "../layout";
import { entra, op } from "../lib";
import { cores, fontes, tipo } from "../theme";
import { CHAMADA } from "../timing";
import { CtaArrow } from "../components/CtaArrow";
import { KineticHeadline } from "../components/KineticHeadline";
import { Logo } from "../components/Logo";

// Cena 7 (795–900): logo, chamada, subtítulo e a seta apontando para o botão
// do anúncio. O último frame fica completo (vira capa). Frames relativos à cena.
export const Chamada: React.FC<{ layout: Layout }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pLogo = entra(frame, fps, CHAMADA.logo);
  const pSub = entra(frame, fps, CHAMADA.sub);
  const c = layout.chamada;

  return (
    <AbsoluteFill style={{ backgroundColor: cores.noite }}>
      <div
        style={{
          position: "absolute",
          top: c.logoTop,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: op(pLogo),
          transform: `scale(${0.6 + 0.4 * pLogo})`,
        }}
      >
        <Logo tamanho={160} />
      </div>
      <div style={{ position: "absolute", top: c.tituloTop, left: layout.lado, right: layout.lado }}>
        <KineticHeadline texto={copy.cta} inicio={CHAMADA.titulo} tom="escuro" tamanho={tipo.titulo} />
      </div>
      <div
        style={{
          position: "absolute",
          top: c.subTop,
          left: layout.lado,
          right: layout.lado,
          textAlign: "center",
          fontFamily: fontes.ui,
          fontWeight: 600,
          fontSize: tipo.subtitulo,
          color: "rgba(255,255,255,0.8)",
          opacity: op(pSub),
          transform: `translateY(${(1 - pSub) * 20}px)`,
        }}
      >
        {copy.ctaSub}
      </div>
      <div style={{ position: "absolute", top: c.setaTop, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <CtaArrow inicio={CHAMADA.seta} />
      </div>
    </AbsoluteFill>
  );
};
