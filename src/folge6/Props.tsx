// 3D-Requisiten für Folge 6 "Hat Coca-Cola den Weihnachtsmann erfunden?" – alles per Code gebaut.
// Dose und Flasche sind neutral ("COLA"), kein echtes Logo.
import React from "react";
import * as THREE from "three";
import { Block, F, lines, Sheet, useCanvasTexture, V3 } from "../folge4-3d/Kit";
import { Human, Pose } from "./Human";

const RED = "#C8102E";

// ---------- Getränkedose ----------
export const useCanLabel = () =>
  useCanvasTexture(
    1024,
    512,
    (ctx) => {
      ctx.fillStyle = RED;
      ctx.fillRect(0, 0, 1024, 512);
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      [256, 768].forEach((x) => {
        ctx.font = `200px ${F.bold}`;
        ctx.fillText("COLA", x, 250);
      });
      // weiße Welle
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 22;
      ctx.beginPath();
      for (let x = 0; x <= 1024; x += 8) ctx.lineTo(x, 400 + Math.sin((x / 1024) * Math.PI * 4) * 26);
      ctx.stroke();
    },
    [],
  );

export const Can: React.FC<{ label: THREE.Texture; position?: V3; rotation?: V3; scale?: number }> = ({ label, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => (
  <group position={position} rotation={rotation} scale={scale}>
    <mesh castShadow>
      <cylinderGeometry args={[0.5, 0.5, 1.6, 64, 1, true]} />
      <meshPhysicalMaterial map={label} metalness={0.5} roughness={0.25} clearcoat={1} side={THREE.DoubleSide} />
    </mesh>
    {[-1, 1].map((s) => (
      <mesh key={s} position={[0, s * 0.85, 0]}>
        <cylinderGeometry args={[s > 0 ? 0.42 : 0.44, 0.5, 0.1, 64]} />
        <meshStandardMaterial color="#C9CED6" metalness={1} roughness={0.2} />
      </mesh>
    ))}
    <mesh position={[0, 0.91, 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.1, 0.025, 8, 24]} />
      <meshStandardMaterial color="#AEB4BD" metalness={1} roughness={0.2} />
    </mesh>
  </group>
);

// ---------- Glasflasche (neutral) ----------
const bottleGeo = (() => {
  const pts = [
    [0, -1],
    [0.32, -1],
    [0.36, -0.8],
    [0.3, -0.45],
    [0.37, -0.1],
    [0.36, 0.2],
    [0.2, 0.55],
    [0.13, 0.85],
    [0.14, 1.0],
    [0, 1.0],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(pts, 48);
})();
export const Bottle: React.FC<{ position?: V3; rotation?: V3; scale?: number }> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => (
  <group position={position} rotation={rotation} scale={scale}>
    <mesh geometry={bottleGeo} castShadow>
      <meshPhysicalMaterial color="#3A1A10" roughness={0.1} clearcoat={1} transmission={0.2} />
    </mesh>
    <mesh position={[0, -0.05, 0]}>
      <cylinderGeometry args={[0.375, 0.375, 0.3, 48, 1, true]} />
      <meshStandardMaterial color={RED} roughness={0.4} />
    </mesh>
    <mesh position={[0, 1.02, 0]}>
      <cylinderGeometry args={[0.16, 0.16, 0.06, 24]} />
      <meshStandardMaterial color="#C9CED6" metalness={1} roughness={0.3} />
    </mesh>
  </group>
);

// ---------- Weihnachtsmütze ----------
export const SantaHat: React.FC<{ position?: V3; rotation?: V3; scale?: number }> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => (
  <group position={position} rotation={rotation} scale={scale}>
    <mesh position={[0, 0.3, 0]} rotation={[0, 0, -0.35]} castShadow>
      <coneGeometry args={[0.42, 0.95, 48]} />
      <meshPhysicalMaterial color={RED} roughness={0.8} sheen={1} sheenColor="#ff8080" />
    </mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.42, 0.11, 16, 48]} />
      <meshPhysicalMaterial color="#ffffff" roughness={1} sheen={1} sheenColor="#ffffff" />
    </mesh>
    <mesh position={[0.36, 0.72, 0]}>
      <sphereGeometry args={[0.12, 24, 24]} />
      <meshPhysicalMaterial color="#ffffff" roughness={1} sheen={1} />
    </mesh>
  </group>
);

const white = <meshPhysicalMaterial color="#F8F8F8" roughness={1} sheen={1} sheenColor="#ffffff" />;

// ---------- Weihnachtsmann (realistische Figur: Bauch, Gürtel, Pelzsaum, Bart, Mütze) ----------
export const Santa: React.FC<{ frame: number; position?: V3; rotation?: V3; scale?: number; pose?: Pose; hand?: React.ReactNode; belly?: number }> = ({
  frame,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  pose = {},
  hand,
  belly = 1,
}) => (
  <Human
    frame={frame}
    seed={7}
    position={position}
    rotation={rotation}
    scale={scale}
    pose={{ smile: 0.6, ...pose }}
    top={RED}
    bottom={RED}
    shoes="#1B1B1B"
    skin="#F0BFA0"
    hair="#F2F2F2"
    hairStyle="short"
    iris="#3A5A8C"
    beard="#F8F8F8"
    belly={belly}
    build={1.45}
    hand={hand}
    bodyExtra={
      <group>
        {/* Gürtel um den Bauch */}
        <mesh position={[0, 1.0, 0.03]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.8 + belly * 0.12, 1]}>
          <torusGeometry args={[0.23 + belly * 0.05, 0.032, 12, 48]} />
          <meshPhysicalMaterial color="#141414" roughness={0.35} clearcoat={0.6} />
        </mesh>
        <mesh position={[0, 1.0, 0.22 + belly * 0.1]}>
          <boxGeometry args={[0.1, 0.075, 0.02]} />
          <meshStandardMaterial color="#E9B44C" metalness={1} roughness={0.2} />
        </mesh>
        {/* Pelzsaum unten und Knopfleiste */}
        <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.75, 1]}>
          <torusGeometry args={[0.21, 0.045, 12, 40]} />
          {white}
        </mesh>
        <mesh position={[0, 1.25, 0.12]} rotation={[-0.25, 0, 0]}>
          <boxGeometry args={[0.07, 0.36, 0.03]} />
          {white}
        </mesh>
      </group>
    }
    headExtra={<SantaHat position={[0, 0.085, -0.01]} rotation={[-0.1, 0, 0]} scale={0.37} />}
  />
);

