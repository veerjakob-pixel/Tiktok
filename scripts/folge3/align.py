# Aufruf: python3 align.py <ausgabeordner-von-make_voice> public/voiceover-folge3-timing.json
import json, re, sys, subprocess, glob
import numpy as np
from faster_whisper import WhisperModel
G = sys.argv[1]; OUTJSON = sys.argv[2]
PARTS = [
 [("de","Eine einzige Firma hat entschieden, was dein Verlobungsring kosten soll. Und fast jeder hält sich bis heute dran.")],
 [("de","Früher waren Diamant-Verlobungsringe gar nicht so normal. Und in den neunzehnhundertdreißigern wollte in der Wirtschaftskrise kaum jemand Diamanten kaufen.")],
 [("de","Die Diamanten-Firma De Biers startete eine riesige Werbekampagne. Neunzehnhundertsiebenundvierzig kam der Slogan:"),("en","A diamond is forever."),("de","Ein Diamant ist für immer.")],
 [("de","Die Botschaft: Liebe ist für immer, also muss der Ring es auch sein. Und wer einen Diamanten wieder verkauft, verkauft seine Liebe.")],
 [("de","Sogar die Regel, wie viele Monatsgehälter ein Ring kosten soll, kam aus der Werbung. Der Trick: ein Gefühl verkaufen, nicht einen Stein.")],
 [("de","Folg mir für Teil vier: Wie die Zucker-Industrie Forscher bezahlt hat.")],
]
norm = lambda s: re.sub(r"[^\w]", "", s.lower())
def dur(f): return float(subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {f}", shell=True))
m = WhisperModel("small", device="cpu", compute_type="int8")
def words(f, lang, prompt):
  aud = np.frombuffer(subprocess.check_output(f"ffmpeg -v error -i {f} -f f32le -ac 1 -ar 16000 -", shell=True), np.float32)
  segs, _ = m.transcribe(aud, language=lang, word_timestamps=True, initial_prompt=prompt)
  return [w for s in segs for w in s.words]
secs, starts = [], []; off = 0.0
for si, parts in enumerate(PARTS):
  res = []; poff = off
  for pi, (lang, txt) in enumerate(parts):
    f = f"{G}/s{si}_{pi}.wav"
    ww = words(f, lang, txt)
    if sum(len(norm(w.word)) for w in ww) < 0.8 * len(norm(txt)): ww = words(f, lang, None)
    print(si, pi, " ".join(w.word.strip() for w in ww), file=sys.stderr)
    wchars = []; pos = 0
    for w in ww:
      n = max(1, len(norm({"1947":"neunzehnhundertsiebenundvierzig","1930ern":"neunzehnhundertdreißigern","4":"vier"}.get(norm(w.word), w.word)))); wchars.append((pos, pos+n, w.start, w.end)); pos += n
    toks = txt.split(); tt = sum(len(norm(t)) for t in toks); tp = 0
    for t in toks:
      target = tp / tt * pos
      for a, b, st, en in wchars:
        if a <= target < b:
          res.append(round(poff + st + (target-a)/(b-a)*(en-st), 3)); break
      tp += len(norm(t))
    poff += dur(f) + 0.30
  for k in range(1, len(res)): res[k] = max(res[k], res[k-1] + 0.05)
  d = dur(f"{G}/scene{si}.wav")
  starts.append(res); secs.append(round(d, 3)); off += d
json.dump({"sceneSeconds": secs, "wordStarts": starts}, open(OUTJSON, "w"), indent=1)
print(secs, sum(secs), [len(x) for x in starts])
