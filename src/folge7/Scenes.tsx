// Folge 7 "Wie Mundwasser-Werbung eine Krankheit erfand": Hook -> Labor 1879 -> Fachwort Halitosis ->
// Hochzeit (immer Brautjungfer) -> Angst + Umsatz -> "Problem erfunden" -> der Trick.
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Vintage } from "../components/Overlays";
import { Stamp } from "../folge3/Graphics";
import { FONT_SUB } from "../theme";
import { Counter, Cut, Slam, Txt } from "../folge4/Scenes";
import { add, clamp, shake3, Text3D, V3 } from "../folge4-3d/Kit";
import { FPS } from "../folge3/script";
import { speakingAt, TS, Who } from "./script";
import { CineStage } from "../folge6/Stage";
import { HEAD_Y, Human, Pose } from "../folge6/Human";
import { Glow, XmasStreet } from "../folge6/Props";
import {
  Bathroom,
  BreathCloud,
  Book,
  Bouquet,
  Flask,
  FlowerArch,
  Lab,
  MouthwashBottle,
  PosterBoard,
  useFearPoster,
  useLabel,
  Veil,
} from "./Props";

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
  const posters = [useFearPoster(0), useFearPoster(1), useFearPoster(2)];
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


const LenaClose: React.FC<{ t0: number; look?: Pose; tag?: boolean }> = ({ t0, look = {}, tag }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 18, stiffness: 240 } });
  const c = closeUp(LENA, interpolate(s, [0, 1], [2.6, 1.85]) - frame * 0.002);
  return (
    <AbsoluteFill>
      <CityBg />
      <CityScene t0={t0} cam={c.cam} look={c.look} lena={look} fov={30} />
      {tag && <NameTag name="Lena" color="#E76F51" />}
    </AbsoluteFill>
  );
};

const SepiaBg: React.FC = () => <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #6B5236 0%, #1E160F 85%)" }} />;

// =============== Szene 1 – Hook: Mundwasser im Bad, Stempel KRANKHEIT?, Lena, zurückspulen ===============
export const Scene1: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  const T = TS(0);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.1}>
        <InsultShot t0={t0} />
      </Cut>
      <Cut T={T} a={2.1} b={5.9}>
        <BottleHookShot />
        <Slam at={T(4.56 - 2.1)} style={{ left: 0, right: 0, top: 600, display: "flex", justifyContent: "center" }}>
          <Stamp text="WERBUNG" size={190} rotate={-10} />
        </Slam>
        <Card at={T(5.51 - 2.1)} top={880} size={64} bg="#FFD166" color="#1D2433" rotate={-3}>
          💰 Millionen verdient
        </Card>
      </Cut>
      <Cut T={T} a={5.9} b={6.931 + 1}>
        <LenaRewindShot t0={t0 + T(5.9) / FPS} rewindAt={0} />
      </Cut>
    </AbsoluteFill>
  );
};

const BottleHookShot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const label = useLabel("MUNDWASSER", "gegen Mundgeruch");
  const z = spring({ frame, fps, config: { damping: 16, stiffness: 240 } });
  const cam: V3 = [0.1, 0.6, interpolate(z, [0, 1], [7.5, 3.5]) - frame * 0.004];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(#5E7A82, #A9BFC4)" }} />
      <CineStage cam={cam} look={[0, 0.5, 0]} fov={34} lift={-200} bloom={0.5} exposure={0.8} env={0.45} key1="#FFFFFF" keyI={1.3} rim="#9FE0FF" rimI={1.0} amb={0.3}>
        <Bathroom />
        <MouthwashBottle label={label} position={[0, 0.52, 0]} rotation={[0, -0.35 + frame * 0.01, 0]} />
        <Glow position={[0.22, 0.9, 0.3]} color="#FFFFFF" size={0.35 + 0.15 * Math.sin(frame * 0.3)} core={0.005} />
      </CineStage>
      <div style={{ position: "absolute", top: 210, left: 0, right: 0 }}>
        <Txt size={100} color="#FFFFFF" style={{ WebkitTextStroke: "4px #12352A" }}>
          … SAGT DIE
        </Txt>
        <Txt size={128} color="#7BE495" style={{ WebkitTextStroke: "5px #12352A" }}>
          WERBUNG
        </Txt>
      </div>
    </AbsoluteFill>
  );
};

