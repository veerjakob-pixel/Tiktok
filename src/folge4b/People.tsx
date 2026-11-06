// 3D-Figuren (Lena + "ich") und der Supermarkt für die Story-Version von Folge 4.
import React from "react";
import * as THREE from "three";
import { Block, F, useCanvasTexture, V3 } from "../folge4-3d/Kit";

// ---------- kleiner Joghurtbecher (für Hand und Regal) ----------
const cupGeo = (() => {
  const pts = [new THREE.Vector2(0, -0.5), new THREE.Vector2(0.38, -0.5), new THREE.Vector2(0.5, 0.5), new THREE.Vector2(0.53, 0.54), new THREE.Vector2(0.5, 0.54)];
  return new THREE.LatheGeometry(pts, 48);
})();

export const useCupLabel = (text: string, color: string, sub: string) =>
  useCanvasTexture(
    1024,
    300,
    (ctx) => {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1024, 300);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff";
      [0, 512].forEach((x) => {
        ctx.font = `120px ${F.bold}`;
        ctx.fillText(text, x + 256, 120);
        ctx.font = `bold 46px ${F.sub}`;
        ctx.fillText(sub, x + 256, 230);
      });
    },
    [text, color, sub],
  );

export const Cup: React.FC<{ label: THREE.Texture; position?: V3; rotation?: V3; scale?: number; lid?: string }> = ({
  label,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  lid = "#D9DEE7",
}) => (
  <group position={position} rotation={rotation} scale={scale}>
    <mesh geometry={cupGeo} castShadow>
      <meshPhysicalMaterial color="#ffffff" roughness={0.35} clearcoat={0.5} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[0, 0.02, 0]}>
      <cylinderGeometry args={[0.49, 0.43, 0.5, 48, 1, true]} />
      <meshStandardMaterial map={label} roughness={0.45} />
    </mesh>
    <mesh position={[0, 0.545, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.53, 48]} />
      <meshStandardMaterial color={lid} metalness={0.6} roughness={0.3} />
    </mesh>
  </group>
);

// ---------- Figur ----------
export type Look = {
  talk?: number; // 0..1 Mundöffnung
  blink?: boolean;
  brow?: number; // >0 Augenbrauen hoch (überrascht), <0 skeptisch
  smile?: number;
  armUp?: number; // rechter Arm nach vorne/oben (0..1)
  headTurn?: number; // Kopf drehen (rad)
  headTilt?: number;
};

export const Person: React.FC<{
  position?: V3;
  rotation?: V3;
  shirt: string;
  pants?: string;
  hair: string;
  hairStyle: "long" | "short";
  skin?: string;
  look?: Look;
  hand?: React.ReactNode; // was die rechte Hand hält
}> = ({ position = [0, 0, 0], rotation = [0, 0, 0], shirt, pants = "#2E3A59", hair, hairStyle, skin = "#F1C9A5", look = {}, hand }) => {
  const { talk = 0, blink = false, brow = 0, smile = 0, armUp = 0, headTurn = 0, headTilt = 0 } = look;
  const skinMat = <meshPhysicalMaterial color={skin} roughness={0.55} sheen={0.5} sheenColor="#ffd8c8" />;
  return (
    <group position={position} rotation={rotation}>
      {/* Beine */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.11, 0.43, 0]} castShadow>
          <capsuleGeometry args={[0.085, 0.7, 6, 16]} />
          <meshStandardMaterial color={pants} roughness={0.8} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={`f${s}`} position={[s * 0.11, 0.05, 0.06]} castShadow>
          <boxGeometry args={[0.13, 0.08, 0.26]} />
          <meshStandardMaterial color="#F4F4F4" roughness={0.6} />
        </mesh>
      ))}
      {/* Oberkörper */}
      <mesh position={[0, 1.02, 0]} scale={[1, 1, 0.75]} castShadow>
        <capsuleGeometry args={[0.215, 0.36, 8, 24]} />
        <meshPhysicalMaterial color={shirt} roughness={0.8} />
      </mesh>
      {/* linker Arm hängt */}
      <group position={[-0.27, 1.3, 0]} rotation={[0, 0, -0.12]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.42, 6, 16]} />
          <meshPhysicalMaterial color={shirt} roughness={0.75} />
        </mesh>
        <mesh position={[0, -0.57, 0]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          {skinMat}
        </mesh>
      </group>
      {/* rechter Arm (kann etwas halten) */}
      <group position={[0.27, 1.3, 0]} rotation={[-armUp * 1.25, 0, 0.12 - armUp * 0.25]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.42, 6, 16]} />
          <meshPhysicalMaterial color={shirt} roughness={0.75} />
        </mesh>
        <mesh position={[0, -0.57, 0]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          {skinMat}
        </mesh>
        {hand && <group position={[0, -0.66, 0.02]} rotation={[armUp * 1.25, 0, 0]}>{hand}</group>}
      </group>
      {/* Hals + Kopf */}
      <mesh position={[0, 1.44, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.12, 16]} />
        {skinMat}
      </mesh>
      <group position={[0, 1.62, 0]} rotation={[0, headTurn, headTilt]}>
        <mesh castShadow>
          <sphereGeometry args={[0.2, 48, 48]} />
          {skinMat}
        </mesh>
        {/* Ohren */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.195, -0.01, 0]} scale={[0.5, 1, 0.7]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            {skinMat}
          </mesh>
        ))}
        {/* Haare */}
        <mesh position={[0, 0.045, -0.015]} scale={[1.07, 0.9, 1.07]}>
          <sphereGeometry args={[0.2, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
          <meshPhysicalMaterial color={hair} roughness={0.5} clearcoat={0.3} />
        </mesh>
        {hairStyle === "long" && (
          <>
            <mesh position={[0, -0.12, -0.09]} castShadow>
              <capsuleGeometry args={[0.17, 0.25, 8, 24]} />
              <meshPhysicalMaterial color={hair} roughness={0.5} clearcoat={0.3} />
            </mesh>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * 0.17, -0.1, 0.02]}>
                <capsuleGeometry args={[0.05, 0.25, 6, 12]} />
                <meshPhysicalMaterial color={hair} roughness={0.5} clearcoat={0.3} />
              </mesh>
            ))}
          </>
        )}
        {/* Augen */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.07, 0.02, 0.172]} scale={[1, blink ? 0.12 : 1, 1]}>
            <mesh>
              <sphereGeometry args={[0.034, 20, 20]} />
              <meshPhysicalMaterial color="#ffffff" roughness={0.2} clearcoat={1} />
            </mesh>
            <mesh position={[0, 0, 0.022]}>
              <sphereGeometry args={[0.019, 16, 16]} />
              <meshPhysicalMaterial color="#2B1D0E" roughness={0.1} clearcoat={1} />
            </mesh>
          </group>
        ))}
        {/* Augenbrauen: brow<0 = skeptisch (eine hoch, eine runter) */}
        {[-1, 1].map((s) => (
          <mesh
            key={`b${s}`}
            position={[s * 0.072, 0.075 + Math.max(0, brow) * 0.025 + (brow < 0 ? (s > 0 ? -brow * 0.03 : brow * 0.01) : 0), 0.18]}
            rotation={[0, 0, s * (brow < 0 ? (s > 0 ? 0.25 : -0.25) * -brow : -0.08)]}
          >
            <boxGeometry args={[0.07, 0.014, 0.012]} />
            <meshStandardMaterial color={hair} />
          </mesh>
        ))}
        {/* Nase */}
        <mesh position={[0, -0.025, 0.195]} scale={[0.8, 1, 0.9]}>
          <sphereGeometry args={[0.025, 16, 16]} />
          {skinMat}
        </mesh>
        {/* Mund: öffnet sich beim Sprechen, Lächeln = breiter */}
        <mesh position={[0, -0.095, 0.178]} scale={[1 + smile * 0.5, 0.15 + talk * 0.85, 0.5]}>
          <sphereGeometry args={[0.04, 20, 20]} />
          <meshStandardMaterial color="#6E2C2C" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
};

