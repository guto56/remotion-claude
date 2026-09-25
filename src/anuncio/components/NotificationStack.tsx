import { MessageCircle } from "lucide-react";
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PHONE } from "../layout";
import { enter, fadeFrom } from "../lib/motion";
import { colors, fonts } from "../theme";

// Notificações da tela de bloqueio. A mais nova entra no topo e empurra as outras.
export const NotificationStack: React.FC<{
  arrivals: number[]; // frame de chegada de cada notificação
  maxVisible: number;
  gray: number; // 0 = colorido, 1 = cinza/apagado
  title: string;
  when: string;
}> = ({ arrivals, maxVisible, gray, title, when }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pitch = PHONE.notifHeight + PHONE.notifGap;
  const progress = arrivals.map((a) => enter(frame, fps, a));

  return (
    <div
      style={{
        position: "absolute",
        top: PHONE.notifTop,
        left: 16,
        right: 16,
        filter: `grayscale(${gray})`,
        opacity: 1 - 0.45 * gray,
      }}
    >
      {arrivals.map((arrival, i) => {
        if (frame < arrival - 1) return null;
        const p = progress[i];
        // Deslocamento causado pelas notificações que chegaram depois
        const slots = progress.slice(i + 1).reduce((sum, v) => sum + v, 0);
        const hide = interpolate(slots, [maxVisible - 1, maxVisible], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (hide <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: PHONE.notifHeight,
              translate: `0px ${slots * pitch + (1 - p) * -40}px`,
              scale: 0.92 + 0.08 * Math.min(p, 1),
              opacity: fadeFrom(p) * hide,
              borderRadius: 22,
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.10)",
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "0 18px 0 13px",
              fontFamily: fonts.ui,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: colors.brand,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MessageCircle size={26} color={colors.white} strokeWidth={2.5} />
            </div>
            <div
              style={{
                flex: 1,
                color: colors.white,
                fontWeight: 600,
                fontSize: 28,
              }}
            >
              {title}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.65)",
                fontWeight: 400,
                fontSize: 22,
              }}
            >
              {when}
            </div>
          </div>
        );
      })}
    </div>
  );
};
