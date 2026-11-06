import React from "react";
import { FONT_BOLD, FONT_SUB, FONT_VINTAGE } from "../theme";

// Alle Grafiken für Folge 4 als SVG/CSS – keine Bilder aus dem Internet.

let uid = 0;
const useId = (p: string) => React.useMemo(() => `${p}${uid++}`, [p]);

// ---------- Zuckerwürfel (3D, mit Kristall-Körnung, optional Heiligenschein) ----------
export const Cube: React.FC<{ size?: number; halo?: number; crack?: number; style?: React.CSSProperties }> = ({
  size = 300,
  halo = 0,
  crack = 0,
  style,
}) => {
  const id = useId("cube");
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible", ...style }}>
      <defs>
        <linearGradient id={`${id}t`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#EEF1F6" />
        </linearGradient>
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E9ECF2" />
          <stop offset="1" stopColor="#C9CFD9" />
        </linearGradient>
        <linearGradient id={`${id}r`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D6DBE4" />
          <stop offset="1" stopColor="#AEB6C3" />
        </linearGradient>
        <radialGradient id={`${id}h`}>
          <stop offset="0.6" stopColor="#FFE680" stopOpacity="0" />
          <stop offset="0.8" stopColor="#FFE680" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFE680" stopOpacity="0" />
        </radialGradient>
      </defs>
      {halo > 0 && (
        <g opacity={halo} transform={`translate(0,${-8 * halo})`}>
          <ellipse cx="100" cy="0" rx="62" ry="16" fill="none" stroke="#FFD84D" strokeWidth="9" />
          <ellipse cx="100" cy="0" rx="62" ry="16" fill="none" stroke="#FFF6C2" strokeWidth="3" />
          <circle cx="100" cy="95" r="120" fill={`url(#${id}h)`} />
        </g>
      )}
      <ellipse cx="100" cy="192" rx="80" ry="10" fill="#000" opacity="0.25" />
      <polygon points="100,22 180,60 100,98 20,60" fill={`url(#${id}t)`} stroke="#fff" strokeWidth="2" />
      <polygon points="20,60 100,98 100,186 20,148" fill={`url(#${id}l)`} />
      <polygon points="180,60 100,98 100,186 180,148" fill={`url(#${id}r)`} />
      <polyline points="20,60 100,98 180,60" fill="none" stroke="#fff" strokeWidth="2" opacity="0.8" />
      <line x1="100" y1="98" x2="100" y2="186" stroke="#fff" strokeWidth="1.5" opacity="0.6" />
      {Array.from({ length: 40 }).map((_, i) => {
        const face = i % 3;
        const u = ((i * 37) % 100) / 100;
        const v = ((i * 61) % 100) / 100;
        const [x, y] =
          face === 0
            ? [100 + (u - v) * 75, 30 + (u + v) * 34]
            : face === 1
              ? [26 + u * 70, 66 + u * 34 + v * 78]
              : [104 + u * 70, 98 - u * 34 + v * 80];
        return <rect key={i} x={x} y={y} width="3" height="3" fill="#fff" opacity={0.5 + (i % 4) * 0.12} transform={`rotate(${i * 23} ${x} ${y})`} />;
      })}
      {crack > 0 && (
        <polyline
          points="100,98 92,120 108,140 96,160 104,186"
          fill="none"
          stroke="#7C8594"
          strokeWidth="3"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - crack}
        />
      )}
    </svg>
  );
};

