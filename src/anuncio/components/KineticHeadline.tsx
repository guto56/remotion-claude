import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { enter, exit, fadeFrom } from "../lib/motion";
import { parseHighlight } from "../lib/text";
import { fonts, headlineTones, type } from "../theme";
import { MOTION } from "../timing";
import { HighlightWord } from "./HighlightWord";

type Props = {
  text: string; // aceita [destaque] e \n (quebra de linha forçada)
  start: number; // frame em que a primeira palavra começa a entrar
  exitAt?: number; // frame em que o título começa a sair (8 frames)
  tone: "dark" | "light"; // dark = fundo escuro (branco + amarelo)
  fontSize: number;
  fontWeight?: number;
  fontFamily?: string;
  lineHeight?: number;
  highlightColor?: string; // sobrescreve a cor do destaque
  shake?: boolean; // treme a palavra destacada ao entrar
  exitShift?: number; // quanto sobe ao sair (px)
  entrance?: boolean; // false = já aparece completo (sem entrar palavra por palavra)
  style?: React.CSSProperties;
};

// Título que entra palavra por palavra (stagger de 3 frames, sobe 30 px e aparece).
export const KineticHeadline: React.FC<Props> = ({
  text,
  start,
  exitAt,
  tone,
  fontSize,
  fontWeight = 800,
  fontFamily = fonts.title,
  lineHeight = type.headlineLineHeight,
  highlightColor,
  shake = false,
  exitShift = 24,
  entrance = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const colors = headlineTones[tone];
  const lines = text.split("\n").map(parseHighlight);
  const out = exit(frame, exitAt);

  return (
    <div
      style={{
        textAlign: "center",
        textWrap: "balance",
        fontFamily,
        fontWeight,
        fontSize,
        lineHeight,
        color: colors.text,
        ...style,
      }}
    >
      {lines.map((words, l) => {
        // índice da primeira palavra da linha, para o stagger continuar entre linhas
        const offset = lines.slice(0, l).reduce((n, w) => n + w.length, 0);
        return (
          <div key={l}>
            {words.map((runs, k) => {
              const i = offset + k;
              const wordStart = start + i * MOTION.wordStagger;
              const p = entrance ? enter(frame, fps, wordStart) : 1;
              return (
                <React.Fragment key={i}>
                  {k > 0 ? " " : null}
                  <span
                    style={{
                      display: "inline-block",
                      opacity: fadeFrom(p) * out,
                      translate: `0px ${(1 - p) * 30 - (1 - out) * exitShift}px`,
                    }}
                  >
                    {runs.map((run, j) =>
                      run.on ? (
                        <HighlightWord
                          key={j}
                          color={highlightColor ?? colors.highlight}
                          shakeFrom={shake && entrance ? wordStart : undefined}
                        >
                          {run.text}
                        </HighlightWord>
                      ) : (
                        <span key={j}>{run.text}</span>
                      ),
                    )}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
