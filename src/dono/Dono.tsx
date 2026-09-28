import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import React from "react";
import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { circleReveal } from "../anuncio/components/circleReveal";
import { Beneficios } from "./cenas/Beneficios";
import { Chamada } from "./cenas/Chamada";
import { Dado } from "./cenas/Dado";
import { Luz } from "./cenas/Luz";
import { Noite } from "./cenas/Noite";
import { SafeZoneOverlay } from "./components/SafeZoneOverlay";
import { DonoAudio } from "./DonoAudio";
import { getLayout } from "./layout";
import { cores } from "./theme";
import { CENAS, TRANSICAO } from "./timing";

export const donoSchema = z.object({
  formato: z.enum(["reels", "feed"]),
  showSafeZone: z.boolean(), // faixas cobertas pela interface do Reels
  withAudio: z.boolean(),
});

const T = TRANSICAO;
const tempo = (n: number) => linearTiming({ durationInFrames: n });

// Anúncio "Dono" (30 s). Cada sequência dura a cena + a transição de saída,
// para que a cena seguinte comece exatamente no frame da tabela CENAS.
export const Dono: React.FC<z.infer<typeof donoSchema>> = ({ formato, showSafeZone, withAudio }) => {
  const layout = getLayout(formato);
  return (
    <AbsoluteFill style={{ backgroundColor: cores.noite }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="1–2 · Gancho e dor" durationInFrames={CENAS.dado - CENAS.gancho + T.noiteParaDado}>
          <Noite layout={layout} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={tempo(T.noiteParaDado)} />
        <TransitionSeries.Sequence name="3 · Dado" durationInFrames={CENAS.virada - CENAS.dado + T.virada}>
          <Dado layout={layout} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={circleReveal({ color: cores.marca })} timing={tempo(T.virada)} />
        <TransitionSeries.Sequence name="4–5 · Virada e demonstração" durationInFrames={CENAS.beneficios - CENAS.virada + T.demoParaBeneficios}>
          <Luz layout={layout} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-top" })} timing={tempo(T.demoParaBeneficios)} />
        <TransitionSeries.Sequence name="6 · Benefícios" durationInFrames={CENAS.chamada - CENAS.beneficios + T.beneficiosParaChamada}>
          <Beneficios layout={layout} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={tempo(T.beneficiosParaChamada)} />
        <TransitionSeries.Sequence name="7 · Chamada" durationInFrames={CENAS.fim - CENAS.chamada}>
          <Chamada layout={layout} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      {withAudio ? <DonoAudio /> : null}
      {showSafeZone ? <SafeZoneOverlay layout={layout} /> : null}
    </AbsoluteFill>
  );
};