// "Du stinkst aus dem Mund." – Lena schaut direkt in die Kamera und zeigt auf dich (Bild 0 schon voll da)
const InsultShot: React.FC<{ t0: number }> = ({ t0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const z = spring({ frame, fps, config: { damping: 15, stiffness: 260 } });
  const c = closeUp(LENA, interpolate(z, [0, 1], [3.4, 1.75]) - frame * 0.003);
  const point = spring({ frame: frame - 2, fps, config: { damping: 12, stiffness: 220 } });
  return (
    <AbsoluteFill>
      <CityBg />
      <CityScene t0={t0} cam={c.cam} look={c.look} lena={{ armR: 1.35 * point, bendR: 0.15, brow: -0.9, smile: 0.25, headTilt: -0.08, gesture: 0 }} fov={32} />
      {/* grüner "Mundgeruch"-Schleier am Rand */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(60,140,60,0.35) 100%)" }} />
      {/* dunkles Band hinter dem Text, damit das Plakat im Hintergrund nicht stört */}
      <AbsoluteFill style={{ background: "linear-gradient(rgba(5,12,8,0.82) 0%, rgba(5,12,8,0.6) 28%, transparent 42%)" }} />
      {/* Finger zeigt auf den Zuschauer */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 860,
          display: "flex",
          justifyContent: "center",
          fontSize: 110,
          lineHeight: 1,
          transform: `scale(${3.2 * point * (1 + Math.sin(frame * 0.6) * 0.04)}) rotate(-8deg)`,
          filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.5))",
        }}
      >
        🫵
      </div>
      <div style={{ position: "absolute", top: 210, left: 0, right: 0 }}>
        <Txt size={128} color="#FFFFFF" style={{ WebkitTextStroke: "5px #12352A" }}>
          DU STINKST
        </Txt>
        <Txt size={110} color="#7BE495" style={{ WebkitTextStroke: "5px #12352A" }}>
          AUS DEM MUND.
        </Txt>
      </div>
    </AbsoluteFill>
  );
};

// Lena spricht, dann wird das Bild sepia und spult zurück
const LenaRewindShot: React.FC<{ t0: number; rewindAt: number }> = ({ t0, rewindAt }) => {
  const frame = useCurrentFrame();
  const rw = interpolate(frame, [rewindAt, rewindAt + 18], [0, 1], clamp);
  const c = closeUp(LENA, 2.0 + rw * 2.5);
  return (
    <AbsoluteFill style={{ filter: `sepia(${rw * 0.85}) contrast(${1 + rw * 0.1})` }}>
      <CityBg />
      <CityScene t0={t0} cam={c.cam} look={c.look} lena={{ brow: 0.6 }} fov={30} />
      {frame < rewindAt && <NameTag name="Lena" color="#E76F51" />}
      {frame >= rewindAt && <Vhs label="1879" />}
    </AbsoluteFill>
  );
};

// =============== Szene 2 – St. Louis 1879: Labor, Arzt mischt, Flasche ===============
export const Scene2: React.FC<SceneProps> = () => {
  const T = TS(1);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.9}>
        <Vintage strength={0.4}>
          <LabShot />
        </Vintage>
        <YearTag text="St. Louis · 1879" />
      </Cut>
      <Cut T={T} a={2.9} b={5.5}>
        <Vintage strength={0.4}>
          <DoctorShot />
        </Vintage>
      </Cut>
      <Cut T={T} a={5.5} b={6.67 + 1}>
        <Vintage strength={0.3}>
          <AntisepticShot />
        </Vintage>
        <Card at={T(5.69 - 5.5)} top={300} size={60} bg="#1F5E3A" color="#F1E6C8">
          LISTERINE
          <div style={{ fontSize: 34, fontWeight: 700 }}>benannt nach Chirurg Joseph Lister</div>
        </Card>
      </Cut>
    </AbsoluteFill>
  );
};

const LabShot: React.FC = () => {
  const frame = useCurrentFrame();
  const cam: V3 = [0.4, 1.9, 5.2 - frame * 0.02];
  return (
    <AbsoluteFill>
      <SepiaBg />
      <CineStage cam={cam} look={[0, 1.3, -0.5]} fov={36} key1="#FFE2B0" keyI={0.6} rim="#6A4A2A" rimI={0.5} amb={0.25} env={0.3} bloom={1.1}>
        <Lab frame={frame} />
      </CineStage>
    </AbsoluteFill>
  );
};

