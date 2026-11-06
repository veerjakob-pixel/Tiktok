// Folge 5 "Fackeln der Freiheit": Hook (Fackel -> Zigarette) -> 1920er -> Osterparade 1929 -> Zeitungen -> der Trick.
// Rauchen wird nie cool gezeigt: immer als bezahlte, inszenierte Werbung (Stempel, Geldsack, Warnhinweis).
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Vintage } from "../components/Overlays";
import { Stamp } from "../folge3/Graphics";
import { FONT_SUB } from "../theme";
import { Cut, Slam, Txt, WhiteFlash } from "../folge4/Scenes";
import { add, Bill, clamp, shake3, Stage3D, Text3D, useBillTexture, V3 } from "../folge4-3d/Kit";
import { faceAt, Look, Person } from "../folge4b/People";
import { FPS } from "../folge3/script";
import { speakingAt, TS, Who } from "./script";
import {
  Cigarette,
  City,
  HangingTag,
  MoneySack,
  Newspaper3D,
  OldPerson,
  OldStreet,
  Pack,
  PressCam,
  Pie,
  Torch,
  useNewspaperTexture,
  useTagTexture,
} from "./Props";

export type SceneProps = { dur: number; from: number };

// ---------- Straße heute mit Lena + Florian ----------
const LENA = { pos: [-0.45, 0, 0.2] as V3, rot: 0.55, head: [-0.45, 1.62, 0.2] as V3 };
const FLO = { pos: [0.5, 0, 0.3] as V3, rot: -0.55, head: [0.5, 1.62, 0.3] as V3 };

const useFaces = (t0: number) => {
  const frame = useCurrentFrame();
  const t = t0 + frame / FPS;
  const f = (who: Who, seed: number) => faceAt(frame, speakingAt(who, t), seed);
  return { lena: f("lena", 1), florian: f("florian", 4) };
};

const CityBg: React.FC = () => <AbsoluteFill style={{ background: "linear-gradient(#9CC3DE, #E8EEF2)" }} />;

const CityScene: React.FC<{ t0: number; cam: V3; look: V3; fov?: number; lena?: Look; flo?: Look; lift?: number; children?: React.ReactNode }> = ({
  t0,
  cam,
  look,
  fov = 32,
  lena = {},
  flo = {},
  lift = 0,
  children,
}) => {
  const faces = useFaces(t0);
  return (
    <Stage3D cam={cam} look={look} fov={fov} floor={null} dist={1} lift={lift} exposure={0.9} rim="#ffe8c8">
      <City />
      <Person position={LENA.pos} rotation={[0, LENA.rot, 0]} shirt="#E76F51" hair="#5A3A1A" hairStyle="long" look={{ ...faces.lena, ...lena }} />
      <Person
        position={FLO.pos}
        rotation={[0, FLO.rot, 0]}
        shirt="#264653"
        hair="#2B1D0E"
        hairStyle="short"
        skin="#E8B996"
        look={{ ...faces.florian, ...flo }}
      />
      {children}
    </Stage3D>
  );
};

