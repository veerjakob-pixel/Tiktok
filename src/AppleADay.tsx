import React from "react";
import { AbsoluteFill, CalculateMetadataFunction, getStaticFiles, Html5Audio, Sequence, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { BASE_SECONDS, buildTimeline, FPS, timeWords } from "./script";
import { Flash, ProgressBar, Subtitles } from "./components/Overlays";
import { Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, Scene8 } from "./scenes/Scenes";
import { SceneProps } from "./scenes/helpers";

export type AppleADayProps = {
  voiceoverSeconds: number | null;
  sceneSeconds: number[] | null;
  wordStarts: number[][] | null;
  hasVoiceover: boolean;
  hasMusic: boolean;
};

const SCENE_COMPONENTS: React.FC<SceneProps>[] = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, Scene8];

const hasFile = (name: string) => getStaticFiles().some((f) => f.name === name);

// Prüft, ob voiceover.mp3 / music.mp3 da sind, und passt die Videolänge an die Aufnahme an.
export const calculateMetadata: CalculateMetadataFunction<AppleADayProps> = async ({ props }) => {
  let voiceoverSeconds: number | null = null;
  let hasVoiceover = false;
  if (hasFile("voiceover.mp3")) {
    try {
      voiceoverSeconds = await getAudioDurationInSeconds(staticFile("voiceover.mp3"));
      hasVoiceover = true;
    } catch {
      voiceoverSeconds = null;
    }
  }
  // Optional: genaue Szenenlängen passend zur Aufnahme
  let sceneSeconds: number[] | null = null;
  let wordStarts: number[][] | null = null;
  if (hasVoiceover && hasFile("voiceover-timing.json")) {
    try {
      const json = await fetch(staticFile("voiceover-timing.json")).then((r) => r.json());
      if (Array.isArray(json.sceneSeconds)) sceneSeconds = json.sceneSeconds;
      if (Array.isArray(json.wordStarts)) wordStarts = json.wordStarts;
    } catch {
      sceneSeconds = null;
    }
  }
  const hasMusic = hasFile("music.mp3");
  // kleine Pause (0,4 s) am Ende, damit das letzte Wort nicht abgeschnitten wird
  const totalSeconds = voiceoverSeconds ? voiceoverSeconds + 0.4 : BASE_SECONDS;
  if (sceneSeconds) {
    // Rest (Pause am Ende) der letzten Szene geben, damit kein schwarzes Bild bleibt
    const sum = sceneSeconds.reduce((a, b) => a + b, 0);
    sceneSeconds = sceneSeconds.map((x, i) => (i === sceneSeconds!.length - 1 ? x + Math.max(0, totalSeconds - sum) : x));
  }
  return {
    durationInFrames: Math.round(totalSeconds * FPS),
    props: { ...props, voiceoverSeconds: voiceoverSeconds ? totalSeconds : null, sceneSeconds, wordStarts, hasVoiceover, hasMusic },
  };
};

export const AppleADay: React.FC<AppleADayProps> = ({ voiceoverSeconds, sceneSeconds, wordStarts, hasVoiceover, hasMusic }) => {
  const timeline = React.useMemo(() => buildTimeline(voiceoverSeconds, sceneSeconds), [voiceoverSeconds, sceneSeconds]);
  const words = React.useMemo(
    () => timeline.flatMap((s, i) => timeWords(s, wordStarts?.[i])),
    [timeline, wordStarts],
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {timeline.map((scene, i) => {
        const Comp = SCENE_COMPONENTS[i];
        return (
          <Sequence key={scene.id} name={`Szene ${i + 1} – ${scene.id}`} from={scene.from} durationInFrames={scene.duration}>
            <Comp dur={scene.duration} />
            {i > 0 && <Flash />}
          </Sequence>
        );
      })}

      <Subtitles words={words} />
      <ProgressBar />

      {hasVoiceover && <Html5Audio src={staticFile("voiceover.mp3")} />}
      {hasMusic && <Html5Audio src={staticFile("music.mp3")} volume={0.15} loop />}
    </AbsoluteFill>
  );
};
