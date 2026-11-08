// Folge 8 "Marlboro: von der Frauen-Zigarette zum Cowboy": Hook -> New York 1924 (Mild wie der Mai) ->
// rotes Mundstück -> Chicago 1954 (Idee: Cowboy) -> Freiheit + Nr. 1 der Welt -> Lungenkrebs -> der Trick.
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Vintage } from "../components/Overlays";
import { Stamp } from "../folge3/Graphics";
import { FONT_SUB } from "../theme";
import { Counter, Cut, Slam, Txt } from "../folge4/Scenes";
import { add, clamp, shake3, Sheet, Text3D, V3 } from "../folge4-3d/Kit";
import { FPS } from "../folge3/script";
import { speakingAt, TS, Who } from "./script";
import { CineStage } from "../folge6/Stage";
import { HEAD_Y, Human, Pose } from "../folge6/Human";
import { Glow } from "../folge6/Props";
import { Bandana, Cigarette, CigPack, CowboyHat, Desert, Dust, Horse, NightStreet, Office, usePackLabel, usePoster, useSketch } from "./Props";

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
  const posters = [usePoster("lady"), usePoster("cowboy"), usePoster("lady")];
  return (
    <CineStage cam={cam} look={look} fov={fov} lift={lift} exposure={1.05} key1="#9FB4FF" keyI={0.7} rim="#FFB870" rimI={1.4} amb={0.35} bloom={1.1} fog={{ color: "#141C33", near: 9, far: 26 }}>
      <NightStreet frame={frame} posters={posters} />
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

// Blütenblätter, die durchs Bild fliegen (Mai)
const Petals: React.FC<{ n?: number }> = ({ n = 26 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => {
        const x = ((random(`px${i}`) * 1300 + frame * (3 + random(`ps${i}`) * 4)) % 1300) - 110;
        const y = ((random(`py${i}`) * 2000 + frame * (2.5 + random(`pv${i}`) * 3)) % 2000) - 40;
        const r = 18 + random(`pr${i}`) * 18;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: r,
              height: r * 0.6,
              borderRadius: "50% 0 50% 0",
              background: ["#F7C6D0", "#F2A7B8", "#FFE3EA"][i % 3],
              transform: `rotate(${frame * (2 + (i % 5)) + i * 40}deg)`,
              opacity: 0.85,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

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

const SepiaBg: React.FC = () => <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #6B5236 0%, #1E160F 85%)" }} />;
const SunsetBg: React.FC<{ night?: number }> = ({ night = 0 }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(#3B1E4A 0%, #C2452D 45%, #F2A541 75%, #F7D08A 100%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(#03040C 0%, #0B1230 60%, #1A2040 100%)", opacity: night }} />
  </AbsoluteFill>
);

// Cowboy-Figur (Human mit Hut, Halstuch, Jeans)
export const Cowboy: React.FC<{ frame: number; position: V3; rotation?: V3; pose?: Pose; seed?: number }> = ({ frame, position, rotation = [0, 0, 0], pose = {}, seed = 50 }) => (
  <Human
    frame={frame}
    seed={seed}
    position={position}
    rotation={rotation}
    top="#5D7FA3"
    bottom="#2C3E5A"
    shoes="#4A2E1A"
    skin="#D9A27A"
    hair="#4A3020"
    hairStyle="short"
    build={1.12}
    collar="#B23A2E"
    pose={{ gesture: 0, blink: (frame + seed) % 90 < 3, ...pose }}
    headExtra={<CowboyHat />}
    bodyExtra={<Bandana />}
  />
);

// =============== Szene 1 – Hook: Schachtel, Stempel FÜR FRAUEN?, Lena, zurückspulen ===============
export const Scene1: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  const T = TS(0);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.9}>
        <PackHookShot />
        <Slam at={T(2.35)} style={{ left: 0, right: 0, top: 640, display: "flex", justifyContent: "center" }}>
          <Stamp text="FÜR FRAUEN?" size={150} rotate={-10} />
        </Slam>
      </Cut>
      <Cut T={T} a={2.9} b={5.067 + 1}>
        <LenaRewindShot t0={t0 + T(2.9) / FPS} rewindAt={T(4.45 - 2.9)} />
      </Cut>
    </AbsoluteFill>
  );
};

const PackHookShot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lady = usePackLabel("lady");
  const z = spring({ frame, fps, config: { damping: 16, stiffness: 240 } });
  const open = interpolate(frame, [20, 40], [0, 1], clamp);
  const cam: V3 = [0.1, 0.3, interpolate(z, [0, 1], [8, 4.4]) - frame * 0.006];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #F7C6D0 0%, #8E3B52 80%)" }} />
      <CineStage cam={cam} look={[0, -0.2, 0]} fov={34} lift={-60} bloom={0.3} exposure={0.8} env={0.5} key1="#FFFFFF" keyI={1.1} rim="#FFB0C8" rimI={1.0} amb={0.35} floor={-0.43}>
        <BokehLights frame={frame} colors={["#FFD1DC", "#FFFFFF", "#FFB0C8"]} />
        <CigPack label={lady} rotation={[0.05, -0.4 + frame * 0.012, 0]} open={open} />
      </CineStage>
      <Petals n={16} />
      <div style={{ position: "absolute", top: 210, left: 0, right: 0 }}>
        <Txt size={110} color="#FFFFFF" style={{ WebkitTextStroke: "4px #5A1030" }}>
          MARLBORO
        </Txt>
        <Txt size={96} color="#FFD1DC" style={{ WebkitTextStroke: "4px #5A1030" }}>
          WAR FÜR FRAUEN
        </Txt>
      </div>
    </AbsoluteFill>
  );
};

