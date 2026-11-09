// Gezeichneter Look für Folge 9 ("Zeichentrick-Stil"): warme, goldene Beleuchtung, Tusche-Konturen,
// weiche Schattierung, Filmkorn. Eigene Tierfiguren, komplett per SVG-Code gebaut.
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";

export const INK = "#2A1608";
export const SW = 5; // Konturstärke

// ---------- gemeinsame Verläufe/Filter (in jedes SVG einbauen) ----------
export const ToonDefs: React.FC = () => (
  <defs>
    {/* Volumen: oben links Licht, unten rechts Schatten */}
    <linearGradient id="shade" x1="0.15" y1="0" x2="0.85" y2="1">
      <stop offset="0" stopColor="#FFE9B8" stopOpacity="0.35" />
      <stop offset="0.45" stopColor="#FFE9B8" stopOpacity="0" />
      <stop offset="1" stopColor="#3A1500" stopOpacity="0.38" />
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#FFF1C4" stopOpacity="0.95" />
      <stop offset="0.35" stopColor="#FFC870" stopOpacity="0.45" />
      <stop offset="1" stopColor="#FF9A3A" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="glowRed" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#FFD0C0" stopOpacity="0.95" />
      <stop offset="0.35" stopColor="#FF3A3A" stopOpacity="0.45" />
      <stop offset="1" stopColor="#B00010" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="brass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#FFE7A0" />
      <stop offset="0.5" stopColor="#C8902E" />
      <stop offset="1" stopColor="#6B4210" />
    </linearGradient>
    <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#8A4E24" />
      <stop offset="1" stopColor="#4A2410" />
    </linearGradient>
    <linearGradient id="window" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FFF0C0" />
      <stop offset="1" stopColor="#F2A24A" />
    </linearGradient>
  </defs>
);

type ShapeProps = React.SVGProps<SVGPathElement> & { fill: string; noShade?: boolean; sw?: number };
// Pfad mit Tusche-Kontur + Volumen-Schattierung darüber
export const P: React.FC<ShapeProps> = ({ fill, noShade, sw = SW, ...rest }) => (
  <>
    <path {...rest} fill={fill} stroke={INK} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round" />
    {!noShade && <path d={rest.d} transform={rest.transform} fill="url(#shade)" />}
  </>
);
export const E: React.FC<{ cx: number; cy: number; rx: number; ry: number; fill: string; noShade?: boolean; sw?: number; rot?: number }> = ({ cx, cy, rx, ry, fill, noShade, sw = SW, rot = 0 }) => (
  <g transform={`rotate(${rot} ${cx} ${cy})`}>
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} stroke={sw ? INK : "none"} strokeWidth={sw} />
    {!noShade && <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#shade)" />}
  </g>
);
export const R: React.FC<{ x: number; y: number; w: number; h: number; fill: string; r?: number; noShade?: boolean; sw?: number }> = ({ x, y, w, h, fill, r = 8, noShade, sw = SW }) => (
  <>
    <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={sw ? INK : "none"} strokeWidth={sw} />
    {!noShade && <rect x={x} y={y} width={w} height={h} rx={r} fill="url(#shade)" />}
  </>
);
export const Glow: React.FC<{ x: number; y: number; r: number; red?: boolean; o?: number }> = ({ x, y, r, red, o = 1 }) => (
  <circle cx={x} cy={y} r={r} fill={red ? "url(#glowRed)" : "url(#glow)"} opacity={o} style={{ mixBlendMode: "screen" }} />
);

// ---------- Tierfiguren ----------
export type Species = "fox" | "bear" | "dog" | "badger" | "rabbit" | "raccoon" | "owl" | "beaver" | "duck";
export type Outfit = { coat: string; pants?: string; shirt?: string; tie?: string; hat?: "bowler" | "police" | "fedora" | "cap" | "none"; hatColor?: string; apron?: string; glasses?: boolean; scarf?: string; shoes?: string };
export type ToonPose = {
  talk?: number; // 0..1 Mund offen
  blink?: boolean;
  brow?: number; // >0 überrascht, <0 böse
  smile?: number; // -1 traurig .. 1 lacht
  look?: number; // Pupillen links/rechts (-1..1)
  tilt?: number; // Kopf neigen (Grad)
  armL?: number; // Grad, 0 = hängt, 90 = waagerecht nach außen, 160 = hoch
  armR?: number;
  bendL?: number; // Ellbogen (Grad)
  bendR?: number;
  walk?: number; // Laufphase (rad)
  cheeks?: number; // Backen aufblasen (Pfeife)
};

