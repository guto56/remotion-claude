import { Audio } from "@remotion/media";
import React from "react";
import { interpolate, Sequence, staticFile } from "remotion";
import { optionalStaticFile } from "../anuncio/lib/static";
import { INICIO, MOMENTO } from "./edl";
import { clamp } from "./lib";

// Volumes
const VOZ = 1;
const MUSICA = 0.17; // por baixo da fala
const MUSICA_FINAL = 0.4; // no final, sem fala
// O swoosh.mp3 tem o pico em 0,45 s: começa 13 frames antes da transição
const SWOOSH_ANTES = 13;

// Efeitos: [arquivo de public/, frame, volume]
const EFEITOS: [string, number, number][] = [
  ["ping.mp3", MOMENTO.segunda, 0.22],
  ["swoosh.mp3", INICIO.importante - SWOOSH_ANTES, 0.32],
  ["pop.mp3", MOMENTO.desgaste, 0.3],
  ["pop.mp3", MOMENTO.aquecer, 0.3],
  ["swoosh.mp3", INICIO.gosto - SWOOSH_ANTES, 0.22],
  ["impacto.mp3", MOMENTO.peito - 1, 0.32],
  ["impacto.mp3", MOMENTO.triceps - 1, 0.22],
  ["swoosh.mp3", INICIO.crucifixo - SWOOSH_ANTES, 0.32],
  ["pop.mp3", MOMENTO.aquecerPeito, 0.26],
  ["pop.mp3", MOMENTO.crucifixo, 0.3],
  ["pop.mp3", MOMENTO.tres + 2, 0.18],
  ["pop.mp3", MOMENTO.tres + 6, 0.18],
  ["pop.mp3", MOMENTO.tres + 10, 0.18],
  ["ping.mp3", MOMENTO.supino, 0.2],
  ["pop.mp3", MOMENTO.completoTriceps, 0.3],
  ["swoosh.mp3", INICIO.final - SWOOSH_ANTES + 4, 0.26],
  ["sucesso.mp3", INICIO.final + 30, 0.28],
];

export const TreinoAudio: React.FC = () => {
  const musica = optionalStaticFile("treino/musica.wav");
  return (
    <>
      <Audio src={staticFile("treino/voz.wav")} volume={VOZ} />
      {musica ? (
        <Audio
          src={musica}
          volume={(f) =>
            interpolate(f, [INICIO.final - 4, INICIO.final + 12], [MUSICA, MUSICA_FINAL], clamp)
          }
        />
      ) : null}
      {EFEITOS.map(([arquivo, frame, volume]) => {
        const src = optionalStaticFile(arquivo);
        return src ? (
          <Sequence key={`${arquivo}-${frame}`} from={frame} layout="none" name={arquivo}>
            <Audio src={src} volume={volume} />
          </Sequence>
        ) : null;
      })}
    </>
  );
};
