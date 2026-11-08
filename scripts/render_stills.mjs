// Kontaktbogen: einzelne Bilder rendern. Aufruf: node scripts/render_stills.mjs <Komposition> <Ordner> <Frame> <Frame> ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "path";
const [comp, outDir, ...frames] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), enableCaching: true, webpackOverride: (c) => c });
const HS = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const composition = await selectComposition({ serveUrl, id: comp, browserExecutable: HS, chromiumOptions: { gl: "swangle" } });
for (const f of frames) {
  await renderStill({ serveUrl, composition, frame: Number(f), output: `${outDir}/f${String(f).padStart(4, "0")}.jpg`, imageFormat: "jpeg", jpegQuality: 70, scale: 0.4, browserExecutable: HS, chromiumOptions: { gl: "swangle" } });
  console.log("ok", f);
}
