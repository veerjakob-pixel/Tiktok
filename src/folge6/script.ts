// Folge 6 "Hat Coca-Cola den Weihnachtsmann erfunden?": Dialog Lena + Florian, 3D wie Folge 5.
import { FPS, SceneDef, TimedScene } from "../folge3/script";
import dialog from "../../scripts/folge6/dialog.json";
import timing from "../../public/voiceover-folge6-timing.json";

// Text jeder Szene = alle Zeilen hintereinander (für die Untertitel)
export const SCENES: SceneDef[] = dialog.scenes.map((sc, i) => ({
  id: ["hook", "nikolaus", "frage1", "nast", "frage2", "malerei", "trick"][i],
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
  // Hook: Zoom auf die Dose, Mütze fällt drauf, Farben, Stempel MYTHOS?
  [{ t: 0, type: "whoosh" }, { t: 0.9, type: "hit" }, { t: 2.74, type: "click" }, { t: 3.41, type: "click" }, { t: 7.28, type: "hit" }, { t: 7.3, type: "boom" }],
  // zurück ins Jahr ~300: Bischof Nikolaus, roter Mantel
  [{ t: 0.8, type: "rewind" }, { t: 6.54, type: "boom" }],
  [],
  // 1863 Thomas Nast, um 1900 rote Postkarten, Stempel VOR COCA-COLA
  [{ t: 0.05, type: "boom" }, { t: 1.6, type: "whoosh" }, ...clicks(4.6, 3, 0.25), { t: 7.39, type: "hit" }, { t: 7.41, type: "boom" }],
  [],
  // 1931, Gemälde, drei Merkmale, Kalender zählt bis 1964
  [{ t: 0.05, type: "boom" }, { t: 4.67, type: "click" }, { t: 5.34, type: "click" }, { t: 6.08, type: "kaching" }, ...clicks(7.32, 11, 0.1)],
  // nicht erfunden, Plakatwand voller Werbung, Stempel WERBUNG, Folgen-Button
  [{ t: 3.06, type: "hit" }, { t: 3.08, type: "boom" }, ...clicks(4.4, 6, 0.2), { t: 7.46, type: "hit" }, { t: 7.48, type: "boom" }, { t: 8.15, type: "whoosh" }, { t: 8.7, type: "click" }],
];

// Alle Zeitangaben in Scenes.tsx/SFX wurden zu dieser Aufnahme (diese Szenenlängen) gesetzt.
// K = neue Länge / alte Länge -> Schnitte und Effekte wandern mit, wenn die Stimme neu aufgenommen wird.
const PLANNED = [8.307, 7.613, 1.942, 8.143, 1.489, 8.962, 10.548];
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
