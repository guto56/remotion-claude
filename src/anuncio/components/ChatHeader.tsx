import { ChevronLeft, Phone, Video } from "lucide-react";
import React from "react";
import { PHONE } from "../layout";
import { colors, fonts } from "../theme";
import { Logo } from "./Logo";

// Topo da conversa: voltar, avatar com a logo, nome e "online".
// `accessory` (ex.: cronômetro) substitui os ícones de chamada conforme `accessoryIn` (0..1).
export const ChatHeader: React.FC<{
  name: string;
  status: string;
  accessory?: React.ReactNode;
  accessoryIn?: number;
}> = ({ name, status, accessory, accessoryIn = 0 }) => (
  <div
    style={{
      position: "absolute",
      top: PHONE.statusBar,
      left: 0,
      right: 0,
      height: PHONE.chatHeader,
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "0 20px 0 8px",
      background: colors.white,
      borderBottom: `1px solid ${colors.clientBorder}`,
      fontFamily: fonts.ui,
      zIndex: 1,
    }}
  >
    <ChevronLeft size={38} color={colors.brand} strokeWidth={2.5} />
    <Logo size={62} avatar />
    <div style={{ flex: 1, minWidth: 0, marginLeft: 4, whiteSpace: "nowrap" }}>
      <div style={{ fontWeight: 600, fontSize: 30, color: colors.text }}>
        {name}
      </div>
      <div style={{ fontWeight: 500, fontSize: 22, color: colors.brand }}>
        {status}
      </div>
    </div>
    <div style={{ position: "relative", width: 124, height: 52 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 20,
          opacity: 1 - accessoryIn,
        }}
      >
        <Video size={34} color={colors.brand} strokeWidth={2.2} />
        <Phone size={30} color={colors.brand} strokeWidth={2.2} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          opacity: accessoryIn,
        }}
      >
        {accessory}
      </div>
    </div>
  </div>
);
