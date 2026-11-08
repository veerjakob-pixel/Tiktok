// 3D-Requisiten für Folge 7 "Wie Mundwasser-Werbung eine Krankheit erfand" – alles per Code gebaut.
// Flaschen tragen keine echten Logos (nur "MUNDWASSER" / "ANTISEPTIKUM").
import React from "react";
import * as THREE from "three";
import { Block, F, lines, Sheet, useCanvasTexture, V3 } from "../folge4-3d/Kit";
import { Glow } from "../folge6/Props";

// ---------- Mundwasser-Flasche (Glas mit bernsteinfarbener Flüssigkeit) ----------
const bottleGeo = (() => {
  const pts = [
    [0, -0.5],
    [0.26, -0.5],
    [0.3, -0.45],
    [0.3, 0.2],
    [0.24, 0.32],
    [0.11, 0.42],
    [0.1, 0.58],
    [0, 0.58],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(pts, 48);
})();
const liquidGeo = (() => {
  const pts = [
    [0, -0.47],
    [0.27, -0.47],
    [0.27, 0.15],
    [0, 0.15],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(pts, 48);
})();

export const useLabel = (title: string, sub: string, bg = "#F4EFE4", fg = "#1F5E3A") =>
  useCanvasTexture(
    1024,
    360,
    (ctx) => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 1024, 360);
      ctx.strokeStyle = fg;
      ctx.lineWidth = 10;
      [0, 512].forEach((x) => {
        ctx.strokeRect(x + 18, 18, 476, 324);
        ctx.fillStyle = fg;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `${title.length > 10 ? 64 : 84}px ${F.bold}`;
        ctx.fillText(title, x + 256, 150);
        ctx.font = `bold 36px ${F.sub}`;
        ctx.fillText(sub, x + 256, 260);
      });
    },
    [title, sub, bg, fg],
  );

export const MouthwashBottle: React.FC<{ label: THREE.Texture; position?: V3; rotation?: V3; scale?: number; liquid?: string; fill?: number }> = ({
  label,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  liquid = "#D9932B",
  fill = 1,
}) => (
  <group position={position} rotation={rotation} scale={scale}>
    <mesh geometry={bottleGeo} castShadow>
      <meshPhysicalMaterial color="#ffffff" roughness={0.05} transmission={0.9} thickness={0.3} transparent opacity={0.35} clearcoat={1} />
    </mesh>
    {fill > 0 && (
      <mesh geometry={liquidGeo} scale={[1, fill, 1]} position={[0, -0.47 * (1 - fill), 0]}>
        <meshPhysicalMaterial color={liquid} roughness={0.15} clearcoat={1} emissive={liquid} emissiveIntensity={0.25} />
      </mesh>
    )}
    <mesh position={[0, -0.12, 0]}>
      <cylinderGeometry args={[0.305, 0.305, 0.36, 48, 1, true]} />
      <meshStandardMaterial map={label} roughness={0.6} />
    </mesh>
    {/* Verschluss */}
    <mesh position={[0, 0.64, 0]} castShadow>
      <cylinderGeometry args={[0.12, 0.12, 0.13, 32]} />
      <meshPhysicalMaterial color="#1E1E1E" roughness={0.3} clearcoat={0.8} />
    </mesh>
  </group>
);

// ---------- Badezimmer: Fliesenwand, Glasregal, Zahnputzbecher ----------
const useTiles = () =>
  useCanvasTexture(
    512,
    512,
    (ctx) => {
      ctx.fillStyle = "#C9D6D9";
      ctx.fillRect(0, 0, 512, 512);
      for (let y = 0; y < 8; y++)
        for (let x = 0; x < 8; x++) {
          ctx.fillStyle = (x + y) % 2 ? "#E8F0F2" : "#DDE7EA";
          ctx.fillRect(x * 64 + 2, y * 64 + 2, 60, 60);
        }
    },
    [],
  );

