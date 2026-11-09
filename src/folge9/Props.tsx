// 3D-Requisiten für Folge 9 "Black Friday – die erfundene Geschichte" – alles per Code gebaut, keine echten Logos.
import React from "react";
import * as THREE from "three";
import { Block, F, Sheet, useCanvasTexture, V3 } from "../folge4-3d/Kit";
import { Glow, useAsphalt, useWindows } from "../folge6/Props";

// ---------- Polizeimütze (sitzt auf dem Kopf von Human, über headExtra) ----------
export const PoliceCap: React.FC = () => (
  <group position={[0, 0.1, 0.0]} rotation={[-0.08, 0, 0]}>
    <mesh castShadow>
      <cylinderGeometry args={[0.15, 0.13, 0.08, 32]} />
      <meshPhysicalMaterial color="#1B2A4A" roughness={0.6} sheen={0.5} />
    </mesh>
    <mesh position={[0, 0.05, 0]} scale={[1, 0.25, 1]} castShadow>
      <sphereGeometry args={[0.165, 32, 16]} />
      <meshPhysicalMaterial color="#1B2A4A" roughness={0.6} sheen={0.5} />
    </mesh>
    {/* Schirm */}
    <mesh position={[0, -0.035, 0.1]} rotation={[0.25, 0, 0]} scale={[1, 0.12, 0.7]}>
      <cylinderGeometry args={[0.12, 0.12, 0.08, 24, 1, false, -Math.PI / 2, Math.PI]} />
      <meshPhysicalMaterial color="#0B0F18" roughness={0.15} clearcoat={1} />
    </mesh>
    {/* Abzeichen */}
    <mesh position={[0, 0.02, 0.152]}>
      <circleGeometry args={[0.025, 16]} />
      <meshStandardMaterial color="#F2C14E" metalness={0.9} roughness={0.25} />
    </mesh>
  </group>
);

// Trillerpfeife / Handschuh-Hand: weißer Handschuh in der Hand des Polizisten
export const Whistle: React.FC = () => (
  <mesh position={[0, -0.03, 0.04]} rotation={[0, 0, Math.PI / 2]}>
    <cylinderGeometry args={[0.018, 0.018, 0.07, 12]} />
    <meshStandardMaterial color="#C0C4CC" metalness={0.9} roughness={0.2} />
  </mesh>
);

