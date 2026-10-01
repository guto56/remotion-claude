import React from "react";
import { AbsoluteFill } from "remotion";
import type { Layout } from "../layout";

// Faixas cobertas pela interface do Reels (vermelho semitransparente) e as
// margens laterais. Só para conferir o layout (prop showSafeZone).
export const SafeZoneOverlay: React.FC<{ layout: Layout }> = ({ layout }) => {
  const faixa: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    background: "rgba(239,68,68,0.35)",
  };
  const lado: React.CSSProperties = {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: layout.lado,
    background: "rgba(239,68,68,0.18)",
  };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {layout.faixas ? (
        <>
          <div style={{ ...faixa, top: 0, height: layout.faixas.topo }} />
          <div style={{ ...faixa, top: layout.faixas.base, bottom: 0 }} />
        </>
      ) : null}
      <div style={{ ...lado, left: 0 }} />
      <div style={{ ...lado, right: 0 }} />
    </AbsoluteFill>
  );
};
