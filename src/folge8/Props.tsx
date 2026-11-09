// 3D-Requisiten für Folge 8 "Die Kaffeepause ist Werbung" – alles per Code gebaut, keine echten Logos.
import React from "react";
import * as THREE from "three";
import { Block, F, Sheet, useCanvasTexture, V3 } from "../folge4-3d/Kit";
import { Glow, useAsphalt, useWindows } from "../folge6/Props";

// ---------- Kaffeetasse mit Untertasse ----------
const cupGeo = (() => {
  const pts = [
    [0, 0],
    [0.17, 0],
    [0.2, 0.03],
    [0.25, 0.2],
    [0.27, 0.32],
    [0.255, 0.32],
    [0.235, 0.2],
    [0, 0.2],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(pts, 48);
})();

export const CoffeeCup: React.FC<{ position?: V3; rotation?: V3; scale?: number; color?: string; fill?: number }> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = "#F4F1EA",
  fill = 1,
}) => (
  <group position={position} rotation={rotation} scale={scale}>
    {/* Untertasse */}
    <mesh position={[0, 0.012, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.38, 0.3, 0.025, 48]} />
      <meshPhysicalMaterial color={color} roughness={0.15} clearcoat={1} />
    </mesh>
    <mesh geometry={cupGeo} position={[0, 0.025, 0]} castShadow>
      <meshPhysicalMaterial color={color} roughness={0.12} clearcoat={1} side={THREE.DoubleSide} />
    </mesh>
    {/* Kaffee */}
    {fill > 0 && (
      <mesh position={[0, 0.025 + 0.2 + fill * 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.235 + fill * 0.02, 40]} />
        <meshPhysicalMaterial color="#3B1F0E" roughness={0.1} clearcoat={1} />
      </mesh>
    )}
    {/* Henkel */}
    <mesh position={[0.29, 0.2, 0]} rotation={[0, 0, -0.2]} castShadow>
      <torusGeometry args={[0.07, 0.022, 12, 24, Math.PI * 1.3]} />
      <meshPhysicalMaterial color={color} roughness={0.15} clearcoat={1} />
    </mesh>
  </group>
);

// Dampf: weiche, aufsteigende Wölkchen (feste Werte, kein Zufall)
export const Steam: React.FC<{ frame: number; position: V3; scale?: number; strength?: number }> = ({ frame, position, scale = 1, strength = 1 }) => (
  <group position={position} scale={scale}>
    {Array.from({ length: 14 }).map((_, i) => {
      const t = (frame * 0.01 + i / 14) % 1;
      const x = Math.sin(t * 6 + i * 0.7) * 0.07 * (1 + t);
      const size = (0.18 + t * 0.4) * Math.sin(t * Math.PI) * strength;
      return <Glow key={i} position={[x, t * 0.9, Math.cos(t * 5 + i) * 0.03]} color="#9A9A9A" size={size} core={0.0001} />;
    })}
  </group>
);

// ---------- Kaffeekanne aus Blech (1900er) ----------
export const CoffeePot: React.FC<{ position?: V3; rotation?: V3; scale?: number }> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => {
  const metal = <meshStandardMaterial color="#B9BEC4" metalness={0.85} roughness={0.3} />;
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.17, 0.44, 32]} />
        {metal}
      </mesh>
      <mesh position={[0, 0.47, 0]} castShadow>
        <coneGeometry args={[0.13, 0.08, 32]} />
        {metal}
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <sphereGeometry args={[0.025, 12, 10]} />
        <meshStandardMaterial color="#2B2B2B" />
      </mesh>
      {/* Tülle */}
      <mesh position={[0.18, 0.3, 0]} rotation={[0, 0, -0.9]} castShadow>
        <cylinderGeometry args={[0.018, 0.035, 0.22, 16]} />
        {metal}
      </mesh>
      {/* Griff */}
      <mesh position={[-0.17, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.09, 0.016, 10, 20, Math.PI]} />
        <meshStandardMaterial color="#2B1D0E" roughness={0.6} />
      </mesh>
    </group>
  );
};

