import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { copy } from "../copy";
import type { Layout } from "../layout";
import { entra } from "../lib";
import { tipo } from "../theme";
import { CENAS, MOVIMENTO, VIRADA } from "../timing";
import { KineticHeadline } from "../components/KineticHeadline";

// Cena 3 (150–195): o título entra no meio da tela enquanto o círculo verde
// revela o fundo claro. Quando o celular da cena 4 sobe, o título encolhe e
// vai para o topo, e sai antes da etiqueta "Respondeu em 3 segundos". Assim
// ele fica legível por ~2 s em vez de 1,5 s.
export const Virada: React.FC<{ layout: Layout }> = ({ layout }) => {
  const frame = useCurrentFrame() + CENAS.virada; // frame absoluto
  const { fps } = useVideoConfig();
  if (frame >= VIRADA.sai + MOVIMENTO.saida) return null;

  const v = layout.virada;
  const sobe = entra(frame, fps, VIRADA.sobe);
  const y = interpolate(sobe, [0, 1], [0, v.topoTop - v.top]);
  const escala = interpolate(sobe, [0, 1], [1, v.topoEscala]);

  return (
    <div
      style={{
        position: "absolute",
        top: v.top,
        left: layout.lado,
        right: layout.lado,
        transform: `translateY(${y}px) scale(${escala})`,
        transformOrigin: "50% 0%",
      }}
    >
      {/* KineticHeadline usa o frame da sequência (relativo ao 150) */}
      <KineticHeadline
        texto={copy.virada}
        inicio={VIRADA.titulo - CENAS.virada}
        saiEm={VIRADA.sai - CENAS.virada}
        tom="claro"
        tamanho={tipo.titulo}
      />
    </div>
  );
};
