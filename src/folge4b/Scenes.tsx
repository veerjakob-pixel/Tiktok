// Folge 4 als Story: Supermarkt-Szene (Gespräch) -> Rückblick (3D-Einstellungen) -> zurück im Supermarkt.
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { Vintage } from "../components/Overlays";
import { Stamp } from "../folge3/Graphics";
import { FONT_SUB } from "../theme";
import { Cut, Slam, Txt, WhiteFlash } from "../folge4/Scenes";
import { add, Bill, clamp, shake3, Stage3D, SugarCube, useBillTexture, V3 } from "../folge4-3d/Kit";
import {
  ArchiveShot,
  FinePrintShot,
  HeartShot,
  JournalShot,
  MoneyShot,
  PaymentShot,
  RevealShot,
  ScaleShot,
  ShelfShot,
  TVShot,
  WantedShot,
  YearShot,
  YogurtShot,
} from "../folge4-3d/Scenes3D";
import { Cup, faceAt, Look, Market, Person, useCupLabel } from "./People";
import { FPS } from "../folge3/script";
import { speakingAt, Who } from "./script";

export type SceneProps = { dur: number; from: number };
const T = (s: number) => Math.round(s * FPS);

// ---------- Supermarkt-Bühne mit beiden Figuren ----------
const LENA = { pos: [-0.45, 0, 0.2] as V3, rot: 0.55, head: [-0.45, 1.62, 0.2] as V3 };
const ICH = { pos: [0.5, 0, 0.3] as V3, rot: -0.55, head: [0.5, 1.62, 0.3] as V3 };

const useCups = () => ({
  fett: useCupLabel("FETTARM", "#2A9D8F", "nur 0,1 % Fett"),
  normal: useCupLabel("NATUR", "#3D5A80", "3,8 % Fett"),
  berry: useCupLabel("BEERE", "#C9184A", "fruchtig"),
});

// Wer spricht gerade? (für Mund + Blinzeln)
const useFaces = (t0: number) => {
  const frame = useCurrentFrame();
  const t = t0 + frame / FPS;
  const f = (who: Who, seed: number) => faceAt(frame, speakingAt(who, t), seed);
  return { lena: f("lena", 1), ich: f("ich", 4) };
};

const MarketScene: React.FC<{
  t0: number;
  cam: V3;
  look: V3;
  fov?: number;
  lena?: Look;
  ich?: Look;
  lenaCup?: "fett" | "normal" | null;
  children?: React.ReactNode;
  lift?: number;
}> = ({ t0, cam, look, fov = 32, lena = {}, ich = {}, lenaCup = "fett", children, lift = 0 }) => {
  const cups = useCups();
  const faces = useFaces(t0);
  return (
    <Stage3D cam={cam} look={look} fov={fov} floor={null} dist={1} lift={lift} exposure={0.9} rim="#ffe8c8">
      <Market cups={cups} />
      <Person
        position={LENA.pos}
        rotation={[0, LENA.rot, 0]}
        shirt="#E76F51"
        hair="#5A3A1A"
        hairStyle="long"
        look={{ ...faces.lena, ...lena }}
        hand={lenaCup ? <Cup label={lenaCup === "fett" ? cups.fett : cups.normal} scale={0.22} rotation={[0, -Math.PI / 2 - 0.4, 0]} /> : undefined}
      />
      <Person position={ICH.pos} rotation={[0, ICH.rot, 0]} shirt="#264653" hair="#2B1D0E" hairStyle="short" skin="#E8B996" look={{ ...faces.ich, ...ich }} />
      {children}
    </Stage3D>
  );
};

const MarketBg: React.FC = () => <AbsoluteFill style={{ background: "linear-gradient(#C9D8E3, #E9EEF2)" }} />;

