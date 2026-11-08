// Prüf-Ansichten für Modelle (nur zum Kontrollieren, nicht im Video)
import React from "react";
import { AbsoluteFill } from "remotion";
import { CineStage } from "./Stage";
import { SantaFigure } from "./Santa";
import { V3 } from "../folge4-3d/Kit";

const VIEWS: Record<string, { cam: V3; look: V3; fov: number }> = {
  front: { cam: [0, 1.1, 4.6], look: [0, 0.95, 0], fov: 32 },
  quarter: { cam: [2.6, 1.3, 3.6], look: [0, 0.95, 0], fov: 32 },
  side: { cam: [4.4, 1.1, 0], look: [0, 0.95, 0], fov: 32 },
  face: { cam: [0.25, 1.68, 1.1], look: [0, 1.62, 0], fov: 30 },
};

export const ModelCheck: React.FC<{ view: string; laugh?: number }> = ({ view, laugh = 0 }) => {
  const v = VIEWS[view] ?? VIEWS.front;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#2B3557, #6B7AA0)" }}>
      <CineStage cam={v.cam} look={v.look} fov={v.fov} floor={0} shake={0} bloom={0.4}>
        <SantaFigure frame={10} pose={{ laugh }} />
      </CineStage>
    </AbsoluteFill>
  );
};
