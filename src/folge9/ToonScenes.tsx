// Folge 9 im gezeichneten Look (Zeichentrick-Stil) mit eigenen Tierfiguren (Lena = Füchsin, Florian = Bär, Polizist = Bulldogge, Händler = Dachs, Buchhalter = Eule).
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Stamp } from "../folge3/Graphics";
import { FONT_BOLD, FONT_SUB } from "../theme";
import { Cut, Slam, Txt } from "../folge4/Scenes";
import { FPS } from "../folge3/script";
import { speakingAt, TS, Who } from "./script";
import { Animal, Bag, Car, Coin, CounterFg, Glow, INK, OfficeBg, P, R, ShopBg, Species, StreetBg, Tag, ToonCam, ToonPose, ToonPost } from "./Toon";

export type SceneProps = { dur: number; from: number };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const mouth = (frame: number, talking: boolean, seed: number) =>
  talking ? 0.2 + 0.8 * Math.abs(Math.sin(frame * 0.85 + seed) * Math.cos(frame * 0.37 + seed * 2)) : 0;
const useTalk = (who: Who, t0: number, seed: number): ToonPose => {
  const frame = useCurrentFrame();
  const talking = speakingAt(who, t0 + frame / FPS);
  const g = talking ? Math.sin(frame * 0.15 + seed) : 0;
  return { talk: mouth(frame, talking, seed), tilt: g * 3, armR: 14 + Math.max(0, g) * 30, bendR: 20 + Math.max(0, g) * 60 };
};

const LENA_O = { coat: "#C8402E", scarf: "#F2C14E", pants: "#2E3A59" };
const FLO_O = { coat: "#264653", tie: "#E9C46A", pants: "#3A3A3A" };

const Card: React.FC<{ children: React.ReactNode; top: number; bg?: string; color?: string; size?: number; at?: number; rotate?: number }> = ({ children, top, bg = "rgba(255,248,231,0.95)", color = "#2B1D0E", size = 52, at = 0, rotate = 0 }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const s = spring({ frame: frame - at, fps: FPS, config: { damping: 12, stiffness: 240 } });
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ transform: `scale(${s}) rotate(${rotate}deg)`, background: bg, color, fontFamily: FONT_SUB, fontWeight: 900, fontSize: size, padding: "12px 34px", borderRadius: 18, boxShadow: "0 10px 26px rgba(0,0,0,0.35)", textAlign: "center", lineHeight: 1.15, border: `3px solid ${INK}` }}>
        {children}
      </div>
    </div>
  );
};

const YearTag: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", top: 210, right: 60, background: "rgba(43,29,14,0.88)", color: "#F1E6C8", fontFamily: "Abril Fatface", fontSize: 56, padding: "6px 26px", borderRadius: 10, border: "3px solid #C8902E" }}>{text}</div>
);
const NameTag: React.FC<{ name: string; color: string; top?: number }> = ({ name, color, top = 210 }) => {
  const s = spring({ frame: useCurrentFrame(), fps: FPS, config: { damping: 14, stiffness: 220 } });
  return <div style={{ position: "absolute", top, left: 60, transform: `translateX(${(1 - s) * -300}px)`, background: color, color: "#fff", fontFamily: FONT_SUB, fontWeight: 900, fontSize: 44, padding: "8px 26px", borderRadius: 14, border: `3px solid ${INK}` }}>{name}</div>;
};
const BlackStamp: React.FC<{ text: string; size?: number; rotate?: number }> = ({ text, size = 120, rotate = -8 }) => (
  <div style={{ fontFamily: FONT_BOLD, fontSize: size, color: "#fff", background: "#0B0B0F", border: `${size * 0.07}px solid #fff`, borderRadius: size * 0.12, padding: `${size * 0.02}px ${size * 0.25}px`, transform: `rotate(${rotate}deg)`, letterSpacing: size * 0.04, boxShadow: "0 14px 34px rgba(0,0,0,0.6)", whiteSpace: "nowrap" }}>{text}</div>
);