// ---------- Butterstück (mit Teufelshörnern / bösem Blick) ----------
export const Butter: React.FC<{ size?: number; evil?: number; style?: React.CSSProperties }> = ({ size = 320, evil = 0, style }) => {
  const id = useId("butter");
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 240 190" style={{ overflow: "visible", ...style }}>
      <defs>
        <linearGradient id={`${id}t`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF4B8" />
          <stop offset="1" stopColor="#FFE27A" />
        </linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFDB5C" />
          <stop offset="1" stopColor="#E9B931" />
        </linearGradient>
      </defs>
      {evil > 0 && (
        <g opacity={evil}>
          <path d="M70,62 C55,30 40,20 30,8 C60,18 80,35 88,58 Z" fill="#C1121F" stroke="#6A040F" strokeWidth="3" />
          <path d="M170,62 C185,30 200,20 210,8 C180,18 160,35 152,58 Z" fill="#C1121F" stroke="#6A040F" strokeWidth="3" />
        </g>
      )}
      <ellipse cx="120" cy="178" rx="105" ry="10" fill="#000" opacity="0.25" />
      <polygon points="30,80 160,55 220,85 90,112" fill={`url(#${id}t)`} stroke="#FFF7D1" strokeWidth="2" />
      <polygon points="30,80 90,112 90,170 30,138" fill={`url(#${id}f)`} />
      <polygon points="90,112 220,85 220,143 90,170" fill="#F2C744" />
      <path d="M95,126 C130,118 170,110 215,100" stroke="#FFF2A8" strokeWidth="4" opacity="0.6" fill="none" />
      {evil > 0 && (
        <g opacity={evil}>
          {/* böse Augen + Grinsen */}
          <path d="M115,124 L140,132 L115,137 Z" fill="#2B1D0E" />
          <path d="M190,112 L165,124 L190,127 Z" fill="#2B1D0E" />
          <path d="M120,150 Q152,165 192,138" stroke="#2B1D0E" strokeWidth="5" fill="none" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};

// ---------- Forscher im Laborkittel ----------
export const Scientist: React.FC<{ size?: number; hair?: string; skin?: string; style?: React.CSSProperties; holding?: boolean }> = ({
  size = 360,
  hair = "#3B2A1A",
  skin = "#F1C9A5",
  style,
  holding = true,
}) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 200 260" style={style}>
    {/* Körper / Kittel */}
    <path d="M40,260 L48,150 Q100,128 152,150 L160,260 Z" fill="#F7F9FC" stroke="#C9D1DD" strokeWidth="3" />
    <path d="M100,140 L100,260" stroke="#C9D1DD" strokeWidth="3" />
    <path d="M86,142 L100,180 L114,142" fill="#3D5A80" />
    <path d="M96,150 L100,200 L104,150 Z" fill="#9B2226" />
    <rect x="118" y="176" width="22" height="26" rx="3" fill="#E3E8EF" />
    <line x1="124" y1="174" x2="124" y2="190" stroke="#3D5A80" strokeWidth="3" />
    {/* Kopf */}
    <rect x="88" y="118" width="24" height="22" fill={skin} />
    <ellipse cx="100" cy="88" rx="38" ry="44" fill={skin} />
    <path d="M62,80 Q64,40 100,40 Q138,40 138,80 Q130,58 100,58 Q72,58 62,80 Z" fill={hair} />
    {/* Brille */}
    <circle cx="85" cy="90" r="12" fill="rgba(255,255,255,0.35)" stroke="#1D2433" strokeWidth="3.5" />
    <circle cx="115" cy="90" r="12" fill="rgba(255,255,255,0.35)" stroke="#1D2433" strokeWidth="3.5" />
    <line x1="97" y1="90" x2="103" y2="90" stroke="#1D2433" strokeWidth="3" />
    <circle cx="85" cy="91" r="3" fill="#1D2433" />
    <circle cx="115" cy="91" r="3" fill="#1D2433" />
    <path d="M88,114 Q100,120 112,114" stroke="#8C4A3B" strokeWidth="3" fill="none" strokeLinecap="round" />
    {holding && (
      <g>
        <rect x="30" y="190" width="56" height="70" rx="4" fill="#FFF8E7" stroke="#B9A985" strokeWidth="3" transform="rotate(-8 58 225)" />
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1="38" y1={205 + i * 12} x2="76" y2={200 + i * 12} stroke="#B9A985" strokeWidth="3" />
        ))}
      </g>
    )}
  </svg>
);

// ---------- Geldschein ----------
export const Bill: React.FC<{ width?: number; style?: React.CSSProperties }> = ({ width = 220, style }) => (
  <svg width={width} height={width * 0.46} viewBox="0 0 200 92" style={style}>
    <rect x="1" y="1" width="198" height="90" rx="6" fill="#7FB77E" stroke="#2D6A4F" strokeWidth="3" />
    <rect x="10" y="10" width="180" height="72" rx="4" fill="none" stroke="#2D6A4F" strokeWidth="2" opacity="0.7" />
    <ellipse cx="100" cy="46" rx="26" ry="30" fill="#B7E4C7" stroke="#2D6A4F" strokeWidth="2" />
    <text x="100" y="58" textAnchor="middle" fontFamily={FONT_BOLD} fontSize="36" fill="#1B4332">
      $
    </text>
    <text x="24" y="34" fontFamily={FONT_BOLD} fontSize="20" fill="#1B4332">
      100
    </text>
    <text x="150" y="80" fontFamily={FONT_BOLD} fontSize="20" fill="#1B4332">
      100
    </text>
  </svg>
);

