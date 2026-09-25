#!/usr/bin/env python3
"""Sintetiza os efeitos sonoros e a música de fundo do anúncio.

Tudo é gerado por código (sem samples de terceiros), então não há direitos
autorais envolvidos. Para refazer:

    pip install numpy scipy
    python3 scripts/sintetizar-audio.py

Grava em public/: ping, pop, swoosh, relogio, impacto, sucesso e music (.mp3).
Os momentos em que cada um toca ficam em src/anuncio/AdAudio.tsx.
"""

import os
import subprocess
import wave

import numpy as np
from scipy import signal

SR = 44100
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PUBLIC = os.path.join(ROOT, "public")
rng = np.random.default_rng(42)


# ---------------------------------------------------------------- utilidades


def t_axis(dur):
    return np.arange(int(round(dur * SR))) / SR


def normalize(x, peak_db):
    peak = np.max(np.abs(x))
    return x * (10 ** (peak_db / 20) / peak) if peak > 0 else x


def lowpass(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, "low", fs=SR, output="sos"), x, axis=0)


def highpass(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, "high", fs=SR, output="sos"), x, axis=0)


def bandpass(x, lo, hi, order=2):
    return signal.sosfilt(signal.butter(order, [lo, hi], "band", fs=SR, output="sos"), x, axis=0)


def add(buf, sound, at):
    """Soma `sound` em `buf` a partir de `at` segundos (corta o que passar do fim)."""
    start = int(round(at * SR))
    if start >= len(buf):
        return
    end = min(len(buf), start + len(sound))
    buf[start:end] += sound[: end - start]


def save(name, x):
    """Salva WAV 16-bit e converte para MP3 192 kbps com o ffmpeg do Remotion."""
    if x.ndim == 1:
        x = x[:, None]
    data = (np.clip(x, -1, 1) * 32767).astype("<i2")
    wav_path = os.path.join(PUBLIC, f"{name}.wav")
    with wave.open(wav_path, "wb") as w:
        w.setnchannels(data.shape[1])
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    subprocess.run(
        ["npx", "remotion", "ffmpeg", "-y", "-v", "error", "-i", wav_path,
         "-codec:a", "libmp3lame", "-b:a", "192k", os.path.join(PUBLIC, f"{name}.mp3")],
        check=True,
        cwd=ROOT,
    )
    os.remove(wav_path)
    print(f"public/{name}.mp3  {len(x) / SR:.2f} s")


# ------------------------------------------------------------------- efeitos


def ping():
    """Notificação: sino curto e brilhante (as notificações vêm a cada 0,27 s)."""
    t = t_axis(0.4)
    f = 1318.5  # Mi6
    x = (
        np.sin(2 * np.pi * f * t) * np.exp(-t / 0.10)
        + 0.45 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / 0.05)
        + 0.2 * np.sin(2 * np.pi * 2.76 * f * t) * np.exp(-t / 0.03)
    )
    return normalize(x * np.minimum(1, t / 0.002), -3)


def pop():
    """Mensagem chegando: 'bloop' curto com o tom subindo."""
    t = t_axis(0.14)
    f = 380 + 440 * (1 - np.exp(-t / 0.018))
    phase = 2 * np.pi * np.cumsum(f) / SR
    tone = (np.sin(phase) + 0.25 * np.sin(2 * phase)) * np.exp(-t / 0.035)
    click = highpass(rng.standard_normal(len(t)), 3000) * np.exp(-t / 0.002) * 0.25
    return normalize((tone + click) * np.minimum(1, t / 0.001), -4)


def swoosh(dur=0.75, peak_at=0.45):
    """Ruído com um filtro passa-faixa que sobe de 300 Hz a 4,5 kHz."""
    t = t_axis(dur)
    noise = rng.standard_normal(len(t))
    out = np.zeros(len(t))
    block = 256
    zi = None
    for start in range(0, len(t), block):
        end = min(len(t), start + block)
        center = 300 * (4500 / 300) ** (start / len(t))
        sos = signal.butter(2, [center * 0.6, min(center * 1.6, SR / 2 - 100)], "band", fs=SR, output="sos")
        if zi is None:
            zi = signal.sosfilt_zi(sos) * 0
        out[start:end], zi = signal.sosfilt(sos, noise[start:end], zi=zi)
    env = np.where(t < peak_at, (t / peak_at) ** 2, np.exp(-(t - peak_at) / 0.09))
    return normalize(out * env, -5)


def click(freq):
    t = t_axis(0.03)
    body = np.sin(2 * np.pi * freq * t) * np.exp(-t / 0.004)
    noise = highpass(rng.standard_normal(len(t)), 2000) * np.exp(-t / 0.0015) * 0.5
    return body + noise