const DoctorShot: React.FC = () => {
  const frame = useCurrentFrame();
  const label = useLabel("ANTISEPTIKUM", "St. Louis 1879", "#F1E6C8", "#3A2A16");
  const pour = interpolate(frame, [6, 18], [0, 1], clamp);
  const fill = interpolate(frame, [14, 70], [0.1, 0.9], clamp);
  const cam: V3 = [0.35, 1.7, 3.5 - frame * 0.006];
  return (
    <AbsoluteFill>
      <SepiaBg />
      <CineStage cam={cam} look={[-0.15, 1.35, 0.4]} fov={38} key1="#FFE2B0" keyI={0.9} keyPos={[2, 5, 5]} rim="#6A4A2A" rimI={0.6} amb={0.35} env={0.35} bloom={1.0} lift={-140}>
        <Lab frame={frame} />
        <Human
          frame={frame}
          seed={12}
          position={[-0.45, 0, 0.75]}
          rotation={[0, 0.55, 0]}
          top="#F4F1EA"
          bottom="#3A3A3A"
          skin="#E8B996"
          hair="#5A3A1A"
          hairStyle="short"
          beard="#5A3A1A"
          collar="#2B2D42"
          pose={{ armR: 0.9 + pour * 0.25, bendR: 0.9, headTurn: 0.15, headNod: 0.15, gesture: 0, blink: frame % 90 < 3 }}
          hand={<Flask position={[0, -0.05, 0.05]} color="#D9932B" scale={0.6} />}
        />
        <MouthwashBottle label={label} position={[0.12, 1.22, 0.55]} scale={0.55} fill={fill} />
        {pour > 0.5 && (
          <mesh position={[-0.02, 1.62, 0.6]} rotation={[0, 0, 0.5]}>
            <cylinderGeometry args={[0.012, 0.012, 0.35, 8]} />
            <meshStandardMaterial color="#D9932B" emissive="#D9932B" emissiveIntensity={0.8} toneMapped={false} />
          </mesh>
        )}
      </CineStage>
      <Card top={240} size={52} bg="#2B1D0E" color="#F1E6C8">
        🧪 ein Mittel für Operationen
      </Card>
    </AbsoluteFill>
  );
};

const AntisepticShot: React.FC = () => {
  const frame = useCurrentFrame();
  const label = useLabel("ANTISEPTIKUM", "St. Louis 1879", "#F1E6C8", "#3A2A16");
  return (
    <AbsoluteFill>
      <SepiaBg />
      <CineStage cam={[0, 0.25, 2.4 - frame * 0.006]} look={[0, 0.2, 0]} fov={34} key1="#FFE2B0" keyI={1.6} rim="#FFC98A" rimI={1.2} amb={0.4} bloom={0.9} lift={-160}>
        <MouthwashBottle label={label} rotation={[0.05, -0.6 + frame * 0.02, 0]} />
      </CineStage>
    </AbsoluteFill>
  );
};

// =============== Szene 3 – 1920er: die Firma sucht Kunden, findet das Wort "Halitosis" ===============
export const Scene3: React.FC<SceneProps> = () => {
  const T = TS(2);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.9}>
        <YearShot text="1920" color="#1F5E3A" sub="DIE FIRMA SUCHT NEUE KUNDEN" bg="radial-gradient(circle at 50% 42%, #F4F1E6 0%, #B8C9B4 85%)" subColor="#12352A" />
      </Cut>
      <Cut T={T} a={2.9} b={6.84 + 1}>
        <DictShot wordAt={T(5.73 - 2.9)} />
      </Cut>
    </AbsoluteFill>
  );
};

