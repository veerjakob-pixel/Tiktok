"""Erzeugt public/voiceover-folge2.mp3 + src/folge2/timing.json aus voiceover-folge2.txt.

Stimme: edge-tts, de-DE-FlorianMultilingualNeural, normales Tempo, normale Tonhöhe.
Jede Szene wird am Stück gesprochen (natürliche Betonung), zu lange Pausen werden gekürzt.
So kennen wir die genaue Länge jeder Szene und die Zeit jedes Wortes (für die Untertitel).

Falls schon eine eigene Aufnahme in public/voiceover-folge2.mp3 liegt, wird sie NICHT überschrieben
(außer mit --force). Dann werden nur die Szenenlängen gleichmäßig auf die Aufnahme verteilt.
"""
import asyncio, json, os, re, ssl, subprocess, sys, tempfile, wave

import numpy as np

import edge_tts
import edge_tts.communicate as comm

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TXT = os.path.join(ROOT, "voiceover-folge2.txt")
MP3 = os.path.join(ROOT, "public", "voiceover-folge2.mp3")
TIMING = os.path.join(ROOT, "src", "folge2", "timing.json")
VOICE, RATE, PITCH = "de-DE-FlorianMultilingualNeural", "+0%", "+0Hz"
PAUSE = 0.35  # Sekunden Pause zwischen den Szenen
MAX_PAUSE = 0.4  # längere Pausen innerhalb einer Szene werden auf diese Länge gekürzt
SR = 24000
TAIL = 0.12   # Nachklang nach dem letzten Wort eines Satzes
LEAD = 0.2  # Sekunden Stille ganz am Anfang
# So soll die Stimme bestimmte Wörter aussprechen (der Untertitel zeigt weiter das Original)
SPEAK_AS = {"1920ern": "Neunzehnhundertzwanzigern"}

# Hinter einem Firmen-Proxy braucht edge-tts evtl. ein eigenes CA-Zertifikat.
ca = os.environ.get("SSL_CERT_FILE") or ("/root/.ccr/ca-bundle.crt" if os.path.exists("/root/.ccr/ca-bundle.crt") else None)
if ca:
    comm._SSL_CTX = ssl.create_default_context(cafile=ca)

# edge-tts schickt fest xml:lang='en-US' mit. Florian ist eine mehrsprachige Stimme
# und würde dann kurze Sätze evtl. mit englischem Akzent lesen -> auf Deutsch stellen.
_orig_mkssml = comm.mkssml
comm.mkssml = lambda tc, text: _orig_mkssml(tc, text).replace("xml:lang='en-US'", "xml:lang='de-DE'")


def read_scenes():
    scenes, cur = [], None
    for line in open(TXT, encoding="utf-8"):
        line = line.strip()
        if line.startswith("[Szene"):
            cur = []
            scenes.append(cur)
        elif cur is not None and line:
            cur.append(line)
    return [" ".join(s) for s in scenes]


def norm(s):
    return re.sub(r"[^\w]", "", s.lower())


def duration(path):
    out = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path])
    return float(out)


async def speak(text, path):
    c = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH, boundary="WordBoundary")
    marks = []
    with open(path, "wb") as f:
        async for ch in c.stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                marks.append({"text": ch["text"], "start": ch["offset"] / 1e7, "end": (ch["offset"] + ch["duration"]) / 1e7})
    return marks


def align(text, marks, offset):
    """Ordnet die Wörter aus dem Skript (mit Satzzeichen) den gesprochenen Wörtern zu."""
    tokens = [t for t in text.split() if re.search(r"\w", t)]
    words, j = [], 0
    for ti, tok in enumerate(tokens):
        target = norm(tok)
        if j >= len(marks):
            last = words[-1]["end"] if words else offset
            words.append({"text": tok, "start": last, "end": last + 0.2})
            continue
        start = marks[j]["start"]
        got = norm(marks[j]["text"])
        end = marks[j]["end"]
        j += 1
        # ein Skriptwort kann aus mehreren gesprochenen Teilen bestehen (z. B. "Speck-Hersteller")
        while j < len(marks) and len(got) < len(target) and target.startswith(got + norm(marks[j]["text"])):
            got += norm(marks[j]["text"])
            end = marks[j]["end"]
            j += 1
        # Zahlen wie "1920ern" werden ausgesprochen -> alle Teile bis zum nächsten passenden Wort schlucken
        if got != target and ti + 1 < len(tokens):
            nxt = norm(tokens[ti + 1])
            while j < len(marks) and norm(marks[j]["text"]) != nxt:
                end = marks[j]["end"]
                j += 1
        words.append({"text": tok, "start": round(start + offset, 3), "end": round(end + offset, 3)})
    return words


