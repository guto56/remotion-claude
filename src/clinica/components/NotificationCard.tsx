import { MessageCircle } from "lucide-react";
import React from "react";
import { CELULAR } from "../layout";
import { cores, fontes } from "../theme";

// Notificação da tela de bloqueio: ícone de balão, título, prévia e "agora".
export const NotificationCard: React.FC<{
  titulo: string;
  previa: string;
  quando: string;
  style?: React.CSSProperties;
}> = ({ titulo, previa, quando, style }) => (
  <div
    style={{
      height: CELULAR.notificacaoAltura,
      borderRadius: 24,
      background: "rgba(255,255,255,0.16)",
      border: "1px solid rgba(255,255,255,0.12)",
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "0 18px 0 14px",
      fontFamily: fontes.ui,
      color: cores.branco,
      ...style,
    }}
  >
    <div
      style={{
        width: 50,
        height: 50,
        borderRadius: 13,
        flexShrink: 0,
        background: cores.marca,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MessageCircle size={28} color={cores.branco} strokeWidth={2.5} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontWeight: 600, fontSize: 24 }}>{titulo}</span>
        <span style={{ fontWeight: 400, fontSize: 19, opacity: 0.65 }}>{quando}</span>
      </div>
      <div
        style={{
          fontWeight: 400,
          fontSize: 23,
          opacity: 0.85,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {previa}
      </div>
    </div>
  </div>
);
