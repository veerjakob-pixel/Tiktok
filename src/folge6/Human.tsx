// Realistischere 3D-Figur für Folge 6: Gelenke (Schulter, Ellbogen, Hüfte, Knie), Hände, Schuhe,
// Augen mit Iris und Lichtpunkt, Lider, Atmen, leichtes Wiegen, Kopfnicken und Gesten beim Sprechen.
// Maße in Metern (ca. 1,8 m groß). Kopfmitte liegt bei y = HEAD_Y.
import React from "react";
import * as THREE from "three";
import { V3 } from "../folge4-3d/Kit";

export const HEAD_Y = 1.66;

export type Pose = {
  talk?: number; // 0..1 Mundöffnung
  talking?: boolean; // spricht gerade -> Gesten + Nicken
  blink?: boolean;
  brow?: number; // >0 überrascht, <0 skeptisch
  smile?: number;
  headTurn?: number;
  headTilt?: number;
  headNod?: number;
  armR?: number; // rechter Arm nach vorne heben (0..1)
  armL?: number;
  bendR?: number; // Ellbogen beugen (0..1.5)
  bendL?: number;
  gesture?: number; // Stärke der Sprech-Gesten
  walk?: number; // Laufphase (rad), undefined = steht
};

const torsoGeo = (() => {
  const p: [number, number][] = [
    [0.0, 0.88],
    [0.15, 0.89],
    [0.165, 0.96],
    [0.152, 1.06],
    [0.165, 1.18],
    [0.185, 1.3],
    [0.195, 1.39],
    [0.17, 1.45],
    [0.08, 1.5],
    [0.0, 1.5],
  ];
  return new THREE.LatheGeometry(
    p.map(([r, y]) => new THREE.Vector2(r, y)),
    40,
  );
})();
const robeGeo = (() => {
  const p: [number, number][] = [
    [0.0, 0.02],
    [0.36, 0.02],
    [0.3, 0.4],
    [0.22, 0.85],
    [0.17, 1.0],
    [0.0, 1.0],
  ];
  return new THREE.LatheGeometry(
    p.map(([r, y]) => new THREE.Vector2(r, y)),
    40,
  );
})();

const Cloth: React.FC<{ color: string; rough?: number }> = ({ color, rough = 0.85 }) => (
  <meshPhysicalMaterial color={color} roughness={rough} sheen={0.8} sheenRoughness={0.6} sheenColor={color} />
);

export type HumanProps = {
  position?: V3;
  rotation?: V3;
  scale?: number;
  frame: number;
  seed?: number;
  pose?: Pose;
  top: string;
  bottom: string;
  shoes?: string;
  skin?: string;
  hair: string;
  hairStyle: "long" | "short" | "bald";
  iris?: string;
  beard?: string; // Bartfarbe (z. B. weiß beim Weihnachtsmann)
  belly?: number;
  build?: number; // Körperbau: 1 = normal, >1 = kräftiger (dickere Arme, Beine, Oberkörper)
  robe?: string; // langer Mantel (Bischof)
  collar?: string;
  hand?: React.ReactNode; // was die rechte Hand hält
  headExtra?: React.ReactNode; // Hut, Mütze, Mitra
  bodyExtra?: React.ReactNode; // Gürtel usw.
};

