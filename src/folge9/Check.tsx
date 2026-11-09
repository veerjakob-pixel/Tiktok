// Prüf-Ansichten für die Modelle aus Folge 9 (nur zum Kontrollieren, nicht im Video)
import React from "react";
import { AbsoluteFill } from "remotion";
import { CineStage } from "../folge6/Stage";
import { Human } from "../folge6/Human";
import { V3 } from "../folge4-3d/Kit";
import { Car, PoliceCap, PriceTag, ShoppingBag, TrafficLight, usePriceTag, Whistle } from "./Props";

const VIEWS: Record<string, { cam: V3; look: V3; fov: number }> = {
  front: { cam: [0, 1.4, 6.5], look: [0, 0.9, 0], fov: 34 },
  quarter: { cam: [4.5, 2.2, 4.5], look: [0, 0.9, 0], fov: 34 },
  side: { cam: [6.5, 1.2, 0], look: [0, 0.9, 0], fov: 34 },
  close: { cam: [0.2, 1.75, 1.1], look: [0, 1.65, 0], fov: 32 },
};

export const ModelCheck9: React.FC<{ view: string }> = ({ view }) => {
  const v = VIEWS[view] ?? VIEWS.front;
  const tag = usePriceTag("-70%");
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#2B3557, #6B7AA0)" }}>
      <CineStage cam={v.cam} look={v.look} fov={v.fov} floor={0} shake={0} bloom={0.4}>
        <Human
          frame={10}
          position={[0, 0, 0]}
          top="#1B2A4A"
          bottom="#1B2A4A"
          skin="#E2B08E"
          hair="#2B1D0E"
          hairStyle="short"
          collar="#E9EEF2"
          pose={{ armR: 1.5, bendR: 0.3, armL: 0.6, bendL: 1.4, gesture: 0 }}
          hand={<Whistle />}
          headExtra={<PoliceCap />}
        />
        <Human frame={10} position={[-1.1, 0, 0.2]} top="#7A2E2E" bottom="#2B2B30" hair="#C8A060" hairStyle="long" pose={{ armR: 0.15, bendR: 0.3, gesture: 0 }} hand={<ShoppingBag color="#C8102E" position={[0, -0.55, 0]} scale={0.7} />} />
        <Car frame={0} color="#2A9D8F" position={[1.2, 0, -1.6]} rotation={[0, 0.4, 0]} />
        <TrafficLight position={[-2.2, 0, -1.4]} state="red" />
        <ShoppingBag color="#0B0B0F" position={[1.0, 0, 1.0]} scale={1.2} />
        <PriceTag tex={tag} position={[-0.6, 0.5, 1.2]} />
      </CineStage>
    </AbsoluteFill>
  );
};
