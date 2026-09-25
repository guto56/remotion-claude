import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { KineticHeadline } from "../components/KineticHeadline";
import { StatCounter } from "../components/StatCounter";
import { copy } from "../copy";
import type { Layout } from "../layout";
import { clamped } from "../lib/motion";
import { colors, fonts, type } from "../theme";
import { DADO } from "../timing";

// Cena 3: o dado. frame 0 = SCENES.dado
export const StatScene: React.FC<{ layout: Layout }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const sourceIn = interpolate(frame, [DADO.fonte, DADO.fonte + 10], [0, 1], clamped);
  const drift = interpolate(frame, [0, 110], [1, 1.04]);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.night }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(255,212,0,0.14), transparent 55%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: layout.safe.top,
          height: layout.safe.bottom - layout.safe.top,
          left: layout.safe.side,
          right: layout.safe.side,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          scale: drift,
        }}
      >
        <StatCounter
          from={1}
          to={copy.dado.numero}
          suffix={copy.dado.sufixo}
          start={0}
          end={DADO.contagemFim}
        />
        <KineticHeadline
          text={copy.dado.texto}
          start={DADO.texto}
          tone="dark"
          fontSize={type.statText}
          fontWeight={700}
          lineHeight={1.15}
        />
        <div
          style={{
            fontFamily: fonts.ui,
            fontWeight: 400,
            fontSize: type.statSource,
            color: "rgba(255,255,255,0.6)",
            textAlign: "center",
            opacity: sourceIn,
          }}
        >
          {copy.dado.fonte}
        </div>
      </div>
    </AbsoluteFill>
  );
};
