// Folge 4 – Zucker: Text pro Szene (wie Untertitel), Länge in der Sprachaufnahme, Soundeffekte.
import { FPS, SceneDef, TimedScene } from "../folge3/script";

export const SCENES: SceneDef[] = [
  {
    id: "hook",
    text: "Die Zucker-Industrie hat Harvard-Forscher bezahlt. Damit du Fett hasst, und nicht Zucker. Und fast 50 Jahre lang hat's keiner gemerkt.",
    seconds: 8.835,
  },
  {
    id: "verdacht",
    text: "In den 1960ern kam ein Verdacht auf: Macht Zucker das Herz krank? Für die Zucker-Industrie ein Albtraum.",
    seconds: 7.698,
  },
  {
    id: "geld",
    text: "1965 zahlte ein Zucker-Verband drei Harvard-Forschern Geld für einen Bericht. Heute wären das rund 50.000 Dollar.",
    seconds: 8.485,
  },
  {
    id: "bericht",
    text: "Der Bericht erschien 1967 in einer Top-Fachzeitschrift. Ergebnis: Fett ist schuld, Zucker kaum. Wer bezahlt hat, stand nirgends.",
    seconds: 10.298,
  },
  {
    id: "fettarm",
    text: "Jahrzehntelang galt Fett als Feind. Überall hieß es „fettarm“ – und oft steckte dafür mehr Zucker drin.",
    seconds: 6.86,
  },
  {
    id: "enthuellt",
    text: "Rausgekommen ist das erst 2016 – durch alte Briefe aus einem Archiv.",
    seconds: 5.335,
  },
  {
    id: "folgen",
    text: "Folg mir für mehr Werbelügen. Hättest du das gedacht?",
    seconds: 3.998,
  },
];

export const BASE_SECONDS = SCENES.reduce((s, x) => s + x.seconds, 0);

export type SfxType = "whoosh" | "boom" | "click" | "kaching" | "hit";
export type Sfx = { t: number; type: SfxType };

const clicks = (from: number, n: number, step: number): Sfx[] => Array.from({ length: n }, (_, i) => ({ t: from + i * step, type: "click" }));

// Sekunden ab Szenenstart (bezogen auf die Länge in der Aufnahme)
export const SFX: Sfx[][] = [
  [
    { t: 0, type: "hit" },
    { t: 0, type: "boom" },
    { t: 1.05, type: "whoosh" },
    { t: 2.09, type: "kaching" },
    { t: 2.12, type: "boom" },
    { t: 2.95, type: "whoosh" },
    { t: 4.9, type: "click" },
    { t: 5.6, type: "whoosh" },
    ...clicks(6.2, 12, 0.07),
  ],
  [{ t: 5.0, type: "boom" }],
  [...clicks(0.05, 4, 0.1), { t: 3.99, type: "kaching" }, ...clicks(6.7, 9, 0.08)],
  [{ t: 5.45, type: "boom" }, { t: 9.2, type: "boom" }],
  [...clicks(3.49, 3, 0.12), ...clicks(5.5, 6, 0.1)],
  [{ t: 1.36, type: "boom" }],
  [{ t: 0, type: "click" }],
];

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
