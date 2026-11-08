// Folge 8 "Marlboro: von der Frauen-Zigarette zum Cowboy": Lena + Florian, Aufbau wie Folge 6/7.
import { FPS, SceneDef, TimedScene } from "../folge3/script";
import dialog from "../../scripts/folge8/dialog.json";
import timing from "../../public/voiceover-folge8-timing.json";

export const SCENES: SceneDef[] = dialog.scenes.map((sc, i) => ({
  id: ["hook", "1924", "mundstueck", "cowboy-idee", "freiheit", "krebs", "trick"][i],
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
  // Hook: Zoom auf die Schachtel, Stempel FÜR FRAUEN?, Lena, zurückspulen
  [{ t: 0, type: "whoosh" }, { t: 0.1, type: "hit" }, { t: 1.15, type: "riser" }, { t: 2.35, type: "hit" }, { t: 2.37, type: "boom" }, { t: 2.9, type: "whoosh" }, { t: 4.45, type: "rewind" }],
  // 1924: Straße, Schachtel, Plakat
  [{ t: 0.05, type: "boom" }, { t: 2.8, type: "whoosh" }, { t: 3.89, type: "kaching" }, { t: 5.1, type: "whoosh" }, ...clicks(6.02, 4, 0.17)],
  // rotes Mundstück, Lippenstift
  [{ t: 0.05, type: "whoosh" }, { t: 1.4, type: "click" }, { t: 2.5, type: "whoosh" }, { t: 3.27, type: "click" }, { t: 4.05, type: "hit" }],
  // Chicago 1954, Büro, Skizze, COWBOY
  [{ t: 0.05, type: "boom" }, { t: 2.6, type: "whoosh" }, { t: 4.44, type: "click" }, { t: 5.5, type: "whoosh" }, { t: 5.6, type: "riser" }, { t: 6.8, type: "hit" }, { t: 6.82, type: "boom" }],
  // harte Männer, Pferde, Freiheit -> Nr. 1 der Welt
  [{ t: 0.04, type: "hit" }, { t: 0.97, type: "click" }, { t: 1.62, type: "click" }, { t: 2.5, type: "whoosh" }, ...clicks(2.96, 8, 0.16), { t: 4.55, type: "kaching" }],
  // Lungenkrebs (leise), Lena
  [{ t: 0, type: "whoosh" }, { t: 2.54, type: "boom" }, { t: 3.5, type: "whoosh" }, { t: 5.11, type: "click" }],
  // Gefühl: Freiheit, der Trick, Folgen
  [{ t: 0.04, type: "click" }, { t: 1.57, type: "click" }, { t: 2.5, type: "riser" }, { t: 3.7, type: "hit" }, { t: 3.72, type: "boom" }, { t: 4.4, type: "whoosh" }, { t: 4.9, type: "click" }],
];

// Alle Zeitangaben in Scenes.tsx/SFX wurden zu dieser Aufnahme (diese Szenenlängen) gesetzt.
const PLANNED = [5.067, 7.198, 4.789, 7.758, 6.477, 6.176, 6.642];
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
