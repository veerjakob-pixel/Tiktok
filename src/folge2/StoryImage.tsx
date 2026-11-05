import React from "react";
import { AbsoluteFill } from "remotion";
import { Stamp } from "../components/Graphics";
import { COLORS, FONT_BOLD, FONT_SUB } from "../theme";
import { BreakfastPlate } from "./Graphics2";

// Einzelbild für die Story (1080 x 1920) – Werbung für Folge 2.
// Oben 150 px und unten 400 px bleiben für die App-Leisten frei.
export const Folge2Story: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "radial-gradient(circle at 50% 40%, #F4A259 0%, #9C3D10 80%)",
    }}
  >
    {/* Strahlen */}
    <AbsoluteFill style={{ opacity: 0.1, transform: "scale(2.2)" }}>
      <svg viewBox="-100 -100 200 200" width="100%" height="100%">
        {Array.from({ length: 16 }).map((_, i) => {
          const a1 = (i / 16) * Math.PI * 2;
          const a2 = a1 + Math.PI / 16;
          return (
            <polygon
              key={i}
              points={`0,0 ${Math.cos(a1) * 200},${Math.sin(a1) * 200} ${Math.cos(a2) * 200},${Math.sin(a2) * 200}`}
              fill="#fff"
            />
          );
        })}
      </svg>
    </AbsoluteFill>

    <AbsoluteFill
      style={{
        top: 170,
        bottom: 400,
        height: "auto",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          fontFamily: FONT_SUB,
          fontWeight: 800,
          fontSize: 40,
          color: "#fff",
          background: "rgba(0,0,0,0.4)",
          padding: "10px 28px",
          borderRadius: 14,
          letterSpacing: 2,
        }}
      >
        WERBELÜGEN #2
      </div>

      <div
        style={{
          textAlign: "center",
          fontFamily: FONT_BOLD,
          lineHeight: 1.02,
          textShadow: "0 8px 0 rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ fontSize: 96, color: COLORS.cream }}>
          „FRÜHSTÜCK IST DIE
        </div>
        <div style={{ fontSize: 96, color: COLORS.cream }}>
          WICHTIGSTE MAHLZEIT“
        </div>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <BreakfastPlate size={860} />
        <div style={{ position: "absolute" }}>
          <Stamp text="WERBUNG" fontSize={190} />
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: FONT_SUB,
            fontWeight: 800,
            fontSize: 54,
            color: "#fff",
            lineHeight: 1.2,
          }}
        >
          Wer hat sich das ausgedacht? 👀
        </div>
        <div
          style={{
            marginTop: 34,
            display: "inline-block",
            fontFamily: FONT_BOLD,
            fontSize: 84,
            color: "#111",
            whiteSpace: "nowrap",
            background: COLORS.yellow,
            padding: "8px 44px",
            borderRadius: 20,
            boxShadow: "0 10px 0 rgba(0,0,0,0.3)",
          }}
        >
          NEUES VIDEO IST DA
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: FONT_SUB,
            fontWeight: 800,
            fontSize: 46,
            color: "#fff",
          }}
        >
          Jetzt auf meinem Profil ansehen
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
