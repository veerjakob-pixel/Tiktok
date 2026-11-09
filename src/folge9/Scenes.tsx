// Folge 9 "Black Friday – die erfundene Geschichte": Hook -> Philadelphia 1950er -> Stau, Polizei nennt den Tag
// "Black Friday" -> Händler hassen den Namen, 1961 "Big Friday" floppt -> 1981 neue Geschichte (rote/schwarze Zahlen)
// -> Lena: kam erst viel später -> der Trick.
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Vintage } from "../components/Overlays";
import { Stamp } from "../folge3/Graphics";
import { FONT_BOLD, FONT_SUB } from "../theme";
import { Cut, Slam, Txt } from "../folge4/Scenes";
import { add, Block, clamp, shake3, Sheet, Text3D, V3 } from "../folge4-3d/Kit";
import { FPS } from "../folge3/script";
import { speakingAt, TS, Who } from "./script";
import { CineStage } from "../folge6/Stage";
import { HEAD_Y, Human, Pose } from "../folge6/Human";
import { Coin, Glow } from "../folge6/Props";
import { NightStreet } from "../folge8/Props";
import { Car, Counter, DowntownStreet, PoliceCap, PriceTag, Shelves, ShoppingBag, TrafficLight, useBigFridayBanner, useLedger, usePriceTag, useShopWindow, useSignTexture, Whistle } from "./Props";

export type SceneProps = { dur: number; from: number };

// ---------- Abendstraße mit Lena + Florian ----------
const LENA = { pos: [-0.42, 0.14, 0.2] as V3, rot: 0.5, head: [-0.42, HEAD_Y + 0.14, 0.2] as V3 };
const FLO = { pos: [0.48, 0.14, 0.3] as V3, rot: -0.5, head: [0.48, HEAD_Y + 0.14, 0.3] as V3 };

const mouth = (frame: number, talking: boolean, seed: number) =>
  talking ? 0.2 + 0.8 * Math.abs(Math.sin(frame * 0.85 + seed) * Math.cos(frame * 0.37 + seed * 2)) : 0;

const useVoices = (t0: number) => {
  const frame = useCurrentFrame();
  const t = t0 + frame / FPS;
  const f = (who: Who, seed: number): Pose => {
    const talking = speakingAt(who, t);
    return { talking, talk: mouth(frame, talking, seed), blink: (frame + seed * 13) % 95 < 3 };
  };
  return { lena: f("lena", 1), florian: f("florian", 4) };
};

const CityBg: React.FC = () => <AbsoluteFill style={{ background: "linear-gradient(#060B1C 0%, #14213F 55%, #2B3557 100%)" }} />;

const CityScene: React.FC<{ t0: number; cam: V3; look: V3; fov?: number; lena?: Pose; flo?: Pose; lift?: number }> = ({ t0, cam, look, fov = 32, lena = {}, flo = {}, lift = 0 }) => {
  const frame = useCurrentFrame();
  const v = useVoices(t0);
  const sale = useSignTexture("SALE", "#111111", "#FFD60A", 512, 720);
  const bf = useSignTexture("-70%", "#D90429", "#FFFFFF", 512, 720);
  return (
    <CineStage cam={cam} look={look} fov={fov} lift={lift} exposure={1.05} key1="#9FB4FF" keyI={0.7} rim="#FFB870" rimI={1.4} amb={0.35} bloom={1.1} fog={{ color: "#141C33", near: 9, far: 26 }}>
      <NightStreet frame={frame} posters={[sale, bf, sale]} />
      <pointLight position={[0.2, 2.1, 3.2]} intensity={7} distance={9} decay={1.4} color="#FFD7A8" />
      <Human
        frame={frame}
        seed={1}
        position={LENA.pos}
        rotation={[0, LENA.rot, 0]}
        top="#E76F51"
        bottom="#2E3A59"
        shoes="#5A3A2A"
        skin="#EDC3A3"
        hair="#5A3A1A"
        hairStyle="long"
        iris="#4A6B3A"
        collar="#F4E4D4"
        pose={{ ...v.lena, ...lena }}
      />
      <Human
        frame={frame}
        seed={4}
        position={FLO.pos}
        rotation={[0, FLO.rot, 0]}
        top="#264653"
        bottom="#3A3A3A"
        skin="#E2B08E"
        hair="#2B1D0E"
        hairStyle="short"
        collar="#E9EEF2"
        pose={{ ...v.florian, ...flo }}
      />
    </CineStage>
  );
};

const closeUp = (who: typeof LENA, d = 1.4): { cam: V3; look: V3 } => {
  const dir: V3 = [Math.sin(who.rot), 0, Math.cos(who.rot)];
  return {
    cam: [who.head[0] + dir[0] * d, who.head[1] - 0.04, who.head[2] + dir[2] * d],
    look: [who.head[0], who.head[1] - 0.2, who.head[2]],
  };
};

const NameTag: React.FC<{ name: string; color: string; top?: number }> = ({ name, color, top = 210 }) => {
  const s = spring({ frame: useCurrentFrame(), fps: FPS, config: { damping: 14, stiffness: 220 } });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 60,
        transform: `translateX(${(1 - s) * -300}px)`,
        background: color,
        color: "#fff",
        fontFamily: FONT_SUB,
        fontWeight: 900,
        fontSize: 44,
        padding: "8px 26px",
        borderRadius: 14,
        boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
      }}
    >
      {name}
    </div>
  );
};