const closeUp = (who: typeof LENA, d = 2.2): { cam: V3; look: V3 } => {
  const dir: V3 = [Math.sin(who.rot), 0, Math.cos(who.rot)];
  return {
    cam: [who.head[0] + dir[0] * d, who.head[1] + 0.05, who.head[2] + dir[2] * d],
    look: [who.head[0], who.head[1] - 0.36, who.head[2]],
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

const LenaClose: React.FC<{ t0: number; look?: Look; tag?: boolean }> = ({ t0, look = {}, tag }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // kurzer, harter Push-In am Schnittanfang
  const s = spring({ frame, fps, config: { damping: 18, stiffness: 240 } });
  const c = closeUp(LENA, interpolate(s, [0, 1], [3.0, 2.0]) - frame * 0.004);
  return (
    <AbsoluteFill>
      <CityBg />
      <CityScene t0={t0} cam={c.cam} look={c.look} lena={look} fov={30} />
      {tag && <NameTag name="Lena" color="#E76F51" />}
    </AbsoluteFill>
  );
};

const FloClose: React.FC<{ t0: number; look?: Look; tag?: boolean }> = ({ t0, look = {}, tag }) => {
  const frame = useCurrentFrame();
  const c = closeUp(FLO, 2.2 - frame * 0.004);
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

// =============== Szene 1 – Hook: Fackel wird Zigarette, Stempel WERBUNG ===============
export const Scene1: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  const T = TS(0);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={4.0}>
        <TorchShot morphAt={T(1.9)} stampAt={T(2.75)} />
      </Cut>
      <Cut T={T} a={4.0} b={6.663 + 1}>
        <FreedomTwoShot t0={t0 + T(4.0) / FPS} cigAt={T(4.26 - 4.0)} freeAt={T(5.28 - 4.0)} />
      </Cut>
    </AbsoluteFill>
  );
};

const TorchShot: React.FC<{ morphAt: number; stampAt: number }> = ({ morphAt, stampAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // harter Zoom ab Bild 0
  const z = spring({ frame, fps, config: { damping: 16, stiffness: 260 } });
  const m = spring({ frame: frame - morphAt, fps, config: { damping: 14, stiffness: 200 } });
  const cam = add([0, 0.6, interpolate(z, [0, 1], [12, 5.4]) - frame * 0.006], shake3(frame, stampAt, 12, 0.14));
  const spin = frame * 0.02 + m * Math.PI * 2;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 42%, ${frame < morphAt ? "#5A2A10" : "#2E2E33"} 0%, #0B0A0C 75%)`,
        }}
      />
      <Stage3D cam={cam} look={[0, 0.25, 0]} fov={34} floor={null} dist={1} lift={-120} exposure={1.0}>
        {m < 0.98 && <Torch scale={1 - m} rotation={[0, spin, (1 - m) * 0.12]} position={[0, 0, 0]} />}
        {m > 0.02 && <Cigarette scale={m * 1.25} rotation={[0, spin, -0.12]} position={[0, -0.1, 0]} smoke glow={0.6} />}
      </Stage3D>
      {/* Bildschirm-Text sofort da (Hook ohne Ton verständlich) */}
      <Slam at={0} from={1.6} style={{ top: 210, left: 0, right: 0 }}>
        <Txt size={112} color="#FFF8E7" style={{ WebkitTextStroke: "4px #3A1A08" }}>
          SIE NANNTEN ES
        </Txt>
        <Txt size={150} color="#FFB21F" style={{ WebkitTextStroke: "5px #3A1A08" }}>
          „FREIHEIT“
        </Txt>
      </Slam>
      {frame >= morphAt && <WhiteFlash at={morphAt} len={6} max={0.7} color="#FFE8C0" />}
      <Slam at={stampAt} style={{ left: 0, right: 0, top: 660, display: "flex", justifyContent: "center" }}>
        <Stamp text="WERBUNG" size={190} rotate={-12} />
      </Slam>
    </AbsoluteFill>
  );
};

const FreedomTwoShot: React.FC<{ t0: number; cigAt: number; freeAt: number }> = ({ t0, cigAt, freeAt }) => {
  const frame = useCurrentFrame();
  const cam: V3 = [0.05, 1.45, 4.7 - frame * 0.006];
  return (
    <AbsoluteFill>
      <CityBg />
      <CityScene t0={t0} cam={cam} look={[0.02, 1.05, 0]} lena={{ armUp: 0.55, brow: 0.5 }} flo={{ headTurn: 0.15 }} lift={80} />
      <NameTag name="Lena" color="#E76F51" />
      <Card at={cigAt} top={330} size={64}>
        🚬 ZIGARETTE
      </Card>
      <Card at={freeAt} top={460} size={72} bg="#FFB21F" color="#1D2433" rotate={-3}>
        = „FREIHEIT“ ?!
      </Card>
    </AbsoluteFill>
  );
};

