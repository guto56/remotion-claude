import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import React from "react";
import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { circleReveal } from "../anuncio/components/circleReveal";
import { BarbeariaAudio } from "./BarbeariaAudio";
import { CelularBloqueio } from "./components/CelularBloqueio";
import { SafeZoneOverlay } from "./components/SafeZoneOverlay";
import { getLayout } from "./layout";
import { Beneficios } from "./scenes/Beneficios";
import { Chamada } from "./scenes/Chamada";
import { Demonstracao } from "./scenes/Demonstracao";
import { Dor } from "./scenes/Dor";
import { Gancho } from "./scenes/Gancho";
import { Virada } from "./scenes/Virada";
import { cores } from "./theme";
import { CENAS, TRANSICAO } from "./timing";

export const barbeariaSchema = z.object({
  formato: z.enum(["reels", "feed"]),
  showSafeZone: z.boolean(), // faixas cobertas pela interface do Reels
  withAudio: z.boolean(),
});

const T = TRANSICAO;
const tempo = (n: number) => linearTiming({ durationInFrames: n });

// Anúncio "Barbearia" (22 s). Cada sequência dura a cena + a transição de
// saída, para que a cena seguinte comece exatamente no frame da tabela CENAS.
// As cenas 1–2 dividem o mesmo celular, e as cenas 3–4 o mesmo fundo claro.
export const Barbearia: React.FC<z.infer<typeof barbeariaSchema>> = ({ formato, showSafeZone, withAudio }) => {
  const layout = getLayout(formato);
  return (
    <AbsoluteFill style={{ backgroundColor: cores.noite }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="1–2 · Gancho e dor" durationInFrames={CENAS.virada - CENAS.gancho + T.virada}>
          <AbsoluteFill style={{ backgroundColor: cores.noite }}>
            <CelularBloqueio layout={layout} />
            <Gancho layout={layout} />
            <Dor layout={layout} />
          </AbsoluteFill>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={circleReveal({ color: cores.marca })} timing={tempo(T.virada)} />
        <TransitionSeries.Sequence
          name="3–4 · Virada e demonstração"
          durationInFrames={CENAS.beneficios - CENAS.virada + T.demoParaBeneficios}
        >
          <AbsoluteFill style={{ backgroundColor: cores.claro }}>
            <Virada layout={layout} />
            <Demonstracao layout={layout} />
          </AbsoluteFill>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={tempo(T.demoParaBeneficios)} />
        <TransitionSeries.Sequence
          name="5 · Benefícios"
          durationInFrames={CENAS.chamada - CENAS.beneficios + T.beneficiosParaChamada}
        >
          <Beneficios layout={layout} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={tempo(T.beneficiosParaChamada)} />
        <TransitionSeries.Sequence name="6 · Chamada" durationInFrames={CENAS.fim - CENAS.chamada}>
          <Chamada layout={layout} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      {withAudio ? <BarbeariaAudio /> : null}
      {showSafeZone ? <SafeZoneOverlay layout={layout} /> : null}
    </AbsoluteFill>
  );
};
