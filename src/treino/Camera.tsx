import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { CLIPES, type Clipe } from "./edl";
import { H, OLHOS_Y, PLANO, ROSTO, W } from "./layout";
import { clamp } from "./lib";
import { ENQUADRAMENTO, type Enquadramento } from "./roteiro";

// Largura do vídeo original (16:9) quando a altura dele é a da tela
const LARGURA_BASE = (H * 16) / 9;
// Correção de cor leve: a gravação é noturna e fica apagada
const GRADE = "contrast(1.06) saturate(1.02) brightness(1.03)";

const Clip: React.FC<{ clipe: Clipe; enq: Enquadramento }> = ({ clipe, enq }) => {
  const frame = useCurrentFrame();
  // Câmera avança devagar durante o clipe
  const avanco = interpolate(frame, [0, clipe.frames], [0, 0.025], clamp);
  // "Soco": entra 10% mais aberto e fecha em 6 frames
  const soco = enq.soco
    ? interpolate(frame, [0, 6], [-0.1, 0], { ...clamp, easing: Easing.out(Easing.cubic) })
    : 0;
  const z = enq.z * (1 + avanco) * (1 + soco);
  const h = H * z;
  const w = LARGURA_BASE * z;
  // Rosto no centro (mais o deslocamento do enquadramento), sem deixar borda vazia
  const left = Math.min(0, Math.max(W - w, W / 2 + (enq.x ?? 0) - ROSTO.x * w));
  const top = Math.min(0, Math.max(H - h, OLHOS_Y - ROSTO.olhos * h));

  return (
    <OffthreadVideo
      src={staticFile("treino/video.mp4")}
      trimBefore={clipe.trimBefore}
      playbackRate={clipe.rate}
      muted
      // maxWidth: o reset do Tailwind limita imagens a 100% da largura
      style={{ position: "absolute", left, top, width: w, height: h, maxWidth: "none", filter: GRADE }}
    />
  );
};

// Todos os clipes em sequência (cortes do edl.ts)
export const Camera: React.FC = () => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    {CLIPES.map((c) => (
      <Sequence key={c.nome} name={c.nome} from={c.de} durationInFrames={c.frames}>
        <Clip clipe={c} enq={ENQUADRAMENTO[c.nome] ?? { z: 1 }} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

// O vídeo como um "plano" que pode encolher para um lado, girando em 3D.
// esquerda/direita: 0 = tela cheia, 1 = card de lado. fim: 0..1 (desfoca e escurece).
export const Plano: React.FC<{
  esquerda: number;
  direita: number;
  fim: number;
  children: React.ReactNode;
}> = ({ esquerda, direita, fim, children }) => {
  const frame = useCurrentFrame();
  const lado = esquerda + direita; // nunca os dois ao mesmo tempo
  const s = 1 - (1 - PLANO.escala) * lado;
  const cx = W / 2 + (PLANO.esquerdaX - W / 2) * esquerda + (PLANO.direitaX - W / 2) * direita;
  const cy = H / 2 + (PLANO.centroY - H / 2) * lado;
  // Leve flutuação enquanto está de lado
  const flutua = Math.sin(frame / 38) * 1.6 * lado;
  const giro = PLANO.giro * (esquerda - direita) + flutua;

  return (
    <AbsoluteFill style={{ perspective: 1800 }}>
      <AbsoluteFill
        style={{
          transform: `translate(${cx - W / 2}px, ${cy - H / 2}px) scale(${s}) rotateY(${giro}deg)`,
          borderRadius: PLANO.raio * lado,
          overflow: "hidden",
          boxShadow:
            lado > 0
              ? `0 0 0 ${3 * lado}px rgba(255,255,255,0.14), 0 ${80 * lado}px ${160 * lado}px rgba(0,0,0,${0.6 * lado})`
              : undefined,
        }}
      >
        <AbsoluteFill style={{ filter: fim > 0 ? `blur(${16 * fim}px)` : undefined }}>
          {children}
        </AbsoluteFill>
        {/* Escurece o topo (textos por cima) e as bordas */}
        <AbsoluteFill
          style={{
            opacity: 1 - lado,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.55) 0px, rgba(0,0,0,0.22) 420px, rgba(0,0,0,0) 760px)",
          }}
        />
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.38) 100%)",
          }}
        />
        <AbsoluteFill style={{ backgroundColor: `rgba(8,8,9,${0.7 * fim})` }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
