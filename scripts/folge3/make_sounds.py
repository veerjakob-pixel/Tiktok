"""Erzeugt ruhige Hintergrundmusik und Soundeffekte (Wusch, Knall, Klick) nur per Code.
Aufruf: python3 scripts/folge3/make_sounds.py public [folge4]  (braucht numpy + ffmpeg)"""
import sys, subprocess, numpy as np
OUT = sys.argv[1] if len(sys.argv) > 1 else "public"
SR = 44100
rng = np.random.default_rng(3)

def save(name, x, stereo=False):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.9
    raw = (x.T if stereo else x).astype(np.float32).tobytes()
    ch = 2 if stereo else 1
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", str(ch), "-i", "-",
                    "-b:a", "160k", f"{OUT}/{name}"], input=raw, check=True)

def lowpass(x, a):  # einfacher Tiefpass (1-Pol)
    y = np.empty_like(x); s = 0.0
    for i, v in enumerate(x):
        s += a * (v - s); y[i] = s
    return y

def env(n, att, rel):
    e = np.ones(n); a = min(n // 2, int(att * SR)); r = min(n // 2, int(rel * SR))
    e[:a] = np.linspace(0, 1, a); e[-r:] *= np.linspace(1, 0, r); return e

# ---------- Musik: ruhiger Pad-Teppich, Am – F – C – G, 72 BPM ----------
def music(seconds=48, chords=None, bpm=72):
    n = int(seconds * SR); t = np.arange(n) / SR
    L = np.zeros(n); R = np.zeros(n)
    chords = chords or [[57, 60, 64, 69], [53, 57, 60, 65], [48, 55, 60, 64], [55, 59, 62, 67]]  # MIDI
    bar = 4 * 60 / bpm  # Sekunden pro Takt
    f = lambda m: 440 * 2 ** ((m - 69) / 12)
    k = 0; start = 0.0
    while start < seconds:
        ch = chords[k % 4]; s = int(start * SR); e = min(n, int((start + bar * 1.15) * SR)); m = e - s
        tt = np.arange(m) / SR; en = env(m, 1.2, 1.4)
        for j, note in enumerate(ch):
            fr = f(note)
            tone = (np.sin(2 * np.pi * fr * tt) + 0.3 * np.sin(2 * np.pi * fr * 2.003 * tt)) * en * 0.18
            L[s:e] += tone * (0.6 + 0.1 * j); R[s:e] += tone * (0.9 - 0.1 * j)
        # Bass
        b = np.sin(2 * np.pi * f(ch[0] - 12) * tt) * en * 0.35
        L[s:e] += b; R[s:e] += b
        # leise Glocken-Arpeggio
        for q in range(4):
            ps = s + int(q * bar / 4 * SR); pm = min(n - ps, int(1.5 * SR))
            if pm <= 0: continue
            pt = np.arange(pm) / SR
            pl = np.sin(2 * np.pi * f(ch[(q * 2) % 4] + 12) * pt) * np.exp(-pt * 3.5) * 0.07
            (L if q % 2 else R)[ps:ps + pm] += pl
        k += 1; start += bar
    L = lowpass(L, 0.12); R = lowpass(R, 0.12)
    fade = env(n, 1.5, 2.5); return np.vstack([L * fade, R * fade])

# ---------- Soundeffekte ----------
def whoosh(d=0.45):
    n = int(d * SR); t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    a = 0.02 + 0.25 * np.sin(np.pi * t / d) ** 2  # Filter öffnet und schließt
    y = np.empty(n); s = 0.0
    for i in range(n):
        s += a[i] * (noise[i] - s); y[i] = s
    return y * np.sin(np.pi * t / d) ** 1.5

def boom(d=0.9):  # Stempel-Knall: kurzer Schlag + tiefer Bums
    n = int(d * SR); t = np.arange(n) / SR
    thump = np.sin(2 * np.pi * (55 + 90 * np.exp(-t * 30)) * t) * np.exp(-t * 6)
    crack = lowpass(rng.standard_normal(n), 0.35) * np.exp(-t * 45)
    return thump * 1.0 + crack * 1.4

def click(d=0.06):
    n = int(d * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 2200 * t) * 0.6 + rng.standard_normal(n) * 0.4) * np.exp(-t * 120)

def kaching(d=0.9):  # Kasse: kurzer Klick + helle Glocke
    n = int(d * SR); t = np.arange(n) / SR
    bell = sum(np.sin(2 * np.pi * f * t) * a for f, a in [(2637, 1), (3520, 0.6), (5274, 0.3)]) * np.exp(-t * 5)
    start = int(0.06 * SR); y = np.zeros(n); y[start:] = bell[: n - start]
    return y + np.pad(click(), (0, n - len(click())))

def hit(d=1.4):  # tiefer Bass-Hit mit Nachhall (Hook)
    n = int(d * SR); t = np.arange(n) / SR
    sub = np.sin(2 * np.pi * (42 + 60 * np.exp(-t * 12)) * t) * np.exp(-t * 2.2)
    noise = lowpass(rng.standard_normal(n), 0.05) * np.exp(-t * 4) * 0.8
    return sub + noise

def ambience(d=16.0):  # Supermarkt: Kühlregal-Summen, Raumrauschen, ab und zu ein Kassen-Piep
    n = int(d * SR); t = np.arange(n) / SR
    hum = (np.sin(2 * np.pi * 50 * t) * 0.5 + np.sin(2 * np.pi * 100 * t) * 0.25 + np.sin(2 * np.pi * 150 * t) * 0.1) * 0.15
    room = lowpass(rng.standard_normal(n), 0.03) * 1.2
    y = hum + room
    for at in [1.7, 6.3, 11.8, 14.1]:
        s0 = int(at * SR); m = int(0.12 * SR)
        y[s0:s0 + m] += np.sin(2 * np.pi * 2900 * np.arange(m) / SR) * 0.12 * env(m, 0.005, 0.03)
    return y * env(n, 0.3, 0.3)

def rewind(d=1.2):  # Kassette zurückspulen: schnelle, hohe Zwitscher-Stimmen + Bandrauschen
    n = int(d * SR); t = np.arange(n) / SR
    f = 900 + 600 * np.sin(2 * np.pi * 7 * t) + 400 * np.sin(2 * np.pi * 13.3 * t)
    chirp = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.5 + 0.5 * np.sin(2 * np.pi * 21 * t) ** 2)
    hiss = lowpass(rng.standard_normal(n), 0.4) * 0.4
    return (chirp * 0.6 + hiss) * env(n, 0.05, 0.15)

if len(sys.argv) > 2 and sys.argv[2] == "folge4b":
    save("sfx-ambience-market.mp3", ambience())
    save("sfx-rewind.mp3", rewind())
    print("fertig"); sys.exit()

if len(sys.argv) > 2 and sys.argv[2] == "folge4":
    # etwas spannender: a-Moll / F / d-Moll / E, 80 BPM
    save("music-folge4.mp3", music(56, chords=[[45, 57, 60, 64], [41, 57, 60, 65], [38, 57, 62, 65], [40, 56, 59, 64]], bpm=80), stereo=True)
    save("sfx-kaching.mp3", kaching())
    save("sfx-hit.mp3", hit())
    print("fertig"); sys.exit()

if __name__ == "__main__":
    save("music-folge3.mp3", music(), stereo=True)
    save("sfx-whoosh.mp3", whoosh())
    save("sfx-boom.mp3", boom())
    save("sfx-click.mp3", click())
    print("fertig")