const DictShot: React.FC<{ wordAt: number }> = ({ wordAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const open = interpolate(frame, [4, 26], [0, 1], clamp);
  const rise = spring({ frame: frame - wordAt, fps, config: { damping: 12, stiffness: 160 } });
  const cam: V3 = [0.0, 2.3 - frame * 0.004, 1.5 - frame * 0.004];
  return (
    <AbsoluteFill>
      <SepiaBg />
      <CineStage cam={cam} look={[0.0, 0.25, 0.0]} fov={42} key1="#FFE2B0" keyI={0.55} rim="#6A4A2A" rimI={0.4} amb={0.2} env={0.25} exposure={0.85} bloom={0.7} lift={-120}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]} receiveShadow>
          <planeGeometry args={[8, 8]} />
          <meshStandardMaterial color="#5A3A22" roughness={0.6} />
        </mesh>
        <Book open={open} rotation={[0, 0, 0]} />
        {frame >= wordAt && (
          <group position={[0, 0.15 + rise * 0.42, 0.12]} rotation={[-1.0 + rise * 0.35, 0, 0]} scale={0.28 + rise * 0.2}>
            <Text3D text="HALITOSIS" size={0.17} depth={0.06} color="#7BE495" emissive="#3FAF5F" metal={0.3} />
            <pointLight position={[0, 0, 0.4]} intensity={1.2 * rise} distance={1.5} color="#7BE495" />
          </group>
        )}
      </CineStage>
      <Card top={230} size={52} bg="#2B1D0E" color="#F1E6C8">
        📖 ein altes Fachwort
      </Card>
      {frame >= wordAt + 6 && (
        <Card at={wordAt + 6} top={350} size={56} bg="#1F5E3A" color="#fff" rotate={-2}>
          = Mundgeruch
        </Card>
      )}
    </AbsoluteFill>
  );
};

// =============== Szene 4 – Die Werbung: immer Brautjungfer, nie die Braut ===============
export const Scene4: React.FC<SceneProps> = () => {
  const T = TS(3);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.1}>
        <Vintage strength={0.35}>
          <WeddingShot />
        </Vintage>
      </Cut>
      <Cut T={T} a={2.1} b={4.3}>
        <Vintage strength={0.35}>
          <BridesmaidShot ticks={[2.46, 2.8, 3.1].map((s) => T(s - 2.1))} crossAt={T(3.59 - 2.1)} />
        </Vintage>
      </Cut>
      <Cut T={T} a={4.3} b={7.849 + 1}>
        <Vintage strength={0.35}>
          <BreathShot cloudAt={T(5.41 - 4.3)} secretAt={T(6.24 - 4.3)} />
        </Vintage>
      </Cut>
    </AbsoluteFill>
  );
};

const GardenBg: React.FC = () => <AbsoluteFill style={{ background: "linear-gradient(#DCE8D2, #F4EFE4)" }} />;

const Wedding: React.FC<{ frame: number; turn?: number; maidPose?: Pose }> = ({ frame, turn = 0, maidPose = {} }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#9DBF8A" roughness={0.9} />
    </mesh>
    <FlowerArch />
    {/* Brautpaar unter dem Bogen */}
    <Human
      frame={frame}
      seed={21}
      position={[-0.3, 0, -1.0]}
      rotation={[0, 0.25 - turn * 0.6, 0]}
      top="#FFFFFF"
      bottom="#FFFFFF"
      robe="#FFFFFF"
      skin="#EDC3A3"
      hair="#C8A060"
      hairStyle="long"
      pose={{ smile: 0.8, headTurn: -turn * 0.8, gesture: 0, blink: frame % 85 < 3 }}
      headExtra={<Veil />}
    />
    <Human
      frame={frame}
      seed={22}
      position={[0.32, 0, -1.0]}
      rotation={[0, -0.25 - turn * 0.6, 0]}
      top="#1E1E24"
      bottom="#1E1E24"
      skin="#E2B08E"
      hair="#2B1D0E"
      hairStyle="short"
      collar="#FFFFFF"
      pose={{ smile: 0.7, headTurn: -turn * 0.8, gesture: 0, blink: (frame + 30) % 85 < 3 }}
    />
    {/* Brautjungfer mit Strauß, etwas abseits */}
    <Human
      frame={frame}
      seed={23}
      position={[1.35, 0, 0.1]}
      rotation={[0, -0.55, 0]}
      top="#E8A0B4"
      bottom="#E8A0B4"
      robe="#E8A0B4"
      skin="#EDC3A3"
      hair="#5A3A1A"
      hairStyle="long"
      hand={<Bouquet />}
      pose={{ armR: 0.5, bendR: 0.9, gesture: 0, blink: frame % 70 < 3, ...maidPose }}
    />
    {/* Gäste */}
    {[
      [-1.5, 0.4, "#3D405B", "short"],
      [-2.1, -0.2, "#6D597A", "long"],
      [2.2, -0.5, "#5E3023", "short"],
    ].map(([x, z, c, h], i) => (
      <Human
        key={i}
        frame={frame}
        seed={30 + i}
        position={[x as number, 0, z as number]}
        rotation={[0, (x as number) < 0 ? 0.6 - turn * 1.6 : -0.6 + turn * 1.6, 0]}
        top={c as string}
        bottom="#2B2B2B"
        robe={h === "long" ? (c as string) : undefined}
        skin="#E8B996"
        hair="#3B2A1A"
        hairStyle={h as "long" | "short"}
        pose={{ gesture: 0, headTurn: (x as number) < 0 ? -turn * 0.8 : turn * 0.8, brow: turn > 0.5 ? -1 : 0 }}
      />
    ))}
  </group>
);

