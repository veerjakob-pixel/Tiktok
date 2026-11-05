import React from "react";
import { FONT_BOLD, FONT_SUB, FONT_VINTAGE } from "../theme";

// Alle Grafiken für Folge 3 als SVG/CSS – keine Bilder aus dem Internet.

let uid = 0;
const useId = (p: string) => React.useMemo(() => `${p}${uid++}`, [p]);

// ---------- Diamant (Brillantschliff, Seitenansicht) ----------
export const Diamond: React.FC<{ size?: number; glow?: number; tint?: string; style?: React.CSSProperties }> = ({
  size = 300,
  glow = 1,
  tint = "#BFEFFF",
  style,
}) => {
  const id = useId("dia");
  return (
    <svg width={size} height={size * 0.9} viewBox="0 0 200 180" style={{ overflow: "visible", ...style }}>
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor={tint} />
          <stop offset="1" stopColor="#6FB7E0" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#8FD3F5" />
        </linearGradient>
        <radialGradient id={`${id}g`}>
          <stop offset="0" stopColor="#fff" stopOpacity={0.8 * glow} />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="80" r="120" fill={`url(#${id}g)`} />
      {/* Krone */}
      <polygon points="40,20 160,20 195,60 5,60" fill={`url(#${id}a)`} stroke="#E8FAFF" strokeWidth="1.5" />
      <polygon points="40,20 70,60 5,60" fill="#D8F4FF" />
      <polygon points="70,60 100,20 130,60" fill="#A9E3FA" />
      <polygon points="160,20 130,60 195,60" fill="#7CC6EB" />
      <polygon points="40,20 100,20 70,60" fill="#F2FCFF" />
      <polygon points="100,20 160,20 130,60" fill="#C6EEFF" />
      {/* Pavillon */}
      <polygon points="5,60 195,60 100,175" fill={`url(#${id}b)`} stroke="#E8FAFF" strokeWidth="1.5" />
      <polygon points="5,60 70,60 100,175" fill="#BDEBFC" />
      <polygon points="70,60 130,60 100,175" fill="#EAFBFF" />
      <polygon points="130,60 195,60 100,175" fill="#7FC4E8" />
      <polyline points="40,60 100,175 160,60" fill="none" stroke="#fff" strokeWidth="1" opacity="0.7" />
    </svg>
  );
};

// ---------- Funkel-Stern ----------
export const Sparkle: React.FC<{ size?: number; style?: React.CSSProperties; color?: string }> = ({
  size = 60,
  style,
  color = "#fff",
}) => (
  <svg width={size} height={size} viewBox="-10 -10 20 20" style={style}>
    <path d="M0,-10 L1.6,-1.6 L10,0 L1.6,1.6 L0,10 L-1.6,1.6 L-10,0 L-1.6,-1.6 Z" fill={color} />
  </svg>
);

// ---------- Ring mit Diamant ----------
export const Ring: React.FC<{ size?: number; plain?: boolean; style?: React.CSSProperties }> = ({
  size = 500,
  plain = false,
  style,
}) => {
  const id = useId("ring");
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" style={{ overflow: "visible", ...style }}>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF1B0" />
          <stop offset="0.35" stopColor="#E7B53C" />
          <stop offset="0.7" stopColor="#A87412" />
          <stop offset="1" stopColor="#FFE38A" />
        </linearGradient>
      </defs>
      {/* Ringschiene (schräg von vorne) */}
      <ellipse cx="200" cy="275" rx="150" ry="95" fill="none" stroke={`url(#${id}g)`} strokeWidth="30" />
      <ellipse cx="200" cy="275" rx="150" ry="95" fill="none" stroke="#FFF7D0" strokeWidth="4" opacity="0.6" transform="translate(0,-8)" />
      {!plain && (
        <>
          {/* Fassung */}
          <polygon points="165,190 235,190 222,165 178,165" fill={`url(#${id}g)`} />
          <line x1="172" y1="168" x2="160" y2="120" stroke="#E7B53C" strokeWidth="8" strokeLinecap="round" />
          <line x1="228" y1="168" x2="240" y2="120" stroke="#E7B53C" strokeWidth="8" strokeLinecap="round" />
          <foreignObject x="110" y="40" width="180" height="170">
            <Diamond size={180} />
          </foreignObject>
        </>
      )}
    </svg>
  );
};

