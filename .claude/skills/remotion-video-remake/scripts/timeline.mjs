#!/usr/bin/env node
// Compute <TransitionSeries.Sequence durationInFrames> values so that every scene
// starts exactly at the song time you want, even though transitions overlap scenes.
//
// Usage: node timeline.mjs --total <seconds> [--fps 30] [--overlap 15] <start1> <start2> ...
//   starts are scene start times in seconds (first should be 0)
//
// Rule: scene i lasts (start[i+1] - start[i]) + overlap frames; the last scene lasts
// (total - start[last]). Sum of scenes - overlap * (n-1) == total frames.
const args = process.argv.slice(2);
let fps = 30;
let overlap = 15;
let total = null;
const starts = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--fps") fps = Number(args[++i]);
  else if (args[i] === "--overlap") overlap = Number(args[++i]);
  else if (args[i] === "--total") total = Number(args[++i]);
  else starts.push(Number(args[i]));
}
if (total === null || starts.length === 0) {
  console.error("usage: node timeline.mjs --total <seconds> [--fps 30] [--overlap 15] <start seconds...>");
  process.exit(1);
}
const totalFrames = Math.round(total * fps);
const f = starts.map((s) => Math.round(s * fps));
const durs = f.map((s, i) => (i < f.length - 1 ? f[i + 1] - s + overlap : totalFrames - s));
const sum = durs.reduce((a, b) => a + b, 0) - overlap * (durs.length - 1);
console.log("scene  start(s)  startFrame  durationInFrames");
durs.forEach((d, i) => console.log(`${String(i + 1).padStart(5)}  ${String(starts[i]).padStart(8)}  ${String(f[i]).padStart(10)}  ${String(d).padStart(16)}`));
console.log(`\ncomposition durationInFrames = ${totalFrames}  (check: ${sum} ${sum === totalFrames ? "OK" : "MISMATCH"})`);
console.log(`transition: linearTiming({ durationInFrames: ${overlap} }) between every pair`);
if (durs.some((d) => d <= overlap)) console.log("WARNING: a scene is shorter than the overlap — merge it with a neighbour.");