// Lena (Füchsin) vor der goldenen Abendstraße
const LenaShot: React.FC<{ t0: number; pose?: ToonPose; zoom?: [number, number]; dark?: number; flo?: boolean }> = ({ t0, pose = {}, zoom = [1.35, 1.55], dark = 0, flo = false }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const lena = useTalk("lena", t0, 1);
  const florian = useTalk("florian", t0, 4);
  return (
    <AbsoluteFill>
      <ToonCam from={[flo ? 540 : 420, flo ? 1180 : 1080, zoom[0]]} to={[flo ? 540 : 430, flo ? 1180 : 1060, zoom[1]]} dur={durationInFrames}>
        <g style={{ filter: "blur(3px)" }}>
          <StreetBg />
        </g>
        <rect x={-600} y={-200} width={2400} height={2400} fill="rgba(30,10,0,0.25)" />
        <Animal s="fox" o={LENA_O} x={flo ? 360 : 430} y={1700} scale={1.25} seed={1} pose={{ ...lena, look: flo ? 0.4 : 0, ...pose }} />
        {flo && <Animal s="bear" o={FLO_O} x={740} y={1720} scale={1.3} seed={4} pose={{ ...florian, look: -0.4, smile: 0.8 }} />}
      </ToonCam>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 45% 35%, transparent 25%, rgba(0,0,0,${dark}) 70%)` }} />
      <ToonPost />
      <div style={{ display: "none" }}>{frame}</div>
    </AbsoluteFill>
  );
};

// Großes Jahr im Vintage-Look
const YearCard: React.FC<{ year: string; sub: string; ink?: string }> = ({ year, sub, ink = "#1F3A60" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 11, stiffness: 300 } });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, #FFF1D0 0%, #C9A27E 80%, #6B4A2A 100%)" }}>
      <AbsoluteFill style={{ background: "repeating-conic-gradient(from 0deg at 50% 45%, rgba(255,255,255,0.10) 0deg 8deg, transparent 8deg 16deg)", transform: `rotate(${frame * 0.4}deg) scale(2)` }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ transform: `scale(${interpolate(s, [0, 1], [2.4, 1])}) rotate(-3deg)`, fontFamily: "Abril Fatface", fontSize: 260, color: ink, WebkitTextStroke: `6px ${INK}`, textShadow: "0 12px 0 rgba(42,22,8,0.45)" }}>{year}</div>
        <div style={{ marginTop: 10, opacity: s, fontFamily: "Anton", fontSize: 90, letterSpacing: 6, color: "#2B1D0E", background: "rgba(255,248,231,0.7)", padding: "4px 30px", borderRadius: 10, border: `4px solid ${INK}` }}>{sub}</div>
      </AbsoluteFill>
      <ToonPost />
    </AbsoluteFill>
  );
};

const CROWD: { s: Species; coat: string; hat?: "bowler" | "fedora" | "none" }[] = [
  { s: "rabbit", coat: "#7A2E2E", hat: "bowler" },
  { s: "raccoon", coat: "#2F4858", hat: "fedora" },
  { s: "duck", coat: "#4A5A4A" },
  { s: "beaver", coat: "#6B4A3A", hat: "fedora" },
  { s: "rabbit", coat: "#5E6B78" },
  { s: "badger", coat: "#8A6A3A", hat: "bowler" },
  { s: "raccoon", coat: "#6D597A" },
  { s: "duck", coat: "#2A6F5A", hat: "bowler" },
];
const BAGS = ["#C8102E", "#1F6FB2", "#F2C14E", "#2A9D8F", "#E76F51"];

// =============== Szene 1 – Hook: Menge kracht gegen den Bildschirm, "DU FEIERST EIN SCHIMPFWORT!",
// Bulldoggen-Polizist flucht "BLACK FRIDAY!", Stempel FLUCH!, zurückspulen ===============
export const ToonScene1: React.FC<SceneProps> = ({ from }) => {
  const T = TS(0);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={1.95}>
        <CrashShot words={[0, 0.22, 0.77, 0.92].map((s) => T(s))} />
      </Cut>
      <Cut T={T} a={1.95} b={4.738 + 1}>
        <CurseShot words={[2.04, 3.16].map((s) => T(s - 1.95))} stampAt={T(3.16 - 1.95) + 8} rewindAt={T(4.2 - 1.95)} />
      </Cut>
      <div style={{ display: "none" }}>{from}</div>
    </AbsoluteFill>
  );
};

// Gesprungenes Glas: Risse vom Aufprallpunkt aus (feste Werte, kein Zufall)
const Crack: React.FC<{ x: number; y: number; grow: number }> = ({ x, y, grow }) => {
  const rays = Array.from({ length: 14 }).map((_, i) => {
    const a = (i / 14) * Math.PI * 2 + (i % 3) * 0.13;
    const len = (420 + (i % 4) * 260) * grow;
    const mid = len * 0.45;
    const kink = ((i % 2) * 2 - 1) * 0.18;
    return `M ${x} ${y} L ${x + Math.cos(a) * mid} ${y + Math.sin(a) * mid} L ${x + Math.cos(a + kink) * len} ${y + Math.sin(a + kink) * len}`;
  });
  const rings = [90, 190, 320].map((r, k) => {
    const pts = Array.from({ length: 15 }).map((_, i) => {
      const a = (i / 14) * Math.PI * 2;
      const rr = r * grow * (1 + ((i + k) % 3) * 0.12);
      return `${x + Math.cos(a) * rr},${y + Math.sin(a) * rr}`;
    });
    return `M ${pts.join(" L ")}`;
  });
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      {[...rays, ...rings].map((d, i) => (
        <g key={i}>
          <path d={d} stroke="rgba(0,0,0,0.55)" strokeWidth={9} fill="none" strokeLinejoin="round" />
          <path d={d} stroke="rgba(255,255,255,0.95)" strokeWidth={4} fill="none" strokeLinejoin="round" />
        </g>
      ))}
      <circle cx={x} cy={y} r={46 * grow} fill="rgba(255,255,255,0.35)" stroke="#fff" strokeWidth={4} />
    </svg>
  );
};

const CrashShot: React.FC<{ words: number[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (k: number) => (frame >= words[k] ? spring({ frame: frame - words[k], fps, config: { damping: 8, stiffness: 320 } }) : 0);
  // Menge rast auf die Kamera zu und knallt ans Glas (Bild 0 = Aufprall)
  const hit = spring({ frame, fps, config: { damping: 7, stiffness: 500 } });
  const crack = interpolate(frame, [0, 4], [0.3, 1], clamp);
  const flash = frame < 8 && frame % 4 < 2;
  const alarm = 0.25 + 0.2 * Math.max(0, Math.sin(frame * 0.7));
  const shake = Math.max(0, 1 - frame / 14) * 30 + (frame >= words[3] ? Math.max(0, 1 - (frame - words[3]) / 10) * 24 : 0);
  return (
    <AbsoluteFill style={{ transform: `translate(${Math.sin(frame * 2.9) * shake}px, ${Math.cos(frame * 3.7) * shake}px)` }}>
      <ToonCam from={[540, 1060, 1.9]} to={[540, 1060, 2.05]} dur={60}>
        <g style={{ filter: "blur(4px)" }}>
          <StreetBg snow={false} />
        </g>
        {/* hintere Reihe drängelt */}
        {[200, 420, 660, 880].map((x, i) => {
          const c = CROWD[(i + 3) % CROWD.length];
          return <Animal key={x} s={c.s} o={{ coat: c.coat, hat: c.hat }} x={x} y={1560} scale={0.8} seed={70 + i} pose={{ talk: 0.8, brow: 1.2, armR: 140, bendR: 20, armL: 120, bendL: 30, walk: frame * 0.6 + i }} handR={<Bag color={BAGS[i % 5]} scale={0.8} />} />;
        })}
        {/* vorne: Hase klatscht ans Glas, Gesicht platt gedrückt */}
        <g transform={`translate(540 ${1720 + (1 - hit) * 300}) scale(${1.6 + (1 - hit) * -0.6}, ${1.6 - hit * 0.08})`}>
          <Animal s="rabbit" o={{ coat: "#7A2E2E", hat: "bowler" }} seed={3} pose={{ talk: 1, brow: 1.4, armL: 165, bendL: 0, armR: 165, bendR: 0, look: 0 }} />
        </g>
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          const r = 230 + interpolate(frame, [0, 40], [0, 520], clamp);
          return <Tag key={i} text={["-50%", "-70%", "-90%"][i % 3]} x={540 + Math.cos(a) * r} y={1000 + Math.sin(a) * r} rot={frame * 9 + i * 36} scale={0.9} />;
        })}
      </ToonCam>
      {flash && <AbsoluteFill style={{ background: "rgba(255,255,255,0.3)" }} />}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(217,4,41,${alarm}) 85%)` }} />
      <Crack x={600} y={900} grow={crack} />
      <ToonPost />
      <div style={{ position: "absolute", top: 170, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 30 }}>
          <Txt size={170} color="#FFFFFF" style={{ transform: `scale(${pop(0)}) rotate(-4deg)`, WebkitTextStroke: "7px #0B0B0F" }}>DU</Txt>
          <Txt size={150} color="#FFD60A" style={{ transform: `scale(${pop(1)}) rotate(3deg)`, WebkitTextStroke: "7px #0B0B0F" }}>FEIERST</Txt>
        </div>
        <Txt size={110} color="#FFFFFF" style={{ transform: `scale(${pop(2)})`, WebkitTextStroke: "6px #0B0B0F" }}>EIN</Txt>
        <Txt size={150} color="#FF2D3A" style={{ transform: `scale(${pop(3) * (1 + Math.max(0, Math.sin(frame * 0.9)) * 0.05)}) rotate(-3deg)`, WebkitTextStroke: "7px #FFFFFF" }}>SCHIMPFWORT!</Txt>
      </div>
    </AbsoluteFill>
  );
};

