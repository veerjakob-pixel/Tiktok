// Folge 4 in 3D: gleiche Szenen, Schnitte und Zeiten wie die 2D-Version, aber mit Three.js.
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig, spring, Easing } from "remotion";
import { Vintage } from "../components/Overlays";
import { Stamp } from "../folge3/Graphics";
import { FONT_SUB } from "../theme";
import { Bg, Counter, Cut, PaperBg, Slam, Txt, useT, WhiteFlash } from "../folge4/Scenes";
import { SCENES } from "../folge4/script";
import {
  add,
  Bill,
  Block,
  Butter,
  clamp,
  Heart,
  Magnifier,
  Scientist,
  shake3,
  Sheet,
  Stage3D,
  SugarCube,
  Text3D,
  useBillTexture,
  useDolly,
  useSpr,
  V3,
} from "./Kit";
import {
  useBoxLabelTexture,
  useEcgTexture,
  useEnvelopeTexture,
  useJournalTexture,
  useLabelTexture,
  useLetterheadTexture,
  useLetterTexture,
  useNewsTexture,
  usePageTexture,
  useSignTexture,
  useStickerTexture,
  useTvTexture,
  useWantedTexture,
  useYogurtTexture,
} from "./Textures";

export type SceneProps = { dur: number };
// Objekte um y=0 erscheinen im oberen Bildbereich (über den Untertiteln)
const LY = -1.05;

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

const HookCube: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = spring({ frame, fps, config: { damping: 9, stiffness: 380 } });
  const y = interpolate(drop, [0, 1], [3.2, -0.45]);
  const cam = add(useDolly([0, 0.6, 6.8], [0, 0.2, 5.4], 14), shake3(frame, 3, 12, 0.18));
  return (
    <AbsoluteFill>
      <Bg a="#6B1226" b="#0B0306" />
      <Stage3D cam={cam} look={[0, LY + 0.4, 0]} rim="#ff5577" floor={-0.95} dist={1.6}>
        <SugarCube position={[0, y, 0]} rotation={[0.35 * (1 - drop), 0.6 + (1 - drop) * 1.4, 0.2 * (1 - drop)]} scale={1.25} />
        {/* Zuckerkristalle spritzen beim Aufprall */}
        {Array.from({ length: 34 }).map((_, i) => {
          const t = Math.max(0, frame - 4) / 30;
          const a = random(`a${i}`) * Math.PI * 2;
          const v = 2 + random(`v${i}`) * 3.5;
          const px = Math.cos(a) * v * t;
          const pz = Math.sin(a) * v * t;
          const py = -0.6 + (2.5 + random(`u${i}`) * 3) * t - 9.8 * t * t * 0.5;
          if (frame < 4 || py < -1) return null;
          return <SugarCube key={i} position={[px, py, pz]} rotation={[t * 8 + i, t * 6, i]} scale={0.07 + random(`s${i}`) * 0.07} />;
        })}
      </Stage3D>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0 }}>
        <Txt size={104} color="#FFD6DE">
          ZUCKER-INDUSTRIE
        </Txt>
      </div>
      <WhiteFlash len={6} max={0.45} />
    </AbsoluteFill>
  );
};

const HookPaid: React.FC<{ stampAt: number }> = ({ stampAt }) => {
  const frame = useCurrentFrame();
  const bill = useBillTexture();
  const cam = add(useDolly([0, 1.2, 8.5], [0, 0.6, 6.2]), shake3(frame, stampAt, 10, 0.14));
  return (
    <AbsoluteFill>
      <Bg a="#1E3A5F" b="#050A14" />
      <Stage3D cam={cam} look={[0, LY + 0.5, 0]} rim="#7fb2ff" floor={-1.1}>
        <Scientist position={[-0.75, -0.25, 0]} rotation={[0, 0.35, 0]} />
        <Scientist position={[0.75, -0.3, -0.2]} rotation={[0, -0.35, 0]} hair="#8A8A8A" skin="#E8B996" scale={0.95} />
        {Array.from({ length: 40 }).map((_, i) => {
          const t = frame / 30 + random(`d${i}`) * 1.6;
          const y = 3.4 - ((t * (1.4 + random(`sp${i}`))) % 5.2);
          return (
            <Bill
              key={i}
              tex={bill}
              position={[(random(`x${i}`) - 0.5) * 4.2, y, (random(`z${i}`) - 0.5) * 3]}
              rotation={[t * 2 + i, t * 1.3 + i, Math.sin(t * 3 + i) * 0.6]}
              scale={0.55}
            />
          );
        })}
      </Stage3D>
      <div style={{ position: "absolute", top: 220, left: 0, right: 0 }}>
        <Txt size={84} color="#BFD7FF">
          HARVARD-FORSCHER
        </Txt>
      </div>
      <Slam at={stampAt} style={{ left: 0, right: 0, top: 640, display: "flex", justifyContent: "center" }}>
        <Stamp text="BEZAHLT" size={190} rotate={-10} />
      </Slam>
    </AbsoluteFill>
  );
};