const FUR: Record<Species, { fur: string; belly: string; dark: string }> = {
  fox: { fur: "#E8742A", belly: "#FFF1DC", dark: "#3A1E10" },
  bear: { fur: "#8A5530", belly: "#D9B08A", dark: "#3A2010" },
  dog: { fur: "#D9A86A", belly: "#F4E2C4", dark: "#5A3418" },
  badger: { fur: "#8E8C8A", belly: "#F4F1EA", dark: "#1E1E22" },
  rabbit: { fur: "#E9E1D6", belly: "#FFFFFF", dark: "#B89A8A" },
  raccoon: { fur: "#8E8A88", belly: "#E8E4DE", dark: "#26242A" },
  owl: { fur: "#9A6A3A", belly: "#E8D2A8", dark: "#4A2E14" },
  beaver: { fur: "#7A4A26", belly: "#C89A6A", dark: "#3A2010" },
  duck: { fur: "#F4F1EA", belly: "#FFFFFF", dark: "#E89A2A" },
};

const Arm: React.FC<{ side: 1 | -1; angle: number; bend: number; color: string; paw: string; hand?: React.ReactNode }> = ({ side, angle, bend, color, paw, hand }) => (
  <g transform={`translate(${side * 72} -385) rotate(${side * -angle})`}>
    <P fill={color} d="M -20 0 Q -24 50 -18 95 L 18 95 Q 22 50 20 0 Z" />
    <g transform={`translate(0 90) rotate(${side * -bend})`}>
      <P fill={color} d="M -17 0 Q -19 45 -14 82 L 14 82 Q 19 45 17 0 Z" />
      <E cx={0} cy={92} rx={20} ry={18} fill={paw} />
      <g transform="translate(0 100)">{hand}</g>
    </g>
  </g>
);

const Hat: React.FC<{ type: Outfit["hat"]; color: string }> = ({ type, color }) => {
  if (!type || type === "none") return null;
  if (type === "bowler")
    return (
      <g transform="translate(0 -555)">
        <E cx={0} cy={18} rx={95} ry={16} fill={color} />
        <P fill={color} d="M -62 18 Q -66 -55 0 -58 Q 66 -55 62 18 Z" />
        <path d="M -62 6 Q 0 16 62 6" stroke="#6B4A2A" strokeWidth={8} fill="none" />
      </g>
    );
  if (type === "fedora")
    return (
      <g transform="translate(0 -552)">
        <E cx={0} cy={16} rx={105} ry={18} fill={color} />
        <P fill={color} d="M -64 16 Q -62 -50 -20 -48 Q 0 -30 20 -48 Q 62 -50 64 16 Z" />
        <path d="M -63 2 L 63 2" stroke="#2A1608" strokeWidth={10} />
      </g>
    );
  if (type === "cap")
    return (
      <g transform="translate(0 -548)">
        <P fill={color} d="M -70 10 Q -70 -48 0 -50 Q 70 -48 70 10 Z" />
        <P fill={color} d="M -10 4 Q 60 0 110 14 Q 60 24 -10 18 Z" />
      </g>
    );
  // Polizeimütze
  return (
    <g transform="translate(0 -552)">
      <P fill="#1B2A4A" d="M -72 14 L -66 -22 L 66 -22 L 72 14 Z" />
      <P fill="#1B2A4A" d="M -96 -24 Q 0 -70 96 -24 Q 0 -40 -96 -24 Z" />
      <P fill="#0B0F18" d="M -74 12 Q 0 44 74 12 Q 0 28 -74 12 Z" />
      <path d="M -70 0 L 70 0" stroke="#F2C14E" strokeWidth={5} />
      <E cx={0} cy={-18} rx={14} ry={16} fill="#F2C14E" />
    </g>
  );
};

