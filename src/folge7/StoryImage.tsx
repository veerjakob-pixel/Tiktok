import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT_BOLD, FONT_SUB } from "../theme";
import { Stamp } from "../folge3/Graphics";

// Einzelbild für die Story (1080 x 1920) – Werbung für Folge 7.
// Oben 150 px und unten 400 px bleiben für die App-Leisten frei.

const BottleSvg: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size * 0.6} height={size} viewBox="0 0 120 200">
    <path d="M45,10 L75,10 L75,40 Q100,55 100,80 L100,185 Q100,195 90,195 L30,195 Q20,195 20,185 L20,80 Q20,55 45,40 Z" fill="rgba(255,255,255,0.25)" stroke="#E4EEF0" strokeWidth="3" />
    <path d="M22,100 L98,100 L98,185 Q98,193 90,193 L30,193 Q22,193 22,185 Z" fill="#D9932B" />
    <rect x="42" y="0" width="36" height="16" rx="4" fill="#1E1E1E" />
    <rect x="24" y="118" width="72" height="44" fill="#F4EFE4" stroke="#1F5E3A" strokeWidth="3" />
    <text x="60" y="146" textAnchor="middle" fontFamily="Anton" fontSize="13" fill="#1F5E3A">MUNDWASSER</text>
  </svg>
);

const FaceSvg: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="80" fill="#EDC3A3" />
    <circle cx="72" cy="85" r="8" fill="#2B1D0E" />
    <circle cx="128" cy="85" r="8" fill="#2B1D0E" />
    <path d="M62,76 L84,64 M138,76 L116,64" stroke="#2B1D0E" strokeWidth="5" strokeLinecap="round" />
    <rect x="62" y="112" width="76" height="40" rx="18" fill="#EDC3A3" stroke="#B88A6A" strokeWidth="5" />
    <circle cx="160" cy="130" r="16" fill="#7BC96F" opacity="0.7" />
    <circle cx="178" cy="108" r="11" fill="#7BC96F" opacity="0.6" />
  </svg>
);

export const Folge7Story: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, #1F5E3A 0%, #06120C 78%)" }}>
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
        WERBELÜGEN #7
      </div>

      <div style={{ textAlign: "center", fontFamily: FONT_BOLD, lineHeight: 1.02, textShadow: "0 8px 0 rgba(0,0,0,0.35)" }}>
        <div style={{ fontSize: 92, color: "#FFF8E7" }}>WIE WERBUNG EINE</div>
        <div style={{ fontSize: 124, color: "#7BE495" }}>KRANKHEIT</div>
        <div style={{ fontSize: 92, color: "#FFF8E7" }}>ERFAND</div>
      </div>

      <div style={{ position: "relative", width: 900, height: 620, display: "flex", justifyContent: "center", alignItems: "center", gap: 60 }}>
        <div style={{ transform: "rotate(-6deg)" }}>
          <FaceSvg size={380} />
        </div>
        <div style={{ fontFamily: FONT_BOLD, fontSize: 130, color: "#fff" }}>→</div>
        <div style={{ transform: "rotate(8deg)" }}>
          <BottleSvg size={420} />
        </div>
        <div style={{ position: "absolute", top: 300, background: "rgba(255,248,231,0.92)", borderRadius: 26, padding: "10px 24px", transform: "rotate(-4deg)" }}>
          <Stamp text="WERBUNG" size={150} rotate={-6} />
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: FONT_SUB, fontWeight: 800, fontSize: 46, color: "#fff", lineHeight: 1.2 }}>
          Erst die Angst, dann das Produkt.
          <br />
          Der Trick hinter dem Mundwasser 🧴
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