const HookVillain: React.FC<{ evilAt: number; haloAt: number }> = ({ evilAt, haloAt }) => {
  const frame = useCurrentFrame();
  const evil = useSpr(evilAt, 240, 11);
  const halo = useSpr(haloAt, 180, 13);
  const orbit = 0.25 - frame * 0.004;
  const cam: V3 = [Math.sin(orbit) * 7.2, 0.9, Math.cos(orbit) * 7.2];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, #5C0A12 0%, #2A0408 50%, #F3E9C9 50%, #FFF8E7 100%)" }} />
      <Stage3D cam={cam} look={[0, LY + 0.3, 0]} rim="#ffcf66" floor={-0.8} dist={1.3}>
        <pointLight position={[-2.2, 1.2, 1.5]} color="#ff2233" intensity={12 * evil} distance={6} />
        <Butter position={[-1.05, -0.4 + Math.sin(frame / 4) * 0.03 * evil, 0]} rotation={[0, 0.45, 0]} scale={0.78} evil={evil} />
        <SugarCube position={[1.1, -0.25, 0]} rotation={[0, -0.6 + frame * 0.01, 0]} scale={0.95} halo={halo} glow={halo * 0.25} />
      </Stage3D>
      <div style={{ position: "absolute", top: 860, left: 70, opacity: evil, transform: `scale(${0.6 + evil * 0.4})` }}>
        <Txt size={120} color="#FF4D5E">
          BÖSE
        </Txt>
      </div>
      <div style={{ position: "absolute", top: 870, right: 60, opacity: halo }}>
        <Txt size={92} color="#2B6E3F" style={{ textShadow: "none" }}>
          HARMLOS?
        </Txt>
      </div>
      <WhiteFlash len={4} />
    </AbsoluteFill>
  );
};

const HookYears: React.FC<{ at: number; step: number; labelAt: number }> = ({ at, step, labelAt }) => {
  const frame = useCurrentFrame();
  const k = frame < at ? 0 : Math.min(12, Math.floor((frame - at) / step) + 1);
  const year = Math.round(1967 + ((2016 - 1967) * k) / 12);
  const flip = frame < at ? 0 : ((frame - at) % step) / step;
  const done = k >= 12;
  const l = useSpr(labelAt + 12, 240, 12);
  const cam = add(useDolly([0, 0.4, 9], [0, 0.2, 6.6]), shake3(frame, at + 12 * step, 8, 0.1));
  return (
    <AbsoluteFill>
      <Bg a="#2B2B2B" b="#050505" />
      <Stage3D cam={cam} look={[0, LY + 0.2, 0]} rim="#ffd166" floor={null}>
        <group rotation={[done ? 0 : -flip * 0.6, Math.sin(frame / 20) * 0.15, 0]}>
          <Text3D text={String(year)} size={0.95} depth={0.45} color={done ? "#FFD166" : "#F1E6C8"} metal={done ? 0.8 : 0.2} />
        </group>
      </Stage3D>
      <div style={{ position: "absolute", top: 260, left: 0, right: 0 }}>
        <Txt size={62} color="#9AA3B2" style={{ fontFamily: FONT_SUB, fontWeight: 800, letterSpacing: 6 }}>
          KEINER HAT'S GEMERKT
        </Txt>
      </div>
      <div style={{ position: "absolute", top: 860, left: 0, right: 0, transform: `scale(${l})` }}>
        <Txt size={130} color="#FFD166">
          FAST 50 JAHRE
        </Txt>
      </div>
      <WhiteFlash len={4} />
    </AbsoluteFill>
  );
};