const YearTag: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", top: 210, right: 60, background: "rgba(43,29,14,0.85)", color: "#F1E6C8", fontFamily: "Abril Fatface", fontSize: 56, padding: "6px 26px", borderRadius: 10 }}>
    {text}
  </div>
);

const Card: React.FC<{ children: React.ReactNode; top: number; bg?: string; color?: string; size?: number; at?: number; rotate?: number }> = ({
  children,
  top,
  bg = "rgba(255,248,231,0.95)",
  color = "#2B1D0E",
  size = 52,
  at = 0,
  rotate = 0,
}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const s = spring({ frame: frame - at, fps: FPS, config: { damping: 12, stiffness: 240 } });
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          transform: `scale(${s}) rotate(${rotate}deg)`,
          background: bg,
          color,
          fontFamily: FONT_SUB,
          fontWeight: 900,
          fontSize: size,
          padding: "12px 34px",
          borderRadius: 18,
          boxShadow: "0 10px 26px rgba(0,0,0,0.35)",
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// schwarzer Stempel (für "BLACK FRIDAY")
const BlackStamp: React.FC<{ text: string; size?: number; rotate?: number }> = ({ text, size = 120, rotate = -8 }) => (
  <div
    style={{
      fontFamily: FONT_BOLD,
      fontSize: size,
      color: "#fff",
      background: "#0B0B0F",
      border: `${size * 0.07}px solid #fff`,
      borderRadius: size * 0.12,
      padding: `${size * 0.02}px ${size * 0.25}px`,
      transform: `rotate(${rotate}deg)`,
      letterSpacing: size * 0.04,
      boxShadow: "0 14px 34px rgba(0,0,0,0.6)",
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

const Vhs: React.FC<{ label: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 3px, transparent 3px 7px)" }} />
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: ((random(`vy${i}`) * 1920 + frame * 140 * (1 + i * 0.3)) % 2100) - 100,
            height: 18 + random(`vh${i}`) * 40,
            background: "rgba(255,255,255,0.35)",
            filter: "blur(3px)",
          }}
        />
      ))}
      <div style={{ position: "absolute", top: 200, right: 60, fontFamily: "monospace", fontWeight: 900, fontSize: 74, color: "#fff", textShadow: "3px 0 #ff2a6d, -3px 0 #05d9e8", opacity: frame % 20 < 14 ? 1 : 0.2 }}>
        ◀◀ {label}
      </div>
    </AbsoluteFill>
  );
};

const BokehLights: React.FC<{ frame: number; colors?: string[] }> = ({ frame, colors = ["#FFD27A", "#FF8A6B", "#FFE6B0"] }) => (
  <group>
    {Array.from({ length: 18 }).map((_, i) => (
      <Glow
        key={i}
        position={[(random(`bx${i}`) - 0.5) * 7, 0.2 + random(`by${i}`) * 3.4, -2.6 - random(`bz${i}`) * 2]}
        color={colors[i % colors.length]}
        size={0.5 + 0.25 * Math.sin(frame * 0.08 + i)}
        core={0.04}
      />
    ))}
  </group>
);

const YearShot: React.FC<{ text: string; color: string; sub: string; bg: string; subColor?: string }> = ({ text, color, sub, bg, subColor = "#2B1D0E" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12, stiffness: 300 } });
  const cam = add([0, 0, interpolate(s, [0, 1], [18, 12])], shake3(frame, 1, 10, 0.15));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: bg }} />
      <CineStage cam={cam} look={[0, 0.3, 0]} fov={34} floor={null} lift={60}>
        <Text3D text={text} size={1.0} depth={0.4} color={color} position={[0, 0.3, 0]} rotation={[0.1, -0.25 + frame * 0.006, 0]} metal={0.5} />
      </CineStage>
      <div style={{ position: "absolute", top: 1130, left: 0, right: 0 }}>
        <Txt size={70} color={subColor} style={{ textShadow: "none" }}>
          {sub}
        </Txt>
      </div>
    </AbsoluteFill>
  );
};

const LenaClose: React.FC<{ t0: number; look?: Pose }> = ({ t0, look = {} }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 18, stiffness: 240 } });
  const c = closeUp(LENA, interpolate(s, [0, 1], [2.6, 1.85]) - frame * 0.002);
  return (
    <AbsoluteFill>
      <CityBg />
      <CityScene t0={t0} cam={c.cam} look={c.look} lena={look} fov={30} />
    </AbsoluteFill>
  );
};

const NightBg: React.FC = () => <AbsoluteFill style={{ background: "linear-gradient(#0A1022 0%, #1C2440 60%, #2C2A3A 100%)" }} />;

// Passanten (Human) mit festen Farben, 1950er-Mäntel
const PEOPLE = [
  { top: "#6B4A3A", hair: "#3B2A1A", hs: "short" as const, skin: "#E8B996" },
  { top: "#2F4858", hair: "#C8A060", hs: "long" as const, skin: "#EDC3A3" },
  { top: "#7A2E2E", hair: "#2B1D0E", hs: "short" as const, skin: "#D9A27A" },
  { top: "#4A5A4A", hair: "#5A3A1A", hs: "long" as const, skin: "#EDC3A3" },
  { top: "#5E6B78", hair: "#1E140C", hs: "short" as const, skin: "#C98E6A" },
  { top: "#8A6A3A", hair: "#3B2A1A", hs: "short" as const, skin: "#E2B08E" },
];
const BAG_COLORS = ["#C8102E", "#1F6FB2", "#F2C14E", "#2A9D8F", "#E76F51"];

