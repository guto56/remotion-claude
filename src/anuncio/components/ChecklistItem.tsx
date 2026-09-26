import { Check } from "lucide-react";
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamped, enter, fadeFrom } from "../lib/motion";
import { colors, fonts, type } from "../theme";

// Item de lista com círculo verde + check. `pulseAt` dá um "pulo" no círculo.
export const ChecklistItem: React.FC<{
  text: string;
  start: number;
  pulseAt?: number;
}> = ({ text, start, pulseAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, start);
  const check = enter(frame, fps, start + 4);
  const pulse =
    pulseAt === undefined
      ? 1
      : interpolate(frame, [pulseAt, pulseAt + 5, pulseAt + 10], [1, 1.18, 1], clamped);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 28,
        opacity: fadeFrom(p),
        translate: `${(1 - p) * -60}px 0px`,
      }}
    >
      <div
        style={{
          width: 68,
          height: 68,
          borderRadius: 34,
          flexShrink: 0,
          background: colors.brand,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          scale: (0.6 + 0.4 * check) * pulse,
        }}
      >
        <Check size={42} color={colors.white} strokeWidth={3.5} />
      </div>
      <div
        style={{
          fontFamily: fonts.ui,
          fontWeight: 600,
          fontSize: type.checklist,
          lineHeight: 1.2,
          color: colors.text,
          paddingTop: 0, // 1ª linha (56 px) alinhada ao círculo
        }}
      >
        {text}
      </div>
    </div>
  );
};
