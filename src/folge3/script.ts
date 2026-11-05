// Folge 3 – Diamant: Text pro Szene, geplante Länge (= Länge in der Sprachaufnahme),
// Soundeffekte und Untertitel-Logik.

export const FPS = 30;

export type SceneDef = { id: string; text: string; seconds: number };

// seconds = Länge der Szene in public/voiceover-folge3.mp3
export const SCENES: SceneDef[] = [
  {
    id: "hook",
    text: "Eine einzige Firma hat entschieden, was dein Verlobungsring kosten soll. Und fast jeder hält sich bis heute dran.",
    seconds: 6.801,
  },
  {
    id: "krise",
    text: "Früher waren Diamant-Verlobungsringe gar nicht so normal. Und in den 1930ern wollte in der Wirtschaftskrise kaum jemand Diamanten kaufen.",
    seconds: 8.468,
  },
  {
    id: "debeers",
    text: "Die Diamanten-Firma De Beers startete eine riesige Werbekampagne. 1947 kam der Slogan: „A Diamond is Forever“ – ein Diamant ist für immer.",
    seconds: 10.468,
  },
  {
    id: "botschaft",
    text: "Die Botschaft: Liebe ist für immer, also muss der Ring es auch sein. Und wer einen Diamanten wieder verkauft, verkauft seine Liebe.",
    seconds: 7.316,
  },
  {
    id: "gefuehl",
    text: "Sogar die Regel, wie viele Monatsgehälter ein Ring kosten soll, kam aus der Werbung. Der Trick: ein Gefühl verkaufen, nicht einen Stein.",
    seconds: 7.911,
  },
  {
    id: "folgen",
    text: "Folg mir für Teil 4: Wie die Zucker-Industrie Forscher bezahlt hat.",
    seconds: 4.029,
  },
];

export const BASE_SECONDS = SCENES.reduce((s, x) => s + x.seconds, 0);

// Soundeffekte pro Szene (Sekunden ab Szenenstart, bezogen auf die geplante Länge)
export type Sfx = { t: number; type: "whoosh" | "boom" | "click" };
export const SFX: Sfx[][] = [
  [{ t: 0, type: "boom" }, { t: 0.3, type: "whoosh" }, { t: 2.5, type: "boom" }],
  [3.5, 3.62, 3.74].map((t) => ({ t, type: "click" as const })),
  // Jahreszähler 1938 -> 1947
  Array.from({ length: 10 }, (_, i) => ({ t: 4.0 + i * 0.09, type: "click" as const })),
  [],
  [
    ...[0.35, 0.85, 1.35].map((t) => ({ t, type: "click" as const })),
    { t: 3.96, type: "boom" as const },
  ],
  [{ t: 1.3, type: "click" }],
];

export type TimedScene = SceneDef & { from: number; duration: number };

// Szenen in Frames. sceneSeconds = genaue Längen aus der Timing-Datei,
// sonst wird alles gleichmäßig auf totalSeconds gestreckt.
export const buildTimeline = (totalSeconds: number | null, sceneSeconds: number[] | null): TimedScene[] => {
  const exact = sceneSeconds && sceneSeconds.length === SCENES.length;
  const factor = totalSeconds && !exact ? totalSeconds / BASE_SECONDS : 1;
  let from = 0;
  return SCENES.map((s, i) => {
    const secs = exact ? sceneSeconds[i] : s.seconds * factor;
    const end = Math.round((from / FPS + secs) * FPS);
    const scene = { ...s, from, duration: end - from };
    from = end;
    return scene;
  });
};

export type TimedWord = { text: string; start: number };

const isOnlyPunctuation = (w: string) => !/[\p{L}\p{N}]/u.test(w);

export const sceneWords = (scene: SceneDef) => scene.text.split(/\s+/).filter((w) => w && !isOnlyPunctuation(w));

