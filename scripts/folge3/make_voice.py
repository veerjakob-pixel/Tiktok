# Aufruf: python3 make_voice.py <ordner-mit-piper-modellen> <ausgabeordner>
# Modelle: de_DE-thorsten-high.onnx und en_US-ryan-high.onnx (huggingface.co/rhasspy/piper-voices)
# Erzeugt die Sprachaufnahme Szene für Szene (Piper Thorsten + Ryan für Englisch),
# etwas tiefer und langsamer. Gibt Szenenlängen aus.
import subprocess, json, sys, os
V = sys.argv[1]; OUT = sys.argv[2]
DE = f"{V}/de_DE-thorsten-high.onnx"; EN = f"{V}/en_US-ryan-high.onnx"
# (Sprache, Text) je Teil; Teile einer Szene werden direkt aneinandergehängt
SCENES = [
  [("de", "Eine einzige Firma hat entschieden, was dein Verlobungsring kosten soll. Und fast jeder hält sich bis heute dran.")],
  [("de", "Früher waren Diamant-Verlobungsringe gar nicht so normal. Und in den neunzehnhundertdreißigern wollte in der Wirtschaftskrise kaum jemand Diamanten kaufen.")],
  [("de", "Die Diamanten-Firma De Biers startete eine riesige Werbekampagne. Neunzehnhundertsiebenundvierzig kam der Slogan:"),
   ("en", "A diamond is forever."),
   ("de", "Ein Diamant ist für immer.")],
  [("de", "Die Botschaft: Liebe ist für immer, also muss der Ring es auch sein. Und wer einen Diamanten wieder verkauft, verkauft seine Liebe.")],
  [("de", "Sogar die Regel, wie viele Monatsgehälter ein Ring kosten soll, kam aus der Werbung. Der Trick: ein Gefühl verkaufen, nicht einen Stein.")],
  [("de", "Folg mir für Teil vier: Wie die Zucker-Industrie Forscher bezahlt hat.")],
]
PITCH = 0.95  # <1 = tiefer (und dadurch auch etwas langsamer)
def sh(c): subprocess.run(c, shell=True, check=True, stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)
def dur(f): return float(subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {f}", shell=True))
os.makedirs(OUT, exist_ok=True)
parts = []; secs = []
for si, sc in enumerate(SCENES):
  files = []
  for pi, (lang, txt) in enumerate(sc):
    raw = f"{OUT}/s{si}_{pi}_raw.wav"; f = f"{OUT}/s{si}_{pi}.wav"
    model = DE if lang == "de" else EN
    ls = 0.97 if lang == "de" else 1.15
    subprocess.run(["piper", "-m", model, "--length-scale", str(ls), "--sentence-silence", "0.18", "-f", raw], input=txt.encode(), check=True, stderr=subprocess.DEVNULL)
    # Stille an Anfang/Ende weg, tiefer pitchen, 44.1 kHz mono
    sh(f"ffmpeg -y -i {raw} -af \"silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,asetrate=22050*{PITCH},aresample=44100,lowshelf=g=2:f=180\" -ar 44100 -ac 1 {f}")
    files.append(f)
  # Pause zwischen Teilen 0.3 s, am Szenenende 0.35 s
  lst = f"{OUT}/s{si}.txt"
  with open(lst, "w") as fh:
    for i, f in enumerate(files):
      fh.write(f"file '{f}'\n")
      fh.write(f"file '{OUT}/sil{'30' if i < len(files)-1 else '35'}.wav'\n")
  for n in ("30", "35"):
    sh(f"ffmpeg -y -f lavfi -i anullsrc=r=44100:cl=mono -t 0.{n} {OUT}/sil{n}.wav")
  sf = f"{OUT}/scene{si}.wav"
  sh(f"ffmpeg -y -f concat -safe 0 -i {lst} -c pcm_s16le {sf}")
  parts.append(sf); secs.append(round(dur(sf), 3))
with open(f"{OUT}/all.txt", "w") as fh:
  for p in parts: fh.write(f"file '{p}'\n")
sh(f"ffmpeg -y -f concat -safe 0 -i {OUT}/all.txt -af loudnorm=I=-16:TP=-1.5 -ar 44100 {OUT}/voice.wav")
print(json.dumps(secs), sum(secs))