const Ears: React.FC<{ s: Species; c: { fur: string; belly: string; dark: string } }> = ({ s, c }) => {
  switch (s) {
    case "fox":
      return (
        <>
          {[-1, 1].map((k) => (
            <g key={k} transform={`scale(${k} 1)`}>
              <P fill={c.fur} d="M 30 -540 L 78 -620 L 92 -520 Z" />
              <P fill={c.belly} noShade d="M 46 -538 L 76 -594 L 84 -528 Z" sw={3} />
              <path d="M 72 -606 L 78 -620 L 84 -598 Z" fill={c.dark} />
            </g>
          ))}
        </>
      );
    case "rabbit":
      return (
        <>
          {[-1, 1].map((k) => (
            <g key={k} transform={`scale(${k} 1) rotate(${12} 40 -540)`}>
              <E cx={40} cy={-640} rx={26} ry={92} fill={c.fur} />
              <E cx={40} cy={-635} rx={13} ry={70} fill="#F4B8B8" noShade sw={0} />
            </g>
          ))}
        </>
      );
    case "dog":
      return (
        <>
          {[-1, 1].map((k) => (
            <g key={k} transform={`scale(${k} 1)`}>
              <P fill={c.dark} d="M 60 -540 Q 120 -540 118 -480 Q 100 -470 80 -500 Z" />
            </g>
          ))}
        </>
      );
    case "owl":
      return (
        <>
          {[-1, 1].map((k) => (
            <g key={k} transform={`scale(${k} 1)`}>
              <P fill={c.fur} d="M 40 -548 L 74 -600 L 82 -530 Z" />
            </g>
          ))}
        </>
      );
    case "duck":
      return null;
    default:
      // runde Ohren (Bär, Dachs, Waschbär, Biber)
      return (
        <>
          {[-1, 1].map((k) => (
            <g key={k}>
              <E cx={k * 66} cy={-548} rx={26} ry={24} fill={s === "raccoon" ? c.dark : c.fur} />
              <E cx={k * 66} cy={-546} rx={13} ry={12} fill={s === "raccoon" ? "#F4F1EA" : c.belly} noShade sw={0} />
            </g>
          ))}
        </>
      );
  }
};