// =============== Szene 2 – 1920er: Frauen rauchen nicht, halber Markt fehlt ===============
export const Scene2: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  const T = TS(1);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={0.9}>
        <FloClose t0={t0} tag />
      </Cut>
      <Cut T={T} a={0.9} b={1.9}>
        <RewindShot t0={t0 + T(0.9) / FPS} />
      </Cut>
      <Cut T={T} a={1.9} b={3.9}>
        <Vintage>
          <StreetShot shameAt={T(2.3 - 1.9)} />
        </Vintage>
        <YearTag text="USA · 1920er" />
      </Cut>
      <Cut T={T} a={3.9} b={7.499 + 1}>
        <Vintage strength={0.5}>
          <PieShot outAt={T(5.95 - 3.9)} />
        </Vintage>
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
      <Vhs label="1920er" />
    </AbsoluteFill>
  );
};

const StreetShot: React.FC<{ shameAt: number }> = ({ shameAt }) => {
  const frame = useCurrentFrame();
  const cam: V3 = [0.1, 1.7, 5.6 - frame * 0.012];
  // Frauen drehen den Kopf weg vom rauchenden Mann am Tabakladen
  const turn = interpolate(frame, [shameAt - 4, shameAt + 8], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(#CDB991, #8C7354)" }} />
      <Stage3D cam={cam} look={[0, 1.1, -1]} fov={36} floor={null} dist={1} lift={60} exposure={0.95} rim="#ffd9a0">
        <OldStreet />
        {/* Mann vor dem Tabakladen mit Zigarette */}
        <OldPerson
          woman={false}
          color="#3D405B"
          hat="#2B2D42"
          position={[0.95, 0.16, -0.6]}
          rotation={[0, -0.7, 0]}
          look={{ armUp: 0.55 }}
          hand={<Cigarette scale={0.09} rotation={[Math.PI / 2, 0, 0]} glow={0.5} />}
        />
        {/* drei Frauen schauen weg */}
        {[
          [-0.75, 0.2, 0.9, "#6D2E46"],
          [-0.2, -1.2, 0.7, "#1D3557"],
          [-1.1, -2.2, 1.1, "#7F5539"],
        ].map(([x, z, r, c], i) => (
          <OldPerson
            key={i}
            color={c as string}
            hat="#5E3023"
            position={[x as number, 0, z as number]}
            rotation={[0, (r as number) - turn * 1.2, 0]}
            look={{ headTurn: -turn * 0.6, brow: turn > 0.5 ? -1 : 0 }}
          />
        ))}
      </Stage3D>
      <Card at={shameAt} top={360} size={58} rotate={-2}>
        Frau + Zigarette =
        <br />
        <span style={{ color: "#9B2226" }}>„unanständig!“</span>
      </Card>
    </AbsoluteFill>
  );
};

const PieShot: React.FC<{ outAt: number }> = ({ outAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = spring({ frame: frame - outAt, fps, config: { damping: 12, stiffness: 200 } });
  const intro = spring({ frame, fps, config: { damping: 16, stiffness: 220 } });
  const cam = add([0.3, 0.6, interpolate(intro, [0, 1], [13, 9]) - frame * 0.006], shake3(frame, outAt, 10, 0.1));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #F6EBD0 0%, #C9AE7E 80%)" }} />
      <Stage3D cam={cam} look={[0, 0.1, 0]} fov={34} floor={null} dist={1} lift={60} exposure={1.0}>
        <Pie out={out} rotation={[0.25, -0.2 + frame * 0.002, 0]} position={[0.15, 0, 0]} />
      </Stage3D>
      <div style={{ position: "absolute", top: 220, left: 0, right: 0 }}>
        <Txt size={84} color="#2B1D0E" style={{ textShadow: "0 4px 0 rgba(255,255,255,0.5)" }}>
          KUNDEN DER
          <br />
          TABAKINDUSTRIE
        </Txt>
      </div>
      <div style={{ position: "absolute", top: 520, right: 70, opacity: intro }}>
        <Txt size={64} color="#9A6B12" font={FONT_SUB} style={{ fontWeight: 900, textShadow: "none" }}>
          Männer ✓
        </Txt>
      </div>
      {frame >= outAt && (
        <div style={{ position: "absolute", top: 980, left: 40, transform: `scale(${out})`, transformOrigin: "left top" }}>
          <div
            style={{
              background: "#5C5C5C",
              color: "#fff",
              fontFamily: FONT_SUB,
              fontWeight: 900,
              fontSize: 58,
              padding: "10px 28px",
              borderRadius: 16,
              boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
            }}
          >
            fehlende Kunden
            <div style={{ fontSize: 38, fontWeight: 700, opacity: 0.9 }}>(alle Frauen)</div>
          </div>
        </div>
      )}
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
  </AbsoluteFill>
);

// =============== Szene 4 – Osterparade New York 1929 ===============
export const Scene4: React.FC<SceneProps> = () => {
  const T = TS(3);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={1.3}>
        <Vintage>
          <YearShot />
        </Vintage>
      </Cut>
      <Cut T={T} a={1.3} b={4.2}>
        <Vintage strength={0.8}>
          <BernaysShot cardAt={T(3.0 - 1.3)} />
        </Vintage>
      </Cut>
      <Cut T={T} a={4.2} b={7.1}>
        <Vintage strength={0.8}>
          <ParadeShot flashes={[6.1, 6.38, 6.66].map((s) => T(s - 4.2))} />
        </Vintage>
        <YearTag text="New York · 1929" />
      </Cut>
      <Cut T={T} a={7.1} b={9.3 + 1}>
        <Vintage strength={0.7}>
          <PressShot flashes={[7.3, 7.6, 7.9, 8.2].map((s) => T(s - 7.1))} stampAt={T(8.3 - 7.1)} />
        </Vintage>
      </Cut>
    </AbsoluteFill>
  );
};

const YearShot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12, stiffness: 300 } });
  const cam = add([0, 0, interpolate(s, [0, 1], [14, 6])], shake3(frame, 1, 10, 0.15));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, #FFF6DD 0%, #C9AE7E 85%)" }} />
      <Stage3D cam={cam} look={[0, 0.3, 0]} fov={34} floor={null} dist={1} lift={60}>
        <Text3D text="1929" size={1.0} depth={0.4} color="#7A1E1E" position={[0, 0.3, 0]} rotation={[0.1, -0.25 + frame * 0.006, 0]} metal={0.5} />
      </Stage3D>
      <div style={{ position: "absolute", top: 1000, left: 0, right: 0 }}>
        <Txt size={70} color="#2B1D0E" style={{ textShadow: "none" }}>
          OSTERN · NEW YORK
        </Txt>
      </div>
    </AbsoluteFill>
  );
};

