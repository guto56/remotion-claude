import { Lock } from "lucide-react";
import React from "react";
import { CELULAR } from "../layout";
import { cores, fontes } from "../theme";
import { StatusBar } from "./PhoneFrame";

// Tela de bloqueio escura: cadeado, data e o relógio grande.
export const LockScreen: React.FC<{
  relogio: string;
  data: string;
  children?: React.ReactNode; // notificações
}> = ({ relogio, data, children }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <StatusBar hora={relogio} cor={cores.branco} />
    <div
      style={{
        position: "absolute",
        top: CELULAR.cadeado,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        color: "rgba(255,255,255,0.85)",
      }}
    >
      <Lock size={26} strokeWidth={2.5} />
    </div>
    <div
      style={{
        position: "absolute",
        top: CELULAR.relogio,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: cores.branco,
        fontFamily: fontes.ui,
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 500, opacity: 0.85 }}>{data}</div>
      <div
        style={{
          fontSize: 110,
          fontWeight: 600,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {relogio}
      </div>
    </div>
    {children}
  </div>
);