// =============== Szene 1 – Hook: STOPP!, Tüten knallen hin, Preisschilder fliegen, GESCHÖNT!, Lena ===============
export const Scene1: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  const T = TS(0);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={0.85}>
        <StopShot />
      </Cut>
      <Cut T={T} a={0.85} b={3.55}>
        <SaleHookShot words={[0.9, 1.85, 2.67].map((s) => T(s - 0.85))} />
        <Slam at={T(2.67 - 0.85) + 6} style={{ left: 0, right: 0, top: 1480, display: "flex", justifyContent: "center" }}>
          <Stamp text="MYTHOS!" size={150} rotate={-10} />
        </Slam>
      </Cut>
      <Cut T={T} a={3.55} b={6.641 + 1}>
        <LenaRewindShot t0={t0 + T(3.55) / FPS} rewindAt={T(6.0 - 3.55)} cardAt={T(3.87 - 3.55)} />
      </Cut>
    </AbsoluteFill>
  );
};

// Bild 0: riesiges STOPP!, Alarm-Rot blinkt, alles wackelt
const StopShot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 8, stiffness: 420 } });
  const flash = frame % 6 < 3;
  const sx = Math.sin(frame * 2.3) * 22 * Math.max(0, 1 - frame / 20);
  const sy = Math.cos(frame * 3.1) * 18 * Math.max(0, 1 - frame / 20);
  return (
    <AbsoluteFill style={{ background: flash ? "#D90429" : "#0B0B0F", transform: `translate(${sx}px, ${sy}px)` }}>
      <AbsoluteFill style={{ background: "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.10) 0deg 10deg, transparent 10deg 20deg)", transform: `scale(2.4) rotate(${frame * 3}deg)` }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ fontSize: 260, transform: `scale(${s}) rotate(${-8 + Math.sin(frame) * 3}deg)` }}>✋</div>
        <div
          style={{
            transform: `scale(${interpolate(s, [0, 1], [2.2, 1], clamp)}) rotate(-6deg)`,
            fontFamily: "Anton",
            fontSize: 300,
            lineHeight: 1,
            color: flash ? "#FFFFFF" : "#FFD60A",
            WebkitTextStroke: "10px #1A0006",
            textShadow: "0 18px 0 rgba(0,0,0,0.5)",
          }}
        >
          STOPP!
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Einkaufstüten knallen auf den Boden, Preisschilder explodieren in alle Richtungen
const SaleHookShot: React.FC<{ words: number[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tags = [usePriceTag("-50%"), usePriceTag("-70%"), usePriceTag("-90%")];
  const z = spring({ frame: frame - 2, fps, config: { damping: 14, stiffness: 260 } });
  const cam = add([0.1, 1.3, interpolate(z, [0, 1], [7.5, 5.0]) - frame * 0.006], shake3(frame, 3, 12, 0.18));
  const burst = interpolate(frame, [3, 34], [0, 1], clamp);
  const alarm = 0.18 + 0.14 * Math.max(0, Math.sin(frame * 0.6));
  const pop = (k: number) => (frame >= words[k] ? spring({ frame: frame - words[k], fps, config: { damping: 9, stiffness: 300 } }) : 0);
  const drop = (k: number) => spring({ frame: frame - k * 2, fps, config: { damping: 9, stiffness: 380 } });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #3A0A12 0%, #050507 80%)" }} />
      <CineStage cam={cam} look={[0, 0.35, 0]} fov={34} lift={-90} bloom={0.7} exposure={0.95} env={0.5} key1="#FFE8C8" keyI={1.6} rim="#FF2A3A" rimI={2.0} amb={0.35} floor={0}>
        <BokehLights frame={frame} colors={["#FF4D4D", "#FFD60A", "#FFFFFF"]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[3, 48]} />
          <meshPhysicalMaterial color="#141418" roughness={0.3} clearcoat={0.8} />
        </mesh>
        {[-0.7, 0, 0.7].map((x, i) => (
          <ShoppingBag key={x} color={["#0B0B0F", "#C8102E", "#0B0B0F"][i]} position={[x, (1 - drop(i)) * 2.6, (i % 2) * 0.25]} rotation={[0, -0.3 + i * 0.3, (1 - drop(i)) * 0.5]} scale={1.6} />
        ))}
        {Array.from({ length: 15 }).map((_, i) => {
          const a = (i / 15) * Math.PI * 2;
          const r = 0.3 + burst * (1.0 + (i % 4) * 0.3);
          const h = 0.4 + Math.sin(burst * Math.PI) * (0.8 + (i % 3) * 0.35) + burst * 0.3;
          return <PriceTag key={i} tex={tags[i % 3]} position={[Math.cos(a) * r, h, Math.sin(a) * r * 0.6 + 0.3]} rotation={[frame * 0.15 + i, frame * 0.2 + i, i]} scale={1.1} />;
        })}
      </CineStage>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(217,4,41,${alarm}) 85%)` }} />
      <div style={{ position: "absolute", top: 190, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Txt size={96} color="#FFFFFF" style={{ transform: `scale(${pop(0)})`, WebkitTextStroke: "5px #0B0B0F" }}>
          DIE GESCHICHTE VOM
        </Txt>
        <Txt size={150} color="#FFD60A" style={{ transform: `scale(${pop(1)}) rotate(-3deg)`, WebkitTextStroke: "6px #0B0B0F" }}>
          BLACK FRIDAY
        </Txt>
        <Txt size={120} color="#FF4D5E" style={{ transform: `scale(${pop(2)}) rotate(3deg)`, WebkitTextStroke: "6px #0B0B0F" }}>
          IST GESCHÖNT!
        </Txt>
      </div>
    </AbsoluteFill>
  );
};

const LenaRewindShot: React.FC<{ t0: number; rewindAt: number; cardAt: number }> = ({ t0, rewindAt, cardAt }) => {
  const frame = useCurrentFrame();
  const rw = interpolate(frame, [rewindAt, rewindAt + 18], [0, 1], clamp);
  const c = closeUp(LENA, 2.0 + rw * 2.5);
  return (
    <AbsoluteFill style={{ filter: `sepia(${rw * 0.85}) contrast(${1 + rw * 0.1})` }}>
      <CityBg />
      <CityScene t0={t0} cam={c.cam} look={c.look} lena={{ brow: 0.6 }} fov={30} />
      {frame < rewindAt && <NameTag name="Lena" color="#E76F51" />}
      {frame < rewindAt && (
        <Card at={cardAt} top={330} size={52} bg="#0B0B0F" color="#fff" rotate={-2}>
          ⚫ schwarze Zahlen? ❌ Nein!
        </Card>
      )}
      {frame >= rewindAt && <Vhs label="1959" />}
    </AbsoluteFill>
  );
};

// =============== Szene 2 – Philadelphia, 1950er: Thanksgiving vorbei, Massen strömen in die Stadt ===============
export const Scene2: React.FC<SceneProps> = () => {
  const T = TS(1);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.6}>
        <YearShot text="1950er" color="#1F3A60" sub="PHILADELPHIA" bg="radial-gradient(circle at 50% 42%, #F4EEE0 0%, #B9A88A 85%)" />
      </Cut>
      <Cut T={T} a={2.6} b={5.909 + 1}>
        <Vintage strength={0.35}>
          <CrowdShot massAt={T(4.1 - 2.6)} />
        </Vintage>
        <YearTag text="Philadelphia · 1950er" />
      </Cut>
    </AbsoluteFill>
  );
};

// Viele Menschen laufen mit Tüten auf das Kaufhaus zu
const CrowdShot: React.FC<{ massAt: number }> = ({ massAt }) => {
  const frame = useCurrentFrame();
  const sign = useSignTexture("KAUFHAUS", "#2B1D0E", "#FFD27A");
  const win = useShopWindow();
  const cam: V3 = [0.4 - frame * 0.006, 1.9, 7.4 - frame * 0.02];
  const n = frame < massAt ? 6 : 12;
  return (
    <AbsoluteFill>
      <NightBg />
      <CineStage cam={cam} look={[0, 1.3, -1]} fov={40} key1="#C8D4FF" keyI={0.8} rim="#FFB870" rimI={1.4} amb={0.4} env={0.4} bloom={1.1} fog={{ color: "#141C33", near: 10, far: 26 }}>
        <DowntownStreet frame={frame} sign={sign} win={win} />
        {Array.from({ length: n }).map((_, i) => {
          const p = PEOPLE[i % PEOPLE.length];
          const lane = (i % 4) - 1.5;
          const z0 = 4.5 + Math.floor(i / 4) * 0.9 + (i % 2) * 0.4;
          const z = z0 - ((frame + i * 9) * 0.03) % 4.2;
          return (
            <Human
              key={i}
              frame={frame}
              seed={60 + i}
              position={[lane * 0.9 + Math.sin(i) * 0.2, 0, z]}
              rotation={[0, Math.PI, 0]}
              top={p.top}
              bottom="#2B2B30"
              skin={p.skin}
              hair={p.hair}
              hairStyle={p.hs}
              pose={{ walk: frame * 0.28 + i, gesture: 0, armR: 0.15, bendR: 0.3 }}
              hand={<ShoppingBag color={BAG_COLORS[i % BAG_COLORS.length]} position={[0, -0.55, 0]} scale={0.7} />}
            />
          );
        })}
      </CineStage>
      <Card top={330} size={54} bg="#7A2E2E" color="#fff" rotate={-2}>
        🦃 Thanksgiving ist vorbei
      </Card>
      <Card at={massAt} top={450} size={54} bg="rgba(255,248,231,0.95)" color="#2B1D0E" rotate={2}>
        👥 Massen strömen in die Stadt
      </Card>
    </AbsoluteFill>
  );
};

// =============== Szene 3 – Einkäufer, Football-Fans, Stau -> Polizei nennt den Tag BLACK FRIDAY ===============
export const Scene3: React.FC<SceneProps> = () => {
  const T = TS(2);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.85}>
        <Vintage strength={0.35}>
          <TrafficShot at={[0.04, 0.85, 1.88].map((s) => T(s))} />
        </Vintage>
      </Cut>
      <Cut T={T} a={2.85} b={5.452 + 1}>
        <Vintage strength={0.35}>
          <PoliceShot stampAt={T(4.42 - 2.85)} />
        </Vintage>
      </Cut>
    </AbsoluteFill>
  );
};

const CAR_COLORS = ["#2A9D8F", "#C8102E", "#F2C14E", "#E9E3D6", "#1F6FB2", "#7A3B2A", "#5E6B78", "#E76F51"];

const TrafficShot: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sign = useSignTexture("KAUFHAUS", "#2B1D0E", "#FFD27A");
  const win = useShopWindow();
  const pop = (k: number) => (frame >= at[k] ? spring({ frame: frame - at[k], fps, config: { damping: 11, stiffness: 240 } }) : 0);
  // Kamera fliegt über den Stau, wackelt beim "totaler Stau"
  const cam = add([5.0 - frame * 0.03, 4.6, 10.0 - frame * 0.012], shake3(frame, at[2], 10, 0.06));
  const honk = frame >= at[2] ? 1 : 0;
  return (
    <AbsoluteFill>
      <NightBg />
      <CineStage cam={cam} look={[0, 0.6, 0.6]} fov={40} key1="#C8D4FF" keyI={0.9} rim="#FFB870" rimI={1.4} amb={0.4} env={0.45} bloom={1.2} fog={{ color: "#141C33", near: 10, far: 28 }}>
        <DowntownStreet frame={frame} sign={sign} win={win} />
        <TrafficLight position={[2.0, 0, -0.4]} state="red" />
        {/* zwei Spuren voller Autos, fast Stoßstange an Stoßstange */}
        {Array.from({ length: 12 }).map((_, i) => {
          const lane = i % 2;
          const x = -7 + Math.floor(i / 2) * 2.35 + lane * 0.8 + Math.sin(frame * 0.05 + i) * 0.02;
          return <Car key={i} frame={frame} color={CAR_COLORS[i % CAR_COLORS.length]} position={[x, 0, 0.9 + lane * 1.5]} rotation={[0, lane ? Math.PI : 0, 0]} honk={honk} lights={1} />;
        })}
        {/* Fußgänger auf dem Gehweg */}
        {Array.from({ length: 6 }).map((_, i) => {
          const p = PEOPLE[i];
          return (
            <Human
              key={i}
              frame={frame}
              seed={70 + i}
              position={[-4 + i * 1.4 + ((frame * 0.02) % 1.4), 0.14, -1.2 + (i % 2) * 0.4]}
              rotation={[0, Math.PI / 2, 0]}
              top={p.top}
              bottom="#2B2B30"
              skin={p.skin}
              hair={p.hair}
              hairStyle={p.hs}
              pose={{ walk: frame * 0.3 + i, gesture: 0 }}
              hand={i % 3 === 1 ? undefined : <ShoppingBag color={BAG_COLORS[i % BAG_COLORS.length]} position={[0, -0.55, 0]} scale={0.7} />}
            />
          );
        })}
      </CineStage>
      {/* Hup-Blasen */}
      {honk > 0 &&
        [
          [180, 820],
          [640, 760],
          [400, 980],
        ].map(([x, y], k) => {
          const s = spring({ frame: frame - at[2] - k * 4, fps, config: { damping: 8, stiffness: 300 } });
          return (
            <div key={k} style={{ position: "absolute", left: x, top: y, transform: `scale(${s}) rotate(${(k - 1) * 8}deg)`, fontFamily: "Anton", fontSize: 92, color: "#FFD60A", WebkitTextStroke: "4px #0B0B0F" }}>
              HUP!
            </div>
          );
        })}
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        {["🛍️ Einkäufer", "🏈 Football-Fans", "🚗 TOTALER STAU"].map((w, k) => (
          <div
            key={w}
            style={{
              transform: `scale(${pop(k)}) rotate(${k === 2 ? -3 : 0}deg)`,
              background: k === 2 ? "#D90429" : "rgba(255,248,231,0.95)",
              color: k === 2 ? "#fff" : "#2B1D0E",
              fontFamily: FONT_SUB,
              fontWeight: 900,
              fontSize: k === 2 ? 68 : 52,
              padding: "8px 28px",
              borderRadius: 16,
              boxShadow: "0 10px 26px rgba(0,0,0,0.35)",
            }}
          >
            {w}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Polizist regelt den Verkehr, pfeift, Stempel BLACK FRIDAY
const PoliceShot: React.FC<{ stampAt: number }> = ({ stampAt }) => {
  const frame = useCurrentFrame();
  const sign = useSignTexture("KAUFHAUS", "#2B1D0E", "#FFD27A");
  const win = useShopWindow();
  const wave = Math.sin(frame * 0.35);
  const cam = add([0.9, 1.75, 3.2 - frame * 0.008], shake3(frame, stampAt, 10, 0.05));
  const dark = interpolate(frame, [stampAt - 4, stampAt + 6], [0, 0.55], clamp);
  return (
    <AbsoluteFill>
      <NightBg />
      <CineStage cam={cam} look={[0, 1.45, 0]} fov={34} key1="#C8D4FF" keyI={1.0} rim="#FFB870" rimI={1.6} amb={0.4} env={0.45} bloom={1.1} fog={{ color: "#141C33", near: 8, far: 22 }}>
        <DowntownStreet frame={frame} sign={sign} win={win} />
        <Car frame={frame} color="#C8102E" position={[-2.2, 0, 1.6]} honk={1} />
        <Car frame={frame} color="#2A9D8F" position={[2.6, 0, 2.2]} rotation={[0, Math.PI, 0]} honk={1} />
        <Human
          frame={frame}
          seed={7}
          position={[0, 0, 0.4]}
          rotation={[0, 0.25, 0]}
          top="#1B2A4A"
          bottom="#1B2A4A"
          shoes="#0B0B0F"
          skin="#E2B08E"
          hair="#2B1D0E"
          hairStyle="short"
          collar="#E9EEF2"
          build={1.1}
          pose={{ armR: 1.5 + wave * 0.15, bendR: 0.2 + Math.max(0, wave) * 0.5, armL: 0.6, bendL: 1.4, gesture: 0, brow: -0.6, headTurn: Math.sin(frame * 0.08) * 0.25, blink: frame % 70 < 3, talk: frame % 30 < 12 ? 0.3 : 0 }}
          hand={<Whistle />}
          headExtra={<PoliceCap />}
        />
        {/* Blaulicht-Schimmer */}
        <pointLight position={[-1.5, 2.2, 1.5]} intensity={frame % 16 < 8 ? 6 : 0} distance={6} color="#3A7BFF" />
      </CineStage>
      <AbsoluteFill style={{ background: `rgba(0,0,0,${dark})` }} />
      <NameTag name="👮 Polizei" color="#1B2A4A" top={230} />
      <Card top={340} size={50} bg="rgba(255,248,231,0.95)" color="#1B2A4A">
        Sie nennt den Tag …
      </Card>
      <Slam at={stampAt} style={{ left: 0, right: 0, top: 1360, display: "flex", justifyContent: "center" }}>
        <BlackStamp text="BLACK FRIDAY" size={130} rotate={-8} />
      </Slam>
    </AbsoluteFill>
  );
};

// =============== Szene 4 – Händler hassen den Namen; 1961: "Big Friday" -> niemand macht mit ===============
export const Scene4: React.FC<SceneProps> = () => {
  const T = TS(3);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={1.7}>
        <Vintage strength={0.35}>
          <ShopkeeperShot />
        </Vintage>
      </Cut>
      <Cut T={T} a={1.7} b={6.442 + 1}>
        <Vintage strength={0.35}>
          <RenameShot paintAt={T(2.17 - 1.7)} paintEnd={T(4.37 - 1.7)} flopAt={T(5.07 - 1.7)} />
        </Vintage>
        <YearTag text="1961" />
      </Cut>
    </AbsoluteFill>
  );
};

const ShopkeeperShot: React.FC = () => {
  const frame = useCurrentFrame();
  const cam: V3 = [0.5, 1.7, 3.4 - frame * 0.01];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #6B5236 0%, #1E160F 85%)" }} />
      <CineStage cam={cam} look={[0, 1.35, 0]} fov={36} key1="#FFE2B0" keyI={1.2} rim="#FFC98A" rimI={1.2} amb={0.4} env={0.4} bloom={0.8} lift={-40}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#4A3A2A" roughness={0.9} />
        </mesh>
        <Shelves position={[0, 0, -1.6]} />
        <Human
          frame={frame}
          seed={21}
          position={[0, 0, -0.4]}
          top="#E9E3D6"
          bottom="#3A3A3A"
          skin="#E8B996"
          hair="#7A6A5A"
          hairStyle="short"
          collar="#7A2E2E"
          belly={0.4}
          pose={{ brow: -1, armR: 0.35, bendR: 1.5, armL: 0.35, bendL: 1.5, gesture: 0, headTilt: Math.sin(frame * 0.2) * 0.08, blink: frame % 60 < 3 }}
        />
        <Counter position={[0, 0, 0.3]} />
      </CineStage>
      <Card top={250} size={54} bg="#2B1D0E" color="#F1E6C8">
        🏪 Die Händler …
      </Card>
      <Card at={8} top={370} size={64} bg="#D90429" color="#fff" rotate={-3}>
        😠 hassen den Namen!
      </Card>
    </AbsoluteFill>
  );
};

// Banner "BIG FRIDAY" wird gemalt, dann reißt es und fällt herunter
const RenameShot: React.FC<{ paintAt: number; paintEnd: number; flopAt: number }> = ({ paintAt, paintEnd, flopAt }) => {
  const frame = useCurrentFrame();
  const banner = useBigFridayBanner(interpolate(frame, [paintAt, paintEnd], [0, 1], clamp));
  const sign = useSignTexture("KAUFHAUS", "#2B1D0E", "#FFD27A");
  const win = useShopWindow();
  const fall = interpolate(frame, [flopAt, flopAt + 14], [0, 1], { ...clamp, easing: (t) => t * t });
  const cam = add([0.2, 2.0, 6.8 - frame * 0.01], shake3(frame, flopAt, 10, 0.05));
  const brushX = interpolate(frame, [paintAt, paintEnd], [-1.5, 1.5], clamp);
  return (
    <AbsoluteFill>
      <NightBg />
      <CineStage cam={cam} look={[0, 2.5, -2]} fov={40} key1="#FFE2B0" keyI={1.1} rim="#FFB870" rimI={1.2} amb={0.45} env={0.45} bloom={0.9} fog={{ color: "#141C33", near: 10, far: 26 }}>
        <DowntownStreet frame={frame} sign={sign} win={win} />
        {/* Banner über dem Kaufhaus; rechte Seite reißt ab und es schwingt runter */}
        <group position={[1.6, 3.1, -2.2]} rotation={[0, 0, -fall * 1.2]}>
          <Sheet tex={banner} size={[3.2, 1.0]} position={[-1.6, -fall * 0.6, 0]} />
        </group>
        {/* Pinsel malt mit */}
        {frame >= paintAt && frame < paintEnd + 4 && (
          <mesh position={[brushX, 3.1 + Math.sin(frame * 0.8) * 0.2, -2.0]} rotation={[0, 0, 0.6]} castShadow>
            <cylinderGeometry args={[0.03, 0.04, 0.6, 12]} />
            <meshStandardMaterial color="#8A5A3A" />
          </mesh>
        )}
        {/* Leute laufen vorbei, gucken nicht hin */}
        {Array.from({ length: 5 }).map((_, i) => {
          const p = PEOPLE[i];
          return (
            <Human
              key={i}
              frame={frame}
              seed={40 + i}
              position={[-3.5 + i * 1.6 + ((frame * 0.022) % 1.6), 0.14, -1.0 + (i % 2) * 0.5]}
              rotation={[0, Math.PI / 2, 0]}
              top={p.top}
              bottom="#2B2B30"
              skin={p.skin}
              hair={p.hair}
              hairStyle={p.hs}
              pose={{ walk: frame * 0.3 + i, gesture: 0 }}
            />
          );
        })}
      </CineStage>
      <Card at={paintAt} top={330} size={52} bg="rgba(255,248,231,0.95)" color="#1F6FB2" rotate={-2}>
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

// =============== Szene 5 – 20 Jahre später: neue Geschichte, rote -> schwarze Zahlen ===============
export const Scene5: React.FC<SceneProps> = () => {
  const T = TS(4);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.85}>
        <YearShot text="1981" color="#8A1C1C" sub="EINE NEUE GESCHICHTE" bg="radial-gradient(circle at 50% 42%, #FFF3E0 0%, #C9A27E 85%)" />
      </Cut>
      <Cut T={T} a={2.85} b={6.539 + 1}>
        <LedgerShot redAt={T(4.67 - 2.85)} blackAt={T(5.2 - 2.85)} />
      </Cut>
    </AbsoluteFill>
  );
};

const LedgerShot: React.FC<{ redAt: number; blackAt: number }> = ({ redAt, blackAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = interpolate(frame, [blackAt, blackAt + 22], [0, 1], clamp);
  const ledger = useLedger(k);
  const cam = add([0.1, 0.25, 4.6 - frame * 0.008], shake3(frame, blackAt + 20, 8, 0.04));
  const coins = frame > blackAt ? Math.min(12, Math.floor((frame - blackAt) / 2)) : 0;
  const pr = frame >= redAt ? spring({ frame: frame - redAt, fps, config: { damping: 12, stiffness: 240 } }) : 0;
  const pb = frame >= blackAt + 8 ? spring({ frame: frame - blackAt - 8, fps, config: { damping: 12, stiffness: 240 } }) : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, #5A3A22 0%, #120A06 85%)" }} />
      <CineStage cam={cam} look={[0, 0.0, 0]} fov={36} key1="#FFF1D8" keyI={1.5} rim="#FFB870" rimI={1.0} amb={0.45} bloom={0.6} exposure={0.9} env={0.5} lift={-80}>
        <BokehLights frame={frame} />
        <Sheet tex={ledger} size={[1.6, 1.2]} rotation={[-0.15, 0, 0.02]} />
        {Array.from({ length: coins }).map((_, i) => {
          const t = Math.min(1, ((frame - blackAt) / 2 - i) / 10);
          return <Coin key={i} position={[-0.7 + (i % 6) * 0.28, 1.4 - t * 1.6, 0.35 + Math.floor(i / 6) * 0.15]} rotation={[frame * 0.2 + i, 0, 0.3]} scale={1.4} />;
        })}
      </CineStage>
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 22 }}>
        <div style={{ transform: `scale(${pr})`, background: "#D62828", color: "#fff", fontFamily: FONT_SUB, fontWeight: 900, fontSize: 52, padding: "10px 26px", borderRadius: 16 }}>📕 rote Zahlen</div>
        <div style={{ transform: `scale(${pb})`, fontFamily: FONT_BOLD, fontSize: 70, color: "#fff" }}>→</div>
        <div style={{ transform: `scale(${pb})`, background: "#0B0B0F", color: "#fff", fontFamily: FONT_SUB, fontWeight: 900, fontSize: 52, padding: "10px 26px", borderRadius: 16, border: "3px solid #fff" }}>⚫ schwarze</div>
      </div>
      <Card at={blackAt + 26} top={380} size={48} bg="rgba(255,248,231,0.95)" color="#2B1D0E" rotate={-2}>
        💰 „Darum heißt er Black Friday!“
      </Card>
    </AbsoluteFill>
  );
};

// =============== Szene 6 – Lena: Klingt logisch? Kam erst viel später ===============
export const Scene6: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  const T = TS(5);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={1.8}>
        <LenaClose t0={t0} look={{ brow: 0.5, smile: 0.3, headTilt: 0.1 }} />
        <Card at={T(0.45)} top={300} size={60} bg="#FFF8E7" color="#2B1D0E" rotate={-2}>
          Klingt logisch? 🤔
        </Card>
      </Cut>
      <Cut T={T} a={1.8} b={4.95 + 1}>
        <TimelineShot at={[0.0, 0.45].map((s) => T(s))} stampAt={T(3.47 - 1.8)} />
      </Cut>
    </AbsoluteFill>
  );
};

// Zeitstrahl: 1950er Polizei-Name -> 1981 die schöne Erklärung
const TimelineShot: React.FC<{ at: number[]; stampAt: number }> = ({ at, stampAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (k: number) => (frame >= at[k] ? spring({ frame: frame - at[k], fps, config: { damping: 12, stiffness: 220 } }) : 0);
  const line = interpolate(frame, [at[1], stampAt], [0, 1], clamp);
  const dot = (left: number, top: number, s: number, year: string, label: string, bg: string) => (
    <div style={{ position: "absolute", left, top, transform: `scale(${s})`, display: "flex", flexDirection: "column", alignItems: "center", width: 380 }}>
      <div style={{ fontFamily: "Abril Fatface", fontSize: 96, color: "#fff", textShadow: "0 6px 0 rgba(0,0,0,0.4)" }}>{year}</div>
      <div style={{ marginTop: 8, background: bg, color: "#fff", fontFamily: FONT_SUB, fontWeight: 900, fontSize: 44, padding: "10px 22px", borderRadius: 16, textAlign: "center", lineHeight: 1.15, whiteSpace: "pre-line" }}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #2C2A3A 0%, #07070B 85%)" }} />
      <CineStage cam={[0, 0.2, 4 - frame * 0.006]} look={[0, 0, 0]} fov={36} floor={null} bloom={0.8}>
        <BokehLights frame={frame} colors={["#FF4D4D", "#FFFFFF", "#8AD1FF"]} />
        <Block size={[3.2 * line + 0.001, 0.05, 0.05]} position={[-1.6 + 1.6 * line, -0.05, 0]} color="#FFD60A" emissive="#FFD60A" ei={0.8} />
      </CineStage>
      {dot(60, 640, pop(0), "1950er", "👮 Polizei:\nBLACK FRIDAY = Chaos", "#1B2A4A")}
      {dot(640, 640, pop(1) * (line > 0.95 ? 1 : 0.0001), "1981", "📒 die schöne\nGeschichte", "#8A1C1C")}
      <Slam at={stampAt} style={{ left: 0, right: 0, top: 1150, display: "flex", justifyContent: "center" }}>
        <Stamp text="ERST HINTERHER" size={110} rotate={-8} />
      </Slam>
    </AbsoluteFill>
  );
};

// =============== Szene 7 – Formel, der Trick, Folgen ===============
export const Scene7: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  const T = TS(6);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={4.4}>
        <FormulaShot at={[0.77, 2.98, 3.75].map((s) => T(s))} />
      </Cut>
      <Cut T={T} a={4.4} b={6.25}>
        <TrickShot t0={t0 + T(4.4) / FPS} stampAt={T(5.53 - 4.4)} />
      </Cut>
      <Cut T={T} a={6.25} b={8.49 + 1}>
        <OutroShot t0={t0 + T(6.25) / FPS} />
      </Cut>
    </AbsoluteFill>
  );
};

const FormulaShot: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (k: number) => (frame >= at[k] ? spring({ frame: frame - at[k], fps, config: { damping: 12, stiffness: 220 } }) : 0);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #3A0A12 0%, #050507 85%)" }} />
      <CineStage cam={[0, 0.9, 3.4 - frame * 0.005]} look={[0, 0.35, 0]} fov={34} key1="#FFE8C8" keyI={1.5} rim="#FF2A3A" rimI={1.6} amb={0.4} bloom={0.7} exposure={0.95} env={0.5} floor={0} lift={-230}>
        <BokehLights frame={frame} colors={["#FF4D4D", "#FFD60A", "#FFFFFF"]} />
        <group scale={pop(2)}>
          <ShoppingBag color="#0B0B0F" position={[0, 0, 0]} rotation={[0, frame * 0.02, 0]} scale={1.8} />
        </group>
        {Array.from({ length: 8 }).map((_, i) => {
          const t = ((frame * 0.03 + i / 8) % 1);
          return <Coin key={i} position={[Math.sin(i * 2.1) * 0.8, 2.2 - t * 2.0, Math.cos(i) * 0.3]} rotation={[frame * 0.2 + i, 0, 0.3]} scale={1.4 * pop(2)} />;
        })}
      </CineStage>
      <div style={{ position: "absolute", top: 240, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ transform: `scale(${pop(0)})`, fontFamily: FONT_SUB, fontWeight: 900, fontSize: 76, color: "#fff", textShadow: "0 5px 0 rgba(0,0,0,0.4)" }}>😬 schlechter Name</div>
        <div style={{ transform: `scale(${pop(1)})`, fontFamily: FONT_SUB, fontWeight: 900, fontSize: 76, color: "#FFC37A", textShadow: "0 5px 0 rgba(0,0,0,0.4)" }}>+ 📖 neue Geschichte</div>
        <div style={{ transform: `scale(${pop(2)})`, fontFamily: FONT_SUB, fontWeight: 900, fontSize: 88, color: "#7BE495", textShadow: "0 5px 0 rgba(0,0,0,0.4)" }}>= 💰 Kauflust</div>
      </div>
    </AbsoluteFill>
  );
};

const TrickShot: React.FC<{ t0: number; stampAt: number }> = ({ t0, stampAt }) => {
  const frame = useCurrentFrame();
  const c = closeUp(LENA, 2.2 - frame * 0.006);
  const dark = interpolate(frame, [0, 10], [0, 0.6], clamp);
  return (
    <AbsoluteFill>
      <CityBg />
      <CityScene t0={t0} cam={c.cam} look={c.look} lena={{ brow: -0.6 }} fov={30} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 45% 30%, transparent 25%, rgba(0,0,0,${dark}) 70%)` }} />
      <Slam at={stampAt} style={{ left: 0, right: 0, top: 820, display: "flex", justifyContent: "center" }}>
        <Stamp text="DER TRICK" size={150} rotate={-10} />
      </Slam>
    </AbsoluteFill>
  );
};

const OutroShot: React.FC<{ t0: number }> = ({ t0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bp = spring({ frame: frame - 16, fps, config: { damping: 12, stiffness: 260 } });
  const pulse = 1 + Math.sin((frame / 30) * Math.PI * 2 * 1.4) * 0.06;
  const cam: V3 = [0.1, 1.55, 5.2 + frame * 0.01];
  return (
    <AbsoluteFill>
      <CityBg />
      <CityScene t0={t0} cam={cam} look={[0, 1.25, 0]} lena={{ armR: 0.4, smile: 0.7 }} flo={{ smile: 0.7, headTurn: 0.3 }} lift={-120} />
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
          Kaufst du am Black Friday? 👇
        </div>
      </div>
    </AbsoluteFill>
  );
};
