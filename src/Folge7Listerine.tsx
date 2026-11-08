import React from "react";
import { AbsoluteFill, CalculateMetadataFunction, getStaticFiles, Html5Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { FONT_SUB } from "./theme";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { buildPages, FPS, timeWords } from "./folge3/script";
import { CalmSubtitles, ProgressBar, SeriesLabel, SpeakerTag } from "./folge3/Overlays";
import { buildTimeline, K, SCENES, SFX, SPEAKERS } from "./folge7/script";
import { Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, SceneProps } from "./folge7/Scenes";
import timing from "../public/voiceover-folge7-timing.json";

// Folge 7 "Wie Mundwasser-Werbung eine Krankheit erfand": aufgebaut wie Folge 6 (Geschichte, Kino-Look, Mitte: Like/Folgen).
export type Folge7Props = { total: number };

const VOICE = "voiceover-folge7.mp3";
const MUSIC = "music-folge7.mp3"; // eigene, spannende Musik (Lautstärke wie Folge 6)
const hasFile = (name: string) => getStaticFiles().some((f) => f.name === name);

// Das Video muss IMMER Ton haben: ohne Sprachaufnahme bricht das Rendern ab.
export const calculateMetadata: CalculateMetadataFunction<Folge7Props> = async ({ props }) => {
  if (!hasFile(VOICE)) throw new Error(`public/${VOICE} fehlt – Folge7Listerine wird nie ohne Ton gerendert.`);
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
  riser: "sfx-riser.mp3",
} as const;
const SFX_VOL = { whoosh: 0.35, boom: 0.45, click: 0.35, kaching: 0.4, hit: 0.6, rewind: 0.5, riser: 0.32 } as const;

const TAGS: Record<string, SpeakerTag> = {
  lena: { label: "Lena", color: "#E76F51", highlight: "#FFC9B3" },
  florian: { color: "#264653", highlight: "#FFE680" },
};

// Schneller Übergang: kurzer Zoom mit Bewegungsunschärfe statt weißem Blitz
const WhipIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const p = Math.min(1, frame / 7);
  const e = 1 - Math.pow(1 - p, 3);
  return (
    <AbsoluteFill style={{ transform: `scale(${1.18 - 0.18 * e}) translateY(${(1 - e) * -60}px)`, filter: p < 1 ? `blur(${(1 - e) * 16}px) brightness(${1 + (1 - e) * 0.25})` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};

// Mitte des Videos: Like, Folgen, Kommentieren (Herz ploppt, Finger tippt auf Folgen, Sprechblase)
const MID_LEN = 105;
const MidCta: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = (at: number) => spring({ frame: frame - at, fps: FPS, config: { damping: 9, stiffness: 260 } });
  const out = interpolate(frame, [MID_LEN - 10, MID_LEN], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const heart = pop(0);
  const follow = pop(26);
  const tapped = frame >= 44;
  const finger = interpolate(frame, [30, 42, 48, 60], [80, 0, 0, 80], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bubble = pop(58);
  const pill = (bg: string, children: React.ReactNode, scale: number, extra: React.CSSProperties = {}) => (
    <div
      style={{
        transform: `scale(${scale})`,
        background: bg,
        color: "#fff",
        fontFamily: FONT_SUB,
        fontWeight: 900,
        fontSize: 64,
        padding: "14px 36px",
        borderRadius: 999,
        boxShadow: "0 10px 26px rgba(0,0,0,0.45)",
        whiteSpace: "nowrap",
        ...extra,
      }}
    >
      {children}
    </div>
  );
  return (
    <AbsoluteFill style={{ top: 860, height: 260, alignItems: "center", justifyContent: "center", gap: 18, opacity: out, pointerEvents: "none" }}>
      <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
        {pill("#FF2D55", `❤️ Like`, heart * (1 + Math.max(0, Math.sin(frame * 0.5)) * 0.06 * (frame < 25 ? 1 : 0)))}
        <div style={{ position: "relative" }}>
          {pill(tapped ? "#2E2E35" : "linear-gradient(180deg, #FF3B6B, #E0115F)", tapped ? "✓ Folge ich" : "+ Folgen", follow * (tapped && frame < 50 ? 0.92 : 1))}
          {frame >= 28 && frame < 62 && (
            <div style={{ position: "absolute", right: -10, bottom: -80 - finger, fontSize: 96, transform: "rotate(-15deg)" }}>👆</div>
          )}
        </div>
      </div>
      {frame >= 58 && pill("rgba(255,255,255,0.95)", "💬 Hättest du's gewusst?", bubble, { color: "#1D2433", fontSize: 54 })}
    </AbsoluteFill>
  );
};

export const Folge7Listerine: React.FC<Folge7Props> = ({ total }) => {
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
  const midAt = Math.round(totalFrames * 0.47);

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
            {i > 0 ? (
              <WhipIn>
                <Comp dur={scene.duration} from={scene.from} />
              </WhipIn>
            ) : (
              <Comp dur={scene.duration} from={scene.from} />
            )}
          </Sequence>
        );
      })}

      {/* Like / Folgen / Kommentieren in der Mitte (ca. 47 % des Videos) */}
      <Sequence from={midAt} durationInFrames={MID_LEN} name="Mitte: Like + Folgen + Kommentar" layout="none">
        <MidCta />
      </Sequence>
      {[0, 26, 44, 58].map((d, k) => (
        <Sequence key={`cta${k}`} from={midAt + d} durationInFrames={30} layout="none">
          <Html5Audio src={staticFile(k === 0 ? SFX_FILE.kaching : SFX_FILE.click)} volume={k === 0 ? 0.3 : 0.4} />
        </Sequence>
      ))}

      <CalmSubtitles pages={pages} speakers={TAGS} />
      <ProgressBar total={totalFrames} color="#FF5D73" />
      <SeriesLabel text="Werbelügen #7" />

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
