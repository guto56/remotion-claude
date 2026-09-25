# remotion-claude

Projeto Remotion do anúncio da Corso Automação (veja README.md). Use as skills em `.claude/skills/` (comece por `remotion-best-practices`).

## Comandos

- `npm run dev`: Remotion Studio
- `npm run render:dor` / `render:pergunta` / `render:feed`: renderiza em `out/`
- `npx remotion still <CompId> out/x.png --frame=<n> --props='{"gancho":"dor","formato":"reels","showSafeZone":true,"withAudio":false}'`: checagem visual de um frame (com a área segura)
- `npm run lint`: eslint + tsc

## Estrutura

- `src/Root.tsx`: registra `Anuncio-Dor`, `Anuncio-Pergunta`, `Anuncio-Feed`
- `src/anuncio/copy.ts` (textos), `theme.ts` (cores/fontes), `timing.ts` (frames), `layout.ts` (posições por formato)
- `src/anuncio/scenes/`: `NightScene` (cenas 1-2), `StatScene` (3), `LightScene` (4-6), `CtaScene` (7)
- `src/anuncio/components/`: componentes visuais reutilizáveis

## Áudio

- Música e efeitos em `public/*.mp3`, sintetizados por `scripts/sintetizar-audio.py` (numpy + scipy).
- Locução em `public/voz/<id>.mp3`, gerada no Higgsfield com `text2speech_v2` variante `elevenlabs`, voz "Andre" (preset `f1e8226e-2248-4d5f-b43c-0a79e9949dbf`). Não use `seed_audio` para português: as vozes preset têm base em inglês e saem com sotaque americano. Os arquivos gerados ficam em `d8j0ntlcm91z4.cloudfront.net` (precisa estar liberado na rede do ambiente). Processar com `scripts/preparar-voz.py <pasta>` e atualizar `VOZ` em `timing.ts` com as durações.
- Evite reticências no começo do texto de uma fala: o modelo solta um "e" isolado e acelera o resto.
- Mixagem em `src/anuncio/AdAudio.tsx`. Pico da mixagem final deve ficar abaixo de -1 dBFS.

## Regras do anúncio

- No Reels, todo conteúdo importante fica entre y=260 e y=1240 e a 64 px das laterais. Confira com `showSafeZone`.
- Textos só em `copy.ts`, cores só em `theme.ts`, tempos só em `timing.ts`.
- O último frame precisa estar completo (vira capa).

## Sessões na nuvem (Claude Code on the web)

- O usuário acompanha pelo app e não acessa o `localhost` do container: renderize MP4/PNG e envie o arquivo.
- O hook `.claude/hooks/session-start.sh` roda `npm install`, aponta o Remotion para o Chromium pré-instalado (`REMOTION_BROWSER_EXECUTABLE`, porque `remotion.media` é bloqueado) e importa as CAs do ambiente no NSS do Chrome (senão as Google Fonts falham com `ERR_CERT_AUTHORITY_INVALID`).