const LenaRewindShot: React.FC<{ t0: number; rewindAt: number }> = ({ t0, rewindAt }) => {
  const frame = useCurrentFrame();
  const rw = interpolate(frame, [rewindAt, rewindAt + 18], [0, 1], clamp);
  const c = closeUp(LENA, 2.0 + rw * 2.5);
  return (
    <AbsoluteFill style={{ filter: `sepia(${rw * 0.85}) contrast(${1 + rw * 0.1})` }}>
      <CityBg />
      <CityScene t0={t0} cam={c.cam} look={c.look} lena={{ brow: 0.6 }} fov={30} />
      {frame < rewindAt && <NameTag name="Lena" color="#E76F51" />}
      {frame < rewindAt && (
        <Card at={8} top={330} size={58} bg="#7A5634" color="#fff" rotate={-2}>
          🤠 … bis ein Cowboy kam
        </Card>
      )}
      {frame >= rewindAt && <Vhs label="1924" />}
    </AbsoluteFill>
  );
};

// =============== Szene 2 – New York 1924: elegante Frau, Schachtel, Plakat "Mild wie der Mai" ===============
export const Scene2: React.FC<SceneProps> = () => {
  const T = TS(1);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.8}>
        <Vintage strength={0.4}>
          <LadyStreetShot />
        </Vintage>
        <YearTag text="New York · 1924" />
      </Cut>
      <Cut T={T} a={2.8} b={5.1}>
        <Vintage strength={0.3}>
          <LaunchShot landAt={T(3.89 - 2.8)} />
        </Vintage>
      </Cut>
      <Cut T={T} a={5.1} b={7.198 + 1}>
        <Vintage strength={0.3}>
          <PosterShot />
        </Vintage>
        <Petals n={22} />
      </Cut>
    </AbsoluteFill>
  );
};