// ---------- Preisschild ----------
export const PriceTag: React.FC<{ text: string; width?: number; flip?: number; color?: string; fontScale?: number }> = ({
  text,
  width = 420,
  flip = 1,
  color = "#FFF8E7",
  fontScale = 0.26,
}) => (
  <div style={{ position: "relative", width, height: width * 0.6, transform: `perspective(900px) rotateY(${(1 - flip) * 90}deg)` }}>
    <svg width={width} height={width * 0.6} viewBox="0 0 200 120" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <path d="M40,5 L190,5 Q198,5 198,13 L198,107 Q198,115 190,115 L40,115 L5,60 Z" fill={color} stroke="#3A2A16" strokeWidth="4" />
      <circle cx="32" cy="60" r="8" fill="#3A2A16" />
      <path d="M32,60 C10,40 -10,30 -40,-10" stroke="#C9A24A" strokeWidth="3" fill="none" />
    </svg>
    <div
      style={{
        position: "absolute",
        left: width * 0.22,
        right: 0,
        top: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT_BOLD,
        fontSize: width * fontScale,
        whiteSpace: "nowrap",
        color: "#2B1D0E",
      }}
    >
      {text}
    </div>
  </div>
);

// ---------- Stempel ----------
export const Stamp: React.FC<{ text: string; size?: number; rotate?: number }> = ({ text, size = 120, rotate = -12 }) => (
  <div
    style={{
      fontFamily: FONT_BOLD,
      fontSize: size,
      color: "#E01E37",
      border: `${size * 0.09}px solid #E01E37`,
      borderRadius: size * 0.12,
      padding: `${size * 0.02}px ${size * 0.25}px`,
      transform: `rotate(${rotate}deg)`,
      letterSpacing: size * 0.04,
      background: "rgba(255,255,255,0.12)",
      boxShadow: "0 0 0 4px rgba(224,30,55,0.25)",
      textShadow: "0 0 2px rgba(224,30,55,0.6)",
      lineHeight: 1.1,
    }}
  >
    {text}
  </div>
);

// ---------- Herz ----------
export const Heart: React.FC<{ size?: number; color?: string; broken?: number; style?: React.CSSProperties }> = ({
  size = 300,
  color = "#E5383B",
  broken = 0,
  style,
}) => {
  const d = "M100,175 C40,130 0,95 0,55 C0,20 28,0 55,0 C75,0 92,12 100,30 C108,12 125,0 145,0 C172,0 200,20 200,55 C200,95 160,130 100,175 Z";
  if (broken <= 0)
    return (
      <svg width={size} height={size * 0.9} viewBox="-5 -5 210 190" style={style}>
        <path d={d} fill={color} stroke="#fff" strokeWidth="6" />
        <ellipse cx="55" cy="45" rx="22" ry="14" fill="#fff" opacity="0.35" transform="rotate(-30 55 45)" />
      </svg>
    );
  return (
    <svg width={size} height={size * 0.9} viewBox="-30 -5 260 190" style={{ overflow: "visible", ...style }}>
      <defs>
        <clipPath id="hl">
          <path d="M-40,-10 L100,-10 L100,30 L88,70 L110,95 L92,130 L100,175 L-40,190 Z" />
        </clipPath>
        <clipPath id="hr">
          <path d="M240,-10 L100,-10 L100,30 L88,70 L110,95 L92,130 L100,175 L240,190 Z" />
        </clipPath>
      </defs>
      <g transform={`translate(${-broken * 18},${broken * 8}) rotate(${-broken * 8} 100 175)`} clipPath="url(#hl)">
        <path d={d} fill={color} stroke="#fff" strokeWidth="6" />
      </g>
      <g transform={`translate(${broken * 18},${broken * 8}) rotate(${broken * 8} 100 175)`} clipPath="url(#hr)">
        <path d={d} fill={color} stroke="#fff" strokeWidth="6" />
      </g>
    </svg>
  );
};

