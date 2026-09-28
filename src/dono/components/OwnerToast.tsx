import { BellRing } from "lucide-react";
import React from "react";
import { cores, fontes, tipo } from "../theme";

// Aviso que o DONO recebe no WhatsApp dele (cartão escuro que desce do topo).
export const OwnerToast: React.FC<{ rotulo: string; texto: string; style?: React.CSSProperties }> = ({
  rotulo,
  texto,
  style,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "14px 18px",
      borderRadius: 24,
      background: cores.texto,
      boxShadow: "0 16px 36px rgba(0,0,0,0.35)",
      fontFamily: fontes.ui,
      color: cores.branco,
      ...style,
    }}
  >
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: 26,
        flexShrink: 0,
        background: cores.marca,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <BellRing size={28} color={cores.branco} strokeWidth={2.4} />
    </div>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontWeight: 500, fontSize: 19, color: cores.amarelo, letterSpacing: "0.02em" }}>{rotulo}</div>
      <div style={{ fontWeight: 600, fontSize: tipo.aviso, lineHeight: 1.22 }}>{texto}</div>
    </div>
  </div>
);
