import React from "react";
import { Apple } from "./Graphics";
import { COLORS, FONT_BOLD, FONT_VINTAGE } from "../theme";

// Altes Werbeplakat im 1920er-Stil (Art-Deco-Rahmen, große Schrift, glänzender Apfel)
type Variant = 0 | 1 | 2;

const SCHEMES = [
  { bg: COLORS.cream, frame: COLORS.green, text: COLORS.green, accent: COLORS.red },
  { bg: COLORS.green, frame: "#E9C46A", text: COLORS.cream, accent: "#E9C46A" },
  { bg: COLORS.red, frame: COLORS.cream, text: COLORS.cream, accent: "#FFE8A3" },
];

const COPY = [
  { top: "AN APPLE A DAY", bottom: "KEEPS THE DOCTOR AWAY", foot: "EAT MORE APPLES" },
  { top: "HEALTH IN EVERY BITE", bottom: "AN APPLE A DAY…", foot: "THE FAMILY FRUIT" },
  { top: "EAT AN APPLE", bottom: "KEEPS THE DOCTOR AWAY", foot: "NATURE'S MEDICINE" },
];

export const Poster: React.FC<{ variant: Variant; width?: number }> = ({ variant, width = 560 }) => {
  const s = SCHEMES[variant];
  const c = COPY[variant];
  return (
    <div
      style={{
        width,
        height: width * 1.45,
        background: s.bg,
        boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
        padding: 22,
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 22,
          border: `6px solid ${s.frame}`,
          outline: `2px solid ${s.frame}`,
          outlineOffset: -16,
        }}
      />
      {/* Art-Deco-Strahlen */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 145"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, opacity: 0.18 }}
      >
        {Array.from({ length: 14 }).map((_, i) => {
          const a = (Math.PI * (i + 0.5)) / 14;
          return (
            <polygon
              key={i}
              points={`50,78 ${50 + Math.cos(a - 0.05) * 120},${78 - Math.sin(a - 0.05) * 120} ${50 + Math.cos(a + 0.05) * 120},${78 - Math.sin(a + 0.05) * 120}`}
              fill={s.accent}
            />
          );
        })}
      </svg>
      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "40px 30px",
          boxSizing: "border-box",
          textAlign: "center",
        }}
      >
        <div style={{ fontFamily: FONT_VINTAGE, color: s.text, fontSize: width * 0.105, lineHeight: 1 }}>{c.top}</div>
        <div
          style={{
            width: width * 0.62,
            height: width * 0.62,
            borderRadius: "50%",
            background: variant === 0 ? "#F3E3C3" : COLORS.cream,
            border: `5px solid ${s.frame}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Apple size={width * 0.44} color={COLORS.red} />
        </div>
        <div>
          <div style={{ fontFamily: FONT_BOLD, color: s.text, fontSize: width * 0.075, letterSpacing: 3 }}>{c.bottom}</div>
          <div
            style={{
              marginTop: 10,
              display: "inline-block",
              padding: "4px 18px",
              background: s.frame,
              color: s.bg,
              fontFamily: FONT_BOLD,
              fontSize: width * 0.045,
              letterSpacing: 4,
            }}
          >
            {c.foot}
          </div>
        </div>
      </div>
    </div>
  );
};
