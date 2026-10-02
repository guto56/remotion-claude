import { Audio } from "@remotion/media";
import React from "react";
import { interpolate, Sequence } from "remotion";
import { optionalStaticFile } from "../anuncio/lib/static";
import { clamp } from "./lib";
import { BENEFICIOS, CENAS, DEMO, DURACAO, GANCHO, VOZ } from "./timing";
import { copy } from "./copy";

// Volumes
const MUSICA = 0.15;
const MUSICA_FADE = 15; // frames de fade in/out
const MUSICA_ABAIXA = 0.5; // durante a locução a música cai para 50%
const EFEITOS = 0.6;
const PING_COM_VOZ = 0.35; // pings mais baixos quando há locução por cima
const VOZ_VOLUME = 1;

// Toca os arquivos de public/ que existirem (checados com getStaticFiles);
// se algum faltar, é ignorado e o render não quebra.
export const ClinicaAudio: React.FC = () => {
  const musica = optionalStaticFile("music.mp3");
  const ping = optionalStaticFile("ping.mp3");
  const pop = optionalStaticFile("pop.mp3");
  const swoosh = optionalStaticFile("swoosh.mp3");
  const success = optionalStaticFile("success.mp3");

  const falas = VOZ.map(([id, frame, duracao]) => ({
    id,
    frame,
    duracao,
    src: optionalStaticFile(`clinica/voz/${id}.mp3`),
  })).filter((f): f is { id: string; frame: number; duracao: number; src: string } => f.src !== null);
  const temVozNoGancho = falas.some((f) => f.frame < GANCHO.notificacoes[GANCHO.notificacoes.length - 1]);

  const efeito = (src: string | null, frames: number[], nome: string, volume = EFEITOS) =>
    src
      ? frames.map((f) => (
          <Sequence key={`${nome}-${f}`} from={f} layout="none" name={nome}>
            <Audio src={src} volume={volume} />
          </Sequence>
        ))
      : null;

  // pop em cada item da lista de benefícios
  const pops = copy.beneficios.map((_, i) => CENAS.beneficios + BENEFICIOS.itens + i * BENEFICIOS.intervalo);

  // 0..1: alguém falando (rampas de 6 frames)
  const falando = (f: number) =>
    Math.max(
      0,
      ...falas.map((v) =>
        interpolate(f, [v.frame - 6, v.frame, v.frame + v.duracao, v.frame + v.duracao + 6], [0, 1, 1, 0], clamp),
      ),
    );

  return (
    <>
      {musica ? (
        <Audio
          src={musica}
          volume={(f) =>
            MUSICA *
            interpolate(f, [0, MUSICA_FADE, DURACAO - MUSICA_FADE, DURACAO], [0, 1, 1, 0], clamp) *
            (1 - (1 - MUSICA_ABAIXA) * falando(f))
          }
        />
      ) : null}
      {efeito(ping, GANCHO.notificacoes, "ping", temVozNoGancho ? PING_COM_VOZ : EFEITOS)}
      {efeito(swoosh, [CENAS.virada], "swoosh")}
      {efeito(success, [DEMO.aviso], "success")}
      {efeito(pop, pops, "pop")}
      {falas.map((v) => (
        <Sequence key={v.id} from={v.frame} durationInFrames={v.duracao + 6} layout="none" name={`voz ${v.id}`}>
          <Audio src={v.src} volume={VOZ_VOLUME} />
        </Sequence>
      ))}
    </>
  );
};
