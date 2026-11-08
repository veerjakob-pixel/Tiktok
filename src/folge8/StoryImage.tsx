import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT_BOLD, FONT_SUB } from "../theme";
import { Stamp } from "../folge3/Graphics";

// Einzelbild für die Story (1080 x 1920) – Werbung für Folge 8.
// Oben 150 px und unten 400 px bleiben für die App-Leisten frei.

const LadySvg: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="92" fill="#F7C6D0" />
    <ellipse cx="96" cy="88" rx="52" ry="50" fill="#1E1A2E" />
    <ellipse cx="104" cy="104" rx="38" ry="46" fill="#F2D2BC" />
    <path d="M66,86 Q90,60 140,84 L140,70 Q100,40 62,70 Z" fill="#1E1A2E" />
    <ellipse cx="104" cy="132" rx="11" ry="5" fill="#C1121F" />
    <circle cx="90" cy="102" r="4" fill="#1E1A2E" />
    <circle cx="118" cy="102" r="4" fill="#1E1A2E" />
    <path d="M60,200 Q70,155 104,152 Q140,155 150,200 Z" fill="#E8899E" />
  </svg>
);

const CowboySvg: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="92" fill="#F2A541" />
    <ellipse cx="100" cy="62" rx="80" ry="14" fill="#7A5634" />
    <path d="M62,60 Q58,18 86,22 Q100,34 114,22 Q142,18 138,60 Z" fill="#7A5634" />
    <path d="M68,70 L132,70 L130,118 Q118,146 100,148 Q82,146 70,118 Z" fill="#D9A27A" />
    <path d="M80,96 L94,94 M106,94 L120,96 M88,124 L112,123" stroke="#2B1D0E" strokeWidth="5" strokeLinecap="round" />
    <path d="M76,148 L124,148 L100,176 Z" fill="#B23A2E" />
    <path d="M30,200 Q36,152 78,150 L122,150 Q164,152 170,200 Z" fill="#5D7FA3" />
  </svg>
);

export const Folge8Story: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, #C2452D 0%, #2A0B08 78%)" }}>
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
      <div style={{ fontFamily: FONT_SUB, fontWeight: 800, fontSize: 40, color: "#fff", background: "rgba(0,0,0,0.4)", border: "2px solid rgba(255,255,255,0.3)", padding: "10px 28px", borderRadius: 14, letterSpacing: 2 }}>
        WERBELÜGEN #8
      </div>

      <div style={{ textAlign: "center", fontFamily: FONT_BOLD, lineHeight: 1.02, textShadow: "0 8px 0 rgba(0,0,0,0.35)" }}>
        <div style={{ fontSize: 112, color: "#FFF8E7" }}>MARLBORO</div>
        <div style={{ fontSize: 96, color: "#FFD1DC" }}>WAR FÜR FRAUEN</div>
      </div>

      <div style={{ position: "relative", width: 900, height: 600, display: "flex", justifyContent: "center", alignItems: "center", gap: 40 }}>
        <div style={{ transform: "rotate(-6deg)" }}>
          <LadySvg size={360} />
        </div>
        <div style={{ fontFamily: FONT_BOLD, fontSize: 130, color: "#fff" }}>→</div>
        <div style={{ transform: "rotate(6deg)" }}>
          <CowboySvg size={360} />
        </div>
        <div style={{ position: "absolute", top: 380, background: "rgba(255,248,231,0.92)", borderRadius: 26, padding: "10px 24px", transform: "rotate(-4deg)" }}>
          <Stamp text="WERBUNG" size={150} rotate={-6} />
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: FONT_SUB, fontWeight: 800, fontSize: 46, color: "#fff", lineHeight: 1.2 }}>
          Gleiche Zigarette, neues Bild.
          <br />
          Wie ein Cowboy alles verändert hat 🤠
        </div>
        <div style={{ marginTop: 30, display: "inline-block", fontFamily: FONT_BOLD, fontSize: 84, color: "#111", whiteSpace: "nowrap", background: "#FFD166", padding: "8px 44px", borderRadius: 20, boxShadow: "0 10px 0 rgba(0,0,0,0.3)" }}>
          NEUES VIDEO IST DA
        </div>
        <div style={{ marginTop: 26, fontFamily: FONT_SUB, fontWeight: 800, fontSize: 46, color: "#fff" }}>Jetzt auf meinem Profil ansehen</div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
