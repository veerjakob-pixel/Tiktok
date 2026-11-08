// Folge 6 "Hat Coca-Cola den Weihnachtsmann erfunden?": Hook (Dose + Mütze) -> Nikolaus -> Thomas Nast 1863 -> rote Postkarten 1900
// -> Werbegemälde ab 1931 -> der Trick: so oft gezeigt, bis er zur Marke gehört.
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Vintage } from "../components/Overlays";
import { Stamp } from "../folge3/Graphics";
import { FONT_SUB } from "../theme";
import { Counter, Cut, Slam, Txt, WhiteFlash } from "../folge4/Scenes";
import { add, clamp, shake3, Sheet, Text3D, V3 } from "../folge4-3d/Kit";
import { FPS } from "../folge3/script";
import { speakingAt, TS, Who } from "./script";
import { CineStage } from "./Stage";
import { HEAD_Y, Human, Pose } from "./Human";
import {
  Bishop,
  Bottle,
  Can,
  Easel,
  Glow,
  Santa,
  SantaHat,
  Snow3D,
  useAdPoster,
  useCanLabel,
  useMagazineTexture,
  usePaintingTexture,
  usePostcardTexture,
  XmasStreet,
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

const LenaClose: React.FC<{ t0: number; look?: Pose; tag?: boolean }> = ({ t0, look = {}, tag }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // kurzer, harter Push-In am Schnittanfang
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

const FloClose: React.FC<{ t0: number; look?: Pose; tag?: boolean }> = ({ t0, look = {}, tag }) => {
  const frame = useCurrentFrame();
  const c = closeUp(FLO, 1.9 - frame * 0.002);
  return (
    <AbsoluteFill>
      <CityBg />
      <CityScene t0={t0} cam={c.cam} look={c.look} flo={{ smile: 0.3, ...look }} fov={30} />
      {tag && <NameTag name="Ich" color="#264653" />}
    </AbsoluteFill>
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

// =============== Szene 1 – Hook: Dose, Mütze fällt drauf, Stempel MYTHOS? ===============
export const Scene1: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  const T = TS(0);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.6}>
        <CanShot hatAt={T(0.9)} />
      </Cut>
      <Cut T={T} a={2.6} b={5.0}>
        <RedWhiteShot redAt={T(2.74 - 2.6)} whiteAt={T(3.41 - 2.6)} canAt={T(4.31 - 2.6)} />
      </Cut>
      <Cut T={T} a={5.0} b={8.307 + 1}>
        <MythTwoShot t0={t0 + T(5.0) / FPS} stampAt={T(7.28 - 5.0)} />
      </Cut>
    </AbsoluteFill>
  );
};

// warme Lichter weit hinten (werden durch das Leuchten zu weichen Lichtkreisen)
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

// Schneeflocken (Overlay)
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

const CanShot: React.FC<{ hatAt: number }> = ({ hatAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const label = useCanLabel();
  // harter Zoom ab Bild 0
  const z = spring({ frame, fps, config: { damping: 16, stiffness: 260 } });
  const drop = spring({ frame: frame - hatAt, fps, config: { damping: 9, stiffness: 300 } });
  const cam = add([0, 0.5, interpolate(z, [0, 1], [12, 5.2]) - frame * 0.006], shake3(frame, hatAt + 3, 10, 0.12));
  return (
    <AbsoluteFill>
      <XmasBg />
      <Snow />
      <CineStage cam={cam} look={[0, 0.3, 0]} fov={34} floor={null} lift={-120} exposure={1.0} bloom={1.2} rim="#FF9A7A">
        <Snow3D frame={frame} n={160} area={[6, 4, 4]} center={[0, -0.5, 0]} />
        <BokehLights frame={frame} />
        <Can label={label} rotation={[0.08, -frame * 0.03, 0]} position={[0, -0.2, 0]} />
        {frame >= hatAt && <SantaHat position={[0, interpolate(drop, [0, 1], [3.5, 0.75]), 0]} rotation={[0, 0.4, 0.12]} scale={0.85} />}
      </CineStage>
      {/* Bildschirm-Text sofort da (Hook ohne Ton verständlich) */}
      <Slam at={0} from={1.6} style={{ top: 210, left: 0, right: 0 }}>
        <Txt size={104} color="#FFF8E7" style={{ WebkitTextStroke: "4px #3A0A10" }}>
          HAT COLA DEN
        </Txt>
        <Txt size={124} color="#FF4D5E" style={{ WebkitTextStroke: "5px #3A0A10" }}>
          WEIHNACHTSMANN
        </Txt>
        <Txt size={104} color="#FFF8E7" style={{ WebkitTextStroke: "4px #3A0A10" }}>
          ERFUNDEN?
        </Txt>
      </Slam>
      {frame >= hatAt + 3 && <WhiteFlash at={hatAt + 3} len={5} max={0.5} />}
    </AbsoluteFill>
  );
};

const RedWhiteShot: React.FC<{ redAt: number; whiteAt: number; canAt: number }> = ({ redAt, whiteAt, canAt }) => {
  const frame = useCurrentFrame();
  const label = useCanLabel();
  const cam: V3 = [0.2, 1.3, 6.0 - frame * 0.008];
  const chip = (at: number, bg: string, color: string, text: string, left: number) =>
    frame >= at && (
      <div
        style={{
          position: "absolute",
          top: 260,
          left,
          transform: `scale(${spring({ frame: frame - at, fps: FPS, config: { damping: 11, stiffness: 260 } })})`,
          background: bg,
          color,
          fontFamily: FONT_SUB,
          fontWeight: 900,
          fontSize: 70,
          padding: "10px 34px",
          borderRadius: 18,
          border: "4px solid #3A0A10",
          boxShadow: "0 10px 26px rgba(0,0,0,0.4)",
        }}
      >
        {text}
      </div>
    );
  return (
    <AbsoluteFill>
      <XmasBg />
      <Snow n={25} />
      <CineStage cam={cam} look={[0.2, 0.95, 0]} fov={34} floor={0} lift={-60} exposure={1.0} bloom={1.2} rim="#FF9A7A">
        <Snow3D frame={frame} n={160} area={[6, 4, 4]} center={[0, -0.5, 0]} />
        <BokehLights frame={frame} />
        <Santa frame={frame} position={[-0.35, 0, 0]} rotation={[0, 0.35, 0]} pose={{ blink: frame % 80 < 3 }} />
        <Can label={label} position={[0.75, 0.85, 0.2]} rotation={[0, -frame * 0.02, 0]} scale={0.55} />
      </CineStage>
      {chip(redAt, "#C8102E", "#fff", "ROT", 140)}
      {chip(whiteAt, "#fff", "#C8102E", "WEISS", 560)}
      <Card at={canAt} top={430} size={60} bg="#FFD166" color="#1D2433" rotate={-3}>
        = Farben der Dose?
      </Card>
    </AbsoluteFill>
  );
};

const MythTwoShot: React.FC<{ t0: number; stampAt: number }> = ({ t0, stampAt }) => {
  const frame = useCurrentFrame();
  const cam = add([0.05, 1.45, 4.7 - frame * 0.006], shake3(frame, stampAt, 10, 0.08));
  return (
    <AbsoluteFill>
      <CityBg />
      <CityScene t0={t0} cam={cam} look={[0.02, 1.05, 0]} lena={{ armR: 0.5, brow: 0.6 }} flo={{ headTurn: 0.15, brow: -1 }} lift={80} />
      <NameTag name="Lena" color="#E76F51" />
      <Card top={330} size={52}>
        „Das glauben fast alle“
      </Card>
      <Slam at={stampAt} style={{ left: 0, right: 0, top: 480, display: "flex", justifyContent: "center" }}>
        <Stamp text="MYTHOS?" size={170} rotate={-10} />
      </Slam>
    </AbsoluteFill>
  );
};

// =============== Szene 2 – Bischof Nikolaus (vor über 1600 Jahren) ===============
export const Scene2: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  const T = TS(1);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={0.8}>
        <FloClose t0={t0} tag look={{ brow: -0.8 }} />
      </Cut>
      <Cut T={T} a={0.8} b={1.8}>
        <RewindShot t0={t0 + T(0.8) / FPS} />
      </Cut>
      <Cut T={T} a={1.8} b={4.1}>
        <Vintage strength={0.35}>
          <BishopShot />
        </Vintage>
        <YearTag text="vor über 1600 Jahren" />
      </Cut>
      <Cut T={T} a={4.1} b={7.613 + 1}>
        <PaintingFrameShot redAt={T(6.54 - 4.1)} />
      </Cut>
    </AbsoluteFill>
  );
};

