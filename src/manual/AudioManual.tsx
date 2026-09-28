import { Audio } from "@remotion/media";
import React from "react";
import { interpolate, Sequence } from "remotion";
import { optionalStaticFile } from "../anuncio/lib/static";
import { AUDIO, VIDEO } from "../config";
import { clamp } from "./base";

// Arquivos de public/audio/ que não existem: são pulados (o render não quebra).
export const audiosFaltando = (): string[] => {
  const nomes = [AUDIO.musica.arquivo, ...AUDIO.efeitos.map(([arquivo]) => arquivo)];
  return [...new Set(nomes)].filter((n) => optionalStaticFile(n) === null);
};

// Trilha em loop (volume com fade-in e fade-out) e os efeitos nos momentos do config.
export const AudioManual: React.FC = () => {
  const { musica, efeitos } = AUDIO;
  const srcMusica = optionalStaticFile(musica.arquivo);
  const faltando = audiosFaltando();
  if (faltando.length > 0) {
    console.warn(`[ManualPintura] áudios faltando em public/: ${faltando.join(", ")}`);
  }

  return (
    <>
      {srcMusica ? (
        <Audio
          src={srcMusica}
          loop
          loopVolumeCurveBehavior="extend"
          volume={(f) =>
            interpolate(
              f,
              [0, musica.fadeIn, VIDEO.duracao - musica.fadeOut, VIDEO.duracao],
              [0, musica.volume, musica.volume, 0],
              clamp,
            )
          }
        />
      ) : null}
      {efeitos.map(([arquivo, frame, volume]) => {
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