// Bulldoggen-Polizist ganz nah, wütend, Fluch-Sprechblase
const CurseShot: React.FC<{ words: number[]; stampAt: number; rewindAt: number }> = ({ words, stampAt, rewindAt }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const pop = (k: number) => (frame >= words[k] ? spring({ frame: frame - words[k], fps, config: { damping: 8, stiffness: 320 } }) : 0);
  const rw = interpolate(frame, [rewindAt, rewindAt + 14], [0, 1], clamp);
  const yell = frame >= words[0] && frame < rewindAt;
  const fist = Math.sin(frame * 0.9);
  const shake = frame >= words[1] ? Math.max(0, 1 - (frame - words[1]) / 12) * 22 : yell ? 4 : 0;
  const bubble = pop(0);
  return (
    <AbsoluteFill style={{ filter: `sepia(${rw * 0.85}) blur(${rw * 2}px)`, transform: `translate(${Math.sin(frame * 3.1) * shake}px, ${Math.cos(frame * 2.3) * shake}px)` }}>
      <ToonCam from={[540, 1180, 2.0]} to={[540, 1150, 2.3]} dur={durationInFrames}>
        <g style={{ filter: "blur(3px)" }}>
          <StreetBg />
          <Car x={150} y={1620} color="#C8102E" driver="rabbit" honk seed={2} />
          <Car x={980} y={1640} color="#2A9D8F" flip driver="raccoon" honk seed={5} />
        </g>
        <Glow x={540} y={1000} r={500} red o={0.35 + 0.25 * Math.max(0, Math.sin(frame * 0.5))} />
        <Animal
          s="dog"
          o={{ coat: "#1B2A4A", pants: "#1B2A4A", hat: "police", tie: "#0B0F18", shirt: "#E9EEF2" }}
          x={540}
          y={1640}
          scale={1.25}
          seed={7}
          pose={{ talk: yell ? 0.6 + 0.4 * Math.abs(Math.sin(frame * 0.8)) : 0, brow: -1.5, smile: -1, armR: 150 + fist * 15, bendR: 30 + fist * 20, armL: 40, bendL: 90, tilt: Math.sin(frame * 0.7) * 4 }}
        />
      </ToonCam>
      {/* Fluch-Sprechblase mit Zeichen */}
      {frame < rewindAt && (
        <div style={{ position: "absolute", left: 30, top: 480, transform: `scale(${bubble * 0.85}) rotate(-6deg)`, transformOrigin: "80% 100%" }}>
          <div style={{ background: "#fff", border: `6px solid ${INK}`, borderRadius: 60, padding: "18px 40px", fontFamily: "Anton", fontSize: 110, color: "#D90429", WebkitTextStroke: "2px #0B0B0F", whiteSpace: "nowrap" }}>
            #@%&!!
          </div>
          <div style={{ position: "absolute", right: 120, bottom: -46, width: 0, height: 0, borderLeft: "30px solid transparent", borderRight: "30px solid transparent", borderTop: `56px solid ${INK}` }} />
        </div>
      )}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(217,4,41,${0.25 + 0.15 * Math.max(0, Math.sin(frame * 0.6))}) 85%)`, opacity: 1 - rw }} />
      <ToonPost />
      {frame < rewindAt && (
        <div style={{ position: "absolute", top: 180, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ transform: `scale(${pop(0)}) rotate(-3deg)` }}>
            <BlackStamp text="BLACK FRIDAY" size={120} rotate={0} />
          </div>
          <Txt size={100} color="#FFD60A" style={{ marginTop: 26, transform: `scale(${pop(1)}) rotate(2deg)`, WebkitTextStroke: "6px #0B0B0F" }}>
            = FLUCH DER POLIZEI
          </Txt>
        </div>
      )}
      {frame < rewindAt && (
        <Slam at={stampAt} style={{ left: 0, right: 0, top: 1420, display: "flex", justifyContent: "center" }}>
          <Stamp text="FLUCH!" size={170} rotate={-10} />
        </Slam>
      )}
      {frame >= rewindAt && <Vhs label="1959" />}
    </AbsoluteFill>
  );
};

const Vhs: React.FC<{ label: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 3px, transparent 3px 7px)" }} />
      <div style={{ position: "absolute", top: 200, right: 60, fontFamily: "monospace", fontWeight: 900, fontSize: 74, color: "#fff", textShadow: "3px 0 #ff2a6d, -3px 0 #05d9e8", opacity: frame % 20 < 14 ? 1 : 0.2 }}>◀◀ {label}</div>
    </AbsoluteFill>
  );
};

// =============== Szene 2 – Philadelphia, Thanksgiving vorbei, Massen ===============
export const ToonScene2: React.FC<SceneProps> = () => {
  const T = TS(1);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.6}>
        <YearCard year="1950er" sub="PHILADELPHIA" />
      </Cut>
      <Cut T={T} a={2.6} b={5.909 + 1}>
        <CrowdShot massAt={T(4.1 - 2.6)} />
        <YearTag text="Philadelphia · 1950er" />
      </Cut>
    </AbsoluteFill>
  );
};

const CrowdShot: React.FC<{ massAt: number }> = ({ massAt }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = frame < massAt ? 5 : 12;
  return (
    <AbsoluteFill>
      <ToonCam from={[540, 1050, 0.95]} to={[600, 1150, 1.12]} dur={durationInFrames}>
        <StreetBg />
        {Array.from({ length: n }).map((_, i) => {
          const c = CROWD[i % CROWD.length];
          const row = i % 3;
          const dir = i % 2 ? 1 : -1;
          const x = ((i * 230 + frame * 3.2 * dir) % 1600) - 260;
          return (
            <Animal key={i} s={c.s} o={{ coat: c.coat, hat: c.hat }} x={dir > 0 ? x : 1340 - x} y={1420 + row * 110} scale={0.62 + row * 0.08} flip={dir < 0} seed={20 + i} pose={{ walk: frame * 0.32 + i, smile: 0.7 }} handR={<Bag color={BAGS[i % 5]} scale={0.8} />} />
          );
        })}
      </ToonCam>
      <ToonPost />
      <Card top={330} size={54} bg="#7A2E2E" color="#fff" rotate={-2}>
        🦃 Thanksgiving ist vorbei
      </Card>
      <Card at={massAt} top={450} size={54} rotate={2}>
        👥 Massen strömen in die Stadt
      </Card>
    </AbsoluteFill>
  );
};

// =============== Szene 3 – Stau, Polizist, BLACK FRIDAY ===============
export const ToonScene3: React.FC<SceneProps> = () => {
  const T = TS(2);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.85}>
        <JamShot at={[0.04, 0.85, 1.88].map((s) => T(s))} />
      </Cut>
      <Cut T={T} a={2.85} b={5.452 + 1}>
        <CopShot stampAt={T(4.42 - 2.85)} />
      </Cut>
    </AbsoluteFill>
  );
};

const CAR_COLORS = ["#2A9D8F", "#C8102E", "#F2C14E", "#E9E3D6", "#1F6FB2", "#E76F51"];
const JamShot: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const pop = (k: number) => (frame >= at[k] ? spring({ frame: frame - at[k], fps, config: { damping: 11, stiffness: 240 } }) : 0);
  const honk = frame >= at[2];
  const drivers: Species[] = ["raccoon", "rabbit", "beaver", "duck", "badger", "rabbit"];
  return (
    <AbsoluteFill>
      <ToonCam from={[460, 1450, 1.0]} to={[640, 1520, 1.15]} dur={durationInFrames} shake={honk ? 8 : 0} shakeAt={at[2]}>
        <StreetBg snow />
        {/* Fußgänger auf dem Gehweg */}
        {Array.from({ length: 7 }).map((_, i) => {
          const c = CROWD[i % CROWD.length];
          return <Animal key={i} s={c.s} o={{ coat: c.coat, hat: c.hat }} x={-200 + i * 220 + ((frame * 2.5) % 220)} y={1310} scale={0.5} seed={30 + i} pose={{ walk: frame * 0.35 + i }} handR={i % 2 ? <Bag color={BAGS[i % 5]} scale={0.8} /> : undefined} />;
        })}
        {[0, 1].map((lane) =>
          Array.from({ length: 4 }).map((_, i) => (
            <Car key={`${lane}${i}`} x={-260 + i * 430 + lane * 200} y={1560 + lane * 230} scale={0.95 + lane * 0.12} color={CAR_COLORS[(i + lane * 3) % 6]} flip={lane === 1} driver={drivers[(i + lane * 2) % 6]} honk={honk && (i + lane) % 2 === 0} seed={i + lane * 4} />
          )),
        )}
      </ToonCam>
      <ToonPost />
      {honk &&
        [
          [140, 760],
          [640, 700],
          [380, 960],
        ].map(([x, y], k) => {
          const s = spring({ frame: frame - at[2] - k * 4, fps, config: { damping: 8, stiffness: 300 } });
          return <div key={k} style={{ position: "absolute", left: x, top: y, transform: `scale(${s}) rotate(${(k - 1) * 8}deg)`, fontFamily: "Anton", fontSize: 96, color: "#FFD60A", WebkitTextStroke: "5px #0B0B0F" }}>HUP!</div>;
        })}
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        {["🛍️ Einkäufer", "🏈 Football-Fans", "🚗 TOTALER STAU"].map((w, k) => (
          <div key={w} style={{ transform: `scale(${pop(k)}) rotate(${k === 2 ? -3 : 0}deg)`, background: k === 2 ? "#D90429" : "rgba(255,248,231,0.95)", color: k === 2 ? "#fff" : "#2B1D0E", fontFamily: FONT_SUB, fontWeight: 900, fontSize: k === 2 ? 68 : 52, padding: "8px 28px", borderRadius: 16, border: `3px solid ${INK}` }}>
            {w}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const CopShot: React.FC<{ stampAt: number }> = ({ stampAt }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const wave = Math.sin(frame * 0.4);
  const blow = frame % 24 < 10 ? 1 : 0;
  const dark = interpolate(frame, [stampAt - 4, stampAt + 6], [0, 0.5], clamp);
  return (
    <AbsoluteFill>
      <ToonCam from={[540, 1080, 1.55]} to={[540, 1040, 1.75]} dur={durationInFrames} shake={10} shakeAt={stampAt}>
        <g style={{ filter: "blur(2px)" }}>
          <StreetBg />
          <Car x={150} y={1620} color="#C8102E" driver="rabbit" honk seed={2} />
          <Car x={980} y={1640} color="#2A9D8F" flip driver="raccoon" honk seed={5} />
        </g>
        <Glow x={200} y={900} r={300} o={frame % 16 < 8 ? 0.6 : 0.1} />
        <Animal
          s="dog"
          o={{ coat: "#1B2A4A", pants: "#1B2A4A", hat: "police", tie: "#0B0F18", shirt: "#E9EEF2" }}
          x={540}
          y={1660}
          scale={1.3}
          seed={7}
          pose={{ armR: 150 + wave * 12, bendR: 10 + Math.max(0, wave) * 25, armL: 60, bendL: 70, brow: -1, cheeks: blow, smile: -0.6, look: Math.sin(frame * 0.08) }}
          handL={<R x={-8} y={-30} w={16} h={34} r={6} fill="#C0C4CC" sw={3} noShade />}
        />
      </ToonCam>
      <ToonPost />
      <AbsoluteFill style={{ background: `rgba(0,0,0,${dark})` }} />
      <NameTag name="👮 Polizei" color="#1B2A4A" top={230} />
      <Card top={340} size={50} color="#1B2A4A">
        Sie nennt den Tag …
      </Card>
      {blow > 0 && frame < stampAt && <div style={{ position: "absolute", left: 600, top: 700, fontFamily: "Anton", fontSize: 70, color: "#fff", WebkitTextStroke: "3px #0B0B0F", transform: "rotate(-12deg)" }}>TRRRR!</div>}
      <Slam at={stampAt} style={{ left: 0, right: 0, top: 1360, display: "flex", justifyContent: "center" }}>
        <BlackStamp text="BLACK FRIDAY" size={130} rotate={-8} />
      </Slam>
    </AbsoluteFill>
  );
};

// =============== Szene 4 – Händler hassen den Namen, 1961 Big Friday, Flop ===============
export const ToonScene4: React.FC<SceneProps> = () => {
  const T = TS(3);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={1.7}>
        <ShopkeeperShot />
      </Cut>
      <Cut T={T} a={1.7} b={6.442 + 1}>
        <BannerShot paintAt={T(2.17 - 1.7)} paintEnd={T(4.37 - 1.7)} flopAt={T(5.07 - 1.7)} />
        <YearTag text="1961" />
      </Cut>
    </AbsoluteFill>
  );
};

const ShopkeeperShot: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const shake = Math.sin(frame * 1.2) * 4;
  return (
    <AbsoluteFill>
      <ToonCam from={[540, 1000, 1.15]} to={[540, 980, 1.3]} dur={durationInFrames}>
        <ShopBg />
        <Animal s="badger" o={{ coat: "#E9E3D6", apron: "#2A6F5A", glasses: true, tie: "#7A2E2E", shirt: "#FFFFFF" }} x={420} y={1420} scale={1.25} seed={21} pose={{ brow: -1.2, smile: -1, armL: 70, bendL: 80, armR: 50, bendR: 90, tilt: shake * 0.5 }} />
        {/* Zeitung mit Schlagzeile */}
        <g transform={`translate(660 860) rotate(${-8 + shake})`}>
          <P fill="#EDE6D6" d="M 0 0 L 260 0 L 260 330 L 0 330 Z" />
          <text x={130} y={60} textAnchor="middle" fontFamily="Abril Fatface" fontSize={34} fill={INK}>THE DAILY</text>
          <rect x={16} y={74} width={228} height={4} fill={INK} />
          <text x={130} y={140} textAnchor="middle" fontFamily="Anton" fontSize={50} fill={INK}>„BLACK</text>
          <text x={130} y={196} textAnchor="middle" fontFamily="Anton" fontSize={50} fill={INK}>FRIDAY“</text>
          {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={20} y={220 + i * 16} width={220} height={6} fill="#9A9080" />)}
        </g>
        <CounterFg y={1260} />
      </ToonCam>
      <ToonPost />
      <Card top={250} size={54} bg="#2B1D0E" color="#F1E6C8">
        🏪 Die Händler …
      </Card>
      <Card at={8} top={370} size={64} bg="#D90429" color="#fff" rotate={-3}>
        😠 hassen den Namen!
      </Card>
    </AbsoluteFill>
  );
};

const BannerShot: React.FC<{ paintAt: number; paintEnd: number; flopAt: number }> = ({ paintAt, paintEnd, flopAt }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [paintAt, paintEnd], [0, 1], clamp);
  const fall = interpolate(frame, [flopAt, flopAt + 14], [0, 1], { ...clamp, easing: (t) => t * t });
  const banner = (
    <g transform={`translate(1000 560) rotate(${fall * 70}) translate(-1000 -560)`}>
      <P fill="#F4EEE0" d="M 80 560 L 1000 560 L 1000 720 L 80 720 Z" />
      <clipPath id="paint">
        <rect x={80} y={540} width={920 * p} height={200} />
      </clipPath>
      <g clipPath="url(#paint)">
        <text x={540} y={600} textAnchor="middle" fontFamily={FONT_SUB} fontWeight={900} fontSize={34} fill="#1F6FB2">★ AB SOFORT HEISST ER ★</text>
        <text x={540} y={700} textAnchor="middle" fontFamily="Anton" fontSize={100} fill="#D62828" stroke={INK} strokeWidth={3}>BIG FRIDAY!</text>
      </g>
    </g>
  );
  const brushX = 80 + 920 * p;
  return (
    <AbsoluteFill>
      <ToonCam from={[540, 900, 1.05]} to={[540, 980, 1.15]} dur={durationInFrames} shake={10} shakeAt={flopAt}>
        <StreetBg banner={banner} />
        {/* Leiter + Biber malt */}
        <g transform={`translate(${Math.min(900, brushX)} 0)`}>
          <path d="M -60 1300 L -20 760 M 40 1300 L 60 760" stroke="#8A5A3A" strokeWidth={14} />
          {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M ${-56 + i * 5} ${1240 - i * 65} L ${44 + i * 2} ${1240 - i * 65}`} stroke="#8A5A3A" strokeWidth={10} />)}
          <Animal s="beaver" o={{ coat: "#5E6B78", hat: "cap", hatColor: "#C8102E", pants: "#2E3A59" }} x={0} y={1040} scale={0.55} seed={40} pose={{ armR: frame < paintEnd && frame >= paintAt ? 150 + Math.sin(frame * 0.8) * 15 : 30, bendR: 30, smile: fall > 0 ? -1 : 0.8, brow: fall > 0 ? 1 : 0 }} handR={<R x={-6} y={0} w={12} h={60} r={4} fill="#C8102E" sw={3} noShade />} />
        </g>
        {/* Passanten gehen vorbei, gucken nicht hin */}
        {Array.from({ length: 6 }).map((_, i) => {
          const c = CROWD[(i + 2) % CROWD.length];
          return <Animal key={i} s={c.s} o={{ coat: c.coat, hat: c.hat }} x={-200 + i * 260 + ((frame * 3) % 260)} y={1480 + (i % 2) * 90} scale={0.62} seed={50 + i} pose={{ walk: frame * 0.33 + i, look: 1, smile: 0 }} />;
        })}
      </ToonCam>
      <ToonPost />
      <Card at={paintAt} top={330} size={52} color="#1F6FB2" rotate={-2}>
        🖌️ Neuer Name: „Big Friday“
      </Card>
      <Slam at={flopAt} style={{ left: 0, right: 0, top: 1450, display: "flex", justifyContent: "center" }}>
        <Stamp text="FLOP" size={150} rotate={-10} />
      </Slam>
      <Card at={flopAt + 6} top={450} size={58} bg="#2B2B30" color="#fff" rotate={2}>
        ❌ Niemand macht mit
      </Card>
    </AbsoluteFill>
  );
};

