import React from "react";
import { AbsoluteFill, CalculateMetadataFunction, getStaticFiles, Html5Audio, Sequence, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { BASE_SECONDS, buildTimeline, FPS, timeWords } from "./script";
import { Flash, ProgressBar, Subtitles } from "./components/Overlays";
import { Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, Scene8 } from "./scenes/Scenes";
import { SceneProps } from "./scenes/helpers";

export type AppleADayProps = {
  voiceoverSeconds: number | null;
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
  const hasMusic = hasFile("music.mp3");
  // kleine Pause (0,4 s) am Ende, damit das letzte Wort nicht abgeschnitten wird
  const totalSeconds = voiceoverSeconds ? voiceoverSeconds + 0.4 : BASE_SECONDS;
  return {
    durationInFrames: Math.round(totalSeconds * FPS),
    props: { ...props, voiceoverSeconds: voiceoverSeconds ? totalSeconds : null, hasVoiceover, hasMusic },
  };
};

export const AppleADay: React.FC<AppleADayProps> = ({ voiceoverSeconds, hasVoiceover, hasMusic }) => {
  const timeline = React.useMemo(() => buildTimeline(voiceoverSeconds), [voiceoverSeconds]);
  const words = React.useMemo(() => timeline.flatMap((s) => timeWords(s)), [timeline]);

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