// =============== Szene 2 – 1960er (Sepia) ===============
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
  const q = useSpr(40, 200, 10);
  const screen = useTvTexture(q);
  const cam = useDolly([1.6, 1.0, 8.5], [0.5, 0.4, 6.4]);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Stage3D cam={cam} look={[0, LY + 0.3, 0]} floor={-1.55}>
        <group rotation={[0, -0.18 + Math.sin(frame / 40) * 0.05, 0]}>
          <Block size={[2.9, 2.2, 1.5]} color="#7A5230" rough={0.35} />
          <Block size={[2.1, 1.7, 0.1]} position={[-0.3, 0, 0.72]} color="#1A1A1A" rough={0.2} />
          <mesh position={[-0.3, 0, 0.78]}>
            <planeGeometry args={[1.95, 1.52]} />
            <meshStandardMaterial map={screen} emissive="#ffffff" emissiveMap={screen} emissiveIntensity={0.35} roughness={0.1} />
          </mesh>
          {[0.35, -0.2].map((y) => (
            <mesh key={y} position={[1.1, y, 0.78]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.16, 0.16, 0.12, 32]} />
              <meshStandardMaterial color="#C9A86A" metalness={0.6} roughness={0.3} />
            </mesh>
          ))}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 1.1, -1.35, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.05, 0.5, 16]} />
              <meshStandardMaterial color="#3E2E1C" />
            </mesh>
          ))}
          {[-1, 1].map((s) => (
            <mesh key={`a${s}`} position={[s * 0.35, 1.55, 0]} rotation={[0, 0, -s * 0.5]}>
              <cylinderGeometry args={[0.02, 0.02, 1.1, 8]} />
              <meshStandardMaterial color="#222" metalness={0.8} roughness={0.3} />
            </mesh>
          ))}
        </group>
      </Stage3D>
      <div style={{ position: "absolute", top: 200, left: 0, right: 0 }}>
        <Txt size={100} color="#2B1D0E" font="Abril Fatface" style={{ textShadow: "none" }}>
          1960er
        </Txt>
      </div>
    </AbsoluteFill>
  );
};

const HeartShot: React.FC = () => {
  const frame = useCurrentFrame();
  const wild = interpolate(frame, [0, 40], [0, 1], clamp);
  const ecg = useEcgTexture(frame, wild);
  const beat = 1 + Math.max(0, Math.sin(frame / 3)) * 0.07 * (1 + wild);
  const cam = useDolly([0, 0.3, 8], [0, 0.1, 6]);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Stage3D cam={cam} look={[0, LY + 0.2, 0]} floor={-1.6} dist={2.3}>
        <Heart position={[0, 0, 0]} rotation={[0, Math.sin(frame / 15) * 0.4, 0]} scale={beat * 1.05} />
        <mesh position={[0, 0, 0.6]}>
          <planeGeometry args={[3.4, 1]} />
          <meshBasicMaterial map={ecg} transparent toneMapped={false} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => {
          const a = frame / 25 + (i / 5) * Math.PI * 2;
          return <SugarCube key={i} position={[Math.cos(a) * 1.9, Math.sin(a * 2) * 0.3 - 0.2, Math.sin(a) * 1.2]} rotation={[a, a * 1.3, 0]} scale={0.32} />;
        })}
      </Stage3D>
    </AbsoluteFill>
  );
};