export const Animal: React.FC<{ s: Species; o: Outfit; pose?: ToonPose; x?: number; y?: number; scale?: number; flip?: boolean; handR?: React.ReactNode; handL?: React.ReactNode; seed?: number }> = ({
  s,
  o,
  pose = {},
  x = 0,
  y = 0,
  scale = 1,
  flip = false,
  handR,
  handL,
  seed = 0,
}) => {
  const frame = useCurrentFrame();
  const c = FUR[s];
  const { talk = 0, brow = 0, smile = 0.2, look = 0, tilt = 0, cheeks = 0 } = pose;
  const blink = pose.blink ?? (frame + seed * 17 + 40) % 96 < 3;
  const w = pose.walk;
  const breathe = Math.sin((frame + seed * 11) * 0.09) * 3;
  const bob = w === undefined ? 0 : Math.abs(Math.cos(w)) * -10;
  const legA = w === undefined ? 0 : Math.sin(w) * 22;
  const armSwing = w === undefined ? 0 : Math.sin(w) * 18;
  const pants = o.pants ?? "#3A3540";
  const shoes = o.shoes ?? "#2A1A10";
  const head = (
    <g transform={`rotate(${tilt} 0 -470)`}>
      <Ears s={s} c={c} />
      {/* Kopf */}
      {s === "owl" ? (
        <E cx={0} cy={-480} rx={88} ry={80} fill={c.fur} />
      ) : s === "dog" ? (
        <P fill={c.fur} d="M -92 -480 Q -96 -560 0 -566 Q 96 -560 92 -480 Q 92 -410 0 -404 Q -92 -410 -92 -480 Z" />
      ) : s === "duck" ? (
        <E cx={0} cy={-482} rx={74} ry={76} fill={c.fur} />
      ) : (
        <E cx={0} cy={-478} rx={s === "bear" ? 86 : 80} ry={74} fill={c.fur} />
      )}
      {/* Fellzeichnung */}
      {s === "fox" && <P fill={c.belly} noShade sw={3} d="M -78 -470 Q -40 -440 0 -470 Q 40 -440 78 -470 Q 60 -410 0 -406 Q -60 -410 -78 -470 Z" />}
      {s === "badger" && (
        <>
          {[-1, 1].map((k) => (
            <path key={k} d={`M ${k * 22} -548 Q ${k * 40} -490 ${k * 34} -440 L ${k * 56} -446 Q ${k * 62} -500 ${k * 44} -545 Z`} fill={c.dark} />
          ))}
          <path d="M -18 -552 Q 0 -560 18 -552 L 12 -440 L -12 -440 Z" fill="#F4F1EA" />
        </>
      )}
      {s === "raccoon" && <path d="M -78 -500 Q -40 -520 0 -494 Q 40 -520 78 -500 Q 70 -462 30 -466 Q 0 -480 -30 -466 Q -70 -462 -78 -500 Z" fill={c.dark} />}
      {s === "owl" && (
        <>
          <E cx={-36} cy={-488} rx={36} ry={34} fill={c.belly} noShade sw={3} />
          <E cx={36} cy={-488} rx={36} ry={34} fill={c.belly} noShade sw={3} />
        </>
      )}
      {/* Schnauze */}
      {(s === "bear" || s === "beaver" || s === "dog") && <E cx={0} cy={-440} rx={s === "dog" ? 56 : 40} ry={s === "dog" ? 36 : 30} fill={c.belly} noShade sw={3} />}
      {s === "rabbit" && <E cx={0} cy={-446} rx={30} ry={22} fill={c.belly} noShade sw={0} />}
      {/* Backen (Pfeife) */}
      {cheeks > 0 &&
        [-1, 1].map((k) => <E key={k} cx={k * 44} cy={-438} rx={22 + cheeks * 12} ry={18 + cheeks * 10} fill={c.fur} />)}
      {/* Augen */}
      {[-1, 1].map((k) => {
        const ex = k * (s === "owl" ? 36 : 32);
        const ey = s === "owl" ? -488 : -490;
        const r = s === "owl" ? 22 : 17;
        return (
          <g key={k}>
            <E cx={ex} cy={ey} rx={r} ry={r * 1.15} fill="#FFFFFF" noShade sw={3} />
            {!blink && (
              <>
                <circle cx={ex + look * 6} cy={ey + 3} r={r * 0.55} fill={s === "fox" ? "#2E6B3A" : "#3A2414"} />
                <circle cx={ex + look * 6} cy={ey + 3} r={r * 0.32} fill="#0B0605" />
                <circle cx={ex + look * 6 - 4} cy={ey - 3} r={r * 0.17} fill="#FFFFFF" />
              </>
            )}
            {blink && <path d={`M ${ex - r} ${ey} Q ${ex} ${ey + 8} ${ex + r} ${ey}`} stroke={INK} strokeWidth={4} fill="none" />}
            {/* Brauen */}
            <path
              d={`M ${ex - 18} ${ey - r * 1.2 - 12 - brow * 6} Q ${ex} ${ey - r * 1.2 - 22 - brow * 8} ${ex + 18} ${ey - r * 1.2 - 12 - brow * 6}`}
              transform={`rotate(${k * -brow * 14} ${ex} ${ey - r * 1.2 - 14})`}
              stroke={c.dark === "#E89A2A" ? INK : c.dark}
              strokeWidth={7}
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );
      })}
      {o.glasses &&
        [-1, 1].map((k) => <circle key={k} cx={k * 32} cy={-490} r={24} fill="rgba(200,230,255,0.15)" stroke="#1A1A1A" strokeWidth={4} />)}
      {o.glasses && <path d="M -8 -492 L 8 -492" stroke="#1A1A1A" strokeWidth={4} />}
      {/* Nase / Schnabel */}
      {s === "duck" ? (
        <P fill={c.dark} d="M -38 -452 Q 0 -472 38 -452 Q 40 -428 0 -424 Q -40 -428 -38 -452 Z" />
      ) : s === "owl" ? (
        <P fill="#E8A030" d="M -12 -470 L 12 -470 L 0 -440 Z" sw={3} />
      ) : (
        <E cx={0} cy={s === "dog" ? -456 : -452} rx={s === "dog" ? 20 : 13} ry={s === "dog" ? 13 : 9} fill={s === "rabbit" ? "#E89A9A" : "#1A0E08"} sw={2} />
      )}
      {/* Mund */}
      {talk > 0.05 ? (
        <g>
          <E cx={0} cy={-426 + (s === "dog" ? 6 : 0)} rx={16 + talk * 4} ry={5 + talk * 14} fill="#5A1010" noShade sw={4} />
          <E cx={0} cy={-420 + talk * 6 + (s === "dog" ? 6 : 0)} rx={9} ry={3 + talk * 4} fill="#E86A6A" noShade sw={0} />
        </g>
      ) : (
        <path d={`M -20 ${-428 - smile * 2} Q 0 ${-428 + smile * 14} 20 ${-428 - smile * 2}`} stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
      )}
      {s === "beaver" && <R x={-10} y={-418} w={20} h={18} r={3} fill="#FFFFFF" sw={3} noShade />}
      {s === "dog" && talk < 0.05 && [-1, 1].map((k) => <path key={k} d={`M ${k * 10} -424 L ${k * 14} -436 L ${k * 18} -424 Z`} fill="#FFF" stroke={INK} strokeWidth={2} />)}
      <Hat type={o.hat} color={o.hatColor ?? "#2A1E18"} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${flip ? -scale : scale} ${scale})`}>
      {/* Schatten */}
      <ellipse cx={0} cy={4} rx={90} ry={16} fill="rgba(20,8,0,0.35)" />
      {/* Beine */}
      {[-1, 1].map((k) => (
        <g key={k} transform={`translate(${k * 30} -205) rotate(${k * legA})`}>
          <P fill={pants} d="M -22 0 L -20 190 L 20 190 L 22 0 Z" />
          <P fill={shoes} d="M -26 182 Q -30 208 0 208 L 34 208 Q 40 190 20 182 Z" />
        </g>
      ))}
      <g transform={`translate(0 ${breathe * 0.3})`}>
        {/* Rumpf / Mantel */}
        <P fill={o.coat} d="M -80 -400 Q -96 -300 -84 -200 L 84 -200 Q 96 -300 80 -400 Q 0 -420 -80 -400 Z" />
        <P fill={o.shirt ?? c.belly} noShade sw={3} d="M -26 -404 L 0 -330 L 26 -404 Z" />
        {o.tie && <P fill={o.tie} d="M -8 -396 L 8 -396 L 12 -320 L 0 -304 L -12 -320 Z" sw={3} />}
        {o.scarf && <P fill={o.scarf} d="M -60 -408 Q 0 -380 60 -408 Q 64 -388 0 -366 Q -64 -388 -60 -408 Z" />}
        {o.apron && <P fill={o.apron} d="M -54 -360 L 54 -360 L 66 -206 L -66 -206 Z" />}
        {[-330, -280, -232].map((yy) => (
          <circle key={yy} cx={0} cy={yy} r={5} fill="#E9D9A8" stroke={INK} strokeWidth={2} />
        ))}
        <Arm side={-1} angle={(pose.armL ?? 8) + armSwing} bend={pose.bendL ?? 10} color={o.coat} paw={c.fur} hand={handL} />
        <Arm side={1} angle={(pose.armR ?? 8) - armSwing} bend={pose.bendR ?? 10} color={o.coat} paw={c.fur} hand={handR} />
        {head}
      </g>
    </g>
  );
};

// ---------- Requisiten ----------
export const Bag: React.FC<{ color: string; x?: number; y?: number; scale?: number; rot?: number; label?: string }> = ({ color, x = 0, y = 0, scale = 1, rot = 0, label }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
    <path d="M -22 -40 Q -22 -80 0 -80 Q 22 -80 22 -40" stroke={INK} strokeWidth={6} fill="none" />
    <P fill={color} d="M -50 -44 L 50 -44 L 56 60 L -56 60 Z" />
    {label && (
      <text x={0} y={18} textAnchor="middle" fontFamily="Anton" fontSize={34} fill="#FFFFFF" stroke={INK} strokeWidth={1.5}>
        {label}
      </text>
    )}
  </g>
);

export const Tag: React.FC<{ text: string; x: number; y: number; rot?: number; scale?: number }> = ({ text, x, y, rot = 0, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
    <P fill="#FFD60A" d="M 0 -60 L 44 -30 L 44 70 L -44 70 L -44 -30 Z" />
    <circle cx={0} cy={-30} r={8} fill={INK} />
    <text x={0} y={36} textAnchor="middle" fontFamily="Anton" fontSize={42} fill={INK}>
      {text}
    </text>
  </g>
);

export const Coin: React.FC<{ x: number; y: number; r?: number; spin?: number }> = ({ x, y, r = 26, spin = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${Math.max(0.15, Math.abs(Math.cos(spin)))} 1)`}>
    <circle r={r} fill="url(#brass)" stroke={INK} strokeWidth={4} />
    <text y={r * 0.38} textAnchor="middle" fontFamily="Anton" fontSize={r * 1.1} fill="#6B4210">
      $
    </text>
  </g>
);