// ---------- Bischof Nikolaus (roter Mantel, Mitra, goldene Stola) ----------
export const Bishop: React.FC<{ frame: number; position?: V3; rotation?: V3; scale?: number; pose?: Pose }> = ({ frame, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, pose = {} }) => (
  <Human
    frame={frame}
    seed={11}
    position={position}
    rotation={rotation}
    scale={scale}
    pose={{ headTilt: 0.03, ...pose }}
    top="#A4161A"
    bottom="#A4161A"
    robe="#A4161A"
    skin="#E3B08C"
    hair="#CFCFCF"
    hairStyle="short"
    beard="#E6E6E6"
    bodyExtra={
      <mesh position={[0, 1.2, 0.115]} rotation={[-0.12, 0, 0]}>
        <boxGeometry args={[0.07, 0.6, 0.015]} />
        <meshStandardMaterial color="#E9B44C" metalness={1} roughness={0.25} />
      </mesh>
    }
    headExtra={<Mitre />}
  />
);

// Mitra: oben spitzbogig, vorne flach, mit goldenem Band, Mittelstreifen und Kreuz
const mitreGeo = (() => {
  const sh = new THREE.Shape();
  sh.moveTo(-0.13, 0);
  sh.lineTo(-0.14, 0.16);
  sh.quadraticCurveTo(-0.11, 0.3, 0, 0.38);
  sh.quadraticCurveTo(0.11, 0.3, 0.14, 0.16);
  sh.lineTo(0.13, 0);
  sh.closePath();
  const g = new THREE.ExtrudeGeometry(sh, { depth: 0.16, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.015, bevelSegments: 3, curveSegments: 24 });
  g.translate(0, 0, -0.08);
  return g;
})();
const Mitre: React.FC = () => (
  <group position={[0, 0.085, -0.01]}>
    <mesh geometry={mitreGeo} castShadow>
      <meshPhysicalMaterial color="#F4EBD0" roughness={0.55} sheen={0.6} sheenColor="#fff4d6" />
    </mesh>
    {/* goldenes Band unten */}
    <mesh position={[0, 0.035, 0]} scale={[1, 1, 0.75]}>
      <cylinderGeometry args={[0.145, 0.14, 0.06, 32, 1, true]} />
      <meshStandardMaterial color="#E9B44C" metalness={1} roughness={0.25} side={THREE.DoubleSide} />
    </mesh>
    {/* Mittelstreifen + Kreuz vorne */}
    <mesh position={[0, 0.2, 0.1]}>
      <boxGeometry args={[0.035, 0.3, 0.012]} />
      <meshStandardMaterial color="#E9B44C" metalness={1} roughness={0.25} />
    </mesh>
    <mesh position={[0, 0.24, 0.106]}>
      <boxGeometry args={[0.1, 0.03, 0.012]} />
      <meshStandardMaterial color="#C8102E" roughness={0.4} />
    </mesh>
    <mesh position={[0, 0.24, 0.107]}>
      <boxGeometry args={[0.03, 0.12, 0.012]} />
      <meshStandardMaterial color="#C8102E" roughness={0.4} />
    </mesh>
  </group>
);