// Frau im Kleid der 1920er geht an einer Plakatwand vorbei
const LadyStreetShot: React.FC = () => {
  const frame = useCurrentFrame();
  const posters = [usePoster("lady"), usePoster("lady"), usePoster("lady")];
  const x = -1.6 + frame * 0.022;
  const cam: V3 = [x * 0.6 + 0.4, 1.55, 4.6 - frame * 0.006];
  return (
    <AbsoluteFill>
      <SepiaBg />
      <CineStage cam={cam} look={[x * 0.7, 1.3, 0]} fov={36} exposure={1.0} key1="#FFE2B0" keyI={1.0} rim="#FFC98A" rimI={1.2} amb={0.4} bloom={1.0} fog={{ color: "#2A1E14", near: 8, far: 22 }}>
        <NightStreet frame={frame} posters={posters} />
        <Human
          frame={frame}
          seed={61}
          position={[x, 0.14, 0.4]}
          rotation={[0, Math.PI / 2 - 0.35, 0]}
          top="#E8899E"
          bottom="#E8899E"
          robe="#E8899E"
          shoes="#3A1E2A"
          skin="#F2D2BC"
          hair="#1E1A2E"
          hairStyle="short"
          collar="#F6EBDD"
          pose={{ walk: frame * 0.22, smile: 0.6, gesture: 0, armR: 0.6, bendR: 1.2, blink: frame % 80 < 3 }}
          hand={<Cigarette position={[0, -0.02, 0.06]} rotation={[Math.PI / 2, 0, 0]} scale={0.7} ember={1} />}
        />
      </CineStage>
      <Card top={330} size={52} bg="#2B1D0E" color="#F1E6C8">
        👗 Rauchen wird Mode bei Frauen
      </Card>
    </AbsoluteFill>
  );
};