const BernaysShot: React.FC<{ cardAt: number }> = ({ cardAt }) => {
  const frame = useCurrentFrame();
  const cam: V3 = [0.4, 1.5, 4.3 - frame * 0.006];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(#D9C49A, #8C7354)" }} />
      <Stage3D cam={cam} look={[0, 1.2, 0]} fov={34} floor={null} dist={1} lift={-230} exposure={0.95}>
        <OldStreet />
        <OldPerson
          woman={false}
          color="#4A4E69"
          hat="#22223B"
          position={[0, 0.16, 0.4]}
          rotation={[0, -0.15, 0]}
          look={{ smile: 0.5, brow: -0.6, armUp: 0.35, talk: frame % 40 < 20 ? 0 : 0.2 }}
        />
      </Stage3D>
      <Card top={250} size={64} bg="#2B1D0E" color="#F1E6C8">
        EDWARD BERNAYS
        <div style={{ fontSize: 36, fontWeight: 700 }}>Werbe- und PR-Berater</div>
      </Card>
      <Card at={cardAt} top={470} size={46} rotate={3}>
        🥓🍳 derselbe wie bei
        <br />
        „Speck und Eier“
      </Card>
    </AbsoluteFill>
  );
};

const ParadeShot: React.FC<{ flashes: number[] }> = ({ flashes }) => {
  const frame = useCurrentFrame();
  const flash = Math.max(0, ...flashes.map((f) => interpolate(frame - f, [0, 1, 5], [0, 1, 0], clamp)));
  const cam: V3 = [0, 2.2, 7.2 - frame * 0.01];
  // die Frauen laufen auf die Kamera zu
  const walk = frame * 0.02;
  const crowd = React.useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => {
        const s = i % 2 ? 1 : -1;
        return {
          x: s * (2.35 + random(`cx${i}`) * 0.7),
          z: 3 - Math.floor(i / 2) * 1.2 - random(`cz${i}`) * 0.4,
          woman: random(`cw${i}`) > 0.5,
          color: ["#6B705C", "#3D405B", "#7F5539", "#22223B", "#5E3023"][i % 5],
          rot: -s * (1.1 + random(`cr${i}`) * 0.3),
        };
      }),
    [],
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(#E3D3AE, #9C805A)" }} />
      <Stage3D cam={cam} look={[0, 1.2, -2]} fov={38} floor={null} dist={1} lift={60} exposure={0.95 + flash * 0.6}>
        <OldStreet bunting />
        {crowd.map((c, i) => (
          <OldPerson key={i} woman={c.woman} color={c.color} hat="#3B2A1A" position={[c.x, 0.16, c.z]} rotation={[0, c.rot, 0]} look={{ headTurn: c.rot > 0 ? -0.3 : 0.3 }} />
        ))}
        {/* junge Frauen in der Mitte mit Zigarette (bezahlte Aktion) */}
        {[-0.7, 0, 0.7].map((x, i) => (
          <OldPerson
            key={x}
            color={["#1D3557", "#6D2E46", "#264653"][i]}
            hat="#2B2D42"
            position={[x, 0, -2.5 + walk + (i === 1 ? -0.5 : 0)]}
            look={{ armUp: 0.45 + Math.sin(frame * 0.2 + i) * 0.05, smile: 0.3 }}
            hand={<Cigarette scale={0.09} rotation={[Math.PI / 2, 0, 0]} glow={0.5} />}
          />
        ))}
      </Stage3D>
      {flash > 0 && <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.75 }} />}
      <Card at={6} top={360} size={50} rotate={-2}>
        Frauen rauchen – öffentlich
        <div style={{ fontSize: 34, color: "#9B2226" }}>bestellt und bezahlt</div>
      </Card>
    </AbsoluteFill>
  );
};