// Startframe jedes Worts: aus der Sprachaufnahme (falls da), sonst nach Wortlänge verteilt.
export const timeWords = (scene: TimedScene, exactStarts?: number[] | null): TimedWord[] => {
  const words = sceneWords(scene);
  if (exactStarts && exactStarts.length === words.length) {
    return words.map((text, i) => ({
      text,
      start: Math.min(scene.from + scene.duration - 1, Math.max(scene.from, Math.round(exactStarts[i] * FPS))),
    }));
  }
  const weights = words.map((w) => 2 + w.length + (/[.:!?]$/.test(w) ? 4 : /,$/.test(w) ? 2 : 0));
  const total = weights.reduce((a, b) => a + b, 0);
  let t = scene.from + 2;
  return words.map((text, i) => {
    const word = { text, start: Math.round(t) };
    t += (weights[i] / total) * (scene.duration - 4);
    return word;
  });
};

export type SubPage = { words: TimedWord[]; start: number; end: number };

const MAX_WORDS = 5;
const MIN_WORDS = 3;
const MAX_CHARS = 34; // passt in höchstens 2 Zeilen bei 64 px und 85 % Bildbreite
const MIN_FRAMES = FPS; // jeder Abschnitt mind. 1 Sekunde sichtbar

const chars = (ws: TimedWord[]) => ws.reduce((s, w) => s + w.text.length + 1, -1);

// Wörter zu ruhigen Abschnitten mit 3–5 Wörtern zusammenfassen.
export const buildPages = (words: TimedWord[], sceneEnds: number[]): SubPage[] => {
  const groups: TimedWord[][] = [];
  let cur: TimedWord[] = [];
  const isSceneEnd = (w: TimedWord, next?: TimedWord) => !next || sceneEnds.some((e) => w.start < e && next.start >= e);
  words.forEach((w, i) => {
    const next = words[i + 1];
    // passt das nächste Wort nicht mehr rein -> vorher umbrechen
    if (cur.length >= MIN_WORDS && chars([...cur, w]) > MAX_CHARS) {
      groups.push(cur);
      cur = [];
    }
    cur.push(w);
    const sentenceEnd = /[.:!?“]$/.test(w.text);
    const restInSentence = (() => {
      let n = 0;
      for (let k = i + 1; k < words.length; k++) {
        n++;
        if (/[.:!?“]$/.test(words[k].text)) break;
      }
      return n;
    })();
    const done =
      isSceneEnd(w, next) ||
      cur.length >= MAX_WORDS ||
      (cur.length >= MIN_WORDS && sentenceEnd) ||
      // Satz nicht so teilen, dass am Ende nur 1–2 Wörter übrig bleiben
      (cur.length >= MIN_WORDS && /,$/.test(w.text) && restInSentence >= MIN_WORDS);
    if (done) {
      groups.push(cur);
      cur = [];
    }
  });
  if (cur.length) groups.push(cur);

  // Zu kurze Abschnitte (< 1 s) mit dem nächsten zusammenlegen, wenn es noch passt
  const startOf = (g: TimedWord[]) => g[0].start;
  for (let i = 0; i < groups.length - 1; i++) {
    const len = startOf(groups[i + 1]) - startOf(groups[i]);
    const merged = [...groups[i], ...groups[i + 1]];
    if (len < MIN_FRAMES && merged.length <= MAX_WORDS && chars(merged) <= MAX_CHARS) {
      groups.splice(i, 2, merged);
      i--;
    }
  }

  // Startzeiten: jeder Abschnitt bleibt mindestens 1 Sekunde stehen
  const lastEnd = sceneEnds[sceneEnds.length - 1];
  const starts: number[] = [];
  groups.forEach((g, i) => starts.push(i === 0 ? startOf(g) : Math.max(startOf(g), starts[i - 1] + MIN_FRAMES)));
  return groups.map((g, i) => ({
    words: g,
    start: starts[i],
    end: i + 1 < groups.length ? starts[i + 1] : Math.max(lastEnd, starts[i] + MIN_FRAMES),
  }));
};
