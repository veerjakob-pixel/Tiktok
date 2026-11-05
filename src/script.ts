// Das komplette Skript: Text pro Szene + geplante Länge in Sekunden.
// Wenn public/voiceover.mp3 existiert, werden alle Längen so gestreckt/gestaucht,
// dass das Video genau so lang ist wie die Aufnahme.

export type SceneDef = {
  id: string;
  text: string;
  seconds: number;
};

export const SCENES: SceneDef[] = [
  {
    id: "hook",
    text: "„An apple a day keeps the doctor away“ – dieser Spruch ist eigentlich Werbung.",
    seconds: 3,
  },
  {
    id: "cider",
    text: "Früher hat in Amerika kaum jemand Äpfel gegessen. Die meisten waren sauer – man hat sie getrunken. Als Cidre, also Apfelwein.",
    seconds: 6,
  },
  {
    id: "prohibition",
    text: "Dann wurde Alkohol immer mehr bekämpft – und 1920 kam die Prohibition. Alkohol komplett verboten.",
    seconds: 6,
  },
  {
    id: "farmers",
    text: "Das Problem für die Apfelbauern: Ihr wichtigstes Produkt war plötzlich illegal.",
    seconds: 5,
  },
  {
    id: "campaign",
    text: "Also hat die Apfel-Branche umgedacht: Der Apfel sollte nicht mehr Alkohol sein, sondern Gesundheit. Und dafür haben sie einen alten Spruch groß rausgebracht: An apple a day keeps the doctor away.",
    seconds: 10,
  },
  {
    id: "worked",
    text: "Und es hat funktioniert. Heute denkt jeder bei Äpfeln an Gesundheit – nicht an Schnaps.",
    seconds: 6,
  },
  {
    id: "twist",
    text: "Übrigens: Eine Studie von 2015 hat's getestet. Apfel-Esser gehen nicht seltener zum Arzt.",
    seconds: 4,
  },
  {
    id: "follow",
    text: "Folg mir für mehr Werbelügen, die du jeden Tag glaubst.",
    seconds: 3,
  },
];

export const FPS = 30;
export const BASE_SECONDS = SCENES.reduce((s, x) => s + x.seconds, 0);

export type TimedScene = SceneDef & { from: number; duration: number };

// Rechnet die Szenen in Frames um.
// sceneSeconds = genaue Länge jeder Szene aus public/voiceover-timing.json (falls vorhanden),
// sonst totalSeconds = Länge der Sprachaufnahme (alle Szenen werden gleichmäßig gestreckt), sonst Standard.
export const buildTimeline = (totalSeconds: number | null, sceneSeconds: number[] | null = null): TimedScene[] => {
  const useExact = sceneSeconds && sceneSeconds.length === SCENES.length;
  const factor = totalSeconds && !useExact ? totalSeconds / BASE_SECONDS : 1;
  let from = 0;
  return SCENES.map((s, i) => {
    const secs = useExact ? sceneSeconds[i] : s.seconds * factor;
    // Szenengrenzen auf ganze Frames runden, ohne dass sich Fehler aufaddieren
    const end = Math.round((from / FPS + secs) * FPS);
    const scene = { ...s, from, duration: end - from };
    from = end;
    return scene;
  });
};

export type TimedWord = { text: string; start: number; end: number };

const isOnlyPunctuation = (w: string) => !/[\p{L}\p{N}]/u.test(w);

// Verteilt die Wörter einer Szene über die Szenenlänge.
// Lange Wörter bekommen mehr Zeit, nach Satzzeichen gibt's eine kleine Pause.
export const timeWords = (scene: TimedScene, exactStarts?: number[] | null): TimedWord[] => {
  const raw = scene.text.split(/\s+/).filter(Boolean);
  const words: { text: string; weight: number }[] = [];
  for (const w of raw) {
    if (isOnlyPunctuation(w)) {
      if (words.length) words[words.length - 1].weight += 3; // Pause bei "–"
      continue;
    }
    let weight = 2 + w.replace(/[^\p{L}\p{N}]/gu, "").length;
    if (/[.:!?]$/.test(w)) weight += 4;
    else if (/[,]$/.test(w)) weight += 2;
    words.push({ text: w, weight });
  }
  // Echte Wortzeiten aus der Sprachaufnahme (Sekunden ab Videostart), falls vorhanden
  if (exactStarts && exactStarts.length === words.length) {
    const sceneEnd = scene.from + scene.duration;
    return words.map((w, i) => {
      const start = Math.min(sceneEnd - 1, Math.max(scene.from, Math.round(exactStarts[i] * FPS)));
      const next = i + 1 < words.length ? Math.round(exactStarts[i + 1] * FPS) : sceneEnd;
      return { text: w.text, start, end: Math.max(start + 1, Math.min(next, sceneEnd)) };
    });
  }
  const lead = 3; // Frames Vorlauf
  const usable = scene.duration - lead - 2;
  const total = words.reduce((s, w) => s + w.weight, 0);
  let t = scene.from + lead;
  return words.map((w) => {
    const len = (w.weight / total) * usable;
    const word = { text: w.text, start: Math.round(t), end: Math.round(t + len) };
    t += len;
    return word;
  });
};

// Gruppiert Wörter zu kleinen "Seiten" (max. 4 Wörter), wie bei CapCut.
export const pageWords = (words: TimedWord[]): TimedWord[][] => {
  const pages: TimedWord[][] = [];
  let current: TimedWord[] = [];
  for (const w of words) {
    current.push(w);
    const chars = current.reduce((s, x) => s + x.text.length, 0);
    if (current.length >= 4 || chars > 22 || /[.:!?“]$/.test(w.text)) {
      pages.push(current);
      current = [];
    }
  }
  if (current.length) pages.push(current);
  return pages;
};
