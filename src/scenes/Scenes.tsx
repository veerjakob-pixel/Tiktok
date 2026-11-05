import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import {
  COLORS,
  FONT_BOLD,
  FONT_SUB,
  FONT_VINTAGE,
  pop,
  punch,
  shake,
} from "../theme";
import {
  Apple,
  Barrel,
  Bottle,
  Doctor,
  Farmer,
  Heart,
  Magnifier,
  Stamp,
  StudyDoc,
} from "../components/Graphics";
import { Poster } from "../components/Poster";
import { Vintage } from "../components/Overlays";
import { SceneProps, Shot, Stage } from "./helpers";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Hintergründe
const ModernBg: React.FC<{ a: string; b: string; rays?: boolean }> = ({
  a,
  b,
  rays = true,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 35%, ${a} 0%, ${b} 75%)`,
      }}
    >
      {rays && (
        <AbsoluteFill
          style={{
            opacity: 0.12,
            transform: `rotate(${frame * 0.4}deg) scale(2.2)`,
          }}
        >
          <svg viewBox="-100 -100 200 200" width="100%" height="100%">
            {Array.from({ length: 16 }).map((_, i) => {
              const a1 = (i / 16) * Math.PI * 2;
              const a2 = a1 + Math.PI / 16;
              return (
                <polygon
                  key={i}
                  points={`0,0 ${Math.cos(a1) * 200},${Math.sin(a1) * 200} ${Math.cos(a2) * 200},${Math.sin(a2) * 200}`}
                  fill="#fff"
                />
              );
            })}
          </svg>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

const PaperBg: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(circle at 50% 40%, #FFF3D6 0%, #E8D2A6 70%, #CDB17E 100%)",
    }}
  />
);

const VintageLabel: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
}> = ({ children, size = 80, color = COLORS.ink }) => (
  <div
    style={{
      fontFamily: FONT_VINTAGE,
      fontSize: size,
      color,
      textAlign: "center",
      lineHeight: 1.05,
    }}
  >
    {children}
  </div>
);

// =============== Szene 1 – HOOK ===============
export const Scene1: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stampAt = Math.round(dur * 0.4);
  const st = spring({
    frame: frame - stampAt,
    fps,
    config: { damping: 12, stiffness: 300 },
  });
  return (
    <AbsoluteFill style={{ transform: shake(frame, stampAt, 10, 30) }}>
      <ModernBg a="#2D6A4F" b={COLORS.green} />
      <Stage style={{ transform: `scale(${punch(frame, fps, 1.4)})` }}>
        <Apple
          size={180}
          face="none"
          style={{ transform: `rotate(${Math.sin(frame / 5) * 8}deg)` }}
        />
        <div
          style={{
            fontFamily: FONT_BOLD,
            color: COLORS.cream,
            fontSize: 118,
            lineHeight: 1.02,
            textAlign: "center",
            padding: "20px 60px",
            textShadow: "0 8px 0 rgba(0,0,0,0.3)",
          }}
        >
          „AN APPLE A DAY
          <br />
          KEEPS THE{" "}
          <span
            style={{
              color: COLORS.red,
              WebkitTextStroke: `3px ${COLORS.cream}`,
            }}
          >
            DOCTOR
          </span>
          <br />
          AWAY“
        </div>
        {frame >= stampAt && (
          <div
            style={{
              position: "absolute",
              top: 560,
              transform: `scale(${interpolate(st, [0, 1], [3.2, 1])})`,
              opacity: interpolate(st, [0, 0.3], [0, 1], clamp),
            }}
          >
            <Stamp text="WERBUNG" fontSize={170} />
          </div>
        )}
      </Stage>
    </AbsoluteFill>
  );
};

// =============== Szene 2 – Saure Äpfel & Cidre ===============
const FallingApples: React.FC<{ count?: number }> = ({ count = 6 }) => {
  const frame = useCurrentFrame();
  const xs = [-110, 40, -40, 100, -90, 20, 70];
  return (
    <div
      style={{
        position: "relative",
        width: 460,
        height: 430,
        overflow: "hidden",
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const start = i * 9;
        const t = Math.max(0, frame - start);
        const y = -160 + 0.9 * t * t; // fällt beschleunigt
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 230 + xs[i % xs.length] - 55,
              top: y,
            }}
          >
            <Apple
              size={110}
              color={COLORS.sour}
              spots
              shine={false}
              style={{ transform: `rotate(${t * 9 + i * 40}deg)` }}
            />
          </div>
        );
      })}
    </div>
  );
};

export const Scene2: React.FC<SceneProps> = ({ dur }) => {
  return (
    <Vintage>
      <PaperBg />
      <Shot dur={dur} start={0} end={0.5}>
        <SourApple />
      </Shot>
      <Shot dur={dur} start={0.5} end={1}>
        <BarrelFill />
      </Shot>
    </Vintage>
  );
};

const SourApple: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, 0);
  const sauer = pop(frame, fps, 22);
  return (
    <Stage style={{ transform: `scale(${punch(frame, fps, 1.3)})` }}>
      <VintageLabel size={64}>AMERIKA, UM 1900</VintageLabel>
      <div
        style={{
          transform: `scale(${p}) rotate(${Math.sin(frame / 3) * 7}deg)`,
          marginTop: 20,
        }}
      >
        <Apple size={460} color={COLORS.sour} face="grumpy" spots />
      </div>
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 600,
          transform: `scale(${sauer}) rotate(14deg)`,
        }}
      >
        <Stamp text="SAUER!" fontSize={90} color={COLORS.green} rotate={0} />
      </div>
    </Stage>
  );
};

const BarrelFill: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Stage style={{ transform: `scale(${punch(frame, fps, 1.3)})` }}>
      <VintageLabel size={86}>Äpfel zum Trinken</VintageLabel>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <FallingApples />
        <div style={{ marginTop: -40 }}>
          <Barrel width={460} label="CIDRE" />
        </div>
      </div>
    </Stage>
  );
};

// =============== Szene 3 – Prohibition ===============
export const Scene3: React.FC<SceneProps> = ({ dur }) => (
  <Vintage>
    <PaperBg />
    <Shot dur={dur} start={0} end={0.4}>
      <Headline />
    </Shot>
    <Shot dur={dur} start={0.4} end={0.72}>
      <Year1920 />
    </Shot>
    <Shot dur={dur} start={0.72} end={1}>
      <BarrelBanned />
    </Shot>
  </Vintage>
);

const Headline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const spin = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  return (
    <Stage>
      <div
        style={{
          width: 820,
          background: "#F4E9D0",
          padding: 40,
          boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
          transform: `rotate(${interpolate(spin, [0, 1], [-540, -4])}deg) scale(${interpolate(spin, [0, 1], [0.1, 1])})`,
          textAlign: "center",
          color: COLORS.ink,
        }}
      >
        <div
          style={{
            fontFamily: FONT_VINTAGE,
            fontSize: 54,
            borderBottom: `4px double ${COLORS.ink}`,
            paddingBottom: 10,
          }}
        >
          The Daily Herald
        </div>
        <div
          style={{
            fontFamily: FONT_BOLD,
            fontSize: 120,
            lineHeight: 1,
            marginTop: 20,
          }}
        >
          KAMPF DEM ALKOHOL!
        </div>
        <div style={{ display: "flex", gap: 20, marginTop: 24 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ flex: 1 }}>
              {Array.from({ length: 6 }).map((_, j) => (
                <div
                  key={j}
                  style={{
                    height: 10,
                    background: "#9c8a6a",
                    marginTop: 10,
                    width: `${80 + ((i + j) % 3) * 10}%`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
};

const Year1920: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fly = spring({ frame, fps, config: { damping: 13, stiffness: 160 } });
  const sub = pop(frame, fps, 10);
  return (
    <AbsoluteFill style={{ transform: shake(frame, 9, 10, 24) }}>
      <Stage>
        <div
          style={{
            fontFamily: FONT_VINTAGE,
            fontSize: 330,
            color: COLORS.ink,
            lineHeight: 1,
            transform: `translateX(${interpolate(fly, [0, 1], [1200, 0])}px) rotate(${interpolate(fly, [0, 1], [25, -3])}deg)`,
            textShadow: "8px 8px 0 rgba(0,0,0,0.2)",
          }}
        >
          1920
        </div>
        <div
          style={{
            transform: `scale(${sub})`,
            fontFamily: FONT_BOLD,
            fontSize: 120,
            letterSpacing: 10,
            color: "#7A1E1E",
          }}
        >
          PROHIBITION
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

const BarrelBanned: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stampAt = 8;
  const st = spring({
    frame: frame - stampAt,
    fps,
    config: { damping: 12, stiffness: 300 },
  });
  return (
    <AbsoluteFill style={{ transform: shake(frame, stampAt, 10, 30) }}>
      <Stage style={{ transform: `scale(${punch(frame, fps, 1.3)})` }}>
        <Barrel width={520} label="CIDRE" />
        {frame >= stampAt && (
          <div
            style={{
              position: "absolute",
              transform: `scale(${interpolate(st, [0, 1], [3, 1])})`,
              opacity: interpolate(st, [0, 0.3], [0, 1], clamp),
            }}
          >
            <Stamp text="VERBOTEN" fontSize={160} color="#B3001B" />
          </div>
        )}
      </Stage>
    </AbsoluteFill>
  );
};

// =============== Szene 4 – Apfelbauern ===============
export const Scene4: React.FC<SceneProps> = ({ dur }) => (
  <Vintage>
    <PaperBg />
    <Shot dur={dur} start={0} end={0.5}>
      <FarmerPile />
    </Shot>
    <Shot dur={dur} start={0.5} end={1}>
      <PriceCrash />
    </Shot>
  </Vintage>
);

const ApplePile: React.FC<{ width?: number }> = ({ width = 900 }) => {
  const rows = [9, 8, 7, 6, 5, 4];
  const size = width / 9;
  return (
    <div
      style={{
        position: "relative",
        width,
        height: rows.length * size * 0.75 + size,
      }}
    >
      {rows.map((n, r) =>
        Array.from({ length: n }).map((_, i) => (
          <div
            key={`${r}-${i}`}
            style={{
              position: "absolute",
              bottom: r * size * 0.72,
              left: (width - n * size) / 2 + i * size,
            }}
          >
            <Apple
              size={size}
              color={(r + i) % 3 === 0 ? COLORS.sour : "#B5452B"}
              shine={false}
            />
          </div>
        )),
      )}
    </div>
  );
};

const FarmerPile: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = interpolate(frame, [0, 90], [1, 1.12]);
  const f = pop(frame, fps, 6);
  return (
    <Stage style={{ transform: `scale(${punch(frame, fps, 1.3) * zoom})` }}>
      <div style={{ position: "absolute", top: 40 }}>
        <VintageLabel size={80}>Der Apfelbauer</VintageLabel>
      </div>
      <div style={{ position: "absolute", bottom: 40 }}>
        <ApplePile />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 20,
          transform: `translateY(${interpolate(f, [0, 1], [500, 0])}px)`,
        }}
      >
        <Farmer size={340} />
      </div>
    </Stage>
  );
};

const PriceCrash: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = interpolate(frame, [4, 34], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const pathLen = 1400;
  const ill = pop(frame, fps, 40);
  // Pfeil-Spitze folgt der Linie
  const pts = [
    [60, 120],
    [260, 90],
    [420, 140],
    [560, 110],
    [820, 640],
  ];
  const seg = draw * (pts.length - 1);
  const idx = Math.min(pts.length - 2, Math.floor(seg));
  const local = seg - idx;
  const hx = pts[idx][0] + (pts[idx + 1][0] - pts[idx][0]) * local;
  const hy = pts[idx][1] + (pts[idx + 1][1] - pts[idx][1]) * local;
  const ang =
    (Math.atan2(pts[idx + 1][1] - pts[idx][1], pts[idx + 1][0] - pts[idx][0]) *
      180) /
    Math.PI;
  return (
    <AbsoluteFill style={{ transform: shake(frame, 34, 10, 22) }}>
      <Stage style={{ transform: `scale(${punch(frame, fps, 1.25)})` }}>
        <VintageLabel size={80}>Apfelpreis</VintageLabel>
        <svg width={900} height={720} viewBox="0 0 900 720">
          <path
            d="M40 30 L 40 690 L 880 690"
            stroke={COLORS.ink}
            strokeWidth={8}
            fill="none"
          />
          {[180, 330, 480].map((y) => (
            <line
              key={y}
              x1={40}
              x2={880}
              y1={y}
              y2={y}
              stroke={COLORS.ink}
              strokeWidth={2}
              opacity={0.25}
            />
          ))}
          <text
            x={60}
            y={60}
            fontFamily={FONT_VINTAGE}
            fontSize={46}
            fill={COLORS.ink}
          >
            $
          </text>
          <polyline
            points={pts.map((p) => p.join(",")).join(" ")}
            fill="none"
            stroke="#B3001B"
            strokeWidth={22}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={pathLen}
            strokeDashoffset={pathLen * (1 - draw)}
          />
          <g transform={`translate(${hx} ${hy}) rotate(${ang})`}>
            <polygon points="-10,-38 50,0 -10,38" fill="#B3001B" />
          </g>
        </svg>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 40,
            transform: "scale(0.6)",
            transformOrigin: "bottom left",
          }}
        >
          <Farmer size={300} />
        </div>
        {frame >= 40 && (
          <div
            style={{
              position: "absolute",
              top: 260,
              right: 70,
              transform: `scale(${interpolate(ill, [0, 1], [2.5, 1])})`,
            }}
          >
            <Stamp text="ILLEGAL" fontSize={110} color="#B3001B" rotate={10} />
          </div>
        )}
      </Stage>
    </AbsoluteFill>
  );
};

// =============== Szene 5 – Die Kampagne ===============
export const Scene5: React.FC<SceneProps> = ({ dur }) => (
  <Vintage strength={0.45}>
    <PaperBg />
    <Shot dur={dur} start={0} end={0.42}>
      <Rebrand />
    </Shot>
    <Shot dur={dur} start={0.42} end={1}>
      <Posters />
    </Shot>
  </Vintage>
);

const Rebrand: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const strike = interpolate(frame, [12, 26], [0, 1], clamp);
  const health = pop(frame, fps, 32);
  const swapStart = 40;
  const gap = Math.max(8, Math.floor((durationInFrames - swapStart - 20) / 3));
  return (
    <Stage style={{ transform: `scale(${punch(frame, fps, 1.3)})` }}>
      <div
        style={{
          position: "relative",
          height: 300,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            fontFamily: FONT_BOLD,
            fontSize: 130,
            color: COLORS.ink,
            opacity: interpolate(health, [0, 1], [1, 0.35]),
          }}
        >
          ALKOHOL
          <div
            style={{
              position: "absolute",
              left: -10,
              top: "52%",
              height: 18,
              width: `${strike * 105}%`,
              background: COLORS.red,
              transform: "rotate(-4deg)",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            transform: `scale(${health})`,
          }}
        >
          <div
            style={{
              fontFamily: FONT_BOLD,
              fontSize: 140,
              color: COLORS.green,
            }}
          >
            GESUNDHEIT
          </div>
          <Heart size={130} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 30, marginTop: 70 }}>
        {[0, 1, 2].map((i) => {
          const t = swapStart + i * gap;
          const out = interpolate(frame, [t, t + 6], [1, 0], clamp);
          const inn = pop(frame, fps, t + 4);
          return (
            <div
              key={i}
              style={{ position: "relative", width: 260, height: 290 }}
            >
              <div
                style={{
                  position: "absolute",
                  transform: `scale(${out}) rotate(${(1 - out) * 90}deg)`,
                }}
              >
                <Apple
                  size={260}
                  color={COLORS.sour}
                  face="grumpy"
                  spots
                  shine={false}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  transform: `scale(${inn})`,
                  filter: "saturate(1.6)",
                }}
              >
                <Apple size={260} color={COLORS.red} face="happy" />
              </div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

const Posters: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const step = Math.floor(durationInFrames / 3);
  const cfg = [
    { from: [-1100, -200], rot: [-40, -7], pos: [-150, -40] },
    { from: [1100, 100], rot: [40, 6], pos: [150, 0] },
    { from: [0, -1500], rot: [0, -2], pos: [0, 50] },
  ];
  return (
    <AbsoluteFill style={{ transform: shake(frame, step * 2 + 8, 8, 18) }}>
      <Stage>
        {cfg.map((c, i) => {
          const s = spring({
            frame: frame - i * step,
            fps,
            config: { damping: 14, stiffness: 140 },
          });
          if (frame < i * step) return null;
          const x = interpolate(s, [0, 1], [c.from[0], c.pos[0]]);
          const y = interpolate(s, [0, 1], [c.from[1], c.pos[1]]);
          const r = interpolate(s, [0, 1], [c.rot[0], c.rot[1]]);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                transform: `translate(${x}px, ${y}px) rotate(${r}deg)`,
                filter: "saturate(1.4)",
              }}
            >
              <Poster variant={i as 0 | 1 | 2} width={560} />
            </div>
          );
        })}
        {/* knallrote Äpfel hüpfen daneben */}
        {[0, 1].map((i) => {
          const b = pop(frame, fps, 6 + i * 10);
          const bounce = Math.abs(Math.sin((frame + i * 8) / 6)) * 30;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                bottom: 10,
                [i ? "right" : "left"]: 30,
                transform: `scale(${b}) translateY(${-bounce}px)`,
                filter: "saturate(1.8)",
                zIndex: 5,
              }}
            >
              <Apple size={200} face="happy" />
            </div>
          );
        })}
      </Stage>
    </AbsoluteFill>
  );
};

// =============== Szene 6 – Hat funktioniert (Split-Screen) ===============
export const Scene6: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const left = spring({ frame, fps, config: { damping: 15, stiffness: 140 } });
  const right = spring({
    frame: frame - 25,
    fps,
    config: { damping: 13, stiffness: 160 },
  });
  const arrow = interpolate(frame, [50, 70], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const heart = pop(frame, fps, 75);
  const beat = 1 + Math.max(0, Math.sin(frame / 4)) * 0.12;
  return (
    <AbsoluteFill style={{ background: COLORS.green }}>
      {/* links: damals */}
      <AbsoluteFill
        style={{
          width: 540,
          transform: `translateX(${interpolate(left, [0, 1], [-540, 0])}px)`,
          overflow: "hidden",
        }}
      >
        <Vintage>
          <AbsoluteFill
            style={{
              background: "#E8D2A6",
              alignItems: "center",
              paddingTop: 300,
            }}
          >
            <VintageLabel size={70}>DAMALS</VintageLabel>
            <div
              style={{
                marginTop: 40,
                transform: `rotate(${Math.sin(frame / 8) * 4}deg)`,
              }}
            >
              <Bottle size={260} />
            </div>
          </AbsoluteFill>
        </Vintage>
      </AbsoluteFill>
      {/* rechts: heute */}
      <AbsoluteFill
        style={{
          left: 540,
          width: 540,
          transform: `translateX(${interpolate(right, [0, 1], [540, 0])}px)`,
          background: `radial-gradient(circle at 50% 35%, #FFFFFF 0%, ${COLORS.cream} 60%, #FFD7D7 100%)`,
          alignItems: "center",
          paddingTop: 300,
        }}
      >
        <div style={{ fontFamily: FONT_BOLD, fontSize: 80, color: COLORS.red }}>
          HEUTE
        </div>
        <div style={{ position: "relative", marginTop: 60 }}>
          <Apple size={330} face="happy" style={{ filter: "saturate(1.4)" }} />
          <div
            style={{
              position: "absolute",
              right: -30,
              top: -40,
              transform: `scale(${heart * beat})`,
            }}
          >
            <Heart size={150} />
          </div>
        </div>
      </AbsoluteFill>
      {/* Pfeil */}
      <AbsoluteFill style={{ alignItems: "center", top: 560, height: 200 }}>
        <svg
          width={360}
          height={180}
          viewBox="0 0 360 180"
          style={{ opacity: arrow > 0 ? 1 : 0 }}
        >
          <path
            d={`M20 90 L ${20 + 260 * arrow} 90`}
            stroke={COLORS.yellow}
            strokeWidth={34}
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 6px 0 #000)" }}
          />
          {arrow > 0.6 && (
            <polygon
              points={`${270 + 30 * arrow},30 ${350},90 ${270 + 30 * arrow},150`}
              fill={COLORS.yellow}
              stroke="#000"
              strokeWidth={6}
            />
          )}
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ left: 537, width: 6, background: "#000" }} />
    </AbsoluteFill>
  );
};

