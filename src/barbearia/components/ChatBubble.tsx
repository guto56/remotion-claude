import { CheckCheck } from "lucide-react";
import React from "react";
import { parseChat } from "../../anuncio/lib/text";
import { cores, fontes, raio, sombra, tipo } from "../theme";

// Balão de conversa.
//   de "assistente" = esquerda, menta
//   de "cliente"    = direita, branco com borda
// *negrito* aparece em negrito (sem os asteriscos); \n quebra a linha.
export const ChatBubble: React.FC<{
  de: "cliente" | "assistente";
  texto: string;
  hora: string;
  lido?: boolean; // tiques azuis (só no cliente)
  confirma?: boolean; // borda verde (balão de confirmação)
  brilho?: number; // 0..1 brilho extra na borda
}> = ({ de, texto, hora, lido = false, confirma = false, brilho = 0 }) => {
  const cliente = de === "cliente";
  const linhas = parseChat(texto).flat();
  const espacoHora = cliente ? 104 : 70; // reserva no fim da última linha

  return (
    <div
      style={{
        position: "relative",
        alignSelf: cliente ? "flex-end" : "flex-start",
        maxWidth: 420,
        background: cliente ? cores.balaoCliente : cores.menta,
        border: confirma
          ? `3px solid ${cores.marca}`
          : cliente
            ? `2px solid ${cores.bordaCliente}`
            : "2px solid transparent",
        borderRadius: raio.balao,
        [cliente ? "borderBottomRightRadius" : "borderBottomLeftRadius"]: 8,
        boxShadow:
          brilho > 0
            ? `${sombra.balao}, 0 0 0 ${brilho * 10}px rgba(15,118,110,${0.25 * brilho})`
            : sombra.balao,
        padding: "12px 20px 10px",
        fontFamily: fontes.ui,
        fontWeight: 500,
        fontSize: tipo.conversa,
        lineHeight: 1.26,
        color: cores.texto,
      }}
    >
      {linhas.map((trechos, l) => (
        <div key={l}>
          {trechos.map((t, i) => (
            <span key={i} style={{ fontWeight: t.on ? 700 : undefined }}>
              {t.text}
            </span>
          ))}
          {l === linhas.length - 1 ? <span style={{ display: "inline-block", width: espacoHora }} /> : null}
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          right: 16,
          bottom: 8,
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontWeight: 400,
          fontSize: tipo.horaBalao,
          color: cores.cinza,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {hora}
        {cliente ? <CheckCheck size={24} strokeWidth={2.5} color={lido ? "#3B82F6" : "#9CA3AF"} /> : null}
      </div>
    </div>
  );
};
