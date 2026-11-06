import React from "react";
import { AbsoluteFill, Easing, interpolate, random, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_BOLD, FONT_SUB, FONT_VINTAGE, shake } from "../theme";
import { Vintage } from "../components/Overlays";
import { Stage } from "../scenes/helpers";
import { Sparkle, Stamp } from "../folge3/Graphics";
import {
  ArchiveBox,
  Bill,
  Box,
  Butter,
  Cube,
  EcgHeart,
  Envelope,
  Journal,
  Letterhead,
  Magnifier,
  Scale,
  Scientist,
  SugarFactory,
  TV,
  Wanted,
  Yogurt,
} from "./Graphics";
import { SCENES } from "./script";

export type SceneProps = { dur: number };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------- Helfer ----------
const useT = (i: number, dur: number) => {
  const planned = SCENES[i].seconds;
  return (s: number) => Math.round((s / planned) * dur);
};

const Cut: React.FC<{ T: (s: number) => number; a: number; b: number; children: React.ReactNode }> = ({ T, a, b, children }) => (
  <Sequence from={T(a)} durationInFrames={Math.max(1, T(b) - T(a))} layout="none">
    <AbsoluteFill>{children}</AbsoluteFill>
  </Sequence>
);

// harter Zoom am Schnittanfang + langsame Kamerafahrt
const useCam = (from = 1.5, drift = 0.0014) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 18, stiffness: 260 } });
  return interpolate(s, [0, 1], [from, 1]) * (1 + frame * drift);
};
const useSpr = (delay: number, stiffness = 220, damping = 13) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness } });
};