const RewindShot: React.FC<{ t0: number }> = ({ t0 }) => {
  const frame = useCurrentFrame();
  const p = Math.min(1, frame / 30);
  const cam: V3 = [Math.sin(frame * 0.4) * 0.05, 1.6, 4.6 + p * 5];
  return (
    <AbsoluteFill style={{ filter: `grayscale(${p}) sepia(${p * 0.8}) contrast(1.1)` }}>
      <CityBg />
      <CityScene t0={t0} cam={cam} look={[0, 1.1, 0]} />
      <Vhs label="ca. 300" />
    </AbsoluteFill>
  );
};

// Kirchenraum: Säulen, warmes Licht
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

const BishopShot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 18, stiffness: 200 } });
  const cam: V3 = [0.3, 1.5, interpolate(s, [0, 1], [7, 4.6]) - frame * 0.006];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(#E3D3AE, #9C805A)" }} />
      <CineStage cam={cam} look={[0, 1.25, 0]} fov={36} floor={null} lift={-200} exposure={0.95} rim="#ffd9a0">
        <Church />
        <Bishop frame={frame} position={[0, 0, 0]} rotation={[0, -0.2, 0]} pose={{ blink: frame % 90 < 3 }} />
      </CineStage>
      <Card top={330} size={64} bg="#2B1D0E" color="#F1E6C8">
        Heiliger Nikolaus
        <div style={{ fontSize: 38, fontWeight: 700 }}>Bischof von Myra</div>
      </Card>
    </AbsoluteFill>
  );
};

