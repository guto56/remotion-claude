import { BatteryFull, Signal, Wifi } from "lucide-react";
import React from "react";
import { PHONE } from "../layout";
import { colors, fonts, shadow } from "../theme";

// Celular genérico 560x1000. `screen` é o fundo da tela (cor ou degradê).
export const PhoneFrame: React.FC<{
  children: React.ReactNode;
  screen: string;
  overlay?: React.ReactNode; // desenhado por cima do aparelho (ex.: badge)
}> = ({ children, screen, overlay }) => {
  const button = (side: "left" | "right", top: number, height: number) => (
    <div
      style={{
        position: "absolute",
        [side]: -5,
        top,
        width: 6,
        height,
        borderRadius: 3,
        background: "#1E2826",
      }}
    />
  );

  return (
    <div
      style={{
        position: "relative",
        width: PHONE.width,
        height: PHONE.height,
        borderRadius: PHONE.bodyRadius,
        background: colors.phoneBody,
        boxShadow: `${shadow.phone}, inset 0 0 0 2px rgba(255,255,255,0.12)`,
      }}
    >
      {button("left", 210, 70)}
      {button("left", 300, 70)}
      {button("right", 260, 110)}
      <div
        style={{
          position: "absolute",
          left: PHONE.bezel,
          top: PHONE.bezel,
          width: PHONE.width - PHONE.bezel * 2,
          height: PHONE.height - PHONE.bezel * 2,
          borderRadius: PHONE.screenRadius,
          overflow: "hidden",
          background: screen,
        }}
      >
        {children}
      </div>
      {/* "Ilha" da câmera */}
      <div
        style={{
          position: "absolute",
          top: PHONE.bezel + 12,
          left: PHONE.width / 2 - 62,
          width: 124,
          height: 36,
          borderRadius: 18,
          background: "#000",
        }}
      />
      {overlay}
    </div>
  );
};

// Barra de status (hora, sinal, wi-fi, bateria).
export const StatusBar: React.FC<{ time: string; color: string }> = ({
  time,
  color,
}) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: PHONE.statusBar,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "6px 34px 0 44px",
      color,
      fontFamily: fonts.ui,
      fontWeight: 600,
      fontSize: 22,
      fontVariantNumeric: "tabular-nums",
      zIndex: 2,
    }}
  >
    <span>{time}</span>
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Signal size={22} strokeWidth={2.5} />
      <Wifi size={22} strokeWidth={2.5} />
      <BatteryFull size={28} strokeWidth={2} />
    </div>
  </div>
);