const LaunchShot: React.FC<{ landAt: number }> = ({ landAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lady = usePackLabel("lady");
  const drop = spring({ frame: frame - landAt + 10, fps, config: { damping: 11, stiffness: 200 } });
  const cam = add([0, 0.6, 4.4 - frame * 0.006], shake3(frame, landAt, 8, 0.05));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #8E6A4E 0%, #2B1D14 85%)" }} />
      <CineStage cam={cam} look={[0, -0.25, 0]} fov={34} exposure={0.8} env={0.5} key1="#FFF1D8" keyI={1.1} rim="#FFC98A" rimI={1.0} amb={0.35} bloom={0.3} lift={-60} floor={-0.43}>
        {/* Tisch aus Marmor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.43, 0]} receiveShadow>
          <circleGeometry args={[2.2, 48]} />
          <meshPhysicalMaterial color="#EFE8DF" roughness={0.2} clearcoat={1} />
        </mesh>
        <CigPack label={lady} position={[0, (1 - drop) * 2.2, 0]} rotation={[0, -0.35 + (1 - drop) * 2 + frame * 0.006, 0]} />
        {[-0.9, 0.9].map((x, i) => (
          <CigPack key={x} label={lady} position={[x, -0.1 + (1 - drop) * 3, -0.6]} rotation={[0, 0.4 - i * 0.8, 0]} scale={0.75} />
        ))}
      </CineStage>
      <Card top={260} size={58} bg="#7A3B4A" color="#fff">
        PHILIP MORRIS
        <div style={{ fontSize: 34, fontWeight: 700 }}>bringt Marlboro heraus</div>
      </Card>
    </AbsoluteFill>
  );
};

const PosterShot: React.FC = () => {
  const frame = useCurrentFrame();
  const tex = usePoster("lady");
  const cam: V3 = [0.25, 0.1, 4.2 - frame * 0.012];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(#4A2A30, #1E1014)" }} />
      <CineStage cam={cam} look={[0, 0.05, 0]} fov={36} key1="#FFF1D8" keyI={1.6} rim="#FFB0C8" rimI={1.0} amb={0.4} bloom={0.7} lift={-120}>
        <mesh position={[0, 0, -0.1]}>
          <planeGeometry args={[8, 6]} />
          <meshStandardMaterial color="#5A3A2E" roughness={0.95} />
        </mesh>
        <Sheet tex={tex} size={[1.6, 2.24]} rotation={[0, -0.12 + Math.sin(frame * 0.03) * 0.03, 0]} />
      </CineStage>
    </AbsoluteFill>
  );
};

// =============== Szene 3 – rotes Mundstück gegen Lippenstift-Spuren ===============
export const Scene3: React.FC<SceneProps> = () => {
  const T = TS(2);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.5}>
        <RedTipShot redAt={T(1.4)} />
      </Cut>
      <Cut T={T} a={2.5} b={4.789 + 1}>
        <LipstickShot markAt={T(3.27 - 2.5)} hideAt={T(4.05 - 2.5)} />
      </Cut>
    </AbsoluteFill>
  );
};

const RedTipShot: React.FC<{ redAt: number }> = ({ redAt }) => {
  const frame = useCurrentFrame();
  const red = interpolate(frame, [redAt, redAt + 10], [0, 1], clamp);
  const mix = (a: number[], b: number[]) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * red)).join(",")})`;
  const tip = mix([244, 239, 230], [200, 16, 46]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #FFE3EA 0%, #B0506A 85%)" }} />
      <CineStage cam={[0, 0.05, 1.7 - frame * 0.003]} look={[0, 0.0, 0]} fov={30} key1="#FFFFFF" keyI={1.3} rim="#FFB0C8" rimI={1.0} amb={0.4} bloom={0.35} exposure={0.85} env={0.5} lift={-60}>
        <Cigarette rotation={[0.2, frame * 0.012, Math.PI / 2 - 0.25]} tip={tip} />
        {red > 0.5 && <Glow position={[-0.2, -0.03, 0.1]} color="#FF4D6D" size={0.3 * red} core={0.003} />}
      </CineStage>
      <Card top={300} size={60} bg="#C8102E" color="#fff" at={redAt} rotate={-2}>
        🔴 rotes Mundstück
      </Card>
    </AbsoluteFill>
  );
};

const LipstickShot: React.FC<{ markAt: number; hideAt: number }> = ({ markAt, hideAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mark = interpolate(frame, [markAt, markAt + 8], [0, 1], clamp);
  const pop = (at: number) => (frame >= at ? spring({ frame: frame - at, fps, config: { damping: 11, stiffness: 260 } }) : 0);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #FFF1F4 0%, #C77D92 85%)" }} />
      <CineStage cam={[0, -0.02, 2.2 - frame * 0.003]} look={[0, -0.02, 0]} fov={32} key1="#FFFFFF" keyI={1.3} rim="#FFB0C8" rimI={0.8} amb={0.4} bloom={0.25} exposure={0.85} env={0.5} lift={-40}>
        <Cigarette position={[-0.2, 0, 0]} rotation={[0, 0, 0.12]} tip="#F4EFE6" lipstick={mark} />
        <Cigarette position={[0.2, 0, 0]} rotation={[0, 0, -0.12]} tip="#C8102E" lipstick={mark * 0.25} />
      </CineStage>
      <div style={{ position: "absolute", top: 270, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 60 }}>
        <div style={{ transform: `scale(${pop(markAt)})`, background: "rgba(255,248,231,0.95)", borderRadius: 18, padding: "10px 24px", fontFamily: FONT_SUB, fontWeight: 900, fontSize: 46, color: "#2B1D0E" }}>
          💄 sieht man <span style={{ color: "#E01E37" }}>✗</span>
        </div>
        <div style={{ transform: `scale(${pop(hideAt)})`, background: "rgba(255,248,231,0.95)", borderRadius: 18, padding: "10px 24px", fontFamily: FONT_SUB, fontWeight: 900, fontSize: 46, color: "#2B1D0E" }}>
          unsichtbar <span style={{ color: "#2E9E5A" }}>✓</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =============== Szene 4 – Chicago 1954: Werbemann, Skizze, COWBOY ===============
export const Scene4: React.FC<SceneProps> = () => {
  const T = TS(3);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.6}>
        <YearShot text="1954" color="#C8102E" sub="CHICAGO" bg="radial-gradient(circle at 50% 42%, #FFF6E6 0%, #C9A27E 85%)" />
      </Cut>
      <Cut T={T} a={2.6} b={5.5}>
        <Vintage strength={0.25}>
          <AdManShot menAt={T(4.44 - 2.6)} />
        </Vintage>
      </Cut>
      <Cut T={T} a={5.5} b={7.758 + 1}>
        <SketchShot stampAt={T(6.8 - 5.5)} />
      </Cut>
    </AbsoluteFill>
  );
};

const AdManShot: React.FC<{ menAt: number }> = ({ menAt }) => {
  const frame = useCurrentFrame();
  const sketch = useSketch(interpolate(frame, [10, 85], [0, 0.8], clamp));
  const cam: V3 = [0.55, 1.75, 3.2 - frame * 0.006];
  return (
    <AbsoluteFill>
      <SepiaBg />
      <CineStage cam={cam} look={[-0.05, 1.15, 0]} fov={38} key1="#FFE2B0" keyI={1.0} rim="#F2B866" rimI={1.0} amb={0.4} env={0.4} bloom={0.9} lift={-120}>
        <Office frame={frame} />
        <Human
          frame={frame}
          seed={70}
          position={[-0.1, 0, -0.55]}
          rotation={[0, 0.15, 0]}
          top="#3A3A44"
          bottom="#2B2B30"
          skin="#E8B996"
          hair="#4A3A2A"
          hairStyle="short"
          collar="#F4F1EA"
          pose={{ armR: 0.85, bendR: 1.0, armL: 0.6, bendL: 0.8, headNod: 0.35, gesture: 0, brow: 0.3, blink: frame % 85 < 3 }}
        />
        {/* Zeichenblatt auf dem Tisch */}
        <Sheet tex={sketch} size={[0.62, 0.8]} position={[0.1, 0.83, 0.3]} rotation={[-Math.PI / 2 + 0.05, 0, 0.08]} />
        {/* Bleistift bewegt sich */}
        <mesh position={[0.1 + Math.sin(frame * 0.6) * 0.12, 0.9, 0.2 + Math.cos(frame * 0.4) * 0.1]} rotation={[0.5, 0, 0.6]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.18, 8]} />
          <meshStandardMaterial color="#F2C14E" />
        </mesh>
      </CineStage>
      <Card top={240} size={52} bg="#2B1D0E" color="#F1E6C8">
        ✏️ Werbemann Leo Burnett
      </Card>
      <Card at={menAt} top={360} size={60} bg="#264653" color="#fff" rotate={-2}>
        Ziel: MÄNNER 🎯
      </Card>
    </AbsoluteFill>
  );
};

