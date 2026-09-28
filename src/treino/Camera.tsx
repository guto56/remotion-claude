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
import { type Formato, getLayoutTreino, type LayoutTreino, PLANO, ROSTO } from "./layout";
import { clamp } from "./lib";
import { ENQUADRAMENTO, type Enquadramento } from "./roteiro";

// Correção de cor leve: a gravação é noturna e fica apagada
const GRADE = "contrast(1.06) saturate(1.02) brightness(1.03)";

const Clip: React.FC<{ clipe: Clipe; enq: Enquadramento; layout: LayoutTreino }> = ({
  clipe,
  enq,
  layout,
}) => {
  const frame = useCurrentFrame();
  const { width: W, height: H } = layout;
  // Câmera avança devagar durante o clipe
  const avanco = interpolate(frame, [0, clipe.frames], [0, 0.025], clamp);
  // "Soco": entra 10% mais aberto e fecha em 6 frames
  const soco = enq.soco
    ? interpolate(frame, [0, 6], [-0.1, 0], { ...clamp, easing: Easing.out(Easing.cubic) })
    : 0;
  // Mudança de ângulo: desliza de `vem` até o enquadramento
  const t = enq.vem
    ? interpolate(frame, [0, enq.suave ?? 16], [0, 1], {
        ...clamp,
        easing: Easing.bezier(0.45, 0, 0.2, 1),
      })
    : 1;
  const zBase = enq.vem ? enq.vem.z + (enq.z - enq.vem.z) * t : enq.z;
  const xBase = enq.vem ? (enq.vem.x ?? 0) + ((enq.x ?? 0) - (enq.vem.x ?? 0)) * t : (enq.x ?? 0);

  const z = zBase * (1 + avanco) * (1 + soco);
  const h = H * z;
  const w = ((H * 16) / 9) * z; // o original é 16:9
  // Rosto no lugar pedido, sem deixar borda vazia
  const left = Math.min(0, Math.max(W - w, W / 2 + xBase - ROSTO.x * w));
  const top = Math.min(0, Math.max(H - h, layout.olhosY - ROSTO.olhos * h));

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
export const Camera: React.FC<{ formato: Formato }> = ({ formato }) => {
  const layout = getLayoutTreino(formato);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {CLIPES.map((c) => (
        <Sequence key={c.nome} name={c.nome} from={c.de} durationInFrames={c.frames}>
          <Clip clipe={c} enq={ENQUADRAMENTO[formato][c.nome] ?? { z: 1 }} layout={layout} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// O vídeo como um "plano" que pode encolher para um lado, girando em 3D (Reels).
// esquerda/direita: 0 = tela cheia, 1 = card de lado. fim: 0..1 (desfoca e escurece).
// gradienteTopo: escurece o topo, onde ficam os textos no Reels.
export const Plano: React.FC<{
  esquerda: number;
  direita: number;
  fim: number;
  gradienteTopo: boolean;
  width: number;
  height: number;
  children: React.ReactNode;
}> = ({ esquerda, direita, fim, gradienteTopo, width: W, height: H, children }) => {
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
        {gradienteTopo ? (
          <AbsoluteFill
            style={{
              opacity: 1 - lado,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.55) 0px, rgba(0,0,0,0.22) 420px, rgba(0,0,0,0) 760px)",
            }}
          />
        ) : null}
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
