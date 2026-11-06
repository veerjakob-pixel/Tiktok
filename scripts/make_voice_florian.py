"""Sprachaufnahme mit der Stimme "Florian" (de-DE-FlorianMultilingualNeural, edge-tts) + genaue Wortzeiten.

Aufruf:
  EDGE_TTS_CA=/root/.ccr/ca-bundle.crt python3 scripts/make_voice_florian.py scripts/folge4/text.json \
      public/voiceover-folge4.mp3 public/voiceover-folge4-timing.json
text.json: {"rate": "-3%", "pitch": "-4Hz", "scenes": [{"display": "...", "spoken": "..."}]}
"display" = Untertitel-Text, "spoken" = was gesprochen wird (Zahlen ausgeschrieben). Beide müssen
gleich viele Wörter haben. Jede Szene wird am Stück gesprochen (natürliche Betonung).
"""
import asyncio, json, os, re, subprocess, sys, tempfile

if os.environ.get("EDGE_TTS_CA"):  # hinter dem Cloud-Proxy dessen Zertifikat verwenden
    import certifi
    certifi.where = lambda: os.environ["EDGE_TTS_CA"]
import edge_tts

VOICE = "de-DE-FlorianMultilingualNeural"
PAUSE = 0.35  # Sekunden Pause zwischen den Szenen
norm = lambda s: re.sub(r"[^\w]", "", s.lower())
tokens = lambda t: [w for w in t.split() if norm(w)]

async def speak(text, rate, pitch, path):
    c = edge_tts.Communicate(text, VOICE, rate=rate, pitch=pitch, boundary="WordBoundary")
    words = []
    with open(path, "wb") as f:
        async for ch in c.stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                words.append((ch["text"], ch["offset"] / 1e7, (ch["offset"] + ch["duration"]) / 1e7))
    return words

def main(cfg_path, out_mp3, out_json):
    cfg = json.load(open(cfg_path))
    tmp = tempfile.mkdtemp()
    parts, scene_secs, starts = [], [], []
    t0 = 0.0
    for i, sc in enumerate(cfg["scenes"]):
        disp, spok = tokens(sc["display"]), tokens(sc["spoken"])
        assert len(disp) == len(spok), f"Szene {i+1}: {len(disp)} vs {len(spok)} Wörter"
        raw = f"{tmp}/s{i}.mp3"
        words = asyncio.run(speak(sc["spoken"], cfg.get("rate", "+0%"), cfg.get("pitch", "+0Hz"), raw))
        a = max(0.0, words[0][1] - 0.04)          # Stille vorne abschneiden
        b = words[-1][2] + 0.12                   # kurz nach dem letzten Wort
        seg = f"{tmp}/s{i}.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af",
                        f"atrim={a}:{b},asetpts=N/SR/TB,apad=pad_dur={PAUSE}", "-ar", "44100", "-ac", "1", seg], check=True)
        dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", seg]))
        # Wortzeiten den Untertitel-Wörtern zuordnen (über Buchstaben-Position, robust bei Bindestrichen)
        wc, pos = [], 0
        for w, s, e in words:
            n = max(1, len(norm(w))); wc.append((pos, pos + n, s - a, e - a)); pos += n
        total = sum(len(norm(w)) for w in spok); tp = 0; res = []
        for w in spok:
            target = tp / total * pos
            for p0, p1, s, e in wc:
                if p0 <= target < p1:
                    res.append(round(t0 + s + (target - p0) / (p1 - p0) * (e - s), 3)); break
            else:
                res.append(round(t0 + wc[-1][2], 3))
            tp += len(norm(w))
        for k in range(1, len(res)):
            res[k] = max(res[k], res[k - 1] + 0.05)
        parts.append(seg); scene_secs.append(round(dur, 3)); starts.append(res); t0 += dur
    lst = f"{tmp}/list.txt"
    open(lst, "w").write("".join(f"file '{p}'\n" for p in parts))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst,
                    "-af", "loudnorm=I=-15:TP=-1.5", "-ar", "44100", "-b:a", "192k", out_mp3], check=True)
    json.dump({"voice": VOICE, "sceneSeconds": scene_secs, "wordStarts": starts}, open(out_json, "w"), indent=1)
    print(scene_secs, round(sum(scene_secs), 2))

if __name__ == "__main__":
    main(*sys.argv[1:4])