const AlarmShot: React.FC = () => {
  const frame = useCurrentFrame();
  const on = Math.floor(frame / 6) % 2 === 0;
  const sign = useSignTexture("ZUCKER AG");
  const cam = add(useDolly([2.5, 1.5, 9.5], [1.2, 0.8, 7.5]), shake3(frame, 0, 8, 0.1));
  return (
    <AbsoluteFill>
      <PaperBg />
      <Stage3D cam={cam} look={[0, LY + 0.5, 0]} floor={-1.2}>
        <pointLight position={[0, 1.4, 1.2]} color="#ff2020" intensity={on ? 25 : 2} distance={8} />
        <Block size={[3.4, 1.8, 1.8]} position={[0, -0.3, 0]} color="#6B573E" rough={0.8} />
        {[-1.1, 0, 1.1].map((x) => (
          <mesh key={x} position={[x, 0.85, 0]} rotation={[0, 0, 0.0]} castShadow>
            <coneGeometry args={[0.75, 0.6, 4, 1]} />
            <meshStandardMaterial color="#4E3E2B" roughness={0.8} />
          </mesh>
        ))}
        {[-1.2, 1.15].map((x) => (
          <mesh key={x} position={[x, 1.2, -0.4]} castShadow>
            <cylinderGeometry args={[0.18, 0.22, 2.4, 24]} />
            <meshStandardMaterial color="#5A4A36" roughness={0.8} />
          </mesh>
        ))}
        <mesh position={[0, 0.05, 0.91]}>
          <planeGeometry args={[2.6, 0.65]} />
          <meshStandardMaterial map={sign} />
        </mesh>
        {[-1.05, -0.35, 0.35, 1.05].map((x) => (
          <mesh key={x} position={[x, -0.65, 0.91]}>
            <planeGeometry args={[0.45, 0.5]} />
            <meshStandardMaterial color="#E9D8A6" emissive="#ffcc66" emissiveIntensity={on ? 0.6 : 0.1} />
          </mesh>
        ))}
        <group position={[0, 1.3, 0.3]}>
          <mesh>
            <sphereGeometry args={[0.22, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={on ? "#ff2a2a" : "#5a1010"} emissive="#ff0000" emissiveIntensity={on ? 3 : 0} />
          </mesh>
          <mesh position={[0, -0.08, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.16, 32]} />
            <meshStandardMaterial color="#222" metalness={0.6} />
          </mesh>
        </group>
        {/* Rauch */}
        {[0, 1, 2, 3, 4].map((i) => {
          const t = ((frame / 40 + i / 5) % 1);
          return (
            <mesh key={i} position={[-1.2 + t * 0.6, 2.5 + t * 1.5, -0.4]} scale={0.25 + t * 0.6}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial color="#8E8270" transparent opacity={0.6 * (1 - t)} />
            </mesh>
          );
        })}
      </Stage3D>
      <Slam at={6} style={{ left: 0, right: 0, top: 260, display: "flex", justifyContent: "center" }}>
        <Stamp text="ALBTRAUM" size={150} rotate={-8} />
      </Slam>
    </AbsoluteFill>
  );
};

// =============== Szene 3 – 1965: das Geld ===============
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
        <Vintage strength={0.75}>
          <MoneyShot nowAt={T(5.5) - T(4.9)} countAt={T(6.7) - T(4.9)} step={Math.max(1, T(0.08))} />
        </Vintage>
      </Cut>
    </AbsoluteFill>
  );
};

const YearShot: React.FC<{ step: number }> = ({ step }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = useDolly([0, 0, 9], [0, 0, 6.5], 40);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Stage3D cam={cam} look={[0, LY, 0]} floor={null} key1="#fff1d6">
        {"1965".split("").map((d, i) => {
          const s = spring({ frame: frame - i * step, fps, config: { damping: 11, stiffness: 260 } });
          if (frame < i * step) return null;
          return <Text3D key={i} text={d} size={1.2} depth={0.5} color="#3A2A18" position={[(i - 1.5) * 0.98, 0, 0]} rotation={[(1 - s) * -1.5, 0, 0]} scale={s} />;
        })}
      </Stage3D>
    </AbsoluteFill>
  );
};