// ---------- Kaffeebohne ----------
export const Bean: React.FC<{ position: V3; rotation?: V3; scale?: number }> = ({ position, rotation = [0, 0, 0], scale = 1 }) => (
  <group position={position} rotation={rotation} scale={scale}>
    <mesh scale={[1, 0.62, 0.72]} castShadow>
      <sphereGeometry args={[0.05, 20, 14]} />
      <meshPhysicalMaterial color="#5A3018" roughness={0.35} clearcoat={0.6} />
    </mesh>
    <mesh position={[0, 0, 0.034]} scale={[1, 0.08, 0.1]}>
      <sphereGeometry args={[0.046, 14, 8]} />
      <meshStandardMaterial color="#2A140A" />
    </mesh>
  </group>
);

// ---------- Kaffeesack aus Jute ----------
export const useSackLabel = (text: string) =>
  useCanvasTexture(
    512,
    512,
    (ctx) => {
      ctx.fillStyle = "#C8A878";
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = "rgba(90,60,30,0.25)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 512; i += 8) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 512);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();
      }
      ctx.fillStyle = "#5A3018";
      ctx.textAlign = "center";
      ctx.font = `${text.length > 8 ? 64 : 84}px ${F.bold}`;
      ctx.fillText(text, 256, 250);
      ctx.font = `bold 34px ${F.sub}`;
      ctx.fillText("CAFÉ · 60 KG", 256, 320);
    },
    [text],
  );

