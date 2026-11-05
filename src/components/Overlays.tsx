import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_SUB } from "../theme";
import { pageWords, TimedWord } from "../script";

// ---------- 1920er-Look: Sepia, Filmkorn, Flackern, Kratzer, Vignette ----------
export const Vintage: React.FC<{ children: React.ReactNode; strength?: number }> = ({ children, strength = 1 }) => {
  const frame = useCurrentFrame();
  const flicker = 0.93 + random(`f${frame}`) * 0.1;
  const jitterY = (random(`j${frame}`) - 0.5) * 4 * strength;
  const seed = frame % 12;
  const scratchX = random(`s${Math.floor(frame / 3)}`) * 1080;
  const showScratch = random(`ss${Math.floor(frame / 3)}`) > 0.45;
  return (
    <AbsoluteFill style={{ backgroundColor: "#d9c49a" }}>
      <AbsoluteFill
        style={{
          filter: `sepia(${0.85 * strength}) contrast(1.08) brightness(${flicker})`,
          transform: `translateY(${jitterY}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
      {/* Filmkorn */}
      <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.55 * strength }}>
        <svg width="1080" height="1920">
          <filter id={`grain${seed}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="1080" height="1920" filter={`url(#grain${seed})`} />
        </svg>
      </AbsoluteFill>
      {/* Kratzer + Staub */}
      <AbsoluteFill style={{ opacity: 0.6 * strength }}>
        {showScratch && (
          <div style={{ position: "absolute", left: scratchX, top: 0, width: 2, height: 1920, background: "rgba(255,255,240,0.6)" }} />
        )}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: random(`dx${frame}-${i}`) * 1080,
              top: random(`dy${frame}-${i}`) * 1920,
              width: 3 + random(`ds${frame}-${i}`) * 6,
              height: 3 + random(`dh${frame}-${i}`) * 6,
              borderRadius: "50%",
              background: i % 2 ? "rgba(30,20,10,0.7)" : "rgba(255,250,230,0.7)",
            }}
          />
        ))}
      </AbsoluteFill>
      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 45%, rgba(40,25,10,${0.75 * strength}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// ---------- Untertitel (Wort für Wort, aktuelles Wort gelb) ----------
export const Subtitles: React.FC<{ words: TimedWord[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pages = React.useMemo(() => pageWords(words), [words]);

  const page = pages.find((p, i) => {
    const start = p[0].start;
    const nextStart = pages[i + 1]?.[0].start ?? p[p.length - 1].end + 15;
    return frame >= start && frame < nextStart;
  });
  if (!page) return null;

  const pageIn = spring({ frame: frame - page[0].start, fps, config: { damping: 12, stiffness: 220 } });

  return (
    <AbsoluteFill
      style={{
        // oben 150 px und unten 400 px frei -> Untertitel in der Mitte des freien Bereichs, etwas unter der Grafik
        top: 1130,
        bottom: 400,
        left: 60,
        right: 60,
        height: "auto",
        width: "auto",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 46px",
          transform: `scale(${interpolate(pageIn, [0, 1], [0.85, 1])})`,
          textAlign: "center",
        }}
      >
        {page.map((w, i) => {
          if (frame < w.start) return null;
          const active = frame >= w.start && (i === page.length - 1 ? true : frame < page[i + 1].start);
          const s = spring({ frame: frame - w.start, fps, config: { damping: 18, stiffness: 300 } });
          return (
            <span
              key={i}
              style={{
                fontFamily: FONT_SUB,
                fontWeight: 900,
                fontSize: 96,
                lineHeight: 1.15,
                textTransform: "uppercase",
                color: active ? COLORS.yellow : "#FFFFFF",
                WebkitTextStroke: "14px #000",
                paintOrder: "stroke fill",
                textShadow: "0 8px 0 rgba(0,0,0,0.55)",
                display: "inline-block",
                transform: `scale(${interpolate(s, [0, 1], [0.5, 1])}) translateY(${active ? -6 : 0}px)`,
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Dünner Fortschrittsbalken oben ----------
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = Math.min(1, frame / (durationInFrames - 1));
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 10, background: "rgba(255,248,231,0.35)" }}>
      <div style={{ width: `${p * 100}%`, height: "100%", background: COLORS.red, boxShadow: "0 0 12px rgba(214,40,40,0.8)" }} />
    </div>
  );
};

// ---------- kurzer weißer Blitz beim Szenenwechsel ----------
export const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 4], [0.85, 0], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ background: "#fff", opacity: o, pointerEvents: "none" }} />;
};
