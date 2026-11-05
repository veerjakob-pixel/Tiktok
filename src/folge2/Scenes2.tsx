import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
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
import { Doctor, Stamp } from "../components/Graphics";
import { Vintage } from "../components/Overlays";
import { Stage } from "../scenes/helpers";
import {
  Bacon,
  BaconSeller,
  BreakfastPlate,
  Bulb,
  Check,
  CoffeeCup,
  Kitchen,
  Letter,
  Newspaper,
  Phone,
  Ring,
  SuitMan,
  Toast,
} from "./Graphics2";
import { at, SceneT } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type P = { scene: SceneT };

// Ein Schnitt innerhalb einer Szene (Frames relativ zum Szenenanfang)
const Cut: React.FC<{
  from: number;
  to: number;
  children: React.ReactNode;
}> = ({ from, to, children }) => (
  <Sequence from={from} durationInFrames={Math.max(1, to - from)} layout="none">
    <AbsoluteFill>{children}</AbsoluteFill>
  </Sequence>
);

// ---------------- Hintergründe ----------------
const ModernBg: React.FC<{ a: string; b: string }> = ({ a, b }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 32%, ${a} 0%, ${b} 75%)`,
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.08,
          transform: `rotate(${frame * 0.3}deg) scale(2.2)`,
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

const Title: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  vintage?: boolean;
  delay?: number;
}> = ({
  children,
  size = 100,
  color = COLORS.cream,
  vintage = false,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, delay);
  return (
    <div
      style={{
        fontFamily: vintage ? FONT_VINTAGE : FONT_BOLD,
        fontSize: size,
        color,
        lineHeight: 1.04,
        textAlign: "center",
        padding: "0 60px",
        textShadow: vintage ? "none" : "0 6px 0 rgba(0,0,0,0.3)",
        transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`,
        opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
      }}
    >
      {children}
    </div>
  );
};

// =============== Szene 1 – HOOK ===============
export const S1_STAMP_WORD = 11; // "Werbefirma"

export const Scene1: React.FC<P> = ({ scene }) => {
  const cut = at(scene, 7); // "Das hat dir ..."
  return (
    <AbsoluteFill>
      <ModernBg a="#F4A259" b="#9C3D10" />
      <Cut from={0} to={cut}>
        <HookPlate />
      </Cut>
      <Cut from={cut} to={scene.duration}>
        <HookStamp stampAt={at(scene, S1_STAMP_WORD, 0) - cut} />
      </Cut>
    </AbsoluteFill>
  );
};

const HookPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
  return (
    <Stage style={{ transform: `scale(${punch(frame, fps, 1.3)})` }}>
      <Title size={104}>
        DIE WICHTIGSTE
        <br />
        MAHLZEIT DES TAGES?
      </Title>
      <div
        style={{
          marginTop: 50,
          transform: `translateY(${interpolate(drop, [0, 1], [-600, 0])}px) rotate(${Math.sin(frame / 20) * 2}deg)`,
        }}
      >
        <BreakfastPlate size={720} />
      </div>
    </Stage>
  );
};