// Bischof in goldenem Bilderrahmen (altes Gemälde), roter Mantel leuchtet
const PaintingFrameShot: React.FC<{ redAt: number }> = ({ redAt }) => {
  const frame = useCurrentFrame();
  const glow = interpolate(frame - redAt, [0, 4, 30], [0, 1, 0.4], clamp);
  const cam = add([0, 1.3, 4.0 - frame * 0.006], shake3(frame, redAt, 8, 0.06));
  return (
    <AbsoluteFill style={{ background: "#2B1D0E" }}>
      <AbsoluteFill style={{ left: 120, right: 120, top: 330, bottom: 640, width: "auto", height: "auto", overflow: "hidden", background: "linear-gradient(#5A3A22, #2B1D0E)" }}>
        <CineStage cam={cam} look={[0, 1.15, 0]} fov={34} floor={null} lift={0} exposure={0.9 + glow * 0.3} rim="#ffd9a0">
          <Church />
          <Bishop frame={frame} rotation={[0, 0.25, 0]} />
          <pointLight position={[0.6, 1.3, 1.4]} intensity={glow * 8} distance={3} color="#FF4040" />
        </CineStage>
      </AbsoluteFill>
      {/* goldener Rahmen */}
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

// =============== Szene 3 / 5 – Lena fragt ===============
export const Scene3: React.FC<SceneProps> = ({ from }) => (
  <AbsoluteFill>
    <LenaClose t0={from / FPS} look={{ brow: 1, headTilt: 0.1 }} tag />
  </AbsoluteFill>
);

export const Scene5: React.FC<SceneProps> = ({ from }) => (
  <AbsoluteFill>
    <LenaClose t0={from / FPS} look={{ brow: -1, headTilt: -0.12 }} />
    {/* Spannungs-Moment: jetzt kommt die Auflösung */}
    <Card at={4} top={900} size={56} bg="#1D2433" color="#FFD166" rotate={-2}>
      Jetzt kommt der Trick 👀
    </Card>
  </AbsoluteFill>
);

// =============== Szene 4 – Thomas Nast 1863, rote Postkarten um 1900 ===============
export const Scene4: React.FC<SceneProps> = () => {
  const T = TS(3);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={1.6}>
        <Vintage>
          <YearShot text="1863" color="#2B1D0E" sub="NEW YORK" />
        </Vintage>
      </Cut>
      <Cut T={T} a={1.6} b={4.4}>
        <Vintage strength={0.6}>
          <MagazineShot />
        </Vintage>
      </Cut>
      <Cut T={T} a={4.4} b={8.143 + 1}>
        <PostcardShot at={[4.6, 4.85, 5.1].map((s) => T(s - 4.4))} stampAt={T(7.39 - 4.4)} />
        <YearTag text="um 1900" />
      </Cut>
    </AbsoluteFill>
  );
};

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

const MagazineShot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tex = useMagazineTexture();
  const s = spring({ frame, fps, config: { damping: 15, stiffness: 150 } });
  const cam: V3 = [0, 0.1, 6.4 - frame * 0.01];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #5A4632 0%, #1E160F 85%)" }} />
      <CineStage cam={cam} look={[0, 0.2, 0]} fov={36} floor={null} lift={-40} exposure={1.05}>
        <group position={[0, interpolate(s, [0, 1], [-4, 0]), 0]} rotation={[interpolate(s, [0, 1], [-1.2, -0.08]), 0.12, 0.04]}>
          <Sheet tex={tex} size={[2, 2.6]} depth={0.02} color="#EFE4C6" />
        </group>
      </CineStage>
      <Card top={230} size={60} bg="#2B1D0E" color="#F1E6C8">
        Zeichner Thomas Nast
        <div style={{ fontSize: 36, fontWeight: 700 }}>Zeitschrift in New York</div>
      </Card>
    </AbsoluteFill>
  );
};

