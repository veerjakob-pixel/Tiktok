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
- Der Sprechtext steht in `voiceover-text.txt`.

## Aufbau

- `src/script.ts` – Text und Länge jeder Szene, Timing der Untertitel
- `src/scenes/Scenes.tsx` – die 8 Szenen
- `src/components/Graphics.tsx` – alle Grafiken als SVG (Apfel, Fass, Arzt, Bauer, Lupe, …)
- `src/components/Poster.tsx` – Werbeplakate im 1920er-Stil
- `src/components/Overlays.tsx` – Sepia/Filmkorn, Untertitel, Fortschrittsbalken
- `public/fonts/` – Schriften (Montserrat, Anton, Abril Fatface; Google Fonts, OFL), lokal, damit das Rendern auch offline klappt

---

# Folge 2 – „Frühstück ist die wichtigste Mahlzeit“ (Komposition `Folge2Fruehstueck`)

1080 × 1920, 30 fps, ca. 46 s (Länge kommt aus der Sprachaufnahme). Fertiges Video: `out/folge2-fruehstueck.mp4`.

```bash
python3 scripts/make-voiceover-folge2.py   # Stimme + Wortzeiten (edge-tts, de-DE-FlorianMultilingualNeural, normales Tempo)
python3 scripts/make-audio-folge2.py       # Musik + Soundeffekte per Code
npx remotion render Folge2Fruehstueck out/folge2-fruehstueck.mp4
ffprobe -v error -show_entries stream=codec_type out/folge2-fruehstueck.mp4   # muss "audio" zeigen
```

- `voiceover-folge2.txt` – Sprechtext. Eigene Aufnahme? Als `public/voiceover-folge2.mp3` ablegen – das Skript überschreibt sie nicht.
  (Dann aber auch `src/folge2/timing.json` anpassen, weil die Wortzeiten von edge-tts kommen.)
- `src/folge2/timing.json` – echte Wortzeiten der Aufnahme; Szenen, Schnitte und Untertitel hängen daran.
- `src/folge2/timeline.ts` – Szenen + Untertitel-Gruppen (3–5 Wörter, max. 2 Zeilen, mind. 1 s sichtbar)
- `src/folge2/Scenes2.tsx`, `Graphics2.tsx`, `Subtitles2.tsx` – Szenen, SVG-Grafiken, Untertitel
- `public/music-folge2.mp3` (Lautstärke 0.12), `public/sfx/` (Wusch, Knall, Klick) – alles per Code erzeugt
