import { Zap } from "lucide-react";
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { copy } from "../copy";
import { CELULAR, type Layout } from "../layout";
import { entra, op, zoomLento } from "../lib";
import { cores, tipo } from "../theme";
import { CENAS, DEMO } from "../timing";
import { Conversation } from "../components/Conversation";
import { PhoneFrame } from "../components/PhoneFrame";
import { SegmentChip } from "../components/SegmentChip";

const BASE_ZOOM = CELULAR.altura - CELULAR.borda - CELULAR.entrada - CELULAR.indicador;

// Cena 4 (195–465): o celular sobe com a conversa e a etiqueta "Respondeu em 3
// segundos" aparece junto com a 1ª resposta. Esta sequência começa no 150
// (virada); os tempos de DEMO são absolutos.
export const Demonstracao: React.FC<{ layout: Layout }> = ({ layout }) => {
  const frame = useCurrentFrame() + CENAS.virada;
  const { fps } = useVideoConfig();
  if (frame < DEMO.entraCelular - 1) return null;

  const pCelular = entra(frame, fps, DEMO.entraCelular);
  const escala = layout.celularDemo.escala * zoomLento(frame, CENAS.demo, CENAS.beneficios);
  const pEtiqueta = entra(frame, fps, DEMO.etiqueta);

  return (
    <>
      {frame >= DEMO.etiqueta ? (
        <div
          style={{
            position: "absolute",
            top: layout.etiquetaTop,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            opacity: op(pEtiqueta),
            transform: `scale(${0.7 + 0.3 * pEtiqueta})`,
          }}
        >
          <SegmentChip texto={copy.etiqueta} fundo={cores.marca} cor={cores.branco} tamanho={tipo.etiqueta} Icone={Zap} />
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: layout.largura / 2 - CELULAR.largura / 2,
          top: layout.celularDemo.top,
          transform: `translateY(${(1 - pCelular) * 1100}px) scale(${escala})`,
          // o zoom cresce para cima a partir da base das mensagens, que fica
          // parada em y≈1238 no Reels
          transformOrigin: `50% ${BASE_ZOOM}px`,
        }}
      >
        <PhoneFrame tela={cores.telaConversa}>
          <Conversation inicio={CENAS.virada} />
        </PhoneFrame>
      </div>
    </>
  );
};