const PostcardShot: React.FC<{ at: number[]; stampAt: number }> = ({ at, stampAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tex = [usePostcardTexture(0), usePostcardTexture(1), usePostcardTexture(2)];
  const cam = add([0, 0, 7.4 - frame * 0.008], shake3(frame, stampAt, 10, 0.1));
  const spots: { to: V3; rot: V3; from: V3 }[] = [
    { from: [-5, 3, 0], to: [-0.1, 1.15, 0], rot: [0, 0.1, 0.08] },
    { from: [5, 0, 0], to: [0.15, 0.0, 0.1], rot: [0, -0.1, -0.06] },
    { from: [-4, -4, 0], to: [-0.05, -1.15, 0.2], rot: [0, 0.05, 0.05] },
  ];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #3B2A1A 0%, #120C08 85%)" }} />
      <Snow n={25} />
      <CineStage cam={cam} look={[0, 0, 0]} fov={36} floor={null} lift={60} exposure={1.05}>
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
      <div style={{ position: "absolute", top: 220, left: 50 }}>
        <Txt size={60} color="#F1E6C8" font={FONT_SUB} style={{ fontWeight: 900, textAlign: "left" }}>
          Postkarten:
        </Txt>
      </div>
      <Slam at={stampAt} style={{ left: 0, right: 0, top: 560, display: "flex", justifyContent: "center" }}>
        <Stamp text="VOR COCA-COLA" size={120} rotate={-10} />
      </Slam>
    </AbsoluteFill>
  );
};

// =============== Szene 6 – ab 1931: Werbegemälde, jedes Jahr, über 30 Jahre ===============
export const Scene6: React.FC<SceneProps> = () => {
  const T = TS(5);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={1.4}>
        <YearShot text="1931" color="#C8102E" sub="WERBUNG FÜR COCA-COLA" bg="radial-gradient(circle at 50% 42%, #FFF1E6 0%, #E8B4A0 85%)" subColor="#5A0A14" />
      </Cut>
      <Cut T={T} a={1.4} b={4.6}>
        <EaselShot cardAt={T(2.69 - 1.4)} />
      </Cut>
      <Cut T={T} a={4.6} b={7.25}>
        <JollyShot at={[4.67, 5.34, 6.08].map((s) => T(s - 4.6))} />
      </Cut>
      <Cut T={T} a={7.25} b={8.962 + 1}>
        <CalendarShot at={T(7.32 - 7.25)} step={T(0.1)} />
      </Cut>
    </AbsoluteFill>
  );
};

