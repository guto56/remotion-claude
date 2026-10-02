import { Stethoscope } from "lucide-react";
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { copy } from "../copy";
import type { Layout } from "../layout";
import { entra } from "../lib";
import { cores, tipo } from "../theme";
import { GANCHO } from "../timing";
import { KineticHeadline } from "../components/KineticHeadline";
import { SegmentChip } from "../components/SegmentChip";

// Cena 1 (0–60): chip "CLÍNICA E CONSULTÓRIO:" (já no frame 0) e o título. O
// celular com as notificações fica em CelularBloqueio. O chip continua na
// cena 2 e sai com o círculo da virada.
export const Gancho: React.FC<{ layout: Layout }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pChip = entra(frame, fps, 0); // scale 0.6 -> 1 a partir do frame 0

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: layout.chipTop,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          transform: `scale(${0.6 + 0.4 * pChip})`,
        }}
      >
        <SegmentChip texto={copy.chip} fundo={cores.amarelo} cor={cores.texto} tamanho={tipo.chip} Icone={Stethoscope} />
      </div>
      <div style={{ position: "absolute", top: layout.tituloNoiteTop, left: layout.lado, right: layout.lado }}>
        <KineticHeadline
          texto={copy.gancho}
          inicio={GANCHO.titulo}
          saiEm={GANCHO.tituloSai}
          tom="escuro"
          tamanho={layout.tituloNoiteTamanho}
        />
      </div>
    </>
  );
};
