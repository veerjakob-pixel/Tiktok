"""Testet Schreibweisen für die Aussprache: jede Variante sprechen lassen und von Whisper abschreiben lassen.
Aufruf: EDGE_TTS_CA=... python3 scripts/probe_speech.py <stimme> <tempo> "Variante 1" "Variante 2" ..."""
import asyncio, os, subprocess, sys, tempfile
import numpy as np
if os.environ.get("EDGE_TTS_CA"):
    import certifi
    certifi.where = lambda: os.environ["EDGE_TTS_CA"]
import edge_tts
from faster_whisper import WhisperModel

voice, rate, *texts = sys.argv[1:]
model = WhisperModel("small", device="cpu", compute_type="int8")
tmp = tempfile.mkdtemp()
for i, t in enumerate(texts):
    f = f"{tmp}/{i}.mp3"
    asyncio.run(edge_tts.Communicate(t, voice, rate=rate).save(f))
    raw = subprocess.check_output(["ffmpeg", "-v", "error", "-i", f, "-f", "f32le", "-ac", "1", "-ar", "16000", "-"])
    segs, _ = model.transcribe(np.frombuffer(raw, np.float32), language="de", beam_size=5)
    print(f"{t!r:60} -> {' '.join(s.text for s in segs).strip()!r}")