// Auto im 50er-Stil, von der Seite; Fahrer schaut raus und hupt
export const Car: React.FC<{ x: number; y: number; color: string; scale?: number; flip?: boolean; driver?: Species; honk?: boolean; seed?: number }> = ({ x, y, color, scale = 1, flip = false, driver, honk, seed = 0 }) => {
  const frame = useCurrentFrame();
  const shake = honk ? Math.sin(frame * 2 + seed) * 2 : Math.sin(frame * 0.6 + seed) * 0.8;
  return (
    <g transform={`translate(${x} ${y + shake}) scale(${flip ? -scale : scale} ${scale})`}>
      <ellipse cx={0} cy={6} rx={200} ry={18} fill="rgba(20,8,0,0.35)" />
      {driver && (
        <g transform="translate(20 -60) scale(0.36)">
          <Animal s={driver} o={{ coat: "#5E4A3A", hat: seed % 2 ? "fedora" : "none" }} pose={{ talk: honk ? 0.8 : 0, brow: honk ? -1 : 0, smile: -0.5 }} seed={seed} />
        </g>
      )}
      <P fill="#BFD7EA" d="M -70 -110 Q -40 -170 40 -170 Q 100 -168 120 -110 Z" noShade />
      <P fill={color} d="M -190 -30 Q -196 -96 -110 -104 L -76 -110 Q -40 -176 40 -176 Q 106 -174 130 -110 L 170 -104 Q 206 -90 200 -30 Q 196 -6 160 -6 L -160 -6 Q -192 -8 -190 -30 Z" />
      <path d="M -70 -110 Q -40 -168 40 -168 Q 100 -166 120 -110 Z" fill="rgba(190,220,240,0.55)" stroke={INK} strokeWidth={4} />
      <path d="M 26 -168 L 30 -110" stroke={INK} strokeWidth={4} />
      <path d="M -186 -50 L 196 -50" stroke="#F4F1EA" strokeWidth={6} opacity={0.7} />
      <R x={-206} y={-36} w={40} h={16} r={8} fill="url(#brass)" sw={3} noShade />
      <R x={176} y={-36} w={40} h={16} r={8} fill="url(#brass)" sw={3} noShade />
      {[-110, 110].map((wx) => (
        <g key={wx} transform={`translate(${wx} -8)`}>
          <circle r={38} fill="#1A1210" stroke={INK} strokeWidth={4} />
          <circle r={18} fill="#E9E3D6" stroke={INK} strokeWidth={3} />
        </g>
      ))}
      <Glow x={196} y={-64} r={60} />
      <circle cx={194} cy={-64} r={12} fill="#FFF6D0" stroke={INK} strokeWidth={3} />
      <Glow x={-190} y={-62} r={40} red />
    </g>
  );
};

