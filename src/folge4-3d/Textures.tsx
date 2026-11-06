// Canvas-Texturen (Text, Papier, Etiketten) für die 3D-Szenen von Folge 4.
import { F, lines, useCanvasTexture } from "./Kit";

const paper = (ctx: CanvasRenderingContext2D, w: number, h: number, a = "#F6EBD0", b = "#E6D6B0") => {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, a);
  g.addColorStop(1, b);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
};
const center = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, font: string, color: string) => {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
};

export const useTvTexture = (q: number) =>
  useCanvasTexture(
    1024,
    800,
    (ctx) => {
      const g = ctx.createRadialGradient(512, 400, 50, 512, 400, 620);
      g.addColorStop(0, "#E2DCCB");
      g.addColorStop(1, "#7E7768");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 1024, 800);
      center(ctx, "ZUCKER", 512, 230, `150px ${F.bold}`, "#1A1A1A");
      center(ctx, "UNTER VERDACHT", 512, 390, `130px ${F.bold}`, "#1A1A1A");
      ctx.save();
      ctx.translate(512, 600);
      ctx.scale(q, q);
      center(ctx, "?", 0, 0, `260px ${F.bold}`, "#7A1E1E");
      ctx.restore();
      ctx.fillStyle = "rgba(0,0,0,0.13)";
      for (let y = 0; y < 800; y += 6) ctx.fillRect(0, y, 1024, 2);
    },
    [Math.round(q * 20)],
  );

export const useEcgTexture = (t: number, wild: number) =>
  useCanvasTexture(
    1024,
    300,
    (ctx) => {
      ctx.strokeStyle = "#F7F1E1";
      ctx.lineWidth = 14;
      ctx.lineJoin = "round";
      ctx.shadowColor = "rgba(255,255,255,0.8)";
      ctx.shadowBlur = 16;
      ctx.beginPath();
      for (let x = 0; x <= 1024; x += 6) {
        const ph = (x + t * 16) % 256;
        let y = 0;
        if (ph > 100 && ph < 116) y = -25;
        else if (ph >= 116 && ph < 126) y = 110 * (1 + wild);
        else if (ph >= 126 && ph < 140) y = -150 * (1 + wild);
        else if (ph >= 140 && ph < 152) y = 40;
        y += wild * Math.sin(x * 0.15 + t) * 40;
        const yy = 150 - y * 0.55;
        if (x === 0) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    },
    [t, Math.round(wild * 20)],
  );

export const useSignTexture = (text: string, bg = "#2B1D0E", fg = "#F1E6C8", font = F.vintage) =>
  useCanvasTexture(
    1024,
    256,
    (ctx) => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 1024, 256);
      center(ctx, text, 512, 132, `140px ${font}`, fg);
    },
    [text, bg, fg],
  );

export const useLetterheadTexture = () =>
  useCanvasTexture(
    1024,
    700,
    (ctx) => {
      paper(ctx, 1024, 700);
      center(ctx, "SUGAR RESEARCH FOUNDATION", 512, 90, `64px ${F.vintage}`, "#2B1D0E");
      ctx.fillStyle = "#2B1D0E";
      ctx.fillRect(80, 140, 864, 5);
      ctx.fillRect(80, 152, 864, 2);
      center(ctx, "New York · 1965", 512, 200, `bold 40px ${F.sub}`, "#2B1D0E");
      lines(ctx, 90, 270, 840, 7, 56, "#C7B791", 14);
    },
    [],
  );

export const useEnvelopeTexture = () =>
  useCanvasTexture(
    1024,
    640,
    (ctx) => {
      paper(ctx, 1024, 640, "#EAD9AE", "#D9C38F");
      ctx.strokeStyle = "#8C6A3C";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(10, 10);
      ctx.lineTo(512, 360);
      ctx.lineTo(1014, 10);
      ctx.stroke();
      center(ctx, "VERTRAULICH", 512, 540, `90px ${F.vintage}`, "#7A1E1E");
    },
    [],
  );

export const useJournalTexture = (hi: number) =>
  useCanvasTexture(
    800,
    1056,
    (ctx) => {
      paper(ctx, 800, 1056, "#F3ECDD", "#E2D6BD");
      ctx.fillStyle = "#7A1E1E";
      ctx.fillRect(0, 0, 40, 1056);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#1F2A44";
      ctx.font = `110px ${F.vintage}`;
      ctx.fillText("Medical", 80, 170);
      ctx.fillText("Journal", 80, 290);
      ctx.font = `bold 40px ${F.sub}`;
      ctx.fillText("VOL. 277 ·", 80, 360);
      ctx.fillStyle = `rgba(255,214,10,${hi})`;
      ctx.fillRect(300, 322, 120, 52);
      ctx.fillStyle = "#1F2A44";
      ctx.fillText("1967", 306, 360);
      ctx.fillRect(80, 395, 640, 6);
      ctx.font = `64px ${F.vintage}`;
      ["Dietary Fats,", "Carbohydrates and", "Heart Disease"].forEach((t, i) => ctx.fillText(t, 80, 490 + i * 76));
      lines(ctx, 80, 740, 640, 6, 48, "#B9AE97", 14);
    },
    [Math.round(hi * 10)],
  );

