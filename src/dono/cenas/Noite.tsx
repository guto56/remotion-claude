import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { copy } from "../copy";
import { CELULAR, type Layout } from "../layout";
import { clamp, entra, op, sai, zoomLento } from "../lib";
import { cores, fontes } from "../theme";
import { CENAS, NOITE, TRANSICAO } from "../timing";
import { KineticHeadline } from "../components/KineticHeadline";
import { LockScreen } from "../components/LockScreen";
import { NotificationCard } from "../components/NotificationCard";
import { PhoneFrame } from "../components/PhoneFrame";
import { SegmentChip } from "../components/SegmentChip";

const FIM = CENAS.dado + TRANSICAO.noiteParaDado;

// "23:41" -> "08:30" do dia seguinte, em minutos
const minutos = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const formata = (total: number) => {
  const t = ((Math.round(total) % 1440) + 1440) % 1440;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
};

// Cenas 1 e 2 (0–165): gancho para o dono e a dor. O celular é o mesmo nas
// duas: as notificações chegam, depois ficam cinza, o celular encolhe e o
// relógio avança até a manhã.
export const Noite: React.FC<{ layout: Layout }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = copy.bloqueio;

  // Chip "DONO DE NEGÓCIO:" já no frame 0 (scale 0.6 -> 1)
  const pChip = entra(frame, fps, 0);
  const saiChip = sai(frame, CENAS.dor + 2);

  // Relógio e amanhecer
  const [r0, r1] = NOITE.relogio;
  const avanco = interpolate(frame, [r0, r1], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const de = minutos(b.relogioDe);
  const ate = minutos(b.relogioAte) + 1440;
  const relogio = formata(de + (ate - de) * avanco);

  // Celular: zoom lento, encolhe para 80% na cena 2 e vibra a cada notificação
  const encolhe = entra(frame, fps, NOITE.encolhe);
  const escala = layout.celularNoite.escala * zoomLento(frame, 0, FIM) * (1 - 0.2 * encolhe);
  const vibrando = NOITE.notificacoes.find((a) => frame >= a && frame < a + NOITE.vibra);
  const vibra = vibrando === undefined ? 0 : (frame - vibrando) % 2 === 0 ? 6 : -6;

  // Notificações: a mais nova entra no topo e empurra as outras para baixo
  const cinza = interpolate(frame, NOITE.cinza, [0, 1], clamp);
  const progresso = NOITE.notificacoes.map((a) => entra(frame, fps, a));
  const passo = CELULAR.notificacaoAltura + CELULAR.notificacaoEspaco;
  const chegaram = NOITE.notificacoes.filter((a) => frame >= a).length;
  const ultima = NOITE.notificacoes[Math.max(0, chegaram - 1)];
  const pBadge = entra(frame, fps, NOITE.notificacoes[0]);
  const pulsoBadge = interpolate(frame, [ultima, ultima + 4, ultima + 10], [1, 1.25, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: cores.noite }}>
      <div
        style={{
          position: "absolute",
          top: layout.chipDonoTop,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: saiChip,
          transform: `scale(${0.6 + 0.4 * pChip}) translateY(${(1 - saiChip) * -20}px)`,
        }}
      >
        <SegmentChip texto={copy.chipDono} fundo={cores.amarelo} cor={cores.texto} tamanho={40} />
      </div>

      <div style={{ position: "absolute", top: layout.tituloNoiteTop, left: layout.lado, right: layout.lado }}>
        <KineticHeadline texto={copy.gancho} inicio={NOITE.titulo} saiEm={CENAS.dor + 2} tom="escuro" tamanho={layout.tituloTamanho} />
      </div>
      <div style={{ position: "absolute", top: layout.tituloNoiteTop, left: layout.lado, right: layout.lado }}>
        {frame >= NOITE.titulo1[0] && frame < NOITE.titulo1[1] + 10 ? (
          <KineticHeadline texto={copy.dor1} inicio={NOITE.titulo1[0]} saiEm={NOITE.titulo1[1]} tom="escuro" tamanho={layout.tituloTamanho} />
        ) : null}
        {frame >= NOITE.titulo2 ? (
          <KineticHeadline
            texto={copy.dor2}
            inicio={NOITE.titulo2}
            tom="escuro"
            tamanho={layout.tituloTamanho}
            corDestaque={cores.vermelho}
            tremer
          />
        ) : null}
      </div>

      <div
        style={{
          position: "absolute",
          left: layout.largura / 2 - CELULAR.largura / 2,
          top: layout.celularNoite.top,
          transform: `translateX(${vibra}px) scale(${escala})`,
          // encolhe em direção ao centro-baixo: abre espaço para o título e
          // mantém as notificações acima de y=1240
          transformOrigin: "50% 70%",
        }}
      >
        <PhoneFrame
          tela={cores.telaBloqueio}
          sobreposto={
            chegaram > 0 ? (
              <div
                style={{
                  position: "absolute",
                  top: -22,
                  right: -22,
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  background: cores.vermelho,
                  color: cores.branco,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: fontes.ui,
                  fontWeight: 700,
                  fontSize: 38,
                  boxShadow: "0 8px 20px rgba(239,68,68,0.45)",
                  transform: `scale(${op(pBadge) * pulsoBadge})`,
                }}
              >
                {chegaram}
              </div>
            ) : null
          }
        >
          <LockScreen relogio={relogio} data={b.data} sol={avanco}>
            <div
              style={{
                position: "absolute",
                top: CELULAR.notificacoes,
                left: 16,
                right: 16,
                filter: `grayscale(${cinza})`,
                opacity: 1 - 0.45 * cinza,
              }}
            >
              {NOITE.notificacoes.map((a, i) => {
                if (frame < a - 1) return null;
                const p = progresso[i];
                // quantas chegaram depois desta (empurram para baixo)
                const abaixo = progresso.slice(i + 1).reduce((s, v) => s + Math.min(1, v), 0);
                return (
                  <NotificationCard
                    key={i}
                    titulo={b.notificacao}
                    previa={b.previas[i]}
                    quando={b.quando}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      opacity: op(p),
                      transform: `translateY(${abaixo * passo + (1 - p) * -24}px) scale(${0.92 + 0.08 * Math.min(1, p)})`,
                    }}
                  />
                );
              })}
            </div>
          </LockScreen>
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};
