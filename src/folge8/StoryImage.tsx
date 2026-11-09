import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT_BOLD, FONT_SUB } from "../theme";
import { Stamp } from "../folge3/Graphics";

// Einzelbild für die Story (1080 x 1920) – Werbung für Folge 8 (Kaffeepause).
// Oben 150 px und unten 400 px bleiben für die App-Leisten frei.

const CupSvg: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="92" fill="#F2D2A9" />
    <path d="M70,70 Q60,50 75,35 M100,68 Q90,45 105,30 M130,70 Q120,50 135,35" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" />
    <ellipse cx="100" cy="160" rx="70" ry="12" fill="#F4F1EA" />
    <path d="M48,85 L152,85 Q148,150 100,152 Q52,150 48,85 Z" fill="#F4F1EA" />
    <ellipse cx="100" cy="85" rx="52" ry="9" fill="#4A2510" />
    <path d="M152,98 Q178,100 170,122 Q164,134 146,130" stroke="#F4F1EA" strokeWidth="9" fill="none" />
  </svg>
);

const MoneySvg: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="92" fill="#7BE495" />
    <path d="M55,170 Q40,110 70,80 L130,80 Q160,110 145,170 Z" fill="#C8A878" />
    <path d="M80,80 L72,58 L128,58 L120,80 Z" fill="#B8966A" />
    <text x="100" y="140" textAnchor="middle" fontFamily="Anton" fontSize="54" fill="#5A3018">$</text>
    <circle cx="150" cy="55" r="16" fill="#F2C14E" />
    <circle cx="50" cy="60" r="12" fill="#F2C14E" />
  </svg>
);

export const Folge8Story: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, #8A5A3A 0%, #1E0E06 78%)" }}>
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
        <div style={{ fontSize: 100, color: "#FFF8E7" }}>DEINE KAFFEEPAUSE</div>
        <div style={{ fontSize: 112, color: "#FFC37A" }}>IST WERBUNG</div>
      </div>

      <div style={{ position: "relative", width: 900, height: 640, display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: 60, gap: 40 }}>
        <div style={{ transform: "rotate(-6deg)" }}>
          <CupSvg size={360} />
        </div>
        <div style={{ fontFamily: FONT_BOLD, fontSize: 130, color: "#fff" }}>→</div>
        <div style={{ transform: "rotate(6deg)" }}>
          <MoneySvg size={360} />
        </div>
        <div style={{ position: "absolute", top: 400, background: "rgba(255,248,231,0.92)", borderRadius: 26, padding: "10px 24px", transform: "rotate(-4deg)" }}>
          <Stamp text="WERBUNG" size={115} rotate={-6} />
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: FONT_SUB, fontWeight: 800, fontSize: 46, color: "#fff", lineHeight: 1.2 }}>
          Erfunden, um mehr Kaffee zu verkaufen.
          <br />
          Die Geschichte hinter deiner Pause ☕
        </div>
        <div style={{ marginTop: 30, display: "inline-block", fontFamily: FONT_BOLD, fontSize: 84, color: "#111", whiteSpace: "nowrap", background: "#FFD166", padding: "8px 44px", borderRadius: 20, boxShadow: "0 10px 0 rgba(0,0,0,0.3)" }}>
          NEUES VIDEO IST DA
        </div>
        <div style={{ marginTop: 26, fontFamily: FONT_SUB, fontWeight: 800, fontSize: 46, color: "#fff" }}>Jetzt auf meinem Profil ansehen</div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