const PressShot: React.FC<{ flashes: number[]; stampAt: number }> = ({ flashes, stampAt }) => {
  const frame = useCurrentFrame();
  const fl = flashes.map((f) => interpolate(frame - f, [0, 1, 6], [0, 1, 0], clamp));
  const flash = Math.max(0, ...fl);
  const cam = add([0, 2.5, 5.6 - frame * 0.008], shake3(frame, stampAt, 10, 0.1));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(#E3D3AE, #9C805A)" }} />
      <Stage3D cam={cam} look={[0, 1.2, -1.4]} fov={38} floor={null} dist={1} lift={0} exposure={0.95 + flash * 0.5}>
        <OldStreet bunting />
        {[-0.5, 0.4].map((x, i) => (
          <OldPerson
            key={x}
            color={["#1D3557", "#6D2E46"][i]}
            hat="#2B2D42"
            position={[x, 0, -1.6]}
            look={{ armUp: 0.45, smile: 0.3 }}
            hand={<Cigarette scale={0.09} rotation={[Math.PI / 2, 0, 0]} glow={0.5} />}
          />
        ))}
        {/* Fotografen von hinten, Kameras auf die Frauen gerichtet */}
        {[-1.7, -0.9, 0.9, 1.7].map((x, i) => (
          <group key={x} position={[x, 0.16, 1.3 + (i % 2) * 0.4]} rotation={[0, Math.PI + (x > 0 ? -0.15 : 0.15), 0]}>
            <OldPerson woman={false} color={["#3D405B", "#22223B", "#4A4E69", "#2B2D42"][i]} hat="#1B1B1B" />
            <PressCam position={[0, 1.45, 0.45]} rotation={[0, 0, 0]} scale={0.6} flash={fl[i] ?? 0} />
          </group>
        ))}
      </Stage3D>
      {flash > 0 && <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.6 }} />}
      <Card top={250} size={60} bg="#2B1D0E" color="#F1E6C8">
        📸 Presse vorher eingeladen
      </Card>
      <Slam at={stampAt} style={{ left: 0, right: 0, top: 560, display: "flex", justifyContent: "center" }}>
        <Stamp text="INSZENIERT" size={150} rotate={-9} />
      </Slam>
    </AbsoluteFill>
  );
};

