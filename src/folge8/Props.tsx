// 3D-Requisiten für Folge 8 "Marlboro: von der Frauen-Zigarette zum Cowboy" – alles per Code gebaut.
// Keine echten Logos: die Schachtel trägt nur den Namen in einfacher Schrift.
import React from "react";
import * as THREE from "three";
import { Block, F, Sheet, useCanvasTexture, V3 } from "../folge4-3d/Kit";
import { Glow, useAsphalt, useWindows } from "../folge6/Props";

// ---------- Zigarettenschachtel ----------
export const usePackLabel = (style: "lady" | "cowboy") =>
  useCanvasTexture(
    512,
    768,
    (ctx) => {
      if (style === "lady") {
        // 1924: cremefarben, zarte Blumen, geschwungene Schrift
        ctx.fillStyle = "#F6EBDD";
        ctx.fillRect(0, 0, 512, 768);
        ctx.strokeStyle = "#C9A46A";
        ctx.lineWidth = 10;
        ctx.strokeRect(22, 22, 468, 724);
        for (let i = 0; i < 9; i++) {
          const x = 70 + ((i * 137) % 380);
          const y = 470 + ((i * 89) % 230);
          ctx.fillStyle = ["#F2A7B8", "#E8899E", "#F7C6D0"][i % 3];
          for (let k = 0; k < 5; k++) {
            ctx.beginPath();
            ctx.arc(x + Math.cos((k / 5) * Math.PI * 2) * 13, y + Math.sin((k / 5) * Math.PI * 2) * 13, 11, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = "#E9C46A";
          ctx.beginPath();
          ctx.arc(x, y, 7, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = "#7A3B4A";
        ctx.textAlign = "center";
        ctx.font = `92px ${F.vintage}`;
        ctx.fillText("Marlboro", 256, 270);
        ctx.font = `bold 36px ${F.sub}`;
        ctx.fillText("MILD WIE DER MAI", 256, 350);
      } else {
        // 1950er: weiß mit rotem Dach, kräftige Schrift
        ctx.fillStyle = "#FAFAF7";
        ctx.fillRect(0, 0, 512, 768);
        ctx.fillStyle = "#C8102E";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(512, 0);
        ctx.lineTo(512, 300);
        ctx.lineTo(256, 190);
        ctx.lineTo(0, 300);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#111";
        ctx.textAlign = "center";
        ctx.font = `86px ${F.bold}`;
        ctx.fillText("MARLBORO", 256, 470);
        ctx.font = `bold 34px ${F.sub}`;
        ctx.fillText("FILTER", 256, 540);
      }
    },
    [style],
  );

export const CigPack: React.FC<{ label: THREE.Texture; position?: V3; rotation?: V3; scale?: number; open?: number; side?: string }> = ({
  label,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  open = 0,
  side = "#EDE3D3",
}) => (
  <group position={position} rotation={rotation} scale={scale}>
    {/* Körper: Vorder- und Rückseite mit Etikett, Seiten einfarbig */}
    <mesh castShadow receiveShadow>
      <boxGeometry args={[0.56, 0.86, 0.22]} />
      <meshPhysicalMaterial attach="material-0" color={side} roughness={0.5} clearcoat={0.4} />
      <meshPhysicalMaterial attach="material-1" color={side} roughness={0.5} clearcoat={0.4} />
      <meshPhysicalMaterial attach="material-2" color={side} roughness={0.5} clearcoat={0.4} />
      <meshPhysicalMaterial attach="material-3" color={side} roughness={0.5} clearcoat={0.4} />
      <meshPhysicalMaterial attach="material-4" map={label} roughness={0.45} clearcoat={0.5} />
      <meshPhysicalMaterial attach="material-5" map={label} roughness={0.45} clearcoat={0.5} />
    </mesh>
    {/* Deckel klappt nach hinten auf */}
    {open > 0 && (
      <group position={[0, 0.43, -0.11]} rotation={[-open * 1.9, 0, 0]}>
        <mesh position={[0, 0.002, 0.11]}>
          <boxGeometry args={[0.565, 0.01, 0.225]} />
          <meshPhysicalMaterial color={side} roughness={0.5} clearcoat={0.4} />
        </mesh>
      </group>
    )}
    {open > 0.3 &&
      [-0.18, -0.06, 0.06, 0.18].map((x, i) => <Cigarette key={x} position={[x, 0.43 + 0.05 * Math.min(1, open) + (i % 2) * 0.03, 0.02]} rotation={[Math.PI / 2, 0, 0]} scale={0.6} tip={side === "#C8102E" ? "#C98A3A" : "#F4EFE6"} />)}
  </group>
);

// ---------- einzelne Zigarette (liegt entlang der z-Achse nach Drehung) ----------
export const Cigarette: React.FC<{ position?: V3; rotation?: V3; scale?: number; tip?: string; lipstick?: number; ember?: number }> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  tip = "#F4EFE6",
  lipstick = 0,
  ember = 0,
}) => (
  <group position={position} rotation={rotation} scale={scale}>
    <mesh position={[0, 0.12, 0]} castShadow>
      <cylinderGeometry args={[0.028, 0.028, 0.5, 32]} />
      <meshPhysicalMaterial color="#FBFAF6" roughness={0.75} sheen={0.6} sheenColor="#ffffff" />
    </mesh>
    {/* Mundstück */}
    <mesh position={[0, -0.21, 0]} castShadow>
      <cylinderGeometry args={[0.0285, 0.0285, 0.16, 32]} />
      <meshPhysicalMaterial color={tip} roughness={0.55} clearcoat={0.3} />
    </mesh>
    {/* Lippenstift-Abdruck */}
    {lipstick > 0 && (
      <mesh position={[0, -0.26, 0.026]} scale={[1, 0.6, 0.25]}>
        <sphereGeometry args={[0.024, 20, 14]} />
        <meshStandardMaterial color="#C1121F" transparent opacity={lipstick} roughness={0.4} />
      </mesh>
    )}
    {/* Glut */}
    {ember > 0 && (
      <>
        <mesh position={[0, 0.375, 0]}>
          <cylinderGeometry args={[0.027, 0.028, 0.012, 24]} />
          <meshBasicMaterial color="#FF6A1A" toneMapped={false} />
        </mesh>
        <Glow position={[0, 0.38, 0]} color="#FF7A2A" size={0.12 * ember} core={0.004} />
      </>
    )}
  </group>
);

// ---------- Cowboy-Hut (sitzt auf dem Kopf von Human) ----------
const crownGeo = (() => {
  const pts = [
    [0, 0.0],
    [0.15, 0.0],
    [0.152, 0.06],
    [0.145, 0.13],
    [0.12, 0.165],
    [0.0, 0.15],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(pts, 40);
})();
const brimGeo = (() => {
  // Krempe: an den Seiten hochgebogen
  const g = new THREE.RingGeometry(0.13, 0.3, 48, 3);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const r = Math.hypot(x, y);
    const side = Math.abs(x) / Math.max(r, 1e-4);
    p.setZ(i, Math.pow(Math.max(0, r - 0.15) / 0.15, 2) * 0.07 * side * side);
  }
  g.computeVertexNormals();
  return g;
})();
export const CowboyHat: React.FC<{ color?: string; position?: V3; rotation?: V3; scale?: number }> = ({ color = "#7A5634", position = [0, 0.115, -0.01], rotation = [-0.12, 0, 0], scale = 1 }) => (
  <group position={position} rotation={rotation} scale={scale}>
    <mesh geometry={brimGeo} rotation={[-Math.PI / 2, 0, 0]} castShadow>
      <meshPhysicalMaterial color={color} roughness={0.85} sheen={0.8} sheenColor={color} side={THREE.DoubleSide} />
    </mesh>
    <mesh geometry={crownGeo} castShadow>
      <meshPhysicalMaterial color={color} roughness={0.85} sheen={0.8} sheenColor={color} />
    </mesh>
    {/* Hutband */}
    <mesh position={[0, 0.025, 0]}>
      <cylinderGeometry args={[0.153, 0.153, 0.03, 40, 1, true]} />
      <meshStandardMaterial color="#2B1A0E" roughness={0.6} />
    </mesh>
  </group>
);

// Halstuch (als Kragen-Ergänzung, sitzt am Körper)
export const Bandana: React.FC<{ color?: string }> = ({ color = "#B23A2E" }) => (
  <group position={[0, 1.44, 0.15]}>
    <mesh rotation={[0.3, 0, Math.PI]} scale={[1, 1, 0.45]}>
      <coneGeometry args={[0.1, 0.16, 3]} />
      <meshPhysicalMaterial color={color} roughness={0.8} sheen={1} sheenColor={color} />
    </mesh>
  </group>
);

// ---------- Pferd (aus weichen Formen, steht oder geht) ----------
export const Horse: React.FC<{ frame: number; position?: V3; rotation?: V3; scale?: number; color?: string; walk?: boolean }> = ({
  frame,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = "#6B3E22",
  walk = false,
}) => {
  const mat = <meshPhysicalMaterial color={color} roughness={0.55} sheen={0.7} sheenColor="#C08050" clearcoat={0.15} />;
  const dark = <meshStandardMaterial color="#1E140C" roughness={0.8} />;
  const ph = frame * 0.18;
  const leg = (x: number, z: number, k: number) => {
    const sw = walk ? Math.sin(ph + k) * 0.35 : 0;
    return (
      <group key={`${x}${z}`} position={[x, 0.95, z]} rotation={[0, 0, 0]}>
        <group rotation={[0, 0, 0]}>
          <group rotation={[sw, 0, 0]}>
            <mesh position={[0, -0.25, 0]} castShadow>
              <capsuleGeometry args={[0.07, 0.36, 8, 16]} />
              {mat}
            </mesh>
            <group position={[0, -0.47, 0]} rotation={[walk ? Math.max(0, -Math.sin(ph + k)) * 0.6 : 0, 0, 0]}>
              <mesh position={[0, -0.2, 0]} castShadow>
                <capsuleGeometry args={[0.045, 0.3, 8, 16]} />
                {mat}
              </mesh>
              <mesh position={[0, -0.4, 0.01]} castShadow>
                <cylinderGeometry args={[0.055, 0.065, 0.08, 16]} />
                {dark}
              </mesh>
            </group>
          </group>
        </group>
      </group>
    );
  };
  const breathe = 1 + Math.sin(frame * 0.09) * 0.01;
  const headBob = walk ? Math.sin(ph * 2) * 0.04 : Math.sin(frame * 0.05) * 0.03;
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Rumpf (Länge entlang z) */}
      <mesh position={[0, 1.15, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[breathe, 1, breathe]} castShadow>
        <capsuleGeometry args={[0.27, 0.85, 12, 24]} />
        {mat}
      </mesh>
      {/* Brust + Hinterteil etwas runder */}
      <mesh position={[0, 1.16, 0.45]} castShadow>
        <sphereGeometry args={[0.285, 24, 18]} />
        {mat}
      </mesh>
      <mesh position={[0, 1.18, -0.45]} castShadow>
        <sphereGeometry args={[0.285, 24, 18]} />
        {mat}
      </mesh>
      {/* Hals + Kopf */}
      <group position={[0, 1.3, 0.62]} rotation={[0.55 + headBob, 0, 0]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <capsuleGeometry args={[0.13, 0.45, 10, 20]} />
          {mat}
        </mesh>
        {/* Mähne */}
        <mesh position={[0, 0.3, -0.1]} scale={[0.35, 1, 0.5]} castShadow>
          <capsuleGeometry args={[0.12, 0.45, 8, 16]} />
          {dark}
        </mesh>
        <group position={[0, 0.6, 0.02]} rotation={[1.45, 0, 0]}>
          <mesh position={[0, 0.17, 0]} castShadow>
            <capsuleGeometry args={[0.1, 0.3, 10, 20]} />
            {mat}
          </mesh>
          <mesh position={[0, 0.36, -0.01]} castShadow>
            <sphereGeometry args={[0.095, 20, 14]} />
            {mat}
          </mesh>
          {/* Augen + Ohren */}
          {[-1, 1].map((s) => (
            <group key={s}>
              <mesh position={[s * 0.1, 0.06, 0.05]}>
                <sphereGeometry args={[0.022, 12, 10]} />
                <meshPhysicalMaterial color="#120A05" roughness={0.1} clearcoat={1} />
              </mesh>
              <mesh position={[s * 0.06, -0.02, -0.1]} rotation={[-1.6, 0, s * 0.2]}>
                <coneGeometry args={[0.035, 0.12, 12]} />
                {mat}
              </mesh>
            </group>
          ))}
        </group>
      </group>
      {/* Schweif */}
      <mesh position={[0, 1.05, -0.82]} rotation={[0.35 + Math.sin(frame * 0.07) * 0.08, Math.sin(frame * 0.05) * 0.15, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.6, 8, 12]} />
        {dark}
      </mesh>
      {/* Sattel */}
      <mesh position={[0, 1.42, 0.0]} scale={[1, 0.35, 1.25]} castShadow>
        <sphereGeometry args={[0.24, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color="#3B2414" roughness={0.45} clearcoat={0.5} />
      </mesh>
      {leg(-0.15, 0.45, 0)}
      {leg(0.15, 0.45, Math.PI)}
      {leg(-0.15, -0.45, Math.PI)}
      {leg(0.15, -0.45, 0)}
    </group>
  );
};

// ---------- Wüste im Abendlicht: Sand, Tafelberge, Kakteen, Zaun, Sonne ----------
const Cactus: React.FC<{ position: V3; scale?: number }> = ({ position, scale = 1 }) => {
  const m = <meshStandardMaterial color="#3E6B3A" roughness={0.8} />;
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <capsuleGeometry args={[0.13, 1.4, 8, 16]} />
        {m}
      </mesh>
      <mesh position={[0.25, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.5, 8, 12]} />
        {m}
      </mesh>
      <mesh position={[0.14, 0.62, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.07, 0.15, 8, 12]} />
        {m}
      </mesh>
      <mesh position={[-0.22, 1.2, 0]} castShadow>
        <capsuleGeometry args={[0.07, 0.35, 8, 12]} />
        {m}
      </mesh>
      <mesh position={[-0.12, 1.0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.06, 0.12, 8, 12]} />
        {m}
      </mesh>
    </group>
  );
};

export const FencePost: React.FC<{ position: V3 }> = ({ position }) => (
  <group position={position}>
    <Block size={[0.14, 1.2, 0.14]} position={[0, 0.6, 0]} color="#6B4A2E" rough={0.95} />
  </group>
);

export const Desert: React.FC<{ frame: number; sun?: number; night?: number }> = ({ frame, sun = 1, night = 0 }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color={night > 0.5 ? "#3A3040" : "#C98E5A"} roughness={1} />
    </mesh>
    {/* Tafelberge am Horizont */}
    {[
      [-9, -22, 7, 5],
      [-1, -26, 9, 7],
      [9, -20, 6, 4.2],
      [16, -28, 8, 6],
    ].map(([x, z, w, h], i) => (
      <mesh key={i} position={[x, h / 2, z]} castShadow>
        <cylinderGeometry args={[w * 0.42, w * 0.55, h, 7]} />
        <meshStandardMaterial color={night > 0.5 ? "#2A2030" : ["#A0522D", "#8B4A2B", "#B5653A", "#93502E"][i]} roughness={1} />
      </mesh>
    ))}
    <Cactus position={[-2.6, 0, -3.5]} scale={1.1} />
    <Cactus position={[3.2, 0, -5]} scale={0.9} />
    <Cactus position={[-5.5, 0, -8]} scale={1.3} />
    {/* Holzzaun */}
    {[-2, -1, 0, 1, 2].map((k) => (
      <FencePost key={k} position={[1.2 + k * 1.1, 0, -1.6 - k * 0.15]} />
    ))}
    {[0.45, 0.95].map((y) => (
      <mesh key={y} position={[1.2, y, -1.6]} rotation={[0, 0.136, 0]} castShadow>
        <boxGeometry args={[4.6, 0.07, 0.05]} />
        <meshStandardMaterial color="#5E4028" roughness={0.95} />
      </mesh>
    ))}
    {/* Sonne tief am Horizont / Mond */}
    {sun > 0 && <Glow position={[2.5, 2.2, -30]} color="#FFB347" size={14 * sun} core={1.6 * sun} />}
    {night > 0 && (
      <>
        <Glow position={[-4, 9, -30]} color="#DDE8FF" size={5 * night} core={0.8 * night} />
        {Array.from({ length: 50 }).map((_, i) => (
          <Glow
            key={i}
            position={[(((i * 7919) % 100) / 100) * 50 - 25, 6 + (((i * 104729) % 100) / 100) * 14, -32]}
            color="#ffffff"
            size={(0.3 + 0.15 * Math.sin(frame * 0.1 + i)) * night}
            core={0.03 * night}
          />
        ))}
      </>
    )}
  </group>
);

// fliegender Staub/Funken im Gegenlicht (feste Werte, kein Zufall)
export const Dust: React.FC<{ frame: number; n?: number; color?: string }> = ({ frame, n = 40, color = "#FFD9A0" }) => (
  <group>
    {Array.from({ length: n }).map((_, i) => {
      const a = ((i * 7919) % 1000) / 1000;
      const b = ((i * 104729) % 1000) / 1000;
      const c = ((i * 1299709) % 1000) / 1000;
      const x = ((a * 8 + frame * 0.01 * (0.5 + c)) % 8) - 4;
      return <Glow key={i} position={[x, 0.2 + b * 2.4 + Math.sin(frame * 0.05 + i) * 0.1, -0.5 - c * 3]} color={color} size={0.08 + c * 0.06} core={0.004} />;
    })}
  </group>
);

// ---------- Abendstraße (wie Folge 6, aber ohne Weihnachtsschmuck) mit Plakatwand ----------
export const NightStreet: React.FC<{ frame: number; posters?: THREE.Texture[] }> = ({ frame, posters }) => {
  const wins = [useWindows(0), useWindows(1), useWindows(2)];
  const asphalt = useAsphalt();
  asphalt.wrapS = asphalt.wrapT = THREE.RepeatWrapping;
  asphalt.repeat.set(10, 10);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 3]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshPhysicalMaterial map={asphalt} roughness={0.28} metalness={0.15} clearcoat={0.8} clearcoatRoughness={0.25} />
      </mesh>
      <Block size={[30, 0.14, 2.6]} position={[0, 0.07, -0.5]} color="#8E8C88" rough={0.8} />
      {[-5.2, -1.8, 1.8, 5.2].map((x, i) => (
        <group key={x} position={[x, 4, -2.2]}>
          <Block size={[3.3, 8, 0.6]} color={["#4A3A34", "#3A3F4E", "#54453A", "#3A3F4E"][i]} rough={0.9} />
          <mesh position={[0, 0, 0.31]}>
            <planeGeometry args={[3.2, 7.9]} />
            <meshStandardMaterial map={wins[i % 3]} emissiveMap={wins[i % 3]} emissive="#ffffff" emissiveIntensity={0.55} roughness={0.9} />
          </mesh>
        </group>
      ))}
      {posters && (
        <group position={[0, 1.55, -1.75]}>
          <Block size={[4.8, 2.2, 0.1]} color="#1B1D24" rough={0.4} metal={0.5} />
          {posters.map((p, i) => (
            <Sheet key={i} tex={p} size={[1.45, 2.0]} position={[-1.55 + i * 1.55, 0, 0.07]} />
          ))}
          <pointLight position={[0, 1.4, 0.7]} intensity={2.5} distance={3} color="#FFE2B0" />
        </group>
      )}
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
      {/* leuchtende Neon-Reklame */}
      <Glow position={[-2.6, 3.2, -1.85]} color="#FF4D6D" size={0.9 + 0.1 * Math.sin(frame * 0.3)} core={0.05} />
      <Glow position={[2.6, 3.0, -1.85]} color="#5EC8FF" size={0.8 + 0.1 * Math.cos(frame * 0.27)} core={0.05} />
    </group>
  );
};

// ---------- Plakate (gezeichnet) ----------
const drawLady = (ctx: CanvasRenderingContext2D, x: number, y: number, s: number) => {
  // elegante Frau im Profil mit Bubikopf und Zigarettenspitze
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = "#1E1A2E"; // Haare
  ctx.beginPath();
  ctx.ellipse(0, -10, 70, 66, 0, Math.PI * 0.9, Math.PI * 2.15);
  ctx.fill();
  ctx.fillStyle = "#F2D2BC"; // Gesicht
  ctx.beginPath();
  ctx.ellipse(18, 10, 48, 60, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1E1A2E";
  ctx.beginPath();
  ctx.ellipse(-12, -14, 58, 50, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#C1121F"; // Lippen
  ctx.beginPath();
  ctx.ellipse(48, 40, 12, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#1E1A2E";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(30, 0);
  ctx.quadraticCurveTo(42, -6, 52, 0);
  ctx.stroke();
  // Zigarettenspitze + Rauch
  ctx.strokeStyle = "#111";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(56, 42);
  ctx.lineTo(150, 30);
  ctx.stroke();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(150, 30);
  ctx.lineTo(190, 25);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(195, 22);
  ctx.bezierCurveTo(220, -20, 170, -50, 205, -100);
  ctx.stroke();
  // Hals + Kleid
  ctx.fillStyle = "#F2D2BC";
  ctx.fillRect(0, 60, 34, 40);
  ctx.fillStyle = "#E8899E";
  ctx.beginPath();
  ctx.moveTo(-70, 190);
  ctx.quadraticCurveTo(-40, 90, 20, 95);
  ctx.quadraticCurveTo(90, 95, 110, 190);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#F6EBDD"; // Perlenkette
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.arc(-6 + i * 8, 104 + Math.sin((i / 6) * Math.PI) * 10, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
};

export const drawCowboy = (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, mode: "ink" | "color") => {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  const ink = mode === "ink";
  const fill = (c: string) => {
    ctx.fillStyle = ink ? "rgba(0,0,0,0)" : c;
    ctx.fill();
    ctx.strokeStyle = ink ? "#2B1D0E" : "rgba(43,29,14,0.85)";
    ctx.lineWidth = ink ? 5 : 3;
    ctx.stroke();
  };
  // Hut
  ctx.beginPath();
  ctx.ellipse(0, -95, 120, 22, 0, 0, Math.PI * 2);
  fill("#7A5634");
  ctx.beginPath();
  ctx.moveTo(-55, -100);
  ctx.quadraticCurveTo(-60, -175, -20, -170);
  ctx.quadraticCurveTo(0, -150, 20, -170);
  ctx.quadraticCurveTo(60, -175, 55, -100);
  ctx.closePath();
  fill("#7A5634");
  // Gesicht mit kantigem Kinn
  ctx.beginPath();
  ctx.moveTo(-52, -80);
  ctx.lineTo(52, -80);
  ctx.lineTo(48, 0);
  ctx.quadraticCurveTo(30, 50, 0, 55);
  ctx.quadraticCurveTo(-30, 50, -48, 0);
  ctx.closePath();
  fill("#D9A27A");
  // Augen (zusammengekniffen), Mund
  ctx.strokeStyle = "#2B1D0E";
  ctx.lineWidth = 5;
  [-22, 22].forEach((ex) => {
    ctx.beginPath();
    ctx.moveTo(ex - 13, -40);
    ctx.lineTo(ex + 13, -42);
    ctx.stroke();
  });
  ctx.beginPath();
  ctx.moveTo(-18, 22);
  ctx.lineTo(18, 20);
  ctx.stroke();
  // Halstuch + Hemd
  ctx.beginPath();
  ctx.moveTo(-40, 55);
  ctx.lineTo(40, 55);
  ctx.lineTo(0, 110);
  ctx.closePath();
  fill("#B23A2E");
  ctx.beginPath();
  ctx.moveTo(-150, 280);
  ctx.quadraticCurveTo(-140, 70, -40, 58);
  ctx.lineTo(40, 58);
  ctx.quadraticCurveTo(140, 70, 150, 280);
  ctx.closePath();
  fill("#5D7FA3");
  ctx.restore();
};

export const usePoster = (variant: "lady" | "cowboy") =>
  useCanvasTexture(
    600,
    840,
    (ctx) => {
      if (variant === "lady") {
        const g = ctx.createLinearGradient(0, 0, 0, 840);
        g.addColorStop(0, "#F7E1E6");
        g.addColorStop(1, "#E9B9C6");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 600, 840);
        drawLady(ctx, 250, 380, 1.5);
        ctx.fillStyle = "#7A3B4A";
        ctx.textAlign = "center";
        ctx.font = `68px ${F.vintage}`;
        ctx.fillText("Mild wie", 300, 120);
        ctx.fillText("der Mai", 300, 195);
        ctx.font = `bold 34px ${F.sub}`;
        ctx.fillText("FÜR DIE DAME · 1924", 300, 790);
      } else {
        const g = ctx.createLinearGradient(0, 0, 0, 840);
        g.addColorStop(0, "#F2B35A");
        g.addColorStop(1, "#B5532D");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 600, 840);
        drawCowboy(ctx, 300, 470, 1.6, "color");
        ctx.fillStyle = "#2B1D0E";
        ctx.textAlign = "center";
        ctx.font = `76px ${F.bold}`;
        ctx.fillText("FREIHEIT", 300, 130);
        ctx.font = `bold 34px ${F.sub}`;
        ctx.fillText("FÜR ECHTE MÄNNER · 1955", 300, 790);
      }
    },
    [variant],
  );

// Skizze, die beim Zeichnen entsteht (von oben nach unten)
export const useSketch = (progress: number) =>
  useCanvasTexture(
    800,
    1040,
    (ctx) => {
      ctx.fillStyle = "#F4EEE0";
      ctx.fillRect(0, 0, 800, 1040);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, 800, 80 + progress * 900);
      ctx.clip();
      drawCowboy(ctx, 400, 520, 1.9, progress > 0.85 ? "color" : "ink");
      ctx.restore();
      ctx.fillStyle = "#2B1D0E";
      ctx.textAlign = "center";
      ctx.font = `bold 44px ${F.sub}`;
      if (progress > 0.95) ctx.fillText("IDEE: COWBOY", 400, 990);
    },
    [Math.round(progress * 50)],
  );

// ---------- Werbeagentur-Büro 1954: Schreibtisch, Lampe, Fenster mit Skyline ----------
export const Office: React.FC<{ frame: number }> = ({ frame }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#5A4636" roughness={0.7} />
    </mesh>
    {/* Wand mit großem Fenster */}
    <mesh position={[0, 3, -2]} receiveShadow>
      <planeGeometry args={[20, 6]} />
      <meshStandardMaterial color="#7D8A82" roughness={0.9} />
    </mesh>
    <mesh position={[0, 2.1, -1.98]}>
      <planeGeometry args={[3.6, 2.0]} />
      <meshBasicMaterial color="#F2B866" toneMapped={false} />
    </mesh>
    {[-1.3, -0.6, 0.2, 0.9, 1.5].map((x, i) => (
      <mesh key={x} position={[x, 1.3 + (i % 3) * 0.25, -1.96]}>
        <planeGeometry args={[0.45, 1.2 + (i % 3) * 0.5]} />
        <meshBasicMaterial color="#5A3A44" />
      </mesh>
    ))}
    <Block size={[3.8, 0.08, 0.08]} position={[0, 3.1, -1.95]} color="#2B2B2B" />
    <Block size={[0.08, 2.0, 0.08]} position={[0, 2.1, -1.95]} color="#2B2B2B" />
    {/* Schreibtisch */}
    <Block size={[2.4, 0.07, 1.1]} position={[0, 0.78, 0.2]} color="#6B4226" rough={0.45} />
    <Block size={[2.3, 0.72, 0.06]} position={[0, 0.39, 0.72]} color="#5A3720" rough={0.55} />
    {/* Schreibtischlampe */}
    <group position={[-0.85, 0.82, 0.0]}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.04, 24]} />
        <meshStandardMaterial color="#2E4A3A" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.05, 0.25, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.012, 0.012, 0.45, 12]} />
        <meshStandardMaterial color="#2E4A3A" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.15, 0.47, 0.05]} rotation={[0.4, 0, -0.9]}>
        <coneGeometry args={[0.11, 0.16, 24, 1, true]} />
        <meshStandardMaterial color="#2E4A3A" metalness={0.6} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
      <Glow position={[0.2, 0.42, 0.08]} color="#FFE2A8" size={0.5 + 0.02 * Math.sin(frame * 0.4)} core={0.02} />
      <pointLight position={[0.25, 0.35, 0.2]} intensity={3} distance={3} color="#FFE2A8" castShadow />
    </group>
    {/* Kaffeetasse + Aschenbecher */}
    <mesh position={[0.85, 0.87, 0.05]} castShadow>
      <cylinderGeometry args={[0.05, 0.045, 0.1, 20]} />
      <meshPhysicalMaterial color="#F4F1EA" roughness={0.2} clearcoat={1} />
    </mesh>
  </group>
);
