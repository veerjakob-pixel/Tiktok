// Folge 8 "Die Kaffeepause ist Werbung": Hook -> Buffalo 1902 (Legende) -> Kaffee wird teuer ->
// New York 1952 (Kampagne) -> Radio/Zeitung/Plakat, Büro-Pause -> Erholung? Nein: Umsatz -> der Trick.
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Vintage } from "../components/Overlays";
import { Stamp } from "../folge3/Graphics";
import { FONT_SUB } from "../theme";
import { Cut, Slam, Txt } from "../folge4/Scenes";
import { add, Block, clamp, shake3, Sheet, Text3D, V3 } from "../folge4-3d/Kit";
import { FPS } from "../folge3/script";
import { speakingAt, TS, Who } from "./script";
import { CineStage } from "../folge6/Stage";
import { HEAD_Y, Human, Pose } from "../folge6/Human";
import { Coin, Glow } from "../folge6/Props";
import { Bean, CoffeeCup, CoffeePot, CoffeeSack, Factory, NightStreet, OfficeDesk, OfficeRoom, Radio, Steam, usePoster, usePriceChart, useNewspaper, useSackLabel, WallClock } from "./Props";

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
  const poster = usePoster();
  const news = useNewspaper();
  const posters = [poster, news, poster];
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
const WarmBg: React.FC = () => <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, #8A5A3A 0%, #2A160C 85%)" }} />;

// Arbeiter/Büroleute (Human) mit festen Farben
const WORKERS = [
  { top: "#5E6B78", hair: "#3B2A1A", hs: "short" as const, skin: "#E8B996" },
  { top: "#7A5A3A", hair: "#2B1D0E", hs: "short" as const, skin: "#D9A27A" },
  { top: "#4A5A4A", hair: "#5A3A1A", hs: "short" as const, skin: "#EDC3A3" },
  { top: "#6D597A", hair: "#C8A060", hs: "long" as const, skin: "#EDC3A3" },
];

// =============== Szene 1 – Hook: dampfende Tasse, Stempel WERBUNG!, Lena, zurückspulen ===============
export const Scene1: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  const T = TS(0);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.7}>
        <CupHookShot />
        <Slam at={T(1.93)} style={{ left: 0, right: 0, top: 640, display: "flex", justifyContent: "center" }}>
          <Stamp text="WERBUNG!" size={160} rotate={-10} />
        </Slam>
      </Cut>
      <Cut T={T} a={2.7} b={6.219 + 1}>
        <LenaRewindShot t0={t0 + T(2.7) / FPS} rewindAt={T(5.55 - 2.7)} cardAt={T(3.59 - 2.7)} />
      </Cut>
    </AbsoluteFill>
  );
};

const CupHookShot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const z = spring({ frame, fps, config: { damping: 16, stiffness: 240 } });
  const cam: V3 = [0.15, 0.85, interpolate(z, [0, 1], [7, 3.0]) - frame * 0.005];
  return (
    <AbsoluteFill>
      <WarmBg />
      <CineStage cam={cam} look={[0, 0.05, 0]} fov={34} lift={-90} bloom={0.5} exposure={0.9} env={0.5} key1="#FFE8C8" keyI={1.5} rim="#FFB870" rimI={1.4} amb={0.35} floor={0}>
        <BokehLights frame={frame} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[3, 48]} />
          <meshPhysicalMaterial color="#5A3820" roughness={0.4} clearcoat={0.6} />
        </mesh>
        <CoffeeCup rotation={[0, -0.6 + frame * 0.01, 0]} />
        <Steam frame={frame} position={[0, 0.36, 0]} scale={0.8} />
        {[
          [-0.6, 0.03, 0.4],
          [0.55, 0.03, 0.5],
          [0.7, 0.03, -0.2],
          [-0.45, 0.03, -0.35],
        ].map((p, i) => (
          <Bean key={i} position={p as V3} rotation={[0, i * 1.3, 0]} scale={1.2} />
        ))}
      </CineStage>
      <div style={{ position: "absolute", top: 210, left: 0, right: 0 }}>
        <Txt size={100} color="#FFFFFF" style={{ WebkitTextStroke: "4px #3B1F0E" }}>
          DEINE KAFFEEPAUSE
        </Txt>
        <Txt size={110} color="#FFC37A" style={{ WebkitTextStroke: "4px #3B1F0E" }}>
          IST WERBUNG?
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
        <Card at={cardAt} top={330} size={52} bg="#3B1F0E" color="#FFE8C8" rotate={-2}>
          💰 bezahlt von Kaffee-Ländern
        </Card>
      )}
      {frame >= rewindAt && <Vhs label="1902" />}
    </AbsoluteFill>
  );
};

