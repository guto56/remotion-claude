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

## Vídeo "Treino de segunda" (`Treino-Segunda`)

Edição de um vídeo gravado no celular (fala sobre o treino de peito e tríceps da segunda-feira), com cortes das pausas, fala 1,1x mais rápida, câmera virtual, gráficos e legendas só nos momentos de ênfase. Dois formatos, com os mesmos cortes e o mesmo áudio:

| Composição | Formato | Câmera nos gráficos |
| --- | --- | --- |
| `Treino-Segunda` | 1080x1920 (Reels) | o vídeo encolhe e vira um card de lado, em 3D |
| `Treino-Segunda-16x9` | 1920x1080 (YouTube) | o vídeo fica em tela cheia; a câmera reenquadra o rosto num terço e o gráfico entra do outro lado |

```bash
npm run render:treino        # out/treino-segunda.mp4
npm run render:treino-16x9   # out/treino-segunda-16x9.mp4
```

A mídia não fica no Git. Para renderizar de novo:

1. Converta o vídeo original (HEVC HDR do iPhone) para `public/treino/video.mp4` (H.264 SDR, 4K) e extraia o áudio em WAV 48 kHz:
   ```bash
   npx remotion ffmpeg -i IMG_3038.mov -map 0:v:0 -map 0:a:0 -vf "zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=mobius:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p" -c:v libx264 -crf 17 -c:a aac public/treino/video.mp4
   npx remotion ffmpeg -i IMG_3038.mov -vn -ac 2 -ar 48000 scripts/treino/.fonte48k.wav
   ```
2. `python3 scripts/treino/preparar.py scripts/treino/.fonte48k.wav`: gera `src/treino/edl.ts` (cortes, momentos e legendas), `public/treino/voz.wav` (fala tratada, cortada e acelerada) e `public/treino/musica.wav`.

Onde editar, em `src/treino/`:

- **Cortes e tempos**: `SEGMENTOS`, `MOMENTOS` e `LEGENDAS` em `scripts/treino/preparar.py` (em segundos do vídeo original); rode o script de novo depois.
- **Textos e enquadramento de cada corte** (um por formato): `roteiro.ts`.
- **Cores e fontes**: `theme.ts`. **Posições** (por formato): `layout.ts`. **Volumes e efeitos**: `TreinoAudio.tsx`.

## Vídeo "Manual de Pintura para Iniciantes" (`ManualPintura`)

Divulgação do manual em PDF (5 folhas de treino de pintura em vidro), 1080x1920, 30 fps, 1200 frames (40 s). Sem narração: todo o conteúdo fica na tela.

```bash
npm run render:manual   # out/manual-pintura.mp4
npm run capa:manual     # out/capa.png (frame 1150)
```

- **Tudo que é editável** (durações, cores, textos, focos do zoom, volumes, flag `AUDIO_ENABLED`): `src/config.ts`.
- **Componentes**: `src/manual/components/` (`PaperBackground`, `PageSheet`, `BrushDrop`, `LabelChip`, `GlassPlate`, `CTA`, `Palavras`); cenas em `src/manual/cenas/`.
- **Páginas**: `public/pages/page-1.png` … `page-5.png`, geradas do PDF a 300 dpi (`pdftoppm -r 300 -png manual_pintura_folhas_flores.pdf public/pages/page` e renomear).
- **Áudio**: `public/audio/` com `musica.mp3`, `papel.mp3`, `pincel.mp3`, `pop.mp3`, `whoosh.mp3`, `sino.mp3`. Arquivo que faltar é pulado (o render não quebra) e aparece num aviso no console.

## Anúncio "Dono de negócio" (`Anuncio-Dono` e `Anuncio-Dono-Feed`)

Anúncio de 30 s para donos de negócio (clínicas, salões, prestadores e lojas), pensado para ser entendido no mudo. Mesmo roteiro e mesmos tempos nos dois formatos:

| Composição | Formato |
| --- | --- |
| `Anuncio-Dono` | 1080x1920 (Reels) |
| `Anuncio-Dono-Feed` | 1080x1350 (4:5), celular menor e títulos acima dele |

```bash
npm run render:dono        # out/anuncio-dono.mp4
npm run render:dono-feed   # out/anuncio-dono-feed.mp4
```

Em `src/dono/`: **textos** em `copy.ts` (títulos com `[destaque]`, mensagens com `*negrito*` e `\n`), **cores e fontes** em `theme.ts`, **tempos** em `timing.ts`, **posições por formato** em `layout.ts`, **áudio** em `DonoAudio.tsx`.

Props: `showSafeZone` (faixas vermelhas em y 0–250 e 1250–1920) e `withAudio`.

Áudio (opcional, o render não quebra sem eles): `public/music.mp3`, `ping.mp3`, `pop.mp3`, `swoosh.mp3`, `success.mp3` e a locução em `public/dono/voz/<id>.mp3`. A locução (voz Felipe, Cartesia) é gerada por:

```bash
export CARTESIA_API_KEY=sk_car_...   # nunca no repositório
python3 scripts/gerar-voz.py dono    # textos de `locucao` em copy.ts
```

Depois, ajuste os frames de início em `VOZ` (`timing.ts`) se alguma fala ficar longa demais.

## Anúncio "Barbearia" (`Barbearia` e `Barbearia-Feed`)

Anúncio de 22 s para donos de barbearia e salão de beleza, pensado para ser entendido no mudo. Mesmo roteiro e mesmos tempos nos dois formatos: `Barbearia` (1080x1920, Reels) e `Barbearia-Feed` (1080x1350, 4:5, celular menor e títulos acima dele).

```bash
npx remotion studio                                        # abrir o Studio
npx remotion render Barbearia out/barbearia.mp4            # Reels  (ou: npm run render:barbearia)
npx remotion render Barbearia-Feed out/barbearia-feed.mp4  # Feed   (ou: npm run render:barbearia-feed)
```

Tudo em `src/barbearia/`: **textos** em `copy.ts` (títulos com `[destaque]`, mensagens com `*negrito*` e `\n`), **cores e fontes** em `theme.ts`, **tempos** em `timing.ts`, **posições por formato** em `layout.ts`, um componente por arquivo em `components/` e uma cena por arquivo em `scenes/`.

Props: `showSafeZone` (faixas vermelhas em y 0–250 e 1250–1920) e `withAudio`.

Áudio (opcional, o render não quebra sem eles): `public/music.mp3`, `ping.mp3`, `pop.mp3`, `swoosh.mp3`, `success.mp3` e a locução em `public/barbearia/voz/<id>.mp3` (voz Felipe, Cartesia: `python3 scripts/gerar-voz.py barbearia`; depois confira `VOZ` em `timing.ts`).