def relogio(dur=44 / 30, ticks=34):
    """Relógio acelerando (cena 2): tique-taque rápido no meio, lento nas pontas,
    acompanhando o easing do relógio na tela."""
    grid = np.linspace(0, 1, 4000)
    progress = np.where(grid < 0.5, 4 * grid**3, 1 - (-2 * grid + 2) ** 3 / 2)
    times = np.interp(np.arange(1, ticks) / ticks, progress, grid) * dur
    out = np.zeros(int(round((dur + 0.1) * SR)))
    for i, at in enumerate(times):
        add(out, click(3200 if i % 2 == 0 else 2500), at)
    return normalize(out, -6)


def impacto():
    """Batida grave para o pulso do "21x"."""
    t = t_axis(0.9)
    f = 40 + 70 * np.exp(-t / 0.07)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.3)
    hit = lowpass(rng.standard_normal(len(t)), 2500) * np.exp(-t / 0.012) * 0.6
    return normalize(np.tanh(2.2 * (body + hit)), -3)


def sucesso():
    """Arpejo de sino (Dó-Mi-Sol-Dó) para a consulta confirmada."""
    notes = [(0.0, 1046.5), (0.075, 1318.5), (0.15, 1568.0), (0.225, 2093.0)]
    out = np.zeros(int(SR * 1.0))
    for at, f in notes:
        t = t_axis(1.0 - at)
        tone = (
            np.sin(2 * np.pi * f * t)
            + 0.35 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / 0.12)
            + 0.12 * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t / 0.06)
        ) * np.exp(-t / 0.28) * np.minimum(1, t / 0.003)
        add(out, tone * (0.8 if f < 2000 else 0.6), at)
    return normalize(out, -5)


# -------------------------------------------------------------------- música
#
# 30 s em 106,67 BPM: 4 compassos = 9,0 s, então a virada da cena 4 cai no
# tempo 1. Parte A (0-9 s, noite): Lá menor, pad escuro e "batimento".
# Parte B (9-30 s, dia): Dó maior (C G Am F), pad, arpejo, bateria leve.

BPM = 320 / 3
BEAT = 60 / BPM
BAR = 4 * BEAT
DUR = 30.0

CHORDS = {  # notas MIDI; a primeira é o baixo
    "C": [48, 55, 60, 64, 67],
    "G": [43, 55, 59, 62, 67],
    "Am": [45, 57, 60, 64, 69],
    "F": [41, 53, 57, 60, 65],
    "E": [40, 52, 56, 59, 64],
}
PART_A = ["Am", "Am", "F", "E"]
PART_B = ["C", "G", "Am", "F", "C", "G", "Am", "F", "C"]
B_START = len(PART_A) * BAR  # 9,0 s


def hz(midi):
    return 440 * 2 ** ((midi - 69) / 12)


def pad_chord(notes, dur, bright):
    """Acorde de 'pad': ondas dente-de-serra suaves, levemente desafinadas (estéreo)."""
    t = t_axis(dur)
    out = np.zeros((len(t), 2))
    for note in notes[1:]:
        for side, detune in ((0, -0.0012), (1, 0.0012)):
            f = hz(note) * (1 + detune)
            wave_ = sum(np.sin(2 * np.pi * k * f * t) / k**1.6 for k in range(1, 8))
            out[:, side] += wave_
    env = np.minimum(1, t / 0.35) * np.minimum(1, (dur - t) / 0.45)
    out *= env[:, None]
    return lowpass(out, bright)


def pluck(f, dur=0.5):
    t = t_axis(dur)
    tone = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t) + 0.1 * np.sin(6 * np.pi * f * t)
    return tone * np.exp(-t / 0.16) * np.minimum(1, t / 0.002)


def kick(strength=1.0):
    t = t_axis(0.35)
    f = 48 + 100 * np.exp(-t / 0.03)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.12)
    return strength * np.tanh(1.8 * body)


def clap():
    t = t_axis(0.25)
    noise = bandpass(rng.standard_normal(len(t)), 900, 3500)
    env = sum(np.exp(-np.maximum(0, t - d) / 0.012) * (t >= d) for d in (0, 0.011, 0.022))
    return noise * (env * 0.5 + np.exp(-t / 0.08) * (t >= 0.022))


def hat(open_=False):
    t = t_axis(0.2 if open_ else 0.06)
    return highpass(rng.standard_normal(len(t)), 7000) * np.exp(-t / (0.06 if open_ else 0.018))


