import { evolvePath } from "@remotion/paths";
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ANIM, CORES } from "../../config";
import { clamp, progresso, suave } from "../base";

const SUBLINHADO = "M 3 13 C 30 5 62 17 100 10 S 168 5 197 12";

// Texto que entra palavra por palavra (fade + subida de 20 px, 3 frames de
// intervalo). [colchetes] marcam um trecho em verde; se `sublinhado` for
// passado, ele ganha um traço à mão (SVG) se desenhando por baixo.
export const Palavras: React.FC<{
  texto: string;
  inicio: number;
  style?: React.CSSProperties;
  corDestaque?: string;
  sublinhado?: [number, number];
  alinhar?: "center" | "flex-start";
}> = ({ texto, inicio, style, corDestaque = CORES.verde, sublinhado, alinhar = "center" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let indice = 0;

  const palavra = (p: string) => {
    const i = indice++;
    const t = suave(frame, fps, inicio + i * ANIM.palavraIntervalo, ANIM.palavraDuracao);
    return (
      <span
        key={`${p}-${i}`}
        style={{
          display: "inline-block",
          opacity: interpolate(t, [0, 1], [0, 1], clamp),
          transform: `translateY(${(1 - t) * ANIM.palavraSubida}px)`,
        }}
      >
        {p}
      </span>
    );
  };

  const gap = "0 0.28em";
  const trechos = texto.split(/(\[[^\]]+\])/).filter(Boolean);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: alinhar, gap, ...style }}>
      {trechos.map((trecho, k) => {
        if (!trecho.startsWith("[")) {
          return trecho.split(" ").filter(Boolean).map(palavra);
        }
        const palavrasDestaque = trecho.slice(1, -1).split(" ").filter(Boolean).map(palavra);
        const traco = sublinhado ? evolvePath(progresso(frame, sublinhado[0], sublinhado[1]), SUBLINHADO) : null;
        return (
          <span
            key={`d-${k}`}
            style={{ position: "relative", display: "inline-flex", gap, color: corDestaque }}
          >
            {palavrasDestaque}
            {traco ? (
              <svg
                viewBox="0 0 200 20"
                preserveAspectRatio="none"
                style={{ position: "absolute", left: "-4%", width: "108%", bottom: "-0.28em", height: "0.4em", overflow: "visible" }}
              >
                <path
                  d={SUBLINHADO}
                  fill="none"
                  stroke={corDestaque}
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeDasharray={traco.strokeDasharray}
                  strokeDashoffset={traco.strokeDashoffset}
                />
              </svg>
            ) : null}
          </span>
        );
      })}
    </div>
  );
};
