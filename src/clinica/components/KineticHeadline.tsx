import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { parseHighlight } from "../../anuncio/lib/text";
import { clamp, entra, op, sai } from "../lib";
import { fontes, tipo, type Tom, tons } from "../theme";
import { MOVIMENTO } from "../timing";

// Título que entra palavra por palavra (stagger de 3 frames, sobe 30 px e
// aparece). [colchetes] = destaque (amarelo no escuro, verde marca no claro).
export const KineticHeadline: React.FC<{
  texto: string;
  inicio: number;
  saiEm?: number; // começa a sair (8 frames)
  tom: Tom;
  tamanho: number;
  corDestaque?: string;
  tremer?: boolean; // tremida curta na palavra destacada ao entrar
  peso?: number;
  style?: React.CSSProperties;
}> = ({ texto, inicio, saiEm, tom, tamanho, corDestaque, tremer = false, peso = 800, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cor = tons[tom];
  const palavras = parseHighlight(texto);
  const saida = sai(frame, saiEm);

  return (
    <div
      style={{
        textAlign: "center",
        textWrap: "balance",
        fontFamily: fontes.titulo,
        fontWeight: peso,
        fontSize: tamanho,
        lineHeight: tipo.tituloLinha,
        color: cor.texto,
        ...style,
      }}
    >
      {palavras.map((trechos, i) => {
        const comeco = inicio + i * MOVIMENTO.palavra;
        const p = entra(frame, fps, comeco);
        return (
          <React.Fragment key={i}>
            {i > 0 ? " " : null}
            <span
              style={{
                display: "inline-block",
                opacity: op(p) * saida,
                transform: `translateY(${(1 - p) * 30 - (1 - saida) * 24}px)`,
              }}
            >
              {trechos.map((t, j) => {
                if (!t.on) return <span key={j}>{t.text}</span>;
                const dx = tremer
                  ? Math.sin((frame - comeco) * 2.2) * interpolate(frame - comeco, [4, 16], [7, 0], clamp)
                  : 0;
                return (
                  <span
                    key={j}
                    style={{
                      color: corDestaque ?? cor.destaque,
                      display: "inline-block",
                      transform: `translateX(${frame > comeco + 4 ? dx : 0}px)`,
                    }}
                  >
                    {t.text}
                  </span>
                );
              })}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};
