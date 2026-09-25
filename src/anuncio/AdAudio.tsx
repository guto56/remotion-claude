import { Audio } from "@remotion/media";
import React from "react";
import { interpolate, Sequence } from "remotion";
import { clamped } from "./lib/motion";
import { optionalStaticFile } from "./lib/static";
import { DEMO, GANCHO, SCENES } from "./timing";

// Volumes
const MUSIC_VOLUME = 0.15;
const SFX_VOLUME = 0.6;
const MUSIC_FADE = 15; // frames de fade in/out da música

// Toca os arquivos de public/ que existirem. Se algum faltar, é só ignorado.
export const AdAudio: React.FC = () => {
  const music = optionalStaticFile("music.mp3");
  const ping = optionalStaticFile("ping.mp3");
  const pop = optionalStaticFile("pop.mp3");
  const swoosh = optionalStaticFile("swoosh.mp3");

  const sfx = (src: string | null, frames: number[], key: string) =>
    src
      ? frames.map((from) => (
          <Sequence key={`${key}-${from}`} from={from} layout="none" name={key}>
            <Audio src={src} volume={SFX_VOLUME} />
          </Sequence>
        ))
      : null;

  // ping: cada notificação da cena 1
  const pings = Array.from({ length: GANCHO.notificacoes }, (_, i) =>
    Math.max(
      0,
      SCENES.gancho + GANCHO.primeiraNotificacao + i * GANCHO.notificacaoACada,
    ),
  );
  // pop: cada mensagem da cena 5
  const pops = DEMO.mensagens.map((m) => SCENES.demo + m);

  return (
    <>
      {music ? (
        <Audio
          src={music}
          loop
          loopVolumeCurveBehavior="extend"
          volume={(f) =>
            interpolate(
              f,
              [0, MUSIC_FADE, SCENES.fim - MUSIC_FADE, SCENES.fim],
              [0, MUSIC_VOLUME, MUSIC_VOLUME, 0],
              clamped,
            )
          }
        />
      ) : null}
      {sfx(ping, pings, "ping")}
      {sfx(pop, pops, "pop")}
      {sfx(swoosh, [SCENES.virada], "swoosh")}
    </>
  );
};
