import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { copy } from "../copy";
import { CELULAR, type Layout } from "../layout";
import { clamp, entra, op, zoomLento } from "../lib";
import { cores, fontes } from "../theme";
import { CENAS, DOR, GANCHO, TRANSICAO } from "../timing";
import { LockScreen } from "./LockScreen";
import { NotificationCard } from "./NotificationCard";
import { PhoneFrame } from "./PhoneFrame";

const FIM = CENAS.virada + TRANSICAO.virada;

const minutos = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const formata = (total: number) => {
  const t = ((Math.round(total) % 1440) + 1440) % 1440;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
};

// Celular das cenas 1 e 2 (0–150): as notificações chegam (vibrando, com o
// badge contando), depois ficam cinza, o celular encolhe para 80% e o relógio
// avança. Frames absolutos (a sequência começa no 0).
export const CelularBloqueio: React.FC<{ layout: Layout }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = copy.bloqueio;

  // Relógio
  const avanco = interpolate(frame, DOR.relogio, [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const de = minutos(b.relogio);
  const ate = minutos(b.relogioAte);
  const relogio = formata(de + (ate - de) * avanco);

  // Zoom lento, encolhe para 80% na cena 2 e vibra a cada notificação
  const encolhe = entra(frame, fps, DOR.encolhe);
  const escala = layout.celularNoite.escala * zoomLento(frame, 0, FIM) * (1 - 0.2 * encolhe);
  const vibrando = GANCHO.notificacoes.find((a) => frame >= a && frame < a + GANCHO.vibra);
  const vibra = vibrando === undefined ? 0 : (frame - vibrando) % 2 === 0 ? 6 : -6;

  // Notificações: a mais nova entra no topo e empurra as outras para baixo
  const cinza = interpolate(frame, DOR.cinza, [0, 1], clamp);
  const progresso = GANCHO.notificacoes.map((a) => entra(frame, fps, a));
  const passo = CELULAR.notificacaoAltura + CELULAR.notificacaoEspaco;
  const chegaram = GANCHO.notificacoes.filter((a) => frame >= a).length;
  const ultima = GANCHO.notificacoes[Math.max(0, chegaram - 1)];
  const pBadge = entra(frame, fps, GANCHO.notificacoes[0]);
  const pulsoBadge = interpolate(frame, [ultima, ultima + 4, ultima + 10], [1, 1.25, 1], clamp);

  return (
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
        <LockScreen relogio={relogio} data={b.data}>
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
            {GANCHO.notificacoes.map((a, i) => {
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
  );
};
