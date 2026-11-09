// Folge 9 "Black Friday – die erfundene Geschichte": Lena + Florian, Aufbau wie Folge 6–8.
import { FPS, SceneDef, TimedScene } from "../folge3/script";
import dialog from "../../scripts/folge9/dialog.json";
import timing from "../../public/voiceover-folge9-timing.json";

export const SCENES: SceneDef[] = dialog.scenes.map((sc, i) => ({
  id: ["hook", "philadelphia", "stau-polizei", "schwarze-zahlen", "schnaeppchen", "tipp", "trick"][i],
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
  // Hook: Glas splittert (Knall ab Bild 0), Wörter schlagen ein, 1) Name 2) Preis (Geld fliegt), zurückspulen
  [{ t: 0, type: "hit" }, { t: 0.02, type: "boom" }, { t: 1.16, type: "click" }, { t: 1.66, type: "click" }, { t: 0.99, type: "riser" }, { t: 2.19, type: "hit" }, { t: 2.21, type: "boom" }, { t: 2.9, type: "whoosh" }, { t: 3.3, type: "click" }, { t: 4.86, type: "kaching" }, { t: 4.88, type: "hit" }, { t: 5.6, type: "rewind" }],
  // Philadelphia 1950er, Thanksgiving vorbei, Stadt platzt
  [{ t: 0.05, type: "boom" }, { t: 2.2, type: "whoosh" }, { t: 2.29, type: "click" }, { t: 3.72, type: "hit" }],
  // Stau, Gedränge, Ladendiebe -> Polizei flucht: BLACK FRIDAY!
  [{ t: 0.04, type: "click" }, { t: 0.77, type: "click" }, { t: 1.46, type: "hit" }, { t: 2.4, type: "whoosh" }, { t: 2.53, type: "riser" }, { t: 3.73, type: "hit" }, { t: 3.75, type: "boom" }],
  // peinlich -> schwarze Zahlen, Gewinn
  [{ t: 0.17, type: "click" }, { t: 1.7, type: "whoosh" }, { t: 1.78, type: "click" }, { t: 3.14, type: "kaching" }, { t: 4.38, type: "kaching" }],
  // Schnäppchen? Preisverlauf, -50 %, 98 von 100, KEIN SCHNÄPPCHEN
  [{ t: 0.5, type: "click" }, { t: 1.35, type: "whoosh" }, { t: 2.0, type: "kaching" }, { t: 3.77, type: "hit" }, { t: 5.87, type: "riser" }, { t: 7.07, type: "hit" }, { t: 7.09, type: "boom" }],
  // Tipp: Preisverlauf checken, Haken, kaufen; DER TRICK?
  [{ t: 0.1, type: "whoosh" }, { t: 1.16, type: "kaching" }, { t: 2.04, type: "click" }, { t: 2.9, type: "whoosh" }, { t: 3.22, type: "hit" }, { t: 3.24, type: "boom" }],
  // schöner Name + rotes Schild = verkauft alles, Folgen
  [{ t: 0.69, type: "click" }, { t: 1.84, type: "click" }, { t: 2.67, type: "kaching" }, { t: 3.3, type: "whoosh" }, { t: 3.8, type: "click" }],
];

const PLANNED = [6.004, 4.959, 4.786, 5.17, 7.891, 4.009, 5.66];
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
