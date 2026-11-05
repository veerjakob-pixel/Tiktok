import React from "react";
import { COLORS, FONT_BOLD, FONT_SUB, FONT_VINTAGE } from "../theme";

// Alle Grafiken für Folge 2 – nur SVG/CSS, keine Bilder aus dem Internet.

// ---------- Speckstreifen ----------
export const Bacon: React.FC<{
  width?: number;
  rotate?: number;
  style?: React.CSSProperties;
}> = ({ width = 260, rotate = 0, style }) => (
  <svg
    width={width}
    height={width * 0.32}
    viewBox="0 0 250 80"
    style={{ transform: `rotate(${rotate}deg)`, overflow: "visible", ...style }}
  >
    <path
      d="M5 40 Q 35 10 65 40 T 125 40 T 185 40 T 245 40 L 245 62 Q 215 32 185 62 T 125 62 T 65 62 T 5 62 Z"
      fill="#A3361F"
    />
    <path
      d="M8 46 Q 35 20 65 46 T 125 46 T 185 46 T 242 46"
      stroke="#F3C9A6"
      strokeWidth={7}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M8 56 Q 35 30 65 56 T 125 56 T 185 56 T 242 56"
      stroke="#7A2213"
      strokeWidth={4}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M5 40 Q 35 10 65 40 T 125 40 T 185 40 T 245 40"
      stroke="#5E1A0E"
      strokeWidth={3}
      fill="none"
    />
  </svg>
);

// ---------- Spiegelei ----------
export const Egg: React.FC<{ size?: number; style?: React.CSSProperties }> = ({
  size = 200,
  style,
}) => (
  <svg
    width={size}
    height={size * 0.85}
    viewBox="0 0 200 170"
    style={{ overflow: "visible", ...style }}
  >
    <path
      d="M30 80 Q 10 30 70 22 Q 110 0 150 25 Q 196 40 182 95 Q 176 150 115 150 Q 60 160 35 128 Q 14 108 30 80 Z"
      fill="#FFFDF5"
      stroke="#E9DFC8"
      strokeWidth={3}
    />
    <circle cx="102" cy="82" r="36" fill="#FFB703" />
    <circle cx="102" cy="82" r="36" fill="url(#yolkShine)" />
    <ellipse cx="90" cy="70" rx="11" ry="7" fill="#FFF3B0" opacity={0.85} />
    <defs>
      <radialGradient id="yolkShine" cx="0.6" cy="0.6" r="0.6">
        <stop offset="0.6" stopColor="#FFB703" stopOpacity={0} />
        <stop offset="1" stopColor="#E07A00" stopOpacity={0.7} />
      </radialGradient>
    </defs>
  </svg>
);

// ---------- Teller ----------
export const Plate: React.FC<{ size?: number; children?: React.ReactNode }> = ({
  size = 640,
  children,
}) => (
  <div style={{ position: "relative", width: size, height: size * 0.62 }}>
    <svg
      width={size}
      height={size * 0.62}
      viewBox="0 0 400 248"
      style={{ position: "absolute", inset: 0 }}
    >
      <ellipse cx="200" cy="138" rx="196" ry="104" fill="rgba(0,0,0,0.25)" />
      <ellipse
        cx="200"
        cy="124"
        rx="196"
        ry="104"
        fill="#F7F7F2"
        stroke="#D9D6CC"
        strokeWidth={3}
      />
      <ellipse cx="200" cy="124" rx="140" ry="72" fill="#ECEAE2" />
      <ellipse
        cx="200"
        cy="124"
        rx="166"
        ry="88"
        fill="none"
        stroke="#3D6FA8"
        strokeWidth={4}
      />
    </svg>
    <div style={{ position: "absolute", inset: 0 }}>{children}</div>
  </div>
);

