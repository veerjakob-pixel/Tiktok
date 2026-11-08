// Folge 6 "Hat Coca-Cola den Weihnachtsmann erfunden?" als erzählte Geschichte: Hook -> Legende vom Nikolaus ->
// Thomas Nast zeichnet 1863 -> rote Postkarten um 1900 -> 1931 Problem Winter -> Maler Sundblom -> der Trick.
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Vintage } from "../components/Overlays";
import { Stamp } from "../folge3/Graphics";
import { FONT_SUB } from "../theme";
import { Counter, Cut, Slam, Txt } from "../folge4/Scenes";
import { add, clamp, shake3, Sheet, Text3D, V3 } from "../folge4-3d/Kit";
import { FPS } from "../folge3/script";
import { speakingAt, TS, Who } from "./script";
import { CineStage } from "./Stage";
import { HEAD_Y, Human, Pose } from "./Human";
import {
  Beret,
  Bishop,
  Bottle,
  Brush,
  Can,
  Coin,
  Desk,
  Easel,
  Glow,
  OldTown,
  Quill,
  Snow3D,
  Studio,
  useAdPoster,
  useCanLabel,
  useDrawingTexture,
  usePaintingProgress,
  usePostcardTexture,
  XmasStreet,
} from "./Props";
import { SantaFigure } from "./Santa";

export type SceneProps = { dur: number; from: number };

// ---------- Weihnachtsstraße am Abend mit Lena + Florian ----------
const LENA = { pos: [-0.42, 0.14, 0.2] as V3, rot: 0.5, head: [-0.42, HEAD_Y + 0.14, 0.2] as V3 };
const FLO = { pos: [0.48, 0.14, 0.3] as V3, rot: -0.5, head: [0.48, HEAD_Y + 0.14, 0.3] as V3 };

// Mundbewegung: Silben-Rhythmus aus zwei Sinuswellen (gleich bei jedem Rendern)
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

// Abendhimmel hinter der 3D-Szene
const CityBg: React.FC = () => <AbsoluteFill style={{ background: "linear-gradient(#060B1C 0%, #14213F 55%, #2B3557 100%)" }} />;

const CityScene: React.FC<{ t0: number; cam: V3; look: V3; fov?: number; lena?: Pose; flo?: Pose; lift?: number; children?: React.ReactNode }> = ({
  t0,
  cam,
  look,
  fov = 32,
  lena = {},
  flo = {},
  lift = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const v = useVoices(t0);
  const posters = [useAdPoster(0), useAdPoster(1), useAdPoster(2)];
  return (
    <CineStage cam={cam} look={look} fov={fov} lift={lift} exposure={1.05} key1="#9FB4FF" keyI={0.7} rim="#FFB870" rimI={1.4} amb={0.35} bloom={1.1} fog={{ color: "#141C33", near: 9, far: 26 }}>
      <XmasStreet frame={frame} posters={posters} />
      {/* warmes Licht von vorne (Schaufenster) */}
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
      {children}
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
  <div
    style={{
      position: "absolute",
      top: 210,
      right: 60,
      background: "rgba(43,29,14,0.85)",
      color: "#F1E6C8",
      fontFamily: "Abril Fatface",
      fontSize: 56,
      padding: "6px 26px",
      borderRadius: 10,
    }}
  >
    {text}
  </div>
);

// Info-Kärtchen (Overlay)
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

// VHS-Effekt: Zurückspulen
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
      <div
        style={{
          position: "absolute",
          top: 200,
          right: 60,
          fontFamily: "monospace",
          fontWeight: 900,
          fontSize: 74,
          color: "#fff",
          textShadow: "3px 0 #ff2a6d, -3px 0 #05d9e8",
          opacity: frame % 20 < 14 ? 1 : 0.2,
        }}
      >
        ◀◀ {label}
      </div>
    </AbsoluteFill>
  );
};

// ---------- gemeinsame Bausteine ----------
const BokehLights: React.FC<{ frame: number }> = ({ frame }) => (
  <group>
    {Array.from({ length: 18 }).map((_, i) => (
      <Glow
        key={i}
        position={[(random(`bx${i}`) - 0.5) * 7, 0.2 + random(`by${i}`) * 3.4, -2.6 - random(`bz${i}`) * 2]}
        color={["#FFD27A", "#FF8A6B", "#FFE6B0"][i % 3]}
        size={0.5 + 0.25 * Math.sin(frame * 0.08 + i)}
        core={0.04}
      />
    ))}
  </group>
);

