// Kino-Bühne für Folge 6: wie Stage3D (folge4-3d/Kit), dazu weiche Schatten, Nebel, Handkamera
// und Post-Effekte (Leuchten, Vignette, Kantenglättung).
import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { V3 } from "../folge4-3d/Kit";
import { Post } from "./Post";

const Env: React.FC<{ intensity: number }> = ({ intensity }) => {
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

const Fog: React.FC<{ color: string; near: number; far: number }> = ({ color, near, far }) => {
  const { scene } = useThree();
  React.useLayoutEffect(() => {
    scene.fog = new THREE.Fog(color, near, far);
    return () => {
      scene.fog = null;
    };
  }, [scene, color, near, far]);
  return null;
};

// Handkamera: kleine, ruhige Bewegung (keine Zufallswerte -> jedes Bild gleich bei jedem Rendern)
export const handheld = (frame: number, amp = 1): V3 => [
  (Math.sin(frame * 0.071) * 0.012 + Math.sin(frame * 0.173) * 0.006) * amp,
  (Math.cos(frame * 0.053) * 0.01 + Math.sin(frame * 0.211) * 0.004) * amp,
  0,
];

const Cam: React.FC<{ pos: V3; look: V3; fov: number; lift: number }> = ({ pos, look, fov, lift }) => {
  const { camera } = useThree();
  const { width, height } = useVideoConfig();
  React.useLayoutEffect(() => {
    const c = camera as THREE.PerspectiveCamera;
    c.position.set(...pos);
    c.setViewOffset(width, height, 0, lift, width, height);
    c.fov = fov;
    c.up.set(0, 1, 0);
    c.lookAt(...look);
    c.updateProjectionMatrix();
  });
  return null;
};

export type CineProps = {
  children: React.ReactNode;
  cam: V3;
  look?: V3;
  fov?: number;
  lift?: number;
  exposure?: number;
  key1?: string;
  keyPos?: V3;
  keyI?: number;
  rim?: string;
  rimI?: number;
  amb?: number;
  fog?: { color: string; near: number; far: number };
  bloom?: number; // Stärke des Leuchtens (0 = aus)
  vignette?: number;
  shake?: number; // Stärke der Handkamera
  env?: number;
  post?: boolean;
  floor?: number | null; // Schattenboden auf dieser Höhe
};

export const CineStage: React.FC<CineProps> = ({
  children,
  cam,
  look = [0, 0, 0],
  fov = 35,
  lift = 0,
  exposure = 1,
  key1 = "#fff4e0",
  keyPos = [4, 7, 6],
  keyI = 2.2,
  rim = "#88aaff",
  rimI = 1.8,
  amb = 0.45,
  fog,
  bloom = 0.8,
  vignette = 0.55,
  shake = 1,
  env = 0.8,
  post = true,
  floor = null,
}) => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();
  const h = handheld(frame, shake);
  const pos: V3 = [cam[0] + h[0], cam[1] + h[1], cam[2]];
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows="soft"
      gl={{ antialias: false, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: exposure, preserveDrawingBuffer: true }}
      camera={{ position: pos, fov, near: 0.1, far: 120 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Env intensity={env} />
      {fog && <Fog {...fog} />}
      <Cam pos={pos} look={look} fov={fov} lift={lift} />
      <hemisphereLight args={["#ffffff", "#2a2a3a", amb]} />
      <directionalLight
        position={keyPos}
        intensity={keyI}
        color={key1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0004}
        shadow-radius={6}
      />
      <directionalLight position={[-5, 3, -4]} intensity={rimI} color={rim} />
      {floor !== null && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, floor, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <shadowMaterial opacity={0.35} />
        </mesh>
      )}
      {children}
      {post && <Post bloom={bloom} vignette={vignette} />}
    </ThreeCanvas>
  );
};