// ---------- Hintergründe ----------
const windowsGrid = (x: number, y: number, cols: number, rows: number, seed: number) =>
  Array.from({ length: cols * rows }).map((_, i) => {
    const cx = x + (i % cols) * 90;
    const cy = y + Math.floor(i / cols) * 130;
    const lit = random(`w${seed}-${i}`) > 0.3;
    return (
      <g key={i}>
        <rect x={cx} y={cy} width={56} height={84} rx={4} fill={lit ? "url(#window)" : "#2A2030"} stroke={INK} strokeWidth={4} />
        <path d={`M ${cx + 28} ${cy} L ${cx + 28} ${cy + 84} M ${cx} ${cy + 40} L ${cx + 56} ${cy + 40}`} stroke={INK} strokeWidth={3} />
      </g>
    );
  });

// Innenstadt in der Abenddämmerung mit Kaufhaus (Breite 2200, damit die Kamera fahren kann)
export const StreetBg: React.FC<{ store?: string; banner?: React.ReactNode; snow?: boolean }> = ({ store = "KAUFHAUS", banner, snow = true }) => {
  const frame = useCurrentFrame();
  return (
    <g>
      <rect x={-600} y={-200} width={2400} height={2400} fill="#2A2240" />
      <rect x={-600} y={-200} width={2400} height={900} fill="#3A2A4A" />
      <rect x={-600} y={300} width={2400} height={500} fill="#6A3A3A" opacity={0.5} />
      {/* Häuser hinten */}
      {[-560, -300, 1280, 1520].map((bx, i) => (
        <g key={bx}>
          <P fill={["#5A3A34", "#4A3A4E", "#64453A", "#4A3A4E"][i]} d={`M ${bx} 1300 L ${bx} ${80 + i * 40} L ${bx + 250} ${60 + i * 40} L ${bx + 250} 1300 Z`} />
          {windowsGrid(bx + 30, 160 + i * 40, 2, 7, i)}
        </g>
      ))}
      {/* Kaufhaus */}
      <P fill="#8A4A2E" d="M -60 1300 L -60 160 Q 540 60 1140 160 L 1140 1300 Z" />
      <path d="M -60 260 Q 540 170 1140 260" stroke="url(#brass)" strokeWidth={22} fill="none" />
      {windowsGrid(20, 300, 12, 3, 9)}
      <R x={140} y={720} w={800} h={130} r={14} fill="#1E1410" />
      <text x={540} y={815} textAnchor="middle" fontFamily="Abril Fatface" fontSize={92} fill="#FFD27A" style={{ filter: "drop-shadow(0 0 14px #FFB347)" }}>
        {store}
      </text>
      {banner}
      {/* Markise */}
      <P fill="#B81E2E" d="M -40 880 L 1120 880 L 1160 960 L -80 960 Z" />
      {Array.from({ length: 13 }).map((_, i) => (
        <path key={i} d={`M ${-60 + i * 95} 960 Q ${-12 + i * 95} 1000 ${35 + i * 95} 960`} fill="#F4E4D4" stroke={INK} strokeWidth={4} />
      ))}
      {/* Schaufenster */}
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <rect x={20 + k * 360} y={1000} width={320} height={260} fill="url(#window)" stroke={INK} strokeWidth={6} />
          <Glow x={180 + k * 360} y={1120} r={260} o={0.55 + 0.1 * Math.sin(frame * 0.2 + k)} />
          {[0, 1, 2].map((j) => (
            <rect key={j} x={50 + k * 360 + j * 95} y={1130 - j * 18} width={70} height={110 + j * 18} rx={6} fill={["#C8102E", "#1F6FB2", "#2A9D8F"][(j + k) % 3]} stroke={INK} strokeWidth={4} />
          ))}
        </g>
      ))}
      {/* Gehweg + Straße */}
      <rect x={-600} y={1260} width={2400} height={90} fill="#8E7C6C" stroke={INK} strokeWidth={5} />
      <rect x={-600} y={1350} width={2400} height={900} fill="#3A3238" />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={-560 + i * 220} y={1650} width={120} height={14} rx={6} fill="#E9D9A0" opacity={0.7} />
      ))}
      {/* Laternen */}
      {[-200, 1280].map((lx) => (
        <g key={lx}>
          <path d={`M ${lx} 1300 L ${lx} 760`} stroke="#1B1D24" strokeWidth={16} />
          <P fill="#1B1D24" d={`M ${lx - 34} 760 L ${lx + 34} 760 L ${lx + 22} 690 L ${lx - 22} 690 Z`} />
          <rect x={lx - 22} y={700} width={44} height={54} fill="#FFE6A0" />
          <Glow x={lx} y={730} r={240} o={0.9} />
        </g>
      ))}
      {/* Lichterkette */}
      {Array.from({ length: 22 }).map((_, i) => {
        const lx = -100 + i * 60;
        const ly = 660 + Math.sin((i / 21) * Math.PI) * 70;
        return <Glow key={i} x={lx} y={ly} r={26 + 6 * Math.sin(frame * 0.25 + i)} red={i % 3 === 1} />;
      })}
      {snow &&
        Array.from({ length: 60 }).map((_, i) => {
          const sx = (random(`sx${i}`) * 2400 - 600 + Math.sin(frame * 0.03 + i) * 30) % 2400;
          const sy = ((random(`sy${i}`) * 2000 + frame * (2 + random(`sv${i}`) * 3)) % 2000) - 100;
          return <circle key={i} cx={sx} cy={sy} r={3 + random(`sr${i}`) * 4} fill="#FFF8E8" opacity={0.75} />;
        })}
    </g>
  );
};