const PaymentShot: React.FC<{ threeAt: number; openAt: number }> = ({ threeAt, openAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = useLetterheadTexture();
  const env = useEnvelopeTexture();
  const bill = useBillTexture();
  const fly = interpolate(frame, [threeAt - 12, openAt - 2], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const open = useSpr(openAt, 200, 12);
  const cam = useDolly([0, 1.8, 10], [0, 1.0, 8]);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Stage3D cam={cam} look={[0, LY + 0.6, 0]} floor={-1.3} dist={1.75}>
        <Sheet tex={head} size={[3.4, 2.32]} position={[0, 1.55, -1.2]} rotation={[-0.08, 0, 0]} color="#F6EBD0" />
        <group position={[interpolate(fly, [0, 1], [0, 0]), interpolate(fly, [0, 1], [1.2, -0.15]), interpolate(fly, [0, 1], [-1, 0.9])]} rotation={[-0.3 + fly * 0.3, fly * Math.PI * 2, 0.1]}>
          <Sheet tex={env} size={[1.5, 0.94]} depth={0.05} color="#E8D7AE" />
          {frame >= openAt && <Bill tex={bill} position={[0, open * 0.55, -0.02]} rotation={[0, 0, 0.05]} scale={1.05} />}
        </group>
        {[-1.35, 0, 1.35].map((x, i) => {
          const s = spring({ frame: frame - threeAt - i * 3, fps, config: { damping: 12, stiffness: 220 } });
          return <Scientist key={i} position={[x, -0.75 - (1 - s) * 3, 0.2]} rotation={[0, -x * 0.25, 0]} scale={0.62} clipboard={false} hair={["#3B2A1A", "#8A8A8A", "#5A3A1A"][i]} />;
        })}
      </Stage3D>
    </AbsoluteFill>
  );
};

const MoneyShot: React.FC<{ nowAt: number; countAt: number; step: number }> = ({ nowAt, countAt, step }) => {
  const frame = useCurrentFrame();
  const bill = useBillTexture();
  const now = useSpr(nowAt, 220, 13);
  const k = frame < countAt ? 0 : Math.min(9, Math.floor((frame - countAt) / step) + 1);
  const n = 6 + k * 4; // Scheine im Stapel
  const cam = useDolly([2.5, 2.8, 7.5], [1.6, 2.0, 5.8]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #E7F2DA 0%, #9DB98A 80%)" }} />
      <Stage3D cam={cam} look={[0, LY + 0.2, 0]} floor={-0.75}>
        {Array.from({ length: n }).map((_, i) => {
          const isNew = i >= n - 4 && k > 0;
          const drop = isNew ? interpolate((frame - countAt) % step, [0, step], [0.6, 0], clamp) : 0;
          return (
            <Bill
              key={i}
              tex={bill}
              position={[(random(`mx${i}`) - 0.5) * 0.12, -0.74 + i * 0.018 + drop, (random(`mz${i}`) - 0.5) * 0.12]}
              rotation={[-Math.PI / 2, 0, (random(`mr${i}`) - 0.5) * 0.35]}
              scale={1.6}
            />
          );
        })}
      </Stage3D>
      <div style={{ position: "absolute", top: 200, left: 0, right: 0 }}>
        <Txt size={74} color="#1B4332" font="Abril Fatface" style={{ textShadow: "none" }}>
          damals: 6.500 $
        </Txt>
      </div>
      <div style={{ position: "absolute", top: 760, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: now, transform: `scale(${0.7 + now * 0.3})` }}>
        <Txt size={60} color="#1B4332" style={{ fontFamily: FONT_SUB, fontWeight: 900, textShadow: "none" }}>
          HEUTE ETWA
        </Txt>
        <div style={{ fontFamily: "Anton", fontSize: 180, color: "#fff", background: "#1B4332", padding: "0 46px", borderRadius: 26, boxShadow: "0 20px 50px rgba(0,0,0,0.4)" }}>
          <Counter from={6500} to={50000} at={countAt} steps={9} stepLen={step} format={(v) => (v === 6500 ? "? $" : `${v.toLocaleString("de-DE")} $`)} />
        </div>
      </div>
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
          <ResultShot typeAt={8} />
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
  const s = useSpr(0, 120, 16);
  const hi = interpolate(frame, [hiAt, hiAt + 8], [0, 1], clamp);
  const cover = useJournalTexture(hi);
  const cam = useDolly([0, 0.5, 8], [0, 0.3, 6.2], 30);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 35%, #5A4632 0%, #241A10 80%)" }} />
      <Stage3D cam={cam} look={[0, LY + 0.4, 0]} floor={-1.9}>
        <group position={[0, -4 * (1 - s), 0]} rotation={[-0.15 + (1 - s) * 0.8, -0.35 + (1 - s) * 2.2 + frame * 0.003, 0.04]}>
          <Sheet tex={cover} size={[2.4, 3.17]} depth={0.22} color="#E4D9C2" />
        </group>
      </Stage3D>
    </AbsoluteFill>
  );
};

const ResultShot: React.FC<{ typeAt: number }> = ({ typeAt }) => {
  const frame = useCurrentFrame();
  const word = "ERGEBNIS:";
  const n = Math.max(0, Math.min(word.length, Math.floor((frame - typeAt) / 2)));
  const page = usePageTexture(word.slice(0, n));
  const t = frame / 60;
  const cam: V3 = [1.2 - t * 0.4, 3.4 - t * 0.5, 2.6 - t * 0.3];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "#2E2418" }} />
      <Stage3D cam={cam} look={[0.7, -0.6, -0.2]} floor={null} fov={40}>
        <Sheet tex={page} size={[4, 4]} position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0.05]} color="#F7F1E3" />
      </Stage3D>
    </AbsoluteFill>
  );
};