export const Bathroom: React.FC = () => {
  const tiles = useTiles();
  tiles.wrapS = tiles.wrapT = THREE.RepeatWrapping;
  tiles.repeat.set(4, 3);
  return (
    <group>
      <mesh position={[0, 1.5, -0.6]} receiveShadow>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial map={tiles} roughness={0.35} />
      </mesh>
      {/* Glasregal */}
      <mesh position={[0, 0.0, -0.2]} receiveShadow>
        <boxGeometry args={[2.6, 0.04, 0.8]} />
        <meshPhysicalMaterial color="#DDF1F5" roughness={0.05} transmission={0.6} transparent opacity={0.6} />
      </mesh>
      {/* Zahnputzbecher mit Zahnbürsten */}
      <group position={[-0.8, 0.2, -0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.13, 0.11, 0.36, 32]} />
          <meshPhysicalMaterial color="#F6F6F6" roughness={0.2} clearcoat={1} />
        </mesh>
        {[-0.04, 0.05].map((x, i) => (
          <mesh key={x} position={[x, 0.3, 0]} rotation={[0, 0, x * 3]}>
            <capsuleGeometry args={[0.018, 0.42, 6, 10]} />
            <meshStandardMaterial color={["#3A86FF", "#FF5D73"][i]} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// ---------- Labor 1879: Regal mit Flaschen, Glaskolben, Öllampe ----------
const flaskGeo = (() => {
  const pts = [
    [0, 0],
    [0.16, 0.01],
    [0.2, 0.08],
    [0.18, 0.2],
    [0.06, 0.32],
    [0.05, 0.48],
    [0, 0.48],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(pts, 32);
})();

export const Flask: React.FC<{ position: V3; color: string; scale?: number; glow?: number }> = ({ position, color, scale = 1, glow = 0.6 }) => (
  <group position={position} scale={scale}>
    <mesh geometry={flaskGeo} castShadow>
      <meshPhysicalMaterial color="#ffffff" roughness={0.05} transmission={0.9} transparent opacity={0.3} />
    </mesh>
    <mesh position={[0, 0.09, 0]}>
      <sphereGeometry args={[0.15, 24, 16, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={glow} transparent opacity={0.85} toneMapped={false} />
    </mesh>
  </group>
);

export const Lab: React.FC<{ frame: number }> = ({ frame }) => {
  const flick = 1 + Math.sin(frame * 0.7) * 0.05;
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#4A3524" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3, -1.8]} receiveShadow>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial color="#6B5236" roughness={0.95} />
      </mesh>
      {/* Regal mit Apothekerflaschen */}
      {[1.2, 1.8, 2.4].map((y, r) => (
        <group key={y} position={[0, y, -1.55]}>
          <Block size={[4, 0.06, 0.4]} color="#5A3A22" rough={0.7} />
          {Array.from({ length: 12 }).map((_, i) => (
            <mesh key={i} position={[-1.8 + i * 0.33, 0.16, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.09, 0.26 + ((i + r) % 3) * 0.05, 16]} />
              <meshPhysicalMaterial color={["#5B3A1A", "#2D4F3A", "#3A4A6B", "#7A5A2A"][(i + r) % 4]} roughness={0.15} clearcoat={1} transparent opacity={0.85} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Tisch */}
      <Block size={[3.2, 0.08, 1.2]} position={[0, 0.9, 0]} color="#5A3A22" rough={0.55} />
      <Block size={[3.2, 0.86, 1.1]} position={[0, 0.45, -0.02]} color="#4A2E1A" rough={0.7} />
      <Flask position={[-1.0, 0.94, 0.1]} color="#4CC38A" scale={1.1} />
      <Flask position={[-0.55, 0.94, -0.2]} color="#D9932B" />
      <Flask position={[1.15, 0.94, 0.0]} color="#5BA8E8" scale={0.9} />
      {/* Öllampe */}
      <group position={[1.25, 0.94, -0.35]}>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.11, 0.14, 0.16, 24]} />
          <meshStandardMaterial color="#B08D57" metalness={0.9} roughness={0.3} />
        </mesh>
        <Glow position={[0, 0.3, 0]} color="#FFB347" size={0.9 * flick} core={0.035} />
        <pointLight position={[0, 0.32, 0]} intensity={5 * flick} distance={5} decay={1.5} color="#FFB45C" castShadow />
      </group>
    </group>
  );
};

// ---------- Wörterbuch (aufgeschlagen) ----------
export const useDictPage = (side: "left" | "right") =>
  useCanvasTexture(
    600,
    800,
    (ctx) => {
      ctx.fillStyle = "#F1E6C8";
      ctx.fillRect(0, 0, 600, 800);
      ctx.fillStyle = "#3A2A16";
      ctx.textAlign = "left";
      if (side === "left") {
        ctx.font = `bold 34px ${F.vintage}`;
        ctx.fillText("Hackbrett", 50, 80);
        lines(ctx, 50, 110, 500, 6, 22, "#8C7A5A", 8);
        ctx.fillText("Hagel", 50, 290);
        lines(ctx, 50, 320, 500, 5, 22, "#8C7A5A", 8);
        ctx.fillText("Halbmond", 50, 470);
        lines(ctx, 50, 500, 500, 8, 22, "#8C7A5A", 8);
      } else {
        ctx.fillStyle = "rgba(255,214,102,0.55)";
        ctx.fillRect(30, 40, 540, 190);
        ctx.fillStyle = "#3A2A16";
        ctx.font = `bold 52px ${F.vintage}`;
        ctx.fillText("Halitosis", 50, 110);
        ctx.font = `30px ${F.vintage}`;
        ctx.fillText("(lat. halitus = Atem)", 50, 160);
        ctx.fillText("übler Mundgeruch", 50, 205);
        lines(ctx, 50, 270, 500, 7, 22, "#8C7A5A", 8);
        ctx.font = `bold 34px ${F.vintage}`;
        ctx.fillText("Halle", 50, 480);
        lines(ctx, 50, 510, 500, 8, 22, "#8C7A5A", 8);
      }
    },
    [side],
  );

export const Book: React.FC<{ open: number; position?: V3; rotation?: V3 }> = ({ open, position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const left = useDictPage("left");
  const right = useDictPage("right");
  return (
    <group position={position} rotation={rotation}>
      {/* rechte Seite liegt flach */}
      <group>
        <Block size={[0.92, 0.06, 1.24]} position={[0.47, 0.0, 0]} color="#5A1E1E" rough={0.6} />
        <mesh position={[0.47, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.86, 1.18]} />
          <meshStandardMaterial map={right} roughness={0.9} />
        </mesh>
      </group>
      {/* linke Seite klappt am Buchrücken auf (open 0 = zu, 1 = flach offen) */}
      <group rotation={[0, 0, -(1 - open) * Math.PI * 0.98]}>
        <Block size={[0.92, 0.06, 1.24]} position={[-0.47, 0.0, 0]} color="#5A1E1E" rough={0.6} />
        <mesh position={[-0.47, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.86, 1.18]} />
          <meshStandardMaterial map={left} roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
};

// ---------- Hochzeit: Blumenbogen, Schleier, Brautstrauß ----------
export const FlowerArch: React.FC = () => (
  <group position={[0, 0, -1.2]}>
    <mesh position={[0, 0.0, 0]} rotation={[0, 0, 0]}>
      <torusGeometry args={[1.5, 0.06, 12, 48, Math.PI]} />
      <meshStandardMaterial color="#F4EFE4" roughness={0.6} />
    </mesh>
    {Array.from({ length: 30 }).map((_, i) => {
      const t = (i / 29) * Math.PI;
      return (
        <mesh key={i} position={[Math.cos(t) * 1.5, Math.sin(t) * 1.5, 0.05]}>
          <sphereGeometry args={[0.09 + (i % 3) * 0.02, 12, 10]} />
          <meshStandardMaterial color={["#F7C6D0", "#FFFFFF", "#E8A0B4"][i % 3]} roughness={0.8} />
        </mesh>
      );
    })}
  </group>
);

export const Veil: React.FC = () => (
  <group position={[0, 0.06, -0.04]}>
    <mesh position={[0, -0.22, -0.06]} rotation={[0.15, 0, 0]}>
      <coneGeometry args={[0.32, 0.75, 32, 1, true]} />
      <meshPhysicalMaterial color="#ffffff" transparent opacity={0.45} roughness={0.9} side={THREE.DoubleSide} />
    </mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.13, 0.025, 10, 28]} />
      <meshStandardMaterial color="#F7C6D0" roughness={0.7} />
    </mesh>
  </group>
);

export const Bouquet: React.FC = () => (
  <group rotation={[Math.PI / 2, 0, 0]}>
    <mesh position={[0, 0.06, 0]}>
      <cylinderGeometry args={[0.02, 0.03, 0.14, 10]} />
      <meshStandardMaterial color="#3E7A3A" />
    </mesh>
    {Array.from({ length: 9 }).map((_, i) => (
      <mesh key={i} position={[Math.cos(i * 0.7) * 0.06 * (i % 3), 0.16 + (i % 2) * 0.02, Math.sin(i * 0.7) * 0.06 * (i % 3)]}>
        <sphereGeometry args={[0.04, 12, 10]} />
        <meshStandardMaterial color={["#F7C6D0", "#FFFFFF", "#E8A0B4"][i % 3]} roughness={0.8} />
      </mesh>
    ))}
  </group>
);

// ---------- grüne "Atem"-Wolke (übertrieben wie in der Werbung) ----------
export const BreathCloud: React.FC<{ frame: number; start: number; position: V3 }> = ({ frame, start, position }) => {
  const t = frame - start;
  if (t < 0) return null;
  return (
    <group position={position}>
      {Array.from({ length: 7 }).map((_, i) => {
        const p = Math.min(1, (t - i * 3) / 30);
        if (p <= 0) return null;
        return (
          <mesh key={i} position={[Math.sin(i * 1.7) * 0.08 + p * 0.25, p * 0.25 + i * 0.02, p * 0.35]} scale={0.04 + p * 0.12}>
            <sphereGeometry args={[1, 16, 12]} />
            <meshStandardMaterial color="#7BC96F" transparent opacity={0.55 * (1 - p * 0.5)} roughness={1} emissive="#4C8C3A" emissiveIntensity={0.3} />
          </mesh>
        );
      })}
    </group>
  );
};

// ---------- Werbeplakat "Halitosis?" (1920er-Stil) ----------
export const useFearPoster = (variant: number) =>
  useCanvasTexture(
    500,
    700,
    (ctx) => {
      ctx.fillStyle = ["#F1E6C8", "#1F5E3A", "#F4EFE4"][variant % 3];
      ctx.fillRect(0, 0, 500, 700);
      const fg = variant % 3 === 1 ? "#F1E6C8" : "#1F5E3A";
      ctx.fillStyle = fg;
      ctx.textAlign = "center";
      ctx.font = `66px ${F.bold}`;
      ctx.fillText(["HALITOSIS?", "SIE MERKEN", "NIE DIE"][variant % 3], 250, 110);
      ctx.font = `66px ${F.bold}`;
      ctx.fillText(["", "ES NICHT.", "BRAUT?"][variant % 3], 250, 190);
      // Gesicht mit Hand vor dem Mund
      ctx.beginPath();
      ctx.arc(250, 380, 110, 0, Math.PI * 2);
      ctx.fillStyle = "#E9BC9A";
      ctx.fill();
      ctx.fillStyle = "#3A2A16";
      [-38, 38].forEach((dx) => {
        ctx.beginPath();
        ctx.arc(250 + dx, 355, 10, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillStyle = "#E9BC9A";
      ctx.strokeStyle = "#B88A6A";
      ctx.lineWidth = 6;
      ctx.fillRect(190, 400, 120, 60);
      ctx.strokeRect(190, 400, 120, 60);
      ctx.fillStyle = fg;
      ctx.font = `bold 40px ${F.sub}`;
      ctx.fillText("MUNDWASSER", 250, 620);
    },
    [variant],
  );

export const PosterBoard: React.FC<{ posters: THREE.Texture[]; position?: V3 }> = ({ posters, position = [0, 1.6, -1.6] }) => (
  <group position={position}>
    {posters.map((p, i) => (
      <Sheet key={i} tex={p} size={[1.1, 1.55]} position={[-1.25 + i * 1.25, 0, 0]} rotation={[0, 0, (i - 1) * 0.04]} />
    ))}
  </group>
);