// Teller mit Speck und Eiern. food = 0..1 (für Einblenden von außen gesteuert)
export const BreakfastPlate: React.FC<{
  size?: number;
  baconY?: number;
  eggY?: number;
  baconO?: number;
  eggO?: number;
}> = ({ size = 640, baconY = 0, eggY = 0, baconO = 1, eggO = 1 }) => {
  const k = size / 640;
  return (
    <Plate size={size}>
      <div
        style={{
          position: "absolute",
          left: 300 * k,
          top: 60 * k + baconY,
          opacity: baconO,
        }}
      >
        <Bacon width={250 * k} rotate={-14} />
        <Bacon width={250 * k} rotate={-8} style={{ marginTop: -18 * k }} />
        <Bacon width={240 * k} rotate={-2} style={{ marginTop: -18 * k }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 70 * k,
          top: 70 * k + eggY,
          opacity: eggO,
        }}
      >
        <Egg size={190 * k} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 150 * k,
          top: 170 * k + eggY,
          opacity: eggO,
        }}
      >
        <Egg size={170 * k} style={{ transform: "rotate(160deg)" }} />
      </div>
    </Plate>
  );
};

// ---------- Kaffeetasse mit Dampf ----------
export const CoffeeCup: React.FC<{ size?: number; frame: number }> = ({
  size = 300,
  frame,
}) => (
  <svg
    width={size}
    height={size * 1.15}
    viewBox="0 0 200 230"
    style={{ overflow: "visible" }}
  >
    {[0, 1, 2].map((i) => {
      const o = 0.5 + 0.4 * Math.sin(frame / 8 + i * 2);
      const x = 70 + i * 28;
      const sway = Math.sin(frame / 10 + i) * 6;
      return (
        <path
          key={i}
          d={`M${x} 92 Q ${x - 14 + sway} 66 ${x} 46 Q ${x + 14 + sway} 26 ${x} 4`}
          stroke="#FFFFFF"
          strokeWidth={7}
          fill="none"
          strokeLinecap="round"
          opacity={o * 0.75}
        />
      );
    })}
    <ellipse cx="100" cy="218" rx="92" ry="12" fill="rgba(0,0,0,0.25)" />
    <ellipse
      cx="100"
      cy="212"
      rx="86"
      ry="14"
      fill="#F2EEE3"
      stroke="#CFC8B5"
      strokeWidth={3}
    />
    <path
      d="M150 128 Q 196 128 190 164 Q 184 192 146 186"
      stroke="#F2EEE3"
      strokeWidth={14}
      fill="none"
    />
    <path
      d="M36 104 L 164 104 L 154 196 Q 100 214 46 196 Z"
      fill="#F7F4EC"
      stroke="#CFC8B5"
      strokeWidth={3}
    />
    <ellipse
      cx="100"
      cy="104"
      rx="64"
      ry="12"
      fill="#5B3A1E"
      stroke="#CFC8B5"
      strokeWidth={3}
    />
    <path d="M44 132 L 156 132" stroke="#3D6FA8" strokeWidth={5} />
  </svg>
);

// ---------- Toastscheibe ----------
export const Toast: React.FC<{ size?: number; rotate?: number }> = ({
  size = 260,
  rotate = 0,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    style={{ transform: `rotate(${rotate}deg)`, overflow: "visible" }}
  >
    <path
      d="M30 70 Q 20 20 70 18 Q 100 0 130 18 Q 180 20 170 70 L 166 180 Q 100 192 34 180 Z"
      fill="#B8742A"
    />
    <path
      d="M44 74 Q 38 36 76 34 Q 100 20 124 34 Q 162 36 156 74 L 152 168 Q 100 178 48 168 Z"
      fill="#E9B56A"
    />
    {[
      [70, 80],
      [120, 100],
      [90, 130],
      [130, 145],
      [65, 150],
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={3} fill="#C98A3E" />
    ))}
    <path
      d="M70 60 Q 100 70 130 58 L 126 90 Q 100 100 74 92 Z"
      fill="#FFE8A3"
      opacity={0.85}
    />
  </svg>
);

