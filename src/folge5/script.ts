// Folge 5 "Fackeln der Freiheit": Dialog Lena (Frage) + Florian (Erklärung), 3D wie Folge 4 (Story).
import { FPS, SceneDef, TimedScene } from "../folge3/script";
import dialog from "../../scripts/folge5/dialog.json";
import timing from "../../public/voiceover-folge5-timing.json";

// Text jeder Szene = alle Zeilen hintereinander (für die Untertitel)
export const SCENES: SceneDef[] = dialog.scenes.map((sc, i) => ({
  id: ["hook", "damals", "frage1", "parade", "frage2", "zeitung", "trick"][i],
  text: sc.lines.map((l) => l.display).join(" "),
  seconds: timing.sceneSeconds[i],
}));

export type Who = "florian" | "lena";
export const LINES = timing.lines as { who: Who; start: number; end: number }[][];
export const SPEAKERS = timing.speakers as Who[][];

// Spricht diese Person gerade? (Sekunden ab Videostart)
export const speakingAt = (who: Who, t: number) => LINES.some((sc) => sc.some((l) => l.who === who && t >= l.start && t <= l.end));

export type SfxType = "whoosh" | "boom" | "click" | "kaching" | "hit" | "rewind";
export type Sfx = { t: number; type: SfxType };
const clicks = (from: number, n: number, step: number): Sfx[] => Array.from({ length: n }, (_, i) => ({ t: from + i * step, type: "click" }));

// Sekunden ab Szenenstart (passend zu den Schnitten in Scenes.tsx)
export const SFX: Sfx[][] = [
  // Hook: Zoom, Verwandlung Fackel -> Zigarette, Stempel WERBUNG knallt
  [{ t: 0, type: "whoosh" }, { t: 1.9, type: "whoosh" }, { t: 2.75, type: "hit" }, { t: 2.78, type: "boom" }, { t: 5.28, type: "click" }],
  // zurück in die 1920er, Kuchendiagramm: graue Hälfte fliegt raus
  [{ t: 0.9, type: "rewind" }, { t: 4.24, type: "click" }, { t: 5.95, type: "boom" }],
  [],
  // 1929 knallt rein, Parade, Kamerablitze, Stempel INSZENIERT
  [{ t: 0.05, type: "boom" }, { t: 3.18, type: "click" }, ...clicks(6.1, 3, 0.28), ...clicks(7.3, 4, 0.3), { t: 8.3, type: "hit" }, { t: 8.32, type: "boom" }],
  [],
  // Zeitungen fliegen rein, Geldsack, Stempel BEZAHLT
  [{ t: 0.1, type: "whoosh" }, { t: 0.5, type: "whoosh" }, { t: 0.9, type: "whoosh" }, { t: 4.08, type: "kaching" }, { t: 5.14, type: "hit" }, { t: 5.16, type: "boom" }],
  // Produkt durchgestrichen, IDEE, drei Wörter, Preisschilder, Folgen-Button
  [
    { t: 1.95, type: "hit" },
    { t: 3.43, type: "boom" },
    { t: 4.18, type: "click" },
    { t: 4.91, type: "click" },
    { t: 5.76, type: "click" },
    ...clicks(6.7, 3, 0.18),
    { t: 7.13, type: "kaching" },
    { t: 8.45, type: "whoosh" },
    { t: 9.0, type: "click" },
  ],
];

// Alle Zeitangaben in Scenes.tsx/SFX wurden zu dieser Aufnahme (diese Szenenlängen) gesetzt.
// K = neue Länge / alte Länge -> Schnitte und Effekte wandern mit, wenn die Stimme neu aufgenommen wird.
const PLANNED = [6.663, 7.499, 1.933, 9.3, 1.64, 7.421, 13.262];
export const K = timing.sceneSeconds.map((x, i) => x / PLANNED[i]);
export const TS = (i: number) => (s: number) => Math.round(s * FPS * K[i]);

export const buildTimeline = (sceneSeconds: number[]): TimedScene[] => {
  let from = 0;
  return SCENES.map((s, i) => {
    const end = Math.round((from / FPS + sceneSeconds[i]) * FPS);
    const scene = { ...s, from, duration: end - from };
    from = end;
    return scene;
  });
};
