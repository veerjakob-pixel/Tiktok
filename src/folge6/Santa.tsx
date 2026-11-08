// Weihnachtsmann als eigenes, sorgfältig gebautes Modell (statt umgebauter Standard-Figur).
// Mantel mit Pelzsaum + Pelzleiste, Gürtel, Stiefel mit Pelzrand, Handschuhe, Bart aus mehreren Büscheln
// (lässt die Augen frei), buschige Brauen, rote Wangen, Zipfelmütze mit Bommel.
import React from "react";
import * as THREE from "three";
import { V3 } from "../folge4-3d/Kit";

const RED = "#B3121F";
const RED_DARK = "#8E0E19";
const FUR = "#F7F4EE";
const SKIN = "#F0C2A2";

// Mantel-Umriss: Radius r(y) – unten ausgestellt, dicker Bauch, schmalere Schultern
const COAT: [number, number][] = [
  [0.0, 0.66],
  [0.33, 0.66],
  [0.36, 0.75],
  [0.375, 0.9],
  [0.38, 1.02],
  [0.36, 1.15],
  [0.32, 1.27],
  [0.28, 1.37],
  [0.24, 1.44],
  [0.12, 1.5],
  [0.0, 1.51],
];
const coatR = (y: number) => {
  for (let i = 0; i < COAT.length - 1; i++) {
    const [r0, y0] = COAT[i];
    const [r1, y1] = COAT[i + 1];
    if (y >= y0 && y <= y1) return r0 + ((r1 - r0) * (y - y0)) / (y1 - y0);
  }
  return 0;
};
const DEPTH = 0.82; // Mantel ist vorne-hinten etwas flacher
const coatGeo = new THREE.LatheGeometry(
  COAT.map(([r, y]) => new THREE.Vector2(r, y)),
  64,
);

const Fur: React.FC = () => <meshPhysicalMaterial color={FUR} roughness={1} sheen={1} sheenColor="#ffffff" sheenRoughness={0.8} />;
const Cloth: React.FC<{ color?: string }> = ({ color = RED }) => <meshPhysicalMaterial color={color} roughness={0.75} sheen={0.7} sheenColor="#ff6a6a" sheenRoughness={0.5} />;
const Skin: React.FC = () => <meshPhysicalMaterial color={SKIN} roughness={0.5} sheen={0.5} sheenColor="#ffd2c0" />;

export type SantaPose = {
  blink?: boolean;
  laugh?: number; // 0..1: Kopf nach hinten, Bauch wackelt, Augen schmal
  wave?: number; // linker Arm winkt (0..1)
  holdR?: number; // rechter Arm hebt etwas (0..1)
  turn?: number; // Kopf drehen
};