// ---------- Röhrenfernseher (1960er) ----------
export const TV: React.FC<{ width?: number; children?: React.ReactNode }> = ({ width = 820, children }) => (
  <div style={{ position: "relative", width, height: width * 0.86 }}>
    <svg width={width} height={width * 0.86} viewBox="0 0 400 344" style={{ position: "absolute", inset: 0 }}>
      <line x1="170" y1="40" x2="120" y2="0" stroke="#3E2E1C" strokeWidth="5" />
      <line x1="230" y1="40" x2="280" y2="0" stroke="#3E2E1C" strokeWidth="5" />
      <rect x="10" y="40" width="380" height="270" rx="30" fill="#7A5230" stroke="#3E2E1C" strokeWidth="6" />
      <rect x="30" y="60" width="270" height="230" rx="40" fill="#1A1A1A" />
      <circle cx="345" cy="110" r="18" fill="#C9A86A" stroke="#3E2E1C" strokeWidth="4" />
      <circle cx="345" cy="170" r="18" fill="#C9A86A" stroke="#3E2E1C" strokeWidth="4" />
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1="325" y1={215 + i * 12} x2="365" y2={215 + i * 12} stroke="#3E2E1C" strokeWidth="4" />
      ))}
      <rect x="60" y="310" width="30" height="30" fill="#3E2E1C" />
      <rect x="310" y="310" width="30" height="30" fill="#3E2E1C" />
    </svg>
    <div
      style={{
        position: "absolute",
        left: `${(42 / 400) * 100}%`,
        top: `${(72 / 344) * 100}%`,
        width: `${(246 / 400) * 100}%`,
        height: `${(206 / 344) * 100}%`,
        borderRadius: width * 0.07,
        overflow: "hidden",
        background: "radial-gradient(circle, #D8D2C2 0%, #8E8778 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {children}
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0 2px, transparent 2px 5px)" }} />
    </div>
  </div>
);

// ---------- Herz mit EKG ----------
export const EcgHeart: React.FC<{ size?: number; t: number; wild?: number }> = ({ size = 520, t, wild = 0 }) => {
  const pts: string[] = [];
  for (let x = 0; x <= 400; x += 4) {
    const ph = (x + t * 6) % 100;
    let y = 0;
    if (ph > 40 && ph < 46) y = -10;
    else if (ph >= 46 && ph < 50) y = 50 * (1 + wild);
    else if (ph >= 50 && ph < 55) y = -70 * (1 + wild);
    else if (ph >= 55 && ph < 60) y = 20;
    y += wild * Math.sin(x * 0.4 + t) * 18;
    pts.push(`${x},${120 + y * 0.6}`);
  }
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 400 300">
      <path
        d="M200,290 C110,230 40,170 40,105 C40,55 80,25 125,25 C160,25 188,45 200,75 C212,45 240,25 275,25 C320,25 360,55 360,105 C360,170 290,230 200,290 Z"
        fill="#B5172F"
        stroke="#F1E6C8"
        strokeWidth="6"
      />
      <polyline points={pts.join(" ")} fill="none" stroke="#F1E6C8" strokeWidth="7" strokeLinejoin="round" />
    </svg>
  );
};