// =============== Szene 2 – Buffalo 1902: Fabrik, Pfiff, Pause mit Kaffee (Legende) ===============
export const Scene2: React.FC<SceneProps> = () => {
  const T = TS(1);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.4}>
        <Vintage strength={0.4}>
          <FactoryShot />
        </Vintage>
        <YearTag text="Buffalo · 1902" />
      </Cut>
      <Cut T={T} a={2.4} b={6.241 + 1}>
        <Vintage strength={0.4}>
          <BreakShot walkAt={T(3.26 - 2.4)} pauseAt={T(4.99 - 2.4)} />
        </Vintage>
      </Cut>
    </AbsoluteFill>
  );
};

const FactoryShot: React.FC = () => {
  const frame = useCurrentFrame();
  const cam: V3 = [1.6 - frame * 0.012, 2.3, 6.4 - frame * 0.015];
  return (
    <AbsoluteFill>
      <SepiaBg />
      <CineStage cam={cam} look={[0, 1.1, -1]} fov={38} key1="#FFE2B0" keyI={1.0} rim="#FFC98A" rimI={1.0} amb={0.35} env={0.35} bloom={1.0} fog={{ color: "#2A1E14", near: 7, far: 18 }}>
        <Factory frame={frame} />
        {[-2.2, 0.2, 2.6].map((x, i) => (
          <Human
            key={x}
            frame={frame}
            seed={80 + i}
            position={[x - 0.1, 0, -0.85]}
            rotation={[0, Math.PI * 0.75, 0]}
            top={WORKERS[i].top}
            bottom="#3A3A3A"
            skin={WORKERS[i].skin}
            hair={WORKERS[i].hair}
            hairStyle="short"
            pose={{ armR: 0.9 + Math.sin(frame * 0.3 + i) * 0.2, bendR: 0.6, armL: 0.8 + Math.cos(frame * 0.3 + i) * 0.2, bendL: 0.6, gesture: 0, headNod: 0.25 }}
          />
        ))}
      </CineStage>
      <Card top={330} size={52} bg="#2B1D0E" color="#F1E6C8">
        🏭 Arbeit von früh bis spät
      </Card>
    </AbsoluteFill>
  );
};