// Moderner Hintergrund mit Strahlen, Lichtpunkten (Bokeh) und Vignette
const Bg: React.FC<{ a: string; b: string; rays?: boolean }> = ({ a, b, rays = true }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 34%, ${a} 0%, ${b} 74%)` }}>
      {rays && (
        <AbsoluteFill style={{ opacity: 0.07, transform: `rotate(${frame * 0.25}deg) scale(2.4)`, top: -300 }}>
          <svg viewBox="-100 -100 200 200" width="100%" height="100%">
            {Array.from({ length: 18 }).map((_, i) => {
              const a1 = (i / 18) * Math.PI * 2;
              const a2 = a1 + Math.PI / 18;
              return <polygon key={i} points={`0,0 ${Math.cos(a1) * 200},${Math.sin(a1) * 200} ${Math.cos(a2) * 200},${Math.sin(a2) * 200}`} fill="#fff" />;
            })}
          </svg>
        </AbsoluteFill>
      )}
      {Array.from({ length: 14 }).map((_, i) => {
        const x = random(`bx${i}`) * 1080;
        const y = (random(`by${i}`) * 2100 - frame * (0.6 + random(`bs${i}`))) % 2100;
        const r = 10 + random(`br${i}`) * 40;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y < -100 ? y + 2100 : y,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.35), rgba(255,255,255,0))",
              filter: "blur(2px)",
            }}
          />
        );
      })}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

const PaperBg: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 35%, #F6EBD0 0%, #DCC59A 70%, #B99A68 100%)" }} />
);

const Txt: React.FC<{ children: React.ReactNode; size?: number; color?: string; font?: string; style?: React.CSSProperties }> = ({
  children,
  size = 100,
  color = "#fff",
  font = FONT_BOLD,
  style,
}) => (
  <div style={{ fontFamily: font, fontSize: size, color, textAlign: "center", lineHeight: 1.02, textShadow: "0 8px 0 rgba(0,0,0,0.3)", ...style }}>
    {children}
  </div>
);

const Slam: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; from?: number }> = ({ at, children, style, from = 3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = spring({ frame: frame - at, fps, config: { damping: 13, stiffness: 330 } });
  return (
    <div style={{ position: "absolute", transform: `scale(${interpolate(s, [0, 1], [from, 1])})`, opacity: interpolate(frame - at, [0, 2], [0, 1], clamp), ...style }}>
      {children}
    </div>
  );
};

const WhiteFlash: React.FC<{ at?: number; len?: number; color?: string; max?: number }> = ({ at = 0, len = 6, color = "#fff", max = 1 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + len], [max, 0], clamp);
  return o > 0 ? <AbsoluteFill style={{ background: color, opacity: o }} /> : null;
};

// Zähler, der bei jedem Schritt "klickt"
const Counter: React.FC<{ from: number; to: number; at: number; steps: number; stepLen: number; format: (n: number) => string; style?: React.CSSProperties }> = ({
  from,
  to,
  at,
  steps,
  stepLen,
  format,
  style,
}) => {
  const frame = useCurrentFrame();
  const k = Math.max(0, Math.min(steps, Math.floor((frame - at) / Math.max(1, stepLen)) + 1));
  const v = frame < at ? from : Math.round(from + ((to - from) * k) / steps);
  return <div style={{ fontVariantNumeric: "tabular-nums", ...style }}>{format(v)}</div>;
};

// =============== Szene 1 – HOOK ===============
export const Scene1: React.FC<SceneProps> = ({ dur }) => {
  const T = useT(0, dur);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={1.05}>
        <HookCube />
      </Cut>
      <Cut T={T} a={1.05} b={2.95}>
        <HookPaid stampAt={T(2.09) - T(1.05)} />
      </Cut>
      <Cut T={T} a={2.95} b={5.6}>
        <HookVillain evilAt={T(3.48) - T(2.95)} haloAt={T(4.9) - T(2.95)} />
      </Cut>
      <Cut T={T} a={5.6} b={SCENES[0].seconds}>
        <HookYears at={T(6.2) - T(5.6)} step={Math.max(1, T(0.07))} labelAt={T(6.6) - T(5.6)} />
      </Cut>
    </AbsoluteFill>
  );
};

// 0–1 s: Zuckerwürfel knallt runter (Bild steht sofort, Knall im ersten Frame)
const HookCube: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = spring({ frame, fps, config: { damping: 12, stiffness: 420 } });
  return (
    <AbsoluteFill style={{ transform: shake(frame, 2, 10, 40) }}>
      <Bg a="#5B1020" b="#0B0306" />
      <Stage>
        <Txt size={96} color="#FFD6DE" style={{ marginBottom: 30, opacity: interpolate(frame, [0, 3], [0.6, 1], clamp) }}>
          ZUCKER-INDUSTRIE
        </Txt>
        <div style={{ transform: `translateY(${(1 - drop) * -500}px) scale(${interpolate(drop, [0, 1], [2.2, 1])}) rotate(${(1 - drop) * 25}deg)` }}>
          <Cube size={560} crack={interpolate(frame, [4, 12], [0, 1], clamp)} />
        </div>
      </Stage>
      {/* Zuckerkristalle spritzen */}
      {Array.from({ length: 22 }).map((_, i) => {
        const t = Math.max(0, frame - 3);
        const ang = random(`sa${i}`) * Math.PI * 2;
        const sp = 18 + random(`ss${i}`) * 26;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 + Math.cos(ang) * sp * t,
              top: 820 + Math.sin(ang) * sp * t + 1.2 * t * t,
              width: 14,
              height: 14,
              background: "#fff",
              transform: `rotate(${i * 40 + t * 20}deg)`,
              opacity: frame < 3 ? 0 : interpolate(t, [0, 25], [1, 0], clamp),
            }}
          />
        );
      })}
      <WhiteFlash len={6} max={0.5} />
    </AbsoluteFill>
  );
};

// 1–3 s: Forscher, Geld regnet, Stempel BEZAHLT
const HookPaid: React.FC<{ stampAt: number }> = ({ stampAt }) => {
  const frame = useCurrentFrame();
  const z = useCam(1.6);
  return (
    <AbsoluteFill style={{ transform: shake(frame, stampAt, 10, 30) }}>
      <Bg a="#1E3A5F" b="#050A14" />
      <Stage style={{ transform: `scale(${z})` }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
          <Scientist size={330} />
          <Scientist size={300} hair="#8A8A8A" skin="#E8B996" />
        </div>
        <Txt size={70} color="#BFD7FF" style={{ marginTop: 10, fontFamily: FONT_VINTAGE }}>
          Harvard-Forscher
        </Txt>
      </Stage>
      {Array.from({ length: 16 }).map((_, i) => {
        const x = random(`mx${i}`) * 960;
        const sp = 14 + random(`ms${i}`) * 10;
        const y = -200 + (frame - random(`md${i}`) * 25) * sp;
        return (
          <div
            key={i}
            style={{ position: "absolute", left: x, top: y, transform: `rotate(${Math.sin(frame / 6 + i) * 30 + i * 20}deg)` }}
          >
            <Bill width={190} />
          </div>
        );
      })}
      <Slam at={stampAt} style={{ left: 0, right: 0, top: 620, display: "flex", justifyContent: "center" }}>
        <Stamp text="BEZAHLT" size={190} rotate={-10} />
      </Slam>
      <WhiteFlash len={4} />
    </AbsoluteFill>
  );
};

// 3–5 s: Fett = Bösewicht, Zucker = Heiliger
const HookVillain: React.FC<{ evilAt: number; haloAt: number }> = ({ evilAt, haloAt }) => {
  const frame = useCurrentFrame();
  const evil = useSpr(evilAt, 260, 12);
  const halo = useSpr(haloAt, 200, 14);
  const z = useCam(1.4);
  return (
    <AbsoluteFill>
      {/* geteiltes Bild: links rot (böse), rechts hell (gut) */}
      <AbsoluteFill style={{ background: "linear-gradient(90deg, #5C0A12 0%, #2A0408 50%, #F3E9C9 50%, #FFF8E7 100%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)" }} />
      <Stage style={{ transform: `scale(${z})` }}>
        <div style={{ display: "flex", width: 1080, justifyContent: "space-around", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `translateY(${Math.sin(frame / 4) * 4 * evil}px)` }}>
            <Butter size={420} evil={evil} />
            <Txt size={110} color="#FF4D5E" style={{ opacity: evil, transform: `scale(${0.6 + evil * 0.4})` }}>
              BÖSE
            </Txt>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Cube size={330} halo={halo} />
            <Txt size={88} color="#2B6E3F" style={{ opacity: halo, textShadow: "none" }}>
              HARMLOS?
            </Txt>
          </div>
        </div>
      </Stage>
      {halo > 0.1 && <Sparkle size={70} style={{ position: "absolute", left: 860, top: 360, opacity: halo }} color="#FFE680" />}
      <WhiteFlash len={4} />
    </AbsoluteFill>
  );
};

// 5–8,6 s: Jahre rasen 1967 -> 2016
const HookYears: React.FC<{ at: number; step: number; labelAt: number }> = ({ at, step, labelAt }) => {
  const frame = useCurrentFrame();
  const z = useCam(1.5, 0.003);
  const l = useSpr(labelAt + 12, 240, 12);
  return (
    <AbsoluteFill style={{ transform: shake(frame, at + 12 * step, 8, 16) }}>
      <Bg a="#2B2B2B" b="#050505" />
      <Stage style={{ transform: `scale(${z})` }}>
        <Txt size={60} color="#9AA3B2" style={{ fontFamily: FONT_SUB, fontWeight: 800, letterSpacing: 6 }}>
          KEINER HAT'S GEMERKT
        </Txt>
        <div
          style={{
            marginTop: 30,
            background: "#F1E6C8",
            color: "#1D1D1D",
            borderRadius: 30,
            padding: "10px 60px",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6), inset 0 -16px 0 rgba(0,0,0,0.12)",
            fontFamily: FONT_BOLD,
            fontSize: 260,
          }}
        >
          <Counter from={1967} to={2016} at={at} steps={12} stepLen={step} format={(n) => String(n)} />
        </div>
        <Txt size={120} color="#FFD166" style={{ marginTop: 40, transform: `scale(${l})` }}>
          FAST 50 JAHRE
        </Txt>
      </Stage>
      <WhiteFlash len={4} />
    </AbsoluteFill>
  );
};

// =============== Szene 2 – 1960er: Verdacht (Sepia) ===============
export const Scene2: React.FC<SceneProps> = ({ dur }) => {
  const T = useT(1, dur);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={3.1}>
        <Vintage>
          <TVShot />
        </Vintage>
      </Cut>
      <Cut T={T} a={3.1} b={5.0}>
        <Vintage>
          <HeartShot />
        </Vintage>
      </Cut>
      <Cut T={T} a={5.0} b={SCENES[1].seconds}>
        <Vintage>
          <AlarmShot />
        </Vintage>
      </Cut>
    </AbsoluteFill>
  );
};

const TVShot: React.FC = () => {
  const frame = useCurrentFrame();
  const z = useCam(1.5);
  const q = useSpr(40, 200, 10);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Stage style={{ transform: `scale(${z})` }}>
        <Txt size={100} color="#2B1D0E" font={FONT_VINTAGE} style={{ textShadow: "none", marginBottom: 20 }}>
          1960er
        </Txt>
        <TV width={860}>
          <div style={{ fontFamily: FONT_BOLD, fontSize: 64, color: "#1A1A1A", textAlign: "center", lineHeight: 1.05, transform: `translateY(${Math.sin(frame) * 1.5}px)` }}>
            ZUCKER
            <br />
            UNTER VERDACHT
          </div>
          <div style={{ fontFamily: FONT_BOLD, fontSize: 130, color: "#7A1E1E", transform: `scale(${q})` }}>?</div>
        </TV>
      </Stage>
    </AbsoluteFill>
  );
};

const HeartShot: React.FC = () => {
  const frame = useCurrentFrame();
  const z = useCam(1.4);
  const beat = 1 + Math.max(0, Math.sin(frame / 3)) * 0.05;
  return (
    <AbsoluteFill>
      <PaperBg />
      <Stage style={{ transform: `scale(${z})` }}>
        <div style={{ transform: `scale(${beat})` }}>
          <EcgHeart size={760} t={frame} wild={interpolate(frame, [0, 40], [0, 1], clamp)} />
        </div>
        <div style={{ display: "flex", gap: 30, marginTop: -40 }}>
          {[0, 1, 2].map((i) => (
            <Cube key={i} size={150} style={{ transform: `rotate(${(i - 1) * 12}deg)` }} />
          ))}
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

const AlarmShot: React.FC = () => {
  const frame = useCurrentFrame();
  const z = useCam(1.5);
  const alarm = Math.floor(frame / 6) % 2 === 0 ? 1 : 0.2;
  return (
    <AbsoluteFill style={{ transform: shake(frame, 0, 8, 20) }}>
      <PaperBg />
      <Stage style={{ transform: `scale(${z})` }}>
        <SugarFactory width={880} alarm={alarm} />
      </Stage>
      <Slam at={6} style={{ left: 0, right: 0, top: 260, display: "flex", justifyContent: "center" }}>
        <Stamp text="ALBTRAUM" size={150} rotate={-8} />
      </Slam>
    </AbsoluteFill>
  );
};

// =============== Szene 3 – 1965: das Geld (Sepia) ===============
export const Scene3: React.FC<SceneProps> = ({ dur }) => {
  const T = useT(2, dur);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={1.65}>
        <Vintage>
          <YearShot step={Math.max(1, T(0.1))} />
        </Vintage>
      </Cut>
      <Cut T={T} a={1.65} b={4.9}>
        <Vintage>
          <PaymentShot threeAt={T(2.99) - T(1.65)} openAt={T(3.99) - T(1.65)} />
        </Vintage>
      </Cut>
      <Cut T={T} a={4.9} b={SCENES[2].seconds}>
        <Vintage strength={0.8}>
          <MoneyShot nowAt={T(5.5) - T(4.9)} countAt={T(6.7) - T(4.9)} step={Math.max(1, T(0.08))} />
        </Vintage>
      </Cut>
    </AbsoluteFill>
  );
};

const YearShot: React.FC<{ step: number }> = ({ step }) => {
  const frame = useCurrentFrame();
  const n = Math.min(4, Math.floor(frame / step) + 1);
  const z = useCam(1.3, 0.004);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Stage style={{ transform: `scale(${z})` }}>
        <div style={{ fontFamily: FONT_VINTAGE, fontSize: 330, color: "#2B1D0E", letterSpacing: 10 }}>
          {"1965".slice(0, n)}
          <span style={{ opacity: frame % 16 < 8 ? 1 : 0 }}>|</span>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

const PaymentShot: React.FC<{ threeAt: number; openAt: number }> = ({ threeAt, openAt }) => {
  const frame = useCurrentFrame();
  const z = useCam(1.4);
  const slide = interpolate(frame, [threeAt - 10, openAt - 4], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const open = useSpr(openAt, 200, 12);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Stage style={{ transform: `scale(${z})`, justifyContent: "flex-start", paddingTop: 20 }}>
        <Letterhead width={760} />
        <div style={{ position: "relative", width: 1000, height: 460 }}>
          <Envelope
            width={330}
            open={frame >= openAt ? open : 0}
            style={{ position: "absolute", left: 335 + (1 - slide) * -10, top: -150 + slide * 120, transform: `rotate(${-6 + slide * 6}deg)` }}
          />
          <div style={{ position: "absolute", left: 40, right: 40, bottom: 0, display: "flex", justifyContent: "space-between" }}>
            {[0, 1, 2].map((i) => {
              const s = spring({ frame: frame - threeAt - i * 3, fps: 30, config: { damping: 12, stiffness: 220 } });
              return (
                <div key={i} style={{ transform: `translateY(${(1 - s) * 400}px)` }}>
                  <Scientist size={230} holding={false} hair={["#3B2A1A", "#8A8A8A", "#5A3A1A"][i]} />
                </div>
              );
            })}
          </div>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

const MoneyShot: React.FC<{ nowAt: number; countAt: number; step: number }> = ({ nowAt, countAt, step }) => {
  const z = useCam(1.4);
  const now = useSpr(nowAt, 220, 13);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #E7F2DA 0%, #9DB98A 80%)" }} />
      <Stage style={{ transform: `scale(${z})` }}>
        <Txt size={70} color="#1B4332" font={FONT_VINTAGE} style={{ textShadow: "none" }}>
          damals: 6.500 $
        </Txt>
        <div style={{ position: "relative", height: 260, width: 900, margin: "20px 0" }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: 120 + i * 50, top: 120 - i * 10, transform: `rotate(${(i % 3) * 6 - 6}deg)` }}>
              <Bill width={300} />
            </div>
          ))}
        </div>
        <div style={{ opacity: now, transform: `scale(${0.7 + now * 0.3})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Txt size={64} color="#1B4332" style={{ fontFamily: FONT_SUB, fontWeight: 900, textShadow: "none" }}>
            HEUTE ETWA
          </Txt>
          <div
            style={{
              fontFamily: FONT_BOLD,
              fontSize: 200,
              color: "#FFFFFF",
              background: "#1B4332",
              padding: "0 50px",
              borderRadius: 26,
              boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
            }}
          >
            <Counter
              from={6500}
              to={50000}
              at={countAt}
              steps={9}
              stepLen={step}
              format={(n) => (n === 6500 ? "? $" : `${n.toLocaleString("de-DE")} $`)}
            />
          </div>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

