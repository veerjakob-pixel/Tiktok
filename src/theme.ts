import { loadFont } from "@remotion/fonts";
import { interpolate, random, spring, staticFile } from "remotion";

export const COLORS = {
  red: "#D62828",
  green: "#1B4332",
  cream: "#FFF8E7",
  yellow: "#FFD60A",
  sour: "#A7B83C",
  wood: "#8B5A2B",
  ink: "#2B1D0E",
};

// Schriften liegen lokal in public/fonts (Google Fonts, OFL-Lizenz) -> Rendern klappt auch offline.
export const FONT_SUB = "Montserrat";
export const FONT_BOLD = "Anton";
export const FONT_VINTAGE = "Abril Fatface";

loadFont({
  family: FONT_SUB,
  url: staticFile("fonts/Montserrat.woff2"),
  weight: "100 900",
});
loadFont({
  family: FONT_BOLD,
  url: staticFile("fonts/Anton.woff2"),
  weight: "400",
});
loadFont({
  family: FONT_VINTAGE,
  url: staticFile("fonts/AbrilFatface.woff2"),
  weight: "400",
});

// Bildschirm-Wackeln: gibt einen CSS-Transform zurück.
export const shake = (frame: number, start: number, length = 10, amp = 26) => {
  const t = frame - start;
  if (t < 0 || t > length) return "translate(0px, 0px)";
  const decay = 1 - t / length;
  const x = (random(`x${frame}`) - 0.5) * 2 * amp * decay;
  const y = (random(`y${frame}`) - 0.5) * 2 * amp * decay;
  const r = (random(`r${frame}`) - 0.5) * 4 * decay;
  return `translate(${x}px, ${y}px) rotate(${r}deg)`;
};

// Schneller "Punch-In"-Zoom am Anfang eines Schnitts.
export const punch = (frame: number, fps: number, from = 1.25) =>
  interpolate(
    spring({ frame, fps, config: { damping: 14, stiffness: 180 } }),
    [0, 1],
    [from, 1],
  );

export const pop = (frame: number, fps: number, delay = 0) =>
  spring({
    frame: frame - delay,
    fps,
    config: { damping: 10, stiffness: 200 },
  });
