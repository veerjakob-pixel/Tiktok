"""Aussprache-Prüfung: Spracherkennung (Whisper) schreibt die Aufnahme ab, Vergleich mit dem Text.
Aufruf: python3 scripts/check_speech.py public/voiceover-folgeX.mp3 scripts/folgeX/dialog.json
Wörter, die die Erkennung anders versteht, werden aufgelistet -> dort ggf. lautgetreu schreiben."""
import sys, json, re, subprocess, difflib
import numpy as np
from faster_whisper import WhisperModel

mp3, cfg = sys.argv[1], sys.argv[2]
raw = subprocess.check_output(["ffmpeg", "-v", "error", "-i", mp3, "-f", "f32le", "-ac", "1", "-ar", "16000", "-"])
audio = np.frombuffer(raw, np.float32)
model = WhisperModel("small", device="cpu", compute_type="int8")
segs, _ = model.transcribe(audio, language="de", beam_size=5)
heard = " ".join(s.text for s in segs)
norm = lambda t: [w for w in re.sub(r"[^\wäöüß ]", " ", t.lower()).split() if w]
d = json.load(open(cfg))
said = " ".join(l["display"] for sc in d["scenes"] for l in sc["lines"])  # mit dem Untertitel vergleichen
a, b = norm(said), norm(heard)
print("GEHÖRT:", heard.strip(), "\n")
bad = [(" ".join(a[i1:i2]), " ".join(b[j1:j2])) for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b).get_opcodes() if op != "equal"]
# Zahlen erkennt Whisper als Ziffern, zusammengesetzte Wörter manchmal getrennt -> keine echten Fehler
bad = [(x, y) for x, y in bad if not re.fullmatch(r"[\d ]+", y) and x.replace(" ", "") != y.replace(" ", "")]
for s, h in bad:
    print(f"  Text: {s!r:40} gehört: {h!r}")
print(f"\n{len(bad)} Abweichungen bei {len(a)} Wörtern")
