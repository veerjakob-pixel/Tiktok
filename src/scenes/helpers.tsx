import React from "react";
import { AbsoluteFill, Sequence } from "remotion";

// Ein "Schnitt" innerhalb einer Szene. start/end sind Anteile der Szenenlänge (0..1),
// damit alles mitwächst, wenn die Sprachaufnahme länger oder kürzer ist.
export const Shot: React.FC<{
  dur: number;
  start: number;
  end: number;
  children: React.ReactNode;
}> = ({ dur, start, end, children }) => {
  const from = Math.round(start * dur);
  const to = Math.round(end * dur);
  return (
    <Sequence from={from} durationInFrames={Math.max(1, to - from)}>
      {children}
    </Sequence>
  );
};

// Bereich für die Grafiken: unter der TikTok-Leiste oben, über den Untertiteln.
export const Stage: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <AbsoluteFill
    style={{
      top: 170,
      height: 940,
      alignItems: "center",
      justifyContent: "center",
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

export type SceneProps = { dur: number };