const XmasBg: React.FC = () => <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, #7A1020 0%, #14060A 78%)" }} />;

const Snow: React.FC<{ n?: number }> = ({ n = 40 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => {
        const x = random(`sx${i}`) * 1080 + Math.sin(frame * 0.05 + i) * 20;
        const y = ((random(`sy${i}`) * 2000 + frame * (2 + random(`ss${i}`) * 3)) % 2000) - 40;
        const r = 4 + random(`sr${i}`) * 8;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: "50%", background: "rgba(255,255,255,0.8)" }} />;
      })}
    </AbsoluteFill>
  );
};

const Church: React.FC = () => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#8C7A62" roughness={0.9} />
    </mesh>
    <mesh position={[0, 4, -2.5]}>
      <planeGeometry args={[20, 8]} />
      <meshStandardMaterial color="#C9B48A" roughness={0.95} />
    </mesh>
    {[-2.2, -1.1, 1.1, 2.2].map((x) => (
      <mesh key={x} position={[x, 2.2, -2.1]} castShadow>
        <cylinderGeometry args={[0.22, 0.26, 4.4, 24]} />
        <meshStandardMaterial color="#E6D8B8" roughness={0.7} />
      </mesh>
    ))}
    <pointLight position={[0, 3, 2]} intensity={10} distance={9} color="#FFD9A0" />
  </group>
);

const YearShot: React.FC<{ text: string; color: string; sub: string; bg?: string; subColor?: string }> = ({ text, color, sub, bg = "radial-gradient(circle at 50% 42%, #FFF6DD 0%, #C9AE7E 85%)", subColor = "#2B1D0E" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12, stiffness: 300 } });
  const cam = add([0, 0, interpolate(s, [0, 1], [14, 6])], shake3(frame, 1, 10, 0.15));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: bg }} />
      <CineStage cam={cam} look={[0, 0.3, 0]} fov={34} floor={null} lift={60}>
        <Text3D text={text} size={1.0} depth={0.4} color={color} position={[0, 0.3, 0]} rotation={[0.1, -0.25 + frame * 0.006, 0]} metal={0.5} />
      </CineStage>
      <div style={{ position: "absolute", top: 1000, left: 0, right: 0 }}>
        <Txt size={70} color={subColor} style={{ textShadow: "none" }}>
          {sub}
        </Txt>
      </div>
    </AbsoluteFill>
  );
};

const CalendarShot: React.FC<{ at: number; step: number }> = ({ at, step }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14, stiffness: 240 } });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #FFF1E6 0%, #E8B4A0 85%)", alignItems: "center" }}>
      <div style={{ marginTop: 300, transform: `scale(${s})`, width: 640, borderRadius: 30, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.35)", background: "#fff" }}>
        <div style={{ background: "#C8102E", color: "#fff", fontFamily: FONT_SUB, fontWeight: 900, fontSize: 56, textAlign: "center", padding: "18px 0" }}>WEIHNACHTSWERBUNG</div>
        <Counter
          from={1931}
          to={1964}
          at={at}
          steps={11}
          stepLen={step}
          format={(n) => String(n)}
          style={{ fontFamily: "Anton", fontSize: 230, color: "#2B1D0E", textAlign: "center", padding: "10px 0 20px" }}
        />
      </div>
      <Card at={at + step * 11} top={880} size={70} bg="#FFD166" color="#1D2433" rotate={-3}>
        über 30 Jahre lang!
      </Card>
    </AbsoluteFill>
  );
};