// =============== Szene 6 – Zeitungen: "Fackeln der Freiheit" – dahinter der Geldsack ===============
export const Scene6: React.FC<SceneProps> = () => {
  const T = TS(5);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={3.8}>
        <Vintage strength={0.55}>
          <PaperShot />
        </Vintage>
      </Cut>
      <Cut T={T} a={3.8} b={7.421 + 1}>
        <Vintage strength={0.45}>
          <SackShot stampAt={T(5.14 - 3.8)} />
        </Vintage>
      </Cut>
    </AbsoluteFill>
  );
};

const PAPERS: { from: V3; to: V3; rot: V3; at: number }[] = [
  { from: [-6, 3, 1], to: [-0.55, 0.25, -0.2], rot: [0, 0.15, 0.12], at: 3 },
  { from: [6, -2, 1], to: [0.6, -0.05, -0.1], rot: [0, -0.12, -0.1], at: 15 },
  { from: [0, 6, 2], to: [0, 0.1, 0.05], rot: [-0.05, 0, 0.03], at: 27 },
];

const PaperShot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tex = [useNewspaperTexture(0), useNewspaperTexture(1), useNewspaperTexture(2)];
  const cam: V3 = [0, 0.2, 7.0 - frame * 0.01];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #5A4632 0%, #1E160F 85%)" }} />
      <Stage3D cam={cam} look={[0, 0.1, 0]} fov={36} floor={null} dist={1} lift={90} exposure={1.05}>
        {PAPERS.map((p, i) => {
          const s = spring({ frame: frame - p.at, fps, config: { damping: 15, stiffness: 160 } });
          if (frame < p.at) return null;
          const pos = p.from.map((v, k) => interpolate(s, [0, 1], [v, p.to[k]])) as V3;
          const rot = p.rot.map((v, k) => v + (1 - s) * (k === 2 ? 3 : 1.2)) as V3;
          return <Newspaper3D key={i} tex={tex[i]} position={pos} rotation={rot} />;
        })}
      </Stage3D>
    </AbsoluteFill>
  );
};

