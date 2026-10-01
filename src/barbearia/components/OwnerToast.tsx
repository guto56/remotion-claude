import React from "react";
import { cores, fontes, tipo } from "../theme";

// Aviso que o DONO recebe (cartão branco com borda verde que desce do topo do
// celular).
export const OwnerToast: React.FC<{ titulo: string; detalhe: string; style?: React.CSSProperties }> = ({
  titulo,
  detalhe,
  style,
}) => (
  <div
    style={{
      padding: "14px 20px 16px",
      borderRadius: 24,
      background: cores.branco,
      border: `3px solid ${cores.marca}`,
      boxShadow: "0 16px 36px rgba(0,0,0,0.22)",
      fontFamily: fontes.ui,
      color: cores.texto,
      ...style,
    }}
  >
    <div style={{ fontWeight: 600, fontSize: tipo.aviso + 1, color: cores.marca }}>{titulo}</div>
    <div style={{ fontWeight: 600, fontSize: tipo.aviso, lineHeight: 1.25, marginTop: 2 }}>{detalhe}</div>
  </div>
);