def reverb(x, mix=0.25):
    """Reverb simples (Schroeder): 4 filtros pente + 2 passa-tudo."""
    wet = np.zeros_like(x)
    for delay_ms, g in ((29.7, 0.82), (37.1, 0.80), (41.1, 0.78), (43.7, 0.76)):
        d = int(SR * delay_ms / 1000)
        a = np.zeros(d + 1)
        a[0], a[d] = 1, -g
        wet += signal.lfilter([1], a, x, axis=0)
    for delay_ms, g in ((5.0, 0.7), (1.7, 0.7)):
        d = int(SR * delay_ms / 1000)
        b = np.zeros(d + 1)
        b[0], b[d] = -g, 1
        a = np.zeros(d + 1)
        a[0], a[d] = 1, -g
        wet = signal.lfilter(b, a, wet, axis=0)
    return x + mix * wet / 4


def music():
    n = int(DUR * SR)
    pad = np.zeros((n, 2))
    arp = np.zeros(n)
    drums = np.zeros(n)
    bass = np.zeros(n)
    duck = np.ones(n)  # "respiro" do baixo a cada bumbo

    bars = [(i * BAR, name, "A") for i, name in enumerate(PART_A)]
    bars += [(B_START + i * BAR, name, "B") for i, name in enumerate(PART_B)]

    for start, name, part in bars:
        notes = CHORDS[name]
        dark = part == "A"
        length = min(BAR + 0.45, DUR - start) if start < DUR else 0
        if length <= 0:
            continue
        chord = pad_chord(notes, length, 900 if dark else 2200) * (0.55 if dark else 0.7)
        s = int(start * SR)
        e = min(n, s + len(chord))
        pad[s:e] += chord[: e - s]

        # Baixo: fundamental uma oitava abaixo, o compasso inteiro
        t = t_axis(min(BAR, DUR - start))
        f = hz(notes[0] - 12)
        tone = (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)) * np.minimum(1, t / 0.02)
        add(bass, tone * np.minimum(1, (len(t) / SR - t) / 0.05) * (0.5 if dark else 0.8), start)

        for beat in range(4):
            at = start + beat * BEAT
            if at >= DUR:
                break
            if dark:
                # Batimento: "tum-tum" nos tempos 1 e 3
                if beat in (0, 2):
                    add(drums, kick(0.8), at)
                    add(drums, kick(0.45), at + 0.19)
                continue
            if at > DUR - 0.8:  # a bateria para no fim; fica só o acorde
                continue
            if beat in (0, 2):
                add(drums, kick(), at)
                k = int(at * SR)
                t_duck = t_axis(0.25)
                duck[k : k + len(t_duck)] = np.minimum(
                    duck[k : k + len(t_duck)], 1 - 0.55 * np.exp(-t_duck / 0.09)
                )
            else:
                add(drums, clap() * 0.55, at)
            add(drums, hat() * 0.22, at)
            add(drums, hat(open_=beat == 3) * 0.3, at + BEAT / 2)

        if not dark:
            # Arpejo em colcheias, uma oitava acima
            tones = [notes[2] + 12, notes[3] + 12, notes[4] + 12, notes[2] + 24]
            pattern = [0, 1, 2, 3, 2, 1, 2, 3]
            for i, idx in enumerate(pattern):
                at = start + i * BEAT / 2
                if at < DUR - 0.3:
                    add(arp, pluck(hz(tones[idx])) * rng.uniform(0.75, 1.0), at)

    # Subida de tensão no último compasso da parte A (termina no swoosh)
    riser_start = B_START - BAR
    t = t_axis(BAR)
    riser = bandpass(rng.standard_normal(len(t)), 800, 6000) * (t / BAR) ** 3 * 0.35
    riser += np.sin(2 * np.pi * np.cumsum(200 + 600 * (t / BAR) ** 2) / SR) * (t / BAR) ** 2 * 0.12
    add(drums, riser, riser_start)

    bass = lowpass(bass * duck, 400)
    arp = lowpass(arp, 5000)
    mono = drums * 0.9 + bass * 0.55
    wet = reverb(np.column_stack([pad[:, 0] + arp * 0.35, pad[:, 1] + arp * 0.35]), mix=0.35)
    mix = wet + mono[:, None]

    # Parte A mais baixa que a B, e fade final curto
    t = t_axis(DUR)
    level = np.where(t < B_START, 0.7, 1.0)
    fade = np.minimum(1, (DUR - t) / 0.6)
    mix *= (level * fade)[:, None]
    # Normaliza antes da saturação suave, para o tanh só arredondar os picos
    mix = mix / np.max(np.abs(mix)) * 0.9
    return normalize(np.tanh(mix), -1)


if __name__ == "__main__":
    os.makedirs(PUBLIC, exist_ok=True)
    save("ping", ping())
    save("pop", pop())
    save("swoosh", swoosh())
    save("relogio", relogio())
    save("impacto", impacto())
    save("sucesso", sucesso())
    save("music", music())
