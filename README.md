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
