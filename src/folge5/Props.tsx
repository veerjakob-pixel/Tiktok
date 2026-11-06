// 3D-Requisiten für Folge 5 "Fackeln der Freiheit" – alles per Code gebaut (keine Bilder aus dem Internet).
// Rauchen wird nie schön gezeigt: Zigaretten sind klein, nüchtern, mit Warnhinweis oder Stempel.
import React from "react";
import * as THREE from "three";
import { useCurrentFrame } from "remotion";
import { Block, F, lines, Sheet, useCanvasTexture, V3 } from "../folge4-3d/Kit";
import { Look, Person } from "../folge4b/People";

// ---------- Fackel ----------
// Flammenform: unten rund, oben spitz
const flameGeo = (() => {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 32; i++) {
    const t = i / 32;
    pts.push(new THREE.Vector2(0.3 * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.6)), 0.9) * (1 - t * 0.3), -0.3 + t * 0.6));
  }
  return new THREE.LatheGeometry(pts, 40);
})();
export const Torch: React.FC<{ position?: V3; rotation?: V3; scale?: number }> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => {
  const frame = useCurrentFrame();
  const fl = (k: number) => 1 + Math.sin(frame * 0.9 + k) * 0.08 + Math.sin(frame * 1.7 + k * 2) * 0.05;
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Griff */}
      <mesh position={[0, -0.9, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.07, 2.0, 32]} />
        <meshPhysicalMaterial color="#6B4423" roughness={0.6} clearcoat={0.3} />
      </mesh>
      {[-0.4, -1.2].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <torusGeometry args={[0.115 - (y + 0.4) * -0.03, 0.025, 12, 40]} />
          <meshStandardMaterial color="#C9A24A" metalness={1} roughness={0.25} />
        </mesh>
      ))}
      {/* Schale */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.36, 0.13, 0.42, 48]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.2} />
      </mesh>
      {/* Flamme: drei Schichten, flackert */}
      <mesh geometry={flameGeo} position={[0, 0.72, 0]} scale={[1.05 * fl(0), 2.0 * fl(1), 1.05 * fl(0)]}>
        <meshBasicMaterial color="#FF5A1F" toneMapped={false} transparent opacity={0.9} />
      </mesh>
      <mesh geometry={flameGeo} position={[0, 0.66, 0.02]} scale={[0.7 * fl(2), 1.45 * fl(3), 0.7 * fl(2)]}>
        <meshBasicMaterial color="#FFA31A" toneMapped={false} />
      </mesh>
      <mesh geometry={flameGeo} position={[0, 0.58, 0.04]} scale={[0.4, 0.85 * fl(4), 0.4]}>
        <meshBasicMaterial color="#FFF1A8" toneMapped={false} />
      </mesh>
      <pointLight position={[0, 0.9, 0.4]} color="#FF9A3C" intensity={9 * fl(5)} distance={6} />
    </group>
  );
};

// ---------- Zigarette (nüchtern, kein Glamour) ----------
export const Cigarette: React.FC<{ position?: V3; rotation?: V3; scale?: number; glow?: number; smoke?: boolean }> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  glow = 1,
  smoke = false,
}) => {
  const frame = useCurrentFrame();
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Papier */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 1.5, 32]} />
        <meshPhysicalMaterial color="#F7F5F0" roughness={0.75} />
      </mesh>
      {/* Filter */}
      <mesh position={[0, -0.75, 0]} castShadow>
        <cylinderGeometry args={[0.102, 0.102, 0.5, 32]} />
        <meshStandardMaterial color="#D98E4A" roughness={0.8} />
      </mesh>
      {/* Asche + Glut */}
      <mesh position={[0, 1.04, 0]}>
        <cylinderGeometry args={[0.098, 0.1, 0.08, 32]} />
        <meshStandardMaterial color="#6E6E6E" roughness={1} />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.08, 0.098, 0.05, 32]} />
        <meshStandardMaterial color="#C1121F" emissive="#FF3D00" emissiveIntensity={1.5 * glow} />
      </mesh>
      {/* grauer, schmutziger Rauch – ein paar matte Kugeln, keine Effekte */}
      {smoke &&
        Array.from({ length: 6 }).map((_, i) => {
          const t = ((frame * 0.02 + i / 6) % 1);
          return (
            <mesh key={i} position={[Math.sin(t * 6 + i) * 0.15, 1.2 + t * 1.6, 0]} scale={0.08 + t * 0.25}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial color="#8A8A8A" transparent opacity={0.35 * (1 - t)} roughness={1} />
            </mesh>
          );
        })}
    </group>
  );
};

