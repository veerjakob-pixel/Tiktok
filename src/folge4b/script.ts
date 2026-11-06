// Folge 4 als Story: echte Situation im Supermarkt -> Rückblick -> zurück.
import { FPS, SceneDef, TimedScene } from "../folge3/script";
import dialog from "../../scripts/folge4b/dialog.json";
import timing from "../../public/voiceover-folge4b-timing.json";

// Text jeder Szene = alle Zeilen hintereinander (für die Untertitel)
export const SCENES: SceneDef[] = dialog.scenes.map((sc, i) => ({
  id: ["supermarkt", "rueckblick", "geld", "bericht", "fettarm", "heute", "ende"][i],
  text: sc.lines.map((l) => l.display).join(" "),
  seconds: timing.sceneSeconds[i],
}));

export type Who = "ich" | "lena";
export const LINES = timing.lines as { who: Who; start: number; end: number }[][];
export const SPEAKERS = timing.speakers as Who[][];

// Spricht diese Person gerade? (Sekunden ab Videostart)
export const speakingAt = (who: Who, t: number) => LINES.some((sc) => sc.some((l) => l.who === who && t >= l.start && t <= l.end));

export type SfxType = "whoosh" | "boom" | "click" | "kaching" | "hit" | "rewind";
export type Sfx = { t: number; type: SfxType };
const clicks = (from: number, n: number, step: number): Sfx[] => Array.from({ length: n }, (_, i) => ({ t: from + i * step, type: "click" }));

// Sekunden ab Szenenstart
export const SFX: Sfx[][] = [
  [{ t: 0, type: "whoosh" }, { t: 6.92, type: "hit" }, { t: 6.95, type: "boom" }, { t: 9.48, type: "kaching" }, { t: 9.5, type: "boom" }],
  [{ t: 1.2, type: "rewind" }],
  [...clicks(0.05, 4, 0.1), { t: 3.64, type: "kaching" }, ...clicks(6.12, 9, 0.08)],
  [{ t: 3.6, type: "boom" }, { t: 7.22, type: "boom" }],
  [...clicks(3.28, 3, 0.12), ...clicks(5.3, 6, 0.1)],
  [{ t: 2.94, type: "boom" }],
  [{ t: 2.45, type: "click" }],
];

// Alle Zeitangaben in Scenes.tsx/SFX wurden zur ersten Aufnahme (diese Szenenlängen) gesetzt.
// K = neue Länge / alte Länge -> Schnitte und Effekte wandern mit, wenn die Stimme schneller/langsamer wird.
const PLANNED = [12.17, 7.807, 7.663, 8.137, 6.424, 7.812, 4.521];
export const K = timing.sceneSeconds.map((x, i) => x / PLANNED[i]);
export const TS = (i: number) => (s: number) => Math.round(s * FPS * K[i]);

// In welchen Szenen läuft Supermarkt-Atmo
export const AMBIENCE_SCENES = [0, 5, 6];

export const buildTimeline = (sceneSeconds: number[]): TimedScene[] => {
  let from = 0;
  return SCENES.map((s, i) => {
    const end = Math.round((from / FPS + sceneSeconds[i]) * FPS);
    const scene = { ...s, from, duration: end - from };
    from = end;
    return scene;
  });
};
