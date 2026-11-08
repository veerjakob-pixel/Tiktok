import React from "react";
import { AbsoluteFill, CalculateMetadataFunction, getStaticFiles, Html5Audio, Sequence, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { buildPages, FPS, timeWords } from "./folge3/script";
import { CalmSubtitles, ProgressBar, SeriesLabel, SpeakerTag } from "./folge3/Overlays";
import { Flash } from "./components/Overlays";
import { buildTimeline, K, SCENES, SFX, SPEAKERS } from "./folge6/script";
import { Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, SceneProps } from "./folge6/Scenes";
import timing from "../public/voiceover-folge6-timing.json";

// Folge 6 "Hat Coca-Cola den Weihnachtsmann erfunden?": Dialog Lena + Florian, 3D wie Folge 5.
export type Folge6Props = { total: number };

const VOICE = "voiceover-folge6.mp3";
const MUSIC = "music-folge4.mp3"; // gleiche Musik + Lautstärke wie Folge 4
const hasFile = (name: string) => getStaticFiles().some((f) => f.name === name);

// Das Video muss IMMER Ton haben: ohne Sprachaufnahme bricht das Rendern ab.
export const calculateMetadata: CalculateMetadataFunction<Folge6Props> = async ({ props }) => {
  if (!hasFile(VOICE)) throw new Error(`public/${VOICE} fehlt – Folge6Weihnachtsmann wird nie ohne Ton gerendert.`);
  const voiceSeconds = await getAudioDurationInSeconds(staticFile(VOICE));
  const total = voiceSeconds + 0.5;
  return { durationInFrames: Math.round(total * FPS), props: { ...props, total } };
};

const SCENE_COMPONENTS: React.FC<SceneProps>[] = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7];
const SFX_FILE = {
  whoosh: "sfx-whoosh.mp3",
  boom: "sfx-boom.mp3",
  click: "sfx-click.mp3",
  kaching: "sfx-kaching.mp3",
  hit: "sfx-hit.mp3",
  rewind: "sfx-rewind.mp3",
} as const;
const SFX_VOL = { whoosh: 0.35, boom: 0.45, click: 0.35, kaching: 0.4, hit: 0.6, rewind: 0.5 } as const;

const TAGS: Record<string, SpeakerTag> = {
  lena: { label: "Lena", color: "#E76F51", highlight: "#FFC9B3" },
  florian: { color: "#264653", highlight: "#FFE680" },
};

export const Folge6Weihnachtsmann: React.FC<Folge6Props> = ({ total }) => {
  const timeline = React.useMemo(() => {
    const secs = [...timing.sceneSeconds];
    const sum = secs.reduce((a, b) => a + b, 0);
    secs[secs.length - 1] += Math.max(0, total - sum); // Rest ans Ende
    return buildTimeline(secs);
  }, [total]);
  const pages = React.useMemo(() => {
    const words = timeline.flatMap((s, i) => timeWords(s, timing.wordStarts[i]).map((w, k) => ({ ...w, who: SPEAKERS[i][k] })));
    return buildPages(
      words,
      timeline.map((s) => s.from + s.duration),
    );
  }, [timeline]);
  const totalFrames = timeline[timeline.length - 1].from + timeline[timeline.length - 1].duration;

  const effects = React.useMemo(() => {
    const list: { at: number; type: keyof typeof SFX_FILE }[] = [];
    timeline.forEach((s, i) => {
      if (i > 0) list.push({ at: Math.max(0, s.from - 4), type: "whoosh" });
      SFX[i].forEach((e) => list.push({ at: s.from + Math.round(e.t * FPS * K[i]), type: e.type }));
    });
    return list;
  }, [timeline]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {timeline.map((scene, i) => {
        const Comp = SCENE_COMPONENTS[i];
        return (
          <Sequence key={scene.id} name={`Szene ${i + 1} – ${scene.id}`} from={scene.from} durationInFrames={scene.duration}>
            <Comp dur={scene.duration} from={scene.from} />
            {i > 0 && <Flash />}
          </Sequence>
        );
      })}

      <CalmSubtitles pages={pages} speakers={TAGS} />
      <ProgressBar total={totalFrames} color="#FF5D73" />
      <SeriesLabel text="Werbelügen #6" />

      <Html5Audio src={staticFile(VOICE)} />
      {hasFile(MUSIC) && <Html5Audio src={staticFile(MUSIC)} volume={0.1} loop />}
      {effects.map((e, i) => (
        <Sequence key={i} from={e.at} durationInFrames={45} name={`SFX ${e.type}`} layout="none">
          <Html5Audio src={staticFile(SFX_FILE[e.type])} volume={SFX_VOL[e.type]} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const SCENE_COUNT = SCENES.length;