// ---------- Küche (Hintergrund, wird mit Sepia gefiltert) ----------
export const Kitchen: React.FC = () => (
  <svg
    width="1080"
    height="1920"
    viewBox="0 0 1080 1920"
    style={{ position: "absolute", inset: 0 }}
  >
    <rect width="1080" height="1920" fill="#E9DCC0" />
    {/* Fliesen */}
    {Array.from({ length: 10 }).map((_, r) =>
      Array.from({ length: 8 }).map((__, c) => (
        <rect
          key={`${r}-${c}`}
          x={c * 140 + (r % 2) * 70 - 70}
          y={620 + r * 70}
          width={136}
          height={66}
          fill="#F3EAD6"
          stroke="#CDBE9C"
          strokeWidth={3}
        />
      )),
    )}
    {/* Fenster */}
    <rect
      x="300"
      y="190"
      width="480"
      height="380"
      fill="#BFD3D6"
      stroke="#6B4F2E"
      strokeWidth={22}
    />
    <path
      d="M540 190 L 540 570 M300 380 L 780 380"
      stroke="#6B4F2E"
      strokeWidth={14}
    />
    <circle cx="420" cy="290" r="50" fill="#F6E7B0" opacity={0.8} />
    {/* Regal */}
    <rect x="60" y="300" width="190" height="16" fill="#6B4F2E" />
    <rect x="80" y="230" width="44" height="70" rx="6" fill="#A06B3B" />
    <rect x="140" y="250" width="40" height="50" rx="6" fill="#7F8C8D" />
    <rect x="830" y="300" width="190" height="16" fill="#6B4F2E" />
    <circle cx="880" cy="270" r="30" fill="#B5651D" />
    <rect x="930" y="240" width="50" height="60" rx="5" fill="#D9C08C" />
    {/* Tisch */}
    <rect x="0" y="1090" width="1080" height="830" fill="#7A5230" />
    <rect x="0" y="1090" width="1080" height="26" fill="#8E6238" />
    {Array.from({ length: 6 }).map((_, i) => (
      <path
        key={i}
        d={`M0 ${1160 + i * 60} Q 540 ${1140 + i * 60} 1080 ${1170 + i * 60}`}
        stroke="#6A4528"
        strokeWidth={4}
        fill="none"
      />
    ))}
  </svg>
);