const BreakShot: React.FC<{ walkAt: number; pauseAt: number }> = ({ walkAt, pauseAt }) => {
  const frame = useCurrentFrame();
  const w = Math.max(0, frame - walkAt);
  const go = interpolate(frame, [walkAt, walkAt + 50], [0, 1], clamp);
  const cam: V3 = [0.9, 1.7, 3.6 - frame * 0.006];
  return (
    <AbsoluteFill>
      <SepiaBg />
      <CineStage cam={cam} look={[0.2, 1.0, -0.4]} fov={38} key1="#FFE2B0" keyI={1.1} rim="#FFC98A" rimI={1.0} amb={0.4} env={0.35} bloom={1.0} lift={-80} fog={{ color: "#2A1E14", near: 7, far: 18 }}>
        <Factory frame={frame} />
        {/* Tisch mit Kaffeekanne und Bechern */}
        <Block size={[1.4, 0.06, 0.7]} position={[0.6, 0.85, 0.2]} color="#6B4226" rough={0.6} />
        <Block size={[0.06, 0.85, 0.06]} position={[0.0, 0.42, 0.45]} color="#4A2E1A" />
        <Block size={[0.06, 0.85, 0.06]} position={[1.2, 0.42, 0.45]} color="#4A2E1A" />
        <CoffeePot position={[0.6, 0.88, 0.15]} rotation={[0, -0.4, 0]} />
        <Steam frame={frame} position={[0.78, 1.3, 0.15]} scale={0.5} />
        {[0.15, 0.3, 1.0].map((x, i) => (
          <CoffeeCup key={x} position={[x, 0.88, 0.35 - (i % 2) * 0.2]} scale={0.32} color="#D9D2C2" />
        ))}
        {[0, 1, 2].map((i) => (
          <Human
            key={i}
            frame={frame}
            seed={90 + i}
            position={[-2.4 + i * 0.5 + go * (2.0 - i * 0.25), 0, -0.6 + i * 0.35 + go * 0.2]}
            rotation={[0, Math.PI / 2 - 0.3, 0]}
            top={WORKERS[i].top}
            bottom="#3A3A3A"
            skin={WORKERS[i].skin}
            hair={WORKERS[i].hair}
            hairStyle="short"
            pose={{ walk: go < 1 && frame > walkAt ? w * 0.25 + i : undefined, smile: go, gesture: 0, blink: (frame + i * 7) % 80 < 3 }}
          />
        ))}
      </CineStage>
      <Card top={240} size={52} bg="#2B1D0E" color="#F1E6C8">
        📜 Der Legende nach …
      </Card>
      <Card at={pauseAt} top={360} size={62} bg="#8A4B22" color="#fff" rotate={-2}>
        ☕ PAUSE!
      </Card>
    </AbsoluteFill>
  );
};

// =============== Szene 3 – 50 Jahre später: Kaffee wird teuer, Säcke bleiben liegen ===============
export const Scene3: React.FC<SceneProps> = () => {
  const T = TS(2);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.65}>
        <PriceShot upAt={T(2.0)} />
      </Cut>
      <Cut T={T} a={2.65} b={5.116 + 1}>
        <WarehouseShot />
      </Cut>
    </AbsoluteFill>
  );
};

const PriceShot: React.FC<{ upAt: number }> = ({ upAt }) => {
  const frame = useCurrentFrame();
  const chart = usePriceChart(interpolate(frame, [6, upAt], [0, 1], clamp));
  const cam = add([0, 0.0, 4.8 - frame * 0.006], shake3(frame, upAt, 8, 0.04));
  return (
    <AbsoluteFill>
      <WarmBg />
      <CineStage cam={cam} look={[0, -0.1, 0]} fov={36} key1="#FFF1D8" keyI={1.4} rim="#FFB870" rimI={0.8} amb={0.45} bloom={0.4} exposure={0.9} env={0.5} lift={-60}>
        <Sheet tex={chart} size={[1.6, 1.2]} rotation={[0, -0.08, 0.02]} />
        {Array.from({ length: 8 }).map((_, i) => {
          const t = ((frame * 0.02 + i / 8) % 1);
          return <Bean key={i} position={[-0.9 + (i % 4) * 0.6, 0.9 - t * 2.2, 0.4]} rotation={[frame * 0.1 + i, i, 0]} scale={1.3} />;
        })}
      </CineStage>
      <Card at={upAt} top={300} size={64} bg="#D62828" color="#fff" rotate={-2}>
        📈 Kaffee wird teuer
      </Card>
    </AbsoluteFill>
  );
};

