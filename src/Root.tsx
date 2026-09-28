import "./index.css";
import { Composition } from "remotion";
import {
  Anuncio,
  anuncioSchema,
  calculateAnuncioMetadata,
} from "./anuncio/Anuncio";
import { FPS, SCENES } from "./anuncio/timing";
import { DURACAO, FPS as TREINO_FPS } from "./treino/edl";
import { Treino, treinoSchema } from "./treino/Treino";
import { VIDEO } from "./config";
import { ManualPintura } from "./manual/ManualPintura";
import { Dono, donoSchema } from "./dono/Dono";
import { DURACAO as DONO_DURACAO, FPS as DONO_FPS } from "./dono/timing";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Reels/Stories 9:16, gancho de dor */}
      <Composition
        id="Anuncio-Dor"
        component={Anuncio}
        schema={anuncioSchema}
        calculateMetadata={calculateAnuncioMetadata}
        durationInFrames={SCENES.fim}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          gancho: "dor",
          formato: "reels",
          showSafeZone: false,
          withAudio: true,
        }}
      />
      {/* Mesmo vídeo, gancho em forma de pergunta */}
      <Composition
        id="Anuncio-Pergunta"
        component={Anuncio}
        schema={anuncioSchema}
        calculateMetadata={calculateAnuncioMetadata}
        durationInFrames={SCENES.fim}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          gancho: "pergunta",
          formato: "reels",
          showSafeZone: false,
          withAudio: true,
        }}
      />
      {/* Feed 4:5, com o gancho em pergunta */}
      <Composition
        id="Anuncio-Feed"
        component={Anuncio}
        schema={anuncioSchema}
        calculateMetadata={calculateAnuncioMetadata}
        durationInFrames={SCENES.fim}
        fps={FPS}
        width={1080}
        height={1350}
        defaultProps={{
          gancho: "pergunta",
          formato: "feed",
          showSafeZone: false,
          withAudio: true,
        }}
      />
      {/* Vídeo editado "Treino de segunda" (Reels 9:16) */}
      <Composition
        id="Treino-Segunda"
        component={Treino}
        schema={treinoSchema}
        durationInFrames={DURACAO}
        fps={TREINO_FPS}
        width={1080}
        height={1920}
        defaultProps={{ formato: "reels", showSafeZone: false, withAudio: true }}
      />
      {/* Mesmo vídeo em 16:9 (YouTube) */}
      <Composition
        id="Treino-Segunda-16x9"
        component={Treino}
        schema={treinoSchema}
        durationInFrames={DURACAO}
        fps={TREINO_FPS}
        width={1920}
        height={1080}
        defaultProps={{ formato: "youtube", showSafeZone: false, withAudio: true }}
      />
      {/* Anúncio "Dono de negócio" (Reels 9:16 e Feed 4:5, mesmo roteiro) */}
      <Composition
        id="Anuncio-Dono"
        component={Dono}
        schema={donoSchema}
        durationInFrames={DONO_DURACAO}
        fps={DONO_FPS}
        width={1080}
        height={1920}
        defaultProps={{ formato: "reels", showSafeZone: false, withAudio: true }}
      />
      <Composition
        id="Anuncio-Dono-Feed"
        component={Dono}
        schema={donoSchema}
        durationInFrames={DONO_DURACAO}
        fps={DONO_FPS}
        width={1080}
        height={1350}
        defaultProps={{ formato: "feed", showSafeZone: false, withAudio: true }}
      />
      {/* Divulgação do Manual de Pintura (Reels/TikTok) */}
      <Composition
        id="ManualPintura"
        component={ManualPintura}
        durationInFrames={VIDEO.duracao}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
    </>
  );
};
