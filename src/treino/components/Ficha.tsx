import { CheckCheck, Flame } from "lucide-react";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { INICIO, MOMENTO } from "../edl";
import type { LayoutTreino } from "../layout";
import { clamp, entra, opacidade, partes } from "../lib";
import { textos } from "../roteiro";
import { cores, fontes, tamanho } from "../theme";

const Etiqueta: React.FC<{ icone: React.ReactNode; texto: string; p: number }> = ({
  icone,
  texto,
  p,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 14px",
      borderRadius: 999,
      border: `2px solid ${cores.destaque}`,
      color: cores.destaque,
      fontFamily: fontes.ui,
      fontWeight: 800,
      fontSize: 20,
      letterSpacing: "0.12em",
      opacity: opacidade(p),
      alignSelf: "flex-start",
      transform: `scale(${0.8 + 0.2 * p})`,
      transformOrigin: "left center",
    }}
  >
    {icone}
    {texto}
  </div>
);

const Linha: React.FC<{ numero: string; p: number; children: React.ReactNode }> = ({
  numero,
  p,
  children,
}) => (
  <div
    style={{
      display: "flex",
      gap: 18,
      opacity: opacidade(p),
      transform: `translateX(${(1 - p) * -70}px)`,
    }}
  >
    <div
      style={{
        fontFamily: fontes.impacto,
        fontSize: 40,
        lineHeight: 1.25,
        color: cores.destaque,
        width: 48,
        flexShrink: 0,
      }}
    >
      {numero}
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>{children}</div>
  </div>
);

// Nome do exercício que "aparece da esquerda para a direita" quando é dito
const Nome: React.FC<{ texto: string; p: number; cor?: string }> = ({ texto, p, cor }) => (
  <div
    style={{
      fontFamily: fontes.impacto,
      fontSize: tamanho.ficha,
      lineHeight: 1,
      color: cor ?? cores.branco,
      clipPath: `inset(0 ${100 - 100 * opacidade(p)}% 0 0)`,
    }}
  >
    {texto}
  </div>
);

// Ficha do treino montada item por item, ao lado do vídeo.
// `lado` (0..1): quanto o vídeo foi para a direita. `fim` (0..1): vai para o centro.
export const Ficha: React.FC<{ lado: number; fim: number; layout: LayoutTreino }> = ({
  lado,
  fim,
  layout,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < INICIO.crucifixo) return null;
  const f = textos.ficha;

  const pRotulo = entra(frame, fps, INICIO.crucifixo + 10);
  const pTitulo = entra(frame, fps, INICIO.crucifixo + 14);
  const pDivisor = interpolate(frame, [INICIO.crucifixo + 18, INICIO.crucifixo + 34], [0, 1], clamp);
  const p1 = entra(frame, fps, MOMENTO.aquecerPeito);
  const pCrucifixo = interpolate(frame, [MOMENTO.crucifixo - 1, MOMENTO.crucifixo + 9], [0, 1], clamp);
  const p2 = entra(frame, fps, MOMENTO.tres - 2);
  const pSupino = entra(frame, fps, MOMENTO.supino - 1, 10);
  const p3 = entra(frame, fps, MOMENTO.completoTriceps - 2);
  const pTriceps = interpolate(
    frame,
    [MOMENTO.completoTriceps - 1, MOMENTO.completoTriceps + 9],
    [0, 1],
    clamp,
  );

  // No final a ficha pode andar e crescer (Reels: vai para o centro)
  const { final } = layout;
  const dx = final.fichaDx * fim;
  const escala = 1 + (final.fichaEscala - 1) * fim;
  const visivel = Math.max(lado, fim);

  return (
    <AbsoluteFill
      style={{
        opacity: opacidade(visivel * 1.4 - 0.2),
        transform: `translate(${dx}px, ${final.fichaDy * fim}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: layout.ficha.left,
          width: layout.ficha.width,
          top: layout.ficha.top,
          height: layout.ficha.height,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 30,
          transform: `scale(${escala * layout.ficha.escala})`,
          transformOrigin: layout.ficha.origem,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: fontes.ui,
              fontWeight: 800,
              fontSize: tamanho.rotulo - 2,
              letterSpacing: "0.2em",
              color: cores.destaque,
              opacity: opacidade(pRotulo),
              transform: `translateY(${(1 - pRotulo) * 16}px)`,
            }}
          >
            {f.rotulo}
          </div>
          <div
            style={{
              fontFamily: fontes.impacto,
              fontSize: 62,
              lineHeight: 1.1,
              color: cores.branco,
              marginTop: 8,
              opacity: opacidade(pTitulo),
              transform: `translateY(${(1 - pTitulo) * 20}px)`,
            }}
          >
            {partes(f.titulo).map((p) => (
              <span key={p.texto} style={{ color: p.destaque ? cores.destaque : undefined }}>
                {p.texto}
              </span>
            ))}
          </div>
          <div
            style={{
              marginTop: 18,
              height: 3,
              width: `${100 * pDivisor}%`,
              background: "linear-gradient(90deg, rgba(212,255,58,0.9), rgba(212,255,58,0))",
            }}
          />
        </div>

        <Linha numero="01" p={p1}>
          <Nome texto={f.crucifixo} p={pCrucifixo} />
          <Etiqueta icone={<Flame size={20} strokeWidth={2.6} />} texto={f.aquecimento} p={p1} />
        </Linha>

        <Linha numero="02" p={p2}>
          <Nome texto={f.tres} p={p2} />
          <div style={{ display: "flex", gap: 10 }}>
            {[0, 1, 2].map((i) => {
              const pSlot = entra(frame, fps, MOMENTO.tres + 2 + i * 4, 12);
              const cheio = i === 0 ? opacidade(pSupino) : 0;
              return (
                <div
                  key={i}
                  style={{
                    flex: i === 0 ? 1.6 : 1,
                    height: 58,
                    borderRadius: 16,
                    border: `2px ${cheio > 0.5 ? "solid" : "dashed"} ${cheio > 0.5 ? cores.destaque : "rgba(255,255,255,0.3)"}`,
                    background: `rgba(212,255,58,${cheio})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: fontes.impacto,
                    fontSize: 32,
                    color: cheio > 0.5 ? cores.tinta : "rgba(255,255,255,0.35)",
                    opacity: opacidade(pSlot),
                    transform: `scale(${(0.7 + 0.3 * pSlot) * (1 + 0.08 * Math.sin(Math.PI * cheio))})`,
                  }}
                >
                  {i === 0 && cheio > 0.5 ? f.supino : "?"}
                </div>
              );
            })}
          </div>
        </Linha>

        <Linha numero="03" p={p3}>
          <Nome texto={f.triceps} p={pTriceps} />
          <Etiqueta
            icone={<CheckCheck size={20} strokeWidth={2.6} />}
            texto={f.finalizacao}
            p={p3}
          />
        </Linha>
      </div>
    </AbsoluteFill>
  );
};
