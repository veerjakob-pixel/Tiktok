import React from "react";
import { AbsoluteFill, CalculateMetadataFunction, getStaticFiles, Html5Audio, Sequence, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { buildPages, FPS, timeWords } from "./folge3/script";
import { BASE_SECONDS, buildTimeline, SFX } from "./folge4/script";
import { CalmSubtitles, ProgressBar, SeriesLabel } from "./folge3/Overlays";
import { Flash } from "./components/Overlays";
import { Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, SceneProps } from "./folge4/Scenes";
import * as S3D from "./folge4-3d/Scenes3D";

export type Folge4Props = {
  voiceoverSeconds: number | null;
  sceneSeconds: number[] | null;
  wordStarts: number[][] | null;
  // "3d" = Three.js-Version (Folge4Zucker3D)
  variant?: "2d" | "3d";
};

const VOICE = "voiceover-folge4.mp3";
const TIMING = "voiceover-folge4-timing.json";
const MUSIC = "music-folge4.mp3";

const SCENES_2D: React.FC<SceneProps>[] = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7];
const SCENES_3D: React.FC<SceneProps>[] = [S3D.Scene1, S3D.Scene2, S3D.Scene3, S3D.Scene4, S3D.Scene5, S3D.Scene6, S3D.Scene7];
const hasFile = (name: string) => getStaticFiles().some((f) => f.name === name);

// Das Video muss IMMER Ton haben: ohne Sprachaufnahme bricht das Rendern ab.
export const calculateMetadata: CalculateMetadataFunction<Folge4Props> = async ({ props }) => {
  if (!hasFile(VOICE)) {
    throw new Error(`public/${VOICE} fehlt – Folge4Zucker wird nie ohne Ton gerendert.`);
  }
  const voiceSeconds = await getAudioDurationInSeconds(staticFile(VOICE));
  let sceneSeconds: number[] | null = null;
  let wordStarts: number[][] | null = null;
  if (hasFile(TIMING)) {
    const json = await fetch(staticFile(TIMING)).then((r) => r.json());
    if (Array.isArray(json.sceneSeconds)) sceneSeconds = json.sceneSeconds;
    if (Array.isArray(json.wordStarts)) wordStarts = json.wordStarts;
  }
  // 0,4 s Pause am Ende, damit das letzte Wort nicht abgeschnitten wird
  const total = voiceSeconds + 0.4;
  if (sceneSeconds) {
    const sum = sceneSeconds.reduce((a, b) => a + b, 0);
    sceneSeconds = sceneSeconds.map((x, i) => (i === sceneSeconds!.length - 1 ? x + Math.max(0, total - sum) : x));
  }
  return {
    durationInFrames: Math.round(total * FPS),
    props: { ...props, voiceoverSeconds: total, sceneSeconds, wordStarts },
  };
};

const SFX_FILE = { whoosh: "sfx-whoosh.mp3", boom: "sfx-boom.mp3", click: "sfx-click.mp3", kaching: "sfx-kaching.mp3", hit: "sfx-hit.mp3" } as const;
const SFX_VOL = { whoosh: 0.35, boom: 0.5, click: 0.35, kaching: 0.4, hit: 0.7 } as const;

export const Folge4Zucker: React.FC<Folge4Props> = ({ voiceoverSeconds, sceneSeconds, wordStarts, variant = "2d" }) => {
  const SCENE_COMPONENTS = variant === "3d" ? SCENES_3D : SCENES_2D;
  const timeline = React.useMemo(() => buildTimeline(voiceoverSeconds, sceneSeconds), [voiceoverSeconds, sceneSeconds]);
  const pages = React.useMemo(() => {
    const words = timeline.flatMap((s, i) => timeWords(s, wordStarts?.[i]));
    return buildPages(
      words,
      timeline.map((s) => s.from + s.duration),
    );
  }, [timeline, wordStarts]);
  const total = timeline[timeline.length - 1].from + timeline[timeline.length - 1].duration;

  // Soundeffekte: Wusch bei jedem Szenenwechsel + Effekte aus dem Skript
  const effects = React.useMemo(() => {
    const list: { at: number; type: keyof typeof SFX_FILE }[] = [];
    timeline.forEach((s, i) => {
      if (i > 0) list.push({ at: Math.max(0, s.from - 4), type: "whoosh" });
      const k = s.duration / (s.seconds * FPS);
      SFX[i].forEach((e) => list.push({ at: s.from + Math.round(e.t * FPS * k), type: e.type }));
    });
    return list;
  }, [timeline]);

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

      <CalmSubtitles pages={pages} />
      <ProgressBar total={total} color="#FF5D73" />
      <SeriesLabel text="Werbelügen #4" />

      <Html5Audio src={staticFile(VOICE)} />
      {hasFile(MUSIC) && <Html5Audio src={staticFile(MUSIC)} volume={0.12} loop />}
      {effects.map((e, i) => (
        <Sequence key={i} from={e.at} durationInFrames={30} name={`SFX ${e.type}`} layout="none">
          <Html5Audio src={staticFile(SFX_FILE[e.type])} volume={SFX_VOL[e.type]} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const FOLGE4_DEFAULTS: Folge4Props = { voiceoverSeconds: BASE_SECONDS, sceneSeconds: null, wordStarts: null };
