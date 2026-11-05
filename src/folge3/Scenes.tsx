import React from "react";
import { AbsoluteFill, Easing, interpolate, random, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_BOLD, FONT_SUB, FONT_VINTAGE, shake } from "../theme";
import { Vintage } from "../components/Overlays";
import { Stage } from "../scenes/helpers";
import {
  Diamond,
  FallingChart,
  Headquarters,
  Heart,
  Newspaper,
  Pawnshop,
  Payslip,
  PriceTag,
  Ring,
  Rock,
  ShopWindow,
  Sparkle,
  Stamp,
  SugarCube,
} from "./Graphics";
import { SCENES } from "./script";

export const FONT_SCRIPT = "Great Vibes";

export type SceneProps = { dur: number };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Zeiten im Skript sind Sekunden in der Sprachaufnahme -> in Frames dieser Szene umrechnen
const useT = (sceneIndex: number, dur: number) => {
  const planned = SCENES[sceneIndex].seconds;
  return (s: number) => Math.round((s / planned) * dur);
};

// Ein Schnitt von a bis b (Sekunden)
const Cut: React.FC<{ T: (s: number) => number; a: number; b: number; children: React.ReactNode }> = ({ T, a, b, children }) => (
  <Sequence from={T(a)} durationInFrames={Math.max(1, T(b) - T(a))} layout="none">
    <AbsoluteFill>{children}</AbsoluteFill>
  </Sequence>
);

// harter Zoom am Anfang eines Schnitts
const useZoom = (from = 1.6, stiffness = 260) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 18, stiffness } });
  // danach ganz langsam weiter hineinzoomen (Ken Burns)
  return interpolate(s, [0, 1], [from, 1]) * (1 + frame * 0.0012);
};

const useSpring = (delay: number, stiffness = 200, damping = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness } });
};