export const CoffeeSack: React.FC<{ label: THREE.Texture; position?: V3; rotation?: V3; scale?: number }> = ({ label, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => (
  <group position={position} rotation={rotation} scale={scale}>
    <mesh position={[0, 0.35, 0]} scale={[1, 1.15, 0.7]} castShadow receiveShadow>
      <sphereGeometry args={[0.32, 32, 24]} />
      <meshPhysicalMaterial map={label} roughness={0.95} sheen={0.6} sheenColor="#E8D2A8" />
    </mesh>
    <mesh position={[0, 0.74, 0]} castShadow>
      <cylinderGeometry args={[0.05, 0.12, 0.12, 16]} />
      <meshStandardMaterial color="#B8966A" roughness={1} />
    </mesh>
  </group>
);

// ---------- Fabrikhalle um 1900: Backsteinwand, hohe Fenster, Maschinen, Riemen ----------
const useBrick = () =>
  useCanvasTexture(
    512,
    512,
    (ctx) => {
      ctx.fillStyle = "#5A3A2A";
      ctx.fillRect(0, 0, 512, 512);
      for (let y = 0; y < 16; y++)
        for (let x = 0; x < 9; x++) {
          const v = 120 + ((x * 37 + y * 53) % 30);
          ctx.fillStyle = `rgb(${v},${Math.round(v * 0.55)},${Math.round(v * 0.4)})`;
          ctx.fillRect(x * 64 + (y % 2) * 32 - 32 + 3, y * 32 + 3, 58, 26);
        }
    },
    [],
  );

const Machine: React.FC<{ position: V3; frame: number; k: number }> = ({ position, frame, k }) => (
  <group position={position}>
    <Block size={[1.0, 0.9, 0.7]} position={[0, 0.45, 0]} color="#3A4048" rough={0.5} metal={0.6} />
    <mesh position={[0.3, 1.05, 0]} rotation={[Math.PI / 2, 0, frame * 0.2 + k]} castShadow>
      <cylinderGeometry args={[0.25, 0.25, 0.08, 24]} />
      <meshStandardMaterial color="#6A6E74" metalness={0.8} roughness={0.35} />
    </mesh>
    {/* Riemen zur Decke */}
    <mesh position={[0.3, 2.3, 0]}>
      <boxGeometry args={[0.04, 2.5, 0.02]} />
      <meshStandardMaterial color="#2B1D0E" />
    </mesh>
    <mesh position={[-0.25, 0.95, 0.2]} rotation={[0, 0, Math.sin(frame * 0.4 + k) * 0.4]}>
      <boxGeometry args={[0.05, 0.3, 0.05]} />
      <meshStandardMaterial color="#8A8E94" metalness={0.8} roughness={0.3} />
    </mesh>
  </group>
);

export const Factory: React.FC<{ frame: number }> = ({ frame }) => {
  const brick = useBrick();
  brick.wrapS = brick.wrapT = THREE.RepeatWrapping;
  brick.repeat.set(6, 3);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#4A4038" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3, -3]} receiveShadow>
        <planeGeometry args={[30, 6]} />
        <meshStandardMaterial map={brick} roughness={0.95} />
      </mesh>
      {/* hohe Fenster mit Licht */}
      {[-3, -1, 1, 3].map((x) => (
        <group key={x} position={[x, 2.9, -2.98]}>
          <mesh>
            <planeGeometry args={[1.1, 2.0]} />
            <meshBasicMaterial color="#FFE7B8" toneMapped={false} />
          </mesh>
          <Block size={[1.15, 0.05, 0.04]} position={[0, 0, 0.02]} color="#2B2420" />
          <Block size={[0.05, 2.0, 0.04]} position={[0, 0, 0.02]} color="#2B2420" />
        </group>
      ))}
      {/* Lichtstrahlen */}
      {[-3, -1, 1, 3].map((x) => (
        <mesh key={`r${x}`} position={[x + 0.3, 1.6, -1.6]} rotation={[0.5, 0, 0.12]}>
          <planeGeometry args={[0.9, 3.4]} />
          <meshBasicMaterial color="#FFE2A8" transparent opacity={0.07} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {[-2.2, 0.2, 2.6].map((x, i) => (
        <Machine key={x} position={[x, 0, -1.6]} frame={frame} k={i} />
      ))}
    </group>
  );
};

// ---------- Büro der 1950er: Schreibtische, Wanduhr, Fenster ----------
export const WallClock: React.FC<{ position: V3; minutes: number; scale?: number }> = ({ position, minutes, scale = 1 }) => {
  const mA = (minutes / 60) * Math.PI * 2;
  const hA = (minutes / 720) * Math.PI * 2;
  return (
    <group position={position} scale={scale}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.05, 48]} />
        <meshStandardMaterial color="#2B2B2B" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.027]}>
        <circleGeometry args={[0.33, 48]} />
        <meshStandardMaterial color="#F7F3EA" roughness={0.6} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[Math.sin((i / 12) * Math.PI * 2) * 0.28, Math.cos((i / 12) * Math.PI * 2) * 0.28, 0.03]}>
          <boxGeometry args={[0.02, 0.05, 0.005]} />
          <meshStandardMaterial color="#2B2B2B" />
        </mesh>
      ))}
      <group position={[0, 0, 0.035]} rotation={[0, 0, -hA]}>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.03, 0.17, 0.01]} />
          <meshStandardMaterial color="#1A1A1A" />
        </mesh>
      </group>
      <group position={[0, 0, 0.04]} rotation={[0, 0, -mA]}>
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[0.02, 0.25, 0.01]} />
          <meshStandardMaterial color="#C1121F" />
        </mesh>
      </group>
    </group>
  );
};

export const OfficeDesk: React.FC<{ position: V3; rotation?: V3 }> = ({ position, rotation = [0, 0, 0] }) => (
  <group position={position} rotation={rotation}>
    <Block size={[1.2, 0.05, 0.7]} position={[0, 0.75, 0]} color="#7A5234" rough={0.45} />
    <Block size={[0.35, 0.72, 0.65]} position={[0.4, 0.36, 0]} color="#6B4630" rough={0.55} />
    {[-0.55].map((x) => (
      <Block key={x} size={[0.05, 0.72, 0.05]} position={[x, 0.36, 0.3]} color="#3A2A1A" />
    ))}
    {/* Schreibmaschine */}
    <Block size={[0.4, 0.12, 0.3]} position={[-0.1, 0.84, 0]} color="#2B3A33" rough={0.4} metal={0.4} />
    <Block size={[0.3, 0.2, 0.01]} position={[-0.1, 0.98, -0.12]} color="#F4F1EA" />
  </group>
);