const ScaleShot: React.FC<{ tiltAt: number; sugarAt: number }> = ({ tiltAt, sugarAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tiltS = spring({ frame: frame - tiltAt, fps, config: { damping: 7, stiffness: 110 } });
  const a = frame < tiltAt ? Math.sin(frame / 5) * 0.03 : tiltS * 0.32; // positiv = links unten
  const guilt = useSpr(tiltAt + 4, 300, 12);
  const sug = useSpr(sugarAt, 220, 13);
  const cam = add(useDolly([0, 1.4, 9.5], [0, 1.0, 7.6]), shake3(frame, tiltAt, 8, 0.1));
  const arm = 1.45;
  const gold = { color: "#C9A24A", metal: 0.9, rough: 0.25 };
  const pan = (side: number) => {
    const x = side * Math.cos(a) * arm;
    const y = 1.1 + side * -Math.sin(a) * arm;
    return [x, y] as const;
  };
  const [lx, ly] = pan(-1);
  const [rx, ry] = pan(1);
  return (
    <AbsoluteFill>
      <Bg a="#3D2B1F" b="#0B0705" />
      <Stage3D cam={cam} look={[0, LY + 0.7, 0]} rim="#ffcc77" floor={-1.25} dist={1.4}>
        <Block size={[1.4, 0.2, 1.0]} position={[0, -1.15, 0]} color={gold.color} metal={gold.metal} rough={gold.rough} />
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.1, 2.3, 24]} />
          <meshStandardMaterial color={gold.color} metalness={gold.metal} roughness={gold.rough} />
        </mesh>
        <group position={[0, 1.1, 0]} rotation={[0, 0, a]}>
          <Block size={[arm * 2 + 0.2, 0.09, 0.12]} color={gold.color} metal={gold.metal} rough={gold.rough} />
        </group>
        <mesh position={[0, 1.1, 0.08]}>
          <sphereGeometry args={[0.13, 24, 24]} />
          <meshStandardMaterial color="#E7B53C" metalness={1} roughness={0.2} />
        </mesh>
        {[
          [lx, ly],
          [rx, ry],
        ].map(([x, y], i) => (
          <group key={i} position={[x, y, 0]}>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * 0.25, -0.4, 0]} rotation={[0, 0, s * 0.3]}>
                <cylinderGeometry args={[0.012, 0.012, 0.85, 6]} />
                <meshStandardMaterial color="#8A6A2F" metalness={0.8} />
              </mesh>
            ))}
            <mesh position={[0, -0.82, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.62, 0.48, 0.08, 48]} />
              <meshStandardMaterial color={gold.color} metalness={gold.metal} roughness={gold.rough} />
            </mesh>
            {i === 0 ? <Butter position={[0, -0.6, 0]} scale={0.38} /> : <SugarCube position={[0, -0.55, 0]} scale={0.45} rotation={[0, 0.5, 0]} />}
          </group>
        ))}
      </Stage3D>
      {frame >= tiltAt && (
        <div style={{ position: "absolute", left: 50, top: 960, transform: `scale(${guilt}) rotate(-8deg)` }}>
          <Stamp text="SCHULD" size={110} />
        </div>
      )}
      {frame >= sugarAt && (
        <div style={{ position: "absolute", right: 60, top: 300, transform: `scale(${sug}) rotate(6deg)`, background: "#2B9348", color: "#fff", fontFamily: "Anton", fontSize: 80, padding: "4px 30px", borderRadius: 18, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>
          KAUM SCHULD
        </div>
      )}
    </AbsoluteFill>
  );
};

const FinePrintShot: React.FC<{ stampAt: number }> = ({ stampAt }) => {
  const frame = useCurrentFrame();
  const page = usePageTexture("", true);
  const mx = interpolate(frame, [0, stampAt], [-1.6, 0.9], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const t = frame / 80;
  const cam = add([0.2 - t * 0.3, 3.2 - t * 0.4, 2.4], shake3(frame, stampAt, 10, 0.08));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "#2E2418" }} />
      <Stage3D cam={cam} look={[0.1, -0.6, -0.2]} floor={null} fov={42}>
        <Sheet tex={page} size={[4, 4]} position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, -0.04]} color="#F7F1E3" />
        <Magnifier position={[mx, 0.05, -0.15]} rotation={[-Math.PI / 2 + 0.25, 0, 0.3]} scale={0.8} />
      </Stage3D>
      <Slam at={stampAt} style={{ left: 0, right: 0, top: 380, display: "flex", justifyContent: "center" }}>
        <Stamp text="VERSCHWIEGEN" size={130} rotate={-9} />
      </Slam>
    </AbsoluteFill>
  );
};

// =============== Szene 5 – "fettarm" ===============
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
        <YogurtShot at={T(5.5) - T(4.5)} step={Math.max(1, T(0.1))} />
      </Cut>
    </AbsoluteFill>
  );
};

const WantedShot: React.FC = () => {
  const frame = useCurrentFrame();
  const poster = useWantedTexture();
  const cam = useDolly([-1.2, 0.6, 9], [-0.3, 0.3, 6.6]);
  return (
    <AbsoluteFill>
      <Bg a="#6A3E1E" b="#140A04" />
      <Stage3D cam={cam} look={[0, LY + 0.5, 0]} floor={null} rim="#ffb066">
        <Sheet tex={poster} size={[3.2, 4.4]} position={[0, 0.35, -0.6]} rotation={[0, 0, -0.03]} color="#E9D3A0" />
        <Butter position={[0, 0.3, 0.2]} rotation={[0.15, Math.sin(frame / 12) * 0.35, 0]} scale={0.95} evil={1} />
        <pointLight position={[0, 1.5, 2]} color="#ff6633" intensity={6} distance={6} />
      </Stage3D>
    </AbsoluteFill>
  );
};

