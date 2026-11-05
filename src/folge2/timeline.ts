// Zeitplan für Folge 2 – kommt direkt aus der Sprachaufnahme (timing.json,
// erzeugt von scripts/make-voiceover-folge2.py). Alle Szenen, Schnitte und
// Untertitel hängen an den echten Wortzeiten.
import timing from "./timing.json";

export const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

export type Word = { text: string; start: number; end: number }; // in Frames (absolut)

export type SceneT = {
  index: number;
  from: number;
  duration: number;
  words: Word[];
};

// kleine Pause am Ende, damit das letzte Wort nicht abgeschnitten wird
export const TOTAL_FRAMES = f(timing.total + 0.8);

const allWords: Word[][] = timing.scenes.map((s) =>
  s.words.map((w) => ({
    text: w.text.replace(/^'/, "„").replace(/'/, "“"),
    start: f(w.start),
    end: f(w.end),
  })),
);

// Schnitt kurz (0,2 s) bevor die nächste Szene zu sprechen beginnt
const sceneStarts = allWords.map((ws, i) => (i === 0 ? 0 : ws[0].start - 6));

export const SCENES: SceneT[] = allWords.map((words, i) => ({
  index: i,
  from: sceneStarts[i],
  duration: (sceneStarts[i + 1] ?? TOTAL_FRAMES) - sceneStarts[i],
  words,
}));

// Frame (relativ zum Szenenanfang), an dem Wort i gesprochen wird – minus kleiner Vorlauf
export const at = (scene: SceneT, wordIndex: number, lead = 3) =>
  Math.max(0, scene.words[wordIndex].start - scene.from - lead);

// ---------------- Untertitel-Gruppen ----------------
export type SubGroup = { words: Word[]; start: number; end: number };

const MAX_CHARS = 38; // passt in 2 Zeilen bei 64 px und 85 % Bildbreite
const MIN_FRAMES = FPS; // jede Gruppe mindestens 1 Sekunde sichtbar

const KEEP_TOGETHER = ["Edward Bernays", "Teil 3:"];

const len = (ws: Word[]) =>
  ws.reduce((s, w) => s + w.text.length, 0) + ws.length - 1;

// Teilt die Wörter einer Szene in Gruppen zu 3–5 Wörtern.
// Bevorzugt Schnitte nach Satzzeichen, damit jede Gruppe gut lesbar ist.
const splitScene = (words: Word[]): Word[][] => {
  const n = words.length;
  const best: number[] = Array(n + 1).fill(Infinity);
  const prev: number[] = Array(n + 1).fill(-1);
  best[0] = 0;
  for (let i = 0; i < n; i++) {
    if (best[i] === Infinity) continue;
    for (let size = 3; size <= 5 && i + size <= n; size++) {
      const g = words.slice(i, i + size);
      if (len(g) > MAX_CHARS) break;
      const last = g[g.length - 1].text;
      let cost = 10;
      if (i + size < n) {
        if (/[.?!]$/.test(last)) cost -= 6;
        else if (/[:,]$/.test(last)) cost -= 4;
        else cost += 4;
        // Namen und "Teil 3" nicht auseinanderreißen
        if (KEEP_TOGETHER.includes(`${last} ${words[i + size].text}`))
          cost += 20;
      }
      if (size === 4) cost -= 1;
      if (len(g) > 28) cost += 2;
      // Satzende mitten in der Gruppe vermeiden
      g.slice(0, -1).forEach((w) => {
        if (/[.?!]$/.test(w.text)) cost += 12;
        else if (/:$/.test(w.text)) cost += 3;
      });
      if (best[i] + cost < best[i + size]) {
        best[i + size] = best[i] + cost;
        prev[i + size] = i;
      }
    }
  }
  const groups: Word[][] = [];
  let k = n;
  while (k > 0) {
    groups.unshift(words.slice(prev[k], k));
    k = prev[k];
  }
  return groups;
};

const buildGroups = (): SubGroup[] => {
  const out: SubGroup[] = [];
  SCENES.forEach((scene, si) => {
    const groups = splitScene(scene.words);
    const nextSceneSpeech = SCENES[si + 1]?.words[0].start ?? TOTAL_FRAMES + 3;
    groups.forEach((g, gi) => {
      const start = g[0].start - 3;
      const nextStart =
        gi + 1 < groups.length
          ? groups[gi + 1][0].start - 3
          : Math.min(g[g.length - 1].end + 14, nextSceneSpeech - 3);
      out.push({ words: g, start, end: nextStart });
    });
  });
  // keine Überlappung + mindestens 1 Sekunde Sichtbarkeit
  for (let i = 0; i < out.length; i++) {
    if (i > 0) out[i].start = Math.max(out[i].start, out[i - 1].end);
    if (out[i].end - out[i].start < MIN_FRAMES)
      out[i].end = out[i].start + MIN_FRAMES;
  }
  return out;
};

export const SUB_GROUPS = buildGroups();
