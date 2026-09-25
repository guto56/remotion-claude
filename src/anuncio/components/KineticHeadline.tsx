import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { enter, exit, fadeFrom } from "../lib/motion";
import { parseHighlight } from "../lib/text";
import { fonts, headlineTones, type } from "../theme";
import { MOTION } from "../timing";
import { HighlightWord } from "./HighlightWord";

type Props = {
  text: string; // aceita [destaque]
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
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const colors = headlineTones[tone];
  const words = parseHighlight(text);
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
      {words.map((runs, i) => {
        const wordStart = start + i * MOTION.wordStagger;
        const p = enter(frame, fps, wordStart);
        return (
          <React.Fragment key={i}>
            {i > 0 ? " " : null}
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
                    shakeFrom={shake ? wordStart : undefined}
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
};