// ---------- Speck-Verkäufer (traurig) ----------
export const BaconSeller: React.FC<{ size?: number; frame: number }> = ({
  size = 420,
  frame,
}) => {
  const sigh = Math.sin(frame / 12) * 3;
  return (
    <svg
      width={size}
      height={size * 1.55}
      viewBox="0 0 240 372"
      style={{ overflow: "visible" }}
    >
      {/* Beine */}
      <rect x="84" y="276" width="30" height="80" fill="#3B3B3B" />
      <rect x="126" y="276" width="30" height="80" fill="#3B3B3B" />
      <rect x="76" y="350" width="42" height="14" rx="6" fill="#222" />
      <rect x="122" y="350" width="42" height="14" rx="6" fill="#222" />
      {/* Körper + Schürze */}
      <g transform={`translate(0 ${sigh})`}>
        <path
          d="M54 140 Q 120 120 186 140 L 194 290 L 46 290 Z"
          fill="#8A9BA8"
        />
        <path
          d="M78 150 L 162 150 L 172 296 L 68 296 Z"
          fill="#FAFAFA"
          stroke="#D0D0D0"
          strokeWidth={3}
        />
        <path
          d="M86 150 L 96 128 M154 150 L 144 128"
          stroke="#FAFAFA"
          strokeWidth={8}
        />
        <rect
          x="98"
          y="200"
          width="44"
          height="30"
          rx="4"
          fill="none"
          stroke="#D0D0D0"
          strokeWidth={3}
        />
        {/* Arme hängen runter */}
        <path
          d="M58 150 L 40 262"
          stroke="#8A9BA8"
          strokeWidth={28}
          strokeLinecap="round"
        />
        <path
          d="M182 150 L 196 250"
          stroke="#8A9BA8"
          strokeWidth={28}
          strokeLinecap="round"
        />
        <circle cx="40" cy="270" r="14" fill="#F1C27D" />
        {/* hält ein Stück Speck */}
        <g transform="translate(168 236) rotate(20)">
          <rect x="0" y="0" width="70" height="44" rx="10" fill="#A3361F" />
          <path
            d="M4 14 L 66 14 M4 28 L 66 28"
            stroke="#F3C9A6"
            strokeWidth={6}
          />
        </g>
        <circle cx="198" cy="256" r="14" fill="#F1C27D" />
        {/* Kopf (hängt etwas) */}
        <g transform="rotate(8 120 110)">
          <rect x="108" y="100" width="24" height="24" fill="#E0AC69" />
          <circle cx="120" cy="76" r="40" fill="#F1C27D" />
          {/* Mütze */}
          <path
            d="M78 64 Q 80 26 120 26 Q 160 26 162 64 Z"
            fill="#FFFFFF"
            stroke="#D0D0D0"
            strokeWidth={3}
          />
          <rect
            x="76"
            y="58"
            width="88"
            height="12"
            rx="4"
            fill="#FFFFFF"
            stroke="#D0D0D0"
            strokeWidth={3}
          />
          {/* Schnurrbart */}
          <path
            d="M98 96 Q 120 86 142 96 Q 130 104 120 98 Q 110 104 98 96 Z"
            fill="#5D4037"
          />
          {/* traurige Augen */}
          <path
            d="M96 76 Q 104 72 112 78 M128 78 Q 136 72 144 76"
            stroke={COLORS.ink}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M94 66 L 110 70 M146 66 L 130 70"
            stroke="#5D4037"
            strokeWidth={4}
            strokeLinecap="round"
          />
          <path
            d="M108 110 Q 120 102 132 110"
            stroke={COLORS.ink}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />
          <path d="M146 84 Q 150 96 146 100 Q 142 96 146 84 Z" fill="#5DADE2" />
        </g>
      </g>
    </svg>
  );
};

// ---------- Edward Bernays: Mann im Anzug ----------
export const SuitMan: React.FC<{ size?: number; point?: number }> = ({
  size = 420,
  point = 0,
}) => (
  <svg
    width={size}
    height={size * 1.55}
    viewBox="0 0 240 372"
    style={{ overflow: "visible" }}
  >
    <rect x="84" y="276" width="30" height="80" fill="#2C3E50" />
    <rect x="126" y="276" width="30" height="80" fill="#2C3E50" />
    <rect x="76" y="350" width="42" height="14" rx="6" fill="#111" />
    <rect x="122" y="350" width="42" height="14" rx="6" fill="#111" />
    {/* linker Arm */}
    <path
      d="M58 150 L 44 262"
      stroke="#2C3E50"
      strokeWidth={30}
      strokeLinecap="round"
    />
    <circle cx="44" cy="270" r="14" fill="#F1C27D" />
    {/* rechter Arm – zeigt nach oben, wenn point = 1 */}
    <g transform={`rotate(${-point * 130} 182 150)`}>
      <path
        d="M182 150 L 196 262"
        stroke="#2C3E50"
        strokeWidth={30}
        strokeLinecap="round"
      />
      <circle cx="196" cy="270" r="14" fill="#F1C27D" />
    </g>
    {/* Sakko */}
    <path d="M52 140 Q 120 122 188 140 L 196 292 L 44 292 Z" fill="#2C3E50" />
    {/* Hemd + Krawatte */}
    <path d="M98 134 L 120 200 L 142 134 Z" fill="#FAFAFA" />
    <path
      d="M114 140 L 126 140 L 130 210 L 120 222 L 110 210 Z"
      fill="#8E1B1B"
    />
    <path
      d="M98 134 L 112 214 L 84 150 Z M142 134 L 128 214 L 156 150 Z"
      fill="#22313F"
    />
    <rect x="150" y="170" width="24" height="8" fill="#FAFAFA" />
    {/* Kopf */}
    <rect x="108" y="102" width="24" height="24" fill="#E0AC69" />
    <circle cx="120" cy="76" r="40" fill="#F1C27D" />
    {/* glatt gekämmte Haare */}
    <path
      d="M80 70 Q 78 30 122 32 Q 162 32 160 66 Q 146 46 112 50 Q 92 52 80 70 Z"
      fill="#2B2B2B"
    />
    {/* Schnurrbart + Lächeln */}
    <path
      d="M104 96 Q 120 88 136 96 Q 126 102 120 98 Q 114 102 104 96 Z"
      fill="#2B2B2B"
    />
    <path
      d="M108 106 Q 120 114 132 106"
      stroke={COLORS.ink}
      strokeWidth={4}
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="105" cy="76" r="4.5" fill={COLORS.ink} />
    <circle cx="135" cy="76" r="4.5" fill={COLORS.ink} />
    <path
      d="M96 64 L 112 62 M144 64 L 128 62"
      stroke="#2B2B2B"
      strokeWidth={4}
      strokeLinecap="round"
    />
  </svg>
);

