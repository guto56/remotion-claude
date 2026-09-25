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
- Música e efeitos: `music.mp3` (volume 0.15, com fade, abaixa durante a locução), `ping.mp3`, `pop.mp3`, `swoosh.mp3`, `relogio.mp3`, `impacto.mp3`, `sucesso.mp3`. Foram sintetizados por `scripts/sintetizar-audio.py` (sem direitos autorais). Para trocar um som, substitua o arquivo mantendo o nome.
- Locução: `voz/<id>.mp3`, gerada no Higgsfield (motor ElevenLabs, voz "Andre", português do Brasil). Textos em `copy.ts` (`locucao`), momentos e durações em `timing.ts` (`VOZ`). Para trocar uma fala: gere de novo no Higgsfield, salve os MP3 baixados numa pasta com o nome da fala (ex.: `cta.mp3`) e rode `python3 scripts/preparar-voz.py <pasta>` (corta o silêncio, iguala o volume e mostra a duração para atualizar `VOZ`).

## Só o áudio (30 s, já mixado)

```bash
npm run render:audio-dor        # out/anuncio-dor-audio.mp3 (serve também para o Feed)
npm run render:audio-pergunta   # out/anuncio-pergunta-audio.mp3
```

## Props (painel da direita no Studio)

- `showSafeZone`: desenha em vermelho as faixas cobertas pela interface do Instagram (250 px no topo, 670 px embaixo) e as margens laterais de 64 px. Use só para conferir; deixe `false` para renderizar.
- `withAudio`: liga/desliga todo o áudio.
- `gancho` e `formato`: já vêm certos em cada composição.