// Laden innen: Regale, Messinglampen, Tresen mit Kasse
export const ShopBg: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <g>
      <rect x={-300} y={-200} width={1700} height={2400} fill="url(#wood)" />
      {[0, 1, 2, 3].map((r) => (
        <g key={r}>
          <rect x={-200} y={320 + r * 230} width={1500} height={22} fill="#3A1E0C" stroke={INK} strokeWidth={4} />
          {Array.from({ length: 11 }).map((_, i) => (
            <R key={i} x={-180 + i * 136} y={200 + r * 230} w={110} h={120} r={6} fill={["#C8102E", "#1F6FB2", "#E9B44C", "#2A9D8F", "#8A4E9A"][(i + r) % 5]} />
          ))}
        </g>
      ))}
      {[180, 900].map((lx) => (
        <g key={lx}>
          <path d={`M ${lx} -200 L ${lx} 120`} stroke="#3A2410" strokeWidth={6} />
          <P fill="url(#brass)" d={`M ${lx - 70} 190 Q ${lx} 90 ${lx + 70} 190 Z`} noShade />
          <Glow x={lx} y={200} r={300} o={0.85 + 0.08 * Math.sin(frame * 0.3 + lx)} />
        </g>
      ))}
      <rect x={-300} y={1200} width={1700} height={1000} fill="#3A2214" />
    </g>
  );
};

