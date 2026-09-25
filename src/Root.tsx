import "./index.css";
import { Composition } from "remotion";
import {
  Anuncio,
  anuncioSchema,
  calculateAnuncioMetadata,
} from "./anuncio/Anuncio";
import { FPS, SCENES } from "./anuncio/timing";

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
      {/* Feed 4:5 */}
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
          gancho: "dor",
          formato: "feed",
          showSafeZone: false,
          withAudio: true,
        }}
      />
    </>
  );
};
