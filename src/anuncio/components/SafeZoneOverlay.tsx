import React from "react";
import { AbsoluteFill } from "remotion";
import type { Layout } from "../layout";
import { fonts } from "../theme";

const RED = "rgba(239,68,68,0.40)";

// Guia de conferência (prop showSafeZone). Não aparece no vídeo final.
// Reels: faixas cobertas pela interface do Instagram (250 px no topo, 670 px embaixo).
// Ambos: margens laterais de 64 px.
export const SafeZoneOverlay: React.FC<{ layout: Layout }> = ({ layout }) => {
  const label: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontFamily: fonts.ui,
    fontWeight: 600,
    fontSize: 28,
    color: "white",
  };
  const side = layout.safe.side;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {layout.overlay.top > 0 ? (
        <div
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: layout.overlay.top, background: RED }}
        >
          <div style={{ ...label, bottom: 16 }}>Coberto pela interface (topo)</div>
        </div>
      ) : null}
      {layout.overlay.bottom > 0 ? (
        <div
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: layout.overlay.bottom, background: RED }}
        >
          <div style={{ ...label, top: 16 }}>Coberto pela interface (base)</div>
        </div>
      ) : null}
      <div
        style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: side, background: "rgba(239,68,68,0.18)" }}
      />
      <div
        style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: side, background: "rgba(239,68,68,0.18)" }}
      />
    </AbsoluteFill>
  );
};
