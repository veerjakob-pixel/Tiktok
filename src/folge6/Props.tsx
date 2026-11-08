// 3D-Requisiten für Folge 6 "Hat Coca-Cola den Weihnachtsmann erfunden?" – alles per Code gebaut.
// Dose und Flasche sind neutral ("COLA"), kein echtes Logo.
import React from "react";
import * as THREE from "three";
import { Block, F, lines, Sheet, useCanvasTexture, V3 } from "../folge4-3d/Kit";
import { Look, Person } from "../folge4b/People";

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

// ---------- Weihnachtsmann (dick, Bart, Mütze, Gürtel) ----------
export const Santa: React.FC<{ position?: V3; rotation?: V3; scale?: number; look?: Look; hand?: React.ReactNode; belly?: number }> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  look = {},
  hand,
  belly = 1,
}) => (
  <group position={position} rotation={rotation} scale={scale}>
    <Person shirt={RED} pants={RED} hair="#F2F2F2" hairStyle="short" skin="#F3C3A0" look={{ smile: 0.6, ...look }} hand={hand} />
    {/* Bauch + Gürtel */}
    <mesh position={[0, 0.98, 0.04]} scale={[1.15 * belly, 1, 1.0 * belly]} castShadow>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshPhysicalMaterial color={RED} roughness={0.8} sheen={0.6} />
    </mesh>
    <mesh position={[0, 0.9, 0.04]} rotation={[Math.PI / 2, 0, 0]} scale={[1.15 * belly, 1.0 * belly, 1]}>
      <torusGeometry args={[0.29, 0.04, 12, 48]} />
      <meshStandardMaterial color="#1B1B1B" roughness={0.4} />
    </mesh>
    <mesh position={[0, 0.9, 0.33 * belly + 0.04]}>
      <boxGeometry args={[0.12, 0.1, 0.03]} />
      <meshStandardMaterial color="#E9B44C" metalness={1} roughness={0.2} />
    </mesh>
    {/* weißer Saum */}
    <mesh position={[0, 0.68, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.23, 0.05, 12, 40]} />
      {white}
    </mesh>
    {/* Kopf: Bart, Schnurrbart, Mütze (drehen mit dem Kopf) */}
    <group position={[0, 1.62, 0]} rotation={[0, look.headTurn ?? 0, look.headTilt ?? 0]}>
      <mesh position={[0, -0.16, 0.08]} scale={[1, 1.15, 0.8]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        {white}
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.05, -0.065, 0.185]} rotation={[0, 0, s * 0.4]} scale={[1.4, 0.6, 0.6]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          {white}
        </mesh>
      ))}
      <SantaHat position={[0, 0.13, -0.01]} rotation={[0, 0, 0]} scale={0.5} />
    </group>
  </group>
);

// ---------- Bischof Nikolaus (roter Mantel, Mitra, Stab) ----------
export const Bishop: React.FC<{ position?: V3; rotation?: V3; scale?: number; look?: Look }> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, look = {} }) => (
  <group position={position} rotation={rotation} scale={scale}>
    <Person shirt="#A4161A" pants="#A4161A" hair="#DADADA" hairStyle="short" skin="#E8B996" look={look} />
    {/* langer Mantel bis zum Boden */}
    <mesh position={[0, 0.55, 0]} castShadow>
      <cylinderGeometry args={[0.24, 0.42, 1.1, 32]} />
      <meshPhysicalMaterial color="#A4161A" roughness={0.6} sheen={0.8} sheenColor="#ff6060" />
    </mesh>
    {/* goldene Borte */}
    <mesh position={[0, 0.55, 0.3]} rotation={[-0.15, 0, 0]}>
      <boxGeometry args={[0.1, 1.1, 0.02]} />
      <meshStandardMaterial color="#E9B44C" metalness={1} roughness={0.25} />
    </mesh>
    <group position={[0, 1.62, 0]} rotation={[0, look.headTurn ?? 0, 0]}>
      {/* Bart */}
      <mesh position={[0, -0.15, 0.08]} scale={[0.9, 1.25, 0.7]}>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshStandardMaterial color="#E6E6E6" roughness={1} />
      </mesh>
      {/* Mitra */}
      <mesh position={[0, 0.3, -0.01]} scale={[1, 1, 0.6]}>
        <coneGeometry args={[0.2, 0.5, 4]} />
        <meshStandardMaterial color="#F4EBD0" roughness={0.6} />
      </mesh>
    </group>
  </group>
);

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
