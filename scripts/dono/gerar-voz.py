#!/usr/bin/env python3
"""Gera a locução do anúncio "Dono" na Cartesia (voz Felipe, português).

Lê os textos de `locucao` em src/dono/copy.ts, gera uma fala por id, corta o
silêncio, iguala o volume (mesmo tratamento de scripts/preparar-voz.py) e grava
public/dono/voz/<id>.mp3, mostrando a duração em frames de cada uma.

A chave fica só na variável de ambiente (nunca no repositório):

    export CARTESIA_API_KEY=sk_car_...
    python3 scripts/dono/gerar-voz.py            # todas as falas
    python3 scripts/dono/gerar-voz.py cta dor    # só algumas

Opcional: CARTESIA_VOICE_ID (pula a busca pela voz "Felipe") e
CARTESIA_MODEL (padrão sonic-2).
"""

import importlib.util
import json
import os
import re
import sys
import tempfile
import urllib.parse
import urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
COPY = os.path.join(ROOT, "src", "dono", "copy.ts")
OUT = os.path.join(ROOT, "public", "dono", "voz")
API = "https://api.cartesia.ai"
VERSAO = "2025-04-16"


def chave():
    k = os.environ.get("CARTESIA_API_KEY")
    if not k:
        sys.exit("Defina CARTESIA_API_KEY")
    return k


def requisicao(metodo, caminho, corpo=None):
    req = urllib.request.Request(
        API + caminho,
        data=json.dumps(corpo).encode() if corpo is not None else None,
        method=metodo,
        headers={
            "X-API-Key": chave(),
            "Cartesia-Version": VERSAO,
            "Content-Type": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read()


def voz_felipe():
    if os.environ.get("CARTESIA_VOICE_ID"):
        return os.environ["CARTESIA_VOICE_ID"]
    q = urllib.parse.urlencode({"q": "Felipe", "limit": 100})
    dados = json.loads(requisicao("GET", f"/voices?{q}"))
    vozes = dados.get("data", dados) if isinstance(dados, dict) else dados
    candidatas = [v for v in vozes if "felipe" in v.get("name", "").lower()]
    pt = [v for v in candidatas if str(v.get("language", "")).startswith("pt")]
    escolhida = (pt or candidatas or [None])[0]
    if not escolhida:
        sys.exit("Voz 'Felipe' não encontrada; defina CARTESIA_VOICE_ID")
    print(f"voz: {escolhida['name']} ({escolhida['id']}, {escolhida.get('language')})")
    return escolhida["id"]


def falas():
    """Extrai o objeto `locucao: { id: "texto", ... }` de copy.ts."""
    fonte = open(COPY, encoding="utf-8").read()
    bloco = re.search(r"locucao:\s*\{(.*?)\n  \}", fonte, re.S).group(1)
    return dict(re.findall(r'^\s*"?([\w-]+)"?:\s*"([^"]+)"', bloco, re.M))


def main():
    # Mesmo tratamento das falas do anúncio anterior (corte de silêncio e volume)
    spec = importlib.util.spec_from_file_location("prep", os.path.join(ROOT, "scripts", "preparar-voz.py"))
    prep = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(prep)

    textos = falas()
    ids = sys.argv[1:] or list(textos)
    voz = voz_felipe()
    modelo = os.environ.get("CARTESIA_MODEL", "sonic-2")
    os.makedirs(OUT, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp:
        for i in ids:
            audio = requisicao(
                "POST",
                "/tts/bytes",
                {
                    "model_id": modelo,
                    "transcript": textos[i],
                    "voice": {"mode": "id", "id": voz},
                    "language": "pt",
                    "output_format": {"container": "wav", "encoding": "pcm_s16le", "sample_rate": 44100},
                },
            )
            bruto = os.path.join(tmp, f"{i}.wav")
            open(bruto, "wb").write(audio)
            limpo, _ = prep.process(prep.read(bruto))
            prep.write_mp3(limpo, os.path.join(OUT, f"{i}.mp3"))
            frames = round(len(limpo) / prep.SR * prep.FPS)
            print(f"{i:<12} {frames:4d} frames  {textos[i]}")


if __name__ == "__main__":
    main()
