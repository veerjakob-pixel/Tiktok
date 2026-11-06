# Hinweise für alle Folgen (Werbelügen-Videos)

## Ton: nie Rauschen
- Nach JEDEM Rendern mit Ton die Rausch-Prüfung laufen lassen:
  `python3 scripts/check_noise.py out/<video>.mp4`
  Ergebnis muss überall `OK` sein (Grenze -55 dB). Bei `RAUSCHEN` die Ursache finden und neu rendern,
  bevor das Video hochgeladen wird.
- Soundeffekte nur aus reinen Tönen bauen, kein Zufallsrauschen (`rng.standard_normal`) verwenden.
  Rauschfreie Effekte erzeugen: `python3 scripts/folge3/make_sounds.py public clean`
- Neue Tondateien (Musik, Effekte, Stimme) vor dem Einbauen ebenfalls mit `check_noise.py` prüfen.

## Stimme
- Florian (`de-DE-FlorianMultilingualNeural`) als Erzähler, Lena = Seraphina. Tempo Florian +13 %, Lena +11 %.
- "Haarvard" statt "Harvard" schreiben (sonst klingt es wie "Harz").
- Dialoge mit `scripts/make_dialog.py`, Erzähler allein mit `scripts/make_voice_florian.py`.
- edge-tts hinter dem Proxy: `EDGE_TTS_CA=/root/.ccr/ca-bundle.crt` setzen.

## Rendern
- 3D (Three.js) hier ohne Grafikkarte: `--gl=swangle`. Story-Version dauert ca. 25 Minuten.
- Nach dem Rendern mit `ffprobe` prüfen, dass eine Tonspur da ist (außer bei "ohne Ton"-Versionen).