const SketchShot: React.FC<{ stampAt: number }> = ({ stampAt }) => {
  const frame = useCurrentFrame();
  const tex = useSketch(interpolate(frame, [0, stampAt - 4], [0.8, 1], clamp));
  const cam = add([0, 0.05, 2.2 - frame * 0.004], shake3(frame, stampAt, 10, 0.04));
  return (
    <AbsoluteFill>
      <SepiaBg />
      <CineStage cam={cam} look={[0, 0, 0]} fov={36} key1="#FFE2B0" keyI={1.6} rim="#F2B866" rimI={0.8} amb={0.5} bloom={0.6} lift={-90}>
        <mesh position={[0, 0, -0.05]}>
          <planeGeometry args={[6, 6]} />
          <meshStandardMaterial color="#6B4226" roughness={0.6} />
        </mesh>
        <Sheet tex={tex} size={[0.86, 1.12]} rotation={[0, 0, 0.03]} />
      </CineStage>
      <Slam at={stampAt} style={{ left: 0, right: 0, top: 230, display: "flex", justifyContent: "center" }}>
        <Stamp text="COWBOY" size={150} rotate={-8} />
      </Slam>
    </AbsoluteFill>
  );
};

// =============== Szene 5 – Harte Männer, Pferde, Freiheit -> Nr. 1 der Welt ===============
export const Scene5: React.FC<SceneProps> = () => {
  const T = TS(4);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.5}>
        <WestShot wordsAt={[0.04, 0.97, 1.62].map((s) => T(s))} />
      </Cut>
      <Cut T={T} a={2.5} b={6.477 + 1}>
        <WorldShot at={T(2.96 - 2.5)} step={T(0.16)} topAt={T(4.55 - 2.5)} />
      </Cut>
    </AbsoluteFill>
  );
};