// ---------- Auto im Stil der 1950er (rundliche Kanten, Chrom, Scheinwerfer) ----------
export const Car: React.FC<{ position?: V3; rotation?: V3; color: string; frame: number; lights?: number; honk?: number; scale?: number }> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color,
  frame,
  lights = 1,
  honk = 0,
  scale = 1,
}) => {
  const bounce = Math.sin(frame * 0.9 + position[0] * 3) * 0.006 + honk * Math.sin(frame * 2.2) * 0.012;
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group position={[0, bounce, 0]}>
        {/* Karosserie: liegende Kapsel, breit gezogen */}
        <mesh position={[0, 0.42, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 1.6]} castShadow receiveShadow>
          <capsuleGeometry args={[0.24, 1.6, 8, 24]} />
          <meshPhysicalMaterial color={color} roughness={0.22} metalness={0.4} clearcoat={1} clearcoatRoughness={0.1} />
        </mesh>
        {/* Kabine mit Fenstern */}
        <mesh position={[-0.1, 0.78, 0]} scale={[1, 0.55, 0.6]} castShadow>
          <sphereGeometry args={[0.6, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial color="#1A2230" roughness={0.05} metalness={0.3} clearcoat={1} />
        </mesh>
        <mesh position={[-0.1, 0.78, 0]} scale={[1.01, 0.12, 0.61]}>
          <cylinderGeometry args={[0.6, 0.6, 0.12, 32]} />
          <meshPhysicalMaterial color={color} roughness={0.22} metalness={0.4} clearcoat={1} />
        </mesh>
        {/* Chrom-Stoßstangen */}
        {[1, -1].map((s) => (
          <mesh key={s} position={[s * 1.0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <capsuleGeometry args={[0.04, 0.7, 6, 12]} />
            <meshStandardMaterial color="#E6E8EC" metalness={1} roughness={0.12} />
          </mesh>
        ))}
        {/* Scheinwerfer vorne (+x), Rücklichter hinten (-x) */}
        {[-0.28, 0.28].map((z) => (
          <group key={z}>
            <Glow position={[1.02, 0.45, z]} color="#FFF2C8" size={0.35 * lights} core={0.03} />
            <Glow position={[-1.02, 0.45, z]} color="#FF2A2A" size={0.3 * lights} core={0.025} />
          </group>
        ))}
      </group>
      {/* Räder */}
      {[
        [0.6, 0.38],
        [0.6, -0.38],
        [-0.6, 0.38],
        [-0.6, -0.38],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0.17, z]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.17, 0.17, 0.12, 24]} />
            <meshStandardMaterial color="#111" roughness={0.8} />
          </mesh>
          <mesh position={[0, z > 0 ? 0.062 : -0.062, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.01, 20]} />
            <meshStandardMaterial color="#E6E8EC" metalness={1} roughness={0.15} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ---------- Ampel ----------
export const TrafficLight: React.FC<{ position?: V3; state: "red" | "yellow" | "green" }> = ({ position = [0, 0, 0], state }) => (
  <group position={position}>
    <mesh position={[0, 1.4, 0]} castShadow>
      <cylinderGeometry args={[0.04, 0.05, 2.8, 12]} />
      <meshStandardMaterial color="#2A2E35" metalness={0.6} roughness={0.4} />
    </mesh>
    <Block size={[0.32, 0.9, 0.26]} position={[0, 3.0, 0]} color="#1E2228" rough={0.5} />
    {(["red", "yellow", "green"] as const).map((c, i) => {
      const on = c === state;
      const col = { red: "#FF2A2A", yellow: "#FFC23A", green: "#3AFF7A" }[c];
      return (
        <group key={c} position={[0, 3.28 - i * 0.28, 0.14]}>
          <mesh>
            <circleGeometry args={[0.09, 20]} />
            <meshStandardMaterial color={on ? col : "#2A2A2A"} emissive={on ? col : "#000"} emissiveIntensity={on ? 2 : 0} />
          </mesh>
          {on && <Glow position={[0, 0, 0.02]} color={col} size={0.6} core={0.05} />}
        </group>
      );
    })}
  </group>
);

// ---------- Schild-Texturen ----------
export const useSignTexture = (text: string, bg: string, fg: string, w = 1024, h = 256) =>
  useCanvasTexture(
    w,
    h,
    (ctx) => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = fg;
      ctx.lineWidth = 10;
      ctx.strokeRect(14, 14, w - 28, h - 28);
      ctx.fillStyle = fg;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${Math.round(h * 0.55)}px ${F.vintage}`;
      ctx.fillText(text, w / 2, h / 2 + 6);
    },
    [text, bg, fg],
  );

// Banner "BIG FRIDAY", das von links nach rechts gemalt wird
export const useBigFridayBanner = (progress: number) =>
  useCanvasTexture(
    1024,
    320,
    (ctx) => {
      ctx.fillStyle = "#F4EEE0";
      ctx.fillRect(0, 0, 1024, 320);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, 1024 * progress, 320);
      ctx.clip();
      ctx.fillStyle = "#1F6FB2";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `bold 46px ${F.sub}`;
      ctx.fillText("★ AB SOFORT HEISST ER ★", 512, 62);
      ctx.font = `150px ${F.bold}`;
      ctx.fillStyle = "#D62828";
      ctx.fillText("BIG FRIDAY!", 512, 200);
      ctx.restore();
    },
    [Math.round(progress * 40)],
  );

// Kassenbuch: Zahlen sind erst rot (Minus), werden dann schwarz (Plus)
export const useLedger = (black: number) =>
  useCanvasTexture(
    800,
    600,
    (ctx) => {
      ctx.fillStyle = "#F4EEE0";
      ctx.fillRect(0, 0, 800, 600);
      ctx.fillStyle = "#2B1D0E";
      ctx.font = `46px ${F.vintage}`;
      ctx.textAlign = "center";
      ctx.fillText("Kassenbuch", 400, 70);
      ctx.strokeStyle = "#9FB3C8";
      ctx.lineWidth = 2;
      for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.moveTo(40, 120 + i * 66);
        ctx.lineTo(760, 120 + i * 66);
        ctx.stroke();
      }
      ctx.strokeStyle = "#D98C8C";
      ctx.beginPath();
      ctx.moveTo(470, 100);
      ctx.lineTo(470, 560);
      ctx.stroke();
      const rows = ["Januar", "März", "Juni", "September", "November", "Black Friday"];
      const vals = ["– 1.200 $", "– 950 $", "– 1.480 $", "– 700 $", "– 300 $", "+ 9.800 $"];
      rows.forEach((r, i) => {
        const y = 165 + i * 66;
        ctx.textAlign = "left";
        ctx.fillStyle = "#2B1D0E";
        ctx.font = `bold 34px ${F.sub}`;
        ctx.fillText(r, 60, y);
        // rote Zahlen werden nach und nach schwarz (von oben nach unten)
        const k = Math.max(0, Math.min(1, black * 7 - i));
        const red = [214, 40, 40];
        const c = red.map((v) => Math.round(v * (1 - k) + 17 * k));
        ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
        ctx.textAlign = "right";
        ctx.font = `bold ${i === 5 ? 44 : 36}px ${F.sub}`;
        ctx.fillText(k > 0.5 ? vals[i].replace("–", "+") : vals[i].replace("+", "–"), 740, y);
      });
    },
    [Math.round(black * 60)],
  );

// ---------- Einkaufstüte ----------
export const ShoppingBag: React.FC<{ position?: V3; rotation?: V3; scale?: number; color: string; tex?: THREE.Texture }> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, color, tex }) => (
  <group position={position} rotation={rotation} scale={scale}>
    <Block size={[0.42, 0.5, 0.18]} position={[0, 0.25, 0]} color={color} rough={0.7} />
    {tex && (
      <mesh position={[0, 0.27, 0.091]}>
        <planeGeometry args={[0.36, 0.2]} />
        <meshStandardMaterial map={tex} roughness={0.8} />
      </mesh>
    )}
    {[-0.09, 0.09].map((x) => (
      <mesh key={x} position={[x, 0.5, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.06, 0.008, 8, 20, Math.PI]} />
        <meshStandardMaterial color="#2B1D0E" />
      </mesh>
    ))}
  </group>
);

// Preisschild mit Loch und Schnur
export const usePriceTag = (text: string) =>
  useCanvasTexture(
    256,
    384,
    (ctx) => {
      ctx.fillStyle = "#FFD60A";
      ctx.beginPath();
      ctx.moveTo(128, 0);
      ctx.lineTo(256, 80);
      ctx.lineTo(256, 384);
      ctx.lineTo(0, 384);
      ctx.lineTo(0, 80);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#1A0006";
      ctx.beginPath();
      ctx.arc(128, 70, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `120px ${F.bold}`;
      ctx.fillText(text, 128, 240);
    },
    [text],
  );

export const PriceTag: React.FC<{ tex: THREE.Texture; position?: V3; rotation?: V3; scale?: number }> = ({ tex, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => (
  <group position={position} rotation={rotation} scale={scale}>
    <mesh castShadow>
      <planeGeometry args={[0.26, 0.39]} />
      <meshStandardMaterial map={tex} transparent alphaTest={0.5} side={THREE.DoubleSide} roughness={0.6} />
    </mesh>
  </group>
);

// ---------- Kaufhaus-Fassade mit leuchtendem Schaufenster ----------
export const useShopWindow = () =>
  useCanvasTexture(
    1024,
    512,
    (ctx) => {
      const g = ctx.createLinearGradient(0, 0, 0, 512);
      g.addColorStop(0, "#FFE7B8");
      g.addColorStop(1, "#E8A35A");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 1024, 512);
      // Puppen / Geschenke als Silhouetten
      ctx.fillStyle = "#8A4B22";
      [150, 420, 700, 900].forEach((x, i) => {
        ctx.beginPath();
        ctx.arc(x, 200, 34, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(x - 46, 240, 92, 200);
        ctx.fillStyle = ["#C8102E", "#1F6FB2", "#2A9D8F", "#8A4B22"][i];
      });
      ctx.fillStyle = "#C8102E";
      ctx.fillRect(270, 360, 90, 80);
      ctx.fillRect(560, 340, 80, 100);
      ctx.fillStyle = "#FFD60A";
      ctx.fillRect(305, 360, 20, 80);
      ctx.fillRect(590, 340, 20, 100);
      ctx.fillStyle = "#2B1D0E";
      ctx.fillRect(0, 0, 1024, 14);
      ctx.fillRect(505, 0, 14, 512);
    },
    [],
  );

export const ShopFront: React.FC<{ position?: V3; rotation?: V3; sign: THREE.Texture; win: THREE.Texture; color?: string }> = ({ position = [0, 0, 0], rotation = [0, 0, 0], sign, win, color = "#7A3B2A" }) => (
  <group position={position} rotation={rotation}>
    <Block size={[4.2, 5, 0.5]} position={[0, 2.5, 0]} color={color} rough={0.85} />
    {/* Schaufenster */}
    <mesh position={[0, 1.2, 0.26]}>
      <planeGeometry args={[3.4, 1.7]} />
      <meshStandardMaterial map={win} emissiveMap={win} emissive="#ffffff" emissiveIntensity={0.9} roughness={0.3} />
    </mesh>
    <pointLight position={[0, 1.2, 1.2]} intensity={4} distance={5} color="#FFD7A0" />
    {/* Markise */}
    <mesh position={[0, 2.35, 0.55]} rotation={[0.5, 0, 0]} castShadow>
      <boxGeometry args={[3.8, 0.04, 0.8]} />
      <meshStandardMaterial color="#C8102E" roughness={0.8} />
    </mesh>
    {/* Schild */}
    <mesh position={[0, 3.1, 0.26]}>
      <planeGeometry args={[3.2, 0.8]} />
      <meshStandardMaterial map={sign} emissiveMap={sign} emissive="#ffffff" emissiveIntensity={0.5} roughness={0.5} />
    </mesh>
    {/* Fenster oben */}
    {[-1.2, 0, 1.2].map((x) => (
      <mesh key={x} position={[x, 4.1, 0.26]}>
        <planeGeometry args={[0.7, 0.8]} />
        <meshStandardMaterial color="#FFD9A0" emissive="#E89A4A" emissiveIntensity={0.7} />
      </mesh>
    ))}
  </group>
);

// ---------- Innenstadt bei Nacht: Straße, Häuser, Kaufhaus ----------
export const DowntownStreet: React.FC<{ frame: number; sign: THREE.Texture; win: THREE.Texture }> = ({ frame, sign, win }) => {
  const wins = [useWindows(0), useWindows(1), useWindows(2)];
  const asphalt = useAsphalt();
  asphalt.wrapS = asphalt.wrapT = THREE.RepeatWrapping;
  asphalt.repeat.set(10, 10);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 3]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshPhysicalMaterial map={asphalt} roughness={0.3} metalness={0.15} clearcoat={0.8} clearcoatRoughness={0.25} />
      </mesh>
      {/* Gehweg */}
      <Block size={[40, 0.14, 2.4]} position={[0, 0.07, -1.4]} color="#8E8C88" rough={0.8} />
      {/* Mittelstreifen */}
      {Array.from({ length: 12 }).map((_, i) => (
        <Block key={i} size={[0.9, 0.01, 0.08]} position={[-11 + i * 2, 0.005, 1.6]} color="#E9D9A0" rough={0.6} />
      ))}
      <ShopFront position={[0, 0, -2.8]} sign={sign} win={win} />
      {[-6.4, -4.2, 4.2, 6.4].map((x, i) => (
        <group key={x} position={[x, 4, -2.9]}>
          <Block size={[2.2, 8, 0.6]} color={["#4A3A34", "#3A3F4E", "#54453A", "#3A3F4E"][i]} rough={0.9} />
          <mesh position={[0, 0, 0.31]}>
            <planeGeometry args={[2.1, 7.9]} />
            <meshStandardMaterial map={wins[i % 3]} emissiveMap={wins[i % 3]} emissive="#ffffff" emissiveIntensity={0.55} roughness={0.9} />
          </mesh>
        </group>
      ))}
      {[-3.0, 3.0].map((x) => (
        <group key={x} position={[x, 0, -0.6]}>
          <mesh position={[0, 1.9, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.07, 3.8, 16]} />
            <meshStandardMaterial color="#1B1D24" metalness={0.7} roughness={0.35} />
          </mesh>
          <Glow position={[0, 3.85, 0]} color="#FFD9A0" size={1.4} core={0.12} />
          <pointLight position={[0, 3.6, 0.2]} intensity={7} distance={7} decay={1.6} color="#FFC98A" />
        </group>
      ))}
      {/* Lichterketten über der Straße */}
      {Array.from({ length: 14 }).map((_, i) => (
        <Glow key={i} position={[-3 + i * 0.46, 3.7 - Math.sin((i / 13) * Math.PI) * 0.5, -0.6]} color={["#FFD27A", "#FF6B6B", "#8AD1FF"][i % 3]} size={0.25 + 0.06 * Math.sin(frame * 0.2 + i)} core={0.02} />
      ))}
    </group>
  );
};

// Verkaufstresen (Laden innen)
export const Counter: React.FC<{ position?: V3 }> = ({ position = [0, 0, 0] }) => (
  <group position={position}>
    <Block size={[2.4, 0.95, 0.6]} position={[0, 0.475, 0]} color="#6B4226" rough={0.5} />
    <Block size={[2.5, 0.05, 0.7]} position={[0, 0.97, 0]} color="#3A2414" rough={0.3} />
    {/* Registrierkasse */}
    <group position={[0.7, 1.0, 0]}>
      <Block size={[0.5, 0.3, 0.4]} position={[0, 0.15, 0]} color="#B8B2A6" metal={0.7} rough={0.3} />
      <Block size={[0.4, 0.18, 0.06]} position={[0, 0.38, -0.1]} rotation={[-0.3, 0, 0]} color="#2B2B30" />
    </group>
  </group>
);

export const Shelves: React.FC<{ position?: V3 }> = ({ position = [0, 0, 0] }) => (
  <group position={position}>
    <Block size={[4.5, 2.6, 0.4]} position={[0, 1.3, 0]} color="#5A3A22" rough={0.8} />
    {[0.5, 1.2, 1.9].map((y, r) =>
      Array.from({ length: 8 }).map((_, i) => (
        <Block key={`${r}-${i}`} size={[0.35, 0.4, 0.3]} position={[-1.9 + i * 0.54, y + 0.2, 0.2]} color={["#C8102E", "#1F6FB2", "#F2C14E", "#2A9D8F"][(i + r) % 4]} rough={0.6} />
      )),
    )}
  </group>
);

export { Sheet };