// ---------- Hintergründe ----------
const LuxBg: React.FC<{ a?: string; b?: string }> = ({ a = "#2A1B4A", b = "#07060F" }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 33%, ${a} 0%, ${b} 72%)` }}>
      <AbsoluteFill style={{ opacity: 0.08, transform: `rotate(${frame * 0.3}deg) scale(2.4)`, top: -300 }}>
        <svg viewBox="-100 -100 200 200" width="100%" height="100%">
          {Array.from({ length: 18 }).map((_, i) => {
            const a1 = (i / 18) * Math.PI * 2;
            const a2 = a1 + Math.PI / 18;
            return (
              <polygon key={i} points={`0,0 ${Math.cos(a1) * 200},${Math.sin(a1) * 200} ${Math.cos(a2) * 200},${Math.sin(a2) * 200}`} fill="#fff" />
            );
          })}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const PaperBg: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 35%, #F6EBD0 0%, #DCC59A 70%, #B99A68 100%)" }} />
);

const Twinkles: React.FC<{ n?: number; area?: [number, number, number, number]; seed?: string }> = ({
  n = 8,
  area = [140, 200, 800, 800],
  seed = "tw",
}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const period = 24 + Math.floor(random(`${seed}p${i}`) * 20);
        const ph = ((frame + random(`${seed}o${i}`) * period) % period) / period;
        const s = Math.sin(ph * Math.PI);
        return (
          <Sparkle
            key={i}
            size={30 + random(`${seed}s${i}`) * 50}
            style={{
              position: "absolute",
              left: area[0] + random(`${seed}x${i}`) * area[2],
              top: area[1] + random(`${seed}y${i}`) * area[3],
              opacity: s,
              transform: `scale(${0.4 + s * 0.8}) rotate(${frame * 2}deg)`,
            }}
          />
        );
      })}
    </>
  );
};

const Label: React.FC<{ children: React.ReactNode; size?: number; color?: string; font?: string; style?: React.CSSProperties }> = ({
  children,
  size = 90,
  color = "#fff",
  font = FONT_BOLD,
  style,
}) => (
  <div style={{ fontFamily: font, fontSize: size, color, textAlign: "center", lineHeight: 1.05, ...style }}>{children}</div>
);

// Stempel, der von groß auf klein knallt
const SlamStamp: React.FC<{ at: number; text: string; size?: number; style?: React.CSSProperties }> = ({ at, text, size = 130, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = spring({ frame: frame - at, fps, config: { damping: 13, stiffness: 320 } });
  return (
    <div
      style={{
        position: "absolute",
        transform: `scale(${interpolate(s, [0, 1], [3, 1])})`,
        opacity: interpolate(frame - at, [0, 2], [0, 1], clamp),
        ...style,
      }}
    >
      <Stamp text={text} size={size} />
    </div>
  );
};

const WhiteFlash: React.FC<{ at?: number; len?: number }> = ({ at = 0, len = 6 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + len], [1, 0], clamp);
  return o > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: o }} /> : null;
};

// =============== Szene 1 – HOOK ===============
export const Scene1: React.FC<SceneProps> = ({ dur }) => {
  const T = useT(0, dur);
  return (
    <AbsoluteFill>
      {/* 0–0,3 s: Makro auf den Diamanten, Knall + Blitz */}
      <Cut T={T} a={0} b={0.3}>
        <HookMacro />
      </Cut>
      {/* 0,3–2,2 s: harter Zoom auf den Ring, Preisschild klappt auf */}
      <Cut T={T} a={0.3} b={2.2}>
        <HookRing flipAt={T(0.6) - T(0.3)} />
      </Cut>
      {/* 2,2–4,1 s: Preisschild groß, Stempel WERBUNG knallt */}
      <Cut T={T} a={2.2} b={4.1}>
        <HookTag stampAt={T(2.5) - T(2.2)} />
      </Cut>
      {/* 4,1 s – Ende: fast jeder macht mit */}
      <Cut T={T} a={4.1} b={SCENES[0].seconds}>
        <HookEveryone />
      </Cut>
    </AbsoluteFill>
  );
};

const HookMacro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ transform: shake(frame, 0, 8, 34) }}>
      <LuxBg a="#3B6FB6" b="#0A0F24" />
      <Stage>
        <Diamond size={980} style={{ transform: `scale(${1.5 - frame * 0.03}) rotate(${frame * 1.5}deg)` }} />
      </Stage>
      <Twinkles n={10} seed="m" />
      <WhiteFlash len={7} />
    </AbsoluteFill>
  );
};

const HookRing: React.FC<{ flipAt: number }> = ({ flipAt }) => {
  const frame = useCurrentFrame();
  const z = useZoom(2.4, 300);
  const flip = useSpring(flipAt, 220, 12);
  return (
    <AbsoluteFill>
      <LuxBg />
      <Stage style={{ transform: `scale(${z})` }}>
        <div style={{ position: "relative", width: 900, height: 820 }}>
          <Ring size={680} style={{ position: "absolute", left: 40, top: 30, transform: `rotate(${Math.sin(frame / 12) * 3}deg)` }} />
          <div style={{ position: "absolute", left: 520, top: 470, transform: `rotate(${8 + Math.sin(frame / 9) * 4}deg)` }}>
            {frame >= flipAt && <PriceTag text="???" width={340} flip={flip} />}
          </div>
        </div>
      </Stage>
      <Twinkles n={9} seed="r" area={[150, 250, 700, 600]} />
      <WhiteFlash len={4} />
    </AbsoluteFill>
  );
};

const HookTag: React.FC<{ stampAt: number }> = ({ stampAt }) => {
  const frame = useCurrentFrame();
  const z = useZoom(1.5);
  return (
    <AbsoluteFill style={{ transform: shake(frame, stampAt, 10, 30) }}>
      <LuxBg a="#5A2346" b="#0D0610" />
      <Stage style={{ transform: `scale(${z})` }}>
        <div style={{ transform: `rotate(${-6 + Math.sin(frame / 10) * 2}deg)` }}>
          <PriceTag text="???" width={780} />
        </div>
        <SlamStamp at={stampAt} text="WERBUNG" size={150} style={{ top: 420 }} />
      </Stage>
    </AbsoluteFill>
  );
};

const HookEveryone: React.FC = () => {
  const frame = useCurrentFrame();
  const z = useZoom(1.4);
  return (
    <AbsoluteFill>
      <LuxBg a="#1C3557" b="#05070D" />
      <Stage style={{ transform: `scale(${z})` }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 280px)", gap: 24 }}>
          {Array.from({ length: 9 }).map((_, i) => {
            const p = spring({ frame: frame - i * 3, fps: 30, config: { damping: 12, stiffness: 200 } });
            return (
              <div
                key={i}
                style={{
                  height: 260,
                  borderRadius: 26,
                  background: "radial-gradient(circle at 50% 40%, #A3142F, #4A0716)",
                  boxShadow: "inset 0 -14px 0 rgba(0,0,0,0.3), 0 10px 30px rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${p})`,
                }}
              >
                <Ring size={200} />
              </div>
            );
          })}
        </div>
      </Stage>
      <WhiteFlash len={4} />
    </AbsoluteFill>
  );
};

