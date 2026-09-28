import { CheckCheck, Image as ImageIcon } from "lucide-react";
import React from "react";
import { cores, fontes, raio, sombra, tipo } from "../theme";

// Foto enviada pelo cliente: retângulo cinza genérico com ícone e legenda.
export const PhotoBubble: React.FC<{ legenda: string; hora: string; lido?: boolean }> = ({
  legenda,
  hora,
  lido = false,
}) => (
  <div
    style={{
      alignSelf: "flex-end",
      width: 300,
      padding: 8,
      background: cores.balaoCliente,
      border: `2px solid ${cores.bordaCliente}`,
      borderRadius: raio.balao,
      borderBottomRightRadius: 8,
      boxShadow: sombra.balao,
      fontFamily: fontes.ui,
    }}
  >
    <div
      style={{
        height: 190,
        borderRadius: 20,
        background: "linear-gradient(135deg, #D1D5DB 0%, #9CA3AF 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ImageIcon size={64} color="rgba(255,255,255,0.9)" strokeWidth={1.8} />
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 8px 2px 10px",
      }}
    >
      <span style={{ fontWeight: 500, fontSize: tipo.conversa, color: cores.texto }}>{legenda}</span>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontWeight: 400,
          fontSize: tipo.horaBalao,
          color: cores.cinza,
        }}
      >
        {hora}
        <CheckCheck size={24} strokeWidth={2.5} color={lido ? "#3B82F6" : "#9CA3AF"} />
      </span>
    </div>
  </div>
);