// Nahaufnahme vor dem Gesicht einer Figur (Kamera in Blickrichtung)
const closeUp = (who: typeof LENA, d = 2.2, side = 0): { cam: V3; look: V3 } => {
  const dir: V3 = [Math.sin(who.rot), 0, Math.cos(who.rot)];
  return {
    cam: [who.head[0] + dir[0] * d + side, who.head[1] + 0.05, who.head[2] + dir[2] * d],
    look: [who.head[0], who.head[1] - 0.36, who.head[2]],
  };
};

// Name einblenden, wer spricht
const NameTag: React.FC<{ name: string; color: string; top?: number }> = ({ name, color, top = 210 }) => {
  const s = spring({ frame: useCurrentFrame(), fps: FPS, config: { damping: 14, stiffness: 220 } });
  return (
    <div style={{ position: "absolute", top, left: 60, transform: `translateX(${(1 - s) * -300}px)`, background: color, color: "#fff", fontFamily: FONT_SUB, fontWeight: 900, fontSize: 44, padding: "8px 26px", borderRadius: 14, boxShadow: "0 8px 20px rgba(0,0,0,0.3)" }}>
      {name}
    </div>
  );
};

// VHS-Effekt: Zurückspulen / Abspielen
const Vhs: React.FC<{ mode: "rewind" | "play"; label: string }> = ({ mode, label }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 3px, transparent 3px 7px)" }} />
      {mode === "rewind" &&
        Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: ((random(`vy${i}`) * 1920 + frame * 140 * (1 + i * 0.3)) % 2100) - 100, height: 18 + random(`vh${i}`) * 40, background: "rgba(255,255,255,0.35)", filter: "blur(3px)" }} />
        ))}
      <div style={{ position: "absolute", top: 200, right: 60, fontFamily: "monospace", fontWeight: 900, fontSize: 74, color: "#fff", textShadow: "3px 0 #ff2a6d, -3px 0 #05d9e8", opacity: frame % 20 < 14 ? 1 : 0.2 }}>
        {mode === "rewind" ? "◀◀" : "▶"} {label}
      </div>
    </AbsoluteFill>
  );
};

// =============== Szene 1 – Supermarkt ===============
export const Scene1: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={1.2}>
        <CupMacro />
      </Cut>
      <Cut T={T} a={1.2} b={4.2}>
        <TwoShot t0={t0 + 1.2} />
      </Cut>
      <Cut T={T} a={4.2} b={6.85}>
        <IchClose t0={t0 + 4.2} look={{ brow: 0.6 }} tag />
      </Cut>
      <Cut T={T} a={6.85} b={8.5}>
        <SugarDrop t0={t0 + 6.85} />
      </Cut>
      <Cut T={T} a={8.5} b={10.3}>
        <MoneyRain t0={t0 + 8.5} stampAt={T(9.48 - 8.5)} />
      </Cut>
      <Cut T={T} a={10.3} b={12.17 + 1}>
        <LenaClose t0={t0 + 10.3} look={{ brow: -1, headTilt: 0.12 }} />
      </Cut>
    </AbsoluteFill>
  );
};

// 0–1,2 s: Makro auf den Fettarm-Joghurt, Kamera fährt schnell zurück
const CupMacro: React.FC = () => {
  const frame = useCurrentFrame();
  const cups = useCups();
  const s = spring({ frame, fps: FPS, config: { damping: 20, stiffness: 120 } });
  const cam: V3 = [0.1, 1.25, interpolate(s, [0, 1], [1.7, 2.7])];
  return (
    <AbsoluteFill>
      <MarketBg />
      <Stage3D cam={cam} look={[0, 1.05, 0.5]} fov={32} floor={null} dist={1} lift={0} exposure={0.95}>
        <Market cups={cups} />
        <Cup label={cups.fett} position={[0, 1.15, 0.9]} rotation={[0.12, -Math.PI / 2 + 0.15 - frame * 0.006, 0]} scale={0.42} />
      </Stage3D>
      <WhiteFlash len={5} max={0.5} />
    </AbsoluteFill>
  );
};