// ---------- Leuchtpunkt mit Schein (für Lichterketten, Laternen, Fenster) ----------
let glowTex: THREE.Texture | null = null;
const getGlow = () => {
  if (glowTex) return glowTex;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.2, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  glowTex = new THREE.CanvasTexture(c);
  return glowTex;
};
export const Glow: React.FC<{ position: V3; color: string; size?: number; core?: number }> = ({ position, color, size = 0.35, core = 0.035 }) => (
  <group position={position}>
    <mesh>
      <sphereGeometry args={[core, 12, 10]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
    <sprite scale={[size, size, size]}>
      <spriteMaterial map={getGlow()} color={color} transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  </group>
);

// Lichterkette zwischen zwei Punkten (hängt leicht durch)
const BULBS = ["#FFD27A", "#FF6B6B", "#7AD7FF", "#FFD27A", "#A6FF8A"];
export const Garland: React.FC<{ from: V3; to: V3; n?: number; sag?: number; frame: number }> = ({ from, to, n = 14, sag = 0.35, frame }) => (
  <group>
    {Array.from({ length: n }).map((_, i) => {
      const t = i / (n - 1);
      const p: V3 = [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t - Math.sin(Math.PI * t) * sag, from[2] + (to[2] - from[2]) * t];
      const tw = 0.75 + 0.25 * Math.sin(frame * 0.15 + i * 1.7);
      return <Glow key={i} position={p} color={BULBS[i % BULBS.length]} size={0.32 * tw} core={0.03} />;
    })}
  </group>
);

// ---------- fallender Schnee in 3D (immer gleich: keine Zufallswerte pro Rendern) ----------
export const Snow3D: React.FC<{ frame: number; n?: number; area?: [number, number, number]; center?: V3 }> = ({ frame, n = 220, area = [8, 5, 6], center = [0, 0, 0] }) => {
  const ref = React.useRef<THREE.InstancedMesh>(null);
  const seeds = React.useMemo(() => Array.from({ length: n }).map((_, i) => [((i * 7919) % 1000) / 1000, ((i * 104729) % 1000) / 1000, ((i * 1299709) % 1000) / 1000, 0.5 + ((i * 31) % 100) / 100]), [n]);
  React.useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    seeds.forEach(([a, b, c, sp], i) => {
      const y = ((b * area[1] - frame * 0.012 * sp) % area[1] + area[1]) % area[1];
      m.makeTranslation(center[0] + (a - 0.5) * area[0] + Math.sin(frame * 0.03 + i) * 0.08, center[1] + y, center[2] + (c - 0.5) * area[2]);
      ref.current!.setMatrixAt(i, m);
    });
    ref.current!.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, n]}>
      <sphereGeometry args={[0.018, 6, 5]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
    </instancedMesh>
  );
};

