// Folge 9 "Black Friday – die erfundene Geschichte": Lena + Florian, Aufbau wie Folge 6–8.
import { FPS, SceneDef, TimedScene } from "../folge3/script";
import dialog from "../../scripts/folge9/dialog.json";
import timing from "../../public/voiceover-folge9-timing.json";

export const SCENES: SceneDef[] = dialog.scenes.map((sc, i) => ({
  id: ["hook", "philadelphia", "stau-polizei", "big-friday-1961", "schwarze-zahlen", "erst-spaeter", "trick"][i],
  text: sc.lines.map((l) => l.display).join(" "),
  seconds: timing.sceneSeconds[i],
}));

export type Who = "florian" | "lena";
export const LINES = timing.lines as { who: Who; start: number; end: number }[][];
export const SPEAKERS = timing.speakers as Who[][];

export const speakingAt = (who: Who, t: number) => LINES.some((sc) => sc.some((l) => l.who === who && t >= l.start && t <= l.end));

export type SfxType = "whoosh" | "boom" | "click" | "kaching" | "hit" | "rewind" | "riser";
export type Sfx = { t: number; type: SfxType };

// Sekunden ab Szenenstart (passend zu den Schnitten in Scenes.tsx und den Wortzeiten der Stimme)
export const SFX: Sfx[][] = [
  // Hook: STOPP! (Knall ab Bild 0), Tüten knallen hin, Wörter schlagen ein, GESCHÖNT!, Lena, zurückspulen
  [{ t: 0, type: "hit" }, { t: 0.02, type: "boom" }, { t: 0.85, type: "whoosh" }, { t: 0.95, type: "boom" }, { t: 1.09, type: "click" }, { t: 1.85, type: "click" }, { t: 1.47, type: "riser" }, { t: 2.67, type: "hit" }, { t: 2.69, type: "boom" }, { t: 3.55, type: "whoosh" }, { t: 6.0, type: "rewind" }],
  // Philadelphia 1950er, Menschenmassen
  [{ t: 0.05, type: "boom" }, { t: 2.6, type: "whoosh" }, { t: 4.1, type: "click" }],
  // Stau, Polizist, BLACK FRIDAY
  [{ t: 0.04, type: "click" }, { t: 0.85, type: "click" }, { t: 1.88, type: "hit" }, { t: 2.85, type: "whoosh" }, { t: 3.22, type: "riser" }, { t: 4.42, type: "hit" }, { t: 4.44, type: "boom" }],
  // Händler hassen den Namen, 1961 BIG FRIDAY, Flop
  [{ t: 0.16, type: "click" }, { t: 1.7, type: "whoosh" }, { t: 2.17, type: "click" }, { t: 3.87, type: "riser" }, { t: 5.07, type: "hit" }, { t: 5.09, type: "boom" }],
  // 1981: neue Geschichte, rote -> schwarze Zahlen
  [{ t: 0.05, type: "boom" }, { t: 2.85, type: "whoosh" }, { t: 4.67, type: "click" }, { t: 5.3, type: "kaching" }],
  // Lena: Klingt logisch? Erst viel später
  [{ t: 0.45, type: "click" }, { t: 1.8, type: "whoosh" }, { t: 2.27, type: "riser" }, { t: 3.47, type: "hit" }, { t: 3.49, type: "boom" }],
  // Formel, der Trick, Folgen
  [{ t: 0.77, type: "click" }, { t: 2.98, type: "click" }, { t: 3.75, type: "kaching" }, { t: 4.33, type: "riser" }, { t: 5.53, type: "hit" }, { t: 5.55, type: "boom" }, { t: 6.25, type: "whoosh" }, { t: 6.75, type: "click" }],
];

const PLANNED = [6.641, 5.909, 5.452, 6.442, 6.539, 4.95, 8.49];
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