const HookStamp: React.FC<{ stampAt: number }> = ({ stampAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const st = spring({
    frame: frame - stampAt,
    fps,
    config: { damping: 12, stiffness: 300 },
  });
  const zoom = interpolate(frame, [0, 90], [1.12, 1.22], clamp);
  return (
    <AbsoluteFill style={{ transform: shake(frame, stampAt, 10, 28) }}>
      <Stage>
        <div style={{ transform: `scale(${zoom})` }}>
          <BreakfastPlate size={820} />
        </div>
        {frame >= stampAt && (
          <div
            style={{
              position: "absolute",
              transform: `scale(${interpolate(st, [0, 1], [3.2, 1])})`,
              opacity: interpolate(st, [0, 0.3], [0, 1], clamp),
            }}
          >
            <Stamp text="WERBUNG" fontSize={190} />
          </div>
        )}
      </Stage>
    </AbsoluteFill>
  );
};

// =============== Szene 2 – 1920er: Kaffee und Toast ===============
export const S2_YEAR_CLICK = 8; // Frames nach Szenenstart: "1920er" erscheint

export const Scene2: React.FC<P> = ({ scene }) => {
  const c1 = at(scene, 6); // "morgens"
  const c2 = at(scene, 12); // "Schlecht"
  return (
    <Vintage>
      <Cut from={0} to={c1}>
        <Kitchen />
        <YearCard />
      </Cut>
      <Cut from={c1} to={c2}>
        <Kitchen />
        <CoffeeToast
          coffeeAt={at(scene, 8) - c1}
          toastAt={at(scene, 10) - c1}
        />
      </Cut>
      <Cut from={c2} to={scene.duration}>
        <PaperBg />
        <SadSeller />
      </Cut>
    </Vintage>
  );
};

const YearCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fly = spring({
    frame: frame - S2_YEAR_CLICK,
    fps,
    config: { damping: 13, stiffness: 160 },
  });
  const zoom = interpolate(frame, [0, 60], [1.15, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <Stage style={{ transform: `scale(${zoom})` }}>
      <div
        style={{
          background: "rgba(251,246,233,0.92)",
          padding: "30px 70px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
          transform: `scale(${fly}) rotate(-3deg)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONT_SUB,
            fontWeight: 800,
            fontSize: 60,
            letterSpacing: 10,
            color: "#6B4F2E",
          }}
        >
          USA
        </div>
        <div
          style={{
            fontFamily: FONT_VINTAGE,
            fontSize: 260,
            lineHeight: 1,
            color: COLORS.ink,
          }}
        >
          1920er
        </div>
      </div>
    </Stage>
  );
};

const CoffeeToast: React.FC<{ coffeeAt: number; toastAt: number }> = ({
  coffeeAt,
  toastAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = pop(frame, fps, Math.max(0, coffeeAt - 4));
  const t = pop(frame, fps, Math.max(0, toastAt - 4));
  return (
    <Stage style={{ transform: `scale(${punch(frame, fps, 1.2)})` }}>
      <div
        style={{
          fontFamily: FONT_VINTAGE,
          fontSize: 84,
          color: COLORS.ink,
          background: "rgba(251,246,233,0.9)",
          padding: "8px 40px",
        }}
      >
        Frühstück 1920:
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 50,
          marginTop: 120,
        }}
      >
        <div style={{ transform: `scale(${c})` }}>
          <CoffeeCup size={330} frame={frame} />
        </div>
        <div style={{ transform: `scale(${t}) translateY(-10px)` }}>
          <Toast size={300} rotate={8} />
        </div>
      </div>
      <div
        style={{
          fontFamily: FONT_BOLD,
          fontSize: 90,
          color: COLORS.ink,
          marginTop: 40,
          textShadow: "0 3px 0 rgba(251,246,233,0.8)",
        }}
      >
        <span style={{ opacity: c }}>KAFFEE</span>
        <span style={{ opacity: t }}> + TOAST</span>
      </div>
    </Stage>
  );
};

const SadSeller: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const arrow = interpolate(frame, [6, 40], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <Stage style={{ transform: `scale(${punch(frame, fps, 1.25)})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <BaconSeller size={420} frame={frame} />
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: FONT_VINTAGE,
              fontSize: 70,
              color: COLORS.ink,
            }}
          >
            Speck-
            <br />
            Verkauf
          </div>
          <svg width="300" height="300" viewBox="0 0 300 300">
            <path
              d="M20 20 L 20 280 L 290 280"
              stroke={COLORS.ink}
              strokeWidth={8}
              fill="none"
            />
            <path
              d="M40 60 L 110 110 L 160 90 L 270 250"
              stroke="#8E1B1B"
              strokeWidth={14}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - arrow}
            />
            <path
              d="M270 250 L 236 236 M270 250 L 266 214"
              stroke="#8E1B1B"
              strokeWidth={14}
              strokeLinecap="round"
              opacity={arrow > 0.95 ? 1 : 0}
            />
          </svg>
        </div>
      </div>
    </Stage>
  );
};

// =============== Szene 3 – Edward Bernays & die Ärzte ===============
export const S3_COUNT_WORD = 21; // "Tausende"
export const COUNT_TARGET = 4500;
export const COUNT_FRAMES = 40;
export const COUNT_CLICKS = 8;