export const usePageTexture = (typed: string, fine = false) =>
  useCanvasTexture(
    1024,
    1024,
    (ctx) => {
      paper(ctx, 1024, 1024, "#F7F1E3", "#ECE2CB");
      lines(ctx, 90, 90, 840, 5, 50, "#C9BFA9", 16);
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#1F2A44";
      if (!fine) {
        ctx.font = `150px ${F.vintage}`;
        ctx.fillText(typed, 90, 470);
      } else {
        ctx.font = `bold 66px ${F.sub}`;
        ctx.fillText("Finanziert von:", 90, 470);
        ctx.strokeStyle = "#9B2226";
        ctx.lineWidth = 7;
        ctx.setLineDash([22, 14]);
        ctx.beginPath();
        ctx.moveTo(620, 500);
        ctx.lineTo(940, 500);
        ctx.stroke();
      }
      lines(ctx, 90, 640, 840, 6, 50, "#C9BFA9", 16);
    },
    [typed, fine],
  );

export const useWantedTexture = () =>
  useCanvasTexture(
    800,
    1100,
    (ctx) => {
      paper(ctx, 800, 1100, "#F1DFB0", "#D5B87C");
      ctx.strokeStyle = "#6B4A22";
      ctx.lineWidth = 12;
      ctx.strokeRect(20, 20, 760, 1060);
      center(ctx, "GESUCHT", 400, 140, `170px ${F.bold}`, "#3A2410");
      center(ctx, "Staatsfeind Nr. 1", 400, 250, `56px ${F.vintage}`, "#3A2410");
      ctx.fillStyle = "#F7EBCB";
      ctx.fillRect(110, 300, 580, 560);
      ctx.strokeRect(110, 300, 580, 560);
      center(ctx, "FETT", 400, 960, `170px ${F.bold}`, "#9B2226");
    },
    [],
  );

export const useLabelTexture = (name: string, color: string) =>
  useCanvasTexture(
    512,
    700,
    (ctx) => {
      const g = ctx.createLinearGradient(0, 0, 512, 700);
      g.addColorStop(0, color);
      g.addColorStop(1, "#00000055");
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 512, 700);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 700);
      center(ctx, name, 256, 120, `${name.length > 6 ? 84 : 104}px ${F.bold}`, "#ffffff");
      ctx.beginPath();
      ctx.arc(256, 430, 140, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.28)";
      ctx.fill();
    },
    [name, color],
  );

export const useStickerTexture = (text = "FETTARM") =>
  useCanvasTexture(
    512,
    160,
    (ctx) => {
      ctx.fillStyle = "#D00000";
      ctx.beginPath();
      ctx.roundRect(4, 4, 504, 152, 26);
      ctx.fill();
      center(ctx, text, 256, 84, `110px ${F.bold}`, "#ffffff");
    },
    [text],
  );

export const useYogurtTexture = () =>
  useCanvasTexture(
    1024,
    400,
    (ctx) => {
      ctx.fillStyle = "#2A9D8F";
      ctx.fillRect(0, 0, 1024, 400);
      [0, 512].forEach((x) => {
        center(ctx, "FETTARM", x + 256, 160, `130px ${F.bold}`, "#ffffff");
        center(ctx, "nur 0,1 % Fett", x + 256, 290, `bold 52px ${F.sub}`, "#E8FFF9");
      });
    },
    [],
  );

export const useNewsTexture = () =>
  useCanvasTexture(
    1024,
    1200,
    (ctx) => {
      paper(ctx, 1024, 1200, "#FBFBF7", "#ECECE6");
      ctx.fillStyle = "#111";
      ctx.textBaseline = "alphabetic";
      ctx.textAlign = "left";
      ctx.font = `bold 40px ${F.sub}`;
      ctx.fillText("NACHRICHTEN", 60, 80);
      ctx.textAlign = "right";
      ctx.fillText("SEPTEMBER 2016", 964, 80);
      ctx.fillRect(60, 100, 904, 8);
      ctx.textAlign = "left";
      ctx.font = `128px ${F.bold}`;
      ["ZUCKER-INDUSTRIE", "BEZAHLTE", "HARVARD-FORSCHER"].forEach((t, i) => ctx.fillText(t, 60, 250 + i * 135));
      lines(ctx, 60, 600, 904, 10, 52, "#CFCFCF", 16);
    },
    [],
  );

export const useLetterTexture = (date: string) =>
  useCanvasTexture(
    700,
    900,
    (ctx) => {
      paper(ctx, 700, 900);
      center(ctx, "SUGAR RESEARCH FOUNDATION", 350, 70, `40px ${F.vintage}`, "#2B1D0E");
      ctx.fillStyle = "#2B1D0E";
      ctx.fillRect(40, 105, 620, 4);
      ctx.textAlign = "left";
      ctx.font = `bold 34px ${F.sub}`;
      ctx.fillText(date, 40, 160);
      lines(ctx, 40, 210, 620, 11, 54, "#C7B791", 12);
    },
    [date],
  );

export const useBoxLabelTexture = () =>
  useCanvasTexture(
    600,
    320,
    (ctx) => {
      paper(ctx, 600, 320, "#F1E6C8", "#E2D3AE");
      ctx.strokeStyle = "#6B4A22";
      ctx.lineWidth = 10;
      ctx.strokeRect(6, 6, 588, 308);
      center(ctx, "ARCHIV", 300, 120, `110px ${F.bold}`, "#2B1D0E");
      center(ctx, "1965 – 1967", 300, 240, `bold 56px ${F.sub}`, "#2B1D0E");
    },
    [],
  );
