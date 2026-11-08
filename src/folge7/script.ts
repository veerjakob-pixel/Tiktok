// Folge 7 "Wie Mundwasser-Werbung eine Krankheit erfand" (Listerine / Halitosis): Lena + Florian, Aufbau wie Folge 6.
import { FPS, SceneDef, TimedScene } from "../folge3/script";
import dialog from "../../scripts/folge7/dialog.json";
import timing from "../../public/voiceover-folge7-timing.json";

// Text jeder Szene = alle Zeilen hintereinander (für die Untertitel)
export const SCENES: SceneDef[] = dialog.scenes.map((sc, i) => ({
  id: ["hook", "labor", "fachwort", "hochzeit", "angst", "erfunden", "trick"][i],
  text: sc.lines.map((l) => l.display).join(" "),
  seconds: timing.sceneSeconds[i],
}));

export type Who = "florian" | "lena";
export const LINES = timing.lines as { who: Who; start: number; end: number }[][];
export const SPEAKERS = timing.speakers as Who[][];

// Spricht diese Person gerade? (Sekunden ab Videostart)
export const speakingAt = (who: Who, t: number) => LINES.some((sc) => sc.some((l) => l.who === who && t >= l.start && t <= l.end));

export type SfxType = "whoosh" | "boom" | "click" | "kaching" | "hit" | "rewind" | "riser";
export type Sfx = { t: number; type: SfxType };
const clicks = (from: number, n: number, step: number): Sfx[] => Array.from({ length: n }, (_, i) => ({ t: from + i * step, type: "click" }));

// Sekunden ab Szenenstart (passend zu den Schnitten in Scenes.tsx)
export const SFX: Sfx[][] = [
  // Hook: Lena zeigt auf dich ("Du stinkst aus dem Mund."), Mundwasser, Stempel WERBUNG, Millionen, zurückspulen
  [{ t: 0, type: "whoosh" }, { t: 0.05, type: "hit" }, { t: 0.24, type: "boom" }, { t: 2.1, type: "whoosh" }, { t: 3.36, type: "riser" }, { t: 4.56, type: "hit" }, { t: 4.58, type: "boom" }, { t: 5.51, type: "kaching" }, { t: 5.9, type: "rewind" }],
  // 1879: Labor, Arzt gießt, Flasche
  [{ t: 0.05, type: "boom" }, { t: 2.9, type: "whoosh" }, ...clicks(3.4, 4, 0.3), { t: 5.5, type: "whoosh" }, { t: 5.69, type: "kaching" }],
  // 1920er, Wörterbuch, HALITOSIS steigt auf
  [{ t: 0.05, type: "boom" }, { t: 2.9, type: "whoosh" }, ...clicks(3.1, 5, 0.12), { t: 4.53, type: "riser" }, { t: 5.73, type: "hit" }, { t: 5.75, type: "boom" }],
  // Hochzeit: Haken, Kreuz, grüne Wolke, alle drehen sich weg
  [{ t: 0, type: "whoosh" }, { t: 2.1, type: "whoosh" }, { t: 2.46, type: "click" }, { t: 2.8, type: "click" }, { t: 3.1, type: "click" }, { t: 3.59, type: "hit" }, { t: 4.3, type: "whoosh" }, { t: 5.41, type: "boom" }, { t: 6.24, type: "click" }],
  // Angst, Umsatz-Zähler, Flaschen stapeln sich
  [{ t: 0.04, type: "hit" }, { t: 1.6, type: "whoosh" }, ...clicks(3.38, 10, 0.16), { t: 4.96, type: "kaching" }],
  // kein Problem gelöst -> ERFUNDEN
  [{ t: 0, type: "whoosh" }, { t: 2.2, type: "riser" }, { t: 3.36, type: "hit" }, { t: 3.38, type: "boom" }],
  // ANGST -> PRODUKT, der Trick, Folgen
  [{ t: 0.04, type: "click" }, { t: 1.51, type: "click" }, { t: 2.27, type: "riser" }, { t: 3.47, type: "hit" }, { t: 3.49, type: "boom" }, { t: 4.1, type: "whoosh" }, { t: 4.7, type: "click" }],
];

// Alle Zeitangaben in Scenes.tsx/SFX wurden zu dieser Aufnahme (diese Szenenlängen) gesetzt.
// K = neue Länge / alte Länge -> Schnitte und Effekte wandern mit, wenn die Stimme neu aufgenommen wird.
const PLANNED = [6.931, 6.67, 6.84, 7.849, 5.677, 4.44, 6.396];
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