// =============== Szene 4 – 1967: der Bericht ===============
export const Scene4: React.FC<SceneProps> = ({ dur }) => {
  const T = useT(3, dur);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.6}>
        <Vintage strength={0.7}>
          <JournalShot hiAt={T(1.03)} />
        </Vintage>
      </Cut>
      <Cut T={T} a={2.6} b={4.4}>
        <Vintage strength={0.7}>
          <ResultShot typeAt={T(4.41) - T(2.6) - 20} />
        </Vintage>
      </Cut>
      <Cut T={T} a={4.4} b={7.5}>
        <ScaleShot tiltAt={T(5.45) - T(4.4)} sugarAt={T(6.51) - T(4.4)} />
      </Cut>
      <Cut T={T} a={7.5} b={SCENES[3].seconds}>
        <Vintage strength={0.6}>
          <FinePrintShot stampAt={T(9.2) - T(7.5)} />
        </Vintage>
      </Cut>
    </AbsoluteFill>
  );
};

const JournalShot: React.FC<{ hiAt: number }> = ({ hiAt }) => {
  const frame = useCurrentFrame();
  const z = useCam(1.2, 0.002);
  const s = useSpr(0, 160, 16);
  const hi = interpolate(frame, [hiAt, hiAt + 8], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "#3A2E22" }} />
      <Stage style={{ transform: `scale(${z})` }}>
        <div style={{ transform: `translateY(${(1 - s) * 900}px) rotate(${(1 - s) * 12 - 3}deg)` }}>
          <Journal width={620} highlight={hi} />
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