// ---------- Zigarettenschachtel mit Warnhinweis ----------
export const usePackTexture = () =>
  useCanvasTexture(
    600,
    860,
    (ctx) => {
      ctx.fillStyle = "#F4F1EA";
      ctx.fillRect(0, 0, 600, 860);
      ctx.fillStyle = "#9B2226";
      ctx.fillRect(0, 0, 600, 300);
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `92px ${F.bold}`;
      ctx.fillText("ZIGARETTEN", 300, 150);
      // Warnhinweis (schwarzer Kasten wie auf echten Packungen)
      ctx.fillStyle = "#111";
      ctx.fillRect(30, 420, 540, 400);
      ctx.fillStyle = "#fff";
      ctx.fillRect(48, 438, 504, 364);
      ctx.fillStyle = "#111";
      ctx.font = `88px ${F.bold}`;
      ctx.fillText("RAUCHEN", 300, 560);
      ctx.fillText("IST TÖDLICH", 300, 680);
    },
    [],
  );

export const Pack: React.FC<{ position?: V3; rotation?: V3; scale?: number }> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => {
  const tex = usePackTexture();
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Block size={[1.0, 1.43, 0.42]} color="#F4F1EA" rough={0.5} />
      <mesh position={[0, 0, 0.215]}>
        <planeGeometry args={[0.98, 1.4]} />
        <meshStandardMaterial map={tex} roughness={0.55} />
      </mesh>
      {[-0.22, 0, 0.22].map((x, i) => (
        <group key={x} position={[x, 0.78 + i * 0.05, 0]} scale={0.45}>
          <Cigarette glow={0} position={[0, 0, 0]} rotation={[0, 0, Math.PI]} />
        </group>
      ))}
    </group>
  );
};

