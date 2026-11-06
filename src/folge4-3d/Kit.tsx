// 3D-Baukasten für Folge 4 (Three.js über @remotion/three / React Three Fiber).
// Alles wird per Code gebaut: Geometrien, Materialien und Text-Texturen (Canvas) – keine Bilder aus dem Internet.
import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import helvetikerBold from "three/examples/fonts/helvetiker_bold.typeface.json";
import { FONT_BOLD, FONT_SUB, FONT_VINTAGE } from "../theme";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export type V3 = [number, number, number];

// ---------- Bühne: Canvas mit Umgebungslicht (Reflexionen), Schatten, Kamera ----------
const Env: React.FC<{ intensity?: number }> = ({ intensity = 0.9 }) => {
  const { gl, scene } = useThree();
  React.useLayoutEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const env = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = intensity;
    return () => {
      env.dispose();
      pm.dispose();
    };
  }, [gl, scene, intensity]);
  return null;
};

// dist = Abstand-Faktor (Kamera weiter weg, gleiche Blickrichtung),
// lift = Bild um so viele Pixel nach oben schieben (Platz für Untertitel unten)
const Cam: React.FC<{ pos: V3; look: V3; fov: number; roll: number; dist: number; lift: number }> = ({ pos, look, fov, roll, dist, lift }) => {
  const { camera } = useThree();
  const { width, height } = useVideoConfig();
  React.useLayoutEffect(() => {
    const c = camera as THREE.PerspectiveCamera;
    c.position.set(look[0] + (pos[0] - look[0]) * dist, look[1] + (pos[1] - look[1]) * dist, look[2] + (pos[2] - look[2]) * dist);
    c.setViewOffset(width, height, 0, lift, width, height);
    c.fov = fov;
    c.up.set(Math.sin(roll), Math.cos(roll), 0);
    c.lookAt(...look);
    c.updateProjectionMatrix();
  });
  return null;
};

export const Stage3D: React.FC<{
  children: React.ReactNode;
  cam: V3;
  look?: V3;
  fov?: number;
  roll?: number;
  key1?: string;
  rim?: string;
  floor?: number | null;
  exposure?: number;
  dist?: number;
  lift?: number;
}> = ({ children, cam, look = [0, 0, 0], fov = 35, roll = 0, key1 = "#ffffff", rim = "#88aaff", floor = -1, exposure = 1.05, dist = 1.85, lift = 170 }) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: exposure, preserveDrawingBuffer: true }}
      camera={{ position: cam, fov, near: 0.1, far: 100 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Env />
      <Cam pos={cam} look={look} fov={fov} roll={roll} dist={dist} lift={lift} />
      <hemisphereLight args={["#ffffff", "#333344", 0.6]} />
      <directionalLight
        position={[4, 7, 6]}
        intensity={2.4}
        color={key1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-5, 3, -4]} intensity={2.2} color={rim} />
      {floor !== null && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, floor, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <shadowMaterial opacity={0.35} />
        </mesh>
      )}
      {children}
    </ThreeCanvas>
  );
};

// ---------- Animation-Helfer ----------
export const useSpr = (delay = 0, stiffness = 200, damping = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness } });
};
// Kamera: schneller Push-In am Schnittanfang, danach langsame Fahrt
export const useDolly = (from: V3, to: V3, frames = 18) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 20, stiffness: 140 }, durationInFrames: frames });
  const drift = frame * 0.004;
  return from.map((v, i) => interpolate(s, [0, 1], [v, to[i]]) - (i === 2 ? drift : 0)) as V3;
};
export const shake3 = (frame: number, at: number, len = 10, amp = 0.12): V3 => {
  const t = frame - at;
  if (t < 0 || t > len) return [0, 0, 0];
  const d = 1 - t / len;
  return [Math.sin(t * 9.1) * amp * d, Math.cos(t * 7.3) * amp * d, 0];
};
export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

// ---------- Text-Texturen per Canvas ----------
export const useCanvasTexture = (w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void, deps: unknown[]) => {
  const tex = React.useMemo(() => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [w, h]);
  React.useMemo(() => {
    const ctx = (tex.image as HTMLCanvasElement).getContext("2d")!;
    ctx.clearRect(0, 0, w, h);
    draw(ctx);
    tex.needsUpdate = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tex, ...deps]);
  return tex;
};

