// Prüf-Ansicht für die gezeichneten Figuren (nicht im Video)
import React from "react";
import { AbsoluteFill } from "remotion";
import { Animal, Bag, Car, StreetBg, ToonCam, ToonPost } from "./Toon";

export const ToonCheck9: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <ToonCam from={[540, 1000, 1]} to={[540, 1000, 1]} dur={1}>
      <StreetBg />
      <Car x={760} y={1560} color="#2A9D8F" driver="raccoon" honk />
      <Animal s="fox" o={{ coat: "#C8402E", scarf: "#F2C14E" }} x={200} y={1300} scale={0.8} pose={{ talk: 0.6, armR: 40, bendR: 60 }} />
      <Animal s="bear" o={{ coat: "#264653", tie: "#E9C46A" }} x={500} y={1300} scale={0.8} pose={{ smile: 0.8 }} />
      <Animal s="dog" o={{ coat: "#1B2A4A", hat: "police" }} x={820} y={1300} scale={0.8} pose={{ armR: 150, bendR: 10, brow: -1, cheeks: 1 }} />
      <Animal s="badger" o={{ coat: "#E9E3D6", apron: "#2A6F5A", glasses: true }} x={200} y={1850} scale={0.8} pose={{ brow: -1, smile: -0.8 }} />
      <Animal s="owl" o={{ coat: "#6B4A3A", tie: "#C8102E", glasses: true }} x={480} y={1850} scale={0.8} />
      <Animal s="rabbit" o={{ coat: "#7A2E2E", hat: "bowler" }} x={720} y={1850} scale={0.8} handR={<Bag color="#1F6FB2" scale={0.8} />} />
      <Animal s="beaver" o={{ coat: "#5E6B78", hat: "cap", hatColor: "#C8102E" }} x={940} y={1850} scale={0.8} />
    </ToonCam>
    <ToonPost />
  </AbsoluteFill>
);