const TwoShot: React.FC<{ t0: number }> = ({ t0 }) => {
  const frame = useCurrentFrame();
  const cam: V3 = [0.05, 1.45, 5.0 - frame * 0.006];
  return (
    <AbsoluteFill>
      <MarketBg />
      <MarketScene t0={t0} cam={cam} look={[0.02, 1.05, 0]} lena={{ armUp: 0.75, brow: 0.4 }} ich={{ headTurn: 0.1 }} lift={60} />
      <NameTag name="Lena" color="#E76F51" />
    </AbsoluteFill>
  );
};

const IchClose: React.FC<{ t0: number; look?: Look; tag?: boolean }> = ({ t0, look = {}, tag }) => {
  const frame = useCurrentFrame();
  const c = closeUp(ICH, 2.2 - frame * 0.004);
  return (
    <AbsoluteFill>
      <MarketBg />
      <MarketScene t0={t0} cam={c.cam} look={c.look} ich={{ ...look, smile: 0.3 }} lena={{ armUp: 0.4 }} fov={30} />
      {tag && <NameTag name="Ich" color="#264653" />}
    </AbsoluteFill>
  );
};

const LenaClose: React.FC<{ t0: number; look?: Look; cup?: "fett" | "normal" }> = ({ t0, look = {}, cup = "fett" }) => {
  const frame = useCurrentFrame();
  const c = closeUp(LENA, 2.2 - frame * 0.004);
  return (
    <AbsoluteFill>
      <MarketBg />
      <MarketScene t0={t0} cam={c.cam} look={c.look} lena={{ armUp: 0.35, ...look }} lenaCup={cup} fov={30} />
    </AbsoluteFill>
  );
};

// Riesiger Zuckerwürfel kracht in den Gang
const SugarDrop: React.FC<{ t0: number }> = ({ t0 }) => {
  const frame = useCurrentFrame();
  const drop = spring({ frame, fps: FPS, config: { damping: 9, stiffness: 380 } });
  const cam = add([0, 1.6, 5.4], shake3(frame, 3, 12, 0.12));
  return (
    <AbsoluteFill>
      <MarketBg />
      <MarketScene t0={t0} cam={cam} look={[0, 1.0, 0]} lena={{ brow: 1, armUp: 0.3 }} ich={{ brow: 0.5 }} lift={80}>
        <SugarCube position={[0.02, interpolate(drop, [0, 1], [5, 0.42]), 1.1]} rotation={[0, 0.5 + (1 - drop) * 2, 0]} scale={0.85} />
      </MarketScene>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0 }}>
        <Txt size={104} color="#fff" style={{ WebkitTextStroke: "4px #9B2226" }}>
          ZUCKER-INDUSTRIE
        </Txt>
      </div>
      <WhiteFlash at={3} len={5} max={0.5} />
    </AbsoluteFill>
  );
};

// Geld regnet im Supermarkt, Stempel BEZAHLT
const MoneyRain: React.FC<{ t0: number; stampAt: number }> = ({ t0, stampAt }) => {
  const frame = useCurrentFrame();
  const bill = useBillTexture();
  const cam = add([0.3, 1.7, 5.0 - frame * 0.006], shake3(frame, stampAt, 10, 0.08));
  return (
    <AbsoluteFill>
      <MarketBg />
      <MarketScene t0={t0} cam={cam} look={[0, 1.1, 0]} lena={{ brow: 1, armUp: 0.3 }} ich={{ smile: 0.5 }} lift={60}>
        {Array.from({ length: 34 }).map((_, i) => {
          const t = frame / 30 + random(`d${i}`) * 1.4;
          const y = 4 - ((t * (1.3 + random(`sp${i}`))) % 4.2);
          return <Bill key={i} tex={bill} position={[(random(`x${i}`) - 0.5) * 3.2, y, (random(`z${i}`) - 0.3) * 2]} rotation={[t * 2 + i, t * 1.3 + i, Math.sin(t * 3 + i) * 0.6]} scale={0.32} />;
        })}
      </MarketScene>
      <Slam at={stampAt} style={{ left: 0, right: 0, top: 560, display: "flex", justifyContent: "center" }}>
        <Stamp text="BEZAHLT" size={180} rotate={-10} />
      </Slam>
    </AbsoluteFill>
  );
};