const Product: React.FC<{ name: string; color: string; position: V3; sticker: number; stickerTex: THREE.Texture }> = ({ name, color, position, sticker, stickerTex }) => {
  const label = useLabelTexture(name, color);
  return (
    <group position={position}>
      <Block size={[0.8, 1.1, 0.5]} color={color} rough={0.35} />
      <mesh position={[0, 0, 0.26]}>
        <planeGeometry args={[0.78, 1.07]} />
        <meshStandardMaterial map={label} roughness={0.4} />
      </mesh>
      {sticker > 0 && (
        <mesh position={[0, 0.05, 0.3]} rotation={[0, 0, -0.18]} scale={sticker}>
          <planeGeometry args={[0.95, 0.3]} />
          <meshStandardMaterial map={stickerTex} transparent roughness={0.3} />
        </mesh>
      )}
    </group>
  );
};

const ShelfShot: React.FC<{ at: number; step: number }> = ({ at, step }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sticker = useStickerTexture();
  const items = [
    { c: "#E76F51", n: "KEKSE" },
    { c: "#2A9D8F", n: "JOGHURT" },
    { c: "#E9C46A", n: "MÜSLI" },
    { c: "#8E7DBE", n: "DRESSING" },
    { c: "#F4A261", n: "PUDDING" },
    { c: "#577590", n: "SNACK" },
  ];
  const t = frame / 30;
  const cam: V3 = [1.6 - t * 1.2, 0.5, 6.2 - t * 0.4];
  return (
    <AbsoluteFill>
      <Bg a="#E8F1F2" b="#9FB3C8" rays={false} />
      <Stage3D cam={cam} look={[0, LY + 0.35, 0]} floor={null} rim="#ffffff" exposure={1.15}>
        {[0, 1].map((row) => (
          <group key={row} position={[0, 0.85 - row * 1.55, 0]}>
            <Block size={[3.2, 0.08, 0.8]} position={[0, -0.6, 0]} color="#C9CED6" metal={0.5} rough={0.3} />
            {items.slice(row * 3, row * 3 + 3).map((it, i) => {
              const k = row * 3 + i;
              const s = spring({ frame: frame - at - Math.floor(k / 2) * step, fps, config: { damping: 10, stiffness: 260 } });
              return <Product key={k} name={it.n} color={it.c} position={[(i - 1) * 1.0, 0, 0]} sticker={frame >= at + Math.floor(k / 2) * step ? s : 0} stickerTex={sticker} />;
            })}
          </group>
        ))}
        <Block size={[3.4, 3.4, 0.1]} position={[0, -0.2, -0.45]} color="#B9C3CF" rough={0.6} />
      </Stage3D>
    </AbsoluteFill>
  );
};

const cupGeo = (() => {
  const pts = [new THREE.Vector2(0, -0.8), new THREE.Vector2(0.62, -0.8), new THREE.Vector2(0.8, 0.8), new THREE.Vector2(0.84, 0.86), new THREE.Vector2(0.8, 0.86)];
  return new THREE.LatheGeometry(pts, 64);
})();