// ---------- Weihnachtsstraße am Abend: nasse Straße, Gehweg, Häuser mit Fenstern, Laternen, Lichterketten, Plakatwand ----------
const useWindows = (seed: number) =>
  useCanvasTexture(
    512,
    1024,
    (ctx) => {
      ctx.fillStyle = ["#4A3A34", "#3A3F4E", "#54453A"][seed % 3];
      ctx.fillRect(0, 0, 512, 1024);
      for (let y = 0; y < 6; y++)
        for (let x = 0; x < 3; x++) {
          const lit = (x * 7 + y * 3 + seed) % 5 !== 0;
          const g = ctx.createLinearGradient(0, 60 + y * 160, 0, 170 + y * 160);
          g.addColorStop(0, lit ? "#FFD9A0" : "#1E2433");
          g.addColorStop(1, lit ? "#E89A4A" : "#141824");
          ctx.fillStyle = g;
          ctx.fillRect(50 + x * 150, 60 + y * 160, 100, 110);
          ctx.fillStyle = "#2A2420";
          ctx.fillRect(98 + x * 150, 60 + y * 160, 5, 110);
          ctx.fillRect(50 + x * 150, 112 + y * 160, 100, 5);
        }
    },
    [seed],
  );

const useAsphalt = () =>
  useCanvasTexture(
    512,
    512,
    (ctx) => {
      ctx.fillStyle = "#2A2D33";
      ctx.fillRect(0, 0, 512, 512);
      // feste, nicht zufällige Struktur
      for (let i = 0; i < 900; i++) {
        const v = 38 + ((i * 53) % 28);
        ctx.fillStyle = `rgb(${v},${v + 2},${v + 6})`;
        ctx.fillRect((i * 197) % 512, (i * 311) % 512, 3, 3);
      }
    },
    [],
  );

export const XmasStreet: React.FC<{ frame: number; posters?: THREE.Texture[] }> = ({ frame, posters }) => {
  const wins = [useWindows(0), useWindows(1), useWindows(2)];
  const asphalt = useAsphalt();
  asphalt.wrapS = asphalt.wrapT = THREE.RepeatWrapping;
  asphalt.repeat.set(10, 10);
  return (
    <group>
      {/* nasse Straße (spiegelt die Lichter) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 3]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshPhysicalMaterial map={asphalt} roughness={0.28} metalness={0.15} clearcoat={0.8} clearcoatRoughness={0.25} />
      </mesh>
      {/* Gehweg mit Bordstein und Schneerand */}
      <Block size={[30, 0.14, 2.6]} position={[0, 0.07, -0.5]} color="#8E8C88" rough={0.8} />
      <Block size={[30, 0.04, 0.35]} position={[0, 0.16, -1.65]} color="#F2F5FA" rough={1} />
      {/* Häuserzeile */}
      {[-5.2, -1.8, 1.8, 5.2].map((x, i) => (
        <group key={x} position={[x, 4, -2.2]}>
          <Block size={[3.3, 8, 0.6]} color={["#4A3A34", "#3A3F4E", "#54453A", "#3A3F4E"][i]} rough={0.9} />
          <mesh position={[0, 0, 0.31]}>
            <planeGeometry args={[3.2, 7.9]} />
            <meshStandardMaterial map={wins[i % 3]} emissiveMap={wins[i % 3]} emissive="#ffffff" emissiveIntensity={0.55} roughness={0.9} />
          </mesh>
        </group>
      ))}
      {/* Plakatwand vor dem Haus */}
      {posters && (
        <group position={[0, 1.55, -1.75]}>
          <Block size={[4.8, 2.2, 0.1]} color="#1B1D24" rough={0.4} metal={0.5} />
          {posters.map((p, i) => (
            <Sheet key={i} tex={p} size={[1.45, 2.0]} position={[-1.55 + i * 1.55, 0, 0.07]} />
          ))}
          <pointLight position={[0, 1.4, 0.7]} intensity={2.5} distance={3} color="#FFE2B0" />
        </group>
      )}
      {/* Laternen */}
      {[-3.4, 3.4].map((x) => (
        <group key={x} position={[x, 0, -0.6]}>
          <mesh position={[0, 1.9, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.07, 3.8, 16]} />
            <meshStandardMaterial color="#1B1D24" metalness={0.7} roughness={0.35} />
          </mesh>
          <Glow position={[0, 3.85, 0]} color="#FFD9A0" size={1.4} core={0.12} />
          <pointLight position={[0, 3.6, 0.2]} intensity={7} distance={7} decay={1.6} color="#FFC98A" castShadow={false} />
        </group>
      ))}
      {/* Lichterketten über der Straße */}
      <Garland from={[-5, 3.6, -1.9]} to={[5, 3.6, -1.9]} n={22} sag={0.5} frame={frame} />
      <Garland from={[-5, 4.4, 1.5]} to={[5, 4.4, 1.5]} n={20} sag={0.6} frame={frame + 30} />
      <Snow3D frame={frame} center={[0, 0, 0.5]} />
    </group>
  );
};