// =============== Szene 7 – Twist: Studie ===============
export const Scene7: React.FC<SceneProps> = ({ dur }) => (
  <AbsoluteFill>
    <ModernBg a="#FFE07A" b="#F4A300" />
    <Shot dur={dur} start={0} end={0.52}>
      <StudyScan />
    </Shot>
    <Shot dur={dur} start={0.52} end={1}>
      <DoctorShrug />
    </Shot>
  </AbsoluteFill>
);

const StudyScan: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const doc = spring({ frame, fps, config: { damping: 14, stiffness: 150 } });
  const mx = interpolate(frame, [0, durationInFrames], [-260, 160], clamp);
  const my = interpolate(frame, [0, durationInFrames], [-280, 60], clamp);
  const hl = interpolate(
    frame,
    [durationInFrames * 0.45, durationInFrames * 0.9],
    [0, 1],
    clamp,
  );
  return (
    <Stage>
      <div
        style={{
          transform: `translateY(${interpolate(doc, [0, 1], [1200, 0])}px) rotate(-3deg)`,
        }}
      >
        <StudyDoc width={640} highlight={hl} />
      </div>
      <div
        style={{
          position: "absolute",
          transform: `translate(${mx}px, ${my}px) scale(${pop(frame, fps, 6)})`,
        }}
      >
        <Magnifier size={400} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          fontFamily: FONT_SUB,
          fontWeight: 900,
          fontSize: 70,
          color: "#fff",
          background: COLORS.red,
          padding: "6px 26px",
          borderRadius: 16,
          transform: `rotate(-4deg) scale(${pop(frame, fps, 3)})`,
        }}
      >
        STUDIE 2015
      </div>
    </Stage>
  );
};