// ---------- Gehaltsabrechnung ----------
export const Payslip: React.FC<{ month: string; width?: number; style?: React.CSSProperties }> = ({ month, width = 520, style }) => (
  <div
    style={{
      width,
      height: width * 0.62,
      background: "#FFFFFF",
      borderRadius: 14,
      boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
      padding: 28,
      boxSizing: "border-box",
      fontFamily: FONT_SUB,
      color: "#1D2433",
      position: "relative",
      ...style,
    }}
  >
    <div style={{ fontWeight: 900, fontSize: width * 0.065, letterSpacing: 1 }}>GEHALTSABRECHNUNG</div>
    <div style={{ fontWeight: 600, fontSize: width * 0.05, color: "#5B6475", marginTop: 4 }}>{month}</div>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ display: "flex", gap: 16, marginTop: 14, alignItems: "center" }}>
        <div style={{ flex: 1, height: 12, borderRadius: 6, background: "#D9DEE7" }} />
        <div style={{ width: width * 0.18, height: 12, borderRadius: 6, background: "#B9C1CF" }} />
      </div>
    ))}
    <div
      style={{
        position: "absolute",
        right: 28,
        bottom: 22,
        fontWeight: 900,
        fontSize: width * 0.075,
        color: "#1B7F4C",
      }}
    >
      NETTO ✓
    </div>
  </div>
);

// ---------- Leeres Juwelier-Schaufenster (1930er) ----------
export const ShopWindow: React.FC<{ width?: number }> = ({ width = 900 }) => (
  <svg width={width} height={width * 1.0} viewBox="0 0 400 400">
    {/* Fassade */}
    <rect x="0" y="0" width="400" height="400" fill="#7A6247" />
    <rect x="20" y="20" width="360" height="60" fill="#3E2E1C" />
    <text x="200" y="64" textAnchor="middle" fontFamily={FONT_VINTAGE} fontSize="38" fill="#E9D8A6" letterSpacing="4">
      JUWELIER
    </text>
    {/* Markise */}
    {Array.from({ length: 10 }).map((_, i) => (
      <path key={i} d={`M${20 + i * 36},88 L${56 + i * 36},88 L${52 + i * 36},118 Q${38 + i * 36},126 ${24 + i * 36},118 Z`} fill={i % 2 ? "#E9D8A6" : "#8C2F1B"} />
    ))}
    {/* Fenster */}
    <rect x="40" y="130" width="320" height="200" fill="#2A2118" stroke="#3E2E1C" strokeWidth="10" />
    <rect x="50" y="140" width="300" height="180" fill="#463A2C" />
    {/* leere Samtkissen */}
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={75 + i * 95} y="270" width="60" height="30" rx="6" fill="#5E2A2A" />
        <rect x={98 + i * 95} y="240" width="14" height="30" fill="#4A2020" />
        <ellipse cx={105 + i * 95} cy="240" rx="22" ry="7" fill="#6E3434" />
      </g>
    ))}
    {/* Spinnweben + Spiegelung */}
    <path d="M50,140 L95,140 M50,140 L50,185 M50,140 L85,175 M60,140 Q62,152 50,155 M75,140 Q72,165 50,170" stroke="#CFC4B0" strokeWidth="1.5" fill="none" opacity="0.8" />
    <polygon points="230,140 270,140 170,320 130,320" fill="#fff" opacity="0.06" />
    {/* Schild */}
    <g transform="rotate(-8 290 200)">
      <rect x="235" y="175" width="110" height="46" fill="#F1E6C8" stroke="#2B1D0E" strokeWidth="3" />
      <text x="290" y="206" textAnchor="middle" fontFamily={FONT_BOLD} fontSize="22" fill="#2B1D0E">
        AUSVERKAUF
      </text>
    </g>
    <rect x="0" y="330" width="400" height="70" fill="#5A4733" />
  </svg>
);

