import { Mic, Paperclip, Smile, Timer } from "lucide-react";
import React from "react";
import { Easing, interpolate, useVideoConfig } from "remotion";
import { copy, type ChatMessage } from "../copy";
import { PHONE } from "../layout";
import { clamped, enter, fadeFrom } from "../lib/motion";
import { colors, fonts } from "../theme";
import { DEMO, MOTION } from "../timing";
import { ChatBubble } from "./ChatBubble";
import { ChatHeader } from "./ChatHeader";
import { ImageBubble } from "./ImageBubble";
import { StatusBar } from "./PhoneFrame";
import { TypingIndicator } from "./TypingIndicator";

const SCREEN_H = PHONE.height - PHONE.bezel * 2;
const VIEWPORT_TOP = PHONE.statusBar + PHONE.chatHeader;
const VIEWPORT_H = SCREEN_H - VIEWPORT_TOP - PHONE.chatInput - PHONE.homeIndicator;

// Linha da conversa que "cresce" de altura 0 até a altura real,
// empurrando as mensagens de cima (rolagem suave sem medir nada).
const Slot: React.FC<{ grow: number; children: React.ReactNode }> = ({
  grow,
  children,
}) => (
  <div style={{ display: "grid", gridTemplateRows: `${grow}fr` }}>
    <div
      style={{
        minHeight: 0,
        overflow: grow < 1 ? "hidden" : "visible",
        display: "flex",
        flexDirection: "column",
        paddingTop: 16,
      }}
    >
      {children}
    </div>
  </div>
);

// Tela de conversa da cena 5. `t` = frame relativo ao início da cena 5.
export const ChatScreen: React.FC<{ t: number }> = ({ t }) => {
  const { fps } = useVideoConfig();
  const messages = copy.chat.mensagens as readonly ChatMessage[];
  const arrivals = DEMO.mensagens;

  const arrived = arrivals.filter((a) => t >= a).length;
  const clock = messages[Math.max(0, arrived - 1)].hora;

  const items: React.ReactNode[] = [];
  messages.forEach((m, i) => {
    const a = arrivals[i];
    if (a === undefined) return;

    // "Digitando..." antes de cada mensagem da assistente
    if (m.de === "assistente") {
      const ts = a - MOTION.typingFrames;
      if (t >= ts && t < a + 6) {
        const g =
          interpolate(t, [ts, ts + 6], [0, 1], clamped) *
          interpolate(t, [a, a + 6], [1, 0], clamped);
        items.push(
          <Slot key={`typing-${i}`} grow={g}>
            <div style={{ display: "flex", flexDirection: "column", opacity: g }}>
              <TypingIndicator />
            </div>
          </Slot>,
        );
      }
    }

    if (t < a) return;
    const grow = interpolate(t, [a, a + MOTION.messageGrowFrames], [0, 1], {
      ...clamped,
      easing: Easing.out(Easing.cubic),
    });
    const p = enter(t, fps, a);
    const isOut = m.de === "cliente";
    const glow =
      m.tipo === "confirmacao"
        ? interpolate(
            t,
            [DEMO.brilhoConfirmacao, DEMO.brilhoConfirmacao + 8, DEMO.brilhoConfirmacao + 22],
            [0, 1, 0],
            clamped,
          )
        : 0;

    items.push(
      <Slot key={`msg-${i}`} grow={grow}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            opacity: fadeFrom(p),
            translate: `0px ${(1 - p) * 40}px`,
            scale: 0.9 + 0.1 * p,
            transformOrigin: isOut ? "bottom right" : "bottom left",
          }}
        >
          {m.tipo === "imagem" ? (
            <ImageBubble
              title={copy.chat.banner.titulo}
              subtitle={copy.chat.banner.subtitulo}
              caption={m.texto}
              time={m.hora}
            />
          ) : (
            <ChatBubble
              direction={isOut ? "out" : "in"}
              text={m.texto}
              time={m.hora}
              ticks={isOut ? (t >= a + 8 ? "read" : "gray") : "none"}
              confirm={m.tipo === "confirmacao"}
              glow={glow}
            />
          )}
        </div>
      </Slot>,
    );
  });

  // Cronômetro no topo: conta de 00:00 na 1ª mensagem até 00:03 (verde) na 1ª resposta
  const m1 = arrivals[0];
  const m2 = arrivals[1];
  const timerIn = enter(t, fps, m1);
  const seconds = Math.floor(interpolate(t, [m1, m2], [0, 3], clamped));
  const answered = t >= m2;
  const pop = interpolate(t, [m2, m2 + 4, m2 + 10], [1, 1.2, 1], clamped);
  const timer = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 999,
        background: answered ? colors.mint : "#F3F4F6",
        color: answered ? colors.brand : colors.textMuted,
        fontFamily: fonts.ui,
        fontWeight: 700,
        fontSize: 24,
        fontVariantNumeric: "tabular-nums",
        scale: (0.8 + 0.2 * timerIn) * pop,
      }}
    >
      <Timer size={22} strokeWidth={2.6} />
      00:0{seconds}
    </div>
  );

  return (
    <>
      <StatusBar time={clock} color={colors.text} />
      <ChatHeader
        name={copy.chat.nomeEmpresa}
        status={copy.chat.status}
        accessory={timer}
        accessoryIn={fadeFrom(timerIn)}
      />

      <div
        style={{
          position: "absolute",
          top: VIEWPORT_TOP,
          left: 0,
          right: 0,
          height: VIEWPORT_H,
          overflow: "hidden",
          background: colors.chatBackground,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: "0 18px 18px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {items}
        </div>
      </div>

      {/* Campo de digitar (decoração) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: PHONE.homeIndicator,
          height: PHONE.chatInput,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 16px",
          background: colors.chatBackground,
        }}
      >
        <div
          style={{
            flex: 1,
            height: 64,
            borderRadius: 32,
            background: colors.white,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 20px",
            color: colors.textMuted,
            fontFamily: fonts.ui,
            fontSize: 28,
          }}
        >
          <Smile size={30} />
          <span style={{ flex: 1 }}>{copy.chat.placeholder}</span>
          <Paperclip size={28} />
        </div>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            background: colors.brand,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Mic size={30} color={colors.white} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: PHONE.homeIndicator,
          background: colors.chatBackground,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ width: 180, height: 6, borderRadius: 3, background: colors.text }} />
      </div>
    </>
  );
};
