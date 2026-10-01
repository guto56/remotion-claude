import React from "react";
import { useCurrentFrame } from "remotion";
import { copy } from "../copy";
import type { Layout } from "../layout";
import { cores } from "../theme";
import { DOR, MOVIMENTO } from "../timing";
import { KineticHeadline } from "../components/KineticHeadline";

// Cena 2 (60–150): o título em duas etapas, no lugar do título do gancho. As
// notificações ficando cinza e o celular encolhendo estão em CelularBloqueio.
export const Dor: React.FC<{ layout: Layout }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const [entra1, sai1] = DOR.titulo1;

  return (
    <div style={{ position: "absolute", top: layout.tituloNoiteTop, left: layout.lado, right: layout.lado }}>
      {frame >= entra1 && frame < sai1 + MOVIMENTO.saida ? (
        <KineticHeadline texto={copy.dor1} inicio={entra1} saiEm={sai1} tom="escuro" tamanho={layout.tituloNoiteTamanho} />
      ) : null}
      {frame >= DOR.titulo2 ? (
        <KineticHeadline
          texto={copy.dor2}
          inicio={DOR.titulo2}
          tom="escuro"
          tamanho={layout.tituloNoiteTamanho}
          corDestaque={cores.vermelho}
          tremer
        />
      ) : null}
    </div>
  );
};
