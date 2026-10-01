import { BatteryFull, Signal, Wifi } from "lucide-react";
import React from "react";
import { CELULAR } from "../layout";
import { cores, fontes, sombra } from "../theme";

// Celular genérico 540x960. `tela` é o fundo da tela (cor ou degradê).
export const PhoneFrame: React.FC<{
  tela: string;
  children: React.ReactNode;
  sobreposto?: React.ReactNode; // desenhado por cima do aparelho (ex.: badge)
}> = ({ tela, children, sobreposto }) => {
  const botao = (lado: "left" | "right", top: number, altura: number) => (
    <div
      style={{
        position: "absolute",
        [lado]: -5,
        top,
        width: 6,
        height: altura,
        borderRadius: 3,
        background: "#1E2826",
      }}
    />
  );

  return (
    <div
      style={{
        position: "relative",
        width: CELULAR.largura,
        height: CELULAR.altura,
        borderRadius: CELULAR.raio,
        background: cores.corpoCelular,
        boxShadow: `${sombra.celular}, inset 0 0 0 2px rgba(255,255,255,0.12)`,
      }}
    >
      {botao("left", 200, 66)}
      {botao("left", 286, 66)}
      {botao("right", 250, 104)}
      <div
        style={{
          position: "absolute",
          left: CELULAR.borda,
          top: CELULAR.borda,
          width: CELULAR.largura - CELULAR.borda * 2,
          height: CELULAR.altura - CELULAR.borda * 2,
          borderRadius: CELULAR.raioTela,
          overflow: "hidden",
          background: tela,
        }}
      >
        {children}
      </div>
      {/* "Ilha" da câmera */}
      <div
        style={{
          position: "absolute",
          top: CELULAR.borda + 11,
          left: CELULAR.largura / 2 - 58,
          width: 116,
          height: 34,
          borderRadius: 17,
          background: "#000",
        }}
      />
      {sobreposto}
    </div>
  );
};

// Barra de status (hora, sinal, wi-fi, bateria)
export const StatusBar: React.FC<{ hora: string; cor: string }> = ({ hora, cor }) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: CELULAR.barraStatus,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "6px 32px 0 42px",
      color: cor,
      fontFamily: fontes.ui,
      fontWeight: 600,
      fontSize: 21,
      fontVariantNumeric: "tabular-nums",
      zIndex: 3,
    }}
  >
    <span>{hora}</span>
    <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
      <Signal size={21} strokeWidth={2.5} />
      <Wifi size={21} strokeWidth={2.5} />
      <BatteryFull size={27} strokeWidth={2} />
    </div>
  </div>
);
