import { ChevronLeft, Timer } from "lucide-react";
import React from "react";
import { CELULAR } from "../layout";
import { cores, fontes } from "../theme";

// Cabeçalho da conversa: avatar com a inicial, nome do negócio, "online" em
// verde e o cronômetro "00:03" (aparece quando chega a 1ª resposta).
export const ChatHeader: React.FC<{
  nome: string;
  status: string;
  cronometro: string;
  mostraCronometro: number; // 0..1 (entrada do cronômetro)
}> = ({ nome, status, cronometro, mostraCronometro }) => (
  <div
    style={{
      position: "absolute",
      top: CELULAR.barraStatus,
      left: 0,
      right: 0,
      height: CELULAR.cabecalho,
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "0 18px 0 8px",
      background: cores.branco,
      borderBottom: `1px solid ${cores.bordaCliente}`,
      fontFamily: fontes.ui,
      zIndex: 2,
    }}
  >
    <ChevronLeft size={34} color={cores.marca} strokeWidth={2.5} />
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: 30,
        flexShrink: 0,
        background: cores.marca,
        color: cores.branco,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: 28,
      }}
    >
      {nome.trim().charAt(0).toUpperCase()}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontWeight: 600, fontSize: 27, color: cores.texto, whiteSpace: "nowrap" }}>{nome}</div>
      <div style={{ fontWeight: 500, fontSize: 20, color: cores.marca }}>{status}</div>
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "6px 12px",
        borderRadius: 999,
        background: cores.menta,
        color: cores.marca,
        fontWeight: 600,
        fontSize: 21,
        fontVariantNumeric: "tabular-nums",
        opacity: Math.min(1, mostraCronometro * 2),
        transform: `scale(${0.6 + 0.4 * mostraCronometro})`,
      }}
    >
      <Timer size={20} strokeWidth={2.6} />
      {cronometro}
    </div>
  </div>
);
