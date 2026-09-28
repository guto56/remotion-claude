import { evolvePath } from "@remotion/paths";
import React, { useId } from "react";
import { idSvg } from "../base";

// Formas desenhadas numa caixa de 100 x 240, com a "cabeça" em cima.
// Gota: cabeça redonda afinando até a ponta (como uma pincelada).
// Folha: duas curvas pontudas e a nervura central.
const FORMAS = {
  gota: "M 50 8 C 80 8 95 32 92 58 C 89 92 70 150 57 232 C 50 150 14 98 9 62 C 5 32 22 8 50 8 Z",
  folha: "M 50 6 C 92 52 94 168 50 234 C 6 168 8 52 50 6 Z",
};
const NERVURA = "M 50 20 C 52 90 52 160 50 222";

type Props = {
  forma?: keyof typeof FORMAS;
  cor: string;
  altura: number; // px
  rotacao?: number; // graus
  // 0..1: contorno se desenhando (evolvePath). Sem valor = sem contorno.
  contorno?: number;
  corContorno?: string;
  // 0..1: preenchimento entrando da cabeça para a ponta. Sem valor = cheio.
  preenchimento?: number;
  style?: React.CSSProperties;
};

export const BrushDrop: React.FC<Props> = ({
  forma = "gota",
  cor,
  altura,
  rotacao = 0,
  contorno,
  corContorno,
  preenchimento = 1,
  style,
}) => {
  const id = idSvg(useId());
  const d = FORMAS[forma];
  const traco = contorno === undefined ? null : evolvePath(contorno, d);
  // Máscara: um retângulo que cresce de cima (cabeça) para baixo (ponta),
  // com a borda suave para parecer tinta escorrendo
  const alturaMascara = 240 * preenchimento;

  return (
    <svg
      viewBox="-6 -6 112 252"
      width={(altura * 112) / 252}
      height={altura}
      style={{ transform: `rotate(${rotacao}deg)`, overflow: "visible", ...style }}
    >
      <defs>
        <linearGradient id={`${id}-borda`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}-mascara`}>
          <rect x="-10" y="-10" width="120" height={Math.max(0, alturaMascara + 10)} fill="white" />
          <rect x="-10" y={alturaMascara} width="120" height="18" fill={`url(#${id}-borda)`} />
        </mask>
      </defs>
      <path d={d} fill={cor} mask={preenchimento < 1 ? `url(#${id}-mascara)` : undefined} />
      {forma === "folha" && preenchimento >= 1 ? (
        <path d={NERVURA} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={3} strokeLinecap="round" />
      ) : null}
      {traco ? (
        <path
          d={d}
          fill="none"
          stroke={corContorno ?? cor}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={traco.strokeDasharray}
          strokeDashoffset={traco.strokeDashoffset}
        />
      ) : null}
    </svg>
  );
};
