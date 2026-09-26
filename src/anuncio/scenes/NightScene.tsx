import { Camera, Flashlight, Moon, Sun } from "lucide-react";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ChatBubble } from "../components/ChatBubble";
import { KineticHeadline } from "../components/KineticHeadline";
import { NotificationStack } from "../components/NotificationStack";
import { PhoneFrame, StatusBar } from "../components/PhoneFrame";
import { copy } from "../copy";
import { PHONE, type Layout } from "../layout";
import { clamped, enter, fadeFrom, slowZoom } from "../lib/motion";
import { colors, fonts } from "../theme";
import { DOR, GANCHO, MOTION, SCENES } from "../timing";

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const formatClock = (minutes: number) => {
  const total = Math.round(minutes) % (24 * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

// Cenas 1 (gancho) e 2 (dor): mesmo celular do começo ao fim, por isso ficam juntas.
// frame 0 = SCENES.gancho
export const NightScene: React.FC<{
  gancho: keyof typeof copy.gancho;
  layout: Layout;
}> = ({ gancho, layout }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dorAt = SCENES.dor - SCENES.gancho;
  const sceneEnd = SCENES.dado - SCENES.gancho;
  const d = frame - dorAt; // frame relativo à cena 2
  const side = layout.safe.side;

  // --- Notificações (uma a cada 8 frames) e vibração ---
  const arrivals = Array.from(
    { length: GANCHO.notificacoes },
    (_, i) => GANCHO.primeiraNotificacao + i * GANCHO.notificacaoACada,
  );
  const count = arrivals.filter((a) => frame >= a).length;
  const sinceLast = frame - arrivals[Math.max(0, count - 1)];
  const vibrate =
    count > 0 && sinceLast < GANCHO.vibracao ? (sinceLast % 2 === 0 ? 6 : -6) : 0;
  const badgePop = interpolate(sinceLast, [0, 3, 8], [1.35, 0.95, 1], clamped);

  // --- Cena 2: celular vai a 80% e notificações ficam cinza ---
  const shrink = enter(frame, fps, dorAt + DOR.encolhe);
  const scale =
    layout.night.phoneScale *
    slowZoom(frame, 0, sceneEnd) *
    interpolate(shrink, [0, 1], [1, layout.night.shrinkTo]);
  const gray = interpolate(d, [DOR.encolhe, DOR.encolhe + MOTION.exitFrames], [0, 1], clamped);

  // --- Relógio: 23:41 -> 08:30 (lua vira sol) ---
  const from = toMinutes(copy.dor.relogioDe);
  let to = toMinutes(copy.dor.relogioAte);
  if (to < from) to += 24 * 60;
  const night = interpolate(d, [DOR.relogioInicio, DOR.relogioFim], [0, 1], {
    ...clamped,
    easing: Easing.inOut(Easing.cubic),
  });
  const clock = formatClock(from + (to - from) * night);
  const moon = interpolate(night, [0.35, 0.6], [1, 0], clamped);
  const sun = interpolate(night, [0.45, 0.7], [0, 1], clamped);

  // --- Balão do cliente sem resposta ---
  const bubble = enter(frame, fps, dorAt + DOR.mensagem);

  const headline = (
    text: string,
    start: number,
    exitAt?: number,
    red = false,
  ) =>
    frame >= start - 1 && (exitAt === undefined || frame < exitAt + MOTION.exitFrames) ? (
      <div
        style={{
          position: "absolute",
          top: layout.headlineTop,
          left: side,
          right: side,
        }}
      >
        <KineticHeadline
          text={text}
          start={start}
          exitAt={exitAt}
          tone="dark"
          fontSize={layout.headlineSize}
          highlightColor={red ? colors.red : undefined}
          shake={red}
        />
      </div>
    ) : null;

  const badge = (
    <div
      style={{
        position: "absolute",
        top: -18,
        right: -18,
        width: 66,
        height: 66,
        borderRadius: 33,
        background: colors.red,
        border: `5px solid ${colors.night}`,
        color: colors.white,
        fontFamily: fonts.ui,
        fontWeight: 700,
        fontSize: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        scale: count > 0 ? badgePop : 0,
      }}
    >
      {count}
    </div>
  );

  const roundButton = (icon: React.ReactNode, pos: "left" | "right") => (
    <div
      style={{
        position: "absolute",
        bottom: 64,
        [pos]: 48,
        width: 72,
        height: 72,
        borderRadius: 36,
        background: "rgba(255,255,255,0.14)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: colors.white,
      }}
    >
      {icon}
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: colors.night }}>
      {/* Brilho verde atrás do celular (decoração) */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% ${layout.night.phoneTop + 360}px, rgba(15,118,110,0.45), transparent 55%)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: (layout.width - PHONE.width) / 2,
          top: layout.night.phoneTop,
          width: PHONE.width,
          height: PHONE.height,
          transformOrigin: "top center",
          scale,
          translate: `${vibrate}px 0px`,
        }}
      >
        <PhoneFrame
          screen={`linear-gradient(180deg, ${colors.lockScreenTop} 0%, ${colors.lockScreenBottom} 100%)`}
          overlay={badge}
        >
          {/* Amanhecer: a tela esquenta de leve enquanto o relógio avança */}
          <AbsoluteFill
            style={{
              background: "linear-gradient(180deg, rgba(255,190,90,0.16), transparent 70%)",
              opacity: sun,
            }}
          />
          <StatusBar time={clock} color={colors.white} />
          <div
            style={{
              position: "absolute",
              top: PHONE.lockIconTop,
              left: 0,
              right: 0,
              height: 40,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div style={{ position: "absolute", opacity: moon, rotate: `${(1 - moon) * 90}deg` }}>
              <Moon size={38} color="#E5E7EB" strokeWidth={2.2} />
            </div>
            <div
              style={{
                position: "absolute",
                opacity: sun,
                rotate: `${(sun - 1) * 90}deg`,
                scale: 0.6 + 0.4 * sun,
              }}
            >
              <Sun size={40} color={colors.yellow} strokeWidth={2.4} />
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: PHONE.lockClockTop,
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 124,
              lineHeight: 1,
              letterSpacing: -3,
              color: colors.white,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {clock}
          </div>
          <NotificationStack
            arrivals={arrivals}
            maxVisible={GANCHO.maxVisiveis}
            gray={gray}
            title={copy.notificacao.titulo}
            when={copy.notificacao.quando}
          />
          {roundButton(<Flashlight size={32} />, "left")}
          {roundButton(<Camera size={32} />, "right")}
          <div
            style={{
              position: "absolute",
              bottom: 14,
              left: "50%",
              width: 180,
              height: 6,
              marginLeft: -90,
              borderRadius: 3,
              background: "rgba(255,255,255,0.8)",
            }}
          />
        </PhoneFrame>
      </div>

      {/* Balão do cliente: visualizado, sem resposta */}
      {d >= DOR.mensagem - 1 ? (
        <div
          style={{
            position: "absolute",
            top: layout.night.bubbleTop,
            left: side,
            right: side,
            display: "flex",
            justifyContent: "center",
            opacity: fadeFrom(bubble),
            translate: `0px ${(1 - bubble) * 60}px`,
            scale: 0.9 + 0.1 * bubble,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <ChatBubble
              direction="out"
              text={copy.dor.mensagemCliente}
              time={copy.dor.horaMensagem}
              ticks="gray"
              maxWidth={layout.width - side * 2}
            />
          </div>
        </div>
      ) : null}

      {headline(copy.gancho[gancho], GANCHO.titulo, GANCHO.tituloSai)}
      {headline(copy.dor.titulo1, dorAt + DOR.titulo1, dorAt + DOR.titulo1Sai)}
      {headline(copy.dor.titulo2, dorAt + DOR.titulo2, undefined, true)}
    </AbsoluteFill>
  );
};