// ---------- gezeichneter Weihnachtsmann (für Zeitschrift, Postkarte, Gemälde) ----------
export const drawSanta = (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, mode: "ink" | "color", bottle = false) => {
  const fill = (c: string) => {
    if (mode === "color") {
      ctx.fillStyle = c;
      ctx.fill();
    }
    ctx.lineWidth = mode === "ink" ? 5 * s : 3 * s;
    ctx.strokeStyle = mode === "ink" ? "#1B1B1B" : "rgba(60,20,10,0.6)";
    ctx.stroke();
  };
  const circle = (cx: number, cy: number, r: number, c: string) => {
    ctx.beginPath();
    ctx.arc(x + cx * s, y + cy * s, r * s, 0, Math.PI * 2);
    fill(c);
  };
  // Bauch + Körper
  circle(0, 150, 110, RED);
  // Gürtel
  ctx.beginPath();
  ctx.rect(x - 108 * s, y + 140 * s, 216 * s, 26 * s);
  fill("#1B1B1B");
  // Kopf, Bart
  circle(0, -10, 60, "#F3C3A0");
  ctx.beginPath();
  ctx.ellipse(x, y + 40 * s, 62 * s, 58 * s, 0, 0, Math.PI);
  fill("#FFFFFF");
  // Augen
  ctx.fillStyle = "#1B1B1B";
  [-22, 22].forEach((dx) => {
    ctx.beginPath();
    ctx.arc(x + dx * s, y - 18 * s, 6 * s, 0, Math.PI * 2);
    ctx.fill();
  });
  // Mütze
  ctx.beginPath();
  ctx.moveTo(x - 62 * s, y - 40 * s);
  ctx.quadraticCurveTo(x, y - 170 * s, x + 90 * s, y - 120 * s);
  ctx.lineTo(x + 62 * s, y - 40 * s);
  ctx.closePath();
  fill(RED);
  circle(92, -122, 16, "#FFFFFF");
  ctx.beginPath();
  ctx.rect(x - 70 * s, y - 52 * s, 140 * s, 22 * s);
  fill("#FFFFFF");
  if (bottle) {
    ctx.beginPath();
    ctx.rect(x + 95 * s, y + 70 * s, 34 * s, 90 * s);
    fill("#3A1A10");
    ctx.beginPath();
    ctx.rect(x + 95 * s, y + 100 * s, 34 * s, 22 * s);
    fill(RED);
  }
};

// Zeitschriftenseite (schwarz-weiß gezeichnet, wie ein Holzstich)
export const useMagazineTexture = () =>
  useCanvasTexture(
    800,
    1040,
    (ctx) => {
      ctx.fillStyle = "#EFE4C6";
      ctx.fillRect(0, 0, 800, 1040);
      ctx.fillStyle = "#1B1B1B";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `62px ${F.vintage}`;
      ctx.fillText("Weekly Illustrated", 400, 70);
      ctx.fillRect(30, 112, 740, 5);
      ctx.font = `bold 26px ${F.sub}`;
      ctx.fillText("NEW YORK · JANUAR 1863", 400, 140);
      ctx.strokeStyle = "#1B1B1B";
      ctx.lineWidth = 4;
      ctx.strokeRect(70, 180, 660, 640);
      drawSanta(ctx, 400, 470, 1.6, "ink");
      ctx.font = `38px ${F.vintage}`;
      ctx.fillText("Santa Claus", 400, 870);
      lines(ctx, 70, 920, 660, 3, 30, "#7A6A50", 12);
    },
    [],
  );

// rote Postkarte um 1900
export const usePostcardTexture = (variant: number) =>
  useCanvasTexture(
    900,
    600,
    (ctx) => {
      const bg = ["#2D6A4F", "#1D3557", "#6D2E46"][variant % 3];
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 900, 600);
      ctx.strokeStyle = "#E9D8A6";
      ctx.lineWidth = 14;
      ctx.strokeRect(18, 18, 864, 564);
      // Schneeflocken
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      for (let i = 0; i < 26; i++) {
        ctx.beginPath();
        ctx.arc(60 + ((i * 137) % 780), 50 + ((i * 89) % 500), 6, 0, Math.PI * 2);
        ctx.fill();
      }
      drawSanta(ctx, 280, 300, 1.1, "color");
      ctx.fillStyle = "#E9D8A6";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `64px ${F.vintage}`;
      ctx.fillText("Merry", 650, 230);
      ctx.fillText("Christmas", 650, 320);
      ctx.font = `bold 40px ${F.sub}`;
      ctx.fillText(["um 1900", "um 1902", "um 1905"][variant % 3], 650, 430);
    },
    [variant],
  );