// =============== Szene 2 – früher / Wirtschaftskrise (Sepia) ===============
export const Scene2: React.FC<SceneProps> = ({ dur }) => {
  const T = useT(1, dur);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.9}>
        <Vintage>
          <EarlierShot />
        </Vintage>
      </Cut>
      <Cut T={T} a={2.9} b={5.5}>
        <Vintage>
          <EmptyShopShot typeAt={[T(3.5), T(3.62), T(3.74)].map((x) => x - T(2.9))} />
        </Vintage>
      </Cut>
      <Cut T={T} a={5.5} b={SCENES[1].seconds}>
        <Vintage>
          <CrisisChartShot len={T(SCENES[1].seconds) - T(5.5)} />
        </Vintage>
      </Cut>
    </AbsoluteFill>
  );
};

const EarlierShot: React.FC = () => {
  const z = useZoom(1.5);
  const q = useSpring(22, 160, 10);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Stage style={{ transform: `scale(${z})` }}>
        <Label font={FONT_VINTAGE} size={110} color="#2B1D0E" style={{ marginBottom: 20 }}>
          Früher
        </Label>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Ring size={470} plain />
            <Label font={FONT_VINTAGE} size={48} color="#2B1D0E">
              schlichter Ring
            </Label>
          </div>
          <div style={{ position: "relative", transform: `scale(${q})` }}>
            <Diamond size={300} glow={0} tint="#ddd" style={{ opacity: 0.6 }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_BOLD, fontSize: 260, color: "#8C1C13" }}>
              ?
            </div>
          </div>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