// =============== Szene 2 – Zurückspulen in die 1960er ===============
export const Scene2: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={1.2}>
        <IchClose t0={t0} look={{ smile: 0.6 }} />
      </Cut>
      <Cut T={T} a={1.2} b={2.4}>
        <RewindShot t0={t0 + 1.2} />
      </Cut>
      <Cut T={T} a={2.4} b={4.7}>
        <Vintage>
          <TVShot />
        </Vintage>
        <YearTag text="USA · 1960er" />
      </Cut>
      <Cut T={T} a={4.7} b={7.807 + 1}>
        <Vintage>
          <HeartShot />
        </Vintage>
      </Cut>
    </AbsoluteFill>
  );
};

const YearTag: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", top: 210, right: 60, background: "rgba(43,29,14,0.85)", color: "#F1E6C8", fontFamily: "Abril Fatface", fontSize: 56, padding: "6px 26px", borderRadius: 10 }}>{text}</div>
);

const RewindShot: React.FC<{ t0: number }> = ({ t0 }) => {
  const frame = useCurrentFrame();
  const p = frame / 36;
  const cam: V3 = [Math.sin(frame * 0.4) * 0.05, 1.6, 4.6 + p * 5];
  return (
    <AbsoluteFill style={{ filter: `grayscale(${p}) sepia(${p * 0.8}) contrast(1.1)` }}>
      <MarketBg />
      <MarketScene t0={t0} cam={cam} look={[0, 1.1, 0]} lena={{ armUp: 0.75 - p * 0.6 }} />
      <Vhs mode="rewind" label="1960er" />
    </AbsoluteFill>
  );
};

// =============== Szene 3 – 1965: das Geld ===============
export const Scene3: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Cut T={T} a={0} b={1.5}>
      <Vintage>
        <YearShot step={T(0.1)} />
      </Vintage>
    </Cut>
    <Cut T={T} a={1.5} b={4.9}>
      <Vintage>
        <PaymentShot threeAt={T(2.69 - 1.5)} openAt={T(3.64 - 1.5)} />
      </Vintage>
    </Cut>
    <Cut T={T} a={4.9} b={7.663 + 1}>
      <Vintage strength={0.75}>
        <MoneyShot nowAt={T(5.03 - 4.9)} countAt={T(6.12 - 4.9)} step={T(0.08)} />
      </Vintage>
    </Cut>
  </AbsoluteFill>
);

// =============== Szene 4 – 1967: der Bericht ===============
export const Scene4: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Cut T={T} a={0} b={2.9}>
      <Vintage strength={0.7}>
        <JournalShot hiAt={T(0.3)} />
      </Vintage>
    </Cut>
    <Cut T={T} a={2.9} b={5.8}>
      <ScaleShot tiltAt={T(3.6 - 2.9)} sugarAt={T(4.85 - 2.9)} />
    </Cut>
    <Cut T={T} a={5.8} b={8.137 + 1}>
      <Vintage strength={0.6}>
        <FinePrintShot stampAt={T(7.22 - 5.8)} />
      </Vintage>
    </Cut>
  </AbsoluteFill>
);

// =============== Szene 5 – "fettarm" ===============
export const Scene5: React.FC<SceneProps> = () => (
  <AbsoluteFill>
    <Cut T={T} a={0} b={2.5}>
      <WantedShot />
    </Cut>
    <Cut T={T} a={2.5} b={4.4}>
      <ShelfShot at={T(3.28 - 2.5)} step={T(0.12)} />
    </Cut>
    <Cut T={T} a={4.4} b={6.424 + 1}>
      <YogurtShot at={T(5.3 - 4.4)} step={T(0.1)} />
    </Cut>
  </AbsoluteFill>
);

