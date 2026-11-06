# AppleADay – TikTok-Video mit Remotion

Hochformat-Video (1080 × 1920, 30 fps, ca. 43 s) darüber, wie „An apple a day keeps the doctor away“ als Werbung bekannt wurde.

## Vorschau starten

```bash
npm install
npm run dev
```

Dann im Browser die Komposition **AppleADay** öffnen.

## Video rendern

```bash
npx remotion render AppleADay out/apple-a-day.mp4
```

## Ton

- `public/voiceover.mp3` – deine Sprachaufnahme (optional). Ist sie da, wird das ganze Video
  (alle Szenen + Untertitel) automatisch auf ihre Länge gestreckt oder gestaucht.
- `public/music.mp3` – Hintergrundmusik (optional), Lautstärke 0.15, läuft in Schleife.
- `public/voiceover-timing.json` – genaue Länge jeder Szene und Startzeit jedes Worts in der Aufnahme
  (optional). Ist sie da, passen Szenen und Untertitel genau zur Stimme. Wenn du eine **eigene**
  Aufnahme nimmst, lösch diese Datei – dann wird das Video nur gleichmäßig an die Länge angepasst.
- Der Sprechtext steht in `voiceover-text.txt`.
- Die aktuelle Stimme ist eine KI-Stimme (Piper): der englische Spruch mit „Ryan“ (Englisch), der Rest mit „Thorsten“ (Deutsch), beide etwas tiefer gepitcht.

## Aufbau

- `src/script.ts` – Text und Länge jeder Szene, Timing der Untertitel
- `src/scenes/Scenes.tsx` – die 8 Szenen
- `src/components/Graphics.tsx` – alle Grafiken als SVG (Apfel, Fass, Arzt, Bauer, Lupe, …)
- `src/components/Poster.tsx` – Werbeplakate im 1920er-Stil
- `src/components/Overlays.tsx` – Sepia/Filmkorn, Untertitel, Fortschrittsbalken
- `public/fonts/` – Schriften (Montserrat, Anton, Abril Fatface; Google Fonts, OFL), lokal, damit das Rendern auch offline klappt

---

# Folge3Diamant – „Werbelügen #3“: Der Diamant-Trick

Hochformat (1080 × 1920, 30 fps, ca. 48 s) darüber, wie De Beers mit „A Diamond is Forever“ den Verlobungsring erfunden hat.

```bash
npx remotion render Folge3Diamant out/folge3-diamant.mp4
ffprobe -v error -show_entries stream=codec_type -of csv out/folge3-diamant.mp4   # muss "audio" zeigen
```

- Fertiges Video: `out/folge3-diamant.mp4`
- Sprechtext: `voiceover-folge3.txt`
- `public/voiceover-folge3.mp3` – Sprachaufnahme (**Pflicht**: ohne sie bricht das Rendern ab, es gibt nie ein Video ohne Ton).
  Eigene Aufnahme? Einfach unter diesem Namen speichern und `public/voiceover-folge3-timing.json` löschen.
- `public/voiceover-folge3-timing.json` – Länge jeder Szene + Startzeit jedes Worts (per Whisper gemessen)
- `public/music-folge3.mp3` – ruhige Hintergrundmusik (per Code erzeugt), Lautstärke 0.12
- `public/sfx-*.mp3` – Wusch, Knall, Klick (per Code erzeugt)
- Stimme: „Florian“ (Microsoft de-DE-FlorianMultilingualNeural über edge-tts), Tempo -5 %, Tonhöhe -6 Hz → ruhig und leicht tief.
  Neu erzeugen: `EDGE_TTS_CA=/root/.ccr/ca-bundle.crt python3 scripts/folge3/make_voice.py x tmp/` (CA nur hinter dem Cloud-Proxy nötig)
- Skripte zum Neu-Erzeugen: `scripts/folge3/` (`make_voice.py`, `align.py`, `make_sounds.py`)
- Code: `src/Folge3Diamant.tsx`, `src/folge3/` (Szenen, Grafiken, Untertitel)

---

# Folge4Zucker – „Werbelügen #4“: Die Zucker-Lüge

Hochformat (1080 × 1920, 30 fps, ca. 52 s): Wie die Zucker-Industrie 1965 Harvard-Forscher bezahlt hat, damit Fett als Hauptschuldiger dasteht.

```bash
# höchste Qualität (PNG-Einzelbilder, CRF 16, Ton 320 kbit/s)
npx remotion render Folge4Zucker out/folge4-zucker.mp4 --image-format=png --crf=16 --x264-preset=slow --audio-bitrate=320k --color-space=bt709
ffprobe -v error -show_entries stream=codec_type -of csv out/folge4-zucker.mp4   # muss "audio" zeigen
```

- Sprechtext + Quellen: `voiceover-folge4.txt`, Text für die Stimme: `scripts/folge4/text.json`
- Stimme Florian + Wortzeiten in einem Schritt:
  `EDGE_TTS_CA=/root/.ccr/ca-bundle.crt python3 scripts/make_voice_florian.py scripts/folge4/text.json public/voiceover-folge4.mp3 public/voiceover-folge4-timing.json`
- Musik + neue Effekte (Ka-Ching, Bass-Hit): `python3 scripts/folge3/make_sounds.py public folge4`
- Code: `src/Folge4Zucker.tsx`, `src/folge4/` (Szenen, Grafiken, Skript)