const YogurtShot: React.FC<{ at: number; step: number }> = ({ at, step }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const label = useYogurtTexture();
  const n = frame < at ? 0 : Math.min(6, Math.floor((frame - at) / step) + 1);
  const cam = useDolly([0, 2.2, 8], [0, 1.6, 6.2]);
  return (
    <AbsoluteFill>
      <Bg a="#2A9D8F" b="#06201C" />
      <Stage3D cam={cam} look={[0, LY + 0.6, 0]} floor={-1.05} rim="#9fffe8" dist={1.4}>
        <group position={[0, -0.25, 0]} rotation={[0, frame * 0.01, 0]}>
          <mesh geometry={cupGeo} castShadow>
            <meshPhysicalMaterial color="#ffffff" roughness={0.3} clearcoat={0.6} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.735, 0.675, 0.7, 64, 1, true]} />
            <meshStandardMaterial map={label} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.78, 64]} />
            <meshPhysicalMaterial color="#FAFAF5" roughness={0.6} sheen={1} />
          </mesh>
        </group>
        {Array.from({ length: n }).map((_, i) => {
          const s = spring({ frame: frame - at - i * step, fps, config: { damping: 12, stiffness: 160 } });
          const ang = (i / 6) * Math.PI * 2 + 0.4;
          return <SugarCube key={i} position={[Math.cos(ang) * 1.5 * s, 0.6 + s * (1.1 + (i % 2) * 0.4), Math.sin(ang) * 0.9 * s]} rotation={[i + s * 3, i * 2 + s * 2, 0]} scale={0.38} />;
        })}
      </Stage3D>
      {n > 0 && (
        <div style={{ position: "absolute", right: 60, top: 220, width: 220, height: 220, borderRadius: "50%", background: "#FFD166", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Anton", fontSize: 70, color: "#1D2433", textAlign: "center", lineHeight: 0.95, transform: "rotate(10deg)", boxShadow: "0 12px 30px rgba(0,0,0,0.45)" }}>
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
        <Vintage strength={0.55}>
          <ArchiveShot />
        </Vintage>
      </Cut>
    </AbsoluteFill>
  );
};

const RevealShot: React.FC<{ stampAt: number }> = ({ stampAt }) => {
  const frame = useCurrentFrame();
  const news = useNewsTexture();
  const s = useSpr(0, 90, 15);
  const cam = add([0, 0.2, 7], shake3(frame, stampAt, 10, 0.12));
  return (
    <AbsoluteFill>
      <Bg a="#1D3557" b="#05080F" />
      <Stage3D cam={cam} look={[0, LY + 0.25, 0]} floor={null}>
        {/* klassischer Zeitungs-Dreher */}
        <group rotation={[0, 0, (1 - s) * Math.PI * 4 - 0.05]} scale={0.2 + s * 0.8} position={[0, 0, (1 - s) * -3]}>
          <Sheet tex={news} size={[3.0, 3.5]} depth={0.02} color="#FBFBF7" />
        </group>
      </Stage3D>
      <Slam at={stampAt} style={{ left: 0, right: 0, top: 860, display: "flex", justifyContent: "center" }}>
        <Stamp text="ENTHÜLLT" size={160} rotate={-8} />
      </Slam>
      <WhiteFlash len={4} />
    </AbsoluteFill>
  );
};

const ArchiveShot: React.FC = () => {
  const frame = useCurrentFrame();
  const lbl = useBoxLabelTexture();
  const l1 = useLetterTexture("July 1965");
  const l2 = useLetterTexture("Nov. 1965");
  const l3 = useLetterTexture("1966");
  const lift = interpolate(frame, [6, 40], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const cam = useDolly([1.5, 2.6, 8], [0.8, 1.8, 6.2]);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Stage3D cam={cam} look={[0, LY + 0.5, 0]} floor={-1.3}>
        {[l1, l2, l3].map((t, i) => (
          <Sheet key={i} tex={t} size={[1.4, 1.8]} position={[(i - 1) * 0.55, -0.3 + lift * (1.2 + i * 0.25), -0.1 + i * 0.05]} rotation={[-0.1, (i - 1) * 0.15, (i - 1) * 0.12]} color="#F6EBD0" />
        ))}
        <Block size={[2.6, 1.3, 1.5]} position={[0, -0.65, 0]} color="#A47A45" rough={0.85} />
        <mesh position={[0, -0.6, 0.76]}>
          <planeGeometry args={[1.0, 0.53]} />
          <meshStandardMaterial map={lbl} />
        </mesh>
        <Magnifier position={[0.9 + Math.sin(frame / 14) * 0.4, 1.2 + Math.cos(frame / 18) * 0.2, 0.9]} rotation={[0, -0.3, 0.2]} scale={0.7} />
      </Stage3D>
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
      <Stage3D cam={[0, 0.8, 7.5]} look={[0, -2.6, 0]} floor={null} rim="#c77dff" dist={1.9} lift={0}>
        <group position={[0, 0, 0]} scale={bp}>
          <Butter position={[-1.25, 0, 0]} rotation={[0.2, frame * 0.04, 0]} scale={0.6} />
          <SugarCube position={[1.25, 0, 0]} rotation={[0.3, -frame * 0.04, 0]} scale={0.7} />
        </group>
      </Stage3D>
      <div style={{ position: "absolute", top: 290, left: 0, right: 0, transform: `scale(${bp})` }}>
        <Txt size={120} color="#FFD166">
          vs.
        </Txt>
      </div>
      <div style={{ position: "absolute", top: 640, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
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
      </div>
    </AbsoluteFill>
  );
};