// =============== Szene 6 – zurück im Supermarkt ===============
export const Scene6: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={1.8}>
        <LenaClose t0={t0} look={{ brow: 1 }} />
        <PlayFlash />
      </Cut>
      <Cut T={T} a={1.8} b={4.4}>
        <RevealShot stampAt={T(2.94 - 1.8)} />
      </Cut>
      <Cut T={T} a={4.4} b={7.812 + 1}>
        <Vintage strength={0.55}>
          <ArchiveShot />
        </Vintage>
      </Cut>
    </AbsoluteFill>
  );
};

// kurzer "Play"-Moment: zurück in der Gegenwart
const PlayFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 6, 22], [1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Vhs mode="play" label="HEUTE" />
    </AbsoluteFill>
  );
};

// =============== Szene 7 – Lena tauscht den Joghurt ===============
export const Scene7: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.4}>
        <SwapShot t0={t0} />
      </Cut>
      <Cut T={T} a={2.4} b={4.521 + 1}>
        <OutroShot t0={t0 + 2.4} />
      </Cut>
    </AbsoluteFill>
  );
};

const SwapShot: React.FC<{ t0: number }> = ({ t0 }) => {
  const frame = useCurrentFrame();
  // Arm runter (Becher zurück ins Regal), neuer Becher, Arm wieder hoch
  const arm = frame < 22 ? interpolate(frame, [0, 20], [0.75, 0.05], clamp) : interpolate(frame, [24, 44], [0.05, 0.75], clamp);
  const cup = frame < 22 ? "fett" : "normal";
  const cam: V3 = [-0.1, 1.45, 4.4 - frame * 0.004];
  return (
    <AbsoluteFill>
      <MarketBg />
      <MarketScene t0={t0} cam={cam} look={[-0.2, 1.1, 0]} lena={{ armUp: arm, smile: frame > 30 ? 0.6 : 0 }} ich={{ smile: 0.5 }} lenaCup={cup} lift={40} />
      {frame >= 26 && (
        <div style={{ position: "absolute", top: 230, left: 0, right: 0, transform: `scale(${spring({ frame: frame - 26, fps: FPS, config: { damping: 12, stiffness: 220 } })})` }}>
          <Txt size={92} color="#3D5A80" style={{ textShadow: "0 6px 0 rgba(255,255,255,0.6)" }}>
            NATUR-JOGHURT ✓
          </Txt>
        </div>
      )}
    </AbsoluteFill>
  );
};

const OutroShot: React.FC<{ t0: number }> = ({ t0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bp = spring({ frame, fps, config: { damping: 12, stiffness: 260 } });
  const pulse = 1 + Math.sin((frame / 30) * Math.PI * 2 * 1.4) * 0.06;
  const cam: V3 = [0.1, 1.55, 5.2 + frame * 0.01];
  return (
    <AbsoluteFill>
      <MarketBg />
      <MarketScene t0={t0} cam={cam} look={[0, 1.25, 0]} lena={{ armUp: 0.6, smile: 0.7 }} ich={{ smile: 0.7, headTurn: 0.3 }} lenaCup="normal" lift={-120} />
      <div style={{ position: "absolute", top: 220, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            transform: `scale(${pulse * bp})`,
            background: "linear-gradient(180deg, #FF3B6B, #E0115F)",
            color: "#fff",
            fontFamily: FONT_SUB,
            fontWeight: 900,
            fontSize: 92,
            padding: "24px 76px",
            borderRadius: 999,
            boxShadow: `0 0 ${40 + pulse * 40}px rgba(255,59,107,0.7), 0 14px 0 #8E0B3C`,
          }}
        >
          FOLGEN +
        </div>
        <div style={{ marginTop: 34, fontFamily: FONT_SUB, fontWeight: 800, fontSize: 56, color: "#1D2433", opacity: bp, background: "rgba(255,255,255,0.75)", padding: "6px 24px", borderRadius: 14 }}>
          Hättest du's gewusst? 👇
        </div>
      </div>
    </AbsoluteFill>
  );
};
