// Prüf-Ansichten für die Modelle aus Folge 8 (nur zum Kontrollieren, nicht im Video)
import React from "react";
import { AbsoluteFill } from "remotion";
import { CineStage } from "../folge6/Stage";
import { V3 } from "../folge4-3d/Kit";
import { Cowboy } from "./Scenes";
import { Cigarette, CigPack, Horse, usePackLabel } from "./Props";

const VIEWS: Record<string, { cam: V3; look: V3; fov: number }> = {
  front: { cam: [0.4, 1.2, 5.6], look: [0.4, 0.95, 0], fov: 34 },
  quarter: { cam: [3.4, 1.5, 4.2], look: [0.4, 0.95, 0], fov: 34 },
  side: { cam: [5.6, 1.2, 0], look: [0.4, 0.95, 0], fov: 34 },
  face: { cam: [0.25, 1.72, 1.1], look: [0, 1.66, 0], fov: 30 },
  props: { cam: [0, 0.2, 2.2], look: [0, 0.1, 0], fov: 32 },
};

export const ModelCheck8: React.FC<{ view: string }> = ({ view }) => {
  const v = VIEWS[view] ?? VIEWS.front;
  const lady = usePackLabel("lady");
  const cow = usePackLabel("cowboy");
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#2B3557, #6B7AA0)" }}>
      <CineStage cam={v.cam} look={v.look} fov={v.fov} floor={0} shake={0} bloom={0.4}>
        {view === "props" ? (
          <group>
            <CigPack label={lady} position={[-0.5, 0.2, 0]} rotation={[0, 0.3, 0]} open={1} />
            <CigPack label={cow} side="#C8102E" position={[0.5, 0.2, 0]} rotation={[0, -0.3, 0]} />
            <Cigarette position={[0, -0.25, 0.3]} rotation={[0, 0, Math.PI / 2]} tip="#C8102E" lipstick={0.5} ember={1} />
          </group>
        ) : (
          <group>
            <Cowboy frame={10} position={[0, 0, 0]} />
            <Horse frame={10} position={[1.2, 0, -0.4]} rotation={[0, -1.2, 0]} />
          </group>
        )}
      </CineStage>
    </AbsoluteFill>
  );
};