// ---------- Straße heute: Plakatwand mit Werbung ----------
const usePoster = (bg: string, fg: string, big: string, small: string) =>
  useCanvasTexture(
    560,
    760,
    (ctx) => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 560, 760);
      ctx.fillStyle = fg;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${big.length > 5 ? 120 : 190}px ${F.bold}`;
      ctx.fillText(big, 280, 330);
      ctx.font = `bold 52px ${F.sub}`;
      ctx.fillText(small, 280, 560);
    },
    [bg, fg, big, small],
  );

const usePaving = (a: string, b: string, n = 8) =>
  useCanvasTexture(
    512,
    512,
    (ctx) => {
      const s = 512 / n;
      for (let y = 0; y < n; y++)
        for (let x = 0; x < n; x++) {
          ctx.fillStyle = (x * 3 + y * 5) % 4 ? a : b;
          ctx.fillRect(x * s + 2, y * s + 2, s - 4, s - 4);
        }
    },
    [a, b, n],
  );

export const City: React.FC = () => {
  const posters = [
    usePoster("#FFD166", "#1D2433", "NEU!", "Jetzt zugreifen"),
    usePoster("#EF476F", "#ffffff", "KAUF MICH", "Du verdienst es"),
    usePoster("#118AB2", "#ffffff", "-50%", "nur heute"),
    usePoster("#06D6A0", "#1D2433", "GLÜCK", "in jeder Dose"),
  ];
  const floor = usePaving("#A7A9AC", "#9A9C9F");
  floor.wrapS = floor.wrapT = THREE.RepeatWrapping;
  floor.repeat.set(8, 8);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial map={floor} roughness={0.85} />
      </mesh>
      {/* Wand */}
      <mesh position={[0, 3, -1.6]} receiveShadow>
        <planeGeometry args={[24, 8]} />
        <meshStandardMaterial color="#D8C7B4" roughness={0.95} />
      </mesh>
      {/* Plakatwand mit Rahmen */}
      <Block size={[6.2, 2.4, 0.12]} position={[0, 1.75, -1.5]} color="#2B2D42" rough={0.4} metal={0.4} />
      {posters.map((p, i) => (
        <Sheet key={i} tex={p} size={[1.4, 1.9]} position={[-2.25 + i * 1.5, 1.75, -1.42]} />
      ))}
      {/* Laterne */}
      <mesh position={[3.4, 2, -1.0]} castShadow>
        <cylinderGeometry args={[0.05, 0.07, 4, 16]} />
        <meshStandardMaterial color="#2B2D42" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[3.4, 4.05, -1.0]}>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color="#FFF3C4" emissive="#FFE8A0" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
};

// ---------- 1920er: Frau mit Hut, Mann mit Hut ----------
export const OldPerson: React.FC<{
  position?: V3;
  rotation?: V3;
  color: string;
  hat: string;
  woman?: boolean;
  look?: Look;
  hand?: React.ReactNode;
  scale?: number;
}> = ({ position = [0, 0, 0], rotation = [0, 0, 0], color, hat, woman = true, look = {}, hand, scale = 1 }) => (
  <group position={position} rotation={rotation} scale={scale}>
    <Person shirt={color} pants={woman ? color : "#2B2D42"} hair={woman ? "#3B2A1A" : "#2B1D0E"} hairStyle={woman ? "long" : "short"} look={look} hand={hand} />
    {/* Hut sitzt auf dem Kopf (dreht mit) */}
    <group position={[0, 1.62, 0]} rotation={[0, look.headTurn ?? 0, look.headTilt ?? 0]}>
      <mesh position={[0, 0.15, -0.01]}>
        <cylinderGeometry args={[woman ? 0.27 : 0.3, woman ? 0.27 : 0.3, 0.02, 32]} />
        <meshStandardMaterial color={hat} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.24, -0.01]}>
        <cylinderGeometry args={[woman ? 0.17 : 0.18, 0.2, woman ? 0.17 : 0.2, 32]} />
        <meshStandardMaterial color={hat} roughness={0.7} />
      </mesh>
      {woman && (
        <mesh position={[0.13, 0.22, 0.12]} rotation={[0.4, 0, -0.5]}>
          <coneGeometry args={[0.03, 0.22, 8]} />
          <meshStandardMaterial color="#E9D8A6" />
        </mesh>
      )}
    </group>
  </group>
);

// ---------- 1920er-Straße (Häuser, Kopfsteinpflaster, Schild TABAK) ----------
const useFacade = (color: string) =>
  useCanvasTexture(
    256,
    512,
    (ctx) => {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 256, 512);
      for (let y = 0; y < 5; y++)
        for (let x = 0; x < 3; x++) {
          ctx.fillStyle = "#2F2A26";
          ctx.fillRect(22 + x * 80, 30 + y * 96, 50, 66);
          ctx.fillStyle = "#E9D8A6";
          ctx.fillRect(26 + x * 80, 34 + y * 96, 42, 26);
        }
    },
    [color],
  );

const useSign = (text: string, bg = "#2B1D0E", fg = "#F1E6C8", w = 800, h = 260) =>
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
    [text, bg, fg, w, h],
  );

export const OldStreet: React.FC<{ bunting?: boolean }> = ({ bunting = false }) => {
  const facades = [useFacade("#8C5A3C"), useFacade("#A47551"), useFacade("#7A6A58")];
  const sign = useSign("TABAK");
  const parade = useSign("EASTER PARADE", "#7A1E1E", "#F1E6C8", 1200, 220);
  const cobble = usePaving("#7D6B57", "#6C5B49", 16);
  cobble.wrapS = cobble.wrapT = THREE.RepeatWrapping;
  cobble.repeat.set(6, 10);
  const houses = Array.from({ length: 7 }).flatMap((_, i) =>
    [-1, 1].map((s) => ({ s, z: 2 - i * 3.2, h: 6 + ((i * 7 + (s > 0 ? 3 : 0)) % 4) * 1.3, f: (i + (s > 0 ? 1 : 0)) % 3 })),
  );
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -8]} receiveShadow>
        <planeGeometry args={[12, 40]} />
        <meshStandardMaterial map={cobble} roughness={0.9} />
      </mesh>
      {/* Gehwege */}
      {[-1, 1].map((s) => (
        <Block key={s} size={[1.4, 0.16, 40]} position={[s * 2.7, 0.08, -8]} color="#9C8C78" rough={0.9} />
      ))}
      {houses.map((hs, k) => (
        <group key={k} position={[hs.s * 4.1, hs.h / 2, hs.z]}>
          <Block size={[1.4, hs.h, 3.1]} color="#6E5440" rough={0.9} />
          <mesh position={[-hs.s * 0.71, 0, 0]} rotation={[0, -hs.s * Math.PI / 2, 0]}>
            <planeGeometry args={[3.1, hs.h]} />
            <meshStandardMaterial map={facades[hs.f]} roughness={0.9} />
          </mesh>
        </group>
      ))}
      {/* Tabakladen-Schild rechts */}
      <Sheet tex={sign} size={[1.6, 0.52]} position={[3.36, 2.6, 0.4]} rotation={[0, -Math.PI / 2 + 0.25, 0]} depth={0.05} color="#2B1D0E" />
      {bunting && (
        <group>
          <Sheet tex={parade} size={[4.6, 0.84]} position={[0, 4.6, -6]} depth={0.05} color="#7A1E1E" />
          {[-3, -10].map((z) =>
            Array.from({ length: 13 }).map((_, i) => {
              const x = -3 + i * 0.5;
              return (
                <mesh key={`${z}-${i}`} position={[x, 4.0 - Math.cos((x / 3) * 1.2) * -0.35 - 0.35, z]} rotation={[0, 0, Math.PI]}>
                  <coneGeometry args={[0.18, 0.38, 3]} />
                  <meshStandardMaterial color={["#C1121F", "#F1E6C8", "#1D3557"][i % 3]} side={THREE.DoubleSide} />
                </mesh>
              );
            }),
          )}
        </group>
      )}
    </group>
  );
};

// ---------- Kuchendiagramm (zwei Hälften) ----------
export const Pie: React.FC<{ out: number; position?: V3; rotation?: V3 }> = ({ out, position = [0, 0, 0], rotation = [0, 0, 0] }) => (
  <group position={position} rotation={rotation}>
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* rechte Hälfte: Männer = Kunden */}
      <mesh castShadow>
        <cylinderGeometry args={[1.4, 1.4, 0.45, 64, 1, false, 0, Math.PI]} />
        <meshPhysicalMaterial color="#E9B44C" roughness={0.35} clearcoat={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* linke Hälfte: Frauen = fehlende Kunden (grau, fliegt raus) */}
      <mesh position={[-out * 0.9, out * 0.3, 0]} castShadow>
        <cylinderGeometry args={[1.4, 1.4, 0.45, 64, 1, false, Math.PI, Math.PI]} />
        <meshPhysicalMaterial color="#8D8D8D" roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  </group>
);

// ---------- Pressekamera mit Blitz ----------
export const PressCam: React.FC<{ position?: V3; rotation?: V3; flash?: number; scale?: number }> = ({ position = [0, 0, 0], rotation = [0, 0, 0], flash = 0, scale = 1 }) => (
  <group position={position} rotation={rotation} scale={scale}>
    <Block size={[0.6, 0.5, 0.35]} color="#1B1B1B" rough={0.4} metal={0.3} />
    {/* Balg + Objektiv */}
    <mesh position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.14, 0.2, 0.3, 4]} />
      <meshStandardMaterial color="#2B2B2B" roughness={0.9} />
    </mesh>
    <mesh position={[0, 0, 0.48]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.1, 0.1, 0.1, 32]} />
      <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
    </mesh>
    {/* Blitzstange + Schale */}
    <mesh position={[0.36, 0.35, 0]}>
      <cylinderGeometry args={[0.02, 0.02, 0.55, 8]} />
      <meshStandardMaterial color="#888" metalness={0.8} />
    </mesh>
    <mesh position={[0.36, 0.65, 0.05]} rotation={[Math.PI / 2 - 0.3, 0, 0]}>
      <cylinderGeometry args={[0.2, 0.05, 0.12, 32, 1, true]} />
      <meshStandardMaterial color="#D0D0D0" metalness={1} roughness={0.15} side={THREE.DoubleSide} emissive="#ffffff" emissiveIntensity={flash * 3} />
    </mesh>
    {flash > 0 && <pointLight position={[0.36, 0.7, 0.4]} intensity={40 * flash} distance={8} color="#ffffff" />}
  </group>
);

// ---------- Zeitung ----------
export const useNewspaperTexture = (variant = 0) =>
  useCanvasTexture(
    800,
    1040,
    (ctx) => {
      ctx.fillStyle = "#EFE4C6";
      ctx.fillRect(0, 0, 800, 1040);
      ctx.fillStyle = "#2B1D0E";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `64px ${F.vintage}`;
      ctx.fillText(["The New York Daily", "Evening Herald", "Morning Courier"][variant % 3], 400, 70);
      ctx.fillRect(30, 115, 740, 6);
      ctx.font = `bold 26px ${F.sub}`;
      ctx.fillText("MONTAG, 1. APRIL 1929", 400, 145);
      ctx.fillRect(30, 168, 740, 3);
      ctx.font = `118px ${F.bold}`;
      ctx.fillText("FACKELN DER", 400, 255);
      ctx.fillText("FREIHEIT", 400, 375);
      ctx.font = `bold 38px ${F.sub}`;
      ctx.fillText("Frauen kämpfen für Gleichberechtigung", 400, 465);
      // Foto: Frauen auf der Parade (Silhouetten)
      ctx.fillStyle = "#B9A985";
      ctx.fillRect(40, 510, 420, 330);
      ctx.fillStyle = "#4A3B2A";
      [100, 200, 300, 390].forEach((x, i) => {
        ctx.beginPath();
        ctx.arc(x, 620 + (i % 2) * 10, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(x - 32, 650 + (i % 2) * 10, 64, 170);
      });
      lines(ctx, 490, 520, 270, 12, 27, "#7A6A50", 12);
      lines(ctx, 40, 870, 720, 6, 27, "#7A6A50", 12);
    },
    [variant],
  );

export const Newspaper3D: React.FC<{ tex: THREE.Texture; position?: V3; rotation?: V3; scale?: number }> = ({ tex, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => (
  <group scale={scale} position={position} rotation={rotation}>
    <Sheet tex={tex} size={[2, 2.6]} depth={0.02} color="#EFE4C6" />
  </group>
);

// ---------- Geldsack "TABAKINDUSTRIE" ----------
const sackGeo = (() => {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const y = -1 + t * 2;
    const r = t < 0.78 ? Math.sin(Math.PI * Math.min(1, t / 0.78) * 0.95 + 0.15) * 1.0 : 0.22 + (t - 0.78) * 1.6;
    pts.push(new THREE.Vector2(Math.max(0.02, r), y));
  }
  return new THREE.LatheGeometry(pts, 48);
})();

export const useSackLabel = () =>
  useCanvasTexture(
    900,
    260,
    (ctx) => {
      ctx.fillStyle = "#F1E6C8";
      ctx.fillRect(0, 0, 900, 260);
      ctx.strokeStyle = "#2B1D0E";
      ctx.lineWidth = 10;
      ctx.strokeRect(10, 10, 880, 240);
      ctx.fillStyle = "#9B2226";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `128px ${F.bold}`;
      ctx.fillText("TABAKINDUSTRIE", 450, 136);
    },
    [],
  );

const useDollar = () =>
  useCanvasTexture(
    256,
    256,
    (ctx) => {
      ctx.fillStyle = "#2B1D0E";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `220px ${F.bold}`;
      ctx.fillText("$", 128, 140);
    },
    [],
  );

export const MoneySack: React.FC<{ position?: V3; rotation?: V3; scale?: number }> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => {
  const label = useSackLabel();
  const dollar = useDollar();
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={sackGeo} castShadow receiveShadow>
        <meshPhysicalMaterial color="#C8A97E" roughness={0.95} sheen={0.6} sheenColor="#E9D8A6" />
      </mesh>
      <mesh position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.27, 0.05, 12, 40]} />
        <meshStandardMaterial color="#6B4423" roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.25, 0.99]}>
        <planeGeometry args={[0.9, 0.9]} />
        <meshStandardMaterial map={dollar} transparent roughness={0.9} />
      </mesh>
      {/* Anhänger mit Aufschrift */}
      <Sheet tex={label} size={[1.9, 0.55]} position={[0, 0.25, 1.08]} rotation={[-0.15, 0, 0.06]} depth={0.03} color="#F1E6C8" />
    </group>
  );
};

// ---------- Preisschild an einer Schnur ----------
export const useTagTexture = (text: string) =>
  useCanvasTexture(
    700,
    300,
    (ctx) => {
      ctx.fillStyle = "#FFF8E7";
      ctx.fillRect(0, 0, 700, 300);
      ctx.strokeStyle = "#3A2A16";
      ctx.lineWidth = 12;
      ctx.strokeRect(6, 6, 688, 288);
      ctx.fillStyle = "#3A2A16";
      ctx.beginPath();
      ctx.arc(350, 48, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${text.length > 11 ? 92 : 112}px ${F.bold}`;
      ctx.fillText(text, 350, 178);
    },
    [text],
  );

export const HangingTag: React.FC<{ tex: THREE.Texture; position?: V3; swing?: number; len?: number; scale?: number }> = ({ tex, position = [0, 0, 0], swing = 0, len = 0.5, scale = 1 }) => (
  <group position={position} rotation={[0, 0, swing]} scale={scale}>
    <mesh position={[0, -len / 2, 0]}>
      <cylinderGeometry args={[0.012, 0.012, len, 8]} />
      <meshStandardMaterial color="#C9A24A" metalness={0.6} roughness={0.3} />
    </mesh>
    <Sheet tex={tex} size={[1.4, 0.6]} depth={0.03} color="#FFF8E7" position={[0, -len - 0.28, 0]} />
  </group>
);