const ResultShot: React.FC<{ typeAt: number }> = ({ typeAt }) => {
  const frame = useCurrentFrame();
  const z = useCam(1.6, 0.003);
  const word = "ERGEBNIS:";
  const n = Math.max(0, Math.min(word.length, Math.floor((frame - Math.max(4, typeAt)) / 2)));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "#F3ECDD" }} />
      <Stage style={{ transform: `scale(${z})`, alignItems: "flex-start", paddingLeft: 90 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ height: 14, background: "#C9BFA9", marginTop: 26, width: `${80 - i * 9}%` }} />
        ))}
        <div style={{ fontFamily: FONT_VINTAGE, fontSize: 150, color: "#1F2A44", marginTop: 40, minHeight: 170 }}>{word.slice(0, n)}</div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ height: 14, background: "#C9BFA9", marginTop: 26, width: `${85 - i * 12}%` }} />
        ))}
      </Stage>
    </AbsoluteFill>
  );
};

const ScaleShot: React.FC<{ tiltAt: number; sugarAt: number }> = ({ tiltAt, sugarAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const z = useCam(1.3);
  const tilt = spring({ frame: frame - tiltAt, fps, config: { damping: 8, stiffness: 120 } });
  const guilt = useSpr(tiltAt + 4, 300, 12);
  const sug = useSpr(sugarAt, 220, 13);
  return (
    <AbsoluteFill style={{ transform: shake(frame, tiltAt, 8, 18) }}>
      <Bg a="#3D2B1F" b="#0B0705" />
      <Stage style={{ transform: `scale(${z})` }}>
        <Scale
          width={980}
          tilt={frame < tiltAt ? Math.sin(frame / 5) * 0.08 : tilt}
          left={<Butter size={230} evil={0} />}
          right={<Cube size={170} />}
        />
      </Stage>
      {frame >= tiltAt && (
        <div style={{ position: "absolute", left: 60, top: 980, transform: `scale(${guilt}) rotate(-8deg)` }}>
          <Stamp text="SCHULD" size={110} />
        </div>
      )}
      {frame >= sugarAt && (
        <div
          style={{
            position: "absolute",
            right: 70,
            top: 330,
            transform: `scale(${sug}) rotate(6deg)`,
            background: "#2B9348",
            color: "#fff",
            fontFamily: FONT_BOLD,
            fontSize: 80,
            padding: "4px 30px",
            borderRadius: 18,
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          }}
        >
          KAUM SCHULD
        </div>
      )}
    </AbsoluteFill>
  );
};

const FinePrintShot: React.FC<{ stampAt: number }> = ({ stampAt }) => {
  const frame = useCurrentFrame();
  const z = useCam(1.5, 0.002);
  const mx = interpolate(frame, [0, stampAt], [-260, 40], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ transform: shake(frame, stampAt, 10, 26) }}>
      <AbsoluteFill style={{ background: "#F3ECDD" }} />
      <Stage style={{ transform: `scale(${z})`, alignItems: "flex-start", paddingLeft: 90 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ height: 14, background: "#C9BFA9", marginTop: 26, width: `${80 - i * 7}%` }} />
        ))}
        <div style={{ fontFamily: FONT_SUB, fontWeight: 700, fontSize: 64, color: "#1F2A44", marginTop: 60 }}>
          Finanziert von: <span style={{ display: "inline-block", width: 300, borderBottom: "5px dashed #9B2226" }}>&nbsp;</span>
        </div>
      </Stage>
      <div style={{ position: "absolute", left: 540 + mx - 200, top: 640 }}>
        <Magnifier size={420} />
      </div>
      <Slam at={stampAt} style={{ left: 0, right: 0, top: 380, display: "flex", justifyContent: "center" }}>
        <Stamp text="VERSCHWIEGEN" size={130} rotate={-9} />
      </Slam>
    </AbsoluteFill>
  );
};