const WeddingShot: React.FC = () => {
  const frame = useCurrentFrame();
  const cam: V3 = [0.35, 1.6, 4.4 - frame * 0.012];
  return (
    <AbsoluteFill>
      <GardenBg />
      <CineStage cam={cam} look={[0.2, 1.1, -0.6]} fov={36} key1="#FFF4E0" keyI={2.0} rim="#FFD9E0" rimI={1.2} amb={0.5} bloom={0.6} lift={-80}>
        <Wedding frame={frame} />
      </CineStage>
      <Card top={240} size={54} bg="#2B1D0E" color="#F1E6C8">
        📰 die Werbung erzählt …
      </Card>
    </AbsoluteFill>
  );
};

const BridesmaidShot: React.FC<{ ticks: number[]; crossAt: number }> = ({ ticks, crossAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sad = frame >= crossAt;
  const cam: V3 = [1.0, 1.65, 2.6 - frame * 0.004];
  const pop = (at: number) => (frame >= at ? spring({ frame: frame - at, fps, config: { damping: 11, stiffness: 260 } }) : 0);
  return (
    <AbsoluteFill>
      <GardenBg />
      <CineStage cam={cam} look={[1.3, 1.45, 0.1]} fov={32} key1="#FFF4E0" keyI={2.0} rim="#FFD9E0" rimI={1.2} amb={0.5} bloom={0.6} lift={-120}>
        <Wedding frame={frame} maidPose={{ brow: sad ? -0.8 : 0.3, smile: sad ? 0 : 0.4, headTilt: sad ? 0.15 : 0, headNod: sad ? 0.2 : 0 }} />
      </CineStage>
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: "rgba(255,248,231,0.95)", borderRadius: 18, padding: "10px 26px", fontFamily: FONT_SUB, fontWeight: 900, fontSize: 52, color: "#2B1D0E" }}>
          Brautjungfer
          {ticks.map((t, i) => (
            <span key={i} style={{ color: "#2E9E5A", transform: `scale(${pop(t)})`, display: "inline-block" }}>
              ✓
            </span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: "rgba(255,248,231,0.95)", borderRadius: 18, padding: "10px 26px", fontFamily: FONT_SUB, fontWeight: 900, fontSize: 52, color: "#2B1D0E", opacity: frame >= crossAt - 4 ? 1 : 0 }}>
          Braut
          <span style={{ color: "#E01E37", transform: `scale(${pop(crossAt)})`, display: "inline-block" }}>✗</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const BreathShot: React.FC<{ cloudAt: number; secretAt: number }> = ({ cloudAt, secretAt }) => {
  const frame = useCurrentFrame();
  const turn = interpolate(frame, [cloudAt + 4, cloudAt + 16], [0, 1], clamp);
  const cam: V3 = [0.55, 1.7, 3.3 - frame * 0.006];
  return (
    <AbsoluteFill>
      <GardenBg />
      <CineStage cam={cam} look={[1.3, 1.4, 0.0]} fov={36} key1="#FFF4E0" keyI={2.0} rim="#FFD9E0" rimI={1.2} amb={0.5} bloom={0.6} lift={-120}>
        <Wedding frame={frame} turn={turn} maidPose={{ talk: frame >= cloudAt && frame < cloudAt + 20 ? 0.6 : 0, smile: 0.3, brow: turn > 0.5 ? 0.6 : 0 }} />
        <BreathCloud frame={frame} start={cloudAt} position={[1.25, 1.62, 0.25]} />
      </CineStage>
      {frame >= cloudAt && (
        <Card at={cloudAt} top={260} size={60} bg="#4C8C3A" color="#fff" rotate={-2}>
          der Grund: ihr Atem
        </Card>
      )}
      {frame >= secretAt && (
        <Card at={secretAt} top={390} size={52} bg="#1D2433" color="#fff" rotate={2}>
          … und keiner sagt es ihr 🤫
        </Card>
      )}
    </AbsoluteFill>
  );
};

// =============== Szene 5 – Angst, Umsatz von 100.000 auf 8 Millionen ===============
export const Scene5: React.FC<SceneProps> = () => {
  const T = TS(4);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={1.6}>
        <FearShot />
      </Cut>
      <Cut T={T} a={1.6} b={5.677 + 1}>
        <SalesShot at={T(3.38 - 1.6)} step={T(0.16)} />
      </Cut>
    </AbsoluteFill>
  );
};

const FearShot: React.FC = () => {
  const frame = useCurrentFrame();
  const posters = [useFearPoster(0), useFearPoster(1), useFearPoster(2)];
  const cam: V3 = [0, 1.6, 4.4 - frame * 0.02];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(#3A1418, #1A0A0C)" }} />
      <CineStage cam={cam} look={[0, 1.4, -1]} fov={38} key1="#FFB0A0" keyI={1.2} rim="#FF4040" rimI={1.6} amb={0.3} bloom={0.9}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#3A3A40" roughness={0.6} />
        </mesh>
        <mesh position={[0, 3, -1.75]}>
          <planeGeometry args={[20, 6]} />
          <meshStandardMaterial color="#5A4A44" roughness={0.9} />
        </mesh>
        <PosterBoard posters={posters} />
        {[-1.2, -0.4, 0.4, 1.2].map((x, i) => (
          <Human
            key={x}
            frame={frame}
            seed={40 + i}
            position={[x, 0, -0.2 + (i % 2) * 0.4]}
            rotation={[0, -x * 0.25, 0]}
            top={["#3D405B", "#9C6644", "#6D597A", "#264653"][i]}
            bottom="#2B2B2B"
            robe={i % 2 ? ["#9C6644", "#6D597A", "#6D597A", "#9C6644"][i] : undefined}
            skin="#E8B996"
            hair={["#2B1D0E", "#5A3A1A", "#C8A060", "#3B2A1A"][i]}
            hairStyle={i % 2 ? "long" : "short"}
            pose={{ armR: 1.15, bendR: 2.05, brow: 1, gesture: 0, headNod: 0.05, blink: (frame + i * 9) % 60 < 3 }}
          />
        ))}
      </CineStage>
      <AbsoluteFill style={{ background: `rgba(200,0,0,${0.12 + 0.08 * Math.sin(frame * 0.5)})`, mixBlendMode: "multiply" }} />
      <div style={{ position: "absolute", top: 230, left: 0, right: 0 }}>
        <Txt size={96} color="#FFFFFF" style={{ WebkitTextStroke: "4px #5A0A14" }}>
          😨 ALLE HABEN ANGST
        </Txt>
      </div>
    </AbsoluteFill>
  );
};

const SalesShot: React.FC<{ at: number; step: number }> = ({ at, step }) => {
  const frame = useCurrentFrame();
  const label = useLabel("MUNDWASSER", "gegen Mundgeruch");
  const k = Math.max(0, Math.min(10, Math.floor((frame - at) / Math.max(1, step)) + 1));
  const shown = frame < at ? 1 : 1 + k * 3;
  const cam: V3 = [0, 1.3, 5.6 - frame * 0.01];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #1F5E3A 0%, #0A1F14 85%)" }} />
      <CineStage cam={cam} look={[0, 0.9, 0]} fov={38} key1="#FFFFFF" keyI={1.8} rim="#7BE495" rimI={1.4} amb={0.4} bloom={1.0} floor={0} lift={-150}>
        <BokehLights frame={frame} />
        {Array.from({ length: shown }).map((_, i) => {
          const row = Math.floor(i / 6);
          const col = i % 6;
          return <MouthwashBottle key={i} label={label} position={[-1.25 + col * 0.5, 0.31 + row * 0.6, -row * 0.05]} scale={0.55} />;
        })}
      </CineStage>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: FONT_SUB, fontWeight: 900, fontSize: 44, color: "#CFF5DA" }}>UMSATZ IN 7 JAHREN</div>
        <Counter
          from={100000}
          to={8000000}
          at={at}
          steps={10}
          stepLen={step}
          format={(n) => `$ ${n.toLocaleString("de-DE")}`}
          style={{ fontFamily: "Anton", fontSize: 130, color: "#FFFFFF", textShadow: "0 8px 0 rgba(0,0,0,0.35)" }}
        />
      </div>
    </AbsoluteFill>
  );
};