const WarehouseShot: React.FC = () => {
  const frame = useCurrentFrame();
  const label = useSackLabel("KAFFEE");
  const cam: V3 = [1.6 - frame * 0.008, 1.7, 5.6 - frame * 0.01];
  return (
    <AbsoluteFill>
      <SepiaBg />
      <CineStage cam={cam} look={[0.2, 0.9, -0.5]} fov={38} key1="#FFE2B0" keyI={1.0} rim="#FFC98A" rimI={1.0} amb={0.35} env={0.35} bloom={0.8} lift={-80}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#4A3A2A" roughness={0.9} />
        </mesh>
        <mesh position={[0, 3, -2.5]}>
          <planeGeometry args={[30, 6]} />
          <meshStandardMaterial color="#5A4636" roughness={0.95} />
        </mesh>
        {/* Säcke gestapelt */}
        {Array.from({ length: 14 }).map((_, i) => {
          const row = i < 6 ? 0 : i < 11 ? 1 : 2;
          const idx = row === 0 ? i : row === 1 ? i - 6 : i - 11;
          const n = [6, 5, 3][row];
          return <CoffeeSack key={i} label={label} position={[-1.9 + (idx + row * 0.5) * 0.7 + (6 - n) * 0, row * 0.62, -1.3 - row * 0.1]} rotation={[0, (i % 3) * 0.2 - 0.2, 0]} />;
        })}
        <Human
          frame={frame}
          seed={95}
          position={[1.2, 0, 0.5]}
          rotation={[0, -0.3, 0]}
          top="#E9E3D6"
          bottom="#4A3A2A"
          skin="#C98E6A"
          hair="#1E140C"
          hairStyle="short"
          collar="#7A5634"
          pose={{ brow: -0.9, headNod: 0.2, armR: 0.3, bendR: 1.6, armL: 0.3, bendL: 1.6, gesture: 0, blink: frame % 70 < 3 }}
        />
      </CineStage>
      <Card top={260} size={50} bg="#2B1D0E" color="#F1E6C8">
        🌎 Kaffee-Länder: weniger verkauft?
      </Card>
    </AbsoluteFill>
  );
};

// =============== Szene 4 – New York 1952: Kampagne, Plakat entsteht, Spruch ===============
export const Scene4: React.FC<SceneProps> = () => {
  const T = TS(3);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.7}>
        <YearShot text="1952" color="#8A4B22" sub="NEW YORK" bg="radial-gradient(circle at 50% 42%, #FFF3E0 0%, #C9A27E 85%)" />
      </Cut>
      <Cut T={T} a={2.7} b={5.7}>
        <CampaignShot />
      </Cut>
      <Cut T={T} a={5.7} b={8.525 + 1}>
        <SloganShot stampAt={T(6.74 - 5.7)} />
      </Cut>
    </AbsoluteFill>
  );
};

// Kaffeebohnen fliegen aus dem Süden nach New York, dort entsteht das Plakat
const CampaignShot: React.FC = () => {
  const frame = useCurrentFrame();
  const poster = usePoster(interpolate(frame, [20, 80], [0, 1], clamp));
  const cam: V3 = [0.3, 0.2, 3.4 - frame * 0.008];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(#1E2A44, #3A2A2A)" }} />
      <CineStage cam={cam} look={[0, 0.1, 0]} fov={36} key1="#FFF1D8" keyI={1.4} rim="#FFB870" rimI={1.0} amb={0.4} bloom={0.6} exposure={0.9} env={0.5} lift={-60}>
        <Sheet tex={poster} size={[1.3, 1.82]} position={[0.15, 0, 0]} rotation={[0, -0.1, 0]} />
        {Array.from({ length: 14 }).map((_, i) => {
          const t = ((frame * 0.025 + i / 14) % 1);
          return <Bean key={i} position={[-2.2 + t * 2.4, -1.0 + t * 1.2 + Math.sin(i) * 0.4, 0.5 + Math.cos(i) * 0.2]} rotation={[frame * 0.1 + i, i, 0]} scale={1.4} />;
        })}
        {/* Pinsel malt mit */}
        <mesh position={[0.6, 0.9 - interpolate(frame, [20, 80], [0, 1.8], clamp), 0.2]} rotation={[0, 0, 0.7]} castShadow>
          <cylinderGeometry args={[0.02, 0.03, 0.5, 12]} />
          <meshStandardMaterial color="#8A5A3A" />
        </mesh>
      </CineStage>
      <Card top={240} size={50} bg="#3B1F0E" color="#FFE8C8">
        🤝 Bündnis der Kaffee-Länder
      </Card>
      <Card at={30} top={350} size={50} bg="#fff" color="#3B1F0E" rotate={-2}>
        startet eine Werbekampagne
      </Card>
    </AbsoluteFill>
  );
};

