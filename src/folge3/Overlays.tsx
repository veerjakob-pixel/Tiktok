import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONT_SUB } from "../theme";
import { SubPage } from "./script";

const FADE = 5; // ca. 0,15 s bei 30 fps

// Ruhige Untertitel: 3–5 Wörter pro Abschnitt, max. 2 Zeilen, weich ein-/ausblenden,
// gesprochenes Wort nur dezent gelb (keine Vergrößerung, kein Wackeln).
export const CalmSubtitles: React.FC<{ pages: SubPage[] }> = ({ pages }) => {
  const frame = useCurrentFrame();
  const idx = pages.findIndex((p) => frame >= p.start && frame < p.end);
  if (idx < 0) return null;
  const page = pages[idx];
  // erster Abschnitt (Hook) steht sofort da, ohne Einblenden
  const fadeIn = idx === 0 ? 1 : interpolate(frame, [page.start, page.start + FADE], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [page.end - FADE, page.end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill
      style={{
        // oben 150 px und unten 400 px frei; Untertitel sitzen direkt über dem unteren freien Bereich
        top: 1150,
        height: 370,
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          maxWidth: 1080 * 0.85,
          textAlign: "center",
          fontFamily: FONT_SUB,
          fontWeight: 800,
          fontSize: 64,
          lineHeight: 1.2,
          color: "#FFFFFF",
          WebkitTextStroke: "6px rgba(15,12,10,0.95)",
          paintOrder: "stroke fill",
          textShadow: "0 3px 10px rgba(0,0,0,0.55)",
          opacity,
          // dezenter dunkler Hintergrund, damit der Text auch auf hellen Sepia-Bildern gut lesbar ist
          background: "rgba(10,8,6,0.42)",
          borderRadius: 24,
          padding: "8px 26px 12px",
        }}
      >
        {page.words.map((w, i) => {
          const next = page.words[i + 1];
          const active = frame >= w.start && (!next || frame < next.start);
          return (
            <React.Fragment key={i}>
              <span style={{ color: active ? "#FFE680" : "#FFFFFF" }}>{w.text}</span>
              {next ? " " : ""}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Kleines Label oben links
export const SeriesLabel: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      position: "absolute",
      top: 30,
      left: 36,
      fontFamily: FONT_SUB,
      fontWeight: 800,
      fontSize: 30,
      color: "#fff",
      letterSpacing: 1,
      padding: "6px 14px",
      borderRadius: 10,
      background: "rgba(0,0,0,0.45)",
      border: "2px solid rgba(255,255,255,0.35)",
    }}
  >
    {text}
  </div>
);

// Fortschrittsbalken oben
export const ProgressBar: React.FC<{ total: number; color?: string }> = ({ total, color = "#7FD8FF" }) => {
  const frame = useCurrentFrame();
  const p = Math.min(1, frame / Math.max(1, total - 1));
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 12, background: "rgba(255,255,255,0.25)" }}>
      <div style={{ width: `${p * 100}%`, height: "100%", background: color, boxShadow: `0 0 14px ${color}` }} />
    </div>
  );
};
