import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CtaArrow } from "../components/CtaArrow";
import { KineticHeadline } from "../components/KineticHeadline";
import { Logo } from "../components/Logo";
import { copy } from "../copy";
import type { Layout } from "../layout";
import { enter, fadeFrom } from "../lib/motion";
import { colors, fonts, type } from "../theme";
import { CTA } from "../timing";

// Cena 7: chamada final. Nada sai de cena: o último frame vira capa.
// frame 0 = SCENES.cta
export const CtaScene: React.FC<{ layout: Layout }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const side = layout.safe.side;
  const logo = enter(frame, fps, CTA.logo);
  const name = enter(frame, fps, CTA.empresa);
  const sub = enter(frame, fps, CTA.subtexto);

  const block = (top: number): React.CSSProperties => ({
    position: "absolute",
    top,
    left: side,
    right: side,
    textAlign: "center",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${colors.brand} 0%, ${colors.night} 100%)`,
      }}
    >
      <div
        style={{
          ...block(layout.cta.logoTop),
          display: "flex",
          justifyContent: "center",
          opacity: fadeFrom(logo),
          scale: 0.6 + 0.4 * logo,
        }}
      >
        <Logo size={180} />
      </div>
      <div
        style={{
          ...block(layout.cta.nameTop),
          fontFamily: fonts.title,
          fontWeight: 700,
          fontSize: 48,
          color: colors.white,
          opacity: fadeFrom(name),
          translate: `0px ${(1 - name) * 30}px`,
        }}
      >
        {copy.cta.empresa}
      </div>
      <div style={block(layout.cta.titleTop)}>
        <KineticHeadline
          text={copy.cta.titulo}
          start={CTA.titulo}
          tone="dark"
          fontSize={type.ctaTitle}
        />
      </div>
      <div style={block(layout.cta.lineTop)}>
        <KineticHeadline
          text={copy.cta.chamada}
          start={CTA.chamada}
          tone="dark"
          fontSize={52}
          fontWeight={700}
          lineHeight={1.2}
        />
      </div>
      <div
        style={{
          ...block(layout.cta.subTop),
          fontFamily: fonts.ui,
          fontWeight: 500,
          fontSize: 34,
          color: "rgba(255,255,255,0.8)",
          opacity: fadeFrom(sub),
          translate: `0px ${(1 - sub) * 30}px`,
        }}
      >
        {copy.cta.subtexto}
      </div>
      <CtaArrow start={CTA.seta} top={layout.cta.arrowTop} />
    </AbsoluteFill>
  );
};
