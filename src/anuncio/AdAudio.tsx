import { Audio } from "@remotion/media";
import React from "react";
import { interpolate, Sequence } from "remotion";
import { clamped } from "./lib/motion";
import { optionalStaticFile } from "./lib/static";
import { DADO, DEMO, DOR, GANCHO, SCENES, VOZ } from "./timing";

// Volumes
const MUSIC_VOLUME = 0.15;
const MUSIC_DUCK = 0.45; // quanto a música abaixa enquanto alguém fala (45%)
const SFX_VOLUME = 0.6;
const VOICE_VOLUME = 1;
const MUSIC_FADE = 15; // frames de fade in/out da música

// Toca os arquivos de public/ que existirem. Se algum faltar, é só ignorado.
export const AdAudio: React.FC<{ gancho: "dor" | "pergunta" }> = ({ gancho }) => {
  const music = optionalStaticFile("music.mp3");
  const ping = optionalStaticFile("ping.mp3");
  const pop = optionalStaticFile("pop.mp3");
  const swoosh = optionalStaticFile("swoosh.mp3");
  const relogio = optionalStaticFile("relogio.mp3");
  const impacto = optionalStaticFile("impacto.mp3");
  const sucesso = optionalStaticFile("sucesso.mp3");

  const falas = VOZ.filter((f) => f.gancho === undefined || f.gancho === gancho)
    .map((f) => ({ ...f, src: optionalStaticFile(`voz/${f.arquivo}.mp3`) }))
    .filter((f): f is typeof f & { src: string } => f.src !== null);

  const sfx = (
    src: string | null,
    frames: number[],
    key: string,
    volume = SFX_VOLUME,
  ) =>
    src
      ? frames.map((from) => (
          <Sequence key={`${key}-${from}`} from={from} layout="none" name={key}>
            <Audio src={src} volume={volume} />
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
  const confirmacao = SCENES.demo + DEMO.mensagens[DEMO.mensagens.length - 1];

  // 0 = ninguém falando, 1 = fala em andamento (com rampas de 6/8 frames)
  const speaking = (f: number) =>
    Math.max(
      0,
      ...falas.map((fala) =>
        interpolate(
          f,
          [fala.de - 6, fala.de, fala.de + fala.frames, fala.de + fala.frames + 8],
          [0, 1, 1, 0],
          clamped,
        ),
      ),
    );

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
            ) *
            (1 - MUSIC_DUCK * speaking(f))
          }
        />
      ) : null}

      {/* Efeitos */}
      {/* pings mais baixos: tocam junto com a fala do gancho */}
      {sfx(ping, pings, "ping", 0.3)}
      {sfx(relogio, [SCENES.dor + DOR.relogioInicio], "relogio", 0.5)}
      {sfx(impacto, [SCENES.dado + DADO.contagemFim], "impacto", 0.3)}
      {sfx(swoosh, [SCENES.virada], "swoosh")}
      {sfx(pop, pops, "pop")}
      {/* sucesso junto com a mensagem de confirmação, antes da fala "E agenda..." */}
      {sfx(sucesso, [confirmacao], "sucesso", 0.35)}
      {sfx(swoosh, [SCENES.cta], "swoosh-cta", 0.35)}

      {/* Locução */}
      {falas.map((fala) => (
        <Sequence key={fala.arquivo} from={fala.de} layout="none" name={`voz ${fala.arquivo}`}>
          <Audio src={fala.src} volume={VOICE_VOLUME} />
        </Sequence>
      ))}
    </>
  );
};
