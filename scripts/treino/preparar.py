#!/usr/bin/env python3
"""Prepara o vídeo "Treino de segunda" para o Remotion.

A partir do áudio original (48 kHz), este script:

1. define os cortes (trechos com fala, sem as pausas longas);
2. trata a fala (passa-alta, redução de ruído, compressão, volume) e monta a
   faixa já cortada e acelerada (mesma velocidade do vídeo, sem mudar o tom);
3. sintetiza a trilha (batida discreta, com a "virada" no "PEITO");
4. grava src/treino/edl.ts com os cortes, os momentos-chave e as legendas.

Uso (precisa de public/treino/video.mp4 e do WAV do áudio original):

    python3 scripts/treino/preparar.py <audio-original-48k.wav>

Saídas: src/treino/edl.ts, public/treino/voz.wav, public/treino/musica.wav
"""

import importlib.util
import json
import os
import subprocess
import sys
import wave

import numpy as np
from scipy import signal

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PUBLIC = os.path.join(ROOT, "public", "treino")
EDL_TS = os.path.join(ROOT, "src", "treino", "edl.ts")

FPS = 30
VELOCIDADE = 1.1  # fala e vídeo acelerados juntos
SR = 48000

# ---------------------------------------------------------------- cortes
# (nome, início, fim) em segundos no vídeo original. Os nomes são usados em
# src/treino/roteiro.ts para escolher o enquadramento de cada trecho.
SEGMENTOS = [
    ("hoje", 1.20, 2.02),  # "Hoje" (começa em 1,20 s: olhos abertos no frame 0, a capa)
    ("falar", 2.20, 3.12),  # "eu vou falar"
    ("academia", 3.49, 6.52),  # "do melhor treino pra você fazer na academia"
    ("nas", 6.87, 7.41),  # "nas"
    ("segunda", 7.75, 8.57),  # "segunda-feira"
    ("importante", 9.48, 14.40),  # "O importante é ... não desgaste o seu corpo"
    ("aquecer", 15.13, 17.54),  # "mas que vai conseguir aquecer bem"
    ("gosto", 18.25, 20.75),  # "Por exemplo, eu gosto de treinar na segunda"
    ("amanha", 21.18, 22.56),  # "que é o que eu vou treinar amanhã"
    ("faco", 23.45, 24.75),  # "Eu faço"
    ("peito", 27.82, 28.59),  # "peito"
    ("triceps", 30.61, 31.88),  # "e tríceps"
    ("crucifixo", 35.16, 39.14),  # "Por exemplo, pra aquecer o peito ... crucifixo"
    ("tres", 41.05, 44.34),  # "Depois eu continuo, faço mais três exercícios"
    ("supino", 45.41, 46.65),  # "sendo supino"
    ("deles", 48.20, 48.94),  # "um deles"
    ("completo", 50.02, 51.89),  # "E depois eu completo o tríceps"
]
# Final: o trecho sem fala depois do "tríceps", em câmera lenta e sem som.
FINAL = ("final", 51.89, 0.55, 90)  # (nome, início, velocidade, frames)

# Momentos-chave (segundos no original) -> viram frames do vídeo final.
MOMENTOS = {
    "segunda": 7.88,  # "segunda-feira"
    "importante": 9.59,
    "desgaste": 12.60,  # "não desgaste"
    "aquecer": 16.70,
    "peito": 27.94,
    "triceps": 30.66,
    "aquecerPeito": 36.10,  # "pra aquecer o peito"
    "crucifixo": 38.30,
    "tres": 43.28,  # "três exercícios"
    "supino": 45.85,
    "completoTriceps": 51.30,
}

# Legendas (só em alguns momentos): palavra e segundo em que é dita.
LEGENDAS = {
    "gosto": [
        ("EU", 18.88), ("GOSTO", 19.04), ("DE", 19.36), ("TREINAR", 19.48),
        ("NA", 19.96), ("[SEGUNDA]", 20.20),
    ],
    "amanha": [
        ("É", 21.30), ("O", 21.42), ("QUE", 21.46), ("EU", 21.52), ("VOU", 21.60),
        ("TREINAR", 21.76), ("[AMANHÃ]", 22.06),
    ],
    "faco": [("EU", 23.55), ("FAÇO...", 23.92)],
}