const EaselShot: React.FC<{ cardAt: number }> = ({ cardAt }) => {
  const frame = useCurrentFrame();
  const tex = usePaintingTexture();
  const cam: V3 = [-0.3, 1.5, 5.6 - frame * 0.01];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(#F1E6D8, #C9B49A)" }} />
      <CineStage cam={cam} look={[0, 1.35, 0]} fov={36} floor={0} lift={-140} exposure={1.0}>
        <Easel tex={tex} rotation={[0, 0.15, 0]} />
      </CineStage>
      <Card top={230} size={58} bg="#C8102E" color="#fff">
        Bestellt von der Werbung
      </Card>
      <Card at={cardAt} top={380} size={52} rotate={-3}>
        📅 jedes Jahr ein neues Bild
      </Card>
    </AbsoluteFill>
  );
};

const JollyShot: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam: V3 = [0.3, 1.35, 4.4 - frame * 0.008];
  const bounce = 1 + Math.sin(frame * 0.3) * 0.02;
  const labels = ["😄 fröhlich", "⚪ rund", "🥤 Cola in der Hand"];
  return (
    <AbsoluteFill>
      <XmasBg />
      <Snow n={25} />
      <CineStage cam={cam} look={[0, 1.05, 0]} fov={36} floor={0} lift={-180} exposure={1.0} bloom={1.2} rim="#FF9A7A">
        <Snow3D frame={frame} n={160} area={[6, 4, 4]} center={[0, -0.5, 0]} />
        <BokehLights frame={frame} />
        <Santa
          frame={frame}
          rotation={[0, -0.15, 0]}
          belly={frame >= at[1] ? 1 + 0.25 * spring({ frame: frame - at[1], fps, config: { damping: 8, stiffness: 200 } }) : 1}
          pose={{ smile: frame >= at[0] ? 1 : 0.4, armR: frame >= at[2] ? 0.55 : 0.1, bendR: frame >= at[2] ? 1.3 : 0.15, blink: frame % 70 < 3, headTilt: Math.sin(frame * 0.2) * 0.06 }}
          hand={frame >= at[2] ? <Bottle scale={0.17} rotation={[Math.PI / 2 - 0.2, 0, 0]} /> : undefined}
          scale={bounce}
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

// =============== Szene 7 – Der Trick: so oft gezeigt, bis er zur Marke gehört ===============
export const Scene7: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  const T = TS(6);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={1.1}>
        <LenaClose t0={t0} look={{ smile: 0.4, brow: 0.4 }} />
      </Cut>
      <Cut T={T} a={1.1} b={3.9}>
        <NotInventedShot stampAt={T(3.06 - 1.1)} />
      </Cut>
      <Cut T={T} a={3.9} b={8.15}>
        <WallShot waveAt={T(4.4 - 3.9)} waveStep={T(0.2)} stampAt={T(7.46 - 3.9)} />
      </Cut>
      <Cut T={T} a={8.15} b={10.548 + 1}>
        <OutroShot t0={t0 + T(8.15) / FPS} />
      </Cut>
    </AbsoluteFill>
  );
};

const NotInventedShot: React.FC<{ stampAt: number }> = ({ stampAt }) => {
  const frame = useCurrentFrame();
  const label = useCanLabel();
  const cam = add([0.2, 1.3, 6.0 - frame * 0.008], shake3(frame, stampAt, 10, 0.1));
  return (
    <AbsoluteFill>
      <XmasBg />
      <Snow n={25} />
      <CineStage cam={cam} look={[0.2, 0.95, 0]} fov={34} floor={0} lift={-100} exposure={1.0} bloom={1.2} rim="#FF9A7A">
        <Snow3D frame={frame} n={160} area={[6, 4, 4]} center={[0, -0.5, 0]} />
        <BokehLights frame={frame} />
        <Santa frame={frame} position={[-0.35, 0, 0]} rotation={[0, 0.35, 0]} pose={{ blink: frame % 80 < 3 }} />
        <Can label={label} position={[0.75, 0.85, 0.2]} rotation={[0, -frame * 0.02, 0]} scale={0.55} />
      </CineStage>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0 }}>
        <Txt size={80} color="#fff">
          ERFUNDEN?
        </Txt>
      </div>
      <Slam at={stampAt} style={{ left: 0, right: 0, top: 380, display: "flex", justifyContent: "center" }}>
        <Stamp text="NEIN" size={190} rotate={-10} />
      </Slam>
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
