import React from "react";
import {
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamped, enter, fadeFrom } from "../lib/motion";
import { colors, fonts, type } from "../theme";

// Número gigante que conta de `from` até `to` e dá um pulso ao terminar.
export const StatCounter: React.FC<{
  from: number;
  to: number;
  suffix: string;
  start: number;
  end: number; // frame em que a contagem termina (e o pulso começa)
}> = ({ from, to, suffix, start, end }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const value = Math.round(
    interpolate(frame, [start, end], [from, to], {
      ...clamped,
      easing: Easing.out(Easing.cubic),
    }),
  );
  const p = enter(frame, fps, start);
  const pulse = interpolate(frame, [end, end + 6, end + 12], [1, 1.08, 1], clamped);

  return (
    <div
      style={{
        fontFamily: fonts.title,
        fontWeight: 800,
        fontSize: type.statNumber,
        lineHeight: 1,
        color: colors.yellow,
        fontVariantNumeric: "tabular-nums",
        opacity: fadeFrom(p),
        scale: (0.7 + 0.3 * p) * pulse,
      }}
    >
      {value}
      {suffix}
    </div>
  );
};
