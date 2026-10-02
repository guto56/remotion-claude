import { Mic, Paperclip, Smile } from "lucide-react";
import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { copy } from "../copy";
import { CELULAR } from "../layout";
import { clamp, entra, op } from "../lib";
import { cores, fontes } from "../theme";
import { DEMO, MOVIMENTO } from "../timing";
import { ChatBubble } from "./ChatBubble";
import { ChatHeader } from "./ChatHeader";
import { OwnerToast } from "./OwnerToast";
import { StatusBar } from "./PhoneFrame";
import { TypingIndicator } from "./TypingIndicator";

const ALTURA_TELA = CELULAR.altura - CELULAR.borda * 2;
const TOPO_MENSAGENS = CELULAR.barraStatus + CELULAR.cabecalho;
const BASE_MENSAGENS = ALTURA_TELA - CELULAR.entrada - CELULAR.indicador;

// Linha que "cresce" de altura 0 até a altura real e empurra as mensagens de
// cima (rolagem suave, sem medir nada).
const Linha: React.FC<{ cresce: number; children: React.ReactNode }> = ({ cresce, children }) => (
  <div style={{ display: "grid", gridTemplateRows: `${cresce}fr` }}>
    <div
      style={{
        minHeight: 0,
        overflow: cresce < 1 ? "hidden" : "visible",
        display: "flex",
        flexDirection: "column",
        paddingTop: 14,
      }}
    >
      {children}
    </div>
  </div>
);

// Tela da conversa da cena 4. `inicio` = frame absoluto em que este componente
// começa (os tempos de DEMO são absolutos).
export const Conversation: React.FC<{ inicio: number }> = ({ inicio }) => {
  const frame = useCurrentFrame() + inicio;
  const { fps } = useVideoConfig();
  const chegadas = DEMO.mensagens;

  const itens: React.ReactNode[] = [];
  copy.mensagens.forEach((m, i) => {
    const a = chegadas[i];
    // "Digitando..." antes de cada balão da assistente (12 frames)
    if (m.de === "assistente") {
      const d = a - MOVIMENTO.digitando;
      if (frame >= d && frame < a + 6) {
        const g =
          interpolate(frame, [d, d + 5], [0, 1], clamp) * interpolate(frame, [a, a + 6], [1, 0], clamp);
        itens.push(
          <Linha key={`dig-${i}`} cresce={g}>
            <div style={{ display: "flex", flexDirection: "column", opacity: g }}>
              <TypingIndicator />
            </div>
          </Linha>,
        );
      }
    }
    if (frame < a) return;
    // Balão entra de baixo: scale 0.9 -> 1 + opacidade
    const cresce = interpolate(frame, [a, a + 9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
    const p = entra(frame, fps, a);
    const cliente = m.de === "cliente";
    const brilho = m.confirma ? interpolate(frame, [a + 4, a + 12, a + 26], [0, 1, 0], clamp) : 0;
    itens.push(
      <Linha key={`msg-${i}`} cresce={cresce}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            opacity: op(p),
            transform: `translateY(${(1 - p) * 40}px) scale(${0.9 + 0.1 * p})`,
            transformOrigin: cliente ? "bottom right" : "bottom left",
          }}
        >
          <ChatBubble
            de={m.de}
            texto={m.texto}
            hora={m.hora}
            lido={frame >= a + 10}
            confirma={m.confirma}
            brilho={brilho}
          />
        </div>
      </Linha>,
    );
  });

  // Aviso ao dono: desce do topo do celular e fica até o fim da cena
  const pAviso = entra(frame, fps, DEMO.aviso);
  const horaAtual = copy.mensagens[Math.max(0, chegadas.filter((a) => frame >= a).length - 1)].hora;

  return (
    <div style={{ position: "absolute", inset: 0, background: cores.telaConversa }}>
      <StatusBar hora={horaAtual} cor={cores.texto} />
      <ChatHeader nome={copy.negocio} status={copy.status} />
      {/* Mensagens: ancoradas embaixo, as antigas sobem */}
      <div
        style={{
          position: "absolute",
          top: TOPO_MENSAGENS,
          height: BASE_MENSAGENS - TOPO_MENSAGENS,
          left: 0,
          right: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 16px 14px",
        }}
      >
        {itens}
      </div>
      {/* Campo de digitar (decoração; fica na faixa coberta no Reels) */}
      <div
        style={{
          position: "absolute",
          top: BASE_MENSAGENS,
          left: 0,
          right: 0,
          height: CELULAR.entrada,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 14px",
          fontFamily: fontes.ui,
        }}
      >
        <div
          style={{
            flex: 1,
            height: 60,
            borderRadius: 30,
            background: cores.branco,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 18px",
            color: cores.cinza,
            fontSize: 24,
          }}
        >
          <Smile size={26} />
          <span style={{ flex: 1 }}>{copy.placeholder}</span>
          <Paperclip size={24} />
        </div>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            background: cores.marca,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Mic size={28} color={cores.branco} />
        </div>
      </div>
      {frame >= DEMO.aviso ? (
        <OwnerToast
          titulo={copy.aviso.titulo}
          detalhe={copy.aviso.detalhe}
          style={{
            position: "absolute",
            top: CELULAR.barraStatus + 6,
            left: 12,
            right: 12,
            zIndex: 5,
            opacity: op(pAviso),
            transform: `translateY(${(1 - pAviso) * -160}px)`,
          }}
        />
      ) : null}
    </div>
  );
};