const SackShot: React.FC<{ stampAt: number }> = ({ stampAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tex = useNewspaperTexture(2);
  const bill = useBillTexture();
  // Die Zeitung kippt nach vorne weg – dahinter versteckt: der Geldsack der Tabakindustrie
  const fall = spring({ frame: frame - 4, fps, config: { damping: 16, stiffness: 120 } });
  const sack = spring({ frame: frame - 6, fps, config: { damping: 12, stiffness: 180 } });
  const cam = add([0, 0.3, 6.4 - frame * 0.008], shake3(frame, stampAt, 10, 0.1));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #6B5236 0%, #1E160F 85%)" }} />
      <Stage3D cam={cam} look={[0, 0, 0]} fov={36} floor={-1.3} dist={1} lift={60} exposure={1.1}>
        <group position={[0, -1.3, 0.8]} rotation={[fall * 1.45, 0, 0]}>
          <Newspaper3D tex={tex} position={[0, 1.3, 0]} />
        </group>
        <group scale={0.4 + sack * 0.6}>
          <MoneySack position={[0, -0.3, -0.4]} rotation={[0, -0.2 + frame * 0.004, 0]} scale={1.05} />
        </group>
        <pointLight position={[0.5, 1.6, 1.8]} intensity={14 * sack} distance={7} color="#FFE2A8" />
        {Array.from({ length: 9 }).map((_, i) => (
          <Bill
            key={i}
            tex={bill}
            position={[(random(`sb${i}`) - 0.5) * 2.4, -1.28 + i * 0.006, -0.6 + random(`sz${i}`) * 1.4]}
            rotation={[-Math.PI / 2, 0, random(`sr${i}`) * 3]}
            scale={0.45}
          />
        ))}
      </Stage3D>
      <Card at={8} top={250} size={52} bg="#2B1D0E" color="#F1E6C8">
        Hinter der Schlagzeile:
      </Card>
      <Slam at={stampAt} style={{ left: 0, right: 0, top: 400, display: "flex", justifyContent: "center" }}>
        <Stamp text="BEZAHLT" size={160} rotate={-10} />
      </Slam>
    </AbsoluteFill>
  );
};

// =============== Szene 7 – Der Trick: Idee statt Produkt, Preisschilder, Folgen ===============
export const Scene7: React.FC<SceneProps> = ({ from }) => {
  const t0 = from / FPS;
  const T = TS(6);
  return (
    <AbsoluteFill>
      <Cut T={T} a={0} b={1.2}>
        <LenaClose t0={t0} look={{ smile: 0.4, brow: 0.4 }} />
      </Cut>
      <Cut T={T} a={1.2} b={4.1}>
        <ProductShot xAt={T(1.95 - 1.2)} ideaAt={T(3.43 - 1.2)} />
      </Cut>
      <Cut T={T} a={4.1} b={8.45}>
        <WordsShot at={[4.18, 4.91, 5.76].map((s) => T(s - 4.1))} tagsAt={[6.7, 6.88, 7.06].map((s) => T(s - 4.1))} />
      </Cut>
      <Cut T={T} a={8.45} b={13.262 + 1}>
        <OutroShot t0={t0 + T(8.45) / FPS} teaserAt={T(10.6 - 8.45)} />
      </Cut>
    </AbsoluteFill>
  );
};

const ProductShot: React.FC<{ xAt: number; ideaAt: number }> = ({ xAt, ideaAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const x = spring({ frame: frame - xAt, fps, config: { damping: 14, stiffness: 300 } });
  const cam = add([0.4, 0.5, 5.2 - frame * 0.01], shake3(frame, xAt, 8, 0.08));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #3A4A5C 0%, #0E1218 80%)" }} />
      <Stage3D cam={cam} look={[0, 0.2, 0]} fov={34} floor={-0.75} dist={1} lift={90}>
        <Pack position={[0, 0, 0]} rotation={[0.05, -0.35 + frame * 0.006, 0]} />
      </Stage3D>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0 }}>
        <Txt size={96} color="#fff">
          PRODUKT
        </Txt>
      </div>
      {frame >= xAt && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", top: -220 }}>
          <svg width={720} height={720} viewBox="0 0 100 100" style={{ opacity: Math.min(1, x * 1.2) }}>
            <path d={`M10,10 L${10 + 80 * x},${10 + 80 * x}`} stroke="#E01E37" strokeWidth="9" strokeLinecap="round" />
            <path d={`M90,10 L${90 - 80 * x},${10 + 80 * x}`} stroke="#E01E37" strokeWidth="9" strokeLinecap="round" />
          </svg>
        </AbsoluteFill>
      )}
      <Slam at={ideaAt} style={{ left: 0, right: 0, top: 940, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            background: "#FFD166",
            color: "#1D2433",
            fontFamily: FONT_SUB,
            fontWeight: 900,
            fontSize: 80,
            padding: "10px 46px",
            borderRadius: 22,
            boxShadow: "0 0 60px rgba(255,209,102,0.7)",
          }}
        >
          💡 EINE IDEE
        </div>
      </Slam>
    </AbsoluteFill>
  );
};