export const SantaFigure: React.FC<{ frame: number; position?: V3; rotation?: V3; scale?: number; pose?: SantaPose; hand?: React.ReactNode }> = ({
  frame,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  pose = {},
  hand,
}) => {
  const { blink = false, laugh = 0, wave = 0, holdR = 0, turn = 0 } = pose;
  const breathe = 1 + Math.sin(frame * 0.1) * 0.012 + laugh * Math.abs(Math.sin(frame * 0.9)) * 0.03;
  const sway = Math.sin(frame * 0.04) * 0.015;
  const eyeClose = blink ? 0.1 : 1 - laugh * 0.55;
  const waveA = wave * (0.15 * Math.sin(frame * 0.35));

  // Pelzleiste vorne: Kugeln entlang der Mantelvorderseite
  const strip = Array.from({ length: 27 }).map((_, i) => {
    const y = 0.7 + i * 0.03;
    return [0, y, coatR(y) * DEPTH + 0.008] as V3;
  });

  const arm = (side: number, raise: number, outward: number, bend: number, held?: React.ReactNode) => (
    <group position={[side * 0.27, 1.34, 0]} rotation={[-raise, 0, side * outward]}>
      {/* Schulterkugel */}
      <mesh castShadow>
        <sphereGeometry args={[0.088, 24, 18]} />
        <Cloth />
      </mesh>
      <mesh position={[0, -0.16, 0]} castShadow>
        <capsuleGeometry args={[0.088, 0.2, 8, 20]} />
        <Cloth />
      </mesh>
      <group position={[0, -0.3, 0]} rotation={[-bend, 0, 0]}>
        <mesh position={[0, -0.12, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.17, 8, 20]} />
          <Cloth />
        </mesh>
        {/* Pelzmanschette */}
        <mesh position={[0, -0.24, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.078, 0.035, 12, 28]} />
          <Fur />
        </mesh>
        {/* Handschuh */}
        <group position={[0, -0.32, 0.01]}>
          <mesh scale={[0.95, 1.1, 0.7]} castShadow>
            <sphereGeometry args={[0.062, 20, 16]} />
            <meshPhysicalMaterial color="#F2F2F2" roughness={0.8} sheen={0.6} />
          </mesh>
          <mesh position={[-side * 0.05, 0.02, 0.025]} rotation={[0.2, 0, side * 0.7]}>
            <capsuleGeometry args={[0.02, 0.04, 6, 10]} />
            <meshPhysicalMaterial color="#F2F2F2" roughness={0.8} />
          </mesh>
          {held && <group rotation={[raise + bend, 0, 0]}>{held}</group>}
        </group>
      </group>
    </group>
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group rotation={[0, 0, sway]}>
        {/* Stiefel mit Pelzrand */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.13, 0, 0]}>
            <mesh position={[0, 0.06, 0.06]} scale={[0.11, 0.07, 0.19]} castShadow>
              <sphereGeometry args={[1, 24, 16]} />
              <meshPhysicalMaterial color="#141414" roughness={0.25} clearcoat={1} />
            </mesh>
            <mesh position={[0, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.105, 0.26, 24]} />
              <meshPhysicalMaterial color="#141414" roughness={0.25} clearcoat={1} />
            </mesh>
            <mesh position={[0, 0.34, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.105, 0.04, 12, 28]} />
              <Fur />
            </mesh>
            {/* Hosenbein */}
            <mesh position={[0, 0.55, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.1, 0.4, 24]} />
              <Cloth color={RED_DARK} />
            </mesh>
          </group>
        ))}
        {/* Mantel (atmet) */}
        <group scale={[breathe, 1, breathe]}>
          <mesh geometry={coatGeo} scale={[1, 1, DEPTH]} castShadow receiveShadow>
            <Cloth />
          </mesh>
          {/* Pelzsaum unten */}
          <mesh position={[0, 0.68, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, DEPTH, 1]}>
            <torusGeometry args={[0.335, 0.05, 14, 64]} />
            <Fur />
          </mesh>
          {/* Pelzleiste vorne */}
          {strip.map((p, i) => (
            <mesh key={i} position={p} scale={[1, 0.85, 0.6]}>
              <sphereGeometry args={[0.045, 14, 10]} />
              <Fur />
            </mesh>
          ))}
          {/* Gürtel + goldene Schnalle */}
          <mesh position={[0, 0.98, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, DEPTH, 1]}>
            <torusGeometry args={[coatR(0.98) + 0.004, 0.038, 12, 64]} />
            <meshPhysicalMaterial color="#121212" roughness={0.3} clearcoat={0.8} />
          </mesh>
          <group position={[0, 0.98, coatR(0.98) * DEPTH + 0.035]}>
            <mesh>
              <boxGeometry args={[0.14, 0.11, 0.02]} />
              <meshStandardMaterial color="#E2B23C" metalness={1} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, 0.006]}>
              <boxGeometry args={[0.09, 0.06, 0.02]} />
              <meshStandardMaterial color="#121212" roughness={0.3} />
            </mesh>
          </group>
          {/* Pelzkragen */}
          <mesh position={[0, 1.47, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, DEPTH, 1]}>
            <torusGeometry args={[0.16, 0.05, 12, 40]} />
            <Fur />
          </mesh>
        </group>
        {arm(-1, 0.1 + wave * 2.4, 0.25 + wave * 0.2 + waveA, 0.25 + wave * 0.6)}
        {arm(1, 0.1 + holdR * 0.7, 0.25, 0.3 + holdR * 1.0, hand)}
        {/* Kopf */}
        <group position={[0, 1.68, 0.02]} rotation={[-laugh * 0.2, turn, 0]} scale={1.18}>
          <mesh scale={[0.95, 1.02, 0.95]} castShadow>
            <sphereGeometry args={[0.15, 48, 36]} />
            <Skin />
          </mesh>
          {/* Ohren */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.142, 0.0, -0.01]} scale={[0.35, 1, 0.65]}>
              <sphereGeometry args={[0.035, 16, 12]} />
              <Skin />
            </mesh>
          ))}
          {/* rote Wangen */}
          {[-1, 1].map((s) => (
            <mesh key={`c${s}`} position={[s * 0.075, -0.025, 0.115]} scale={[1, 0.8, 0.6]}>
              <sphereGeometry args={[0.042, 20, 14]} />
              <meshPhysicalMaterial color="#F0A090" roughness={0.55} sheen={0.4} />
            </mesh>
          ))}
          {/* Augen */}
          {[-1, 1].map((s) => (
            <group key={`e${s}`} position={[s * 0.052, 0.03, 0.128]} scale={[1, eyeClose, 1]}>
              <mesh>
                <sphereGeometry args={[0.019, 20, 16]} />
                <meshPhysicalMaterial color="#F6F3EE" roughness={0.15} clearcoat={1} />
              </mesh>
              <mesh position={[0, 0, 0.012]}>
                <sphereGeometry args={[0.011, 16, 12]} />
                <meshPhysicalMaterial color="#3E6FA8" roughness={0.2} clearcoat={1} />
              </mesh>
              <mesh position={[0, 0, 0.0185]}>
                <sphereGeometry args={[0.0055, 12, 8]} />
                <meshBasicMaterial color="#0A0705" />
              </mesh>
              <mesh position={[0.004, 0.004, 0.0205]}>
                <sphereGeometry args={[0.002, 8, 6]} />
                <meshBasicMaterial color="#ffffff" toneMapped={false} />
              </mesh>
            </group>
          ))}
          {/* buschige weiße Brauen */}
          {[-1, 1].map((s) => (
            <mesh key={`b${s}`} position={[s * 0.055, 0.068 + laugh * 0.01, 0.13]} rotation={[0, 0, s * -0.2]} scale={[1, 0.45, 0.5]}>
              <capsuleGeometry args={[0.018, 0.04, 6, 12]} />
              <Fur />
            </mesh>
          ))}
          {/* runde Nase */}
          <mesh position={[0, -0.005, 0.152]}>
            <sphereGeometry args={[0.032, 20, 16]} />
            <meshPhysicalMaterial color="#EBA58F" roughness={0.45} sheen={0.4} />
          </mesh>
          {/* Mund (lacht: weiter offen) */}
          <mesh position={[0, -0.07, 0.132]} scale={[1.4, 0.35 + laugh * 0.5, 0.5]}>
            <sphereGeometry args={[0.02, 16, 12]} />
            <meshStandardMaterial color="#6A2222" roughness={0.6} />
          </mesh>
          {/* Bart aus Büscheln – beginnt unter den Augen */}
          <mesh position={[0, -0.13, 0.075]} scale={[1.05, 1.15, 0.72]}>
            <sphereGeometry args={[0.12, 32, 24]} />
            <Fur />
          </mesh>
          <mesh position={[0, -0.24, 0.07]} scale={[0.8, 1, 0.6]}>
            <sphereGeometry args={[0.085, 24, 18]} />
            <Fur />
          </mesh>
          {[-1, 1].map((s) => (
            <mesh key={`t${s}`} position={[s * 0.105, -0.075, 0.07]} scale={[0.75, 1.1, 0.75]}>
              <sphereGeometry args={[0.065, 20, 16]} />
              <Fur />
            </mesh>
          ))}
          {/* Schnurrbart */}
          {[-1, 1].map((s) => (
            <mesh key={`m${s}`} position={[s * 0.045, -0.045, 0.148]} rotation={[0, s * 0.3, s * 0.35]} scale={[1.7, 0.75, 0.75]}>
              <sphereGeometry args={[0.03, 16, 12]} />
              <Fur />
            </mesh>
          ))}
          {/* weiße Haare an den Seiten */}
          {[-1, 1].map((s) => (
            <mesh key={`h${s}`} position={[s * 0.13, 0.02, -0.05]} scale={[0.6, 1, 1]}>
              <sphereGeometry args={[0.07, 16, 12]} />
              <Fur />
            </mesh>
          ))}
          {/* Zipfelmütze */}
          <group position={[0, 0.075, -0.01]} rotation={[-0.15, 0, 0.05]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.15, 0.045, 14, 40]} />
              <Fur />
            </mesh>
            <mesh position={[0, 0.1, 0]} castShadow>
              <cylinderGeometry args={[0.085, 0.15, 0.2, 32]} />
              <Cloth />
            </mesh>
            <group position={[0, 0.195, 0]} rotation={[0, 0, -1.15 + Math.sin(frame * 0.12) * 0.06]}>
              <mesh position={[0, 0.12, 0]} castShadow>
                <coneGeometry args={[0.085, 0.24, 32]} />
                <Cloth />
              </mesh>
              <mesh position={[0, 0.25, 0]}>
                <sphereGeometry args={[0.05, 20, 16]} />
                <Fur />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};