// ---------- Sinkende Kurve ----------
export const FallingChart: React.FC<{ progress: number; width?: number }> = ({ progress, width = 880 }) => {
  const pts = [
    [40, 60],
    [110, 75],
    [180, 150],
    [250, 210],
    [320, 250],
    [380, 270],
  ];
  const n = Math.max(1, Math.min(pts.length, 1 + progress * (pts.length - 1)));
  const full = Math.floor(n);
  const frac = n - full;
  const shown = pts.slice(0, full);
  if (full < pts.length && frac > 0) {
    const a = pts[full - 1];
    const b = pts[full];
    shown.push([a[0] + (b[0] - a[0]) * frac, a[1] + (b[1] - a[1]) * frac]);
  }
  const last = shown[shown.length - 1];
  return (
    <svg width={width} height={width * 0.85} viewBox="0 0 400 340">
      <rect x="0" y="0" width="400" height="340" fill="#F1E6C8" stroke="#2B1D0E" strokeWidth="4" />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="30" x2="390" y1={60 + i * 70} y2={60 + i * 70} stroke="#BFAF8C" strokeWidth="1.5" strokeDasharray="6 6" />
      ))}
      <line x1="30" y1="30" x2="30" y2="300" stroke="#2B1D0E" strokeWidth="3" />
      <line x1="30" y1="300" x2="390" y2="300" stroke="#2B1D0E" strokeWidth="3" />
      <text x="40" y="24" fontFamily={FONT_VINTAGE} fontSize="20" fill="#2B1D0E">
        Diamant-Verkäufe
      </text>
      {["1929", "1931", "1933", "1935", "1937"].map((y, i) => (
        <text key={y} x={40 + i * 85} y="325" fontFamily={FONT_SUB} fontWeight={700} fontSize="16" fill="#2B1D0E">
          {y}
        </text>
      ))}
      <polyline points={shown.map((p) => p.join(",")).join(" ")} fill="none" stroke="#8C1C13" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
      {progress > 0.98 && <polygon points={`${last[0] - 4},${last[1] - 22} ${last[0] + 22},${last[1] + 4} ${last[0] + 10},${last[1] + 14}`} fill="#8C1C13" transform={`rotate(10 ${last[0]} ${last[1]})`} />}
      <circle cx={last[0]} cy={last[1]} r="9" fill="#8C1C13" />
    </svg>
  );
};

// ---------- Fabrikgebäude "DE BEERS" ----------
export const Headquarters: React.FC<{ width?: number; smoke?: number }> = ({ width = 900, smoke = 0 }) => (
  <svg width={width} height={width} viewBox="0 0 400 400">
    <rect x="0" y="0" width="400" height="400" fill="#CDBB94" />
    {/* Rauch */}
    {[0, 1, 2, 3].map((i) => {
      const t = (smoke * 0.5 + i / 4) % 1;
      return <circle key={i} cx={95 + t * 40} cy={110 - t * 100} r={14 + t * 26} fill="#8E8270" opacity={0.7 * (1 - t)} />;
    })}
    <rect x="80" y="100" width="30" height="120" fill="#5A4A36" />
    {/* Gebäude */}
    <rect x="40" y="180" width="320" height="200" fill="#6B573E" />
    <polygon points="40,180 200,120 360,180" fill="#4E3E2B" />
    <rect x="70" y="200" width="260" height="46" fill="#2B1D0E" />
    <text x="200" y="236" textAnchor="middle" fontFamily={FONT_VINTAGE} fontSize="36" fill="#F1E6C8" letterSpacing="6">
      DE BEERS
    </text>
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x={70 + i * 54} y="265" width="34" height="50" fill="#E9D8A6" opacity="0.85" />
    ))}
    <rect x="175" y="325" width="50" height="55" fill="#2B1D0E" />
    <rect x="0" y="380" width="400" height="20" fill="#4A3A28" />
    {/* Diamant-Logo */}
    <g transform="translate(184,128) scale(0.16)">
      <polygon points="40,20 160,20 195,60 100,175 5,60" fill="#F1E6C8" />
    </g>
  </svg>
);

