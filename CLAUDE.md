# Hinweise für alle Folgen (Werbelügen-Videos)

- **Videos OHNE Ton machen** (Wunsch vom Nutzer, ersetzt die alte Regel „immer mit Ton“):
  keine KI-Stimme, keine Musik, keine Soundeffekte. Die KI-Stimmen (Conrad, Florian, Killian) gefallen nicht.
  Rendern mit `--muted`, danach mit `ffprobe` prüfen, dass nur eine Videospur drin ist.
- Die Sprechtext-Datei und das Timing-Skript dürfen trotzdem benutzt werden, damit Untertitel und Schnitte
  ein natürliches Lesetempo haben (edge-tts dafür nur zum Messen der Wortzeiten, nicht hörbar im Video).
  Sprache in edge-tts auf `de-DE` stellen und jede Szene am Stück sprechen lassen (siehe `scripts/make-voiceover-folge2.py`).
- Liegt eine eigene Sprachaufnahme vom Nutzer in `public/`, darf die mit Ton benutzt werden – vorher fragen.
- edge-tts hinter dem Proxy: SSL-Kontext mit `/root/.ccr/ca-bundle.crt` setzen.
- Rendern mit `--browser-executable=/opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell`.