// =============== Szene 5 – "fettarm" (modern, Farbe) ===============
export const Scene5: React.FC<SceneProps> = ({ dur }) => {
  const T = useT(4, dur);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.4}>
        <WantedShot />
      </Cut>
      <Cut T={T} a={2.4} b={4.5}>
        <ShelfShot at={T(3.49) - T(2.4)} step={Math.max(1, T(0.12))} />
      </Cut>
      <Cut T={T} a={4.5} b={SCENES[4].seconds}>
        <SugarYogurtShot at={T(5.5) - T(4.5)} step={Math.max(1, T(0.1))} />
      </Cut>
    </AbsoluteFill>
  );
};

const WantedShot: React.FC = () => {
  const frame = useCurrentFrame();
  const z = useCam(1.5);
  return (
    <AbsoluteFill>
      <Bg a="#6A3E1E" b="#140A04" />
      <Stage style={{ transform: `scale(${z}) rotate(${Math.sin(frame / 20) * 1}deg)` }}>
        <Wanted width={680}>
          <Butter size={380} evil={1} />
        </Wanted>
      </Stage>
    </AbsoluteFill>
  );
};

const ShelfShot: React.FC<{ at: number; step: number }> = ({ at, step }) => {
  const frame = useCurrentFrame();
  const z = useCam(1.4);
  const items = [
    { c: "#E76F51", n: "KEKSE" },
    { c: "#2A9D8F", n: "JOGHURT" },
    { c: "#E9C46A", n: "MÜSLI" },
    { c: "#8E7DBE", n: "DRESSING" },
    { c: "#F4A261", n: "PUDDING" },
    { c: "#577590", n: "SNACK" },
  ];
  return (
    <AbsoluteFill>
      <Bg a="#E8F1F2" b="#9FB3C8" rays={false} />
      <Stage style={{ transform: `scale(${z})` }}>
        {[0, 1].map((row) => (
          <div key={row} style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 30 }}>
            <div style={{ display: "flex", gap: 30 }}>
              {items.slice(row * 3, row * 3 + 3).map((it, i) => {
                const k = row * 3 + i;
                const p = spring({ frame: frame - at - Math.floor(k / 2) * step, fps: 30, config: { damping: 11, stiffness: 260 } });
                return (
                  <div key={k} style={{ position: "relative" }}>
                    <Box width={230} color={it.c} name={it.n} />
                    {frame >= at + Math.floor(k / 2) * step && (
                      <div
                        style={{
                          position: "absolute",
                          left: -10,
                          right: -10,
                          top: 120,
                          transform: `rotate(-10deg) scale(${p})`,
                          background: "#D00000",
                          color: "#fff",
                          fontFamily: FONT_BOLD,
                          fontSize: 54,
                          textAlign: "center",
                          borderRadius: 10,
                          boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
                        }}
                      >
                        FETTARM
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ width: 860, height: 26, background: "linear-gradient(#C9CED6, #8A93A3)", borderRadius: 6, marginTop: 4 }} />
          </div>
        ))}
      </Stage>
    </AbsoluteFill>
  );
};

const SugarYogurtShot: React.FC<{ at: number; step: number }> = ({ at, step }) => {
  const frame = useCurrentFrame();
  const z = useCam(1.4);
  const n = frame < at ? 0 : Math.min(6, Math.floor((frame - at) / step) + 1);
  return (
    <AbsoluteFill>
      <Bg a="#2A9D8F" b="#06201C" />
      <Stage style={{ transform: `scale(${z})` }}>
        <div style={{ position: "relative", width: 900, height: 860, display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
          <Yogurt width={420} />
          {Array.from({ length: n }).map((_, i) => {
            const s = spring({ frame: frame - at - i * step, fps: 30, config: { damping: 11, stiffness: 240 } });
            const ang = -Math.PI / 2 + (i - 2.5) * 0.42;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 380 + Math.cos(ang) * 330 * s,
                  top: 470 + Math.sin(ang) * 380 * s,
                  transform: `rotate(${i * 25}deg)`,
                }}
              >
                <Cube size={150} />
              </div>
            );
          })}
        </div>
      </Stage>
      {n > 0 && (
        <div
          style={{
            position: "absolute",
            right: 60,
            top: 200,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "#FFD166",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT_BOLD,
            fontSize: 70,
            color: "#1D2433",
            textAlign: "center",
            lineHeight: 0.95,
            transform: "rotate(10deg)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
          }}
        >
          MEHR
          <br />
          ZUCKER
        </div>
      )}
    </AbsoluteFill>
  );
};

// =============== Szene 6 – 2016: enthüllt ===============
export const Scene6: React.FC<SceneProps> = ({ dur }) => {
  const T = useT(5, dur);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.8}>
        <RevealShot stampAt={T(1.36)} />
      </Cut>
      <Cut T={T} a={2.8} b={SCENES[5].seconds}>
        <ArchiveShot />
      </Cut>
    </AbsoluteFill>
  );
};