async def main():
    force = "--force" in sys.argv
    texts = read_scenes()
    if os.path.exists(MP3) and not force:
        print("Eigene Aufnahme gefunden – wird nicht überschrieben:", MP3)
        return
    tmp = tempfile.mkdtemp()
    parts, scenes, t = [], [], LEAD
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", str(LEAD), os.path.join(tmp, "lead.wav")], check=True)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", str(PAUSE), os.path.join(tmp, "pause.wav")], check=True)
    parts.append(os.path.join(tmp, "lead.wav"))
    n = 0
    for i, text in enumerate(texts):
        # Die ganze Szene am Stück sprechen -> natürliche Betonung über die Sätze hinweg.
        # Danach werden nur zu lange Pausen gekürzt.
        mp3 = os.path.join(tmp, f"s{i}.mp3")
        wav = os.path.join(tmp, f"s{i}.wav")
        spoken = text
        for k_, v_ in SPEAK_AS.items():
            spoken = spoken.replace(k_, v_)
        marks = await speak(spoken, mp3)
        pcm = subprocess.check_output(["ffmpeg", "-v", "error", "-i", mp3, "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"])
        x = np.frombuffer(pcm, np.int16)
        # Abschnitte, die behalten werden: vom ersten bis zum letzten Wort, lange Pausen gekürzt
        keep = []
        seg_a = max(0.0, marks[0]["start"] - 0.06)
        for j in range(len(marks) - 1):
            gap_a, gap_b = marks[j]["end"], marks[j + 1]["start"]
            if gap_b - gap_a > MAX_PAUSE:
                keep.append((seg_a, gap_a + MAX_PAUSE * 0.6))
                seg_a = gap_b - MAX_PAUSE * 0.4
        keep.append((seg_a, marks[-1]["end"] + TAIL))

        def remap(tt):  # alte Zeit -> neue Zeit (nach dem Kürzen)
            acc = 0.0
            for ka, kb in keep:
                if tt <= kb:
                    return acc + max(0.0, tt - ka)
                acc += kb - ka
            return acc

        pieces = []
        fade = int(0.01 * SR)
        for ka, kb in keep:
            seg = x[int(ka * SR):int(kb * SR)].astype(np.float64)
            env = np.ones(len(seg))
            env[:fade] = np.linspace(0, 1, min(fade, len(seg)))[: len(env[:fade])]
            env[-fade:] = np.linspace(1, 0, min(fade, len(seg)))[-len(env[-fade:]):]
            pieces.append(seg * env)
        y = np.concatenate(pieces).astype(np.int16)
        with wave.open(wav, "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes(y.tobytes())
        mapped = [{**m, "start": remap(m["start"]), "end": remap(m["end"])} for m in marks]
        d = len(y) / SR
        scenes.append({"text": text, "start": round(t, 3), "speechEnd": round(t + d, 3), "words": align(text, mapped, t)})
        parts.append(wav)
        t += d
        if i < len(texts) - 1:
            parts.append(os.path.join(tmp, "pause.wav"))
            t += PAUSE
        print(f"Szene {i + 1}: {d:.2f} s")
    lst = os.path.join(tmp, "list.txt")
    with open(lst, "w") as f:
        f.writelines(f"file '{p}'\n" for p in parts)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", lst, "-ar", "44100", "-ac", "2", "-b:a", "192k", MP3], check=True)
    total = duration(MP3)
    json.dump({"voice": VOICE, "rate": RATE, "pitch": PITCH, "total": round(total, 3), "scenes": scenes}, open(TIMING, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"Fertig: {MP3} ({total:.2f} s)")


asyncio.run(main())
