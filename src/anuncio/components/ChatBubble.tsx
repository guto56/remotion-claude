import { CheckCheck } from "lucide-react";
import React from "react";
import { parseChat } from "../lib/text";
import { colors, fonts, radius, shadow, type } from "../theme";

export type Ticks = "none" | "gray" | "read";

// Balão de conversa.
//   direction "in"  = assistente (esquerda, menta)
//   direction "out" = paciente   (direita, branco com borda)
export const ChatBubble: React.FC<{
  direction: "in" | "out";
  text: string; // aceita *negrito* e \n
  time: string;
  ticks?: Ticks;
  confirm?: boolean; // borda verde (balão de confirmação)
  glow?: number; // 0..1 brilho extra na borda
  width?: number; // largura fixa (ex.: balão com imagem)
  maxWidth?: number;
  children?: React.ReactNode; // conteúdo acima do texto (ex.: banner)
}> = ({
  direction,
  text,
  time,
  ticks = "none",
  confirm = false,
  glow = 0,
  width,
  maxWidth = 440,
  children,
}) => {
  const isOut = direction === "out";
  const paragraphs = parseChat(text);
  // Espaço reservado no fim da última linha para o horário (como no WhatsApp)
  const metaWidth = ticks === "none" ? 74 : 108;

  return (
    <div
      style={{
        position: "relative",
        alignSelf: isOut ? "flex-end" : "flex-start",
        width,
        maxWidth,
        background: isOut ? colors.patientBubble : colors.mint,
        border: confirm
          ? `3px solid ${colors.brand}`
          : isOut
            ? `2px solid ${colors.patientBorder}`
            : "2px solid transparent",
        borderRadius: radius.bubble,
        [isOut ? "borderBottomRightRadius" : "borderBottomLeftRadius"]: 8,
        boxShadow:
          glow > 0
            ? `${shadow.soft}, 0 0 0 ${glow * 10}px rgba(15,118,110,${0.25 * glow})`
            : shadow.soft,
        padding: "14px 22px 12px",
        fontFamily: fonts.ui,
        fontWeight: 500,
        fontSize: type.chat,
        lineHeight: 1.28,
        color: colors.text,
      }}
    >
      {children}
      {paragraphs.map((lines, p) => (
        <div key={p} style={{ marginTop: p > 0 ? 14 : 0 }}>
          {lines.map((runs, l) => {
            const isLast = p === paragraphs.length - 1 && l === lines.length - 1;
            return (
              <div key={l}>
                {runs.map((run, r) => (
                  <span key={r} style={{ fontWeight: run.on ? 700 : undefined }}>
                    {run.text}
                  </span>
                ))}
                {isLast ? (
                  <span style={{ display: "inline-block", width: metaWidth }} />
                ) : null}
              </div>
            );
          })}
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          right: 18,
          bottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontWeight: 400,
          fontSize: type.chatTime,
          color: colors.textMuted,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {time}
        {ticks === "none" ? null : (
          <CheckCheck
            size={28}
            strokeWidth={2.5}
            color={ticks === "read" ? colors.brand : "#9CA3AF"}
          />
        )}
      </div>
    </div>
  );
};