const RevealShot: React.FC<{ stampAt: number }> = ({ stampAt }) => {
  const frame = useCurrentFrame();
  const z = useCam(1.5);
  return (
    <AbsoluteFill style={{ transform: shake(frame, stampAt, 10, 28) }}>
      <Bg a="#1D3557" b="#05080F" />
      <Stage style={{ transform: `scale(${z})` }}>
        <div
          style={{
            width: 820,
            background: "#FAFAF7",
            boxShadow: "0 30px 70px rgba(0,0,0,0.55)",
            padding: "34px 40px 44px",
            transform: "rotate(-2deg)",
            color: "#111",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "4px solid #111", paddingBottom: 8, fontFamily: FONT_SUB, fontWeight: 800, fontSize: 30 }}>
            <span>NACHRICHTEN</span>
            <span>SEPTEMBER 2016</span>
          </div>
          <div style={{ fontFamily: FONT_BOLD, fontSize: 92, lineHeight: 1.0, marginTop: 20 }}>
            ZUCKER-INDUSTRIE BEZAHLTE HARVARD-FORSCHER
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ height: 12, background: "#CFCFCF", marginTop: 18, width: `${95 - i * 12}%` }} />
          ))}
        </div>
      </Stage>
      <Slam at={stampAt} style={{ left: 0, right: 0, top: 860, display: "flex", justifyContent: "center" }}>
        <Stamp text="ENTHÜLLT" size={160} rotate={-8} />
      </Slam>
      <WhiteFlash len={4} />
    </AbsoluteFill>
  );
};

