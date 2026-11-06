import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT_BOLD, FONT_SUB } from "../theme";
import { Stamp } from "../folge3/Graphics";

// Einzelbild für die Story (1080 x 1920) – Werbung für Folge 5.
// Oben 150 px und unten 400 px bleiben für die App-Leisten frei.

const TorchSvg: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size * 0.5} height={size} viewBox="0 0 100 200">
    <defs>
      <radialGradient id="fl" cx="50%" cy="65%" r="60%">
        <stop offset="0%" stopColor="#FFF3B0" />
        <stop offset="45%" stopColor="#FFB21F" />
        <stop offset="100%" stopColor="#FF3D00" />
      </radialGradient>
    </defs>
    <path d="M50,4 C70,30 80,45 72,62 C68,70 60,74 50,74 C40,74 32,70 28,62 C20,45 36,32 42,18 C44,30 48,34 50,36 C52,26 50,16 50,4 Z" fill="url(#fl)" />
    <path d="M24,72 L76,72 L64,96 L36,96 Z" fill="#D4AF37" stroke="#8C6A1E" strokeWidth="2" />
    <path d="M40,96 L60,96 L55,196 L45,196 Z" fill="#6B4423" />
    <rect x="40" y="118" width="20" height="5" fill="#C9A24A" />
    <rect x="42" y="150" width="16" height="5" fill="#C9A24A" />
  </svg>
);

const CigaretteSvg: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size * 0.2} height={size} viewBox="0 0 40 200">
    <rect x="10" y="10" width="20" height="8" fill="#6E6E6E" />
    <rect x="10" y="6" width="20" height="5" fill="#C1121F" />
    <rect x="10" y="18" width="20" height="132" fill="#F7F5F0" stroke="#CFCAC0" strokeWidth="1.5" />
    <rect x="10" y="150" width="20" height="46" fill="#D98E4A" />
  </svg>
);

export const Folge5Story: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, #5A2A10 0%, #0B0A0C 78%)" }}>
    {/* Strahlen */}
    <AbsoluteFill style={{ opacity: 0.08, transform: "scale(2.2)" }}>
      <svg viewBox="-100 -100 200 200" width="100%" height="100%">
        {Array.from({ length: 18 }).map((_, i) => {
          const a1 = (i / 18) * Math.PI * 2;
          const a2 = a1 + Math.PI / 18;
          return <polygon key={i} points={`0,0 ${Math.cos(a1) * 200},${Math.sin(a1) * 200} ${Math.cos(a2) * 200},${Math.sin(a2) * 200}`} fill="#fff" />;
        })}
      </svg>
    </AbsoluteFill>

    <AbsoluteFill style={{ top: 170, bottom: 400, height: "auto", alignItems: "center", justifyContent: "space-between" }}>
      <div
        style={{
          fontFamily: FONT_SUB,
          fontWeight: 800,
          fontSize: 40,
          color: "#fff",
          background: "rgba(0,0,0,0.4)",
          border: "2px solid rgba(255,255,255,0.3)",
          padding: "10px 28px",
          borderRadius: 14,
          letterSpacing: 2,
        }}
      >
        WERBELÜGEN #5
      </div>

      <div style={{ textAlign: "center", fontFamily: FONT_BOLD, lineHeight: 1.02, textShadow: "0 8px 0 rgba(0,0,0,0.35)" }}>
        <div style={{ fontSize: 100, color: "#FFF8E7" }}>„FACKELN DER</div>
        <div style={{ fontSize: 100, color: "#FFB21F" }}>FREIHEIT“</div>
      </div>

      <div style={{ position: "relative", width: 900, height: 620, display: "flex", justifyContent: "center", alignItems: "center", gap: 60 }}>
        <div style={{ transform: "rotate(-8deg)", filter: "drop-shadow(0 0 40px rgba(255,140,40,0.6))" }}>
          <TorchSvg size={520} />
        </div>
        <div style={{ fontFamily: FONT_BOLD, fontSize: 130, color: "#fff" }}>=</div>
        <div style={{ transform: "rotate(10deg)" }}>
          <CigaretteSvg size={460} />
        </div>
        <div style={{ position: "absolute", top: 240 }}>
          <Stamp text="WERBUNG" size={170} />
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: FONT_SUB, fontWeight: 800, fontSize: 52, color: "#fff", lineHeight: 1.2 }}>
          Wie ein Werbetrick Frauen
          <br />
          zum Rauchen brachte
        </div>
        <div
          style={{
            marginTop: 30,
            display: "inline-block",
            fontFamily: FONT_BOLD,
            fontSize: 84,
            color: "#111",
            whiteSpace: "nowrap",
            background: "#FFD166",
            padding: "8px 44px",
            borderRadius: 20,
            boxShadow: "0 10px 0 rgba(0,0,0,0.3)",
          }}
        >
          NEUES VIDEO IST DA
        </div>
        <div style={{ marginTop: 26, fontFamily: FONT_SUB, fontWeight: 800, fontSize: 46, color: "#fff" }}>Jetzt auf meinem Profil ansehen</div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
