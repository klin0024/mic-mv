import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { rand } from "../lib/anim";

// Rotating soft god-rays radiating from (cx, cy), drawn inside an SVG
export const SunRays: React.FC<{
  cx: number;
  cy: number;
  count?: number;
  length?: number;
  color?: string;
  opacity?: number;
  speed?: number;
}> = ({ cx, cy, count = 22, length = 1400, color = "#fff4c2", opacity = 0.35, speed = 0.04 }) => {
  const frame = useCurrentFrame();
  const rays = new Array(count).fill(0).map((_, i) => {
    const base = (i / count) * 360 + frame * speed;
    const w = 2.5 + rand(`w${i}`) * 4;
    const a1 = ((base - w / 2) * Math.PI) / 180;
    const a2 = ((base + w / 2) * Math.PI) / 180;
    const len = length * (0.6 + rand(`l${i}`) * 0.4);
    const flick = 0.55 + 0.45 * Math.sin(frame * 0.05 + i * 1.7);
    return (
      <path
        key={i}
        d={`M ${cx} ${cy} L ${cx + Math.cos(a1) * len} ${cy + Math.sin(a1) * len} L ${cx + Math.cos(a2) * len} ${cy + Math.sin(a2) * len} Z`}
        fill="url(#rayGrad)"
        opacity={opacity * flick}
      />
    );
  });
  return (
    <g style={{ mixBlendMode: "screen" }}>
      <defs>
        <radialGradient id="rayGrad" cx={cx} cy={cy} r={length} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={color} stopOpacity={1} />
          <stop offset="70%" stopColor={color} stopOpacity={0.15} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      {rays}
    </g>
  );
};

// Floating dust / light motes (SVG group)
export const Motes: React.FC<{
  n?: number;
  seed?: string;
  color?: string;
  area?: [number, number, number, number];
  rise?: number;
  size?: number;
}> = ({ n = 40, seed = "m", color = "#fff7d6", area = [0, 0, 1920, 1080], rise = 0.4, size = 3 }) => {
  const frame = useCurrentFrame();
  const [x0, y0, w, h] = area;
  return (
    <g style={{ mixBlendMode: "screen" }}>
      {new Array(n).fill(0).map((_, i) => {
        const bx = x0 + rand(`${seed}x${i}`) * w;
        const by = y0 + rand(`${seed}y${i}`) * h;
        const sp = 0.4 + rand(`${seed}s${i}`) * 0.8;
        const y = y0 + ((((by - y0 - frame * rise * sp) % h) + h) % h);
        const x = bx + Math.sin(frame * 0.02 * sp + i) * 18;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(frame * 0.04 * sp + i * 2.1));
        const r = size * (0.5 + rand(`${seed}r${i}`));
        return <circle key={i} cx={x} cy={y} r={r} fill={color} opacity={tw * 0.8} />;
      })}
    </g>
  );
};

// Falling petals (SVG group)
export const Petals: React.FC<{ n?: number; seed?: string; color?: string; speed?: number }> = ({
  n = 30,
  seed = "p",
  color = "#f6b6c4",
  speed = 1,
}) => {
  const frame = useCurrentFrame();
  return (
    <g>
      {new Array(n).fill(0).map((_, i) => {
        const sp = (0.8 + rand(`${seed}v${i}`) * 1.2) * speed;
        const x0 = rand(`${seed}x${i}`) * 2200 - 140;
        const y = ((rand(`${seed}y${i}`) * 1300 + frame * sp * 1.6) % 1300) - 110;
        const x = x0 + Math.sin(frame * 0.03 * sp + i) * 50 - frame * 0.4 * sp;
        const xx = ((x % 2100) + 2100) % 2100 - 90;
        const rot = frame * 2 * sp + i * 40;
        const sc = 0.6 + rand(`${seed}s${i}`) * 0.9;
        return (
          <path
            key={i}
            transform={`translate(${xx} ${y}) rotate(${rot}) scale(${sc} ${sc * (0.5 + 0.5 * Math.abs(Math.sin(frame * 0.07 + i)))})`}
            d="M 0 -9 Q 7 -4 0 9 Q -7 -4 0 -9 Z"
            fill={color}
            opacity={0.9}
          />
        );
      })}
    </g>
  );
};

// Painterly paper grain over the whole frame
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none">
        <filter id="grainF">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={2} seed={Math.floor(frame / 3) % 7} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="1920" height="1080" filter="url(#grainF)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number; color?: string }> = ({ strength = 0.45, color = "20,10,0" }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse at 50% 45%, rgba(${color},0) 55%, rgba(${color},${strength}) 100%)`,
    }}
  />
);

// Heart path centered at 0,0 with width ~2r
export const heartPath = (r: number) =>
  `M 0 ${r * 0.9} C ${-r * 1.6} ${-r * 0.1} ${-r * 0.9} ${-r * 1.2} 0 ${-r * 0.45} C ${r * 0.9} ${-r * 1.2} ${r * 1.6} ${-r * 0.1} 0 ${r * 0.9} Z`;