export const CounterFg: React.FC<{ y?: number }> = ({ y = 1180 }) => (
  <g transform={`translate(0 ${y})`}>
    <P fill="url(#wood)" d="M -200 0 L 1300 0 L 1300 700 L -200 700 Z" noShade />
    <rect x={-200} y={-20} width={1500} height={36} fill="#2A140A" stroke={INK} strokeWidth={5} />
    {Array.from({ length: 6 }).map((_, i) => (
      <rect key={i} x={-150 + i * 250} y={70} width={200} height={220} rx={10} fill="none" stroke="#2A140A" strokeWidth={6} />
    ))}
    {/* Registrierkasse */}
    <g transform="translate(820 -20)">
      <P fill="url(#brass)" d="M -110 0 L -90 -170 L 90 -170 L 110 0 Z" noShade />
      <R x={-70} y={-240} w={140} h={74} r={10} fill="#2A1608" />
      <text x={0} y={-188} textAnchor="middle" fontFamily="Anton" fontSize={40} fill="#FFD27A">
        $ 0.00
      </text>
      {[0, 1, 2].map((r) => [0, 1, 2, 3].map((k) => <circle key={`${r}${k}`} cx={-60 + k * 40} cy={-130 + r * 38} r={13} fill="#F4F1EA" stroke={INK} strokeWidth={3} />))}
    </g>
  </g>
);

// Büro 1981: Holzvertäfelung, grüne Bankerlampe, Fenster mit Stadt bei Nacht
export const OfficeBg: React.FC = () => (
  <g>
    <rect x={-300} y={-200} width={1700} height={2400} fill="#5A3A22" />
    {Array.from({ length: 9 }).map((_, i) => (
      <rect key={i} x={-260 + i * 180} y={700} width={150} height={600} rx={8} fill="#6B4428" stroke="#3A2010" strokeWidth={6} />
    ))}
    <R x={540} y={140} w={420} h={480} r={10} fill="#1A2440" />
    {windowsGrid(570, 330, 4, 2, 4)}
    <path d="M 750 140 L 750 620 M 540 380 L 960 380" stroke={INK} strokeWidth={10} />
    <R x={60} y={220} w={300} h={220} r={6} fill="#F4EEE0" />
    <text x={210} y={300} textAnchor="middle" fontFamily="Abril Fatface" fontSize={48} fill="#2B1D0E">
      1981
    </text>
    <path d="M 100 380 L 160 340 L 220 360 L 320 270" stroke="#D62828" strokeWidth={10} fill="none" />
  </g>
);

// ---------- Kamera + Nachbearbeitung ----------
// Ken-Burns-Fahrt über eine große Zeichnung (viewBox 1080x1920)
export const ToonCam: React.FC<{ children: React.ReactNode; from: [number, number, number]; to: [number, number, number]; dur: number; shake?: number; shakeAt?: number }> = ({ children, from, to, dur, shake = 0, shakeAt = -999 }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const e = t * t * (3 - 2 * t);
  const [x, y, s] = from.map((v, i) => v + (to[i] - v) * e);
  const d = Math.max(0, 1 - Math.abs(frame - shakeAt) / 10);
  const sx = Math.sin(frame * 2.7) * shake * d;
  const sy = Math.cos(frame * 3.3) * shake * d;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <ToonDefs />
        <g transform={`translate(${540 + sx} ${960 + sy}) scale(${s}) translate(${-x} ${-y})`}>{children}</g>
      </svg>
    </AbsoluteFill>
  );
};

// Warmer Film-Look: goldene Tönung, Vignette, feine Zeilen, Filmkorn, Staub im Licht
export const ToonPost: React.FC<{ warm?: number }> = ({ warm = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,190,90,0.10), rgba(255,140,40,0.14))", mixBlendMode: "soft-light", opacity: warm }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(20,6,0,0.62) 100%)" }} />
      <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.07) 0 2px, transparent 2px 6px)" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", opacity: 0.16, mixBlendMode: "overlay" }}>
        <filter id={`grain${frame % 4}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 4} />
        </filter>
        <rect width={1080} height={1920} filter={`url(#grain${frame % 4})`} />
      </svg>
      {Array.from({ length: 22 }).map((_, i) => {
        const x = (random(`dx${i}`) * 1080 + Math.sin(frame * 0.02 + i) * 40) % 1080;
        const y = (random(`dy${i}`) * 1920 - frame * (0.4 + random(`dv${i}`))) % 1920;
        return <div key={i} style={{ position: "absolute", left: x, top: y < 0 ? y + 1920 : y, width: 5, height: 5, borderRadius: 3, background: "rgba(255,230,170,0.55)", filter: "blur(1px)" }} />;
      })}
    </AbsoluteFill>
  );
};