const WestShot: React.FC<{ wordsAt: number[] }> = ({ wordsAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam: V3 = [1.6 - frame * 0.008, 1.45, 4.6 - frame * 0.012];
  return (
    <AbsoluteFill>
      <SunsetBg />
      <CineStage cam={cam} look={[0.1, 1.2, 0]} fov={36} exposure={1.05} key1="#FFB070" keyPos={[-3, 3, -6]} keyI={2.4} rim="#FFD9A0" rimI={1.6} amb={0.35} bloom={1.2} fog={{ color: "#E07A4A", near: 12, far: 45 }}>
        <Desert frame={frame} />
        <Horse frame={frame} position={[0.9, 0, -0.2]} rotation={[0, -1.2, 0]} />
        <Cowboy frame={frame} position={[-0.25, 0, 0.35]} rotation={[0, 0.35, 0]} pose={{ armL: 0.15, headTurn: -0.3, brow: -0.4 }} />
        <Dust frame={frame} />
      </CineStage>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        {["HARTE MÄNNER", "PFERDE", "FREIHEIT"].map((w, i) => {
          const s = frame >= wordsAt[i] ? spring({ frame: frame - wordsAt[i], fps, config: { damping: 11, stiffness: 260 } }) : 0;
          return (
            <Txt key={w} size={i === 2 ? 120 : 92} color={i === 2 ? "#FFE08A" : "#FFFFFF"} style={{ transform: `scale(${s})`, WebkitTextStroke: "4px #4A1E10" }}>
              {w}
            </Txt>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const WorldShot: React.FC<{ at: number; step: number; topAt: number }> = ({ at, step, topAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cowboy = usePackLabel("cowboy");
  const k = Math.max(0, Math.min(8, Math.floor((frame - at) / Math.max(1, step)) + 1));
  const shown = frame < at ? 2 : 2 + k * 3;
  const crown = frame >= topAt ? spring({ frame: frame - topAt, fps, config: { damping: 10, stiffness: 220 } }) : 0;
  const cam: V3 = [0, 1.25, 5.6 - frame * 0.01];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #7A1E1E 0%, #1A0606 85%)" }} />
      <CineStage cam={cam} look={[0, 0.9, 0]} fov={38} key1="#FFFFFF" keyI={1.8} rim="#FF8A6B" rimI={1.4} amb={0.4} bloom={1.0} floor={0} lift={-150}>
        <BokehLights frame={frame} />
        {Array.from({ length: shown }).map((_, i) => {
          const row = Math.floor(i / 6);
          const col = i % 6;
          return <CigPack key={i} label={cowboy} side="#C8102E" position={[-1.25 + col * 0.5, 0.33 + row * 0.66, -row * 0.05]} rotation={[0, 0.15 * Math.sin(i), 0]} scale={0.75} />;
        })}
      </CineStage>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Counter
          from={1955}
          to={1972}
          at={at}
          steps={8}
          stepLen={step}
          format={(n) => `${n}`}
          style={{ fontFamily: "Anton", fontSize: 140, color: "#FFFFFF", background: "rgba(26,6,6,0.85)", padding: "0 40px", borderRadius: 24, textShadow: "0 8px 0 rgba(0,0,0,0.35)" }}
        />
        <div style={{ transform: `scale(${crown})`, marginTop: 10, background: "#FFD166", color: "#1D2433", fontFamily: FONT_SUB, fontWeight: 900, fontSize: 64, padding: "10px 34px", borderRadius: 18, boxShadow: "0 10px 0 rgba(0,0,0,0.3)" }}>
          👑 Nr. 1 der Welt
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =============== Szene 6 – Lungenkrebs; Lena: verkauft wurde nie eine Zigarette ===============
export const Scene6: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  const T = TS(5);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={3.5}>
        <EmptyHatShot cardAt={T(2.54)} />
      </Cut>
      <Cut T={T} a={3.5} b={6.176 + 1}>
        <LenaClose t0={t0 + T(3.5) / FPS} look={{ brow: -0.6 }} />
        <Card at={T(5.11 - 3.5)} top={300} size={60} bg="#1D2433" color="#fff" rotate={-2}>
          nur eine Zigarette? ✗
        </Card>
      </Cut>
    </AbsoluteFill>
  );
};

// Sonne geht unter, Cowboy geht weg, am Ende hängt nur noch sein Hut am Zaunpfahl
const EmptyHatShot: React.FC<{ cardAt: number }> = ({ cardAt }) => {
  const frame = useCurrentFrame();
  const night = interpolate(frame, [0, 60], [0.35, 1], clamp);
  const gone = interpolate(frame, [0, 70], [0, 1], clamp);
  const cam: V3 = [2.2, 1.2, 2.6 - frame * 0.006];
  return (
    <AbsoluteFill style={{ filter: `saturate(${1 - night * 0.6})` }}>
      <SunsetBg night={night} />
      <CineStage cam={cam} look={[1.4, 0.95, -1.6]} fov={34} exposure={0.85} key1="#9FB4FF" keyPos={[-4, 6, 2]} keyI={0.9} rim="#FF9A6B" rimI={1.2 * (1 - night)} amb={0.25} env={0.25} bloom={1.0}>
        <Desert frame={frame} sun={1 - night} night={night} />
        {gone < 1 && <Cowboy frame={frame} position={[1.0 - gone * 3, 0, -3.2 - gone * 2]} rotation={[0, -2.2, 0]} pose={{ walk: frame * 0.2 }} seed={51} />}
        {/* Hut auf dem Zaunpfahl */}
        <CowboyHat position={[1.2, 1.24, -1.6]} rotation={[0.05, 0.4, 0.08]} scale={1.15} />
      </CineStage>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 55% 45%, transparent 30%, rgba(0,0,0,${0.55 * night}) 75%)` }} />
      <div style={{ position: "absolute", top: 240, left: 0, right: 0 }}>
        <Txt size={70} color="#E6E9F2" style={{ textShadow: "0 4px 0 rgba(0,0,0,0.5)" }}>
          MEHRERE MARLBORO-COWBOYS
        </Txt>
      </div>
      <Card at={cardAt} top={400} size={62} bg="#2E2E35" color="#fff">
        † Lungenkrebs
      </Card>
    </AbsoluteFill>
  );
};

// =============== Szene 7 – Ein Gefühl: Freiheit. Der Trick. Folgen ===============
export const Scene7: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  const T = TS(6);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.4}>
        <FeelingShot feelAt={T(0.78)} freeAt={T(1.57)} />
      </Cut>
      <Cut T={T} a={2.4} b={4.4}>
        <TrickShot t0={t0 + T(2.4) / FPS} stampAt={T(3.7 - 2.4)} />
      </Cut>
      <Cut T={T} a={4.4} b={6.642 + 1}>
        <OutroShot t0={t0 + T(4.4) / FPS} />
      </Cut>
    </AbsoluteFill>
  );
};

const FeelingShot: React.FC<{ feelAt: number; freeAt: number }> = ({ feelAt, freeAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame, fps, config: { damping: 12, stiffness: 220 } });
  const p = frame >= feelAt ? spring({ frame: frame - feelAt, fps, config: { damping: 12, stiffness: 220 } }) : 0;
  const f = frame >= freeAt ? spring({ frame: frame - freeAt, fps, config: { damping: 12, stiffness: 160 } }) : 0;
  return (
    <AbsoluteFill>
      <SunsetBg />
      <CineStage cam={[0, 0.3, 7.5 - frame * 0.008]} look={[0, 0.1, 0]} fov={34} bloom={0.8} key1="#FFFFFF" keyI={2} rim="#FFD9A0" rimI={1.4} lift={-60}>
        {frame >= freeAt && (
          <Text3D text="FREIHEIT" size={0.32} depth={0.16} color="#FFE08A" emissive="#FFB347" position={[0, 0.0, 0]} rotation={[0.1, Math.sin(frame * 0.05) * 0.25, 0]} scale={f} metal={0.5} />
        )}
      </CineStage>
      <div style={{ position: "absolute", top: 240, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ transform: `scale(${a})`, fontFamily: FONT_SUB, fontWeight: 900, fontSize: 84, color: "#fff", textShadow: "0 5px 0 rgba(0,0,0,0.4)" }}>
          🚬 Zigarette <span style={{ color: "#FF6B6B" }}>✗</span>
        </div>
        <div style={{ transform: `scale(${p})`, fontFamily: FONT_SUB, fontWeight: 900, fontSize: 84, color: "#FFE08A", textShadow: "0 5px 0 rgba(0,0,0,0.4)" }}>
          🤠 ein Gefühl <span style={{ color: "#7BE495" }}>✓</span>
        </div>
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
          Was glaubst du? 👇
        </div>
      </div>
    </AbsoluteFill>
  );
};