// Gemälde für die Werbung ab 1931 (Weihnachtsmann mit Flasche)
export const usePaintingTexture = () =>
  useCanvasTexture(
    800,
    1000,
    (ctx) => {
      const g = ctx.createRadialGradient(400, 420, 50, 400, 500, 650);
      g.addColorStop(0, "#FFE8B0");
      g.addColorStop(1, "#7A3B1A");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 800, 1000);
      drawSanta(ctx, 380, 470, 1.8, "color", true);
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.font = `80px ${F.bold}`;
      ctx.fillText("PAUSE MIT COLA", 400, 920);
    },
    [],
  );

// Werbeplakat: Weihnachtsmann + Cola (für die Plakatwand)
export const useAdPoster = (variant: number) =>
  useCanvasTexture(
    500,
    700,
    (ctx) => {
      ctx.fillStyle = ["#C8102E", "#F4F1EA", "#1D3557"][variant % 3];
      ctx.fillRect(0, 0, 500, 700);
      drawSanta(ctx, 230, 300, 1.1, "color", true);
      ctx.fillStyle = variant % 3 === 1 ? RED : "#fff";
      ctx.textAlign = "center";
      ctx.font = `76px ${F.bold}`;
      ctx.fillText("COLA", 250, 620);
    },
    [variant],
  );