export const Scene3: React.FC<P> = ({ scene }) => {
  const c1 = at(scene, 6); // "den Vater der PR"
  const c2 = at(scene, 10); // "Seine Idee"
  const c3 = at(scene, 14); // "Ärzte"
  const c4 = at(scene, S3_COUNT_WORD); // "Tausende"
  return (
    <Vintage>
      <PaperBg />
      <Cut from={0} to={c1}>
        <Bernays nameAt={at(scene, 4)} />
      </Cut>
      <Cut from={c1} to={c2}>
        <FatherOfPR />
      </Cut>
      <Cut from={c2} to={c3}>
        <IdeaLetter />
      </Cut>
      <Cut from={c3} to={c4}>
        <LetterToDoctor />
      </Cut>
      <Cut from={c4} to={scene.duration}>
        <ThousandLetters />
      </Cut>
    </Vintage>
  );
};

const Bernays: React.FC<{ nameAt: number }> = ({ nameAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const walk = spring({ frame, fps, config: { damping: 16, stiffness: 90 } });
  const tag = pop(frame, fps, nameAt);
  return (
    <Stage>
      <div
        style={{
          transform: `translateX(${interpolate(walk, [0, 1], [-700, 0])}px)`,
        }}
      >
        <SuitMan size={470} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 40,
          background: COLORS.ink,
          color: COLORS.cream,
          fontFamily: FONT_BOLD,
          fontSize: 92,
          letterSpacing: 4,
          padding: "6px 40px",
          transform: `scale(${tag}) rotate(-2deg)`,
        }}
      >
        EDWARD BERNAYS
      </div>
    </Stage>
  );
};

const FatherOfPR: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, 4);
  return (
    <Stage style={{ transform: `scale(${punch(frame, fps, 1.3)})` }}>
      <div
        style={{ fontFamily: FONT_VINTAGE, fontSize: 90, color: COLORS.ink }}
      >
        „Der Vater der
      </div>
      <div
        style={{
          fontFamily: FONT_BOLD,
          fontSize: 400,
          lineHeight: 1,
          color: "#8E1B1B",
          transform: `scale(${p})`,
          textShadow: "10px 10px 0 rgba(0,0,0,0.18)",
        }}
      >
        PR“
      </div>
      <div
        style={{
          fontFamily: FONT_SUB,
          fontWeight: 700,
          fontSize: 52,
          color: "#6B4F2E",
          marginTop: 10,
        }}
      >
        PR = Public Relations
      </div>
    </Stage>
  );
};

const IdeaLetter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bulb = pop(frame, fps, 0);
  const letter = spring({
    frame: frame - 14,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  return (
    <Stage>
      <div style={{ transform: `scale(${bulb})` }}>
        <Bulb size={190} glow={0.6 + 0.4 * Math.sin(frame / 4)} />
      </div>
      <div
        style={{
          marginTop: 30,
          transform: `translateY(${interpolate(letter, [0, 1], [900, 0])}px) rotate(${interpolate(letter, [0, 1], [12, -2])}deg)`,
        }}
      >
        <Letter width={680} />
      </div>
    </Stage>
  );
};

const LetterToDoctor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fly = spring({ frame, fps, config: { damping: 15, stiffness: 110 } });
  const nod = Math.max(0, Math.sin(frame / 5)) * 0.25;
  return (
    <Stage>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            transform: `translateX(${interpolate(fly, [0, 1], [-500, 0])}px) rotate(-6deg) scale(${interpolate(fly, [0, 1], [1.2, 0.85])})`,
            zIndex: 2,
          }}
        >
          <Letter width={500} />
        </div>
        <div style={{ marginLeft: -60 }}>
          <Doctor size={360} shrug={nod} />
        </div>
      </div>
    </Stage>
  );
};

