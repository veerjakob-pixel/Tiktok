import React from "react";
import { COLORS, FONT_BOLD, FONT_VINTAGE } from "../theme";

// ---------- Apfel ----------
type AppleProps = {
  size?: number;
  color?: string;
  face?: "grumpy" | "happy" | "none";
  shine?: boolean;
  spots?: boolean;
  style?: React.CSSProperties;
};

export const Apple: React.FC<AppleProps> = ({
  size = 200,
  color = COLORS.red,
  face = "none",
  shine = true,
  spots = false,
  style,
}) => {
  const id = React.useId().replace(/:/g, "");
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 200 220" style={style}>
      <defs>
        <radialGradient id={`g${id}`} cx="35%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.35} />
          <stop offset="40%" stopColor={color} stopOpacity={1} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.35} />
        </radialGradient>
      </defs>
      {/* Stiel + Blatt */}
      <path d="M100 62 Q 98 35 110 14" stroke="#5B3A1A" strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d="M108 30 Q 140 0 172 20 Q 145 50 108 30 Z" fill="#2D6A4F" />
      <path d="M112 29 Q 140 18 165 21" stroke="#1B4332" strokeWidth={2} fill="none" />
      {/* Körper */}
      <path
        d="M100 62 C 70 38, 14 46, 14 118 C 14 178, 58 218, 100 202 C 142 218, 186 178, 186 118 C 186 46, 130 38, 100 62 Z"
        fill={color}
      />
      <path
        d="M100 62 C 70 38, 14 46, 14 118 C 14 178, 58 218, 100 202 C 142 218, 186 178, 186 118 C 186 46, 130 38, 100 62 Z"
        fill={`url(#g${id})`}
      />
      {spots && (
        <g fill="#6B7A1F" opacity={0.7}>
          <circle cx="60" cy="150" r="5" />
          <circle cx="140" cy="165" r="4" />
          <circle cx="150" cy="100" r="6" />
          <circle cx="75" cy="95" r="3" />
          <circle cx="110" cy="185" r="4" />
        </g>
      )}
      {shine && <ellipse cx="62" cy="96" rx="16" ry="28" fill="#fff" opacity={0.55} transform="rotate(25 62 96)" />}
      {face === "grumpy" && (
        <g stroke={COLORS.ink} strokeWidth={7} strokeLinecap="round" fill="none">
          <path d="M55 105 L 88 120" />
          <path d="M145 105 L 112 120" />
          <circle cx="76" cy="133" r="7" fill={COLORS.ink} />
          <circle cx="124" cy="133" r="7" fill={COLORS.ink} />
          <path d="M72 178 Q 100 155 128 178" />
        </g>
      )}
      {face === "happy" && (
        <g stroke={COLORS.ink} strokeWidth={7} strokeLinecap="round" fill="none">
          <path d="M64 128 Q 76 116 88 128" />
          <path d="M112 128 Q 124 116 136 128" />
          <path d="M70 155 Q 100 188 130 155" />
          <circle cx="58" cy="150" r="9" fill="#ff8fa3" stroke="none" opacity={0.7} />
          <circle cx="142" cy="150" r="9" fill="#ff8fa3" stroke="none" opacity={0.7} />
        </g>
      )}
    </svg>
  );
};

// ---------- Holzfass ----------
export const Barrel: React.FC<{ width?: number; label?: string }> = ({ width = 420, label }) => (
  <svg width={width} height={width * 1.2} viewBox="0 0 250 300">
    <path d="M38 22 Q 4 150 38 288 L 212 288 Q 246 150 212 22 Z" fill={COLORS.wood} />
    {[70, 105, 140, 175].map((x) => (
      <path key={x} d={`M${x} 22 Q ${x + (x - 125) * 0.25} 150 ${x} 288`} stroke="#5E3B17" strokeWidth={3} fill="none" />
    ))}
    {[55, 245].map((y) => (
      <path key={y} d={`M${y === 55 ? 26 : 26} ${y} Q 125 ${y + 14} ${224} ${y}`} stroke="#3A2A1A" strokeWidth={16} fill="none" />
    ))}
    <path d="M14 150 Q 125 166 236 150" stroke="#3A2A1A" strokeWidth={16} fill="none" />
    <ellipse cx="125" cy="22" rx="88" ry="16" fill="#3A220E" />
    <ellipse cx="125" cy="22" rx="88" ry="16" fill="none" stroke="#3A2A1A" strokeWidth={8} />
    {label && (
      <g>
        <rect x="62" y="98" width="126" height="44" rx="6" fill={COLORS.cream} stroke={COLORS.ink} strokeWidth={3} />
        <text x="125" y="131" textAnchor="middle" fontFamily={FONT_VINTAGE} fontSize={30} fill={COLORS.ink}>
          {label}
        </text>
      </g>
    )}
  </svg>
);

