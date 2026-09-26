# Anúncio Corso Automação (Remotion)

Anúncio da assistente de IA para WhatsApp de negócios (clínicas, studios, salões, lojas, prestadores de serviço). 3 composições:

| Composição | Formato | O que muda |
| --- | --- | --- |
| `Anuncio-Dor` | 1080x1920, 30 s | gancho "Seu cliente chamou às 23h." |
| `Anuncio-Pergunta` | 1080x1920, 30 s | gancho "Quanto tempo seu negócio demora pra responder?" |
| `Anuncio-Feed` | 1080x1350 (4:5), 30 s | gancho em pergunta, celular menor e textos acima |

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
- **Agenda 3D** (Cena 5): dias, horários livres, blocos ocupados e o evento em `copy.ts` (`chat.agenda`); tempos em `timing.ts` (`AGENDA`); tamanho e posição por formato em `layout.ts` (`demo.calendarScale`, `demo.calendarCenterY`).

## Arquivos em `public/`

Todos são opcionais: se faltarem, o vídeo renderiza mesmo assim.

- `logo.png`: logo da Corso, usada só na chamada final (cena 7). Sem ela aparecem as iniciais "CA". O avatar do chat usa sempre as iniciais.
- Música e efeitos: `music.mp3` (volume 0.15, com fade, abaixa durante a locução), `ping.mp3`, `pop.mp3`, `swoosh.mp3`, `relogio.mp3`, `impacto.mp3`, `sucesso.mp3`. Foram sintetizados por `scripts/sintetizar-audio.py` (sem direitos autorais). Para trocar um som, substitua o arquivo mantendo o nome.
- Locução: `voz/<id>.mp3`, gerada no Cartesia (português do Brasil). Textos em `copy.ts` (`locucao`), momentos e durações em `timing.ts` (`VOZ`). Para trocar falas: salve os áudios numa pasta com o nome de cada fala (ex.: `cta.mp3` ou `.wav`) e rode `python3 scripts/preparar-voz.py <pasta>` (corta o silêncio, iguala o volume e mostra a duração para atualizar `VOZ`).

## Só o áudio (30 s, já mixado)

```bash
npm run render:audio-dor        # out/anuncio-dor-audio.mp3
npm run render:audio-pergunta   # out/anuncio-pergunta-audio.mp3 (serve também para o Feed)
```

## Props (painel da direita no Studio)

- `showSafeZone`: desenha em vermelho as faixas cobertas pela interface do Instagram (250 px no topo, 670 px embaixo) e as margens laterais de 64 px. Use só para conferir; deixe `false` para renderizar.
- `withAudio`: liga/desliga todo o áudio.
- `gancho` e `formato`: já vêm certos em cada composição.