const WallShot: React.FC<{ waveAt: number; waveStep: number; stampAt: number }> = ({ waveAt, waveStep, stampAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const posters = [useAdPoster(0), useAdPoster(1), useAdPoster(2)];
  const cam = add([0, 0.3, 4.2 + frame * 0.03], shake3(frame, stampAt, 10, 0.12));
  const cells = React.useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        x: ((i % 5) - 2) * 1.12,
        y: (2 - Math.floor(i / 5)) * 1.5 + 0.9,
        // Reihenfolge: von der Mitte nach außen
        wave: Math.min(5, Math.round(Math.abs((i % 5) - 2) + Math.abs(Math.floor(i / 5) - 2))),
        v: i % 3,
      })),
    [],
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #3A2A2E 0%, #0E0A0C 85%)" }} />
      <CineStage cam={cam} look={[0, 0.3, 0]} fov={38} floor={null} lift={60} exposure={1.0}>
        {cells.map((c, i) => {
          const at = waveAt + c.wave * waveStep;
          if (frame < at) return null;
          const s = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 260 } });
          return (
            <group key={i} position={[c.x, c.y - 0.6, 0]} scale={s} rotation={[0, 0, (random(`wr${i}`) - 0.5) * 0.12]}>
              <Sheet tex={posters[c.v]} size={[1.0, 1.4]} depth={0.02} />
            </group>
          );
        })}
      </CineStage>
      <div style={{ position: "absolute", top: 200, left: 0, right: 0 }}>
        <Txt size={70} color="#fff" font={FONT_SUB} style={{ fontWeight: 900 }}>
          immer wieder gezeigt …
        </Txt>
      </div>
      <Slam at={stampAt} style={{ left: 0, right: 0, top: 560, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <Stamp text="WERBUNG" size={170} rotate={-10} />
        <div style={{ background: "#FFD166", color: "#1D2433", fontFamily: FONT_SUB, fontWeight: 900, fontSize: 60, padding: "8px 30px", borderRadius: 16, marginTop: 30 }}>
          🎅 = Marke?
        </div>
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
      <Snow n={30} />
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
        <div
          style={{
            marginTop: 34,
            fontFamily: FONT_SUB,
            fontWeight: 800,
            fontSize: 56,
            color: "#1D2433",
            opacity: bp,
            background: "rgba(255,255,255,0.75)",
            padding: "6px 24px",
            borderRadius: 14,
          }}
        >
          Was glaubst du? 👇
        </div>
      </div>
    </AbsoluteFill>
  );
};


// =============== Szene 1 – Hook: Weihnachtsmann + Dose, Lena läuft durch die Straße, MYTHOS?, zurückspulen ===============
export const Scene1: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  const T = TS(0);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.7}>
        <AdHookShot />
        <Slam at={T(1.95)} style={{ left: 0, right: 0, top: 560, display: "flex", justifyContent: "center" }}>
          <Stamp text="NEIN!" size={280} rotate={-10} />
        </Slam>
      </Cut>
      <Cut T={T} a={2.7} b={5.666 + 1}>
        <SkyRewindShot t0={t0 + T(2.7) / FPS} />
      </Cut>
    </AbsoluteFill>
  );
};

// harter Zoom auf den Werbe-Weihnachtsmann mit Dose (Bild 0 schon voll da)
const AdHookShot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const label = useCanLabel();
  const z = spring({ frame, fps, config: { damping: 16, stiffness: 240 } });
  const cam: V3 = [0.15, 1.45, interpolate(z, [0, 1], [7.5, 3.4]) - frame * 0.005];
  return (
    <AbsoluteFill>
      <XmasBg />
      <CineStage cam={cam} look={[0.1, 1.25, 0]} fov={34} floor={0} lift={-80} bloom={1.2} rim="#FF9A7A" keyI={2.4}>
        <Snow3D frame={frame} n={160} area={[6, 4, 4]} center={[0, -0.5, 0]} />
        <BokehLights frame={frame} />
        <SantaFigure frame={frame} position={[-0.25, 0, 0]} rotation={[0, 0.3, 0]} pose={{ laugh: 0.6, holdR: 0.6 }} hand={<Bottle scale={0.22} rotation={[0.3, 0, 0]} />} />
        <Can label={label} position={[0.75, 0.82, 0.3]} rotation={[0, -frame * 0.03, 0]} scale={0.55} />
      </CineStage>
      <div style={{ position: "absolute", top: 210, left: 0, right: 0 }}>
        <Txt size={100} color="#FFF8E7" style={{ WebkitTextStroke: "4px #3A0A10" }}>
          HAT COLA DEN
        </Txt>
        <Txt size={120} color="#FF4D5E" style={{ WebkitTextStroke: "5px #3A0A10" }}>
          WEIHNACHTSMANN
        </Txt>
        <Txt size={100} color="#FFF8E7" style={{ WebkitTextStroke: "4px #3A0A10" }}>
          ERFUNDEN?
        </Txt>
      </div>
    </AbsoluteFill>
  );
};

