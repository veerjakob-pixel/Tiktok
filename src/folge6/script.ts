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
  // Hook: Zoom auf Weihnachtsmann + Dose, Lena läuft, Stempel MYTHOS?, Zurückspulen
  [{ t: 0, type: "whoosh" }, { t: 0.1, type: "hit" }, { t: 1.4, type: "whoosh" }, { t: 4.64, type: "riser" }, { t: 5.84, type: "hit" }, { t: 5.86, type: "boom" }, { t: 6.9, type: "rewind" }],
  // Legende: Nacht, Bischof schleicht, Gold fliegt durchs Fenster, Name, roter Mantel
  [{ t: 3.0, type: "whoosh" }, { t: 5.06, type: "kaching" }, { t: 7.4, type: "whoosh" }, { t: 8.42, type: "boom" }, { t: 9.5, type: "riser" }, { t: 10.7, type: "boom" }],
  // 1863: Jahreszahl, Zeichnung entsteht (Feder kratzt), drei Merkmale
  [{ t: 1.22, type: "boom" }, { t: 2.9, type: "whoosh" }, ...clicks(4.7, 9, 0.3), { t: 5.16, type: "hit" }, { t: 6.24, type: "hit" }, { t: 7.21, type: "hit" }],
  // Postkarten fliegen rein, werden rot, Stempel VOR COCA-COLA
  [{ t: 0.15, type: "whoosh" }, { t: 0.45, type: "whoosh" }, { t: 0.75, type: "whoosh" }, { t: 3.41, type: "click" }, { t: 3.55, type: "riser" }, { t: 4.75, type: "hit" }, { t: 4.77, type: "boom" }],
  // 1931, Winter, Umsatz-Balken fallen
  [{ t: 0.04, type: "boom" }, { t: 1.4, type: "whoosh" }, ...clicks(3.31, 12, 0.12), { t: 5.26, type: "hit" }],
  // Maler malt, Weihnachtsmann lacht, Cola, Kalender bis 1964
  [{ t: 0, type: "whoosh" }, ...clicks(0.6, 6, 0.45), { t: 3.3, type: "whoosh" }, { t: 3.99, type: "click" }, { t: 4.65, type: "click" }, { t: 5.37, type: "kaching" }, ...clicks(6.6, 11, 0.1)],
  // nicht erfunden, Plakatwand, Stempel WERBUNG, Folgen
  [{ t: 0.8, type: "riser" }, { t: 1.98, type: "hit" }, { t: 2.0, type: "boom" }, ...clicks(3.3, 8, 0.2), { t: 6.75, type: "riser" }, { t: 7.95, type: "hit" }, { t: 7.97, type: "boom" }, { t: 8.6, type: "whoosh" }, { t: 9.2, type: "click" }],
];

// Alle Zeitangaben in Scenes.tsx/SFX wurden zu dieser Aufnahme (diese Szenenlängen) gesetzt.
// K = neue Länge / alte Länge -> Schnitte und Effekte wandern mit, wenn die Stimme neu aufgenommen wird.
const PLANNED = [9.582, 11.86, 7.997, 5.879, 6.068, 8.214, 10.984];
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
