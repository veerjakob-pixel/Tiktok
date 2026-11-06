"""Rausch-Prüfung für Videos und Tondateien.

Aufruf: python3 scripts/check_noise.py out/video.mp4 [weitere Dateien]

Rauschen = gleichmäßig verteilte Energie im Hochton (4–16 kHz). Töne (Glocke, Klick, Stimme)
haben dagegen einzelne Spitzen im Spektrum. Pro 50-ms-Stück wird die "Flachheit" des Spektrums
gemessen (0 = reiner Ton, 1 = reines Rauschen). Nur flache Stücke zählen als Rauschen.
Bewertet wird die schlimmste Sekunde der Datei. Grenze: -55 dB. Exit-Code 1, wenn es rauscht.
"""
import subprocess, sys
import numpy as np

LIMIT = -55.0
SR = 44100
WIN = 2205  # 50 ms

def load(f):
    return np.frombuffer(subprocess.check_output(["ffmpeg", "-v", "error", "-i", f, "-vn", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"]), np.float32)

fr = np.fft.rfftfreq(WIN, 1 / SR)
band = (fr >= 4000) & (fr <= 16000)
hann = np.hanning(WIN)

def noise_db(w):
    p = np.abs(np.fft.rfft(w * hann))[band] ** 2 + 1e-20
    flat = np.exp(np.mean(np.log(p))) / np.mean(p)  # spektrale Flachheit
    level = 10 * np.log10(np.sum(p) / (np.sum(hann ** 2) * WIN / 2) + 1e-20)
    return level if flat > 0.25 else -120.0

bad = False
for f in sys.argv[1:]:
    x = load(f)
    if len(x) < WIN:
        x = np.pad(x, (0, WIN - len(x)))
    vals = np.array([noise_db(x[i:i + WIN]) for i in range(0, len(x) - WIN + 1, WIN)])
    per_sec = [np.median(vals[i:i + 20]) for i in range(0, len(vals), 20)]  # 20 Stücke = 1 s
    worst = max(per_sec)
    sec = int(np.argmax(per_sec))
    ok = worst < LIMIT
    bad |= not ok
    print(f"{'OK      ' if ok else 'RAUSCHEN'} {f}: lautestes Rauschen {worst:.1f} dB (bei {sec} s, Grenze {LIMIT:.0f} dB)")
sys.exit(1 if bad else 0)