def carregar_helpers():
    """Reaproveita bumbo, palmas, chimbal e reverb de scripts/sintetizar-audio.py."""
    path = os.path.join(ROOT, "scripts", "sintetizar-audio.py")
    spec = importlib.util.spec_from_file_location("sintetizar_audio", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    mod.SR = SR  # os helpers leem SR do módulo
    return mod


# ---------------------------------------------------------------- utilidades


def ler_wav(path):
    with wave.open(path, "rb") as w:
        assert w.getframerate() == SR, "o áudio precisa estar em 48 kHz"
        ch = w.getnchannels()
        data = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").astype(np.float64) / 32768
    return data.reshape(-1, ch).mean(axis=1)


def gravar_wav(path, x):
    if x.ndim == 1:
        x = x[:, None]
    data = (np.clip(x, -1, 1) * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(data.shape[1])
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


def ffmpeg(*args):
    subprocess.run(["npx", "remotion", "ffmpeg", "-y", "-v", "error", *args], check=True, cwd=ROOT)


def db(x):
    return 20 * np.log10(np.maximum(x, 1e-12))


# ---------------------------------------------------------------- timeline


def montar_timeline():
    clipes = []
    frame = 0
    for nome, ini, fim in SEGMENTOS:
        trim = int(round(ini * FPS))
        frames = int(round((fim - ini) / VELOCIDADE * FPS))
        clipes.append({"nome": nome, "de": frame, "frames": frames, "trimBefore": trim, "rate": VELOCIDADE})
        frame += frames
    nome, ini, rate, frames = FINAL
    clipes.append({"nome": nome, "de": frame, "frames": frames, "trimBefore": int(round(ini * FPS)), "rate": rate})
    return clipes, frame


def para_frame(clipes, t):
    """Segundo no original -> frame no vídeo final (só trechos com fala)."""
    for c in clipes[:-1]:
        ini = c["trimBefore"] / FPS
        fim = ini + c["frames"] * c["rate"] / FPS
        if ini - 0.05 <= t < fim:
            return c["de"] + max(0, int(round((t - ini) / c["rate"] * FPS)))
    raise ValueError(f"{t:.2f}s caiu num trecho cortado")


# ---------------------------------------------------------------- fala


def reduzir_ruido(x):
    """Subtração espectral leve, com o perfil de ruído tirado de pausas sem fala."""
    nper, hop = 2048, 512
    f, t, X = signal.stft(x, SR, nperseg=nper, noverlap=nper - hop)
    mag = np.abs(X)
    pausas = [(25.6, 27.1), (28.7, 30.4), (32.0, 34.4)]
    sel = np.zeros(len(t), bool)
    for a, b in pausas:
        sel |= (t >= a) & (t < b)
    ruido = mag[:, sel].mean(axis=1, keepdims=True)
    ganho = np.clip(1 - 1.6 * ruido / np.maximum(mag, 1e-12), 0.18, 1)
    ganho = signal.convolve2d(ganho, np.ones((3, 5)) / 15, mode="same", boundary="symm")
    _, y = signal.istft(X * ganho, SR, nperseg=nper, noverlap=nper - hop)
    return y[: len(x)]


def comprimir(x, limiar_db=-22, razao=3.0):
    env = np.abs(x)
    ataque, soltura = np.exp(-1 / (0.005 * SR)), np.exp(-1 / (0.12 * SR))
    seg = np.zeros_like(env)
    nivel = 0.0
    for i, v in enumerate(env):
        coef = ataque if v > nivel else soltura
        nivel = coef * nivel + (1 - coef) * v
        seg[i] = nivel
    acima = np.maximum(db(seg) - limiar_db, 0)
    return x * 10 ** (-(acima * (1 - 1 / razao)) / 20)


def limitar(x, teto_db=-1.5):
    teto = 10 ** (teto_db / 20)
    # limitador suave: linear até 70% do teto, depois curva tanh
    joelho = 0.7 * teto
    y = x.copy()
    m = np.abs(x) > joelho
    y[m] = np.sign(x[m]) * (joelho + (teto - joelho) * np.tanh((np.abs(x[m]) - joelho) / (teto - joelho)))
    return y


def tratar_fala(x):
    x = signal.sosfilt(signal.butter(2, 80, "high", fs=SR, output="sos"), x)
    x = reduzir_ruido(x)
    # presença leve (voz de cama fica abafada)
    b, a = signal.iirpeak(3200, Q=0.9, fs=SR)
    x = x + 0.25 * signal.lfilter(b, a, x)
    x = x / np.max(np.abs(x)) * 0.5
    x = comprimir(x)
    # volume: RMS dos trechos com fala em -18 dBFS
    fala = np.concatenate([x[int(a * SR):int(b * SR)] for _, a, b in SEGMENTOS])
    rms = np.sqrt(np.mean(fala**2))
    x = x * 10 ** ((-18 - db(rms)) / 20)
    return limitar(x)


def montar_voz(x, clipes, total_frames):
    """Corta a fala tratada nos mesmos trechos do vídeo e acelera com atempo."""
    partes = []
    fade = int(0.006 * SR)
    for c in clipes[:-1]:
        ini = int(round(c["trimBefore"] / FPS * SR))
        n = int(round(c["frames"] * c["rate"] / FPS * SR))
        p = x[ini:ini + n].copy()
        p[:fade] *= np.linspace(0, 1, fade)
        p[-fade:] *= np.linspace(1, 0, fade)
        partes.append(p)
    cortado = os.path.join(PUBLIC, "_voz-cortada.wav")
    rapido = os.path.join(PUBLIC, "_voz-rapida.wav")
    gravar_wav(cortado, np.concatenate(partes))
    ffmpeg("-i", cortado, "-af", f"atempo={VELOCIDADE}", "-ar", str(SR), rapido)
    with wave.open(rapido, "rb") as w:
        y = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").astype(np.float64) / 32768
    os.remove(cortado)
    os.remove(rapido)
    n_total = int(round(total_frames / FPS * SR))
    out = np.zeros(n_total)
    out[: min(len(y), n_total)] = y[:n_total]
    return limitar(out)


# ---------------------------------------------------------------- trilha

BPM = 100
BEAT = 60 / BPM
BAR = 4 * BEAT
ACORDES = [  # Lá menor: Am F C G (MIDI; o primeiro é o baixo)
    [45, 57, 60, 64, 69],
    [41, 53, 57, 60, 65],
    [48, 55, 60, 64, 67],
    [43, 55, 59, 62, 67],
]


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def trilha(h, dur, t_drop, t_final):
    """Batida em 100 BPM alinhada para o tempo 1 cair no "PEITO" (t_drop).

    Antes do drop: bumbo abafado + chimbal + pad filtrado (intro).
    Do drop até o final: bateria cheia e baixo. No final (t_final): só o pad.
    """
    n = int(round(dur * SR))
    rng = np.random.default_rng(7)
    mix_pad = np.zeros((n, 2))
    drums = np.zeros(n)
    bass = np.zeros(n)
    duck = np.ones(n)

    primeiro = t_drop - np.ceil(t_drop / BAR) * BAR  # compasso que começa antes de 0
    inicio = primeiro
    i = 0
    while inicio < dur:
        notas = ACORDES[i % 4]
        # pad: dente-de-serra suave, estéreo, filtrado
        tam = BAR + 0.4
        tt = np.arange(int(tam * SR)) / SR
        pad = np.zeros((len(tt), 2))
        for nota in notas[1:]:
            for lado, det in ((0, -0.0015), (1, 0.0015)):
                fq = hz(nota) * (1 + det)
                pad[:, lado] += sum(np.sin(2 * np.pi * k * fq * tt) / k**1.7 for k in range(1, 7))
        env = np.minimum(1, tt / 0.3) * np.minimum(1, np.maximum(0, tam - tt) / 0.4)
        pad *= env[:, None] * 0.18
        s = int(round(inicio * SR))
        a, b = max(0, s), min(n, s + len(tt))
        if b > a:
            mix_pad[a:b] += pad[a - s:b - s]

        for beat in range(4):
            at = inicio + beat * BEAT
            if at < 0 or at >= dur:
                continue
            cheio = t_drop - 0.01 <= at < t_final
            if at >= t_final:
                continue
            if beat in (0, 2):
                h.add(drums, h.kick(1.0 if cheio else 0.45), at)
                if cheio:
                    k = int(at * SR)
                    td = np.arange(int(0.25 * SR)) / SR
                    duck[k:k + len(td)] = np.minimum(duck[k:k + len(td)], 1 - 0.5 * np.exp(-td / 0.09)[: len(duck[k:k + len(td)])])
            elif cheio:
                h.add(drums, h.clap() * 0.5, at)
            # chimbal em semicolcheias (mais leve na intro)
            for sub in range(4):
                v = (0.24 if sub % 2 == 0 else 0.13) * (1 if cheio else 0.6) * rng.uniform(0.8, 1.0)
                h.add(drums, h.hat(open_=cheio and beat == 3 and sub == 2) * v, at + sub * BEAT / 4)
            if cheio:
                # baixo: fundamental, notas de colcheia pontuada
                for off, dd in ((0, 0.34), (0.75 * BEAT, 0.2)):
                    tb = np.arange(int(dd * SR)) / SR
                    fq = hz(notas[0] - 12)
                    tom = np.sin(2 * np.pi * fq * tb) + 0.3 * np.sin(4 * np.pi * fq * tb)
                    tom *= np.minimum(1, tb / 0.01) * np.minimum(1, (dd - tb) / 0.04)
                    h.add(bass, np.tanh(1.5 * tom) * 0.7, at + off)
        inicio += BAR
        i += 1

    # subida de tensão no compasso antes do drop
    tr = np.arange(int(BAR * SR)) / SR
    riser = h.bandpass(rng.standard_normal(len(tr)), 900, 6000) * (tr / BAR) ** 3 * 0.25
    h.add(drums, riser, t_drop - BAR)

    t = np.arange(n) / SR
    # intro com o pad mais escuro: passa-baixa mais fechado antes do drop
    escuro = h.lowpass(mix_pad, 700)
    claro = h.lowpass(mix_pad, 2400)
    w = np.clip((t - (t_drop - 0.3)) / 0.3, 0, 1)[:, None]
    pad_final = escuro * (1 - w) + claro * w
    bass = h.lowpass(bass * duck, 380)
    mono = drums * 0.9 + bass * 0.6
    mix = h.reverb(pad_final, mix=0.3) + mono[:, None]
    fade_in = np.minimum(1, t / 0.4)
    fade_out = np.minimum(1, np.maximum(0, dur - t) / 1.2)
    mix *= (fade_in * fade_out)[:, None]
    mix = mix / np.max(np.abs(mix)) * 0.9
    return h.normalize(np.tanh(mix), -1)


# ---------------------------------------------------------------- saída


def gravar_edl(clipes, total, momentos, legendas):
    linhas = [
        "// GERADO por scripts/treino/preparar.py: não edite à mão.",
        "// Cortes do vídeo original (public/treino/video.mp4) e momentos-chave, em frames.",
        "",
        f"export const FPS = {FPS};",
        f"export const DURACAO = {total};",
        "",
        "export type Clipe = { nome: string; de: number; frames: number; trimBefore: number; rate: number };",
        "",
        "export const CLIPES: Clipe[] = [",
    ]
    for c in clipes:
        linhas.append(
            f'  {{ nome: "{c["nome"]}", de: {c["de"]}, frames: {c["frames"]}, trimBefore: {c["trimBefore"]}, rate: {c["rate"]} }},'
        )
    linhas += ["];", "", "// Frame em que cada clipe começa, pelo nome."]
    linhas.append("export const INICIO = {")
    for c in clipes:
        linhas.append(f'  {c["nome"]}: {c["de"]},')
    linhas += ["} as const;", "", "// Frame em que cada palavra-chave é dita."]
    linhas.append("export const MOMENTO = {")
    for k, v in momentos.items():
        linhas.append(f"  {k}: {v},")
    linhas += ["} as const;", "", "// Legendas: [palavra, frame]. [colchetes] = destaque."]
    linhas.append("export const LEGENDA = {")
    for k, palavras in legendas.items():
        itens = ", ".join(f'["{p}", {f}]' for p, f in palavras)
        linhas.append(f"  {k}: [{itens}] as [string, number][],")
    linhas += ["};", ""]
    with open(EDL_TS, "w") as fh:
        fh.write("\n".join(linhas))


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    os.makedirs(PUBLIC, exist_ok=True)
    h = carregar_helpers()

    clipes, fala_frames = montar_timeline()
    total = clipes[-1]["de"] + clipes[-1]["frames"]
    momentos = {k: para_frame(clipes, t) for k, t in MOMENTOS.items()}
    legendas = {k: [(p, para_frame(clipes, t)) for p, t in ws] for k, ws in LEGENDAS.items()}
    gravar_edl(clipes, total, momentos, legendas)
    print(f"edl: {len(clipes)} clipes, {total} frames ({total / FPS:.2f} s); fala termina em {fala_frames}")

    x = ler_wav(sys.argv[1])
    voz = montar_voz(tratar_fala(x), clipes, total)
    gravar_wav(os.path.join(PUBLIC, "voz.wav"), voz)
    print(f"voz.wav: pico {db(np.max(np.abs(voz))):.1f} dBFS")

    musica = trilha(h, total / FPS, momentos["peito"] / FPS, fala_frames / FPS)
    gravar_wav(os.path.join(PUBLIC, "musica.wav"), musica)
    print(f"musica.wav: {len(musica) / SR:.2f} s")
    print(json.dumps(momentos))


if __name__ == "__main__":
    main()
