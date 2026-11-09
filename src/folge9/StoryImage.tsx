import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT_BOLD, FONT_SUB } from "../theme";
import { Stamp } from "../folge3/Graphics";

// Einzelbild für die Story (1080 x 1920) – Werbung für Folge 9 (Black Friday).
// Oben 150 px und unten 400 px bleiben für die App-Leisten frei.

const PoliceSvg: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="92" fill="#8AD1FF" />
    <rect x="62" y="40" width="76" height="26" rx="8" fill="#1B2A4A" />
    <path d="M52,70 L148,70 L140,58 L60,58 Z" fill="#0B0F18" />
    <circle cx="100" cy="52" r="7" fill="#F2C14E" />
    <circle cx="100" cy="98" r="30" fill="#E2B08E" />
    <circle cx="90" cy="95" r="4" fill="#2B1D0E" />
    <circle cx="110" cy="95" r="4" fill="#2B1D0E" />
    <path d="M88,112 Q100,106 112,112" stroke="#2B1D0E" strokeWidth="4" fill="none" />
    <path d="M45,190 Q50,135 100,132 Q150,135 155,190 Z" fill="#1B2A4A" />
    <circle cx="100" cy="150" r="6" fill="#F2C14E" />
  </svg>
);

const BagSvg: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="92" fill="#FFD60A" />
    <path d="M78,70 Q78,40 100,40 Q122,40 122,70" stroke="#0B0B0F" strokeWidth="8" fill="none" />
    <rect x="55" y="68" width="90" height="100" rx="6" fill="#0B0B0F" />
    <text x="100" y="128" textAnchor="middle" fontFamily="Anton" fontSize="40" fill="#fff">SALE</text>
  </svg>
);

export const Folge9Story: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, #3A0A12 0%, #050507 78%)" }}>
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
        WERBELÜGEN #9
      </div>

      <div style={{ textAlign: "center", fontFamily: FONT_BOLD, lineHeight: 1.02, textShadow: "0 8px 0 rgba(0,0,0,0.35)" }}>
        <div style={{ fontSize: 120, color: "#FFD60A" }}>BLACK FRIDAY</div>
        <div style={{ fontSize: 96, color: "#FFF8E7" }}>DIE ERFUNDENE</div>
        <div style={{ fontSize: 96, color: "#FFF8E7" }}>GESCHICHTE</div>
      </div>

      <div style={{ position: "relative", width: 900, height: 600, display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: 40, gap: 40 }}>
        <div style={{ transform: "rotate(-6deg)" }}>
          <PoliceSvg size={340} />
        </div>
        <div style={{ fontFamily: FONT_BOLD, fontSize: 130, color: "#fff" }}>→</div>
        <div style={{ transform: "rotate(6deg)" }}>
          <BagSvg size={340} />
        </div>
        <div style={{ position: "absolute", top: 380, background: "rgba(255,248,231,0.92)", borderRadius: 26, padding: "10px 24px", transform: "rotate(-4deg)" }}>
          <Stamp text="MYTHOS" size={115} rotate={-6} />
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: FONT_SUB, fontWeight: 800, fontSize: 46, color: "#fff", lineHeight: 1.2 }}>
          Mit „schwarzen Zahlen“ hat der Name
          <br />
          nichts zu tun 🛍️
        </div>
        <div style={{ marginTop: 30, display: "inline-block", fontFamily: FONT_BOLD, fontSize: 84, color: "#111", whiteSpace: "nowrap", background: "#FFD166", padding: "8px 44px", borderRadius: 20, boxShadow: "0 10px 0 rgba(0,0,0,0.3)" }}>
          NEUES VIDEO IST DA
        </div>
        <div style={{ marginTop: 26, fontFamily: FONT_SUB, fontWeight: 800, fontSize: 46, color: "#fff" }}>Jetzt auf meinem Profil ansehen</div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
