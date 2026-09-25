# Anúncio Corso Automação (Remotion)

Vídeo de anúncio para Reels/Feed com 3 composições:

| Composição | Formato | O que muda |
| --- | --- | --- |
| `Anuncio-Dor` | 1080x1920, 30 s | gancho "Seu paciente chamou às 23h." |
| `Anuncio-Pergunta` | 1080x1920, 30 s | gancho "Quanto tempo sua clínica demora pra responder?" |
| `Anuncio-Feed` | 1080x1350 (4:5), 30 s | mesmo roteiro, celular menor e textos acima |

## Rodar

```bash
npm install
npx remotion studio      # ou: npm run dev
```

## Renderizar

```bash
npm run render:dor        # out/anuncio-dor.mp4
npm run render:pergunta   # out/anuncio-pergunta.mp4
npm run render:feed       # out/anuncio-feed.mp4
```

## Onde editar

Tudo em `src/anuncio/`:

- **Textos**: `copy.ts`. Nos títulos, `[colchetes]` marcam a palavra destacada. Nas mensagens do chat, `*asteriscos*` viram negrito e `\n` quebra a linha.
- **Cores, fontes e tamanhos**: `theme.ts`.
- **Tempos**: `timing.ts`. `SCENES` tem o frame em que cada cena começa (30 frames = 1 s); os outros blocos têm os tempos de dentro de cada cena, contados a partir do início dela. É ali que ficam os momentos de cada mensagem do chat (`DEMO.mensagens`).
- **Posições** (Reels x Feed): `layout.ts`.
- **Ícones das pílulas** (Zap, CalendarDays, CheckCircle2): `scenes/LightScene.tsx`.

## Arquivos em `public/`

Todos são opcionais: se faltarem, o vídeo renderiza mesmo assim.

- `logo.png`: logo da Corso (no avatar do chat e na chamada final). Sem ela aparecem as iniciais "CA".
- `music.mp3` (volume 0.15, com fade), `ping.mp3`, `pop.mp3`, `swoosh.mp3` (volume 0.6).

## Props (painel da direita no Studio)

- `showSafeZone`: desenha em vermelho as faixas cobertas pela interface do Instagram (250 px no topo, 670 px embaixo) e as margens laterais de 64 px. Use só para conferir; deixe `false` para renderizar.
- `withAudio`: liga/desliga todo o áudio.
- `gancho` e `formato`: já vêm certos em cada composição.
