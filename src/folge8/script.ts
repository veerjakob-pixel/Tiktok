// Folge 8 "Die Kaffeepause ist Werbung": Lena + Florian, Aufbau wie Folge 6/7.
import { FPS, SceneDef, TimedScene } from "../folge3/script";
import dialog from "../../scripts/folge8/dialog.json";
import timing from "../../public/voiceover-folge8-timing.json";

export const SCENES: SceneDef[] = dialog.scenes.map((sc, i) => ({
  id: ["hook", "fabrik-1902", "kaffee-teuer", "kampagne-1952", "ueberall", "erholung", "trick"][i],
  text: sc.lines.map((l) => l.display).join(" "),
  seconds: timing.sceneSeconds[i],
}));

export type Who = "florian" | "lena";
export const LINES = timing.lines as { who: Who; start: number; end: number }[][];
export const SPEAKERS = timing.speakers as Who[][];

export const speakingAt = (who: Who, t: number) => LINES.some((sc) => sc.some((l) => l.who === who && t >= l.start && t <= l.end));

export type SfxType = "whoosh" | "boom" | "click" | "kaching" | "hit" | "rewind" | "riser";
export type Sfx = { t: number; type: SfxType };
const clicks = (from: number, n: number, step: number): Sfx[] => Array.from({ length: n }, (_, i) => ({ t: from + i * step, type: "click" }));

// Sekunden ab Szenenstart (passend zu den Schnitten in Scenes.tsx)
export const SFX: Sfx[][] = [
  // Hook: Zoom auf die Tasse, Stempel WERBUNG!, Lena, zurückspulen
  [{ t: 0, type: "whoosh" }, { t: 0.1, type: "hit" }, { t: 0.73, type: "riser" }, { t: 1.93, type: "hit" }, { t: 1.95, type: "boom" }, { t: 2.7, type: "whoosh" }, { t: 5.55, type: "rewind" }],
  // Buffalo 1902: Fabrik, Pfiff, Pause
  [{ t: 0.05, type: "boom" }, { t: 2.4, type: "whoosh" }, { t: 4.99, type: "kaching" }],
  // Kaffee wird teuer, Säcke im Lager
  [{ t: 0.05, type: "whoosh" }, ...clicks(0.6, 8, 0.17), { t: 2.0, type: "hit" }, { t: 2.65, type: "whoosh" }],
  // New York 1952, Kampagne, Plakat
  [{ t: 0.05, type: "boom" }, { t: 2.7, type: "whoosh" }, { t: 5.7, type: "whoosh" }, { t: 5.54, type: "riser" }, { t: 6.74, type: "hit" }, { t: 6.76, type: "boom" }],
  // Radio, Zeitung, Plakat -> Büro
  [{ t: 0.21, type: "click" }, { t: 1.0, type: "click" }, { t: 1.81, type: "click" }, { t: 2.6, type: "whoosh" }, { t: 3.42, type: "kaching" }],
  // Lena: Erholung? -> mehr Kaffee verkauft
  [{ t: 1.67, type: "click" }, { t: 2.55, type: "whoosh" }, { t: 3.11, type: "riser" }, { t: 4.31, type: "hit" }, { t: 4.33, type: "kaching" }],
  // Gewohnheit + Name = Verkauf, der Trick, Folgen
  [{ t: 0.59, type: "click" }, { t: 1.51, type: "click" }, { t: 2.46, type: "kaching" }, { t: 3.45, type: "riser" }, { t: 4.65, type: "hit" }, { t: 4.67, type: "boom" }, { t: 5.3, type: "whoosh" }, { t: 5.8, type: "click" }],
];

const PLANNED = [6.219, 6.241, 5.116, 8.525, 5.291, 5.204, 7.558];
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
