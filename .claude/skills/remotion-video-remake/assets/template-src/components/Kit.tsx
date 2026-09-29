import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { rand } from "../lib/anim";

export const C = {
  navy: "#0f1b3d",
  blue: "#1f5fbf",
  sky: "#3d8ee6",
  orange: "#f47b20",
  amber: "#ffb347",
  cream: "#fff6e6",
  ink: "#15121a",
};

export const FONT_BOLD = '"Microsoft JhengHei", "Noto Sans TC", sans-serif';

// Kinetic headline: each character pops in with a stagger, white fill + thick orange outline
export const BigLine: React.FC<{
  text: string;
  start: number;
  size: number;
  color?: string;
  stroke?: string;
  strokeW?: number;
  stagger?: number;
  rotate?: number;
  style?: React.CSSProperties;
}> = ({ text, start, size, color = "#fff", stroke = C.orange, strokeW, stagger = 2, rotate = 0, style }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexWrap: "nowrap", width: "max-content", fontFamily: FONT_BOLD, fontWeight: 900, fontSize: size, lineHeight: 1.1, rotate: `${rotate}deg`, ...style }}>
      {[...text].map((ch, i) => {
        const t = frame - start - i * stagger;
        const sc = interpolate(t, [0, 6, 10], [0, 1.25, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const y = interpolate(t, [0, 8], [size * 0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              flexShrink: 0,
              color,
              WebkitTextStroke: `${strokeW ?? size * 0.14}px ${stroke}`,
              paintOrder: "stroke fill",
              textShadow: `0 ${size * 0.06}px 0 rgba(0,0,0,0.35)`,
              scale: `${sc}`,
              translate: `0px ${y}px`,
              whiteSpace: "pre",
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

// Handheld microphone, drawn around (0,0) = grille centre
export const Mic: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -34 40 L 34 40 L 22 300 Q 0 318 -22 300 Z" fill="#23262e" />
    <path d="M -30 44 L -18 296" stroke="#4a4f5c" strokeWidth={8} strokeLinecap="round" />
    <rect x={-40} y={30} width={80} height={24} rx={6} fill="#b9bfc9" />
    <rect x={-10} y={120} width={20} height={34} rx={4} fill={C.orange} />
    <circle r={64} fill="#aab1bd" />
    <circle r={64} fill="url(#grille)" />
    <path d="M -46 -36 Q -20 -60 16 -58" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.6} />
    <defs>
      <pattern id="grille" width="12" height="12" patternUnits="userSpaceOnUse">
        <circle cx="6" cy="6" r="2.6" fill="#5d6470" />
      </pattern>
    </defs>
  </g>
);

// Sound-wave rings expanding from a point
export const Waves: React.FC<{ x: number; y: number; color?: string; n?: number }> = ({ x, y, color = C.amber, n = 4 }) => {
  const frame = useCurrentFrame();
  return (
    <g>
      {new Array(n).fill(0).map((_, i) => {
        const p = ((frame + i * (60 / n)) % 60) / 60;
        return <circle key={i} cx={x} cy={y} r={80 + p * 320} fill="none" stroke={color} strokeWidth={10 * (1 - p)} opacity={1 - p} />;
      })}
    </g>
  );
};

// Comic radial burst lines
export const Burst: React.FC<{ x: number; y: number; color?: string; opacity?: number }> = ({ x, y, color = "#fff", opacity = 0.18 }) => {
  const frame = useCurrentFrame();
  return (
    <g opacity={opacity}>
      {new Array(36).fill(0).map((_, i) => {
        const a = (i / 36) * Math.PI * 2 + frame * 0.004;
        const w = 0.035;
        return (
          <path
            key={i}
            d={`M ${x} ${y} L ${x + Math.cos(a - w) * 2400} ${y + Math.sin(a - w) * 2400} L ${x + Math.cos(a + w) * 2400} ${y + Math.sin(a + w) * 2400} Z`}
            fill={color}
          />
        );
      })}
    </g>
  );
};

// Dusk city street backdrop (flat illustration)
export const City: React.FC<{ tone?: "dusk" | "night" | "day" }> = ({ tone = "dusk" }) => {
  const frame = useCurrentFrame();
  const sky =
    tone === "night" ? ["#0b1433", "#23305e"] : tone === "day" ? ["#8cc8f2", "#e3f2fb"] : ["#28357a", "#f08c5a"];
  return (
    <g>
      <defs>
        <linearGradient id={`citySky-${tone}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky[0]} />
          <stop offset="100%" stopColor={sky[1]} />
        </linearGradient>
      </defs>
      <rect width="1920" height="1080" fill={`url(#citySky-${tone})`} />
      {/* back skyline */}
      {new Array(16).fill(0).map((_, i) => {
        const w = 90 + rand(`bw${i}`) * 110;
        const h = 220 + rand(`bh${i}`) * 380;
        const x = i * 125 - 40;
        return <rect key={i} x={x} y={760 - h} width={w} height={h} fill={tone === "day" ? "#9db4cc" : "#1c2550"} opacity={0.75} />;
      })}
      {/* front buildings with lit windows */}
      {new Array(9).fill(0).map((_, i) => {
        const w = 170 + rand(`fw${i}`) * 90;
        const h = 260 + rand(`fh${i}`) * 260;
        const x = i * 220 - 30;
        return (
          <g key={i}>
            <rect x={x} y={800 - h} width={w} height={h} fill={tone === "day" ? "#c9d6e3" : "#2a3264"} />
            {new Array(Math.floor(h / 60)).fill(0).map((__, r) =>
              new Array(3).fill(0).map((___, c) => (
                <rect
                  key={`${r}-${c}`}
                  x={x + 22 + c * (w / 3.2)}
                  y={800 - h + 26 + r * 60}
                  width={w / 5}
                  height={28}
                  fill={tone === "day" ? "#e9f1f8" : "#ffd27a"}
                  opacity={tone === "day" ? 0.8 : 0.35 + 0.6 * Math.abs(Math.sin(frame * 0.01 + i * 3 + r * 7 + c))}
                />
              )),
            )}
          </g>
        );
      })}
      {/* street */}
      <rect y={800} width="1920" height="280" fill={tone === "day" ? "#8a8f98" : "#2b2d3a"} />
      <rect y={800} width="1920" height="22" fill={tone === "day" ? "#b7bcc4" : "#474a5c"} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={i * 360 + 60} y={950} width={180} height={14} fill="#e8e1c8" opacity={0.6} />
      ))}
      {/* street lamps */}
      {[260, 1660].map((x) => (
        <g key={x}>
          <rect x={x} y={420} width={12} height={390} fill="#1a1c26" />
          <path d={`M ${x + 6} 420 Q ${x + 6} 390 ${x + 60} 392`} stroke="#1a1c26" strokeWidth={10} fill="none" />
          <ellipse cx={x + 66} cy={398} rx={26} ry={10} fill="#fff1c1" />
          {tone !== "day" && <circle cx={x + 66} cy={420} r={110} fill="#ffe7a3" opacity={0.18} />}
        </g>
      ))}
    </g>
  );
};

export const Grade: React.FC<{ color?: string; opacity?: number }> = ({ color = "#f47b20", opacity = 0.12 }) => (
  <AbsoluteFill style={{ background: color, mixBlendMode: "soft-light", opacity, pointerEvents: "none" }} />
);