// =============== Szene 5 – 1981: rote -> schwarze Zahlen ===============
export const ToonScene5: React.FC<SceneProps> = () => {
  const T = TS(4);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.85}>
        <YearCard year="1981" sub="EINE NEUE GESCHICHTE" ink="#8A1C1C" />
      </Cut>
      <Cut T={T} a={2.85} b={6.539 + 1}>
        <OwlShot redAt={T(4.67 - 2.85)} blackAt={T(5.2 - 2.85)} />
      </Cut>
    </AbsoluteFill>
  );
};

const OwlShot: React.FC<{ redAt: number; blackAt: number }> = ({ redAt, blackAt }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const k = interpolate(frame, [blackAt, blackAt + 22], [0, 1], clamp);
  const rows = ["Januar", "März", "Juni", "Sept.", "Nov.", "Black Friday"];
  const vals = ["1.200 $", "950 $", "1.480 $", "700 $", "300 $", "9.800 $"];
  const coins = frame > blackAt ? Math.min(14, Math.floor((frame - blackAt) / 2)) : 0;
  const pr = frame >= redAt ? spring({ frame: frame - redAt, fps, config: { damping: 12, stiffness: 240 } }) : 0;
  const pb = frame >= blackAt + 8 ? spring({ frame: frame - blackAt - 8, fps, config: { damping: 12, stiffness: 240 } }) : 0;
  return (
    <AbsoluteFill>
      <ToonCam from={[540, 1080, 1.0]} to={[540, 1140, 1.12]} dur={durationInFrames} shake={6} shakeAt={blackAt + 20}>
        <OfficeBg />
        <Animal s="owl" o={{ coat: "#6B4A3A", tie: "#C8102E", glasses: true, shirt: "#F4F1EA" }} x={540} y={1250} scale={1.0} seed={60} pose={{ brow: k > 0.5 ? 1 : 0, smile: k > 0.5 ? 1 : -0.3, armL: 40, bendL: 80, armR: 40, bendR: 80, look: -0.3 }} />
        {/* Schreibtisch + Kassenbuch */}
        <P fill="url(#wood)" d="M -200 1180 L 1300 1180 L 1300 2200 L -200 2200 Z" noShade />
        <g transform="translate(170 1210) rotate(-3)">
          <P fill="#F4EEE0" d="M 0 0 L 740 0 L 740 560 L 0 560 Z" />
          <text x={370} y={64} textAnchor="middle" fontFamily="Abril Fatface" fontSize={50} fill="#2B1D0E">Kassenbuch</text>
          <path d="M 470 90 L 470 540" stroke="#D98C8C" strokeWidth={3} />
          {rows.map((r, i) => {
            const kk = Math.max(0, Math.min(1, k * 7 - i));
            const black = kk > 0.5;
            return (
              <g key={r}>
                <path d={`M 20 ${130 + i * 72} L 720 ${130 + i * 72}`} stroke="#9FB3C8" strokeWidth={2} />
                <text x={30} y={118 + i * 72} fontFamily={FONT_SUB} fontWeight={800} fontSize={36} fill="#2B1D0E">{r}</text>
                <text x={710} y={118 + i * 72} textAnchor="end" fontFamily={FONT_SUB} fontWeight={900} fontSize={i === 5 ? 46 : 38} fill={black ? "#111111" : "#D62828"}>
                  {black ? "+ " : "– "}
                  {vals[i]}
                </text>
              </g>
            );
          })}
        </g>
        <Glow x={980} y={1150} r={260} o={0.8} />
        <g transform="translate(980 1180)">
          <path d="M 0 0 L -30 -150" stroke="#2A2A2A" strokeWidth={10} />
          <P fill="#1E6B3A" d="M -110 -150 Q -30 -230 50 -150 Z" />
        </g>
        {Array.from({ length: coins }).map((_, i) => {
          const t = Math.min(1, ((frame - blackAt) / 2 - i) / 10);
          return <Coin key={i} x={260 + (i % 7) * 90} y={700 + t * 900 - Math.floor(i / 7) * 50} spin={frame * 0.3 + i} r={34} />;
        })}
      </ToonCam>
      <ToonPost />
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 22 }}>
        <div style={{ transform: `scale(${pr})`, background: "#D62828", color: "#fff", fontFamily: FONT_SUB, fontWeight: 900, fontSize: 52, padding: "10px 26px", borderRadius: 16, border: `3px solid ${INK}` }}>📕 rote Zahlen</div>
        <div style={{ transform: `scale(${pb})`, fontFamily: FONT_BOLD, fontSize: 70, color: "#fff" }}>→</div>
        <div style={{ transform: `scale(${pb})`, background: "#0B0B0F", color: "#fff", fontFamily: FONT_SUB, fontWeight: 900, fontSize: 52, padding: "10px 26px", borderRadius: 16, border: "3px solid #fff" }}>⚫ schwarze</div>
      </div>
      <Card at={blackAt + 26} top={380} size={48} rotate={-2}>
        💰 „Darum heißt er Black Friday!“
      </Card>
    </AbsoluteFill>
  );
};