// ---------- Zeitungsseite mit Anzeige ----------
export const Newspaper: React.FC<{ width?: number; headline: string; style?: React.CSSProperties }> = ({ width = 520, headline, style }) => (
  <div
    style={{
      width,
      height: width * 1.25,
      background: "#EFE4C6",
      boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
      padding: 22,
      boxSizing: "border-box",
      fontFamily: FONT_VINTAGE,
      color: "#2B1D0E",
      ...style,
    }}
  >
    <div style={{ fontSize: width * 0.08, textAlign: "center", borderBottom: "4px double #2B1D0E", paddingBottom: 6 }}>The Daily Times</div>
    <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
      <div style={{ flex: 1 }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{ height: 8, background: "#B9A985", marginBottom: 9, width: `${70 + ((i * 37) % 30)}%` }} />
        ))}
      </div>
      <div
        style={{
          flex: 1.3,
          border: "3px solid #2B1D0E",
          padding: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Diamond size={width * 0.3} glow={0.3} tint="#E9DFC7" />
        <div style={{ fontSize: width * 0.06, textAlign: "center", lineHeight: 1.05 }}>{headline}</div>
      </div>
    </div>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} style={{ height: 8, background: "#B9A985", marginTop: 10, width: `${60 + ((i * 53) % 40)}%` }} />
    ))}
  </div>
);

// ---------- Pfandhaus ----------
export const Pawnshop: React.FC<{ width?: number; cross?: number }> = ({ width = 900, cross = 0 }) => (
  <svg width={width} height={width} viewBox="0 0 400 400">
    <rect x="0" y="0" width="400" height="400" fill="#2E3440" />
    <rect x="30" y="40" width="340" height="330" fill="#4C566A" />
    {/* Pfandhaus-Kugeln */}
    <line x1="200" y1="0" x2="200" y2="40" stroke="#C9A24A" strokeWidth="5" />
    {[[180, 50], [220, 50], [200, 82]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="18" fill="#E7B53C" stroke="#8A6414" strokeWidth="3" />
    ))}
    <rect x="50" y="110" width="300" height="56" fill="#1F2430" />
    <text x="200" y="150" textAnchor="middle" fontFamily={FONT_BOLD} fontSize="36" fill="#FFD166" letterSpacing="5">
      PFANDHAUS
    </text>
    {/* Schild "Ankauf Diamanten" */}
    <rect x="70" y="190" width="260" height="120" rx="8" fill="#FFF8E7" stroke="#1F2430" strokeWidth="5" />
    <text x="200" y="235" textAnchor="middle" fontFamily={FONT_BOLD} fontSize="30" fill="#1F2430">
      ANKAUF
    </text>
    <text x="200" y="280" textAnchor="middle" fontFamily={FONT_BOLD} fontSize="30" fill="#1F2430">
      DIAMANTEN 💎
    </text>
    {/* Durchstreichen */}
    <line
      x1="60"
      y1="320"
      x2={60 + 280 * cross}
      y2={320 - 140 * cross}
      stroke="#E01E37"
      strokeWidth="16"
      strokeLinecap="round"
    />
    <line
      x1="60"
      y1="180"
      x2={60 + 280 * Math.max(0, cross * 2 - 1)}
      y2={180 + 140 * Math.max(0, cross * 2 - 1)}
      stroke="#E01E37"
      strokeWidth="16"
      strokeLinecap="round"
      opacity={cross > 0.5 ? 1 : 0}
    />
    <rect x="30" y="330" width="340" height="40" fill="#3B4252" />
  </svg>
);

// ---------- Kleiner grauer Stein ----------
export const Rock: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 200, style }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 200 140" style={style}>
    <path d="M20,110 L10,70 L45,30 L110,15 L170,40 L192,95 L150,128 L60,130 Z" fill="#8A8F98" stroke="#5B6068" strokeWidth="5" />
    <path d="M45,30 L70,70 L10,70 M70,70 L110,15 M70,70 L150,128 M110,15 L140,75 L192,95 M140,75 L150,128" stroke="#6E737C" strokeWidth="3" fill="none" />
  </svg>
);

// ---------- Zuckerwürfel ----------
export const SugarCube: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 200, style }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={style}>
    <polygon points="100,20 180,60 100,100 20,60" fill="#FFFFFF" stroke="#C8CCD4" strokeWidth="4" />
    <polygon points="20,60 100,100 100,185 20,145" fill="#E6E9EF" stroke="#C8CCD4" strokeWidth="4" />
    <polygon points="180,60 100,100 100,185 180,145" fill="#D3D8E0" stroke="#C8CCD4" strokeWidth="4" />
    {Array.from({ length: 14 }).map((_, i) => (
      <circle key={i} cx={30 + ((i * 47) % 140)} cy={70 + ((i * 31) % 100)} r="3" fill="#BFC5CF" />
    ))}
  </svg>
);
