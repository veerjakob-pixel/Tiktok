# Hinweise für alle Folgen (Werbelügen-Videos)

## Vorlage: Folge 6 ist der Standard für ALLE neuen Folgen
Jede neue Folge wird genauso gebaut wie Folge 6 (`Folge6Weihnachtsmann`, Ordner `src/folge6/`, `scripts/folge6/`):
- **Geschichte erzählen, kein Interview:** Lena macht den Hook (1–3 Sätze) und den Schluss (Trick + "Folg mir für
  mehr Werbelügen."). Florian erzählt dazwischen die Geschichte chronologisch mit Ort + Zeit
  ("Kleinasien, vor über 1600 Jahren.", "New York, im Jahr 1863."), kurze Sätze, Spannung, Wendepunkt.
  Keine Frage-Antwort-Ping-Pongs. Nur gesicherte Fakten, Legenden als "Der Legende nach" kennzeichnen.
- **Länge** ca. 35–45 s (Stimme ohne Pausen am Ende höchstens ~44 s; nach dem Erzeugen die Summe von
  `sceneSeconds` prüfen und bei Bedarf kürzen), 7 Szenen, alle ~2 s ein neues Bild.
  Dafür knapp erzählen: Hook 2 Sätze, pro Station der Geschichte 1–2 kurze Sätze, Schluss 3 Sätze. Jede Einstellung zeigt HANDLUNG (Figur läuft,
  etwas wird gezeichnet/gemalt, Dinge fliegen, Farbe kommt dazu), nicht nur Standbilder.
- **Hook:** ab Bild 0 harter Zoom + großer Bildschirm-Text mit der Frage. Der ERSTE gesprochene Satz ist eine
  steile, überraschende Behauptung (wie Folge 5: "Ein Mann hat Frauen zum Rauchen gebracht." oder
  "Coca-Cola hat den Weihnachtsmann nicht erfunden."), keine langsame Einleitung. Großer Stempel ("NEIN!",
  "MYTHOS?" o. ä.) nach ~2–5 s.
- **Mitte (ca. 47 % der Länge): Like + Folgen + Kommentieren** einblenden (`MidCta` in Folge6Weihnachtsmann.tsx:
  Herz "❤️ Like", Finger tippt auf "+ Folgen" -> "✓ Folge ich", Sprechblase "💬 Hättest du's gewusst?"),
  mit Klick-Tönen, im Bereich über den Untertiteln.
- **Look:** `CineStage` (Leuchten, Vignette, weiche Schatten, Handkamera), Figuren `Human` mit Atmen/Gesten,
  Spezialfiguren als eigene, sorgfältig gebaute Modelle (wie `SantaFigure`), Bokeh-Lichter, 3D-Schnee/Partikel,
  Nachtszenen wirklich dunkel (`env` klein), Wisch-Übergänge (`WhipIn`) statt weißem Blitz.
- **Ton:** eigene spannende Musik aus reinen Tönen (`make_sounds.py ... folge6` als Vorlage, Lautstärke 0.1),
  Riser-Ton ~1,2 s vor jeder Auflösung/jedem Stempel, Effekte wie in Folge 6.
- **Untertitel, Fortschrittsbalken, Serien-Label, Format 1080x1920** wie bisher; Story-Bild als Still
  (`Folge<N>Story`, gespeichert als `out/folge<N>-story.png`).
- **Ablauf:** Dialog schreiben -> Stimme erzeugen -> Rausch-Prüfung -> Aussprache-Prüfung (0 Abweichungen) ->
  Modelle mit `ModelCheck` prüfen -> Kontaktbogen aus jeder Einstellung prüfen und nachbessern -> rendern
  (`--gl=swangle`) -> Rausch-Prüfung + ffprobe + Bilder aus dem fertigen Video prüfen -> commit + push.

## TikTok-Statistik nutzen (Windsor-Tool, Konto "Psychologie der Werbung")
- Vor jeder neuen Folge die Zahlen ansehen: Connector `tiktok_organic`, Felder u. a. `video_views_count`,
  `video_average_time_watched`, `video_full_watched_rate`, `video_shares`, `video_view_retention_second/percentage`.
- Erkenntnisse (Stand 8.11.2026, Teil 1–6): In den ersten 3 s gehen die meisten weg. Bester Hook bisher Teil 5
  (50 % nach 3 s, Ø 11 s geschaut) – steile Behauptung sofort. Wer nach ~10 s noch da ist, bleibt meist bis zum
  Ende -> kurz halten (35–45 s). Erzählte Geschichte (Teil 6) wird am häufigsten geteilt.
- Beim Hochladen IMMER eine Beschreibung schreiben (Hook-Satz + Frage + 👇 + "Teil N der Werbelügen" + passende
  Hashtags) – Teil 6 ohne Beschreibung hatte die wenigsten Aufrufe.

## Ton: nie Rauschen
- Nach JEDEM Rendern mit Ton die Rausch-Prüfung laufen lassen:
  `python3 scripts/check_noise.py out/<video>.mp4`
  Ergebnis muss überall `OK` sein (Grenze -55 dB). Bei `RAUSCHEN` die Ursache finden und neu rendern,
  bevor das Video hochgeladen wird.
- Soundeffekte nur aus reinen Tönen bauen, kein Zufallsrauschen (`rng.standard_normal`) verwenden.
  Rauschfreie Effekte erzeugen: `python3 scripts/folge3/make_sounds.py public clean`
- Neue Tondateien (Musik, Effekte, Stimme) vor dem Einbauen ebenfalls mit `check_noise.py` prüfen.

## Stimme
- Florian (`de-DE-FlorianMultilingualNeural`) als Erzähler, Lena = Seraphina. Grundtempo Florian +16 %, Lena +14 %
  (wie Folge 6), pro Satz variieren: spannende/ruhige Sätze langsamer (+4 bis +10 %, Tonhöhe -2 bis -4 Hz),
  Aufzählungen schneller (+18 bis +22 %). `tail: 0.18` pro Zeile, damit Endlaute nicht abgeschnitten werden.
- "Haarvard" statt "Harvard" schreiben (sonst klingt es wie "Harz").
- Dialoge mit `scripts/make_dialog.py`, Erzähler allein mit `scripts/make_voice_florian.py`.
- edge-tts hinter dem Proxy: `EDGE_TTS_CA=/root/.ccr/ca-bundle.crt` setzen.
- Aussprache IMMER prüfen: `python3 scripts/check_speech.py public/<stimme>.mp3 scripts/<folge>/dialog.json`
  (Whisper schreibt ab, Ergebnis soll 0 Abweichungen sein). Schreibweisen vorher testen mit
  `python3 scripts/probe_speech.py <stimme> <tempo> "Variante 1" "Variante 2"`.
- Bekannte Ausspracheprobleme bei Florian: "Coca-Cola" -> im gesprochenen Text "Koka-Kola", "Cola" -> "Kola",
  "Nast" -> "Nahst", "Bart" -> "Bahrt"; Jahreszahl nicht allein an den Satzanfang ("New York, im Jahr ...").
- Erzählen statt Interview: Tempo/Tonhöhe pro Satz variieren (`rate`, `pitch`, `pause` in dialog.json).

## Rendern
- 3D (Three.js) hier ohne Grafikkarte: `--gl=swangle`. Eine Folge im Kino-Look (ca. 40 s) dauert ca. 25–30 Minuten.
- Nach dem Rendern mit `ffprobe` prüfen, dass eine Tonspur da ist (außer bei "ohne Ton"-Versionen).

## Bild-Qualität selbst kontrollieren
- Neue Figuren/Modelle zuerst mit der Prüf-Ansicht `ModelCheck` (src/folge6/Check.tsx) von vorne, schräg,
  seitlich und als Nahaufnahme rendern und anschauen, bevor sie ins Video kommen.
- Vor dem langen Rendern Vorschaubilder aus JEDER Einstellung anschauen (Kontaktbogen) und alles
  Merkwürdige (verformte Figuren, abgeschnittene Köpfe, zu hell/dunkel, verdeckte Gesichter) beheben.
- Kino-Look ab Folge 6: `CineStage` (src/folge6/Stage.tsx), Figuren `Human`, Weihnachtsmann `SantaFigure`.
