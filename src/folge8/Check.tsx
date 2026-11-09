// Prüf-Ansichten für die Modelle aus Folge 8 (nur zum Kontrollieren, nicht im Video)
import React from "react";
import { AbsoluteFill } from "remotion";
import { CineStage } from "../folge6/Stage";
import { V3 } from "../folge4-3d/Kit";
import { Bean, CoffeeCup, CoffeePot, CoffeeSack, Radio, Steam, useSackLabel, WallClock } from "./Props";

const VIEWS: Record<string, { cam: V3; look: V3; fov: number }> = {
  front: { cam: [0, 0.9, 3.2], look: [0, 0.35, 0], fov: 34 },
  quarter: { cam: [2.2, 1.3, 2.4], look: [0, 0.35, 0], fov: 34 },
  side: { cam: [3.2, 0.6, 0], look: [0, 0.35, 0], fov: 34 },
  close: { cam: [0.3, 0.7, 1.1], look: [0, 0.2, 0], fov: 32 },
};

export const ModelCheck8: React.FC<{ view: string }> = ({ view }) => {
  const v = VIEWS[view] ?? VIEWS.front;
  const label = useSackLabel("KAFFEE");
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#2B3557, #6B7AA0)" }}>
      <CineStage cam={v.cam} look={v.look} fov={v.fov} floor={0} shake={0} bloom={0.4}>
        <CoffeeCup position={[0, 0, 0]} />
        <Steam frame={20} position={[0, 0.36, 0]} scale={0.8} />
        <CoffeePot position={[-0.8, 0, -0.2]} />
        <CoffeeSack label={label} position={[0.9, 0, -0.5]} />
        <Radio frame={10} position={[-0.6, 0, 0.6]} scale={0.5} />
        <WallClock position={[0, 1.3, -1]} minutes={630} />
        <Bean position={[0.4, 0.03, 0.4]} scale={1.5} />
      </CineStage>
    </AbsoluteFill>
  );
};