export const OfficeRoom: React.FC<{ frame: number }> = ({ frame }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#6E6458" roughness={0.6} />
    </mesh>
    <mesh position={[0, 3, -3]} receiveShadow>
      <planeGeometry args={[30, 6]} />
      <meshStandardMaterial color="#8FA39A" roughness={0.9} />
    </mesh>
    {/* Fenster mit Hochhäusern */}
    {[-3.2, 3.2].map((x) => (
      <group key={x} position={[x, 2.1, -2.98]}>
        <mesh>
          <planeGeometry args={[1.8, 1.6]} />
          <meshBasicMaterial color="#BFD7EA" toneMapped={false} />
        </mesh>
        {[-0.5, 0, 0.5].map((bx, i) => (
          <mesh key={bx} position={[bx, -0.3 + (i % 2) * 0.15, 0.01]}>
            <planeGeometry args={[0.35, 1.0 + (i % 2) * 0.3]} />
            <meshBasicMaterial color="#7D8FA3" />
          </mesh>
        ))}
      </group>
    ))}
    {/* Deckenlampen */}
    {[-2, 0, 2].map((x) => (
      <group key={x} position={[x, 3.4, -0.5]}>
        <Glow position={[0, 0, 0]} color="#FFF4D6" size={0.9 + 0.02 * Math.sin(frame * 0.3 + x)} core={0.08} />
        <pointLight intensity={3} distance={6} color="#FFF4D6" />
      </group>
    ))}
  </group>
);

// ---------- Radio (1950er) mit Schallwellen ----------
export const Radio: React.FC<{ position?: V3; rotation?: V3; scale?: number; frame: number; on?: number }> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, frame, on = 1 }) => (
  <group position={position} rotation={rotation} scale={scale}>
    <mesh position={[0, 0.3, 0]} castShadow>
      <boxGeometry args={[0.9, 0.6, 0.35]} />
      <meshPhysicalMaterial color="#8B3A2E" roughness={0.35} clearcoat={0.8} />
    </mesh>
    {/* Lautsprecher-Stoff */}
    <mesh position={[-0.18, 0.3, 0.178]}>
      <circleGeometry args={[0.2, 32]} />
      <meshStandardMaterial color="#E8D8B8" roughness={1} />
    </mesh>
    {/* Skala */}
    <mesh position={[0.25, 0.38, 0.178]}>
      <planeGeometry args={[0.28, 0.12]} />
      <meshBasicMaterial color="#FFD27A" toneMapped={false} />
    </mesh>
    {[0.17, 0.33].map((x) => (
      <mesh key={x} position={[x, 0.2, 0.19]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.04, 20]} />
        <meshStandardMaterial color="#2B1D0E" />
      </mesh>
    ))}
    {/* Schallwellen */}
    {on > 0 &&
      [0, 1, 2].map((i) => {
        const t = (frame * 0.04 + i / 3) % 1;
        return (
          <mesh key={i} position={[-0.18, 0.3, 0.2 + t * 0.4]} scale={0.25 + t * 0.7}>
            <torusGeometry args={[0.3, 0.012, 8, 40]} />
            <meshBasicMaterial color="#FFD27A" transparent opacity={(1 - t) * 0.8 * on} toneMapped={false} />
          </mesh>
        );
      })}
  </group>
);