const DoctorShrug: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shrug =
    Math.max(0, Math.sin(((frame - 6) / 28) * Math.PI * 2)) *
    (frame > 6 ? 1 : 0);
  const shrugEase = Math.min(1, shrug * 1.6);
  return (
    <Stage style={{ transform: `scale(${punch(frame, fps, 1.35)})` }}>
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 80,
          transform: `rotate(-10deg) scale(${pop(frame, fps, 10)})`,
        }}
      >
        <Apple size={170} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 70,
          top: 40,
          fontFamily: FONT_BOLD,
          fontSize: 200,
          color: COLORS.red,
          transform: `rotate(12deg) scale(${pop(frame, fps, 14)})`,
        }}
      >
        ?
      </div>
      <div style={{ marginTop: 40 }}>
        <Doctor size={440} shrug={shrugEase} />
      </div>
    </Stage>
  );
};

// =============== Szene 8 – Folgen ===============
export const Scene8: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = spring({ frame, fps, config: { damping: 10, stiffness: 180 } });
  const pulse = 1 + Math.sin(frame / 3.5) * 0.06;
  const small = pop(frame, fps, 14);
  return (
    <AbsoluteFill>
      <ModernBg a="#FF4D4D" b="#8E0E0E" />
      <Stage>
        <Apple
          size={200}
          face="happy"
          style={{ transform: `rotate(${Math.sin(frame / 4) * 10}deg)` }}
        />
        <div
          style={{
            marginTop: 40,
            transform: `scale(${inn * pulse})`,
            background: COLORS.cream,
            color: COLORS.red,
            fontFamily: FONT_SUB,
            fontWeight: 900,
            fontSize: 140,
            padding: "26px 90px",
            borderRadius: 120,
            boxShadow: `0 16px 0 ${COLORS.green}, 0 0 ${40 + pulse * 40}px rgba(255,255,255,0.6)`,
            letterSpacing: 2,
          }}
        >
          FOLGEN +
        </div>
        <div
          style={{
            marginTop: 70,
            transform: `scale(${small})`,
            fontFamily: FONT_SUB,
            fontWeight: 800,
            fontSize: 46,
            color: COLORS.cream,
            textAlign: "center",
            maxWidth: 860,
          }}
        >
          Welchen Spruch soll ich als nächstes checken? 👇
        </div>
      </Stage>
    </AbsoluteFill>
  );
};
