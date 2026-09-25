import { getStaticFiles, staticFile } from "remotion";

// Retorna a URL de um arquivo de public/ se ele existir; senão, null.
// Assim o vídeo renderiza mesmo sem logo.png ou sem os áudios.
export const optionalStaticFile = (name: string): string | null => {
  try {
    const exists = getStaticFiles().some((file) => file.name === name);
    return exists ? staticFile(name) : null;
  } catch {
    return null;
  }
};