const SloganShot: React.FC<{ stampAt: number }> = ({ stampAt }) => {
  const frame = useCurrentFrame();
  const poster = usePoster(1);
  const cam = add([0, 0.15, 2.9 - frame * 0.008], shake3(frame, stampAt, 10, 0.05));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(#1E2A44, #3A2A2A)" }} />
      <CineStage cam={cam} look={[0, 0.1, 0]} fov={36} key1="#FFF1D8" keyI={1.4} rim="#FFB870" rimI={1.0} amb={0.4} bloom={0.6} exposure={0.9} env={0.5} lift={-60}>
        <BokehLights frame={frame} />
        <Sheet tex={poster} size={[1.3, 1.82]} rotation={[0, Math.sin(frame * 0.04) * 0.08, 0]} />
      </CineStage>
      <Card top={230} size={44} bg="rgba(255,248,231,0.95)" color="#3B1F0E">
        „Give yourself a Coffee-Break“
      </Card>
      <Slam at={stampAt} style={{ left: 0, right: 0, top: 1480, display: "flex", justifyContent: "center" }}>
        <Stamp text="WERBUNG" size={120} rotate={-8} />
      </Slam>
    </AbsoluteFill>
  );
};

// =============== Szene 5 – Radio, Zeitung, Plakat -> Büro macht Pause ===============
export const Scene5: React.FC<SceneProps> = () => {
  const T = TS(4);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.6}>
        <MediaShot at={[0.21, 1.0, 1.81].map((s) => T(s))} />
      </Cut>
      <Cut T={T} a={2.6} b={5.291 + 1}>
        <OfficeShot ringAt={T(3.42 - 2.6)} />
      </Cut>
    </AbsoluteFill>
  );
};

