"""Erzeugt per Code: ruhige Hintergrundmusik + Soundeffekte (Wusch, Knall, Klick).

Ausgabe:
  public/music-folge2.mp3   ruhige Akkord-Fläche mit leisem Klavier-Arpeggio (ca. 52 s)
  public/sfx/whoosh.mp3     Wusch für Szenenwechsel
  public/sfx/knall.mp3      Knall für den Stempel
  public/sfx/klick.mp3      Klick für Zahlen
"""
import os, subprocess, tempfile, wave
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 44100
rng = np.random.default_rng(7)


def save(path, x, stereo=True):
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 1 and stereo:
        x = np.stack([x, x], axis=1)
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.89
    tmp = tempfile.mktemp(suffix=".wav")
    with wave.open(tmp, "wb") as w:
        w.setnchannels(2 if x.ndim == 2 else 1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())
    os.makedirs(os.path.dirname(path), exist_ok=True)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp, "-b:a", "192k", path], check=True)
    os.remove(tmp)


def lowpass(x, cutoff):
    # einfacher 1-Pol-Tiefpass (cutoff darf ein Array sein)
    a = np.exp(-2 * np.pi * np.asarray(cutoff) / SR) * np.ones(len(x))
    y = np.zeros_like(x)
    prev = 0.0
    for i in range(len(x)):
        prev = (1 - a[i]) * x[i] + a[i] * prev
        y[i] = prev
    return y


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


# ---------------- Musik ----------------
def music(seconds=52.0):
    bpm = 72
    beat = 60 / bpm
    bar = 4 * beat
    n = int(seconds * SR)
    t = np.arange(n) / SR
    L = np.zeros(n)
    R = np.zeros(n)
    # Am – F – C – G (ruhig, leicht nachdenklich)
    chords = [[57, 60, 64], [53, 57, 60], [48, 55, 60, 64], [55, 59, 62]]
    bass = [45, 41, 48, 43]
    bars = int(np.ceil(seconds / bar))
    for b in range(bars):
        ch = chords[b % 4]
        s0 = b * bar
        i0 = int(s0 * SR)
        i1 = min(n, int((s0 + bar + 0.6) * SR))
        tt = t[i0:i1] - s0
        env = np.minimum(1, tt / 0.9) * np.clip((bar + 0.6 - tt) / 0.9, 0, 1)
        for k, note in enumerate(ch):
            f = midi(note)
            pad = np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(2 * np.pi * f * 1.003 * tt + 1) + 0.18 * np.sin(2 * np.pi * 2 * f * tt)
            pan = 0.35 + 0.3 * (k / max(1, len(ch) - 1))
            L[i0:i1] += pad * env * 0.11 * (1 - pan)
            R[i0:i1] += pad * env * 0.11 * pan
        fb = midi(bass[b % 4])
        bl = (np.sin(2 * np.pi * fb * tt) + 0.3 * np.sin(2 * np.pi * 2 * fb * tt)) * env * 0.16
        L[i0:i1] += bl
        R[i0:i1] += bl
        # leises Klavier-Arpeggio in Achteln
        arp = ch + [ch[1] + 12]
        for e in range(8):
            note = arp[[0, 1, 2, 3, 2, 1, 2, 3][e] % len(arp)] + 12
            st = s0 + e * beat / 2
            j0 = int(st * SR)
            j1 = min(n, j0 + int(1.6 * SR))
            if j0 >= n:
                break
            u = t[j0:j1] - st
            f = midi(note)
            tone = (np.sin(2 * np.pi * f * u) + 0.25 * np.sin(2 * np.pi * 2 * f * u)) * np.exp(-u * 3.2) * np.minimum(1, u / 0.005)
            vel = 0.055 if e % 2 else 0.075
            pan = 0.3 + 0.4 * ((e % 4) / 3)
            L[j0:j1] += tone * vel * (1 - pan)
            R[j0:j1] += tone * vel * pan
    # weiche Ein- und Ausblendung
    fade = np.minimum(1, t / 2.0) * np.clip((seconds - t) / 3.0, 0, 1)
    L *= fade
    R *= fade
    # etwas Hall (einfache Echos)
    for d, g in [(0.23, 0.25), (0.41, 0.18), (0.67, 0.12)]:
        k = int(d * SR)
        L[k:] += R[:-k] * g
        R[k:] += L[:-k] * g
    return np.stack([L, R], axis=1)


# ---------------- Soundeffekte ----------------
def whoosh(dur=0.45):
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    env = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 2
    cutoff = 400 + 3500 * np.sin(np.pi * t / dur)
    x = lowpass(noise, cutoff) * env
    pan = t / dur
    return np.stack([x * (1 - pan * 0.6), x * (0.4 + pan * 0.6)], axis=1)


def knall(dur=0.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 110 * np.exp(-t * 9) + 45
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)
    crack = lowpass(rng.standard_normal(n), 2500) * np.exp(-t * 35) * 0.9
    return body + crack


def klick(dur=0.05):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 2200 * t) * 0.6 + rng.standard_normal(n) * 0.25) * np.exp(-t * 160)


if __name__ == "__main__":
    save(os.path.join(ROOT, "public", "music-folge2.mp3"), music())
    save(os.path.join(ROOT, "public", "sfx", "whoosh.mp3"), whoosh())
    save(os.path.join(ROOT, "public", "sfx", "knall.mp3"), knall())
    save(os.path.join(ROOT, "public", "sfx", "klick.mp3"), klick())
    print("Musik und Soundeffekte erzeugt.")