export const F = { bold: FONT_BOLD, sub: FONT_SUB, vintage: FONT_VINTAGE };
export const lines = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, n: number, gap: number, color: string, hgt = 10) => {
  ctx.fillStyle = color;
  for (let i = 0; i < n; i++) ctx.fillRect(x, y + i * gap, w * (0.65 + ((i * 37) % 30) / 100), hgt);
};

// Zucker-Körnung (Bump-Map), einmal erzeugt
let grain: THREE.CanvasTexture | null = null;
const sugarGrain = () => {
  if (grain) return grain;
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, 256, 256);
  let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 2600; i++) {
    const v = Math.floor(rnd() * 255);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(rnd() * 256, rnd() * 256, 2 + rnd() * 4, 2 + rnd() * 4);
  }
  grain = new THREE.CanvasTexture(c);
  grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
  return grain;
};

// ---------- Geometrien (einmal erzeugt) ----------
const G = {
  cube: new RoundedBoxGeometry(1, 1, 1, 5, 0.07),
  butter: new RoundedBoxGeometry(1.8, 0.75, 1.0, 5, 0.1),
  box: new RoundedBoxGeometry(1, 1, 1, 3, 0.04),
};

// ---------- Zuckerwürfel ----------
export const SugarCube: React.FC<{ position?: V3; rotation?: V3; scale?: number; halo?: number; glow?: number }> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  halo = 0,
  glow = 0,
}) => {
  const bump = sugarGrain();
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={G.cube} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.62}
          bumpMap={bump}
          bumpScale={1.6}
          sheen={1}
          sheenColor="#ffffff"
          sheenRoughness={0.5}
          clearcoat={0.15}
          emissive="#fff6d0"
          emissiveIntensity={glow}
        />
      </mesh>
      {halo > 0 && (
        <group position={[0, 0.85 + (1 - halo) * 0.6, 0]} rotation={[Math.PI / 2 - 0.25, 0, 0]} scale={halo}>
          <mesh>
            <torusGeometry args={[0.55, 0.07, 24, 80]} />
            <meshStandardMaterial color="#FFD84D" metalness={1} roughness={0.2} emissive="#FFB800" emissiveIntensity={1.4} />
          </mesh>
          <pointLight color="#FFD84D" intensity={6 * halo} distance={4} />
        </group>
      )}
    </group>
  );
};

// ---------- Butter (optional böse: Hörner, Augen, Grinsen) ----------
export const Butter: React.FC<{ position?: V3; rotation?: V3; scale?: number; evil?: number }> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  evil = 0,
}) => (
  <group position={position} rotation={rotation} scale={scale}>
    <mesh geometry={G.butter} castShadow receiveShadow>
      <meshPhysicalMaterial color="#FFD95A" roughness={0.38} clearcoat={0.35} clearcoatRoughness={0.4} sheen={0.6} sheenColor="#FFF2B0" />
    </mesh>
    {/* Papier-Rest unten */}
    <mesh position={[0, -0.3, 0]} castShadow>
      <boxGeometry args={[1.86, 0.2, 1.06]} />
      <meshStandardMaterial color="#F4F1EA" roughness={0.9} />
    </mesh>
    {evil > 0 && (
      <group scale={evil}>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.55, 0.62, 0.05]} rotation={[0, 0, -s * 0.45]} castShadow>
            <coneGeometry args={[0.16, 0.6, 32]} />
            <meshPhysicalMaterial color="#C1121F" roughness={0.3} clearcoat={0.8} />
          </mesh>
        ))}
        {[-1, 1].map((s) => (
          <mesh key={`e${s}`} position={[s * 0.35, 0.1, 0.51]} rotation={[0, 0, s * 0.35]}>
            <boxGeometry args={[0.34, 0.09, 0.02]} />
            <meshStandardMaterial color="#2B1D0E" />
          </mesh>
        ))}
        {[-1, 1].map((s) => (
          <mesh key={`p${s}`} position={[s * 0.33, -0.02, 0.51]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#2B1D0E" />
          </mesh>
        ))}
        <mesh position={[0, -0.12, 0.505]} rotation={[0, 0, Math.PI + 0.0]}>
          <torusGeometry args={[0.22, 0.03, 8, 32, Math.PI]} />
          <meshStandardMaterial color="#2B1D0E" />
        </mesh>
      </group>
    )}
  </group>
);