// =============== Szene 6 – Lena: Klingt logisch? Kam erst viel später ===============
export const ToonScene6: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  const T = TS(5);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={1.8}>
        <LenaShot t0={t0} pose={{ brow: 0.6, smile: 0.4, tilt: 6 }} />
        <Card at={T(0.45)} top={300} size={60} rotate={-2}>
          Klingt logisch? 🤔
        </Card>
      </Cut>
      <Cut T={T} a={1.8} b={4.95 + 1}>
        <TimelineShot at={[0, 0.45].map((s) => T(s))} stampAt={T(3.47 - 1.8)} />
      </Cut>
    </AbsoluteFill>
  );
};

const TimelineShot: React.FC<{ at: number[]; stampAt: number }> = ({ at, stampAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (k: number) => (frame >= at[k] ? spring({ frame: frame - at[k], fps, config: { damping: 12, stiffness: 220 } }) : 0);
  const line = interpolate(frame, [at[1], stampAt - 6], [0, 1], clamp);
  const p2 = line > 0.95 ? spring({ frame: frame - (stampAt - 6), fps, config: { damping: 12, stiffness: 220 } }) : 0;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #FFF1D0 0%, #C9A27E 75%, #5A3A1E 100%)" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute" }}>
        <rect x={140} y={760} width={800 * line} height={16} rx={8} fill="#2B1D0E" />
        <g transform={`translate(240 570) scale(${pop(0) * 0.62})`}>
          <Animal s="dog" o={{ coat: "#1B2A4A", pants: "#1B2A4A", hat: "police" }} pose={{ brow: -1, armR: 150 }} seed={7} />
        </g>
        <g transform={`translate(840 570) scale(${p2 * 0.62})`}>
          <Animal s="owl" o={{ coat: "#6B4A3A", tie: "#C8102E", glasses: true }} pose={{ smile: 1 }} seed={60} handR={<Coin x={0} y={0} r={40} />} />
        </g>
        <circle cx={240} cy={768} r={22 * pop(0)} fill="#FFD60A" stroke={INK} strokeWidth={5} />
        <circle cx={840} cy={768} r={22 * p2} fill="#FFD60A" stroke={INK} strokeWidth={5} />
      </svg>
      {[
        [40, "1950er", "👮 Polizei:\nBLACK FRIDAY = Chaos", "#1B2A4A", pop(0)],
        [640, "1981", "📒 die schöne\nGeschichte", "#8A1C1C", p2],
      ].map(([left, year, label, bg, s]) => (
        <div key={year as string} style={{ position: "absolute", left: left as number, top: 800, width: 400, transform: `scale(${s})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: "Abril Fatface", fontSize: 90, color: "#2B1D0E" }}>{year}</div>
          <div style={{ background: bg as string, color: "#fff", fontFamily: FONT_SUB, fontWeight: 900, fontSize: 42, padding: "10px 22px", borderRadius: 16, textAlign: "center", lineHeight: 1.15, whiteSpace: "pre-line", border: `3px solid ${INK}` }}>{label}</div>
        </div>
      ))}
      <ToonPost />
      <Slam at={stampAt} style={{ left: 0, right: 0, top: 1450, display: "flex", justifyContent: "center" }}>
        <Stamp text="ERST HINTERHER" size={110} rotate={-8} />
      </Slam>
    </AbsoluteFill>
  );
};

// =============== Szene 7 – Formel, der Trick, Folgen ===============
export const ToonScene7: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  const T = TS(6);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={4.4}>
        <FormulaShot t0={t0} at={[0.77, 2.98, 3.75].map((s) => T(s))} />
      </Cut>
      <Cut T={T} a={4.4} b={6.25}>
        <LenaShot t0={t0 + T(4.4) / FPS} pose={{ brow: -0.8, smile: 0.3, look: 0 }} zoom={[1.7, 1.85]} dark={0.55} />
        <Slam at={T(5.53 - 4.4)} style={{ left: 0, right: 0, top: 760, display: "flex", justifyContent: "center" }}>
          <Stamp text="DER TRICK" size={150} rotate={-10} />
        </Slam>
      </Cut>
      <Cut T={T} a={6.25} b={8.49 + 1}>
        <OutroShot t0={t0 + T(6.25) / FPS} />
      </Cut>
    </AbsoluteFill>
  );
};

const FormulaShot: React.FC<{ t0: number; at: number[] }> = ({ t0, at }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lena = useTalk("lena", t0, 1);
  const pop = (k: number) => (frame >= at[k] ? spring({ frame: frame - at[k], fps, config: { damping: 12, stiffness: 220 } }) : 0);
  return (
    <AbsoluteFill>
      <ToonCam from={[540, 1200, 1.0]} to={[540, 1220, 1.1]} dur={durationInFrames}>
        <ShopBg />
        <Animal s="fox" o={LENA_O} x={540} y={1700} scale={1.2} seed={1} pose={{ ...lena, armL: 30 + pop(2) * 100, bendL: 30 }} handL={pop(2) > 0.1 ? <Bag color="#0B0B0F" label="SALE" scale={1.1} /> : undefined} />
        {pop(2) > 0 &&
          Array.from({ length: 10 }).map((_, i) => {
            const t = (frame * 0.025 + i / 10) % 1;
            return <Coin key={i} x={180 + ((i * 97) % 720)} y={300 + t * 1400} spin={frame * 0.3 + i} r={30} />;
          })}
      </ToonCam>
      <ToonPost />
      <div style={{ position: "absolute", top: 240, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        {[
          ["😬 schlechter Name", "#fff", 76],
          ["+ 📖 neue Geschichte", "#FFC37A", 76],
          ["= 💰 Kauflust", "#7BE495", 88],
        ].map(([t, c, sz], k) => (
          <div key={t as string} style={{ transform: `scale(${pop(k)})`, fontFamily: FONT_SUB, fontWeight: 900, fontSize: sz as number, color: c as string, WebkitTextStroke: `3px ${INK}`, textShadow: "0 5px 0 rgba(0,0,0,0.5)" }}>
            {t}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const OutroShot: React.FC<{ t0: number }> = ({ t0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bp = spring({ frame: frame - 16, fps, config: { damping: 12, stiffness: 260 } });
  const pulse = 1 + Math.sin((frame / 30) * Math.PI * 2 * 1.4) * 0.06;
  return (
    <AbsoluteFill>
      <LenaShot t0={t0} pose={{ smile: 0.9, armL: 140, bendL: 20 }} zoom={[1.0, 1.08]} flo />
      <div style={{ position: "absolute", top: 220, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ transform: `scale(${pulse * bp})`, background: "linear-gradient(180deg, #FF3B6B, #E0115F)", color: "#fff", fontFamily: FONT_SUB, fontWeight: 900, fontSize: 92, padding: "24px 76px", borderRadius: 999, boxShadow: `0 0 ${40 + pulse * 40}px rgba(255,59,107,0.7), 0 14px 0 #8E0B3C`, border: `4px solid ${INK}` }}>FOLGEN +</div>
        <div style={{ marginTop: 34, fontFamily: FONT_SUB, fontWeight: 800, fontSize: 56, color: "#1D2433", opacity: bp, background: "rgba(255,248,231,0.9)", padding: "6px 24px", borderRadius: 14, border: `3px solid ${INK}` }}>Kaufst du am Black Friday? 👇</div>
      </div>
    </AbsoluteFill>
  );
};