// ---------- Plakate/Zeitung (gezeichnet) ----------
const drawCup = (ctx: CanvasRenderingContext2D, x: number, y: number, s: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = "#F4F1EA";
  ctx.beginPath();
  ctx.ellipse(0, 70, 130, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-90, -40);
  ctx.lineTo(90, -40);
  ctx.quadraticCurveTo(85, 60, 0, 62);
  ctx.quadraticCurveTo(-85, 60, -90, -40);
  ctx.fill();
  ctx.lineWidth = 16;
  ctx.strokeStyle = "#F4F1EA";
  ctx.beginPath();
  ctx.arc(95, 0, 30, -1.2, 1.2);
  ctx.stroke();
  ctx.fillStyle = "#4A2510";
  ctx.beginPath();
  ctx.ellipse(0, -40, 90, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.lineWidth = 8;
  [-30, 0, 30].forEach((dx, i) => {
    ctx.beginPath();
    ctx.moveTo(dx, -60);
    ctx.bezierCurveTo(dx + 25, -95, dx - 25, -120, dx + (i - 1) * 6, -160);
    ctx.stroke();
  });
  ctx.restore();
};

export const usePoster = (progress = 1) =>
  useCanvasTexture(
    600,
    840,
    (ctx) => {
      ctx.fillStyle = "#F4EEE0";
      ctx.fillRect(0, 0, 600, 840);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, 600, progress * 840);
      ctx.clip();
      const g = ctx.createLinearGradient(0, 0, 0, 840);
      g.addColorStop(0, "#E9573F");
      g.addColorStop(1, "#8E2A1E");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 600, 840);
      ctx.fillStyle = "#FFF4D6";
      ctx.textAlign = "center";
      ctx.font = `bold 40px ${F.sub}`;
      ctx.fillText("GÖNN DIR EINE", 300, 110);
      ctx.font = `92px ${F.bold}`;
      ctx.fillText("KAFFEE-", 300, 210);
      ctx.fillText("PAUSE!", 300, 305);
      drawCup(ctx, 300, 560, 1.3);
      ctx.font = `bold 30px ${F.sub}`;
      ctx.fillText("… und hol dir, was Kaffee dir gibt", 300, 790);
      ctx.restore();
    },
    [Math.round(progress * 40)],
  );

export const useNewspaper = () =>
  useCanvasTexture(
    600,
    800,
    (ctx) => {
      ctx.fillStyle = "#EDE6D6";
      ctx.fillRect(0, 0, 600, 800);
      ctx.fillStyle = "#1A1A1A";
      ctx.textAlign = "center";
      ctx.font = `64px ${F.vintage}`;
      ctx.fillText("Die Morgenzeitung", 300, 80);
      ctx.fillRect(30, 100, 540, 4);
      ctx.font = `64px ${F.bold}`;
      ctx.fillText("ZEIT FÜR DIE", 300, 190);
      ctx.fillText("KAFFEEPAUSE!", 300, 260);
      drawCup(ctx, 160, 470, 0.9);
      for (let i = 0; i < 14; i++) ctx.fillRect(320, 360 + i * 26, 240, 8);
      for (let i = 0; i < 8; i++) ctx.fillRect(40, 610 + i * 22, 520, 8);
    },
    [],
  );

// Preis-Kurve, die von links nach rechts gezeichnet wird
export const usePriceChart = (progress: number) =>
  useCanvasTexture(
    800,
    600,
    (ctx) => {
      ctx.fillStyle = "#F4EEE0";
      ctx.fillRect(0, 0, 800, 600);
      ctx.strokeStyle = "#C9BBA0";
      ctx.lineWidth = 2;
      for (let i = 1; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(60, i * 95);
        ctx.lineTo(760, i * 95);
        ctx.stroke();
      }
      ctx.strokeStyle = "#2B1D0E";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(60, 40);
      ctx.lineTo(60, 540);
      ctx.lineTo(760, 540);
      ctx.stroke();
      const pts = [
        [60, 470],
        [180, 455],
        [300, 440],
        [400, 400],
        [480, 330],
        [560, 230],
        [640, 140],
        [740, 70],
      ];
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, 60 + progress * 700, 600);
      ctx.clip();
      ctx.strokeStyle = "#D62828";
      ctx.lineWidth = 14;
      ctx.lineJoin = "round";
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = "#2B1D0E";
      ctx.font = `bold 34px ${F.sub}`;
      ctx.textAlign = "left";
      ctx.fillText("Kaffeepreis", 80, 80);
      ctx.textAlign = "center";
      ctx.fillText("1945", 120, 585);
      ctx.fillText("1950", 700, 585);
    },
    [Math.round(progress * 40)],
  );

// ---------- Abendstraße mit Plakatwand und Café-Leuchten ----------
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
      {/* Café-Leuchtschrift */}
      <Glow position={[-2.6, 3.2, -1.85]} color="#FFB347" size={0.9 + 0.1 * Math.sin(frame * 0.3)} core={0.05} />
      <Glow position={[2.6, 3.0, -1.85]} color="#FF8A6B" size={0.8 + 0.1 * Math.cos(frame * 0.27)} core={0.05} />
    </group>
  );
};
