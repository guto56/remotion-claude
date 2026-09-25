import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import React from "react";
import { AbsoluteFill, CalculateMetadataFunction, Easing } from "remotion";
import { z } from "zod";
import { AdAudio } from "./AdAudio";
import { circleReveal } from "./components/circleReveal";
import { SafeZoneOverlay } from "./components/SafeZoneOverlay";
import { getLayout } from "./layout";
import { CtaScene } from "./scenes/CtaScene";
import { LightScene } from "./scenes/LightScene";
import { NightScene } from "./scenes/NightScene";
import { StatScene } from "./scenes/StatScene";
import { colors } from "./theme";
import { SCENES, TRANSITIONS } from "./timing";

export const anuncioSchema = z.object({
  gancho: z.enum(["dor", "pergunta"]), // texto da cena 1
  formato: z.enum(["reels", "feed"]), // reels = 1080x1920, feed = 1080x1350
  showSafeZone: z.boolean(), // desenha as faixas cobertas pelo Instagram
  withAudio: z.boolean(),
});

export type AnuncioProps = z.infer<typeof anuncioSchema>;

// A altura acompanha o formato (útil se trocar o formato no painel do Studio).
export const calculateAnuncioMetadata: CalculateMetadataFunction<
  AnuncioProps
> = ({ props }) => ({ height: getLayout(props.formato).height });

// Cada bloco dura até a próxima cena + a transição (que sobrepõe os dois),
// assim cada cena começa exatamente no frame definido em SCENES.
export const Anuncio: React.FC<AnuncioProps> = ({
  gancho,
  formato,
  showSafeZone,
  withAudio,
}) => {
  const layout = getLayout(formato);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.night }}>
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="Cenas 1-2 (gancho e dor)"
          durationInFrames={SCENES.dado - SCENES.gancho + TRANSITIONS.noiteParaDado}
        >
          <NightScene gancho={gancho} layout={layout} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITIONS.noiteParaDado })}
        />
        <TransitionSeries.Sequence
          name="Cena 3 (dado)"
          durationInFrames={SCENES.virada - SCENES.dado + TRANSITIONS.circulo}
        >
          <StatScene layout={layout} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={circleReveal({ color: colors.brand })}
          timing={linearTiming({
            durationInFrames: TRANSITIONS.circulo,
            easing: Easing.inOut(Easing.cubic),
          })}
        />
        <TransitionSeries.Sequence
          name="Cenas 4-6 (virada, demo, benefícios)"
          durationInFrames={SCENES.cta - SCENES.virada + TRANSITIONS.paraCta}
        >
          <LightScene layout={layout} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({
            durationInFrames: TRANSITIONS.paraCta,
            easing: Easing.out(Easing.cubic),
          })}
        />
        <TransitionSeries.Sequence
          name="Cena 7 (chamada)"
          durationInFrames={SCENES.fim - SCENES.cta}
        >
          <CtaScene layout={layout} />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {withAudio ? <AdAudio gancho={gancho} /> : null}
      {showSafeZone ? <SafeZoneOverlay layout={layout} /> : null}
    </AbsoluteFill>
  );
};
