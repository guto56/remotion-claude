import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CENA3, PAGINA_PROPORCAO, PAGINAS, TRANSICAO } from "../../config";
import { clamp, suave } from "../base";
import { LabelChip } from "../components/LabelChip";
import { PageSheet } from "../components/PageSheet";
import { PaperBackground } from "../components/PaperBackground";

const { larguraFolha: W, centroFolha: C, zoom: Z, alvoZoom: T } = CENA3;
const H = W * PAGINA_PROPORCAO;
// A folha é desenhada já no tamanho máximo do zoom e reduzida com scale(),
// para continuar nítida quando o zoom chega a 1,7x
const W_MAX = W * Z.escala;

// Uma página: entra de baixo girando (-4° → 0°), dá zoom lento até o desenho
// colorido (o modelo) e mostra o chip com título, descrição e contador.
const Pagina: React.FC<{ indice: number }> = ({ indice }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pagina = PAGINAS[indice];

  const entrada = suave(frame, fps, 0, 26);
  const z = interpolate(frame, [Z.de, Z.ate], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  // depois do zoom a câmera continua avançando bem devagar (nunca para)
  const deriva = interpolate(frame, [Z.ate, CENA3.porPagina + TRANSICAO.pagina], [0, 0.02], clamp);
  const escala = (1 + (Z.escala - 1) * z) * (1 + deriva);

  // Ponto de foco relativo ao centro da folha; ao fim do zoom ele fica em T
  const foco = { x: (pagina.foco.x / 100 - 0.5) * W, y: (pagina.foco.y / 100 - 0.5) * H };
  const dx = z * (T.x - C.x - Z.escala * foco.x);
  const dy = z * (T.y - C.y - Z.escala * foco.y) + (1 - entrada) * 900;
  const giro = -4 * (1 - entrada);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: C.x - W_MAX / 2,
          top: C.y - (W_MAX * PAGINA_PROPORCAO) / 2,
          transform: `translate(${dx}px, ${dy}px) rotate(${giro}deg) scale(${escala / Z.escala})`,
        }}
      >
        <PageSheet
          pagina={indice + 1}
          largura={W_MAX}
          sombra={`0 ${20 * Z.escala}px ${40 * Z.escala}px rgba(0,0,0,.18)`}
        />
      </div>
      <LabelChip
        titulo={pagina.titulo}
        descricao={pagina.descricao}
        contador={`${indice + 1}/${PAGINAS.length}`}
        inicio={14}
        top={CENA3.chip.top}
        altura={CENA3.chip.altura}
      />
    </AbsoluteFill>
  );
};

const slideTiming = linearTiming({ durationInFrames: TRANSICAO.pagina });
// Páginas 1–4 cobrem a transição para a próxima; a 5 cobre a transição de cena
const DURACAO = CENA3.porPagina + TRANSICAO.pagina;
const DURACAO_ULTIMA = CENA3.porPagina + TRANSICAO.cena;

// Cena 3: as 5 páginas, uma a uma, com slide da direita para a esquerda.
export const CenaPaginas: React.FC = () => (
  <AbsoluteFill>
    <PaperBackground />
    <TransitionSeries>
      <TransitionSeries.Sequence name="Página 1" durationInFrames={DURACAO}>
        <Pagina indice={0} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={slideTiming} />
      <TransitionSeries.Sequence name="Página 2" durationInFrames={DURACAO}>
        <Pagina indice={1} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={slideTiming} />
      <TransitionSeries.Sequence name="Página 3" durationInFrames={DURACAO}>
        <Pagina indice={2} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={slideTiming} />
      <TransitionSeries.Sequence name="Página 4" durationInFrames={DURACAO}>
        <Pagina indice={3} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={slideTiming} />
      <TransitionSeries.Sequence name="Página 5" durationInFrames={DURACAO_ULTIMA}>
        <Pagina indice={4} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