// Gesichtsanimation: Mund passend zur Sprache, Blinzeln
export const faceAt = (frame: number, talking: boolean, seed = 0) => {
  const talk = talking ? 0.25 + 0.75 * Math.abs(Math.sin(frame * 0.85 + seed) * Math.cos(frame * 0.37 + seed * 2)) : 0;
  const blink = (frame + seed * 13) % 95 < 3;
  return { talk, blink };
};

// ---------- Supermarkt: Kühlregal mit Joghurts, Boden, Deckenlicht ----------
const useFloorTexture = () =>
  useCanvasTexture(
    512,
    512,
    (ctx) => {
      for (let y = 0; y < 8; y++)
        for (let x = 0; x < 8; x++) {
          ctx.fillStyle = (x + y) % 2 ? "#E9E6DF" : "#D8D4CB";
          ctx.fillRect(x * 64, y * 64, 64, 64);
        }
    },
    [],
  );

export const Market: React.FC<{ cups: { fett: THREE.Texture; normal: THREE.Texture; berry: THREE.Texture } }> = ({ cups }) => {
  const floor = useFloorTexture();
  floor.wrapS = floor.wrapT = THREE.RepeatWrapping;
  floor.repeat.set(6, 6);
  const labels = [cups.fett, cups.normal, cups.berry];
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial map={floor} color="#cfcfcf" roughness={0.35} metalness={0.05} />
      </mesh>
      {/* Wand hinten */}
      <mesh position={[0, 3, -1.6]}>
        <planeGeometry args={[24, 8]} />
        <meshStandardMaterial color="#AFC3D1" roughness={0.9} />
      </mesh>
      {/* Kühlregal */}
      <group position={[0, 0, -1.1]}>
        <Block size={[4.6, 2.3, 0.9]} position={[0, 1.15, -0.05]} color="#F2F4F7" rough={0.4} />
        <Block size={[4.4, 2.0, 0.05]} position={[0, 1.2, -0.45]} color="#9FB8C8" rough={0.3} emissive="#BFE4FF" ei={0.12} />
        {[0.45, 1.05, 1.65].map((y, r) => (
          <group key={r} position={[0, y, 0]}>
            <Block size={[4.4, 0.04, 0.8]} color="#C9CED6" metal={0.6} rough={0.25} />
            {Array.from({ length: 14 }).map((_, i) => (
              <Cup key={i} label={labels[(i + r) % 3]} position={[-2.05 + i * 0.315, 0.16, 0.1 + (i % 2) * 0.06]} rotation={[0, 0.4 + i, 0]} scale={0.26} />
            ))}
          </group>
        ))}
        <Block size={[4.6, 0.25, 0.95]} position={[0, 2.3, 0]} color="#1F7A5C" rough={0.5} />
      </group>
      {/* Deckenlicht */}
      {[-2, 0, 2].map((x) => (
        <mesh key={x} position={[x, 4.2, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.4, 0.18]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
        </mesh>
      ))}
    </group>
  );
};

// Schild über dem Regal
export const useAisleSign = () =>
  useCanvasTexture(
    1024,
    200,
    (ctx) => {
      ctx.fillStyle = "#1F7A5C";
      ctx.fillRect(0, 0, 1024, 200);
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `110px ${F.bold}`;
      ctx.fillText("MOLKEREI", 512, 108);
    },
    [],
  );