const MediaShot: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const news = useNewspaper();
  const poster = usePoster(1);
  const pop = (k: number) => (frame >= at[k] ? spring({ frame: frame - at[k], fps, config: { damping: 11, stiffness: 220 } }) : 0);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #E9A86A 0%, #5A2A16 85%)" }} />
      <CineStage cam={[0, 0.4, 4.2 - frame * 0.006]} look={[0, 0.35, 0]} fov={36} key1="#FFF1D8" keyI={1.5} rim="#FFB870" rimI={1.0} amb={0.45} bloom={0.6} exposure={0.9} env={0.5} lift={-40}>
        <group scale={pop(0)} position={[-0.75, 0.75, 0]}>
          <Radio frame={frame} rotation={[0.1, 0.35, 0]} scale={0.9} />
        </group>
        <group scale={pop(1)} position={[0.75, 0.55, 0]} rotation={[0, -0.3, 0.12 + (1 - pop(1)) * 2]}>
          <Sheet tex={news} size={[0.9, 1.2]} />
        </group>
        <group scale={pop(2)} position={[0, -0.6, 0.3]} rotation={[0, 0, -0.06]}>
          <Sheet tex={poster} size={[0.8, 1.12]} />
        </group>
      </CineStage>
      <div style={{ position: "absolute", top: 220, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 20 }}>
        {["📻 Radio", "📰 Zeitung", "🪧 Plakat"].map((w, k) => (
          <div key={w} style={{ transform: `scale(${pop(k)})`, background: "rgba(255,248,231,0.95)", color: "#3B1F0E", fontFamily: FONT_SUB, fontWeight: 900, fontSize: 44, padding: "8px 20px", borderRadius: 16 }}>
            {w}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const OfficeShot: React.FC<{ ringAt: number }> = ({ ringAt }) => {
  const frame = useCurrentFrame();
  const minutes = 10 * 60 + 29 + interpolate(frame, [0, ringAt], [0, 1], clamp);
  const go = interpolate(frame, [ringAt + 2, ringAt + 40], [0, 1], clamp);
  const cam: V3 = [0.6, 2.3, 6.6 - frame * 0.01];
  const desks: V3[] = [
    [-1.6, 0, -0.4],
    [0, 0, -0.6],
    [1.6, 0, -0.4],
    [-0.8, 0, 0.8],
  ];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "#8FA39A" }} />
      <CineStage cam={cam} look={[0.3, 1.1, -0.6]} fov={42} key1="#FFF4E0" keyI={1.4} rim="#BFD7EA" rimI={1.0} amb={0.45} env={0.5} bloom={0.6} exposure={0.95}>
        <OfficeRoom frame={frame} />
        <WallClock position={[0, 2.5, -2.95]} minutes={minutes} scale={1.1} />
        {desks.map((p, i) => (
          <OfficeDesk key={i} position={p} />
        ))}
        {/* Kaffeetisch rechts */}
        <Block size={[0.9, 0.06, 0.6]} position={[2.6, 0.95, 0.6]} color="#5A3720" />
        <Block size={[0.8, 0.92, 0.5]} position={[2.6, 0.46, 0.6]} color="#4A2E1A" />
        <CoffeePot position={[2.5, 0.98, 0.6]} rotation={[0, -1.2, 0]} />
        <Steam frame={frame} position={[2.6, 1.45, 0.6]} scale={0.5} />
        {desks.map((p, i) => {
          const tx = 2.0 - (i % 2) * 0.2;
          const tz = 0.1 + i * 0.35;
          const x = p[0] + (tx - p[0]) * go;
          const z = p[2] - 0.55 + (tz - p[2] + 0.55) * go;
          return (
            <Human
              key={i}
              frame={frame}
              seed={100 + i}
              position={[x, 0, z]}
              rotation={[0, go > 0 && go < 1 ? Math.atan2(tx - p[0], tz - p[2] + 0.55) : go >= 1 ? Math.PI / 2 : 0, 0]}
              top={["#F4F1EA", "#E9E3D6", "#F4F1EA", "#C9D6E8"][i]}
              bottom="#2B2B30"
              skin={WORKERS[i].skin}
              hair={WORKERS[i].hair}
              hairStyle={WORKERS[i].hs}
              robe={WORKERS[i].hs === "long" ? "#6D597A" : undefined}
              collar="#2B3A55"
              pose={{
                walk: go > 0 && go < 1 ? frame * 0.25 + i : undefined,
                armR: go < 0.01 ? 0.7 : go >= 1 ? 0.8 : 0,
                bendR: go < 0.01 ? 0.8 : go >= 1 ? 1.4 : 0.1,
                headNod: go < 0.01 ? 0.3 : 0,
                smile: go,
                gesture: 0,
                blink: (frame + i * 11) % 80 < 3,
              }}
              hand={go >= 1 ? <CoffeeCup position={[0, -0.05, 0.05]} scale={0.22} /> : undefined}
            />
          );
        })}
      </CineStage>
      <Card at={ringAt} top={240} size={58} bg="#8A4B22" color="#fff" rotate={-2}>
        ☕ 10:30 Uhr: Kaffeepause!
      </Card>
    </AbsoluteFill>
  );
};

// =============== Szene 6 – Lena: Erholung? Nein, mehr verkaufter Kaffee ===============
export const Scene6: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  const T = TS(5);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={2.55}>
        <LenaClose t0={t0} look={{ brow: 0.4, smile: 0.3 }} />
        <Card at={T(1.67)} top={300} size={60} bg="#FFF8E7" color="#2B1D0E" rotate={-2}>
          deine Erholung? 😌
        </Card>
      </Cut>
      <Cut T={T} a={2.55} b={5.204 + 1}>
        <SalesShot stampAt={T(4.31 - 2.55)} />
      </Cut>
    </AbsoluteFill>
  );
};