// ---------- Glühbirne (Idee) ----------
export const Bulb: React.FC<{ size?: number; glow?: number }> = ({
  size = 220,
  glow = 1,
}) => (
  <svg
    width={size}
    height={size * 1.3}
    viewBox="0 0 200 260"
    style={{ overflow: "visible" }}
  >
    {Array.from({ length: 10 }).map((_, i) => {
      const a = (i / 10) * Math.PI * 2;
      return (
        <path
          key={i}
          d={`M${100 + Math.cos(a) * 92} ${95 + Math.sin(a) * 92} L ${100 + Math.cos(a) * (110 + 20 * glow)} ${95 + Math.sin(a) * (110 + 20 * glow)}`}
          stroke="#F4A100"
          strokeWidth={9}
          strokeLinecap="round"
          opacity={glow}
        />
      );
    })}
    <circle
      cx="100"
      cy="95"
      r="72"
      fill="#FFE066"
      stroke="#E0A800"
      strokeWidth={5}
    />
    <path
      d="M78 110 Q 100 70 122 110"
      stroke="#E07A00"
      strokeWidth={5}
      fill="none"
    />
    <rect x="68" y="160" width="64" height="16" fill="#9AA5AE" />
    <rect x="70" y="178" width="60" height="14" fill="#7F8C8D" />
    <rect x="74" y="194" width="52" height="14" fill="#9AA5AE" />
    <path d="M84 210 L 116 210 L 108 226 L 92 226 Z" fill="#5D6D7E" />
  </svg>
);

// ---------- Brief an die Ärzte ----------
export const Letter: React.FC<{ width?: number; detail?: boolean }> = ({
  width = 560,
  detail = true,
}) => (
  <div
    style={{
      width,
      background: "#FBF6E9",
      border: "2px solid #D8CCAF",
      boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
      padding: detail ? width * 0.07 : width * 0.08,
      color: COLORS.ink,
      fontFamily: FONT_SUB,
      boxSizing: "border-box",
    }}
  >
    {detail ? (
      <>
        <div style={{ fontFamily: FONT_VINTAGE, fontSize: width * 0.065 }}>
          Sehr geehrter Herr Doktor,
        </div>
        <div
          style={{
            fontSize: width * 0.075,
            fontWeight: 800,
            margin: `${width * 0.04}px 0`,
            lineHeight: 1.15,
          }}
        >
          Ist ein kräftiges Frühstück gesund?
        </div>
        <div
          style={{
            display: "flex",
            gap: width * 0.08,
            fontSize: width * 0.065,
            fontWeight: 700,
          }}
        >
          <span>☐ Nein</span>
          <span style={{ color: "#1B6E3A" }}>☑ JA</span>
        </div>
      </>
    ) : (
      <>
        <div
          style={{
            height: width * 0.05,
            width: "60%",
            background: "#B9A984",
            marginBottom: width * 0.05,
          }}
        />
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: width * 0.03,
              width: `${90 - i * 12}%`,
              background: "#CFC2A0",
              marginBottom: width * 0.04,
            }}
          />
        ))}
        <div
          style={{
            fontSize: width * 0.12,
            fontWeight: 900,
            color: "#1B6E3A",
            fontFamily: FONT_BOLD,
          }}
        >
          ☑ JA
        </div>
      </>
    )}
  </div>
);