const WORDS: { text: string; tag: string; color: string; y: number }[] = [
  { text: "FREIHEIT", tag: "Zigaretten", color: "#FFB21F", y: 1.55 },
  { text: "LIEBE", tag: "Diamantring", color: "#FF5D73", y: 0.47 },
  { text: "GESUNDHEIT", tag: "Fettarm-Joghurt", color: "#06D6A0", y: -0.61 },
];

const WordsShot: React.FC<{ at: number[]; tagsAt: number[] }> = ({ at, tagsAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tags = [useTagTexture(WORDS[0].tag), useTagTexture(WORDS[1].tag), useTagTexture(WORDS[2].tag)];
  const cam: V3 = [0, 0, 11 - frame * 0.006];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 38%, #2B3A55 0%, #0B0F18 80%)" }} />
      <Stage3D cam={cam} look={[0, 0, 0]} fov={36} floor={null} dist={1} lift={130} exposure={1.0}>
        {WORDS.map((w, i) => {
          const s = spring({ frame: frame - at[i], fps, config: { damping: 11, stiffness: 260 } });
          const ts = frame - tagsAt[i];
          const drop = spring({ frame: ts, fps, config: { damping: 10, stiffness: 220 } });
          const swing = ts > 0 ? Math.sin(ts * 0.35) * 0.35 * Math.exp(-ts / 25) : 0;
          if (frame < at[i]) return null;
          return (
            <group key={w.text} position={[0, w.y, 0]}>
              <Text3D text={w.text} size={0.27} depth={0.14} color={w.color} emissive={w.color} scale={s} rotation={[0, Math.sin(frame * 0.05 + i) * 0.12, 0]} metal={0.3} />
              {ts >= 0 && (
                <group position={[0.5, -0.15 + (1 - drop) * 1.2, 0.15]} scale={drop}>
                  <HangingTag tex={tags[i]} swing={swing * 0.6} len={0.12} scale={0.75} />
                </group>
              )}
            </group>
          );
        })}
      </Stage3D>
      {frame >= tagsAt[0] && (
        <div style={{ position: "absolute", top: 210, left: 0, right: 0, opacity: interpolate(frame - tagsAt[0], [0, 6], [0, 1], clamp) }}>
          <Txt size={62} color="#fff" font={FONT_SUB} style={{ fontWeight: 900 }}>
            …und das Produkt hängt dran 🏷️
          </Txt>
        </div>
      )}
    </AbsoluteFill>
  );
};

const OutroShot: React.FC<{ t0: number; teaserAt: number }> = ({ t0, teaserAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bp = spring({ frame: frame - 16, fps, config: { damping: 12, stiffness: 260 } });
  const pulse = 1 + Math.sin((frame / 30) * Math.PI * 2 * 1.4) * 0.06;
  const cam: V3 = [0.1, 1.55, 5.2 + frame * 0.01];
  return (
    <AbsoluteFill>
      <CityBg />
      <CityScene t0={t0} cam={cam} look={[0, 1.25, 0]} lena={{ armUp: 0.4, smile: 0.7 }} flo={{ smile: 0.7, headTurn: 0.3 }} lift={-120} />
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
      <Card at={teaserAt} top={620} size={44} bg="#1D2433" color="#fff" rotate={-2}>
        Teil 6: Hat Coca-Cola den
        <br />
        Weihnachtsmann erfunden? 🎅
      </Card>
    </AbsoluteFill>
  );
};
