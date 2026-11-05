import React from "react";
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from "remotion";
import { FONT_SUB } from "../theme";
import { SUB_GROUPS } from "./timeline";

const FADE = 5; // ca. 0,15 s
const WHITE = "#FFFFFF";
const YELLOW = "#FFE45C"; // dezentes Gelb
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Ruhige Untertitel: immer 3–5 Wörter, höchstens 2 Zeilen, fester Platz, kein Springen.
// Das gerade gesprochene Wort wird nur leicht gelb gefärbt (keine Vergrößerung).
export const Subtitles2: React.FC = () => {
  const frame = useCurrentFrame();
  const group = SUB_GROUPS.find((g) => frame >= g.start && frame < g.end);
  if (!group) return null;
  const opacity = Math.min(
    interpolate(frame, [group.start, group.start + FADE], [0, 1], clamp),
    interpolate(frame, [group.end - FADE, group.end], [1, 0], clamp),
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          // Bereich zwischen Grafik und den unteren 400 px (die frei bleiben)
          top: 1250,
          left: (1080 - 918) / 2,
          width: 918, // 85 % der Bildbreite
          display: "flex",
          justifyContent: "center",
          opacity,
        }}
      >
        <div
          style={{
            // dezenter dunkler Kasten, damit der Text auch auf hellen Sepia-Bildern gut lesbar ist
            maxWidth: 918,
            boxSizing: "border-box",
            background: "rgba(14,10,6,0.55)",
            borderRadius: 22,
            padding: "8px 28px 12px",
            textAlign: "center",
            fontFamily: FONT_SUB,
            fontWeight: 800,
            fontSize: 64,
            lineHeight: 1.22,
            WebkitTextStroke: "6px rgba(12,8,4,0.95)", // halb verdeckt -> wirkt wie dünne 3-px-Kontur
            paintOrder: "stroke fill",
            textShadow: "0 3px 10px rgba(0,0,0,0.55)",
            overflowWrap: "break-word",
          }}
        >
          {group.words.map((w, i) => {
            const next = group.words[i + 1]?.start ?? group.end;
            const k = Math.min(
              interpolate(frame, [w.start - 1, w.start + 3], [0, 1], clamp),
              interpolate(frame, [next - 1, next + 3], [1, 0], clamp),
            );
            return (
              <React.Fragment key={i}>
                <span
                  style={{
                    color: interpolateColors(k, [0, 1], [WHITE, YELLOW]),
                  }}
                >
                  {w.text}
                </span>
                {i < group.words.length - 1 ? " " : null}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