// ---------- Zeitung ----------
export const Newspaper: React.FC<{
  width?: number;
  title?: string;
  headline: string;
  headSize?: number;
}> = ({ width = 760, title = "The Morning Post", headline, headSize }) => (
  <div
    style={{
      width,
      background: "#F4E9D0",
      padding: width * 0.05,
      boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
      textAlign: "center",
      color: COLORS.ink,
      boxSizing: "border-box",
    }}
  >
    <div
      style={{
        fontFamily: FONT_VINTAGE,
        fontSize: width * 0.07,
        borderBottom: `4px double ${COLORS.ink}`,
        paddingBottom: 8,
      }}
    >
      {title}
    </div>
    <div
      style={{
        fontFamily: FONT_BOLD,
        fontSize: headSize ?? width * 0.12,
        lineHeight: 1.02,
        marginTop: width * 0.03,
      }}
    >
      {headline}
    </div>
    <div
      style={{ display: "flex", gap: width * 0.03, marginTop: width * 0.03 }}
    >
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ flex: 1 }}>
          {Array.from({ length: 5 }).map((_, j) => (
            <div
              key={j}
              style={{
                height: width * 0.012,
                background: "#9c8a6a",
                marginTop: width * 0.014,
                width: `${78 + ((i + j) % 3) * 10}%`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// ---------- Haken und Kreuz ----------
export const Check: React.FC<{ size?: number; progress?: number }> = ({
  size = 160,
  progress = 1,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="#1F9D55" />
    <path
      d="M28 52 L 44 68 L 74 34"
      stroke="#FFF"
      strokeWidth={10}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - progress}
    />
  </svg>
);

// ---------- Handy mit Nachricht ----------
export const Phone: React.FC<{ width?: number; children: React.ReactNode }> = ({
  width = 420,
  children,
}) => (
  <div
    style={{
      width,
      height: width * 1.9,
      borderRadius: width * 0.12,
      background: "#111",
      padding: width * 0.04,
      boxSizing: "border-box",
      boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: width * 0.09,
        background: "#F2F4F7",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          width: width * 0.3,
          height: width * 0.06,
          borderRadius: 99,
          background: "#111",
          margin: `${width * 0.03}px auto`,
        }}
      />
      {children}
    </div>
  </div>
);

// ---------- Verlobungsring mit Diamant ----------
export const Ring: React.FC<{ size?: number; sparkle?: number }> = ({
  size = 200,
  sparkle = 0,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    style={{ overflow: "visible" }}
  >
    <ellipse
      cx="100"
      cy="135"
      rx="62"
      ry="52"
      fill="none"
      stroke="#E2B13C"
      strokeWidth={14}
    />
    <ellipse
      cx="100"
      cy="135"
      rx="62"
      ry="52"
      fill="none"
      stroke="#FFE08A"
      strokeWidth={4}
    />
    <path d="M86 86 L 114 86 L 108 96 L 92 96 Z" fill="#E2B13C" />
    <path
      d="M70 58 L 130 58 L 100 92 Z"
      fill="#BDE7F7"
      stroke="#6CB4D4"
      strokeWidth={3}
    />
    <path
      d="M70 58 L 84 40 L 116 40 L 130 58 Z"
      fill="#E6F8FF"
      stroke="#6CB4D4"
      strokeWidth={3}
    />
    <path
      d="M84 40 L 92 58 L 100 40 L 108 58 L 116 40"
      stroke="#6CB4D4"
      strokeWidth={2}
      fill="none"
    />
    <path
      d={`M150 30 l 6 14 l 14 6 l -14 6 l -6 14 l -6 -14 l -14 -6 l 14 -6 Z`}
      fill="#FFF"
      opacity={sparkle}
    />
  </svg>
);