// ---------- Fabrik mit Alarmlicht ----------
export const SugarFactory: React.FC<{ width?: number; alarm: number }> = ({ width = 900, alarm }) => (
  <svg width={width} height={width} viewBox="0 0 400 400">
    <rect width="400" height="400" fill="#CDBB94" />
    <circle cx="200" cy="200" r={190} fill="#C1121F" opacity={0.25 * alarm} />
    <rect x="70" y="120" width="34" height="140" fill="#5A4A36" />
    <rect x="290" y="100" width="34" height="160" fill="#5A4A36" />
    <rect x="40" y="200" width="320" height="180" fill="#6B573E" />
    <polygon points="40,200 120,160 120,200 200,160 200,200 280,160 280,200 360,160 360,200" fill="#4E3E2B" />
    <rect x="80" y="225" width="240" height="46" fill="#2B1D0E" />
    <text x="200" y="261" textAnchor="middle" fontFamily={FONT_VINTAGE} fontSize="34" fill="#F1E6C8" letterSpacing="5">
      ZUCKER AG
    </text>
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={80 + i * 64} y="290" width="40" height="44" fill="#E9D8A6" opacity={0.6 + 0.4 * alarm} />
    ))}
    {/* Alarmlicht */}
    <rect x="186" y="120" width="28" height="18" fill="#3E2E1C" />
    <path d="M182,120 Q200,82 218,120 Z" fill={alarm > 0.5 ? "#FF2D2D" : "#7A1E1E"} />
    {alarm > 0.5 && (
      <g opacity={alarm}>
        <polygon points="200,100 60,40 60,80" fill="#FF2D2D" opacity="0.35" />
        <polygon points="200,100 340,40 340,80" fill="#FF2D2D" opacity="0.35" />
      </g>
    )}
    <rect y="380" width="400" height="20" fill="#4A3A28" />
  </svg>
);

// ---------- Briefkopf "Sugar Research Foundation" mit Umschlag ----------
export const Letterhead: React.FC<{ width?: number }> = ({ width = 720 }) => (
  <div
    style={{
      width,
      height: width * 0.62,
      background: "#F4EAD0",
      boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
      padding: 34,
      boxSizing: "border-box",
      color: "#2B1D0E",
      fontFamily: FONT_VINTAGE,
    }}
  >
    <div style={{ fontSize: width * 0.052, letterSpacing: 2, textAlign: "center", borderBottom: "3px double #2B1D0E", paddingBottom: 10 }}>
      SUGAR RESEARCH FOUNDATION
    </div>
    <div style={{ fontSize: width * 0.032, textAlign: "center", marginTop: 6, fontFamily: FONT_SUB, fontWeight: 700 }}>New York · 1965</div>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} style={{ height: 9, background: "#C7B791", marginTop: 16, width: `${92 - ((i * 17) % 30)}%` }} />
    ))}
  </div>
);

export const Envelope: React.FC<{ width?: number; open?: number; style?: React.CSSProperties }> = ({ width = 360, open = 0, style }) => (
  <div style={{ position: "relative", width, height: width * 0.62, ...style }}>
    {open > 0 && (
      <div style={{ position: "absolute", left: width * 0.12, top: -open * width * 0.32, transform: "rotate(-4deg)" }}>
        <Bill width={width * 0.76} />
      </div>
    )}
    <svg width={width} height={width * 0.62} viewBox="0 0 200 124" style={{ position: "absolute", inset: 0 }}>
      <rect x="2" y="2" width="196" height="120" rx="6" fill="#E8D7AE" stroke="#8C6A3C" strokeWidth="3" />
      <polyline points="2,4 100,70 198,4" fill="none" stroke="#8C6A3C" strokeWidth="3" />
      <text x="100" y="108" textAnchor="middle" fontFamily={FONT_VINTAGE} fontSize="16" fill="#5A3E1E">
        VERTRAULICH
      </text>
    </svg>
  </div>
);

// ---------- Fachzeitschrift 1967 ----------
export const Journal: React.FC<{ width?: number; highlight?: number }> = ({ width = 600, highlight = 0 }) => (
  <div
    style={{
      width,
      height: width * 1.32,
      background: "linear-gradient(180deg, #F3ECDD 0%, #E4D9C2 100%)",
      boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
      padding: 36,
      boxSizing: "border-box",
      color: "#1F2A44",
      position: "relative",
      borderLeft: "16px solid #7A1E1E",
    }}
  >
    <div style={{ fontFamily: FONT_VINTAGE, fontSize: width * 0.085, lineHeight: 1.05 }}>Medical</div>
    <div style={{ fontFamily: FONT_VINTAGE, fontSize: width * 0.085, lineHeight: 1.05 }}>Journal</div>
    <div style={{ fontFamily: FONT_SUB, fontWeight: 700, fontSize: width * 0.035, marginTop: 10, letterSpacing: 2 }}>
      VOL. 277 ·{" "}
      <span style={{ background: `rgba(255,214,10,${highlight})`, padding: "0 6px", borderRadius: 4 }}>1967</span>
    </div>
    <div style={{ height: 4, background: "#1F2A44", margin: "20px 0" }} />
    <div style={{ fontFamily: FONT_VINTAGE, fontSize: width * 0.055, lineHeight: 1.15 }}>
      Dietary Fats, Carbohydrates and Heart Disease
    </div>
    {Array.from({ length: 9 }).map((_, i) => (
      <div key={i} style={{ height: 9, background: "#B9AE97", marginTop: 14, width: `${95 - ((i * 23) % 35)}%` }} />
    ))}
  </div>
);