// ---------- Forscher (Low-Poly-Figur) ----------
export const Scientist: React.FC<{ position?: V3; rotation?: V3; scale?: number; hair?: string; skin?: string; clipboard?: boolean }> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  hair = "#3B2A1A",
  skin = "#F1C9A5",
  clipboard = true,
}) => (
  <group position={position} rotation={rotation} scale={scale}>
    {/* Kittel */}
    <mesh position={[0, 0, 0]} castShadow>
      <capsuleGeometry args={[0.42, 0.9, 8, 24]} />
      <meshPhysicalMaterial color="#F7F9FC" roughness={0.7} sheen={0.5} />
    </mesh>
    {/* Krawatte */}
    <mesh position={[0, 0.25, 0.41]} rotation={[0.1, 0, 0]}>
      <boxGeometry args={[0.08, 0.4, 0.02]} />
      <meshStandardMaterial color="#9B2226" />
    </mesh>
    {/* Kopf */}
    <mesh position={[0, 1.0, 0]} castShadow>
      <sphereGeometry args={[0.36, 32, 32]} />
      <meshPhysicalMaterial color={skin} roughness={0.55} sheen={0.4} />
    </mesh>
    <mesh position={[0, 1.13, -0.04]} scale={[1.04, 0.75, 1.04]}>
      <sphereGeometry args={[0.36, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color={hair} roughness={0.8} />
    </mesh>
    {/* Brille */}
    {[-1, 1].map((s) => (
      <mesh key={s} position={[s * 0.13, 1.02, 0.33]}>
        <torusGeometry args={[0.09, 0.018, 12, 32]} />
        <meshStandardMaterial color="#111" metalness={0.6} roughness={0.3} />
      </mesh>
    ))}
    <mesh position={[0, 1.02, 0.34]}>
      <boxGeometry args={[0.08, 0.02, 0.02]} />
      <meshStandardMaterial color="#111" />
    </mesh>
    {clipboard && (
      <mesh position={[0.38, 0.0, 0.42]} rotation={[0.2, -0.3, -0.1]} castShadow>
        <boxGeometry args={[0.42, 0.56, 0.03]} />
        <meshStandardMaterial color="#F4EAD0" roughness={0.8} />
      </mesh>
    )}
  </group>
);

// ---------- Geldschein ----------
export const useBillTexture = () =>
  useCanvasTexture(
    512,
    236,
    (ctx) => {
      const g = ctx.createLinearGradient(0, 0, 512, 236);
      g.addColorStop(0, "#8FC88C");
      g.addColorStop(1, "#5E9E66");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 236);
      ctx.strokeStyle = "#1B4332";
      ctx.lineWidth = 8;
      ctx.strokeRect(14, 14, 484, 208);
      ctx.beginPath();
      ctx.ellipse(256, 118, 64, 80, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#C7EBCF";
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#1B4332";
      ctx.font = `120px ${F.bold}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("$", 256, 124);
      ctx.font = `56px ${F.bold}`;
      ctx.fillText("100", 70, 60);
      ctx.fillText("100", 442, 186);
    },
    [],
  );

export const Bill: React.FC<{ position?: V3; rotation?: V3; scale?: number; tex: THREE.Texture }> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, tex }) => (
  <mesh position={position} rotation={rotation} scale={scale} castShadow>
    <boxGeometry args={[1.2, 0.55, 0.008]} />
    <meshStandardMaterial map={tex} roughness={0.75} />
  </mesh>
);

// ---------- Plakat / Papier mit Canvas-Textur ----------
export const Sheet: React.FC<{ tex: THREE.Texture; size: [number, number]; position?: V3; rotation?: V3; depth?: number; color?: string }> = ({
  tex,
  size,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  depth = 0.01,
  color = "#ffffff",
}) => (
  <group position={position} rotation={rotation}>
    <mesh castShadow receiveShadow>
      <boxGeometry args={[size[0], size[1], depth]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
    <mesh position={[0, 0, depth / 2 + 0.001]} receiveShadow>
      <planeGeometry args={size} />
      {/* etwas abgedunkelt + wenig Spiegelung, damit Schrift auf hellem Papier lesbar bleibt */}
      <meshStandardMaterial map={tex} color="#d2d2d2" roughness={0.95} envMapIntensity={0.35} />
    </mesh>
  </group>
);

// ---------- 3D-Schrift (Zahlen) ----------
const font = new FontLoader().parse(helvetikerBold as unknown as Parameters<FontLoader["parse"]>[0]);
const textCache = new Map<string, THREE.BufferGeometry>();
export const textGeo = (text: string, size = 1, depth = 0.3) => {
  const k = `${text}|${size}|${depth}`;
  if (!textCache.has(k)) {
    const g = new TextGeometry(text, { font, size, depth, curveSegments: 8, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.025, bevelSegments: 4 });
    g.computeBoundingBox();
    const b = g.boundingBox!;
    g.translate(-(b.max.x + b.min.x) / 2, -(b.max.y + b.min.y) / 2, -depth / 2);
    textCache.set(k, g);
  }
  return textCache.get(k)!;
};
export const Text3D: React.FC<{ text: string; size?: number; depth?: number; color?: string; position?: V3; rotation?: V3; scale?: number; metal?: number; emissive?: string }> = ({
  text,
  size = 1,
  depth = 0.3,
  color = "#F1E6C8",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  metal = 0.2,
  emissive = "#000000",
}) => (
  <mesh geometry={textGeo(text, size, depth)} position={position} rotation={rotation} scale={scale} castShadow>
    <meshPhysicalMaterial color={color} metalness={metal} roughness={0.3} clearcoat={0.6} emissive={emissive} emissiveIntensity={0.4} />
  </mesh>
);

// ---------- Herz (Extrusion) ----------
const heartGeo = (() => {
  const s = new THREE.Shape();
  s.moveTo(0, -1);
  s.bezierCurveTo(-0.6, -0.55, -1.2, -0.15, -1.2, 0.35);
  s.bezierCurveTo(-1.2, 0.85, -0.75, 1.1, -0.45, 1.1);
  s.bezierCurveTo(-0.2, 1.1, -0.05, 0.95, 0, 0.75);
  s.bezierCurveTo(0.05, 0.95, 0.2, 1.1, 0.45, 1.1);
  s.bezierCurveTo(0.75, 1.1, 1.2, 0.85, 1.2, 0.35);
  s.bezierCurveTo(1.2, -0.15, 0.6, -0.55, 0, -1);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.45, bevelEnabled: true, bevelThickness: 0.18, bevelSize: 0.14, bevelSegments: 8, curveSegments: 32 });
  g.center();
  return g;
})();
export const Heart: React.FC<{ position?: V3; rotation?: V3; scale?: number; color?: string }> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, color = "#C1121F" }) => (
  <mesh geometry={heartGeo} position={position} rotation={rotation} scale={scale} castShadow>
    <meshPhysicalMaterial color={color} roughness={0.25} clearcoat={1} clearcoatRoughness={0.1} sheen={0.4} />
  </mesh>
);

// ---------- Lupe ----------
export const Magnifier: React.FC<{ position?: V3; rotation?: V3; scale?: number }> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => (
  <group position={position} rotation={rotation} scale={scale}>
    <mesh castShadow>
      <torusGeometry args={[0.6, 0.07, 24, 64]} />
      <meshStandardMaterial color="#2B1D0E" metalness={0.7} roughness={0.25} />
    </mesh>
    <mesh>
      <circleGeometry args={[0.58, 64]} />
      <meshPhysicalMaterial color="#DDF1FF" transparent opacity={0.18} roughness={0} metalness={0} clearcoat={1} />
    </mesh>
    <mesh position={[0.62, -0.62, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
      <cylinderGeometry args={[0.08, 0.1, 0.9, 24]} />
      <meshStandardMaterial color="#5A3A1A" roughness={0.5} />
    </mesh>
  </group>
);

// ---------- einfache Kiste mit Farbe ----------
export const Block: React.FC<{ size: V3; color: string; position?: V3; rotation?: V3; rough?: number; metal?: number; emissive?: string; ei?: number }> = ({
  size,
  color,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  rough = 0.6,
  metal = 0,
  emissive = "#000",
  ei = 0,
}) => (
  <mesh geometry={G.box} scale={size} position={position} rotation={rotation} castShadow receiveShadow>
    <meshPhysicalMaterial color={color} roughness={rough} metalness={metal} emissive={emissive} emissiveIntensity={ei} />
  </mesh>
);