const EmptyShopShot: React.FC<{ typeAt: number[] }> = ({ typeAt }) => {
  const frame = useCurrentFrame();
  const z = useZoom(1.5);
  const steps = ["19", "1930", "1930er"];
  const n = typeAt.filter((t) => frame >= t).length;
  return (
    <AbsoluteFill>
      <PaperBg />
      <Stage style={{ transform: `scale(${z})` }}>
        <ShopWindow width={860} />
      </Stage>
      {n > 0 && (
        <div style={{ position: "absolute", top: 190, width: "100%", display: "flex", justifyContent: "center" }}>
          <div style={{ background: "#2B1D0E", color: "#F1E6C8", fontFamily: FONT_VINTAGE, fontSize: 110, padding: "4px 40px", transform: "rotate(-3deg)" }}>
            {steps[n - 1]}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const CrisisChartShot: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();
  const z = useZoom(1.4);
  const p = interpolate(frame, [4, len * 0.75], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill>
      <PaperBg />
      <Stage style={{ transform: `scale(${z})` }}>
        <Label font={FONT_VINTAGE} size={78} color="#8C1C13" style={{ marginBottom: 20 }}>
          Wirtschaftskrise
        </Label>
        <FallingChart progress={p} width={900} />
      </Stage>
    </AbsoluteFill>
  );
};

// =============== Szene 3 – De Beers & der Slogan ===============
export const Scene3: React.FC<SceneProps> = ({ dur }) => {
  const T = useT(2, dur);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.8}>
        <Vintage>
          <HQShot />
        </Vintage>
      </Cut>
      <Cut T={T} a={2.8} b={6.85}>
        <Vintage>
          <CampaignShot yearAt={T(4.0) - T(2.8)} step={T(4.09) - T(4.0)} />
        </Vintage>
      </Cut>
      <Cut T={T} a={6.85} b={SCENES[2].seconds}>
        <Vintage strength={0.55}>
          <PosterShot writeAt={T(6.95) - T(6.85)} transAt={T(8.97) - T(6.85)} />
        </Vintage>
      </Cut>
    </AbsoluteFill>
  );
};

const HQShot: React.FC = () => {
  const frame = useCurrentFrame();
  const z = useZoom(1.6);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Stage style={{ transform: `scale(${z})` }}>
        <Headquarters width={900} smoke={frame / 30} />
      </Stage>
    </AbsoluteFill>
  );
};

const CampaignShot: React.FC<{ yearAt: number; step: number }> = ({ yearAt, step }) => {
  const frame = useCurrentFrame();
  const z = useZoom(1.3);
  const papers = [
    { x: -180, y: -90, r: -14, h: "Ein Diamant!" },
    { x: 170, y: -40, r: 10, h: "Für die Liebe" },
    { x: 0, y: 110, r: -3, h: "Kauf Diamanten" },
  ];
  const year = Math.min(1947, 1938 + Math.max(0, Math.floor((frame - yearAt) / Math.max(1, step)) + 1));
  const yp = useSpring(yearAt, 260, 14);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Stage style={{ transform: `scale(${z})` }}>
        {papers.map((p, i) => {
          const s = spring({ frame: frame - i * 6, fps: 30, config: { damping: 15, stiffness: 170 } });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                transform: `translate(${p.x + (1 - s) * (i % 2 ? 900 : -900)}px, ${p.y}px) rotate(${p.r + (1 - s) * 40}deg)`,
              }}
            >
              <Newspaper width={480} headline={p.h} />
            </div>
          );
        })}
      </Stage>
      {frame >= yearAt && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", top: 170, height: 940 }}>
          <div
            style={{
              background: "#2B1D0E",
              color: "#F1E6C8",
              fontFamily: FONT_VINTAGE,
              fontSize: 230,
              padding: "0 60px",
              transform: `scale(${interpolate(yp, [0, 1], [1.8, 1])}) rotate(-4deg)`,
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {year}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

const PosterShot: React.FC<{ writeAt: number; transAt: number }> = ({ writeAt, transAt }) => {
  const frame = useCurrentFrame();
  const z = useZoom(1.5);
  const write = interpolate(frame, [writeAt, writeAt + 40], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const tr = useSpring(transAt, 200, 15);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "#3A2E22" }} />
      <Stage style={{ transform: `scale(${z})` }}>
        {/* Werbeplakat im 1940er-Stil */}
        <div
          style={{
            width: 760,
            height: 920,
            background: "linear-gradient(180deg, #1F3A5F 0%, #0E1B2E 100%)",
            border: "14px solid #E8D5A3",
            outline: "4px solid #E8D5A3",
            outlineOffset: -34,
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <svg width="760" height="920" viewBox="0 0 100 121" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, opacity: 0.18 }}>
            {Array.from({ length: 16 }).map((_, i) => {
              const a = (Math.PI * (i + 0.5)) / 16;
              return (
                <polygon
                  key={i}
                  points={`50,52 ${50 + Math.cos(a - 0.05) * 120},${52 - Math.sin(a - 0.05) * 120} ${50 + Math.cos(a + 0.05) * 120},${52 - Math.sin(a + 0.05) * 120}`}
                  fill="#E8D5A3"
                />
              );
            })}
          </svg>
          <div style={{ fontFamily: FONT_SUB, fontWeight: 800, letterSpacing: 10, color: "#E8D5A3", fontSize: 30, marginTop: 70 }}>DE BEERS · 1947</div>
          <div style={{ marginTop: 40, transform: `rotate(${Math.sin(frame / 15) * 3}deg)` }}>
            <Diamond size={330} />
          </div>
          {/* Slogan in Schreibschrift, wird "geschrieben" */}
          <div
            style={{
              fontFamily: FONT_SCRIPT,
              fontSize: 118,
              color: "#FFF4D6",
              lineHeight: 1.0,
              textAlign: "center",
              marginTop: 30,
              clipPath: `inset(0 ${(1 - write) * 100}% 0 0)`,
              textShadow: "0 4px 18px rgba(0,0,0,0.5)",
            }}
          >
            A Diamond
            <br />
            is Forever
          </div>
          <div
            style={{
              fontFamily: FONT_VINTAGE,
              fontSize: 44,
              color: "#E8D5A3",
              marginTop: 18,
              opacity: tr,
              transform: `translateY(${(1 - tr) * 30}px)`,
            }}
          >
            „Ein Diamant ist für immer“
          </div>
        </div>
      </Stage>
      <Twinkles n={6} seed="p" area={[300, 420, 480, 300]} />
    </AbsoluteFill>
  );
};

// =============== Szene 4 – Liebe = Diamant, Pfandhaus ===============
export const Scene4: React.FC<SceneProps> = ({ dur }) => {
  const T = useT(3, dur);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={3.8}>
        <MergeShot mergeAt={T(0.9)} infAt={T(1.4)} />
      </Cut>
      <Cut T={T} a={3.8} b={SCENES[3].seconds}>
        <PawnShot crossAt={T(5.1) - T(3.8)} breakAt={T(6.0) - T(3.8)} />
      </Cut>
    </AbsoluteFill>
  );
};

