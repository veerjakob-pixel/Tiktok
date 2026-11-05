import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile } from "remotion";
import { ProgressBar } from "./components/Overlays";
import { FONT_SUB } from "./theme";
import { Subtitles2 } from "./folge2/Subtitles2";
import { SCENES } from "./folge2/timeline";
import {
  COUNT_CLICKS,
  COUNT_FRAMES,
  HISTORIC,
  S1_STAMP_WORD,
  S2_YEAR_CLICK,
  S3_COUNT_WORD,
  S6_PART_WORD,
  SCENE_COMPONENTS,
} from "./folge2/Scenes2";
import { at } from "./folge2/timeline";

// Folge 2 – "Frühstück ist die wichtigste Mahlzeit"
// Ton ist Pflicht: Sprache (public/voiceover-folge2.mp3), leise Musik und Soundeffekte.

const Sfx: React.FC<{ at: number; file: string; volume: number }> = ({
  at: from,
  file,
  volume,
}) => (
  <Sequence from={Math.max(0, from)} durationInFrames={30} layout="none">
    <Html5Audio src={staticFile(`sfx/${file}.mp3`)} volume={volume} />
  </Sequence>
);

const Label: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 30,
      left: 32,
      fontFamily: FONT_SUB,
      fontWeight: 800,
      fontSize: 30,
      color: "#FFFFFF",
      background: "rgba(0,0,0,0.38)",
      padding: "6px 16px",
      borderRadius: 12,
      letterSpacing: 1,
    }}
  >
    Werbelügen #2
  </div>
);

export const Folge2Fruehstueck: React.FC = () => {
  const s = SCENES;
  // Klick-Sounds für Zahlen
  const clicks = [
    s[1].from + S2_YEAR_CLICK, // "1920er"
    ...Array.from(
      { length: COUNT_CLICKS },
      (_, i) =>
        s[2].from +
        at(s[2], S3_COUNT_WORD) +
        Math.round((i * COUNT_FRAMES) / COUNT_CLICKS),
    ), // Zähler
    s[5].from + at(s[5], S6_PART_WORD), // "Teil 3"
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {s.map((scene, i) => {
        const Comp = SCENE_COMPONENTS[i];
        return (
          <Sequence
            key={i}
            name={`Szene ${i + 1}${HISTORIC[i] ? " (Sepia)" : ""}`}
            from={scene.from}
            durationInFrames={scene.duration}
          >
            <Comp scene={scene} />
          </Sequence>
        );
      })}

      <Subtitles2 />
      <ProgressBar />
      <Label />

      {/* Ton */}
      <Html5Audio src={staticFile("voiceover-folge2.mp3")} />
      <Html5Audio src={staticFile("music-folge2.mp3")} volume={0.12} loop />
      {s.slice(1).map((scene, i) => (
        <Sfx key={`w${i}`} at={scene.from - 4} file="whoosh" volume={0.35} />
      ))}
      <Sfx
        at={s[0].from + at(s[0], S1_STAMP_WORD, 0)}
        file="knall"
        volume={0.55}
      />
      {clicks.map((c, i) => (
        <Sfx key={`c${i}`} at={c} file="klick" volume={0.3} />
      ))}
    </AbsoluteFill>
  );
};