// Kamera steigt in den Schneehimmel, dann wird zurückgespult
const SkyRewindShot: React.FC<{ t0: number }> = ({ t0 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 34], [0, 1], clamp);
  const e = p * p * (3 - 2 * p);
  const rw = interpolate(frame, [26, 50], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ filter: `sepia(${rw * 0.8}) contrast(${1 + rw * 0.1})` }}>
      <CityBg />
      <CityScene t0={t0} cam={[0, 1.6 + e * 3.2, 4.4 + e * 1.5]} look={[0, 1.2 + e * 4.5, -1]} lena={{ headTurn: 0.2 }} />
      {frame < 26 && <NameTag name="Lena" color="#E76F51" />}
      {frame >= 26 && <Vhs label="1600 Jahre" />}
    </AbsoluteFill>
  );
};

// =============== Szene 2 – Die Legende: Bischof wirft nachts Gold durchs Fenster ===============
export const Scene2: React.FC<SceneProps> = () => {
  const T = TS(1);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={1.0}>
        <TownShot />
        <YearTag text="Kleinasien · vor 1600 Jahren" />
      </Cut>
      <Cut T={T} a={1.0} b={3.4}>
        <SneakShot goldAt={T(2.12 - 1.0)} />
        <YearTag text="Kleinasien · vor 1600 Jahren" />
      </Cut>
      <Cut T={T} a={3.4} b={5.3}>
        <BishopFaceShot nameAt={T(4.48 - 3.4)} />
      </Cut>
      <Cut T={T} a={5.3} b={7.242 + 1}>
        <PaintingFrameShot redAt={T(6.44 - 5.3)} />
      </Cut>
    </AbsoluteFill>
  );
};

const NightBg: React.FC = () => <AbsoluteFill style={{ background: "linear-gradient(#03060F 0%, #0B1633 60%, #1B2547 100%)" }} />;

const TownShot: React.FC = () => {
  const frame = useCurrentFrame();
  const cam: V3 = [0.6, 2.4 - frame * 0.006, 8.5 - frame * 0.03];
  return (
    <AbsoluteFill>
      <NightBg />
      <CineStage cam={cam} look={[0, 1.6, -2]} fov={36} key1="#6F88D8" keyI={0.45} keyPos={[-4, 8, 3]} rim="#3A5AB4" rimI={0.6} amb={0.1} env={0.12} bloom={1.3} exposure={0.95} fog={{ color: "#0B1633", near: 10, far: 30 }}>
        <OldTown frame={frame} />
      </CineStage>
    </AbsoluteFill>
  );
};