// ---------- Staffelei mit Gemälde ----------
export const Easel: React.FC<{ tex: THREE.Texture; position?: V3; rotation?: V3; scale?: number }> = ({ tex, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => (
  <group position={position} rotation={rotation} scale={scale}>
    {[-0.7, 0.7].map((x) => (
      <mesh key={x} position={[x, 1.2, -0.1]} rotation={[0.12, 0, x > 0 ? -0.08 : 0.08]} castShadow>
        <boxGeometry args={[0.07, 2.6, 0.07]} />
        <meshStandardMaterial color="#8C5A3C" roughness={0.8} />
      </mesh>
    ))}
    <mesh position={[0, 1.2, -0.45]} rotation={[-0.35, 0, 0]}>
      <boxGeometry args={[0.07, 2.6, 0.07]} />
      <meshStandardMaterial color="#8C5A3C" roughness={0.8} />
    </mesh>
    <Block size={[1.7, 0.08, 0.2]} position={[0, 0.62, 0.02]} color="#8C5A3C" />
    {/* Bild mit goldenem Rahmen */}
    <group position={[0, 1.55, 0.05]} rotation={[-0.1, 0, 0]}>
      <Block size={[1.62, 1.98, 0.08]} color="#C9A24A" metal={0.8} rough={0.3} />
      <Sheet tex={tex} size={[1.44, 1.8]} position={[0, 0, 0.045]} depth={0.01} />
    </group>
  </group>
);

// ================= Neue Kulissen für die Erzähl-Version =================

// ---------- Altstadt in Kleinasien bei Nacht: flache Lehmhäuser, ein Fenster leuchtet, Mond, Sterne ----------
export const OldTown: React.FC<{ frame: number; windowGlow?: number }> = ({ frame, windowGlow = 1 }) => {
  const houses: { x: number; z: number; w: number; h: number; d: number; c: string }[] = [
    { x: -2.6, z: -2.0, w: 2.2, h: 2.6, d: 2, c: "#C9A97A" },
    { x: 0.2, z: -2.6, w: 2.6, h: 3.2, d: 2, c: "#B8956A" },
    { x: 2.9, z: -1.6, w: 2.0, h: 2.4, d: 2, c: "#D2B48A" },
    { x: -3.2, z: 1.2, w: 1.8, h: 2.2, d: 1.8, c: "#BE9C70" },
    { x: 3.3, z: 1.4, w: 1.8, h: 2.8, d: 1.8, c: "#C4A275" },
  ];
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#6E5A44" roughness={1} />
      </mesh>
      {houses.map((h, i) => (
        <group key={i} position={[h.x, h.h / 2, h.z]}>
          <Block size={[h.w, h.h, h.d]} color={h.c} rough={0.95} />
          {/* flaches Dach mit Rand */}
          <Block size={[h.w + 0.12, 0.12, h.d + 0.12]} position={[0, h.h / 2 + 0.06, 0]} color="#9C7C54" rough={0.95} />
          {/* dunkle Tür + Fenster */}
          <Block size={[0.5, 1.0, 0.04]} position={[h.w * 0.2, -h.h / 2 + 0.5, h.d / 2 + 0.01]} color="#3B2A1A" rough={0.9} />
          <Block size={[0.36, 0.42, 0.04]} position={[-h.w * 0.25, 0.2, h.d / 2 + 0.01]} color="#2A2018" rough={0.9} />
        </group>
      ))}
      {/* das Fenster der armen Familie (leuchtet warm) */}
      <group position={[0.75, 1.35, -1.59]}>
        <mesh>
          <planeGeometry args={[0.55, 0.6]} />
          <meshBasicMaterial color="#FFB45C" toneMapped={false} transparent opacity={0.5 + 0.5 * windowGlow} />
        </mesh>
        <pointLight position={[0, 0, 0.6]} intensity={2.2 * windowGlow} distance={3.5} color="#FFB45C" />
      </group>
      {/* Mond + Sterne */}
      <Glow position={[-2.2, 5.6, -8]} color="#DDE8FF" size={2.6} core={0.42} />
      {Array.from({ length: 40 }).map((_, i) => (
        <Glow
          key={i}
          position={[((i * 7919) % 100) / 100 * 16 - 8, 3.8 + ((i * 104729) % 100) / 100 * 4, -9]}
          color="#ffffff"
          size={0.12 + 0.06 * Math.sin(frame * 0.1 + i)}
          core={0.012}
        />
      ))}
    </group>
  );
};

// ---------- Goldmünze ----------
export const Coin: React.FC<{ position: V3; rotation?: V3; scale?: number }> = ({ position, rotation = [0, 0, 0], scale = 1 }) => (
  <mesh position={position} rotation={rotation} scale={scale} castShadow>
    <cylinderGeometry args={[0.07, 0.07, 0.015, 24]} />
    <meshStandardMaterial color="#F2C14E" metalness={0.6} roughness={0.25} emissive="#FFB000" emissiveIntensity={1.4} toneMapped={false} />
  </mesh>
);

// ---------- Schreibtisch mit Öllampe (1863) ----------
export const Desk: React.FC<{ frame: number }> = ({ frame }) => {
  const flick = 1 + Math.sin(frame * 0.7) * 0.05 + Math.sin(frame * 1.9) * 0.03;
  return (
    <group>
      {/* Tischplatte */}
      <Block size={[3.2, 0.08, 1.8]} position={[0, -0.04, 0]} color="#5A3A22" rough={0.55} />
      <Block size={[3.4, 0.6, 0.1]} position={[0, -0.35, 0.9]} color="#4A2E1A" rough={0.6} />
      {/* Tintenfass */}
      <mesh position={[0.95, 0.09, -0.25]} castShadow>
        <cylinderGeometry args={[0.09, 0.11, 0.17, 24]} />
        <meshPhysicalMaterial color="#141414" roughness={0.1} clearcoat={1} />
      </mesh>
      {/* Öllampe */}
      <group position={[-1.05, 0, -0.35]}>
        <mesh position={[0, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.16, 0.16, 24]} />
          <meshStandardMaterial color="#B08D57" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.34, 0]}>
          <sphereGeometry args={[0.15, 24, 18]} />
          <meshPhysicalMaterial color="#FFF3D6" roughness={0.05} transmission={0.6} transparent opacity={0.45} />
        </mesh>
        <Glow position={[0, 0.33, 0]} color="#FFB347" size={1.1 * flick} core={0.04} />
        <pointLight position={[0, 0.36, 0]} intensity={6 * flick} distance={5} decay={1.5} color="#FFB45C" castShadow />
      </group>
    </group>
  );
};