const ArchiveShot: React.FC = () => {
  const frame = useCurrentFrame();
  const z = useCam(1.3, 0.003);
  const lift = interpolate(frame, [6, 40], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Vintage strength={0.6}>
        <PaperBg />
        <Stage style={{ transform: `scale(${z})`, justifyContent: "flex-end", paddingBottom: 20 }}>
          <ArchiveBox width={900} lift={lift} />
        </Stage>
      </Vintage>
      <div style={{ position: "absolute", left: 600 + Math.sin(frame / 14) * 60, top: 330 + Math.cos(frame / 18) * 40 }}>
        <Magnifier size={300} />
      </div>
    </AbsoluteFill>
  );
};

// =============== Szene 7 – Folgen-Aufruf ===============
export const Scene7: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const bp = useSpr(0, 260, 12);
  const pulse = 1 + Math.sin((frame / 30) * Math.PI * 2 * 1.4) * 0.06;
  return (
    <AbsoluteFill>
      <Bg a="#3A0CA3" b="#0A0420" />
      <Stage style={{ justifyContent: "flex-start", paddingTop: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 30, transform: `scale(${bp})` }}>
          <Butter size={250} evil={0} />
          <Txt size={120} color="#FFD166">
            vs.
          </Txt>
          <Cube size={200} />
        </div>
        <div
          style={{
            marginTop: 60,
            transform: `scale(${pulse * bp})`,
            background: "linear-gradient(180deg, #FF3B6B, #E0115F)",
            color: "#fff",
            fontFamily: FONT_SUB,
            fontWeight: 900,
            fontSize: 96,
            padding: "26px 80px",
            borderRadius: 999,
            boxShadow: `0 0 ${40 + pulse * 40}px rgba(255,59,107,0.7), 0 14px 0 #8E0B3C`,
          }}
        >
          FOLGEN +
        </div>
        <div style={{ marginTop: 60, fontFamily: FONT_SUB, fontWeight: 800, fontSize: 62, color: "#fff", opacity: bp }}>Hättest du das gedacht? 👇</div>
      </Stage>
    </AbsoluteFill>
  );
};