const SneakShot: React.FC<{ goldAt: number }> = ({ goldAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Bischof schleicht von links zum Fenster, bleibt stehen, wirft
  const walkEnd = Math.max(10, goldAt - 6);
  const x = interpolate(frame, [0, walkEnd], [-1.8, 0.15], clamp);
  const walking = frame < walkEnd;
  const throwP = spring({ frame: frame - (goldAt - 6), fps, config: { damping: 14, stiffness: 160 } });
  const coins = Array.from({ length: 7 });
  const cam: V3 = [x * 0.5 + 1.2, 1.5, 3.2];
  return (
    <AbsoluteFill>
      <NightBg />
      <CineStage cam={cam} look={[x * 0.5 + 0.3, 1.2, -1.2]} fov={36} key1="#6F88D8" keyI={0.45} keyPos={[-4, 8, 3]} rim="#3A5AB4" rimI={0.6} amb={0.12} env={0.12} bloom={1.3} exposure={1.0} fog={{ color: "#0B1633", near: 10, far: 30 }}>
        <OldTown frame={frame} windowGlow={frame > goldAt ? 1.4 : 1} />
        <Bishop
          frame={frame}
          position={[x, 0, -0.7]}
          rotation={[0, walking ? Math.PI / 2 : Math.PI - 0.5, 0]}
          pose={{ walk: walking ? frame * 0.22 : undefined, armR: throwP * 1.3, bendR: 0.3 + (1 - throwP) * 0.8, headTurn: walking ? -0.5 : 0, gesture: 0 }}
        />
        {frame >= goldAt - 2 &&
          coins.map((_, i) => {
            const t = Math.min(1, (frame - goldAt + 2 - i * 2) / 14);
            if (t <= 0) return null;
            // Bogen von der Hand zum Fenster
            const p0: V3 = [x + 0.25, 1.55, -0.5];
            const p1: V3 = [0.75 + (i % 3 - 1) * 0.08, 1.35 + (i % 2) * 0.08, -1.62];
            const pos: V3 = [p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t + Math.sin(Math.PI * t) * 0.45, p0[2] + (p1[2] - p0[2]) * t];
            return t < 1 ? (
              <group key={i}>
                <Coin position={pos} rotation={[frame * 0.4 + i, frame * 0.3, 0]} scale={1.3} />
                <Glow position={pos} color="#FFD27A" size={0.45} core={0.001} />
              </group>
            ) : null;
          })}
        {frame >= goldAt && <Glow position={[0.75, 1.35, -1.5]} color="#FFD27A" size={1.4 * Math.max(0, 1 - (frame - goldAt) / 25)} core={0.01} />}
      </CineStage>
      <Card at={goldAt} top={320} size={52} bg="#1D2433" color="#FFD166" rotate={-2}>
        heimlich Gold für eine arme Familie
      </Card>
    </AbsoluteFill>
  );
};

const BishopFaceShot: React.FC<{ nameAt: number }> = ({ nameAt }) => {
  const frame = useCurrentFrame();
  const cam: V3 = [0.15, 1.66, 1.75 - frame * 0.004];
  return (
    <AbsoluteFill>
      <NightBg />
      <CineStage cam={cam} look={[0, 1.55, 0]} fov={32} key1="#FFC98A" keyI={1.3} keyPos={[2, 3, 3]} rim="#3A5AB4" rimI={1.0} amb={0.12} env={0.15} bloom={1.1}>
        <OldTown frame={frame} />
        <Bishop frame={frame} position={[0, 0, 0]} rotation={[0, 0.1, 0]} pose={{ smile: 0.5, blink: frame % 80 < 3, gesture: 0 }} />
        <pointLight position={[0.5, 1.6, 1]} intensity={3} distance={3} color="#FFB45C" />
      </CineStage>
      {frame >= nameAt && (
        <Card at={nameAt} top={300} size={72} bg="#2B1D0E" color="#F1E6C8">
          NIKOLAUS
          <div style={{ fontSize: 36, fontWeight: 700 }}>Bischof · Legende</div>
        </Card>
      )}
    </AbsoluteFill>
  );
};

// Bischof in goldenem Bilderrahmen (altes Gemälde), roter Mantel leuchtet
const PaintingFrameShot: React.FC<{ redAt: number }> = ({ redAt }) => {
  const frame = useCurrentFrame();
  const glow = interpolate(frame - redAt, [0, 4, 30], [0, 1, 0.4], clamp);
  const cam = add([0, 1.25, 3.6 - frame * 0.006], shake3(frame, redAt, 8, 0.05));
  return (
    <AbsoluteFill style={{ background: "#2B1D0E" }}>
      <AbsoluteFill style={{ left: 120, right: 120, top: 330, bottom: 640, width: "auto", height: "auto", overflow: "hidden", background: "linear-gradient(#5A3A22, #2B1D0E)" }}>
        <CineStage cam={cam} look={[0, 1.2, 0]} fov={34} lift={0} exposure={0.95 + glow * 0.3} rim="#ffd9a0" shake={0.5} bloom={0.6}>
          <Church />
          <Bishop frame={frame} rotation={[0, 0.25, 0]} pose={{ gesture: 0 }} />
          <pointLight position={[0.6, 1.3, 1.4]} intensity={glow * 8} distance={3} color="#FF4040" />
        </CineStage>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 100,
          right: 100,
          top: 310,
          bottom: 620,
          border: "26px solid #C9A24A",
          borderRadius: 8,
          boxShadow: "inset 0 0 0 6px #8C6A1E, 0 0 0 6px #8C6A1E, 0 20px 50px rgba(0,0,0,0.6)",
        }}
      />
      <div style={{ position: "absolute", top: 200, left: 0, right: 0 }}>
        <Txt size={64} color="#F1E6C8" font={FONT_SUB} style={{ fontWeight: 900 }}>
          Alte Bilder vom Nikolaus
        </Txt>
      </div>
      <Card at={redAt} top={1000} size={64} bg="#C8102E" color="#fff" rotate={-3}>
        roter Mantel ✓
      </Card>
    </AbsoluteFill>
  );
};

// =============== Szene 3 – New York 1863: die Zeichnung entsteht ===============
export const Scene3: React.FC<SceneProps> = () => {
  const T = TS(2);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.8}>
        <Vintage strength={0.6}>
          <YearShot text="1863" color="#2B1D0E" sub="NEW YORK" />
        </Vintage>
      </Cut>
      <Cut T={T} a={2.8} b={6.614 + 1}>
        <Vintage strength={0.45}>
          <DrawingShot start={T(3.3 - 2.8)} end={T(6.1 - 2.8)} marks={[4.92, 5.89].map((s) => T(s - 2.8))} />
        </Vintage>
      </Cut>
    </AbsoluteFill>
  );
};

