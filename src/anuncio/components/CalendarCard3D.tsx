import { Check } from "lucide-react";
import React from "react";
import { interpolate, useVideoConfig } from "remotion";
import { copy } from "../copy";
import { clamped, enter, fadeFrom } from "../lib/motion";
import { colors, fonts, radius } from "../theme";
import { AGENDA } from "../timing";

// Agenda em visão de semana, inspirada no Google Agenda mas genérica
// (sem logo nem nome). Desenhada em 420x840; no Feed é escalada para 80%.
export const CALENDAR = { width: 420, height: 840 };

const PAD = 20;
const HEADER = 80;
const HOURS_COL = 70;
const FIRST_HOUR = 8;
const LAST_HOUR = 20; // a grade vai de 08:00 a 20:00 (rótulos 08:00 a 19:00)
const ROW = (CALENDAR.height - HEADER - PAD * 2) / (LAST_HOUR - FIRST_HOUR);
const COL = (CALENDAR.width - PAD * 2 - HOURS_COL) / 3;

const hours = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h + m / 60;
};

// Posição de um intervalo na grade (coordenadas dentro da área da grade)
const slot = (dia: number, de: string, ate: string) => ({
  left: HOURS_COL + dia * COL + 4,
  top: (hours(de) - FIRST_HOUR) * ROW + 2,
  width: COL - 8,
  height: (hours(ate) - hours(de)) * ROW - 4,
});

// `t` = frame relativo ao início da Cena 5
export const CalendarCard3D: React.FC<{ t: number }> = ({ t }) => {
  const { fps } = useVideoConfig();
  const agenda = copy.chat.agenda;

  // Oscilação lenta de ±2° para a agenda não ficar parada
  const wobble = Math.sin((t - AGENDA.entra) / 40) * 2;

  // Destaques somem quando o evento é criado (menos o do próprio evento)
  const others = interpolate(t, [AGENDA.evento, AGENDA.evento + 8], [1, 0], clamped);
  const eventGrow = enter(t, fps, AGENDA.evento);
  const checkIn = enter(t, fps, AGENDA.check);
  const checkPulse = interpolate(
    t,
    [AGENDA.check + 6, AGENDA.check + 11, AGENDA.check + 16],
    [1, 1.15, 1],
    clamped,
  );

  return (
    <div
      style={{
        width: CALENDAR.width,
        height: CALENDAR.height,
        borderRadius: radius.bubble,
        background: colors.white,
        boxShadow: "0 40px 90px rgba(11,31,29,0.28), 0 8px 24px rgba(0,0,0,0.12)",
        padding: PAD,
        fontFamily: fonts.ui,
        transform: `rotateY(${-14 + wobble}deg) rotateX(${6 - wobble / 2}deg)`,
        position: "relative",
      }}
    >
      {/* Cabeçalho: dias da semana */}
      <div style={{ display: "flex", height: HEADER, paddingLeft: HOURS_COL }}>
        {agenda.dias.map((dia, i) => {
          const today = i === agenda.hoje;
          return (
            <div
              key={dia}
              style={{
                width: COL,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: today ? colors.brand : colors.textMuted,
                }}
              >
                {dia}
              </div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 600,
                  background: today ? colors.brand : "transparent",
                  color: today ? colors.white : colors.text,
                }}
              >
                {agenda.datas[i]}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grade */}
      <div style={{ position: "relative", height: ROW * (LAST_HOUR - FIRST_HOUR) }}>
        {Array.from({ length: LAST_HOUR - FIRST_HOUR }, (_, i) => (
          <React.Fragment key={i}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: i * ROW - 12,
                width: HOURS_COL - 10,
                fontSize: 22,
                fontWeight: 400,
                color: colors.textMuted,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {String(FIRST_HOUR + i).padStart(2, "0")}:00
            </div>
            <div
              style={{
                position: "absolute",
                left: HOURS_COL,
                right: 0,
                top: i * ROW,
                height: 1,
                background: colors.clientBorder,
              }}
            />
          </React.Fragment>
        ))}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: HOURS_COL + i * COL,
              top: 0,
              bottom: 0,
              width: 1,
              background: colors.clientBorder,
            }}
          />
        ))}

        {/* Compromissos já marcados (cinza) */}
        {agenda.ocupados.map((o, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              ...slot(o.dia, o.de, o.ate),
              borderRadius: 10,
              background: colors.clientBorder,
              padding: "8px 10px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div style={{ width: "70%", height: 8, borderRadius: 4, background: "#D1D5DB" }} />
            <div style={{ width: "45%", height: 8, borderRadius: 4, background: "#D1D5DB" }} />
          </div>
        ))}

        {/* Horários livres acendendo em sequência, com contorno pulsando */}
        {agenda.livres.map((l, i) => {
          const start = AGENDA.acende + i * AGENDA.acendeACada;
          if (t < start) return null;
          const p = enter(t, fps, start);
          const pulse = 0.5 + 0.5 * Math.sin((t - start) / 4);
          const isEvent = l.dia === agenda.evento.dia && l.de === agenda.evento.de;
          const visible = fadeFrom(p) * (isEvent ? 1 - fadeFrom(eventGrow) : others);
          if (visible <= 0) return null;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                ...slot(l.dia, l.de, l.ate),
                borderRadius: 10,
                border: `4px solid ${colors.brand}`,
                background: "rgba(15,118,110,0.16)",
                boxShadow: `0 0 0 ${4 + 8 * pulse}px rgba(15,118,110,${0.4 * (1 - pulse)})`,
                opacity: visible,
                scale: 0.85 + 0.15 * p,
              }}
            />
          );
        })}

        {/* Evento criado: cresce de altura 0 até a altura do horário */}
        {t >= AGENDA.evento - 1 ? (
          <div
            style={{
              position: "absolute",
              ...slot(agenda.evento.dia, agenda.evento.de, agenda.evento.ate),
              height:
                slot(agenda.evento.dia, agenda.evento.de, agenda.evento.ate).height *
                Math.min(eventGrow, 1.05),
              borderRadius: 10,
              background: colors.brand,
              boxShadow: "0 8px 20px rgba(15,118,110,0.35)",
              padding: "4px 8px",
              opacity: Math.min(1, eventGrow * 4), // esconde o filete do padding no 1º frame
              overflow: "visible",
            }}
          >
            <div
              style={{
                height: "100%",
                overflow: "hidden",
                color: colors.white,
                fontWeight: 600,
                fontSize: 24,
                lineHeight: 1.05,
              }}
            >
              {/* "Maria · 09:00" vira duas linhas: a coluna é estreita */}
              {agenda.evento.texto.split(" · ").map((parte) => (
                <div key={parte}>{parte}</div>
              ))}
            </div>
            {t >= AGENDA.check - 1 ? (
              <div
                style={{
                  position: "absolute",
                  top: -14,
                  right: -14,
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  background: "#065F58",
                  border: `3px solid ${colors.white}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  scale: checkIn * checkPulse,
                }}
              >
                <Check size={20} color={colors.white} strokeWidth={3.5} />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};
