import { Lock, Moon, Sun } from "lucide-react";
import React from "react";
import { CELULAR } from "../layout";
import { cores, fontes } from "../theme";
import { StatusBar } from "./PhoneFrame";

// Tela de bloqueio escura com o relógio grande. `sol` (0..1) troca a lua pelo
// sol e clareia um pouco o fundo (a noite virando manhã).
export const LockScreen: React.FC<{
  relogio: string;
  data: string;
  sol: number;
  children?: React.ReactNode; // notificações
}> = ({ relogio, data, sol, children }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    {/* amanhecer: um degradê quente por cima do fundo noturno */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: sol * 0.55,
        background: "linear-gradient(180deg, #2B5A74 0%, #B8794A 100%)",
      }}
    />
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
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, fontWeight: 500, opacity: 0.85 }}>
        <span style={{ position: "relative", width: 26, height: 26 }}>
          <Moon
            size={26}
            strokeWidth={2.4}
            style={{ position: "absolute", opacity: 1 - sol, transform: `rotate(${sol * 90}deg) scale(${1 - 0.4 * sol})` }}
          />
          <Sun
            size={26}
            strokeWidth={2.4}
            color={cores.amarelo}
            style={{ position: "absolute", opacity: sol, transform: `rotate(${(sol - 1) * 90}deg) scale(${0.6 + 0.4 * sol})` }}
          />
        </span>
        {data}
      </div>
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