const DrawingShot: React.FC<{ start: number; end: number; marks: number[] }> = ({ start, end, marks }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [start, end], [0, 1], clamp);
  const tex = useDrawingTexture(progress);
  const cam: V3 = [0.2, 2.6 - frame * 0.004, 1.9 - frame * 0.004];
  // Feder folgt der Zeichenlinie (von unten nach oben), wackelt beim Zeichnen
  const penY = -0.6 + progress * 1.15;
  const penX = Math.sin(frame * 0.9) * 0.18 * (progress > 0 && progress < 1 ? 1 : 0.2);
  const labels = ["dicker Bauch", "weißer Bart"];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "#1A120B" }} />
      <CineStage cam={cam} look={[0, 0, -0.05]} fov={40} key1="#FFE2B0" keyI={0.5} rim="#6A4A2A" rimI={0.4} amb={0.2} bloom={1.0} lift={-80}>
        <Desk frame={frame} />
        <group position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0.05]}>
          <Sheet tex={tex} size={[1.0, 1.3]} depth={0.005} color="#EFE4C6" />
          <Quill position={[penX * 0.6 + 0.05, penY * 0.55, 0.02]} rotation={[0.5, 0.2, -0.4]} />
        </group>
        <Coin position={[1.2, 0.01, 0.5]} rotation={[0, 0, 0]} />
      </CineStage>
      <div style={{ position: "absolute", top: 220, left: 50 }}>
        <Txt size={54} color="#F1E6C8" font={FONT_SUB} style={{ fontWeight: 900, textAlign: "left" }}>
          ✒️ Zeichner Thomas Nast
        </Txt>
      </div>
      {labels.map((l, i) =>
        frame >= marks[i] ? (
          <div
            key={l}
            style={{
              position: "absolute",
              top: 320 + i * 100,
              right: 50,
              transform: `scale(${spring({ frame: frame - marks[i], fps: FPS, config: { damping: 11, stiffness: 260 } })})`,
              background: "rgba(255,248,231,0.95)",
              color: "#2B1D0E",
              fontFamily: FONT_SUB,
              fontWeight: 900,
              fontSize: 48,
              padding: "6px 24px",
              borderRadius: 14,
              boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
            }}
          >
            + {l}
          </div>
        ) : null,
      )}
    </AbsoluteFill>
  );
};

// =============== Szene 4 – Postkarten um 1900: erst grau, dann rot ===============
export const Scene4: React.FC<SceneProps> = () => {
  const T = TS(3);
  return (
    <AbsoluteFill>
      <PostcardShot at={[0.1, 0.35, 0.6].map((s) => T(s))} redAt={T(3.12)} stampAt={T(3.28)} />
      <YearTag text="um 1900" />
    </AbsoluteFill>
  );
};

const PostcardShot: React.FC<{ at: number[]; redAt: number; stampAt: number }> = ({ at, redAt, stampAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tex = [usePostcardTexture(0), usePostcardTexture(1), usePostcardTexture(2)];
  const color = interpolate(frame, [redAt, redAt + 8], [0, 1], clamp);
  const cam = add([0, 0, 7.4 - frame * 0.01], shake3(frame, stampAt, 10, 0.1));
  const spots: { to: V3; rot: V3; from: V3 }[] = [
    { from: [-5, 3, 0], to: [-0.1, 1.15, 0], rot: [0, 0.1, 0.08] },
    { from: [5, 0, 0], to: [0.15, 0.0, 0.1], rot: [0, -0.1, -0.06] },
    { from: [-4, -4, 0], to: [-0.05, -1.15, 0.2], rot: [0, 0.05, 0.05] },
  ];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: `grayscale(${1 - color}) sepia(${(1 - color) * 0.5})` }}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #3B2A1A 0%, #120C08 85%)" }} />
        <CineStage cam={cam} look={[0, 0, 0]} fov={36} lift={60} exposure={1.05} bloom={0.8}>
          <Snow3D frame={frame} n={120} area={[6, 5, 3]} center={[0, -2.5, 1]} />
          {spots.map((p, i) => {
            if (frame < at[i]) return null;
            const s = spring({ frame: frame - at[i], fps, config: { damping: 14, stiffness: 170 } });
            const pos = p.from.map((v, k) => interpolate(s, [0, 1], [v, p.to[k]])) as V3;
            const rot = p.rot.map((v, k) => v + (1 - s) * (k === 2 ? 2.5 : 0.8)) as V3;
            return (
              <group key={i} position={pos} rotation={rot}>
                <Sheet tex={tex[i]} size={[2.4, 1.6]} depth={0.02} color="#E9D8A6" />
              </group>
            );
          })}
        </CineStage>
      </AbsoluteFill>
      {frame >= redAt && (
        <Card at={redAt} top={330} size={64} bg="#C8102E" color="#fff" rotate={-3}>
          IN ROT ✓
        </Card>
      )}
      <Slam at={stampAt} style={{ left: 0, right: 0, top: 560, display: "flex", justifyContent: "center" }}>
        <Stamp text="VOR COCA-COLA" size={120} rotate={-10} />
      </Slam>
    </AbsoluteFill>
  );
};

