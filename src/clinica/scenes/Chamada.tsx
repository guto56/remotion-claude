import React from "react";
import { AbsoluteFill, Freeze, useCurrentFrame, useVideoConfig } from "remotion";
import { copy } from "../copy";
import type { Layout } from "../layout";
import { entra, op } from "../lib";
import { cores, fontes, raio, tipo } from "../theme";
import { CHAMADA } from "../timing";
import { CtaArrow } from "../components/CtaArrow";
import { KineticHeadline } from "../components/KineticHeadline";
import { Logo } from "../components/Logo";

const Conteudo: React.FC<{ layout: Layout }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pLogo = entra(frame, fps, CHAMADA.logo);
  const pPreco = entra(frame, fps, CHAMADA.preco);
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
        <Logo tamanho={tipo.logo} />
      </div>
      <div style={{ position: "absolute", top: c.tituloTop, left: layout.lado, right: layout.lado }}>
        <KineticHeadline texto={copy.cta} inicio={CHAMADA.titulo} tom="escuro" tamanho={tipo.titulo} />
      </div>
      <div
        style={{
          position: "absolute",
          top: c.precoTop,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: op(pPreco),
          transform: `scale(${0.7 + 0.3 * pPreco})`,
        }}
      >
        <div
          style={{
            padding: "22px 44px",
            borderRadius: raio.preco,
            background: cores.branco,
            color: cores.texto,
            fontFamily: fontes.titulo,
            fontWeight: 700,
            fontSize: tipo.preco,
            lineHeight: 1.1,
            whiteSpace: "nowrap",
            boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
          }}
        >
          {copy.preco}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: c.subTop,
          left: layout.lado,
          right: layout.lado,
          textAlign: "center",
          textWrap: "balance",
          fontFamily: fontes.ui,
          fontWeight: 500,
          fontSize: tipo.subtitulo,
          lineHeight: 1.3,
          color: "rgba(255,255,255,0.7)",
          opacity: op(pSub),
          transform: `translateY(${(1 - pSub) * 20}px)`,
        }}
      >
        {copy.ctaSub}
      </div>
      <div style={{ position: "absolute", top: c.setaTop, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <CtaArrow inicio={CHAMADA.seta} paraEm={CHAMADA.parado} />
      </div>
    </AbsoluteFill>
  );
};

// Cena 6 (570–660): logo, chamada, preço, subtítulo e a seta para o botão do
// anúncio. A partir de CHAMADA.parado (últimos 15 frames) a cena congela: o
// loop do Reels não corta nenhum texto e o último frame serve de capa.
export const Chamada: React.FC<{ layout: Layout }> = ({ layout }) => (
  <Freeze frame={CHAMADA.parado} active={(f) => f >= CHAMADA.parado}>
    <Conteudo layout={layout} />
  </Freeze>
);