export const Human: React.FC<HumanProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  frame,
  seed = 0,
  pose = {},
  top,
  bottom,
  shoes = "#2B2B2B",
  skin = "#E9BC9A",
  hair,
  hairStyle,
  iris = "#5B3A1E",
  beard,
  belly = 0,
  build = 1,
  robe,
  collar,
  hand,
  headExtra,
  bodyExtra,
}) => {
  const { talk = 0, talking = false, blink = false, brow = 0, smile = 0, headTurn = 0, headTilt = 0, headNod = 0, gesture = 1 } = pose;
  const f = frame + seed * 37;
  // Atmen + Wiegen
  const breathe = 1 + Math.sin(f * 0.11) * 0.012;
  const sway = Math.sin(f * 0.035) * 0.018;
  // Sprech-Gesten: Arme bewegen sich weich, Kopf nickt leicht
  const g = talking ? gesture : 0;
  const gR = g * (0.5 + 0.5 * Math.sin(f * 0.17)) * (0.6 + 0.4 * Math.sin(f * 0.07 + 1));
  const gL = g * (0.5 + 0.5 * Math.sin(f * 0.13 + 2)) * 0.6;
  const nod = headNod + (talking ? Math.sin(f * 0.27) * 0.04 + Math.sin(f * 0.11) * 0.03 : Math.sin(f * 0.05) * 0.01);
  const armR = (pose.armR ?? 0) + gR * 0.35;
  const armL = (pose.armL ?? 0) + gL * 0.3;
  const bendR = (pose.bendR ?? 0.15) + gR * 0.9;
  const bendL = (pose.bendL ?? 0.12) + gL * 0.7;
  // Laufen
  const w = pose.walk;
  const legA = w === undefined ? 0 : Math.sin(w) * 0.42;
  const kneeA = w === undefined ? 0.04 : Math.max(0, Math.sin(w + Math.PI)) * 0.7;
  const kneeB = w === undefined ? 0.04 : Math.max(0, Math.sin(w)) * 0.7;
  const bob = w === undefined ? 0 : Math.abs(Math.cos(w)) * 0.03;

  const skinMat = <meshPhysicalMaterial color={skin} roughness={0.48} sheen={0.6} sheenColor="#ffcfb8" clearcoat={0.08} />;
  const hairMat = <meshPhysicalMaterial color={hair} roughness={0.55} sheen={1} sheenColor={hair} clearcoat={0.25} />;

  const leg = (side: number, swing: number, knee: number) => (
    <group position={[side * 0.09 * build, 0.92, 0]} rotation={[swing, 0, 0]}>
      <mesh position={[0, -0.22, 0]} castShadow>
        <capsuleGeometry args={[0.072 * build, 0.34, 8, 20]} />
        <Cloth color={bottom} />
      </mesh>
      <group position={[0, -0.45, 0]} rotation={[knee, 0, 0]}>
        <mesh position={[0, -0.21, 0]} castShadow>
          <capsuleGeometry args={[0.058 * build, 0.34, 8, 20]} />
          <Cloth color={bottom} />
        </mesh>
        {/* Schuh */}
        <mesh position={[0, -0.43, 0.05]} scale={[0.1, 0.075, 0.25]} castShadow>
          <sphereGeometry args={[0.6, 24, 16]} />
          <meshPhysicalMaterial color={shoes} roughness={0.35} clearcoat={0.5} />
        </mesh>
      </group>
    </group>
  );

  const arm = (side: number, raise: number, bend: number, held?: React.ReactNode) => (
    <group position={[side * (0.2 + 0.035 * build + belly * 0.02), 1.41, 0]} rotation={[-raise, 0, side * (0.09 + belly * 0.12)]}>
      <mesh position={[0, -0.15, 0]} castShadow>
        <capsuleGeometry args={[0.052 * build, 0.22, 8, 20]} />
        <Cloth color={top} />
      </mesh>
      <group position={[0, -0.3, 0]} rotation={[-bend, 0, 0]}>
        <mesh position={[0, -0.13, 0]} castShadow>
          <capsuleGeometry args={[0.045 * build, 0.2, 8, 20]} />
          <Cloth color={top} />
        </mesh>
        {/* Hand */}
        <group position={[0, -0.29, 0.005]}>
          <mesh scale={[0.85, 1.15, 0.45]} castShadow>
            <sphereGeometry args={[0.047, 20, 16]} />
            {skinMat}
          </mesh>
          <mesh position={[-side * 0.035, 0.005, 0.02]} rotation={[0.3, 0, side * 0.6]}>
            <capsuleGeometry args={[0.013, 0.035, 6, 10]} />
            {skinMat}
          </mesh>
          {held && <group rotation={[raise + bend, 0, 0]}>{held}</group>}
        </group>
      </group>
    </group>
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group position={[0, bob, 0]} rotation={[0, 0, sway]}>
        {!robe && leg(-1, legA, kneeA)}
        {!robe && leg(1, -legA, kneeB)}
        {robe && (
          <mesh geometry={robeGeo} castShadow receiveShadow>
            <Cloth color={robe} rough={0.7} />
          </mesh>
        )}
        {/* Becken */}
        <mesh position={[0, 0.93, 0]} scale={[0.17 * build, 0.11, 0.12 * build]} castShadow>
          <sphereGeometry args={[1, 24, 16]} />
          <Cloth color={robe ?? bottom} />
        </mesh>
        {/* Oberkörper (atmet) */}
        <group scale={[1, 1, 1]} position={[0, 0, 0]}>
          <mesh geometry={torsoGeo} scale={[breathe * (0.85 + 0.15 * build + belly * 0.12), 1, 0.64 * breathe * (0.85 + 0.15 * build + belly * 0.25)]} castShadow receiveShadow>
            <Cloth color={top} />
          </mesh>
          {belly > 0 && (
            <mesh position={[0, 1.08, 0.04]} scale={[0.19 + belly * 0.05, 0.22 + belly * 0.04, 0.13 + belly * 0.08]} castShadow>
              <sphereGeometry args={[1, 32, 24]} />
              <Cloth color={top} />
            </mesh>
          )}
          {collar && (
            <mesh position={[0, 1.47, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.7, 1]}>
              <torusGeometry args={[0.075, 0.025, 12, 32]} />
              <Cloth color={collar} />
            </mesh>
          )}
          {bodyExtra}
        </group>
        {arm(-1, armL, bendL)}
        {arm(1, armR, bendR, hand)}
        {/* Hals */}
        <mesh position={[0, 1.52, 0]}>
          <cylinderGeometry args={[0.048, 0.055, 0.1, 20]} />
          {skinMat}
        </mesh>
        {/* Kopf */}
        <group position={[0, HEAD_Y, 0]} rotation={[nod, headTurn, headTilt]}>
          <mesh scale={[0.92, 1.08, 0.98]} castShadow>
            <sphereGeometry args={[0.135, 48, 40]} />
            {skinMat}
          </mesh>
          {/* Kinn */}
          <mesh position={[0, -0.075, 0.035]} scale={[1, 0.75, 0.85]}>
            <sphereGeometry args={[0.068, 24, 20]} />
            {skinMat}
          </mesh>
          {/* Ohren */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.123, 0, -0.005]} scale={[0.35, 1, 0.65]}>
              <sphereGeometry args={[0.032, 16, 12]} />
              {skinMat}
            </mesh>
          ))}
          {/* Augen mit Iris, Pupille, Lichtpunkt; Lider beim Blinzeln */}
          {[-1, 1].map((s) => (
            <group key={s} position={[s * 0.044, 0.014, 0.112]}>
              <group scale={[1, blink ? 0.08 : 1, 1]}>
                <mesh>
                  <sphereGeometry args={[0.019, 20, 16]} />
                  <meshPhysicalMaterial color="#F6F3EE" roughness={0.15} clearcoat={1} />
                </mesh>
                <mesh position={[0, 0, 0.013]}>
                  <sphereGeometry args={[0.0105, 16, 12]} />
                  <meshPhysicalMaterial color={iris} roughness={0.2} clearcoat={1} />
                </mesh>
                <mesh position={[0, 0, 0.0195]}>
                  <sphereGeometry args={[0.005, 12, 8]} />
                  <meshBasicMaterial color="#0A0705" />
                </mesh>
                <mesh position={[0.004, 0.004, 0.0215]}>
                  <sphereGeometry args={[0.0018, 8, 6]} />
                  <meshBasicMaterial color="#ffffff" toneMapped={false} />
                </mesh>
              </group>
              {/* Oberlid */}
              <mesh position={[0, 0.016 + (blink ? -0.014 : 0), 0.002]} rotation={[0.15, 0, 0]} scale={[1.1, 0.4, 1.05]}>
                <sphereGeometry args={[0.02, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
                {skinMat}
              </mesh>
            </group>
          ))}
          {/* Augenbrauen */}
          {[-1, 1].map((s) => (
            <mesh
              key={`b${s}`}
              position={[s * 0.046, 0.047 + Math.max(0, brow) * 0.012 + (brow < 0 ? (s > 0 ? -brow * 0.012 : brow * 0.004) : 0), 0.122]}
              rotation={[0.2, 0, s * (brow < 0 ? (s > 0 ? 0.25 : -0.25) * -brow : -0.06)]}
            >
              <boxGeometry args={[0.042, 0.008, 0.008]} />
              <meshStandardMaterial color={beard && hairStyle === "bald" ? beard : hair} roughness={0.8} />
            </mesh>
          ))}
          {/* Nase */}
          <mesh position={[0, -0.012, 0.128]} rotation={[0.35, 0, 0]} scale={[0.75, 1.35, 1]}>
            <sphereGeometry args={[0.017, 16, 12]} />
            {skinMat}
          </mesh>
          <mesh position={[0, -0.03, 0.132]}>
            <sphereGeometry args={[0.012, 12, 10]} />
            {skinMat}
          </mesh>
          {/* Mund: Lippen + Öffnung */}
          <mesh position={[0, -0.058, 0.115]} scale={[1.25 + smile * 0.45, 0.22 + talk * 0.75, 0.5]}>
            <sphereGeometry args={[0.019, 20, 14]} />
            <meshStandardMaterial color="#5A1E1E" roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.052 + talk * -0.004, 0.118]} scale={[1.3 + smile * 0.45, 0.28, 0.5]}>
            <sphereGeometry args={[0.019, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshPhysicalMaterial color="#B5655A" roughness={0.4} clearcoat={0.4} />
          </mesh>
          {/* Haare */}
          {hairStyle !== "bald" && (
            <mesh position={[0, 0.012, -0.008]} scale={[0.96, 1.06, 1.02]} rotation={[-0.25, 0, 0]}>
              <sphereGeometry args={[0.142, 40, 32, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
              {hairMat}
            </mesh>
          )}
          {hairStyle === "short" && (
            <mesh position={[0, -0.02, -0.05]} scale={[0.95, 0.9, 0.85]}>
              <sphereGeometry args={[0.138, 32, 24, 0, Math.PI * 2, Math.PI * 0.35, Math.PI * 0.35]} />
              {hairMat}
            </mesh>
          )}
          {hairStyle === "long" && (
            <>
              <mesh position={[0, -0.1, -0.06]} castShadow>
                <capsuleGeometry args={[0.12, 0.2, 10, 24]} />
                {hairMat}
              </mesh>
              {[-1, 1].map((s) => (
                <mesh key={s} position={[s * 0.118, -0.09, 0.02]} rotation={[0, 0, s * 0.08]}>
                  <capsuleGeometry args={[0.035, 0.2, 8, 12]} />
                  {hairMat}
                </mesh>
              ))}
              {/* Pony */}
              <mesh position={[0.035, 0.095, 0.08]} rotation={[0.7, 0, -0.5]} scale={[1.4, 0.4, 0.5]}>
                <sphereGeometry args={[0.05, 16, 12]} />
                {hairMat}
              </mesh>
            </>
          )}
          {beard && (
            <>
              <mesh position={[0, -0.085, 0.045]} scale={[1, 1.2, 0.78]}>
                <sphereGeometry args={[0.11, 32, 24]} />
                <meshPhysicalMaterial color={beard} roughness={1} sheen={1} sheenColor="#ffffff" />
              </mesh>
              {[-1, 1].map((s) => (
                <mesh key={s} position={[s * 0.03, -0.042, 0.122]} rotation={[0, 0, s * 0.35]} scale={[1.6, 0.6, 0.7]}>
                  <sphereGeometry args={[0.024, 16, 12]} />
                  <meshPhysicalMaterial color={beard} roughness={1} sheen={1} />
                </mesh>
              ))}
            </>
          )}
          {headExtra}
        </group>
      </group>
    </group>
  );
};