// =============== Szene 5 – 1931: Problem Winter ===============
export const Scene5: React.FC<SceneProps> = () => {
  const T = TS(4);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={1.3}>
        <YearShot text="1931" color="#C8102E" sub="COCA-COLA HAT EIN PROBLEM" bg="radial-gradient(circle at 50% 42%, #FFF1E6 0%, #E8B4A0 85%)" subColor="#5A0A14" />
      </Cut>
      <Cut T={T} a={1.3} b={5.74 + 1}>
        <WinterShot barsAt={T(3.25 - 1.3)} />
      </Cut>
    </AbsoluteFill>
  );
};

const MONTHS = ["Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez", "Jan", "Feb"];
const SALES = [0.8, 0.95, 1, 0.98, 0.8, 0.55, 0.35, 0.22, 0.18, 0.2];

const WinterShot: React.FC<{ barsAt: number }> = ({ barsAt }) => {
  const frame = useCurrentFrame();
  const label = useCanLabel();
  const cam: V3 = [0.3, 0.9, 3.0 - frame * 0.006];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(#5E7396, #C9D6E8)" }} />
      <CineStage cam={cam} look={[0, 0.5, 0]} fov={36} key1="#CFE0FF" keyI={1.6} rim="#9FB4FF" rimI={1.2} amb={0.5} bloom={0.6} fog={{ color: "#C9D6E8", near: 4, far: 14 }} lift={-260}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshPhysicalMaterial color="#F4F7FB" roughness={0.9} sheen={1} />
        </mesh>
        {/* Dose halb im Schnee, mit Schneehaube */}
        <Can label={label} position={[0, 0.55, 0]} rotation={[0.25, -0.4, 0.15]} scale={0.6} />
        <mesh position={[0.04, 1.02, 0.08]} scale={[1, 0.35, 1]}>
          <sphereGeometry args={[0.3, 24, 16]} />
          <meshPhysicalMaterial color="#FFFFFF" roughness={1} sheen={1} />
        </mesh>
        <Snow3D frame={frame} n={220} area={[5, 4, 4]} center={[0, 0, 0]} />
      </CineStage>
      <div style={{ position: "absolute", top: 220, left: 0, right: 0 }}>
        <Txt size={70} color="#1D2433" font={FONT_SUB} style={{ fontWeight: 900, textShadow: "0 4px 0 rgba(255,255,255,0.6)" }}>
          ❄️ Im Winter: kaum Umsatz
        </Txt>
      </div>
      {/* Umsatz-Balken */}
      <div style={{ position: "absolute", top: 330, left: 90, right: 90, height: 300, display: "flex", alignItems: "flex-end", gap: 12, background: "rgba(255,255,255,0.75)", borderRadius: 20, padding: "20px 24px 50px" }}>
        {MONTHS.map((m, i) => {
          const h = interpolate(frame - barsAt - i * 3, [0, 8], [0, SALES[i]], clamp);
          const winter = i >= 6;
          return (
            <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
              <div style={{ width: "100%", height: `${h * 100}%`, background: winter ? "#3A86FF" : "#C8102E", borderRadius: 6 }} />
              <div style={{ marginTop: 6, fontFamily: FONT_SUB, fontWeight: 800, fontSize: 22, color: "#1D2433", height: 0, overflow: "visible", whiteSpace: "nowrap" }}>{m}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// =============== Szene 6 – Der Maler: jedes Jahr ein Bild, Weihnachtsmann lacht, Cola in der Hand ===============
export const Scene6: React.FC<SceneProps> = () => {
  const T = TS(5);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.4}>
        <PainterShot end={T(2.3)} />
      </Cut>
      <Cut T={T} a={2.4} b={5.3}>
        <JollyShot at={[2.85, 3.49, 4.18].map((s) => T(s - 2.4))} />
      </Cut>
      <Cut T={T} a={5.3} b={6.925 + 1}>
        <CalendarShot at={T(5.35 - 5.3)} step={T(0.09)} />
      </Cut>
    </AbsoluteFill>
  );
};

const PainterShot: React.FC<{ end: number }> = ({ end }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [6, end], [0, 1], clamp);
  const tex = usePaintingProgress(progress);
  const stroke = Math.sin(frame * 0.35);
  const cam: V3 = [1.1, 1.65, 4.9 - frame * 0.006];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "#2A2420" }} />
      <CineStage cam={cam} look={[-0.15, 1.25, -0.3]} fov={36} key1="#CFE0FF" keyI={1.2} keyPos={[-4, 5, 3]} rim="#FFC98A" rimI={1.0} amb={0.4} bloom={0.8} lift={-120}>
        <Studio />
        <Easel tex={tex} position={[0.35, 0, -0.6]} rotation={[0, -0.25, 0]} />
        <Human
          frame={frame}
          seed={9}
          position={[-0.75, 0, 0.15]}
          rotation={[0, 0.95, 0]}
          top="#E9E2D0"
          bottom="#3A3A3A"
          skin="#E8B996"
          hair="#3B2A1A"
          hairStyle="short"
          collar="#2B2D42"
          pose={{ armR: 1.15 + stroke * 0.12, bendR: 0.35 + stroke * 0.15, headTurn: 0.1, blink: frame % 90 < 3, gesture: 0 }}
          hand={<Brush />}
          headExtra={<Beret />}
        />
      </CineStage>
      <Card top={230} size={58} bg="#1D2433" color="#fff">
        🎨 Maler Haddon Sundblom
      </Card>
      <Card at={18} top={350} size={46} bg="#C8102E" color="#fff" rotate={-2}>
        Auftrag von Coca-Cola
      </Card>
    </AbsoluteFill>
  );
};

