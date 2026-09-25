import { Smile } from "lucide-react";
import React from "react";
import { colors, fonts } from "../theme";
import { ChatBubble } from "./ChatBubble";

// Balão da assistente com um banner 16:9 gerado em código + legenda.
export const ImageBubble: React.FC<{
  title: string;
  subtitle: string;
  caption: string;
  time: string;
}> = ({ title, subtitle, caption, time }) => (
  <ChatBubble direction="in" text={caption} time={time} width={440}>
    <div
      style={{
        position: "relative",
        margin: "-6px -14px 12px",
        aspectRatio: "16 / 9",
        borderRadius: 20,
        overflow: "hidden",
        background: `linear-gradient(135deg, ${colors.brand} 0%, ${colors.brandLight} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        color: colors.white,
        textAlign: "center",
      }}
    >
      {/* Círculos decorativos */}
      <div
        style={{
          position: "absolute",
          width: 220,
          height: 220,
          borderRadius: 110,
          right: -60,
          top: -90,
          background: "rgba(255,255,255,0.12)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 160,
          height: 160,
          borderRadius: 80,
          left: -50,
          bottom: -70,
          background: "rgba(255,255,255,0.10)",
        }}
      />
      <Smile size={44} strokeWidth={2.2} />
      <div style={{ fontFamily: fonts.title, fontWeight: 800, fontSize: 38 }}>
        {title}
      </div>
      <div
        style={{
          fontFamily: fonts.ui,
          fontWeight: 500,
          fontSize: 22,
          opacity: 0.92,
        }}
      >
        {subtitle}
      </div>
    </div>
  </ChatBubble>
);
