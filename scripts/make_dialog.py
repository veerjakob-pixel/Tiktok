"""Sprachaufnahme für Dialog-Videos: mehrere Sprecher (edge-tts), genaue Wortzeiten pro Sprecher.

Aufruf:
  EDGE_TTS_CA=/root/.ccr/ca-bundle.crt python3 scripts/make_dialog.py scripts/folge4b/dialog.json \
      public/voiceover-folge4b.mp3 public/voiceover-folge4b-timing.json
dialog.json: {"voices": {"ich": {"voice": "...", "rate": "+10%", "pitch": "+0Hz"}, ...},
              "gap": 0.18, "scenes": [{"lines": [{"who": "lena", "display": "...", "spoken": "..."}]}]}
"display" = Untertitel, "spoken" = gesprochener Text (Zahlen ausgeschrieben, gleiche Wortzahl).
Ergebnis-JSON: sceneSeconds, wordStarts (pro Szene), speakers (pro Szene: Sprecher jedes Worts),
lines (pro Szene: who/start/end in Sekunden ab Videostart).
"""
import asyncio, json, os, re, subprocess, sys, tempfile, time

if os.environ.get("EDGE_TTS_CA"):  # hinter dem Cloud-Proxy dessen Zertifikat verwenden
    import certifi
    certifi.where = lambda: os.environ["EDGE_TTS_CA"]
import edge_tts

norm = lambda s: re.sub(r"[^\w]", "", s.lower())
tokens = lambda t: [w for w in t.split() if norm(w)]

async def speak(text, v, path):
    c = edge_tts.Communicate(text, v["voice"], rate=v.get("rate", "+0%"), pitch=v.get("pitch", "+0Hz"), boundary="WordBoundary")
    words = []
    with open(path, "wb") as f:
        async for ch in c.stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                words.append((ch["text"], ch["offset"] / 1e7, (ch["offset"] + ch["duration"]) / 1e7))
    return words

def speak_retry(text, v, path):
    for attempt in range(6):
        try:
            return asyncio.run(speak(text, v, path))
        except edge_tts.exceptions.NoAudioReceived:
            if attempt == 5:
                raise
            time.sleep(2 ** attempt)

def dur(f):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))

def map_words(words, spok, a, t0):
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
    return res

def main(cfg_path, out_mp3, out_json):
    cfg = json.load(open(cfg_path))
    gap = cfg.get("gap", 0.18)            # Pause zwischen Sprecherwechseln
    scene_pause = cfg.get("scenePause", 0.25)
    tmp = tempfile.mkdtemp()
    segs, scene_secs, starts, speakers, lines_out = [], [], [], [], []
    t = 0.0
    for si, sc in enumerate(cfg["scenes"]):
        s_start = t; ws_all, sp_all, ln = [], [], []
        for li, line in enumerate(sc["lines"]):
            disp, spok = tokens(line["display"]), tokens(line["spoken"])
            assert len(disp) == len(spok), f"Szene {si+1}, Zeile {li+1}: {len(disp)} vs {len(spok)} Wörter"
            v = cfg["voices"][line["who"]]
            raw = f"{tmp}/s{si}_{li}.mp3"
            words = speak_retry(line["spoken"], v, raw)
            a = max(0.0, words[0][1] - 0.04); b = words[-1][2] + 0.1
            last = li == len(sc["lines"]) - 1
            pad = scene_pause if last else line.get("pause", gap)
            seg = f"{tmp}/s{si}_{li}.wav"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af",
                            f"atrim={a}:{b},asetpts=N/SR/TB,apad=pad_dur={pad}", "-ar", "44100", "-ac", "1", seg], check=True)
            d = dur(seg)
            res = map_words(words, spok, a, t)
            for k in range(1, len(res)):
                res[k] = max(res[k], res[k - 1] + 0.05)
            ws_all += res; sp_all += [line["who"]] * len(res)
            ln.append({"who": line["who"], "start": round(t, 3), "end": round(t + d - pad, 3)})
            segs.append(seg); t += d
        scene_secs.append(round(t - s_start, 3)); starts.append(ws_all); speakers.append(sp_all); lines_out.append(ln)
    lst = f"{tmp}/list.txt"
    open(lst, "w").write("".join(f"file '{p}'\n" for p in segs))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst,
                    "-af", "loudnorm=I=-15:TP=-1.5", "-ar", "44100", "-b:a", "192k", out_mp3], check=True)
    json.dump({"sceneSeconds": scene_secs, "wordStarts": starts, "speakers": speakers, "lines": lines_out},
              open(out_json, "w"), indent=1, ensure_ascii=False)
    print(scene_secs, round(sum(scene_secs), 2))

if __name__ == "__main__":
    main(*sys.argv[1:4])
