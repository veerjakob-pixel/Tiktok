# Hinweise für alle Folgen (Werbelügen-Videos)

- **Stimme immer:** edge-tts mit `de-DE-FlorianMultilingualNeural`, normales Tempo (`+0%`) und normale Tonhöhe (`+0Hz`).
  Nicht künstlich langsamer/schneller oder tiefer machen – das klingt nervig und nach KI.
  Liegt eine eigene Aufnahme in `public/`, hat die Vorrang.
- Video muss immer Ton haben; vor dem Hochladen mit `ffprobe` prüfen, dass die MP4 eine Tonspur hat.
- edge-tts hinter dem Proxy: SSL-Kontext mit `/root/.ccr/ca-bundle.crt` setzen (siehe `scripts/make-voiceover-folge2.py`).
- Rendern mit `--browser-executable=/opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell`.
