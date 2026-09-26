import { CalendarDays, CheckCircle2, Zap } from "lucide-react";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CALENDAR, CalendarCard3D } from "../components/CalendarCard3D";
import { ChatScreen } from "../components/ChatScreen";
import { ChecklistItem } from "../components/ChecklistItem";
import { FloatingChip } from "../components/FloatingChip";
import { KineticHeadline } from "../components/KineticHeadline";
import { PhoneFrame } from "../components/PhoneFrame";
import { copy } from "../copy";
import { PHONE, type Layout } from "../layout";
import { clamped, enter, fadeFrom, slowZoom } from "../lib/motion";
import { colors } from "../theme";
import { AGENDA, BENEFICIOS, DEMO, MOTION, SCENES, VIRADA } from "../timing";

// Cenas 4 (virada), 5 (demonstração) e 6 (benefícios): mesmo fundo claro,
// o título da 4 dá lugar ao celular, que depois sai para a esquerda.
// frame 0 = SCENES.virada
export const LightScene: React.FC<{ layout: Layout }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const demoAt = SCENES.demo - SCENES.virada;
  const benAt = SCENES.beneficios - SCENES.virada;
  const b = frame - benAt; // frame relativo à cena 6
  const side = layout.safe.side;

  // --- Cena 4: título sobe e some quando o celular entra ---
  const titleExit = demoAt + DEMO.tituloSai;
  const titleUp = interpolate(
    frame,
    [titleExit, titleExit + MOTION.exitFrames],
    [0, -160],
    { ...clamped, easing: Easing.in(Easing.cubic) },
  );

  // --- Cena 5: celular entra de baixo e sai para a esquerda na cena 6 ---
  const phoneStart = demoAt + DEMO.celularEntra;
  const phoneIn = enter(frame, fps, phoneStart);
  const phoneOut = interpolate(
    b,
    [BENEFICIOS.celularSai, BENEFICIOS.celularSai + MOTION.exitFrames],
    [0, 1],
    { ...clamped, easing: Easing.in(Easing.cubic) },
  );
  const phoneScale = layout.demo.phoneScale * slowZoom(frame, demoAt, benAt);
  const enterDistance = layout.height - layout.demo.phoneTop + 80;

  // --- Cena 5: agenda 3D ---
  // Na mensagem 4 o celular vai para a esquerda e gira; a agenda entra pela direita.
  // Antes da cena 6 a agenda sai e o celular volta ao normal.
  const PHONE_SHIFT = -140; // px
  const PHONE_TILT = 8; // graus (rotateY)
  const t = frame - demoAt; // frame relativo à cena 5
  const calIn = enter(frame, fps, demoAt + AGENDA.entra);
  const calOut = interpolate(t, [AGENDA.sai, AGENDA.sai + AGENDA.saiFrames], [0, 1], {
    ...clamped,
    easing: Easing.in(Easing.cubic),
  });
  const phoneBack = enter(frame, fps, demoAt + AGENDA.sai);
  const side3d = t >= AGENDA.entra ? calIn * (1 - phoneBack) : 0;
  const calW = CALENDAR.width * layout.demo.calendarScale;
  const calH = CALENDAR.height * layout.demo.calendarScale;
  const phoneRight =
    layout.width / 2 + PHONE_SHIFT + (PHONE.width * layout.demo.phoneScale) / 2;
  // Sobrepõe ~20% ao celular, sem passar da margem lateral (folga para a perspectiva)
  const calLeft = Math.min(phoneRight - 0.2 * calW, layout.width - side - 12 - calW);

  // Pílulas: entram junto com a mensagem indicada em timing.ts
  const chipAt = (index: number) => demoAt + DEMO.mensagens[index];

  // --- Cena 6: leve zoom para não ficar parado ---
  const drift = interpolate(b, [0, 120], [1, 1.03], clamped);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.light }}>
      {/* Cena 4 */}
      {frame < titleExit + MOTION.exitFrames ? (
        <div
          style={{
            position: "absolute",
            top: layout.safe.top,
            height: layout.safe.bottom - layout.safe.top,
            left: side,
            right: side,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            translate: `0px ${titleUp}px`,
          }}
        >
          <KineticHeadline
            text={copy.virada.titulo}
            start={VIRADA.titulo}
            exitAt={titleExit}
            tone="light"
            fontSize={layout.headlineSize}
          />
        </div>
      ) : null}

      {/* Cena 5: celular com a conversa */}
      {frame >= phoneStart - 1 && phoneOut < 1 ? (
        <div
          style={{
            position: "absolute",
            left: (layout.width - PHONE.width) / 2,
            top: layout.demo.phoneTop,
            width: PHONE.width,
            height: PHONE.height,
            scale: phoneScale,
            translate: `${-phoneOut * layout.width + PHONE_SHIFT * side3d}px ${(1 - phoneIn) * enterDistance}px`,
            transform: `perspective(1400px) rotateY(${PHONE_TILT * side3d}deg)`,
          }}
        >
          <PhoneFrame screen={colors.chatBackground}>
            <ChatScreen t={frame - demoAt} />
          </PhoneFrame>
        </div>
      ) : null}

      {/* Cena 5: agenda 3D ao lado do celular */}
      {t >= AGENDA.entra - 1 && calOut < 1 ? (
        <div
          style={{
            position: "absolute",
            left: calLeft,
            top: layout.demo.calendarCenterY - calH / 2,
            width: calW,
            height: calH,
            opacity: fadeFrom(calIn) * (1 - calOut),
            translate: `${(1 - calIn) * 600 + calOut * 600}px 0px`,
          }}
        >
          <div
            style={{
              width: CALENDAR.width,
              height: CALENDAR.height,
              scale: layout.demo.calendarScale,
              transformOrigin: "top left",
              perspective: 1400,
            }}
          >
            <CalendarCard3D t={t} />
          </div>
        </div>
      ) : null}

      {/* Pílulas flutuantes (ícones lucide) */}
      <FloatingChip
        icon={Zap}
        text={copy.chat.chips.resposta}
        start={chipAt(DEMO.chipResposta)}
        side="left"
        top={layout.demo.chipTop}
        margin={side}
      />
      <FloatingChip
        icon={CalendarDays}
        text={copy.chat.chips.agenda}
        start={chipAt(DEMO.chipAgenda)}
        side="right"
        top={layout.demo.chipTop}
        margin={side}
      />
      <FloatingChip
        icon={CheckCircle2}
        text={copy.chat.chips.agendou}
        start={chipAt(DEMO.chipAgendou)}
        side="left"
        top={layout.demo.chipTop}
        margin={side}
      />

      {/* Cena 6 */}
      {b >= BENEFICIOS.titulo - 1 ? (
        <AbsoluteFill style={{ scale: drift }}>
          <div
            style={{
              position: "absolute",
              top: layout.benefits.titleTop,
              left: side,
              right: side,
            }}
          >
            <KineticHeadline
              text={copy.beneficios.titulo}
              start={benAt + BENEFICIOS.titulo}
              tone="light"
              fontSize={layout.headlineSize}
            />
          </div>
          <div
            style={{
              position: "absolute",
              top: layout.benefits.listTop,
              left: side,
              right: side,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
              {copy.beneficios.itens.map((item, i) => (
                <ChecklistItem
                  key={item}
                  text={item}
                  start={benAt + BENEFICIOS.itens[i]}
                  pulseAt={benAt + BENEFICIOS.pulso + i * 6}
                />
              ))}
            </div>
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
