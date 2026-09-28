import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { CalendarDays, ShoppingBag, Wrench } from "lucide-react";
import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { copy } from "../copy";
import { CELULAR, type Layout } from "../layout";
import { clamp, entra, op, sai, zoomLento } from "../lib";
import { cores, tipo } from "../theme";
import { CENAS, CONVERSA, TRANSICAO, VIRADA } from "../timing";
import { Conversation } from "../components/Conversation";
import { KineticHeadline } from "../components/KineticHeadline";
import { PhoneFrame } from "../components/PhoneFrame";
import { SegmentChip } from "../components/SegmentChip";

const ICONES = { agenda: CalendarDays, orcamento: Wrench, pedido: ShoppingBag };
const T0 = CENAS.virada; // esta sequência começa no frame 240
const INICIO_DEMO = CENAS.demo - T0;
const FIM_DEMO = CENAS.beneficios - T0;
const slideConversa = linearTiming({ durationInFrames: TRANSICAO.conversa });

// Cenas 4 e 5 (240–705): a virada no fundo claro e a demonstração com 3
// conversas. Frames aqui são relativos ao início da sequência (240).
export const Luz: React.FC<{ layout: Layout }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Celular sobe no início da demo e desce na saída para a cena 6
  const pEntra = entra(frame, fps, CONVERSA.entraCelular - T0);
  const desce = interpolate(frame, [FIM_DEMO, FIM_DEMO + TRANSICAO.demoParaBeneficios], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const escala = layout.celularDemo.escala * zoomLento(frame, INICIO_DEMO, FIM_DEMO);

  // Chip do segmento: troca junto com a conversa (desliza da direita)
  const pChip = entra(frame, fps, INICIO_DEMO + 5);
  const saiChip = sai(frame, FIM_DEMO);
  const chips = copy.conversas.map((c, i) => {
    const inicio = INICIO_DEMO + i * CONVERSA.duracao;
    const fim = inicio + CONVERSA.duracao;
    const entrada = i === 0 ? 1 : interpolate(frame, [inicio, inicio + TRANSICAO.conversa], [0, 1], {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    });
    const saida = i === copy.conversas.length - 1 ? 0 : interpolate(frame, [fim, fim + TRANSICAO.conversa], [0, 1], {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    });
    return { c, entrada, saida, visivel: frame >= inicio - 1 && (saida < 1 || i === copy.conversas.length - 1) };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: cores.claro }}>
      {/* Cena 4: a virada */}
      {frame < VIRADA.tituloSai - T0 + 10 ? (
        <div
          style={{
            position: "absolute",
            top: layout.viradaCentroY - 140,
            left: layout.lado,
            right: layout.lado,
          }}
        >
          <KineticHeadline
            texto={copy.virada}
            inicio={VIRADA.titulo - T0}
            saiEm={VIRADA.tituloSai - T0}
            tom="claro"
            tamanho={tipo.titulo}
          />
        </div>
      ) : null}

      {/* Cena 5: chip do segmento acima do celular */}
      {frame >= INICIO_DEMO + 5
        ? chips.map(({ c, entrada, saida, visivel }, i) =>
            visivel ? (
              <div
                key={c.negocio}
                style={{
                  position: "absolute",
                  top: layout.chipDemoTop,
                  left: 0,
                  right: 0,
                  display: "flex",
                  justifyContent: "center",
                  opacity: (i === 0 ? op(pChip) : entrada) * (1 - saida) * saiChip,
                  transform: `translateX(${(1 - entrada) * 700 - saida * 700}px) scale(${i === 0 ? 0.7 + 0.3 * pChip : 1})`,
                }}
              >
                <SegmentChip
                  texto={c.chip}
                  fundo={cores.marca}
                  cor={cores.branco}
                  tamanho={tipo.chipSegmento}
                  Icone={ICONES[c.icone]}
                />
              </div>
            ) : null,
          )
        : null}

      {/* Celular com as 3 conversas */}
      {frame >= INICIO_DEMO - 1 ? (
        <div
          style={{
            position: "absolute",
            left: layout.largura / 2 - CELULAR.largura / 2,
            top: layout.celularDemo.top,
            transform: `translateY(${(1 - pEntra) * 1100 + desce * 1400}px) scale(${escala})`,
            transformOrigin: "50% 0%",
          }}
        >
          <PhoneFrame tela={cores.telaConversa}>
            <Sequence from={INICIO_DEMO}>
              <TransitionSeries>
                <TransitionSeries.Sequence name="5A · Agenda" durationInFrames={CONVERSA.duracao + TRANSICAO.conversa}>
                  <Conversation conversa={copy.conversas[0]} />
                </TransitionSeries.Sequence>
                <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={slideConversa} />
                <TransitionSeries.Sequence name="5B · Orçamento" durationInFrames={CONVERSA.duracao + TRANSICAO.conversa}>
                  <Conversation conversa={copy.conversas[1]} />
                </TransitionSeries.Sequence>
                <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={slideConversa} />
                <TransitionSeries.Sequence name="5C · Pedido" durationInFrames={CONVERSA.duracao + TRANSICAO.demoParaBeneficios}>
                  <Conversation conversa={copy.conversas[2]} />
                </TransitionSeries.Sequence>
              </TransitionSeries>
            </Sequence>
          </PhoneFrame>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
