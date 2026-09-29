import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Animal, AnimalProps, CAST } from "./Animal";
import { FONT_BOLD } from "./Kit";
import { LYRICS } from "../lyrics";
import { s } from "../lib/anim";

// Full-frame SVG canvas with a slow camera push
export const Stage: React.FC<{ children: React.ReactNode; zoom?: [number, number]; origin?: string; dur?: number }> = ({
  children,
  zoom = [1, 1.05],
  origin = "960px 540px",
  dur = 180,
}) => {
  const frame = useCurrentFrame();
  return (
    <svg
      viewBox="0 0 1920 1080"
      width="100%"
      height="100%"
      style={{ scale: `${interpolate(frame, [0, dur], zoom, { extrapolateRight: "clamp" })}`, transformOrigin: origin }}
    >
      {children}
    </svg>
  );
};

// A row of animal citizens; `raise` = fraction with a hand up
export const Citizens: React.FC<{
  y: number;
  s: number;
  from?: number;
  to?: number;
  raise?: number;
  skip?: number[];
  cast?: Omit<AnimalProps, "x" | "y">[];
  cheer?: boolean;
  opacity?: number;
}> = ({ y, s: sc, from = 80, to = 1840, raise = 0, skip = [], cast = CAST, cheer = false, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const list = cast.filter((_, i) => !skip.includes(i));
  return (
    <g opacity={opacity}>
      {list.map((c, i) => {
        const up = cheer || (i * 7) % 10 < raise * 10;
        return (
          <Animal
            key={i}
            x={from + (i * (to - from)) / Math.max(1, list.length - 1)}
            y={y + (i % 2) * 8}
            s={sc}
            {...c}
            armR={up ? 160 + Math.sin(frame * 0.25 + i) * 10 : 12}
            armL={cheer ? 160 + Math.sin(frame * 0.25 + i + 1) * 10 : 10}
            bob={up ? Math.abs(Math.sin(frame * 0.2 + i)) * 4 : 0}
          />
        );
      })}
    </g>
  );
};

// Sub-shots inside a scene, each starting at `at` seconds (local). Hard cut with a quick pop-in.
export const Shots: React.FC<{ shots: { at: number; el: React.ReactNode; name: string }[] }> = ({ shots }) => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill>
      {shots.map((sh, i) => {
        const from = s(sh.at);
        const to = i < shots.length - 1 ? s(shots[i + 1].at) : durationInFrames;
        return (
          <Sequence key={i} name={sh.name} from={from} durationInFrames={Math.max(1, to - from)} layout="absolute-fill">
            <ShotIn>{sh.el}</ShotIn>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const ShotIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        scale: `${interpolate(frame, [0, 8], [1.06, 1], { extrapolateRight: "clamp" })}`,
        opacity: interpolate(frame, [0, 4], [0.4, 1], { extrapolateRight: "clamp" }),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Bottom lyric bar, styled like the original MV subtitles (white text, orange outline)
export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const line = LYRICS.find((l) => t >= l.start && t < l.end);
  if (!line) return null;
  const a = interpolate(t, [line.start, line.start + 0.15, line.end - 0.15, line.end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Karaoke: characters change colour one by one as the line is sung
  const chars = [...line.text];
  const sungTotal = chars.filter((ch) => ch.trim() !== "").length;
  const sung = interpolate(t, [line.start + 0.1, line.start + (line.end - line.start) * 0.88], [0, sungTotal], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  let k = 0;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 38, pointerEvents: "none" }}>
      <div
        style={{
          display: "flex",
          fontFamily: FONT_BOLD,
          fontWeight: 900,
          fontSize: 50,
          letterSpacing: 3,
          paintOrder: "stroke fill",
          textShadow: "0 4px 0 rgba(0,0,0,0.35)",
          opacity: a,
          translate: `0px ${(1 - a) * 8}px`,
        }}
      >
        {chars.map((ch, i) => {
          if (ch.trim() === "") return <span key={i} style={{ whiteSpace: "pre" }}>{ch}</span>;
          const f = Math.min(1, Math.max(0, sung - k));
          k++;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                color: interpolateColors(f, [0, 1], ["#ffffff", "#ffd54f"]),
                WebkitTextStroke: `9px ${interpolateColors(f, [0, 1], ["#2a3566", "#e8590c"])}`,
                scale: `${1 + Math.sin(f * Math.PI) * 0.18}`,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Speech bubble (SVG), tail pointing down-left by default
export const Bubble: React.FC<{ x: number; y: number; w: number; h: number; k?: number; fill?: string; tail?: "left" | "right"; children?: React.ReactNode }> = ({
  x,
  y,
  w,
  h,
  k = 1,
  fill = "#fff",
  tail = "left",
  children,
}) => (
  <g transform={`translate(${x} ${y}) scale(${k})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={Math.min(40, h / 2)} fill={fill} stroke="#2a2330" strokeWidth={6} />
    <path
      d={tail === "left" ? `M ${-w * 0.25} ${h / 2 - 3} L ${-w * 0.32} ${h / 2 + 36} L ${-w * 0.1} ${h / 2 - 3} Z` : `M ${w * 0.25} ${h / 2 - 3} L ${w * 0.32} ${h / 2 + 36} L ${w * 0.1} ${h / 2 - 3} Z`}
      fill={fill}
      stroke="#2a2330"
      strokeWidth={6}
      strokeLinejoin="round"
    />
    <rect x={tail === "left" ? -w * 0.3 : w * 0.08} y={h / 2 - 10} width={w * 0.22} height={12} fill={fill} />
    {children}
  </g>
);

export const SvgText: React.FC<{ x: number; y: number; size: number; color?: string; children: React.ReactNode; anchor?: "start" | "middle" | "end"; weight?: number }> = ({
  x,
  y,
  size,
  color = "#2a2330",
  children,
  anchor = "middle",
  weight = 900,
}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT_BOLD} fontWeight={weight} fontSize={size} fill={color}>
    {children}
  </text>
);
