import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import React from "react";
import { AbsoluteFill } from "remotion";
import { AUDIO_ENABLED, CENAS, TRANSICAO } from "../config";
import { AudioManual } from "./AudioManual";
import { CenaCta } from "./cenas/Cta";
import { CenaGancho } from "./cenas/Gancho";
import { CenaPaginas } from "./cenas/Paginas";
import { CenaPromessa } from "./cenas/Promessa";
import { CenaVidro } from "./cenas/Vidro";

const T = TRANSICAO.cena;
const timing = linearTiming({ durationInFrames: T });
// Cada cena (menos a última) dura T frames a mais: é o trecho em que ela
// sai por baixo da próxima. Assim o total fica em exatos 1200 frames.
const dur = (c: { inicio: number; fim: number }, comTransicao = true) =>
  c.fim - c.inicio + (comTransicao ? T : 0);

export const ManualPintura: React.FC = () => (
  <AbsoluteFill>
    <TransitionSeries>
      <TransitionSeries.Sequence name="1 · Gancho" durationInFrames={dur(CENAS.gancho)}>
        <CenaGancho />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence name="2 · Promessa" durationInFrames={dur(CENAS.promessa)}>
        <CenaPromessa />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={timing} />
      <TransitionSeries.Sequence name="3 · Páginas" durationInFrames={dur(CENAS.paginas)}>
        <CenaPaginas />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={timing} />
      <TransitionSeries.Sequence name="4 · Vidro" durationInFrames={dur(CENAS.vidro)}>
        <CenaVidro />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence name="5 · CTA" durationInFrames={dur(CENAS.cta, false)}>
        <CenaCta />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    {AUDIO_ENABLED ? <AudioManual /> : null}
  </AbsoluteFill>
);