// Tassen werden immer mehr, Münzen fallen in den Kaffeesack
const SalesShot: React.FC<{ stampAt: number }> = ({ stampAt }) => {
  const frame = useCurrentFrame();
  const label = useSackLabel("UMSATZ");
  const n = Math.min(18, 2 + Math.floor(frame / 3));
  const cam = add([0, 1.1, 4.4 - frame * 0.01], shake3(frame, stampAt, 10, 0.05));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #6B3A1E 0%, #1A0C06 85%)" }} />
      <CineStage cam={cam} look={[0, 0.6, 0]} fov={38} key1="#FFFFFF" keyI={1.6} rim="#FFB870" rimI={1.4} amb={0.4} bloom={0.9} exposure={0.9} env={0.5} floor={0} lift={-120}>
        <BokehLights frame={frame} />
        <CoffeeSack label={label} position={[0, 0, -0.2]} scale={1.6} />
        {Array.from({ length: n }).map((_, i) => (
          <CoffeeCup key={i} position={[-1.5 + (i % 6) * 0.6, 0, 0.6 + Math.floor(i / 6) * 0.45]} rotation={[0, i, 0]} scale={0.6} />
        ))}
        {Array.from({ length: 10 }).map((_, i) => {
          const t = ((frame * 0.03 + i / 10) % 1);
          return <Coin key={`c${i}`} position={[Math.sin(i * 2.1) * 0.3, 2.6 - t * 1.6, -0.2 + Math.cos(i) * 0.2]} rotation={[frame * 0.2 + i, 0, 0.3]} scale={1.6} />;
        })}
      </CineStage>
      <Slam at={stampAt} style={{ left: 0, right: 0, top: 260, display: "flex", justifyContent: "center" }}>
        <Stamp text="MEHR KAFFEE" size={130} rotate={-8} />
      </Slam>
    </AbsoluteFill>
  );
};

// =============== Szene 7 – Gewohnheit + Name = Verkauf, der Trick, Folgen ===============
export const Scene7: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  const T = TS(6);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={3.4}>
        <FormulaShot at={[0.59, 1.51, 2.46].map((s) => T(s))} />
      </Cut>
      <Cut T={T} a={3.4} b={5.3}>
        <TrickShot t0={t0 + T(3.4) / FPS} stampAt={T(4.65 - 3.4)} />
      </Cut>
      <Cut T={T} a={5.3} b={7.558 + 1}>
        <OutroShot t0={t0 + T(5.3) / FPS} />
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
      <WarmBg />
      <CineStage cam={[0, 0.6, 3.0 - frame * 0.005]} look={[0, 0.1, 0]} fov={34} key1="#FFE8C8" keyI={1.5} rim="#FFB870" rimI={1.2} amb={0.4} bloom={0.6} exposure={0.9} env={0.5} floor={0} lift={-200}>
        <BokehLights frame={frame} />
        <CoffeeCup rotation={[0, frame * 0.02, 0]} scale={pop(2)} />
        <Steam frame={frame} position={[0, 0.36, 0]} scale={0.8} strength={pop(2)} />
      </CineStage>
      <div style={{ position: "absolute", top: 240, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ transform: `scale(${pop(0)})`, fontFamily: FONT_SUB, fontWeight: 900, fontSize: 80, color: "#fff", textShadow: "0 5px 0 rgba(0,0,0,0.4)" }}>🔁 Gewohnheit</div>
        <div style={{ transform: `scale(${pop(1)})`, fontFamily: FONT_SUB, fontWeight: 900, fontSize: 80, color: "#FFC37A", textShadow: "0 5px 0 rgba(0,0,0,0.4)" }}>+ 🏷️ Name</div>
        <div style={{ transform: `scale(${pop(2)})`, fontFamily: FONT_SUB, fontWeight: 900, fontSize: 88, color: "#7BE495", textShadow: "0 5px 0 rgba(0,0,0,0.4)" }}>= 💰 Verkauf</div>
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
