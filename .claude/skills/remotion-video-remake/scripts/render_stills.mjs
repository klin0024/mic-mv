#!/usr/bin/env node
// Bundle a Remotion project ONCE and render many stills of one composition.
// Much faster than calling `npx remotion still` per frame (which re-bundles every time).
//
// Usage: node render_stills.mjs --project <remotion project dir> --comp <id> --out <dir>
//                               [--scale 0.5] [--cols 4] <time seconds...>
//
// Output: <out>/n_00.jpeg, n_01.jpeg … in the order given, index.txt (file → time),
//         and sheet.jpg (all stills tiled, needs ffmpeg on PATH).
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
let project, comp, out;
let scale = 0.5;
let cols = 4;
const times = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--project") project = args[++i];
  else if (a === "--comp") comp = args[++i];
  else if (a === "--out") out = args[++i];
  else if (a === "--scale") scale = Number(args[++i]);
  else if (a === "--cols") cols = Number(args[++i]);
  else times.push(Number(a));
}
if (!project || !comp || !out || times.length === 0) {
  console.error("usage: node render_stills.mjs --project <dir> --comp <id> --out <dir> [--scale 0.5] [--cols 4] <seconds...>");
  process.exit(1);
}
project = path.resolve(project);
fs.mkdirSync(out, { recursive: true });

const require = createRequire(path.join(project, "package.json"));
const { bundle } = require("@remotion/bundler");
const { renderStill, selectComposition } = require("@remotion/renderer");

const serveUrl = await bundle({ entryPoint: path.join(project, "src/index.ts"), publicDir: path.join(project, "public") });
const composition = await selectComposition({ serveUrl, id: comp });
const lines = [];
for (let i = 0; i < times.length; i++) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(times[i] * composition.fps));
  const name = `n_${String(i).padStart(2, "0")}.jpeg`;
  await renderStill({ composition, serveUrl, frame, output: path.join(out, name), imageFormat: "jpeg", jpegQuality: 70, scale });
  lines.push(`${name}\t${times[i]}s\tframe ${frame}`);
}
fs.writeFileSync(path.join(out, "index.txt"), lines.join("\n") + "\n");
try {
  const rows = Math.ceil(times.length / cols);
  execFileSync("ffmpeg", ["-v", "error", "-start_number", "0", "-i", path.join(out, "n_%02d.jpeg"), "-frames:v", "1", "-vf", `scale=480:-1,tile=${cols}x${rows}`, path.join(out, "sheet.jpg"), "-y"]);
} catch {
  console.log("(ffmpeg tiling skipped)");
}
console.log(`rendered ${times.length} stills of ${comp} → ${out} (sheet.jpg, index.txt)`);
