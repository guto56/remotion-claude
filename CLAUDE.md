# remotion-claude

Projeto Remotion para criar animações. Use as skills em `.claude/skills/` (comece por `remotion-best-practices`).

## Comandos

- `npm run dev`: abre o Remotion Studio (preview em http://localhost:3000)
- `npx remotion render <CompId> out/<nome>.mp4`: renderiza um vídeo
- `npx remotion still <CompId> out/<nome>.png --frame=<n>`: renderiza um frame (checagem visual rápida)
- `npm run lint`: eslint + tsc

## Estrutura

- `src/Root.tsx`: registra as composições
- `src/Composition.tsx`: composição `MyComp` (exemplo)
- `public/`: assets, referenciados com `staticFile()`

## Sessões na nuvem (Claude Code on the web)

- O usuário acompanha pelo app e não acessa o `localhost` do container. Para mostrar resultado, renderize o MP4 (ou stills) e envie o arquivo.
- `remotion.media` está bloqueado pela rede, então o Chrome do Remotion não baixa. O hook `.claude/hooks/session-start.sh` roda `npm install` e exporta `REMOTION_BROWSER_EXECUTABLE` apontando para o Chromium pré-instalado; `remotion.config.ts` usa essa variável.