// =============== Szene 6 – Lena: kein Problem gelöst, eins erfunden ===============
export const Scene6: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  const T = TS(5);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.2}>
        <LenaClose t0={t0} look={{ brow: -0.6 }} />
        <Card at={T(1.17)} top={300} size={60} bg="#1D2433" color="#fff" rotate={-2}>
          Problem gelöst? ✗
        </Card>
      </Cut>
      <Cut T={T} a={2.2} b={4.44 + 1}>
        <InventShot stampAt={T(3.36 - 2.2)} />
      </Cut>
    </AbsoluteFill>
  );
};

const InventShot: React.FC<{ stampAt: number }> = ({ stampAt }) => {
  const frame = useCurrentFrame();
  const cam = add([0, 0.2, 5.2 - frame * 0.01], shake3(frame, stampAt, 10, 0.1));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #2B3A55 0%, #0B0F18 80%)" }} />
      <CineStage cam={cam} look={[0, 0.2, 0]} fov={36} bloom={1.1} key1="#FFFFFF" keyI={2} rim="#7BE495" rimI={1.4} lift={60}>
        <BokehLights frame={frame} />
        <Text3D text="PROBLEM" size={0.42} depth={0.18} color="#7BE495" emissive="#3FAF5F" position={[0, 0.3, 0]} rotation={[0.1, Math.sin(frame * 0.05) * 0.25, 0]} metal={0.3} />
      </CineStage>
      <Slam at={stampAt} style={{ left: 0, right: 0, top: 720, display: "flex", justifyContent: "center" }}>
        <Stamp text="ERFUNDEN" size={160} rotate={-10} />
      </Slam>
    </AbsoluteFill>
  );
};