// ---------- Balkenwaage ----------
export const Scale: React.FC<{ width?: number; tilt: number; left: React.ReactNode; right: React.ReactNode }> = ({ width = 900, tilt, left, right }) => {
  const a = tilt * 16; // Grad, positiv = links schwer
  const arm = width * 0.38;
  const rad = (a * Math.PI) / 180;
  const ly = Math.sin(rad) * arm;
  return (
    <div style={{ position: "relative", width, height: width * 0.8 }}>
      <svg width={width} height={width * 0.8} viewBox={`0 0 ${width} ${width * 0.8}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <polygon points={`${width / 2 - 70},${width * 0.78} ${width / 2 + 70},${width * 0.78} ${width / 2 + 14},${width * 0.25} ${width / 2 - 14},${width * 0.25}`} fill="#8A6A2F" />
        <g transform={`rotate(${-a} ${width / 2} ${width * 0.25})`}>
          <rect x={width / 2 - arm} y={width * 0.25 - 8} width={arm * 2} height="16" rx="8" fill="#C9A24A" />
        </g>
        <circle cx={width / 2} cy={width * 0.25} r="22" fill="#E7B53C" stroke="#8A6414" strokeWidth="5" />
        {[-1, 1].map((s) => {
          const x = width / 2 + s * Math.cos(rad) * arm;
          const y = width * 0.25 + (s === -1 ? ly : -ly);
          return (
            <g key={s}>
              <line x1={x} y1={y} x2={x - 80} y2={y + 130} stroke="#8A6A2F" strokeWidth="4" />
              <line x1={x} y1={y} x2={x + 80} y2={y + 130} stroke="#8A6A2F" strokeWidth="4" />
              <path d={`M${x - 110},${y + 130} Q${x},${y + 175} ${x + 110},${y + 130} Z`} fill="#C9A24A" stroke="#8A6414" strokeWidth="4" />
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: width / 2 - Math.cos(rad) * arm - 110, top: width * 0.25 + ly - 70, width: 220, display: "flex", justifyContent: "center" }}>
        {left}
      </div>
      <div style={{ position: "absolute", left: width / 2 + Math.cos(rad) * arm - 110, top: width * 0.25 - ly - 70, width: 220, display: "flex", justifyContent: "center" }}>
        {right}
      </div>
    </div>
  );
};

// ---------- Lupe ----------
export const Magnifier: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 300, style }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={style}>
    <line x1="128" y1="128" x2="190" y2="190" stroke="#3E2E1C" strokeWidth="22" strokeLinecap="round" />
    <circle cx="80" cy="80" r="66" fill="rgba(200,230,255,0.18)" stroke="#2B1D0E" strokeWidth="12" />
    <path d="M40,60 Q50,35 75,30" stroke="#fff" strokeWidth="6" fill="none" opacity="0.7" strokeLinecap="round" />
  </svg>
);

// ---------- Steckbrief "GESUCHT" ----------
export const Wanted: React.FC<{ width?: number; children: React.ReactNode }> = ({ width = 640, children }) => (
  <div
    style={{
      width,
      padding: "34px 30px 40px",
      background: "linear-gradient(180deg, #F1DFB0, #D9BE85)",
      boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
      border: "4px solid #6B4A22",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      color: "#3A2410",
      transform: "rotate(-2deg)",
    }}
  >
    <div style={{ fontFamily: FONT_BOLD, fontSize: width * 0.2, lineHeight: 1, letterSpacing: 6 }}>GESUCHT</div>
    <div style={{ fontFamily: FONT_VINTAGE, fontSize: width * 0.06, marginBottom: 18 }}>Staatsfeind Nr. 1</div>
    <div style={{ background: "#F7EBCB", border: "4px solid #6B4A22", padding: 20, display: "flex", justifyContent: "center", width: "80%" }}>
      {children}
    </div>
    <div style={{ fontFamily: FONT_BOLD, fontSize: width * 0.16, marginTop: 16, letterSpacing: 4, color: "#9B2226" }}>FETT</div>
  </div>
);

// ---------- Joghurtbecher "FETTARM" ----------
export const Yogurt: React.FC<{ width?: number; label?: string; color?: string; style?: React.CSSProperties }> = ({
  width = 300,
  label = "FETTARM",
  color = "#2A9D8F",
  style,
}) => (
  <div style={{ position: "relative", width, height: width * 1.15, ...style }}>
    <svg width={width} height={width * 1.15} viewBox="0 0 200 230" style={{ position: "absolute", inset: 0 }}>
      <ellipse cx="100" cy="24" rx="92" ry="18" fill="#D9DEE7" stroke="#9AA3B2" strokeWidth="3" />
      <path d="M8,24 L28,215 Q100,232 172,215 L192,24 Q100,48 8,24 Z" fill="#FFFFFF" stroke="#C9D1DD" strokeWidth="3" />
      <path d="M16,80 L180,80 L170,170 L30,170 Z" fill={color} />
      <path d="M22,40 L30,200" stroke="#fff" strokeWidth="8" opacity="0.5" />
    </svg>
    <div
      style={{
        position: "absolute",
        top: width * 0.42,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: FONT_BOLD,
        fontSize: width * 0.15,
        color: "#fff",
        lineHeight: 1,
      }}
    >
      {label}
      <div style={{ fontFamily: FONT_SUB, fontWeight: 800, fontSize: width * 0.075, marginTop: 6 }}>nur 0,1 % Fett</div>
    </div>
  </div>
);

// ---------- Produkt-Packung ----------
export const Box: React.FC<{ width?: number; color: string; name: string }> = ({ width = 200, color, name }) => (
  <div
    style={{
      width,
      height: width * 1.35,
      background: `linear-gradient(135deg, ${color}, #00000033)`,
      backgroundColor: color,
      borderRadius: 10,
      boxShadow: "inset -14px 0 0 rgba(0,0,0,0.18), 0 14px 30px rgba(0,0,0,0.35)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "18px 8px",
      boxSizing: "border-box",
      color: "#fff",
      fontFamily: FONT_BOLD,
      fontSize: width * 0.17,
      textAlign: "center",
      lineHeight: 1,
    }}
  >
    <div>{name}</div>
    <div style={{ width: width * 0.5, height: width * 0.5, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
  </div>
);

// ---------- Archivkiste mit Briefen ----------
export const ArchiveBox: React.FC<{ width?: number; lift: number }> = ({ width = 860, lift }) => (
  <div style={{ position: "relative", width, height: width * 0.9 }}>
    {/* Briefe, die herausgezogen werden */}
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: width * (0.16 + i * 0.12),
          top: width * 0.36 - lift * width * (0.28 + i * 0.07),
          width: width * 0.48,
          height: width * 0.6,
          background: "#F4EAD0",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          transform: `rotate(${(i - 1) * 7}deg)`,
          padding: 22,
          boxSizing: "border-box",
          fontFamily: FONT_VINTAGE,
          color: "#2B1D0E",
          fontSize: width * 0.03,
        }}
      >
        <div style={{ borderBottom: "2px solid #2B1D0E", paddingBottom: 6 }}>SUGAR RESEARCH FOUNDATION</div>
        <div style={{ fontFamily: FONT_SUB, fontWeight: 700, marginTop: 8 }}>{["July 1965", "Nov 1965", "1966"][i]}</div>
        {Array.from({ length: 7 }).map((_, k) => (
          <div key={k} style={{ height: 7, background: "#C7B791", marginTop: 12, width: `${90 - ((k * 19) % 30)}%` }} />
        ))}
      </div>
    ))}
    <svg width={width} height={width * 0.9} viewBox="0 0 400 360" style={{ position: "absolute", inset: 0 }}>
      <polygon points="40,170 360,170 340,350 60,350" fill="#A47A45" stroke="#6B4A22" strokeWidth="5" />
      <rect x="150" y="220" width="100" height="56" fill="#F1E6C8" stroke="#6B4A22" strokeWidth="3" />
      <text x="200" y="244" textAnchor="middle" fontFamily={FONT_BOLD} fontSize="18" fill="#2B1D0E">
        ARCHIV
      </text>
      <text x="200" y="266" textAnchor="middle" fontFamily={FONT_SUB} fontWeight={700} fontSize="13" fill="#2B1D0E">
        1965 – 1967
      </text>
    </svg>
  </div>
);
