import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT_BOLD, FONT_SUB } from "../theme";
import { Stamp } from "../folge3/Graphics";

// Einzelbild für die Story (1080 x 1920) – Werbung für Folge 6.
// Oben 150 px und unten 400 px bleiben für die App-Leisten frei.

const SantaSvg: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 200 240">
    <circle cx="100" cy="170" r="66" fill="#C8102E" />
    <rect x="34" y="160" width="132" height="18" fill="#1B1B1B" />
    <rect x="90" y="158" width="20" height="22" fill="#E9B44C" />
    <circle cx="100" cy="92" r="40" fill="#F3C3A0" />
    <path d="M58,104 Q100,180 142,104 Z" fill="#fff" />
    <circle cx="86" cy="86" r="5" fill="#1B1B1B" />
    <circle cx="114" cy="86" r="5" fill="#1B1B1B" />
    <path d="M58,66 Q100,-10 162,24 L142,66 Z" fill="#C8102E" />
    <circle cx="162" cy="24" r="12" fill="#fff" />
    <rect x="52" y="58" width="96" height="16" rx="8" fill="#fff" />
  </svg>
);

const CanSvg: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size * 0.55} height={size} viewBox="0 0 110 200">
    <rect x="8" y="14" width="94" height="172" rx="10" fill="#C8102E" />
    <rect x="14" y="4" width="82" height="14" rx="6" fill="#C9CED6" />
    <rect x="14" y="182" width="82" height="14" rx="6" fill="#C9CED6" />
    <text x="55" y="112" textAnchor="middle" fontFamily="Anton" fontSize="40" fill="#fff">COLA</text>
    <path d="M8,150 Q32,136 55,150 T102,150" stroke="#fff" strokeWidth="6" fill="none" />
  </svg>
);

export const Folge6Story: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, #7A1020 0%, #14060A 78%)" }}>
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
        WERBELÜGEN #6
      </div>

      <div style={{ textAlign: "center", fontFamily: FONT_BOLD, lineHeight: 1.02, textShadow: "0 8px 0 rgba(0,0,0,0.35)" }}>
        <div style={{ fontSize: 92, color: "#FFF8E7" }}>HAT COLA DEN</div>
        <div style={{ fontSize: 104, color: "#FF4D5E" }}>WEIHNACHTSMANN</div>
        <div style={{ fontSize: 92, color: "#FFF8E7" }}>ERFUNDEN?</div>
      </div>

      <div style={{ position: "relative", width: 900, height: 620, display: "flex", justifyContent: "center", alignItems: "center", gap: 60 }}>
        <div style={{ transform: "rotate(-6deg)" }}>
          <SantaSvg size={420} />
        </div>
        <div style={{ fontFamily: FONT_BOLD, fontSize: 130, color: "#fff" }}>+</div>
        <div style={{ transform: "rotate(8deg)" }}>
          <CanSvg size={400} />
        </div>
        <div style={{ position: "absolute", top: 300, background: "rgba(255,248,231,0.92)", borderRadius: 26, padding: "10px 24px", transform: "rotate(-4deg)" }}>
          <Stamp text="MYTHOS?" size={150} rotate={-6} />
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: FONT_SUB, fontWeight: 800, fontSize: 52, color: "#fff", lineHeight: 1.2 }}>
          Wer hat ihn wirklich rot gemacht?
          <br />
          Die Antwort überrascht 🎅
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
