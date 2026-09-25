#!/usr/bin/env python3
"""Prepara as falas da locução baixadas do Higgsfield.

Para cada <pasta>/<id>.mp3 (id = chave de `locucao` em copy.ts):
  - corta o silêncio do começo e do fim;
  - deixa todas as falas no mesmo volume (RMS da voz em -17 dBFS, pico <= -1,5 dBFS);
  - grava public/voz/<id>.mp3 e mostra a duração em frames (para timing.ts, VOZ).

    pip install numpy
    python3 scripts/preparar-voz.py <pasta-com-os-mp3>
"""

import glob
import os
import subprocess
import sys
import tempfile
import wave

import numpy as np

SR = 44100
FPS = 30
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT = os.path.join(ROOT, "public", "voz")
TARGET_RMS_DB = -17.0
PEAK_DB = -1.5


def ffmpeg(*args):
    subprocess.run(["npx", "remotion", "ffmpeg", "-y", "-v", "error", *args], check=True, cwd=ROOT)


def read(path):
    with tempfile.TemporaryDirectory() as tmp:
        wav_path = os.path.join(tmp, "in.wav")
        ffmpeg("-i", path, "-ac", "1", "-ar", str(SR), "-acodec", "pcm_s16le", wav_path)
        with wave.open(wav_path) as w:
            return np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").astype(np.float64) / 32768


def write_mp3(x, path):
    with tempfile.TemporaryDirectory() as tmp:
        wav_path = os.path.join(tmp, "out.wav")
        with wave.open(wav_path, "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())
        ffmpeg("-i", wav_path, "-codec:a", "libmp3lame", "-b:a", "192k", path)


def frame_db(x, hop):
    n = len(x) // hop
    frames = x[: n * hop].reshape(n, hop)
    return 20 * np.log10(np.sqrt(np.mean(frames**2, axis=1)) + 1e-9)


def process(x):
    hop = SR // 100  # janelas de 10 ms
    db = frame_db(x, hop)
    voiced = np.where(db > db.max() - 40)[0]
    start = max(0, voiced[0] * hop - int(0.03 * SR))
    end = min(len(x), (voiced[-1] + 1) * hop + int(0.08 * SR))
    x = x[start:end]
    # fades curtos para não estalar
    fade = int(0.01 * SR)
    x[:fade] *= np.linspace(0, 1, fade)
    x[-fade:] *= np.linspace(1, 0, fade)

    db = frame_db(x, hop)
    active = db > db.max() - 30
    frames = x[: len(db) * hop].reshape(len(db), hop)
    rms = np.sqrt(np.mean(frames[active] ** 2))
    gain = min(10 ** (TARGET_RMS_DB / 20) / rms, 10 ** (PEAK_DB / 20) / np.abs(x).max())
    return x * gain, 20 * np.log10(gain)


if __name__ == "__main__":
    folder = sys.argv[1]
    os.makedirs(OUT, exist_ok=True)
    for path in sorted(glob.glob(os.path.join(folder, "*.mp3"))):
        name = os.path.splitext(os.path.basename(path))[0]
        raw = read(path)
        clean, gain_db = process(raw)
        write_mp3(clean, os.path.join(OUT, f"{name}.mp3"))
        secs = len(clean) / SR
        print(
            f"{name:16s} bruto {len(raw) / SR:5.2f} s -> {secs:5.2f} s "
            f"({int(np.ceil(secs * FPS)):3d} frames)  ganho {gain_db:+5.1f} dB"
        )