// =============== Szene 7 – Erst die Angst, dann das Produkt: der Trick ===============
export const Scene7: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  const T = TS(6);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.0}>
        <FormulaShot productAt={T(1.51)} />
      </Cut>
      <Cut T={T} a={2.0} b={4.1}>
        <TrickShot t0={t0 + T(2.0) / FPS} stampAt={T(3.47 - 2.0)} />
      </Cut>
      <Cut T={T} a={4.1} b={6.396 + 1}>
        <OutroShot t0={t0 + T(4.1) / FPS} />
      </Cut>
    </AbsoluteFill>
  );
};

const FormulaShot: React.FC<{ productAt: number }> = ({ productAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const label = useLabel("MUNDWASSER", "gegen Mundgeruch");
  const p = spring({ frame: frame - productAt, fps, config: { damping: 12, stiffness: 220 } });
  const a = spring({ frame, fps, config: { damping: 12, stiffness: 220 } });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #2B3A55 0%, #0B0F18 80%)" }} />
      <CineStage cam={[0, 0.3, 3.6]} look={[0, 0.3, 0]} fov={34} bloom={1.0} key1="#FFFFFF" keyI={2} rim="#7BE495" rimI={1.4} lift={-120}>
        {frame >= productAt && <MouthwashBottle label={label} position={[0, 0.2, 0]} rotation={[0, frame * 0.04, 0]} scale={p} />}
      </CineStage>
      <div style={{ position: "absolute", top: 240, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ transform: `scale(${a})`, fontFamily: FONT_SUB, fontWeight: 900, fontSize: 90, color: "#FF8A8A" }}>1. 😨 ANGST</div>
        <div style={{ opacity: p, fontFamily: FONT_SUB, fontWeight: 900, fontSize: 70, color: "#fff" }}>↓</div>
        <div style={{ transform: `scale(${p})`, fontFamily: FONT_SUB, fontWeight: 900, fontSize: 90, color: "#7BE495" }}>2. 🧴 PRODUKT</div>
      </div>
    </AbsoluteFill>
  );
};

// "Genau das ist der Trick": Lena im Spotlicht
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