const ThousandLetters: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cols = 6;
  const rows = 7;
  const total = cols * rows;
  const shown = Math.floor(
    interpolate(frame, [0, COUNT_FRAMES - 6], [1, total], clamp),
  );
  const count = Math.round(
    interpolate(frame, [0, COUNT_FRAMES], [0, COUNT_TARGET], {
      ...clamp,
      easing: Easing.out(Easing.quad),
    }),
  );
  const done = pop(frame, fps, COUNT_FRAMES);
  const zoomOut = interpolate(frame, [0, COUNT_FRAMES], [1.6, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill>
      <Stage>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 150px)`,
            gap: 14,
            transform: `scale(${zoomOut}) rotate(-3deg)`,
          }}
        >
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              style={{
                opacity: i < shown ? 1 : 0,
                transform: `rotate(${((i * 37) % 11) - 5}deg)`,
              }}
            >
              <Letter width={150} detail={false} />
            </div>
          ))}
        </div>
      </Stage>
      <Stage>
        <div
          style={{
            background: COLORS.ink,
            color: COLORS.cream,
            padding: "20px 50px",
            textAlign: "center",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              fontFamily: FONT_BOLD,
              fontSize: 190,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {count.toLocaleString("de-DE")}
          </div>
          <div style={{ fontFamily: FONT_SUB, fontWeight: 800, fontSize: 64 }}>
            Ärzte sagen:{" "}
            <span
              style={{
                color: "#7BE495",
                display: "inline-block",
                transform: `scale(${done})`,
              }}
            >
              JA!
            </span>
          </div>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

// =============== Szene 4 – Zeitungen & Speck mit Eiern ===============
export const S4_FOOD_WORDS = [14, 16]; // "Speck", "Eier"

export const Scene4: React.FC<P> = ({ scene }) => {
  const c1 = at(scene, 3); // "Ärzte empfehlen"
  const c2 = at(scene, 8); // "Und was ist ..."
  return (
    <Vintage>
      <PaperBg />
      <Cut from={0} to={c1}>
        <FlyingPapers />
      </Cut>
      <Cut from={c1} to={c2}>
        <FrontPage />
      </Cut>
      <Cut from={c2} to={scene.duration}>
        <PlateLanding
          baconAt={at(scene, S4_FOOD_WORDS[0], 2) - c2}
          eggAt={at(scene, S4_FOOD_WORDS[1], 2) - c2}
        />
      </Cut>
    </Vintage>
  );
};

const FlyingPapers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const papers = [
    {
      title: "Daily Herald",
      head: "ÄRZTE RATEN ZU FRÜHSTÜCK",
      x: -120,
      y: -170,
      r: -10,
      d: 0,
    },
    {
      title: "Evening Star",
      head: "4.500 ÄRZTE EINIG",
      x: 130,
      y: 20,
      r: 8,
      d: 8,
    },
    {
      title: "The Morning Post",
      head: "ISS KRÄFTIG AM MORGEN!",
      x: -40,
      y: 210,
      r: -4,
      d: 16,
    },
  ];
  return (
    <Stage>
      {papers.map((p, i) => {
        const s = spring({
          frame: frame - p.d,
          fps,
          config: { damping: 14, stiffness: 130 },
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              transform: `translate(${p.x}px, ${p.y}px) rotate(${interpolate(s, [0, 1], [p.r - 400, p.r])}deg) scale(${interpolate(s, [0, 1], [0.05, 1])})`,
              opacity: interpolate(s, [0, 0.2], [0, 1], clamp),
            }}
          >
            <Newspaper
              width={640}
              title={p.title}
              headline={p.head}
              headSize={70}
            />
          </div>
        );
      })}
    </Stage>
  );
};

const FrontPage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = interpolate(frame, [0, 150], [1, 1.12], clamp);
  return (
    <Stage style={{ transform: `scale(${punch(frame, fps, 1.4) * zoom})` }}>
      <Newspaper
        width={900}
        title="The Daily Herald"
        headline="ÄRZTE EMPFEHLEN EIN GROSSES FRÜHSTÜCK!"
        headSize={120}
      />
    </Stage>
  );
};

const PlateLanding: React.FC<{ baconAt: number; eggAt: number }> = ({
  baconAt,
  eggAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = spring({
    frame: frame - baconAt,
    fps,
    config: { damping: 11, stiffness: 170 },
  });
  const e = spring({
    frame: frame - eggAt,
    fps,
    config: { damping: 11, stiffness: 170 },
  });
  const q = 1 - interpolate(frame, [baconAt - 4, baconAt + 4], [0, 1], clamp);
  return (
    <Stage style={{ transform: `scale(${punch(frame, fps, 1.2)})` }}>
      <div
        style={{
          fontFamily: FONT_VINTAGE,
          fontSize: 86,
          color: COLORS.ink,
          textAlign: "center",
          lineHeight: 1.1,
          marginBottom: 40,
        }}
      >
        Ein großes
        <br />
        Frühstück?
      </div>
      <div style={{ position: "relative" }}>
        <BreakfastPlate
          size={760}
          baconY={interpolate(b, [0, 1], [-900, 0])}
          baconO={frame >= baconAt ? 1 : 0}
          eggY={interpolate(e, [0, 1], [-900, 0])}
          eggO={frame >= eggAt ? 1 : 0}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: q,
          }}
        >
          <div
            style={{
              fontFamily: FONT_BOLD,
              fontSize: 260,
              color: "#8E1B1B",
              transform: `rotate(${Math.sin(frame / 6) * 6}deg)`,
            }}
          >
            ?
          </div>
        </div>
      </div>
    </Stage>
  );
};

// =============== Szene 5 – Der Trick ===============
export const Scene5: React.FC<P> = ({ scene }) => {
  const c1 = at(scene, 9); // "Genau das macht PR bis heute"
  return (
    <AbsoluteFill>
      <ModernBg a="#2B3A55" b="#0E1424" />
      <Cut from={0} to={c1}>
        <Trick
          adAt={at(scene, 2)}
          strikeAt={at(scene, 6)}
          newsAt={at(scene, 8)}
        />
      </Cut>
      <Cut from={c1} to={scene.duration}>
        <PRToday />
      </Cut>
    </AbsoluteFill>
  );
};

const Card: React.FC<{
  children: React.ReactNode;
  color: string;
  style?: React.CSSProperties;
}> = ({ children, color, style }) => (
  <div
    style={{
      width: 440,
      height: 520,
      borderRadius: 30,
      background: "#FBF6E9",
      border: `8px solid ${color}`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 24,
      boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
      position: "relative",
      ...style,
    }}
  >
    {children}
  </div>
);

const Trick: React.FC<{ adAt: number; strikeAt: number; newsAt: number }> = ({
  adAt,
  strikeAt,
  newsAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const left = pop(frame, fps, Math.max(0, adAt - 4));
  const strike = interpolate(frame, [strikeAt - 2, strikeAt + 8], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const right = pop(frame, fps, Math.max(0, newsAt - 8));
  const check = interpolate(frame, [newsAt, newsAt + 12], [0, 1], clamp);
  return (
    <Stage>
      <Title size={120} color={COLORS.yellow}>
        DER TRICK
      </Title>
      <div style={{ display: "flex", gap: 40, marginTop: 50 }}>
        <Card
          color="#C0392B"
          style={{
            transform: `scale(${left}) rotate(-3deg)`,
            opacity: interpolate(strike, [0, 1], [1, 0.75]),
          }}
        >
          <Bacon width={260} />
          <div
            style={{
              fontFamily: FONT_BOLD,
              fontSize: 92,
              color: "#C0392B",
              position: "relative",
            }}
          >
            WERBUNG
            <div
              style={{
                position: "absolute",
                left: -20,
                top: "48%",
                height: 16,
                width: `${strike * 112}%`,
                background: "#C0392B",
                borderRadius: 8,
                transform: "rotate(-8deg)",
              }}
            />
          </div>
          <div
            style={{
              fontFamily: FONT_SUB,
              fontWeight: 700,
              fontSize: 40,
              color: "#7A6A55",
            }}
          >
            „Kauft Speck!“
          </div>
        </Card>
        <Card
          color="#1F9D55"
          style={{ transform: `scale(${right}) rotate(3deg)` }}
        >
          <Check size={170} progress={check} />
          <div
            style={{ fontFamily: FONT_BOLD, fontSize: 92, color: "#1F7A45" }}
          >
            NACHRICHT
          </div>
          <div
            style={{
              fontFamily: FONT_SUB,
              fontWeight: 700,
              fontSize: 40,
              color: "#7A6A55",
              textAlign: "center",
              lineHeight: 1.15,
            }}
          >
            „Ärzte raten
            <br />
            zu Frühstück“
          </div>
        </Card>
      </div>
    </Stage>
  );
};

const PRToday: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phone = spring({ frame, fps, config: { damping: 15, stiffness: 120 } });
  const card1 = pop(frame, fps, 8);
  const card2 = pop(frame, fps, 18);
  const NewsCard: React.FC<{ s: number; head: string; tag: string }> = ({
    s,
    head,
    tag,
  }) => (
    <div
      style={{
        margin: "18px 22px",
        background: "#FFF",
        borderRadius: 18,
        padding: "18px 20px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
        transform: `scale(${s})`,
      }}
    >
      <div
        style={{
          fontFamily: FONT_SUB,
          fontWeight: 800,
          fontSize: 22,
          color: "#1F6FEB",
        }}
      >
        {tag}
      </div>
      <div
        style={{
          fontFamily: FONT_SUB,
          fontWeight: 800,
          fontSize: 34,
          color: "#111",
          lineHeight: 1.15,
          marginTop: 6,
        }}
      >
        {head}
      </div>
    </div>
  );
  return (
    <Stage>
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: FONT_BOLD,
              fontSize: 260,
              color: COLORS.yellow,
              lineHeight: 1,
            }}
          >
            PR
          </div>
          <div
            style={{
              fontFamily: FONT_BOLD,
              fontSize: 84,
              color: COLORS.cream,
              lineHeight: 1.05,
            }}
          >
            BIS
            <br />
            HEUTE
          </div>
        </div>
        <div
          style={{
            transform: `translateY(${interpolate(phone, [0, 1], [1200, 0])}px) rotate(4deg)`,
          }}
        >
          <Phone width={420}>
            <NewsCard
              s={card1}
              tag="GESUNDHEIT"
              head="Experten: Dieses Getränk hält dich fit!"
            />
            <NewsCard
              s={card2}
              tag="STUDIE"
              head="Forscher loben neuen Snack"
            />
          </Phone>
        </div>
      </div>
    </Stage>
  );
};

// =============== Szene 6 – FOLGEN-AUFRUF ===============
export const S6_PART_WORD = 3; // "Teil 3"

export const Scene6: React.FC<P> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const btn = pop(frame, fps, 0);
  const pulse = 1 + 0.06 * Math.sin((frame / fps) * Math.PI * 2 * 1.2);
  const teaser = pop(frame, fps, at(scene, S6_PART_WORD));
  const ask = pop(frame, fps, 12);
  return (
    <AbsoluteFill>
      <ModernBg a="#FF5C7A" b="#5A0F2E" />
      <Stage>
        <div
          style={{
            transform: `scale(${teaser})`,
            display: "flex",
            alignItems: "center",
            gap: 20,
            background: "rgba(0,0,0,0.35)",
            borderRadius: 30,
            padding: "16px 40px 16px 20px",
            marginBottom: 60,
          }}
        >
          <Ring size={150} sparkle={0.5 + 0.5 * Math.sin(frame / 4)} />
          <div
            style={{
              fontFamily: FONT_BOLD,
              fontSize: 72,
              color: COLORS.cream,
              lineHeight: 1.05,
            }}
          >
            TEIL 3:
            <br />
            <span style={{ color: COLORS.yellow }}>DIAMANTRINGE</span>
          </div>
        </div>
        <div
          style={{
            transform: `scale(${btn * pulse})`,
            background: "#FE2C55",
            color: "#FFF",
            fontFamily: FONT_BOLD,
            fontSize: 150,
            letterSpacing: 6,
            padding: "20px 80px",
            borderRadius: 40,
            boxShadow: `0 0 ${40 + 30 * (pulse - 1) * 10}px rgba(254,44,85,0.8), 0 14px 0 #A1112F`,
          }}
        >
          FOLGEN +
        </div>
        <div
          style={{
            marginTop: 80,
            fontFamily: FONT_SUB,
            fontWeight: 800,
            fontSize: 56,
            color: COLORS.cream,
            textAlign: "center",
            lineHeight: 1.2,
            opacity: interpolate(ask, [0, 0.4], [0, 1], clamp),
            transform: `translateY(${interpolate(ask, [0, 1], [40, 0])}px)`,
          }}
        >
          Welche Werbelüge soll ich checken? 👇
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

export const SCENE_COMPONENTS: React.FC<P>[] = [
  Scene1,
  Scene2,
  Scene3,
  Scene4,
  Scene5,
  Scene6,
];
export const HISTORIC = [false, true, true, true, false, false];