const JollyShot: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam: V3 = [0.4, 1.4, 3.6 - frame * 0.008];
  const labels = ["😄 fröhlich", "⚪ rund", "🥤 Cola in der Hand"];
  const hold = spring({ frame: frame - at[2] + 4, fps, config: { damping: 14, stiffness: 180 } });
  return (
    <AbsoluteFill>
      <XmasBg />
      <CineStage cam={cam} look={[0, 1.15, 0]} fov={34} floor={0} lift={-170} bloom={1.2} rim="#FF9A7A" keyI={2.4}>
        <Snow3D frame={frame} n={160} area={[6, 4, 4]} center={[0, -0.5, 0]} />
        <BokehLights frame={frame} />
        <SantaFigure
          frame={frame}
          rotation={[0, -0.15, 0]}
          pose={{ laugh: frame >= at[0] ? 0.9 : 0.3, holdR: hold * 0.9, blink: frame % 70 < 3 }}
          hand={frame >= at[2] - 4 ? <Bottle scale={0.22} rotation={[0.3, 0, 0]} /> : undefined}
        />
      </CineStage>
      {labels.map((l, i) =>
        frame >= at[i] ? (
          <div
            key={l}
            style={{
              position: "absolute",
              top: 230 + i * 110,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              transform: `scale(${spring({ frame: frame - at[i], fps, config: { damping: 11, stiffness: 260 } })})`,
            }}
          >
            <div style={{ background: "#fff", color: "#C8102E", fontFamily: FONT_SUB, fontWeight: 900, fontSize: 58, padding: "6px 30px", borderRadius: 16, boxShadow: "0 8px 20px rgba(0,0,0,0.35)" }}>
              {l}
            </div>
          </div>
        ) : null,
      )}
    </AbsoluteFill>
  );
};

// =============== Szene 7 – Der Trick ===============
export const Scene7: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  const T = TS(6);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={3.5}>
        <WallShot waveAt={T(0.3)} waveStep={T(0.2)} stampAt={T(2.94)} />
      </Cut>
      <Cut T={T} a={3.5} b={5.5}>
        <TrickShot t0={t0 + T(3.5) / FPS} stampAt={T(4.9 - 3.5)} />
      </Cut>
      <Cut T={T} a={5.5} b={7.868 + 1}>
        <OutroShot t0={t0 + T(5.5) / FPS} />
      </Cut>
    </AbsoluteFill>
  );
};

// "Genau das ist der Trick": Lena im Spotlicht, alles andere dunkel
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

