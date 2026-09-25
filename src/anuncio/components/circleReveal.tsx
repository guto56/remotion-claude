import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import { clamped } from "../lib/motion";

type CircleRevealProps = { color: string };

// Transição da cena 4: um círculo colorido cresce do centro e cobre a tela,
// e logo atrás dele a cena nova (fundo claro) é revelada.
const CircleRevealPresentation: React.FC<
  TransitionPresentationComponentProps<CircleRevealProps>
> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const { width, height } = useVideoConfig();

  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  const maxRadius = Math.hypot(width / 2, height / 2) + 20;
  const disc = interpolate(presentationProgress, [0, 0.75], [0, maxRadius], clamped);
  const reveal = interpolate(presentationProgress, [0.3, 1], [0, maxRadius], clamped);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundColor: passedProps.color,
          clipPath: `circle(${disc}px at 50% 50%)`,
        }}
      />
      <AbsoluteFill style={{ clipPath: `circle(${reveal}px at 50% 50%)` }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const circleReveal = (
  props: CircleRevealProps,
): TransitionPresentation<CircleRevealProps> => ({
  component: CircleRevealPresentation,
  props,
});