// ---------- Stempel ----------
export const Stamp: React.FC<{ text: string; color?: string; fontSize?: number; rotate?: number }> = ({
  text,
  color = COLORS.red,
  fontSize = 150,
  rotate = -12,
}) => (
  <div
    style={{
      transform: `rotate(${rotate}deg)`,
      border: `14px solid ${color}`,
      outline: `5px solid ${color}`,
      outlineOffset: 10,
      borderRadius: 18,
      padding: "6px 40px",
      color,
      fontFamily: FONT_BOLD,
      fontSize,
      letterSpacing: 8,
      lineHeight: 1.1,
      textTransform: "uppercase",
      background: "rgba(255,255,255,0.08)",
      // leichter "Stempelfarbe"-Look
      maskImage:
        "repeating-radial-gradient(circle at 30% 40%, #000 0 6px, rgba(0,0,0,0.75) 7px 9px), linear-gradient(#000,#000)",
      WebkitMaskImage:
        "repeating-radial-gradient(circle at 30% 40%, #000 0 6px, rgba(0,0,0,0.78) 7px 9px)",
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

// ---------- Bauer ----------
export const Farmer: React.FC<{ size?: number; sad?: boolean }> = ({ size = 360, sad = true }) => (
  <svg width={size} height={size * 1.6} viewBox="0 0 200 320">
    {/* Beine */}
    <rect x="68" y="230" width="26" height="80" fill="#2F4A7A" />
    <rect x="106" y="230" width="26" height="80" fill="#2F4A7A" />
    <rect x="60" y="300" width="38" height="16" rx="6" fill="#3A2A1A" />
    <rect x="102" y="300" width="38" height="16" rx="6" fill="#3A2A1A" />
    {/* Hemd */}
    <path d="M45 130 Q 100 110 155 130 L 160 240 L 40 240 Z" fill="#C0392B" />
    <path d="M45 130 L 20 215" stroke="#C0392B" strokeWidth={24} strokeLinecap="round" />
    <path d="M155 130 L 180 215" stroke="#C0392B" strokeWidth={24} strokeLinecap="round" />
    <circle cx="20" cy="220" r="13" fill="#F1C27D" />
    <circle cx="180" cy="220" r="13" fill="#F1C27D" />
    {/* Latzhose */}
    <path d="M62 165 L 138 165 L 140 245 L 60 245 Z" fill="#3D5A99" />
    <path d="M62 165 L 70 128 M138 165 L 130 128" stroke="#3D5A99" strokeWidth={10} />
    <circle cx="70" cy="172" r="5" fill="#E9C46A" />
    <circle cx="130" cy="172" r="5" fill="#E9C46A" />
    {/* Kopf */}
    <rect x="88" y="98" width="24" height="20" fill="#E0AC69" />
    <circle cx="100" cy="72" r="38" fill="#F1C27D" />
    {/* Bart */}
    <path d="M66 82 Q 100 128 134 82 Q 120 96 100 96 Q 80 96 66 82 Z" fill="#8D6E63" />
    {/* Augen */}
    <circle cx="86" cy="68" r="4.5" fill={COLORS.ink} />
    <circle cx="114" cy="68" r="4.5" fill={COLORS.ink} />
    {sad ? (
      <>
        <path d="M76 56 L 92 61 M124 56 L 108 61" stroke={COLORS.ink} strokeWidth={4} strokeLinecap="round" />
        <path d="M88 92 Q 100 84 112 92" stroke={COLORS.ink} strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M118 76 Q 122 86 118 90 Q 114 86 118 76 Z" fill="#5DADE2" />
      </>
    ) : (
      <path d="M88 86 Q 100 96 112 86" stroke={COLORS.ink} strokeWidth={4} fill="none" />
    )}
    {/* Strohhut */}
    <ellipse cx="100" cy="42" rx="70" ry="13" fill="#E9C46A" />
    <path d="M62 42 Q 64 4 100 4 Q 136 4 138 42 Z" fill="#E9C46A" />
    <rect x="63" y="30" width="74" height="9" fill="#9C6644" />
  </svg>
);

// ---------- Arzt mit Kittel ----------
export const Doctor: React.FC<{ size?: number; shrug?: number }> = ({ size = 420, shrug = 0 }) => {
  // shrug: 0 = normal, 1 = maximal Schultern hoch
  const lift = shrug * 14;
  const armAngle = shrug * 55;
  return (
    <svg width={size} height={size * 1.5} viewBox="0 0 240 360">
      {/* Beine */}
      <rect x="84" y="270" width="30" height="80" fill="#34495E" />
      <rect x="126" y="270" width="30" height="80" fill="#34495E" />
      <rect x="78" y="342" width="40" height="14" rx="6" fill="#222" />
      <rect x="122" y="342" width="40" height="14" rx="6" fill="#222" />
      {/* Arme (hinter dem Kittel) */}
      <g transform={`translate(0 ${-lift})`}>
        <g transform={`rotate(${armAngle} 62 150)`}>
          <path d="M62 150 L 40 250" stroke="#F5F5F5" strokeWidth={30} strokeLinecap="round" />
          <circle cx="40" cy="258" r="15" fill="#F1C27D" />
        </g>
        <g transform={`rotate(${-armAngle} 178 150)`}>
          <path d="M178 150 L 200 250" stroke="#F5F5F5" strokeWidth={30} strokeLinecap="round" />
          <circle cx="200" cy="258" r="15" fill="#F1C27D" />
        </g>
      </g>
      {/* Kittel */}
      <path
        d={`M${58} ${140 - lift} Q 120 ${122 - lift} ${182} ${140 - lift} L 190 290 L 50 290 Z`}
        fill="#FFFFFF"
        stroke="#CFD8DC"
        strokeWidth={3}
      />
      <path d={`M120 ${130 - lift} L 120 290`} stroke="#CFD8DC" strokeWidth={3} />
      <path d={`M98 ${132 - lift} L 120 190 L 142 ${132 - lift}`} fill="#7FB3D5" />
      <path d={`M92 ${130 - lift} L 112 200 M148 ${130 - lift} L 128 200`} stroke="#CFD8DC" strokeWidth={4} />
      <rect x="140" y="200" width="30" height="24" rx="3" fill="none" stroke="#CFD8DC" strokeWidth={3} />
      <rect x="146" y="192" width="5" height="18" fill="#2980B9" />
      {/* Stethoskop */}
      <path d={`M100 ${138 - lift} Q 92 210 120 220 Q 148 210 140 ${138 - lift}`} stroke="#37474F" strokeWidth={5} fill="none" />
      <circle cx="120" cy="224" r="9" fill="#90A4AE" stroke="#37474F" strokeWidth={3} />
      {/* Kopf */}
      <g transform={`translate(0 ${-lift * 0.4})`}>
        <rect x="108" y="104" width="24" height="24" fill="#E0AC69" />
        <circle cx="120" cy="78" r="40" fill="#F1C27D" />
        <path d="M80 72 Q 82 30 120 32 Q 160 30 160 72 Q 150 52 120 54 Q 92 52 80 72 Z" fill="#4E342E" />
        <circle cx="105" cy="80" r="11" fill="none" stroke="#263238" strokeWidth={3} />
        <circle cx="135" cy="80" r="11" fill="none" stroke="#263238" strokeWidth={3} />
        <path d="M116 80 L 124 80" stroke="#263238" strokeWidth={3} />
        <circle cx="105" cy="80" r="3.5" fill="#263238" />
        <circle cx="135" cy="80" r="3.5" fill="#263238" />
        <path d={`M98 ${66 - shrug * 6} L 112 ${68 - shrug * 4} M142 ${66 - shrug * 6} L 128 ${68 - shrug * 4}`} stroke="#4E342E" strokeWidth={4} strokeLinecap="round" />
        <path d="M106 102 Q 120 98 134 104" stroke="#263238" strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
};

// ---------- Flasche ----------
export const Bottle: React.FC<{ size?: number; label?: string }> = ({ size = 300, label = "CIDRE" }) => (
  <svg width={size} height={size * 2} viewBox="0 0 150 300">
    <rect x="58" y="6" width="34" height="18" rx="3" fill="#6D4C41" />
    <path d="M60 24 L 90 24 L 92 90 Q 130 110 130 150 L 130 280 Q 130 294 116 294 L 34 294 Q 20 294 20 280 L 20 150 Q 20 110 58 90 Z" fill="#4E7A3A" />
    <path d="M34 140 L 34 270" stroke="#fff" strokeWidth={8} opacity={0.3} strokeLinecap="round" />
    <rect x="24" y="170" width="102" height="70" fill={COLORS.cream} stroke={COLORS.ink} strokeWidth={3} />
    <text x="75" y="215" textAnchor="middle" fontFamily={FONT_VINTAGE} fontSize={26} fill={COLORS.ink}>
      {label}
    </text>
  </svg>
);

// ---------- Herz ----------
export const Heart: React.FC<{ size?: number; color?: string }> = ({ size = 120, color = "#FF3B5C" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M50 88 C 10 60, 2 34, 20 18 C 34 6, 48 14, 50 26 C 52 14, 66 6, 80 18 C 98 34, 90 60, 50 88 Z" fill={color} />
    <ellipse cx="30" cy="32" rx="7" ry="11" fill="#fff" opacity={0.5} transform="rotate(-30 30 32)" />
  </svg>
);

// ---------- Lupe ----------
export const Magnifier: React.FC<{ size?: number }> = ({ size = 360 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <path d="M128 128 L 188 188" stroke="#5D4037" strokeWidth={22} strokeLinecap="round" />
    <path d="M128 128 L 145 145" stroke="#9E9E9E" strokeWidth={26} />
    <circle cx="80" cy="80" r="62" fill="rgba(200,230,255,0.25)" stroke="#424242" strokeWidth={12} />
    <path d="M45 60 Q 55 38 80 34" stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.8} />
  </svg>
);

// ---------- Studien-Dokument ----------
export const StudyDoc: React.FC<{ width?: number; highlight?: number }> = ({ width = 620, highlight = 0 }) => (
  <div
    style={{
      width,
      height: width * 1.3,
      background: "#fff",
      borderRadius: 14,
      boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
      padding: 44,
      boxSizing: "border-box",
      fontFamily: "Georgia, serif",
      color: "#222",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div style={{ fontSize: 22, color: "#B71C1C", fontWeight: 700, letterSpacing: 2 }}>ORIGINAL INVESTIGATION · 2015</div>
    <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.15, marginTop: 16 }}>
      Association Between Apple Consumption and Physician Visits
    </div>
    <div style={{ fontSize: 20, color: "#666", marginTop: 12 }}>JAMA Internal Medicine · n = 8.399</div>
    {[1, 0.9, 0.95, 0.7].map((w, i) => (
      <div key={i} style={{ height: 14, width: `${w * 100}%`, background: "#ddd", borderRadius: 7, marginTop: i === 0 ? 34 : 16 }} />
    ))}
    <div
      style={{
        marginTop: 30,
        padding: "14px 16px",
        fontSize: 30,
        fontWeight: 700,
        borderRadius: 8,
        background: `linear-gradient(90deg, rgba(255,214,10,0.85) ${highlight * 100}%, transparent ${highlight * 100}%)`,
      }}
    >
      Ergebnis: Kein signifikanter Unterschied bei Arztbesuchen.
    </div>
    {[0.92, 1, 0.8, 0.96, 0.6].map((w, i) => (
      <div key={i} style={{ height: 14, width: `${w * 100}%`, background: "#ddd", borderRadius: 7, marginTop: 16 }} />
    ))}
  </div>
);
