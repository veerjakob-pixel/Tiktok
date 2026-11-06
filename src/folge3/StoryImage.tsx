import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT_BOLD, FONT_SUB } from "../theme";
import { PriceTag, Ring, Sparkle, Stamp } from "./Graphics";

// Einzelbild für die Story (1080 x 1920) – Werbung für Folge 3.
// Oben 150 px und unten 400 px bleiben für die App-Leisten frei.
export const Folge3Story: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, #3A2A6B 0%, #07060F 78%)" }}>
    {/* Strahlen */}
    <AbsoluteFill style={{ opacity: 0.09, transform: "scale(2.2)" }}>
      <svg viewBox="-100 -100 200 200" width="100%" height="100%">
        {Array.from({ length: 18 }).map((_, i) => {
          const a1 = (i / 18) * Math.PI * 2;
          const a2 = a1 + Math.PI / 18;
          return (
            <polygon key={i} points={`0,0 ${Math.cos(a1) * 200},${Math.sin(a1) * 200} ${Math.cos(a2) * 200},${Math.sin(a2) * 200}`} fill="#fff" />
          );
        })}
      </svg>
    </AbsoluteFill>
    {/* Funkeln */}
    {[
      [170, 640, 60],
      [880, 560, 44],
      [240, 1080, 40],
      [860, 1010, 64],
      [520, 470, 30],
    ].map(([x, y, s], i) => (
      <Sparkle key={i} size={s} style={{ position: "absolute", left: x, top: y, opacity: 0.85 }} />
    ))}

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
        WERBELÜGEN #3
      </div>

      <div style={{ textAlign: "center", fontFamily: FONT_BOLD, lineHeight: 1.02, textShadow: "0 8px 0 rgba(0,0,0,0.35)" }}>
        <div style={{ fontSize: 100, color: "#FFF8E7" }}>„EIN DIAMANT</div>
        <div style={{ fontSize: 100, color: "#9FE3FF" }}>IST FÜR IMMER“</div>
      </div>

      <div style={{ position: "relative", width: 900, height: 640, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Ring size={600} style={{ position: "absolute", left: 90, top: 0 }} />
        <div style={{ position: "absolute", left: 560, top: 400, transform: "rotate(10deg)" }}>
          <PriceTag text="???" width={300} />
        </div>
        <div style={{ position: "absolute", top: 260 }}>
          <Stamp text="WERBUNG" size={170} />
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: FONT_SUB, fontWeight: 800, fontSize: 54, color: "#fff", lineHeight: 1.2 }}>
          Wer bestimmt, was dein Ring kostet? 💍
        </div>
        <div
          style={{
            marginTop: 34,
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
        <div style={{ marginTop: 26, fontFamily: FONT_SUB, fontWeight: 800, fontSize: 46, color: "#fff" }}>
          Jetzt auf meinem Profil ansehen
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