const MergeShot: React.FC<{ mergeAt: number; infAt: number }> = ({ mergeAt, infAt }) => {
  const frame = useCurrentFrame();
  const z = useZoom(1.4);
  const m = interpolate(frame, [0, mergeAt], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const merged = frame >= mergeAt;
  const pm = useSpring(mergeAt, 220, 10);
  const inf = interpolate(frame, [infAt, infAt + 25], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <LuxBg a="#6B1F3A" b="#12040A" />
      <Stage style={{ transform: `scale(${z})` }}>
        {!merged ? (
          <div style={{ position: "relative", width: 1000, height: 500 }}>
            <Heart size={330} style={{ position: "absolute", left: 40 + m * 300, top: 80 }} />
            <Diamond size={300} style={{ position: "absolute", left: 640 - m * 300, top: 90 }} />
          </div>
        ) : (
          <div style={{ position: "relative", transform: `scale(${pm})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Heart size={560} color="#E5383B" />
            <Diamond size={240} style={{ position: "absolute", top: 120 }} />
          </div>
        )}
        <svg width="520" height="220" viewBox="0 0 260 110" style={{ marginTop: 10 }}>
          <path
            d="M130,55 C100,10 40,10 40,55 C40,100 100,100 130,55 C160,10 220,10 220,55 C220,100 160,100 130,55 Z"
            fill="none"
            stroke="#FFD166"
            strokeWidth="12"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - inf}
          />
        </svg>
      </Stage>
      <Twinkles n={7} seed="h" />
      {merged && <WhiteFlash at={mergeAt} len={6} />}
    </AbsoluteFill>
  );
};

const PawnShot: React.FC<{ crossAt: number; breakAt: number }> = ({ crossAt, breakAt }) => {
  const frame = useCurrentFrame();
  const z = useZoom(1.5);
  const cross = interpolate(frame, [crossAt, crossAt + 14], [0, 1], clamp);
  const br = interpolate(frame, [breakAt, breakAt + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const hp = useSpring(breakAt - 8, 220, 12);
  return (
    <AbsoluteFill>
      <LuxBg a="#3B4252" b="#0B0D12" />
      <Stage style={{ transform: `scale(${z})` }}>
        <Pawnshop width={860} cross={cross} />
      </Stage>
      {frame >= breakAt - 8 && (
        <div style={{ position: "absolute", left: 640, top: 760, transform: `scale(${hp}) rotate(8deg)` }}>
          <Heart size={300} broken={br} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// =============== Szene 5 – Monatsgehälter & Gefühl ===============
export const Scene5: React.FC<SceneProps> = ({ dur }) => {
  const T = useT(4, dur);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.4}>
        <PayslipShot at={[T(0.35), T(0.85), T(1.35)]} />
      </Cut>
      <Cut T={T} a={2.4} b={4.6}>
        <RulePriceShot stampAt={T(3.96) - T(2.4)} />
      </Cut>
      <Cut T={T} a={4.6} b={SCENES[4].seconds}>
        <FeelingShot bigAt={T(5.5) - T(4.6)} crossAt={T(6.74) - T(4.6)} />
      </Cut>
    </AbsoluteFill>
  );
};

const PayslipShot: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const z = useZoom(1.4);
  const months = ["Januar", "Februar", "März"];
  const n = at.filter((t) => frame >= t).length;
  return (
    <AbsoluteFill>
      <LuxBg a="#1F4D3A" b="#06120D" />
      <Stage style={{ transform: `scale(${z})` }}>
        <div style={{ position: "relative", width: 600, height: 560 }}>
          {at.map((t, i) => {
            const s = spring({ frame: frame - t, fps: 30, config: { damping: 14, stiffness: 220 } });
            if (frame < t) return null;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 40 + i * 14,
                  top: 200 - i * 70 - (1 - s) * 700,
                  transform: `rotate(${(i - 1) * 5}deg)`,
                }}
              >
                <Payslip month={months[i]} />
              </div>
            );
          })}
        </div>
      </Stage>
      {n > 0 && (
        <div
          style={{
            position: "absolute",
            top: 190,
            right: 70,
            width: 230,
            height: 230,
            borderRadius: "50%",
            background: "#FFD166",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT_BOLD,
            fontSize: 130,
            color: "#1D2433",
            boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
            transform: "rotate(10deg)",
          }}
        >
          {n}×
        </div>
      )}
    </AbsoluteFill>
  );
};

const RulePriceShot: React.FC<{ stampAt: number }> = ({ stampAt }) => {
  const frame = useCurrentFrame();
  const z = useZoom(1.5);
  return (
    <AbsoluteFill style={{ transform: shake(frame, stampAt, 10, 28) }}>
      <LuxBg />
      <Stage style={{ transform: `scale(${z})` }}>
        <Ring size={520} />
        <div style={{ marginTop: -40, transform: "rotate(-4deg)" }}>
          <PriceTag text="3 Gehälter" width={640} fontScale={0.15} />
        </div>
        <SlamStamp at={stampAt} text="WERBUNG" size={140} style={{ top: 330 }} />
      </Stage>
    </AbsoluteFill>
  );
};

const FeelingShot: React.FC<{ bigAt: number; crossAt: number }> = ({ bigAt, crossAt }) => {
  const frame = useCurrentFrame();
  const big = useSpring(bigAt, 240, 11);
  const cross = interpolate(frame, [crossAt, crossAt + 10], [0, 1], clamp);
  const z = useZoom(1.3);
  return (
    <AbsoluteFill>
      <LuxBg a="#7A1E48" b="#120511" />
      <Stage style={{ transform: `scale(${z})` }}>
        {frame < bigAt ? (
          <Label font={FONT_BOLD} size={150} color="#FFD166">
            DER TRICK
          </Label>
        ) : (
          <div
            style={{
              fontFamily: FONT_BOLD,
              fontSize: 250,
              lineHeight: 1,
              background: "linear-gradient(180deg, #FFF1B0, #FF7EB6)",
              WebkitBackgroundClip: "text",
              color: "transparent",
              transform: `scale(${interpolate(big, [0, 1], [2.2, 1])})`,
              filter: "drop-shadow(0 0 30px rgba(255,126,182,0.7))",
            }}
          >
            GEFÜHL
          </div>
        )}
        <div style={{ position: "relative", marginTop: 50 }}>
          <Rock size={260} />
          <svg width="300" height="200" viewBox="0 0 300 200" style={{ position: "absolute", left: -20, top: -10 }}>
            <line x1="20" y1="180" x2={20 + 260 * cross} y2={180 - 160 * cross} stroke="#E01E37" strokeWidth="18" strokeLinecap="round" />
          </svg>
          <Label font={FONT_SUB} size={46} color="#C9CDD4" style={{ fontWeight: 800 }}>
            Stein
          </Label>
        </div>
      </Stage>
      <Twinkles n={6} seed="g" />
    </AbsoluteFill>
  );
};

// =============== Szene 6 – Folgen-Aufruf ===============
export const Scene6: React.FC<SceneProps> = ({ dur }) => {
  const T = useT(5, dur);
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin((frame / 30) * Math.PI * 2 * 1.4) * 0.06;
  const bp = useSpring(0, 260, 12);
  const teaserCut = T(1.3);
  return (
    <AbsoluteFill>
      <LuxBg a="#3A0CA3" b="#0A0420" />
      <Stage style={{ justifyContent: "flex-start", paddingTop: 30 }}>
        {/* oben: Teaser für Teil 4 */}
        <div style={{ height: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {frame < teaserCut ? (
            <Label size={190} color="#FFD166" style={{ transform: `scale(${interpolate(bp, [0, 1], [1.8, 1])})` }}>
              TEIL 4
            </Label>
          ) : (
            <TeaserSugar start={teaserCut} />
          )}
        </div>
        {/* pulsierender Folgen-Button */}
        <div
          style={{
            marginTop: 40,
            transform: `scale(${pulse * bp})`,
            background: "linear-gradient(180deg, #FF3B6B, #E0115F)",
            color: "#fff",
            fontFamily: FONT_SUB,
            fontWeight: 900,
            fontSize: 96,
            padding: "26px 80px",
            borderRadius: 999,
            boxShadow: `0 0 ${40 + pulse * 40}px rgba(255,59,107,0.7), 0 14px 0 #8E0B3C`,
            letterSpacing: 2,
          }}
        >
          FOLGEN +
        </div>
        <div style={{ marginTop: 60, fontFamily: FONT_SUB, fontWeight: 800, fontSize: 62, color: "#fff", opacity: bp }}>
          Wusstest du das? 👇
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

const TeaserSugar: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame() - start;
  const s = spring({ frame, fps: 30, config: { damping: 12, stiffness: 220 } });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 30, transform: `scale(${interpolate(s, [0, 1], [1.6, 1])})` }}>
      <SugarCube size={260} style={{ transform: `rotate(${Math.sin(frame / 8) * 6}deg)` }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <Label size={110} color="#FFD166">
          TEIL 4
        </Label>
        <Label size={70} color="#fff" style={{ textAlign: "left" }}>
          ZUCKER-
          <br />
          INDUSTRIE 💰
        </Label>
      </div>
    </div>
  );
};
