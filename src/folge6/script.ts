// Folge 6 "Hat Coca-Cola den Weihnachtsmann erfunden?": Dialog Lena + Florian, 3D wie Folge 5.
import { FPS, SceneDef, TimedScene } from "../folge3/script";
import dialog from "../../scripts/folge6/dialog.json";
import timing from "../../public/voiceover-folge6-timing.json";

// Text jeder Szene = alle Zeilen hintereinander (für die Untertitel)
export const SCENES: SceneDef[] = dialog.scenes.map((sc, i) => ({
  id: ["hook", "legende", "nast", "postkarten", "problem", "maler", "trick"][i],
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
  // Hook: Zoom auf Weihnachtsmann + Dose, Stempel NEIN, Kamera steigt, zurückspulen
  [{ t: 0, type: "whoosh" }, { t: 0.1, type: "hit" }, { t: 0.75, type: "riser" }, { t: 1.95, type: "hit" }, { t: 1.97, type: "boom" }, { t: 2.9, type: "rewind" }],
  // Legende: Bischof schleicht, Gold fliegt durchs Fenster, Name, roter Mantel
  [{ t: 1.0, type: "whoosh" }, { t: 2.12, type: "kaching" }, { t: 3.4, type: "whoosh" }, { t: 4.48, type: "boom" }, { t: 5.25, type: "riser" }, { t: 6.44, type: "boom" }],
  // 1863: Jahreszahl, Zeichnung entsteht (Feder kratzt), Bauch + Bart
  [{ t: 1.22, type: "boom" }, { t: 2.8, type: "whoosh" }, ...clicks(3.3, 8, 0.3), { t: 4.92, type: "hit" }, { t: 5.89, type: "hit" }],
  // Postkarten fliegen rein, werden rot, Stempel VOR COCA-COLA
  [{ t: 0.1, type: "whoosh" }, { t: 0.35, type: "whoosh" }, { t: 0.6, type: "whoosh" }, { t: 2.1, type: "riser" }, { t: 3.28, type: "hit" }, { t: 3.3, type: "boom" }],
  // 1931, Winter, Umsatz-Balken fallen
  [{ t: 0.04, type: "boom" }, { t: 1.3, type: "whoosh" }, ...clicks(3.25, 10, 0.12), { t: 4.86, type: "hit" }],
  // Maler malt, Weihnachtsmann lacht, Cola, Kalender bis 1964
  [{ t: 0, type: "whoosh" }, ...clicks(0.4, 4, 0.45), { t: 2.4, type: "whoosh" }, { t: 2.85, type: "click" }, { t: 3.49, type: "click" }, { t: 4.18, type: "kaching" }, ...clicks(5.35, 11, 0.09)],
  // Plakatwand, Marke?, der Trick, Folgen
  [...clicks(0.3, 8, 0.2), { t: 1.74, type: "riser" }, { t: 2.94, type: "hit" }, { t: 2.96, type: "boom" }, { t: 3.7, type: "riser" }, { t: 4.9, type: "hit" }, { t: 4.92, type: "boom" }, { t: 5.5, type: "whoosh" }, { t: 6.1, type: "click" }],
];

// Alle Zeitangaben in Scenes.tsx/SFX wurden zu dieser Aufnahme (diese Szenenlängen) gesetzt.
// K = neue Länge / alte Länge -> Schnitte und Effekte wandern mit, wenn die Stimme neu aufgenommen wird.
const PLANNED = [5.666, 7.242, 6.614, 4.06, 5.74, 6.925, 7.868];
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
