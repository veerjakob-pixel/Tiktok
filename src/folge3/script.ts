// Folge 3 – Diamant: Text pro Szene, geplante Länge (= Länge in der Sprachaufnahme),
// Soundeffekte und Untertitel-Logik.

export const FPS = 30;

export type SceneDef = { id: string; text: string; seconds: number };

// seconds = Länge der Szene in public/voiceover-folge3.mp3
export const SCENES: SceneDef[] = [
  {
    id: "hook",
    text: "Eine einzige Firma hat entschieden, was dein Verlobungsring kosten soll. Und fast jeder hält sich bis heute dran.",
    seconds: 6.891,
  },
  {
    id: "krise",
    text: "Früher waren Diamant-Verlobungsringe gar nicht so normal. Und in den 1930ern wollte in der Wirtschaftskrise kaum jemand Diamanten kaufen.",
    seconds: 8.773,
  },
  {
    id: "debeers",
    text: "Die Diamanten-Firma De Beers startete eine riesige Werbekampagne. 1947 kam der Slogan: „A Diamond is Forever“ – ein Diamant ist für immer.",
    seconds: 10.483,
  },
  {
    id: "botschaft",
    text: "Die Botschaft: Liebe ist für immer, also muss der Ring es auch sein. Und wer einen Diamanten wieder verkauft, verkauft seine Liebe.",
    seconds: 8.088,
  },
  {
    id: "gefuehl",
    text: "Sogar die Regel, wie viele Monatsgehälter ein Ring kosten soll, kam aus der Werbung. Der Trick: ein Gefühl verkaufen, nicht einen Stein.",
    seconds: 8.962,
  },
  {
    id: "folgen",
    text: "Folg mir für Teil 4: Wie die Zucker-Industrie Forscher bezahlt hat.",
    seconds: 4.331,
  },
];

export const BASE_SECONDS = SCENES.reduce((s, x) => s + x.seconds, 0);

// Soundeffekte pro Szene (Sekunden ab Szenenstart, bezogen auf die geplante Länge)
export type Sfx = { t: number; type: "whoosh" | "boom" | "click" };
export const SFX: Sfx[][] = [
  [{ t: 0, type: "boom" }, { t: 0.3, type: "whoosh" }, { t: 2.5, type: "boom" }],
  [4.0, 4.12, 4.24].map((t) => ({ t, type: "click" as const })),
  // Jahreszähler 1938 -> 1947
  Array.from({ length: 10 }, (_, i) => ({ t: 4.25 + i * 0.09, type: "click" as const })),
  [],
  [
    ...[0.4, 1.0, 1.5].map((t) => ({ t, type: "click" as const })),
    { t: 4.3, type: "boom" as const },
  ],
  [{ t: 1.6, type: "click" }],
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

export type TimedWord = { text: string; start: number; who?: string };

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
const MAX_CHARS = 42; // passt in höchstens 2 Zeilen bei 64 px und 85 % Bildbreite
const MIN_FRAMES = FPS; // jeder Abschnitt mind. 1 Sekunde sichtbar

const chars = (ws: TimedWord[]) => ws.reduce((s, w) => s + w.text.length + 1, -1);

// Wörter zu ruhigen Abschnitten mit 3–5 Wörtern zusammenfassen:
// 1) in Sätze teilen, 2) sehr kurze Sätze mit dem nächsten verbinden,
// 3) jeden Satz gleichmäßig in Stücke mit 3–5 Wörtern teilen (am liebsten nach Komma/Doppelpunkt).
const SENTENCE_END = /[.!?“]$/;
const SOFT_BREAK = /[,:;]$/;

const splitSentence = (ws: TimedWord[]): TimedWord[][] => {
  const n = ws.length;
  if (n <= MAX_WORDS && chars(ws) <= MAX_CHARS) return [ws];
  // best[i] = günstigste Aufteilung der ersten i Wörter
  const best: { cost: number; prev: number }[] = Array.from({ length: n + 1 }, () => ({ cost: Infinity, prev: -1 }));
  best[0].cost = 0;
  for (let i = 0; i < n; i++) {
    if (best[i].cost === Infinity) continue;
    for (let len = 1; len <= MAX_WORDS && i + len <= n; len++) {
      const chunk = ws.slice(i, i + len);
      let cost = best[i].cost;
      if (len < MIN_WORDS) cost += 40; // zu kurz
      if (chars(chunk) > MAX_CHARS) cost += 100 * (chars(chunk) - MAX_CHARS); // passt nicht in 2 Zeilen
      const last = chunk[len - 1].text;
      if (i + len < n && !SOFT_BREAK.test(last)) cost += 6; // Trennung mitten im Satzteil
      cost += Math.abs(len - 4); // gleichmäßig, ca. 4 Wörter
      if (cost < best[i + len].cost) best[i + len] = { cost, prev: i };
    }
  }
  const out: TimedWord[][] = [];
  for (let i = n; i > 0; i = best[i].prev) out.unshift(ws.slice(best[i].prev, i));
  return out;
};

export const buildPages = (words: TimedWord[], sceneEnds: number[]): SubPage[] => {
  // 1) Sätze (enden auch an Szenengrenzen)
  const sentences: TimedWord[][] = [];
  let cur: TimedWord[] = [];
  words.forEach((w, i) => {
    cur.push(w);
    const next = words[i + 1];
    const sceneEnd = !next || sceneEnds.some((e) => w.start < e && next.start >= e) || next.who !== w.who;
    if (SENTENCE_END.test(w.text) || sceneEnd) {
      sentences.push(cur);
      cur = [];
    }
  });
  if (cur.length) sentences.push(cur);
  // 2) Mini-Sätze (1–2 Wörter) mit dem Nachbarn derselben Szene verbinden, wenn es passt
  const sceneOf = (w: TimedWord) => sceneEnds.findIndex((e) => w.start < e);
  for (let i = 0; i < sentences.length; i++) {
    const s = sentences[i];
    if (s.length >= MIN_WORDS) continue;
    const nxt = sentences[i + 1];
    const prv = sentences[i - 1];
    if (nxt && sceneOf(nxt[0]) === sceneOf(s[0]) && nxt[0].who === s[0].who && s.length + nxt.length <= MAX_WORDS && chars([...s, ...nxt]) <= MAX_CHARS) {
      sentences.splice(i, 2, [...s, ...nxt]);
    } else if (prv && sceneOf(prv[0]) === sceneOf(s[0]) && prv[0].who === s[0].who && s.length + prv.length <= MAX_WORDS && chars([...prv, ...s]) <= MAX_CHARS) {
      sentences.splice(i - 1, 2, [...prv, ...s]);
      i--;
    }
  }
  // 3) Sätze aufteilen
  const groups: TimedWord[][] = sentences.flatMap(splitSentence);

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