// Zeichnung, die von unten nach oben entsteht (Bauch -> Bart -> Lachen)
export const useDrawingTexture = (progress: number) =>
  useCanvasTexture(
    800,
    1040,
    (ctx) => {
      ctx.fillStyle = "#EFE4C6";
      ctx.fillRect(0, 0, 800, 1040);
      ctx.save();
      const top = 1040 - progress * 1000;
      ctx.beginPath();
      ctx.rect(0, top, 800, 1040);
      ctx.clip();
      drawSanta(ctx, 400, 470, 1.7, "ink");
      ctx.restore();
      ctx.fillStyle = "#3A2A16";
      ctx.textAlign = "center";
      ctx.font = `40px ${F.vintage}`;
      if (progress > 0.98) ctx.fillText("Santa Claus · 1863", 400, 960);
    },
    [Math.round(progress * 60)],
  );

// Feder (Federkiel)
export const Quill: React.FC<{ position: V3; rotation?: V3 }> = ({ position, rotation = [0, 0, 0] }) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, 0.25, 0]}>
      <cylinderGeometry args={[0.006, 0.004, 0.5, 8]} />
      <meshStandardMaterial color="#E8E0CC" />
    </mesh>
    <mesh position={[0.03, 0.33, 0]} rotation={[0, 0, -0.08]} scale={[0.35, 1, 0.08]}>
      <sphereGeometry args={[0.16, 16, 12]} />
      <meshPhysicalMaterial color="#F4EFE4" roughness={0.9} sheen={1} />
    </mesh>
  </group>
);

// Gemälde, das beim Malen sichtbar wird (diagonal wischen)
export const usePaintingProgress = (progress: number) =>
  useCanvasTexture(
    800,
    1000,
    (ctx) => {
      ctx.fillStyle = "#F4EEE2";
      ctx.fillRect(0, 0, 800, 1000);
      ctx.save();
      ctx.beginPath();
      const p = progress * 1900;
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.min(800, p), 0);
      ctx.lineTo(Math.max(0, p - 1000), 1000);
      ctx.lineTo(0, 1000);
      ctx.closePath();
      ctx.clip();
      const g = ctx.createRadialGradient(400, 420, 50, 400, 500, 650);
      g.addColorStop(0, "#FFE8B0");
      g.addColorStop(1, "#7A3B1A");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 800, 1000);
      drawSanta(ctx, 380, 470, 1.8, "color", true);
      ctx.restore();
    },
    [Math.round(progress * 40)],
  );

// ---------- Atelier: Holzboden, Wand, Fenster mit Schnee-Licht ----------
export const Studio: React.FC = () => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#7A5A3C" roughness={0.6} />
    </mesh>
    <mesh position={[0, 3, -2.2]} receiveShadow>
      <planeGeometry args={[20, 6]} />
      <meshStandardMaterial color="#D8CDBA" roughness={0.95} />
    </mesh>
    {/* Fenster */}
    <group position={[-2.2, 2.0, -2.18]}>
      <mesh>
        <planeGeometry args={[1.6, 1.8]} />
        <meshBasicMaterial color="#BFD4F2" toneMapped={false} />
      </mesh>
      <Block size={[1.7, 0.06, 0.06]} position={[0, 0, 0.03]} color="#5A4030" />
      <Block size={[0.06, 1.9, 0.06]} position={[0, 0, 0.03]} color="#5A4030" />
      <pointLight position={[0, 0, 1]} intensity={4} distance={6} color="#CFE0FF" />
    </group>
  </group>
);

// Baskenmütze für den Maler
export const Beret: React.FC = () => (
  <group position={[0.02, 0.11, -0.01]} rotation={[0.05, 0, -0.25]}>
    <mesh scale={[1, 0.32, 1]}>
      <sphereGeometry args={[0.15, 32, 20]} />
      <meshPhysicalMaterial color="#2B2D42" roughness={0.9} sheen={0.6} />
    </mesh>
    <mesh position={[0, 0.05, 0]}>
      <cylinderGeometry args={[0.008, 0.008, 0.03, 8]} />
      <meshStandardMaterial color="#2B2D42" />
    </mesh>
  </group>
);

// Pinsel
export const Brush: React.FC = () => (
  <group rotation={[Math.PI / 2, 0, 0]}>
    <mesh position={[0, 0.1, 0]}>
      <cylinderGeometry args={[0.008, 0.01, 0.24, 10]} />
      <meshStandardMaterial color="#8C5A3C" />
    </mesh>
    <mesh position={[0, 0.235, 0]}>
      <coneGeometry args={[0.012, 0.04, 10]} />
      <meshStandardMaterial color={RED} />
    </mesh>
  </group>
);
