"""Erzeugt public/voiceover-folge2.mp3 + src/folge2/timing.json aus voiceover-folge2.txt.

Stimme: edge-tts, de-DE-ConradNeural, rate -8 %, pitch -4 Hz (ruhig, leicht tief).
Jede Szene wird einzeln gesprochen, dann mit kurzen Pausen zusammengefügt.
So kennen wir die genaue Länge jeder Szene und die Zeit jedes Wortes (für die Untertitel).

Falls schon eine eigene Aufnahme in public/voiceover-folge2.mp3 liegt, wird sie NICHT überschrieben
(außer mit --force). Dann werden nur die Szenenlängen gleichmäßig auf die Aufnahme verteilt.
"""
import asyncio, json, os, re, ssl, subprocess, sys, tempfile

import edge_tts
import edge_tts.communicate as comm

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TXT = os.path.join(ROOT, "voiceover-folge2.txt")
MP3 = os.path.join(ROOT, "public", "voiceover-folge2.mp3")
TIMING = os.path.join(ROOT, "src", "folge2", "timing.json")
VOICE, RATE, PITCH = "de-DE-ConradNeural", "-8%", "-4Hz"
PAUSE = 0.45  # Sekunden Pause zwischen den Szenen
GAP = 0.35    # Sekunden Pause zwischen zwei Sätzen
TAIL = 0.12   # Nachklang nach dem letzten Wort eines Satzes
LEAD = 0.2   # Sekunden Stille ganz am Anfang

# Hinter einem Firmen-Proxy braucht edge-tts evtl. ein eigenes CA-Zertifikat.
ca = os.environ.get("SSL_CERT_FILE") or ("/root/.ccr/ca-bundle.crt" if os.path.exists("/root/.ccr/ca-bundle.crt") else None)
if ca:
    comm._SSL_CTX = ssl.create_default_context(cafile=ca)


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
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", str(GAP), os.path.join(tmp, "gap.wav")], check=True)
    n = 0
    for i, text in enumerate(texts):
        # jeden Satz einzeln sprechen -> Pausen zwischen Sätzen sind kurz und gleichmäßig
        sentences = [x for x in re.split(r"(?<=[.?!])\s+", text) if x]
        scene_start, words = t, []
        for k, sent in enumerate(sentences):
            mp3 = os.path.join(tmp, f"p{n}.mp3")
            wav = os.path.join(tmp, f"p{n}.wav")
            n += 1
            marks = await speak(sent, mp3)
            # Stille vorne/hinten abschneiden (Wortgrenzen von edge-tts)
            cut_a = max(0.0, marks[0]["start"] - 0.06)
            cut_b = marks[-1]["end"] + TAIL
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", mp3, "-ss", f"{cut_a:.3f}", "-to", f"{cut_b:.3f}",
                            "-af", "afade=t=out:st=%.3f:d=0.05" % (cut_b - cut_a - 0.05), "-ar", "24000", "-ac", "1", wav], check=True)
            d = duration(wav)
            words += align(sent, marks, t - cut_a)
            parts.append(wav)
            t += d
            if k < len(sentences) - 1:
                parts.append(os.path.join(tmp, "gap.wav"))
                t += GAP
        scenes.append({"text": text, "start": round(scene_start, 3), "speechEnd": round(t, 3), "words": words})
        if i < len(texts) - 1:
            parts.append(os.path.join(tmp, "pause.wav"))
            t += PAUSE
        print(f"Szene {i + 1}: {t - scene_start:.2f} s")
    lst = os.path.join(tmp, "list.txt")
    with open(lst, "w") as f:
        f.writelines(f"file '{p}'\n" for p in parts)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", lst, "-ar", "44100", "-ac", "2", "-b:a", "192k", MP3], check=True)
    total = duration(MP3)
    json.dump({"voice": VOICE, "rate": RATE, "pitch": PITCH, "total": round(total, 3), "scenes": scenes}, open(TIMING, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"Fertig: {MP3} ({total:.2f} s)")


asyncio.run(main())
