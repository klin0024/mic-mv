import React from "react";
import { useCurrentFrame } from "remotion";
import { Motes, SunRays } from "./Effects";
import { rand } from "../lib/anim";

type Variant = "day" | "blossom";

const PALETTE: Record<Variant, Record<string, string>> = {
  day: {
    skyTop: "#bcd9d6",
    skyMid: "#f6e8b4",
    skyLow: "#fff4cf",
    mtnBack: "#a8b8a7",
    mtnFront: "#86a873",
    fieldTop: "#c8d98a",
    fieldBot: "#6f9a48",
    canopy1: "#5f8f3e",
    canopy2: "#7fae4f",
    canopy3: "#a9cc6a",
    sun: "#fff7d8",
  },
  blossom: {
    skyTop: "#d99aa8",
    skyMid: "#f6c79a",
    skyLow: "#fde7bf",
    mtnBack: "#b7a0b8",
    mtnFront: "#a79a9c",
    fieldTop: "#e8c99a",
    fieldBot: "#a7a466",
    canopy1: "#e98fa8",
    canopy2: "#f5b3c5",
    canopy3: "#fcd6df",
    sun: "#fff3dc",
  },
};

// Canopy made of overlapping soft blobs
const Canopy: React.FC<{ cx: number; cy: number; r: number; v: Variant; sway: number }> = ({ cx, cy, r, v, sway }) => {
  const p = PALETTE[v];
  const blobs = new Array(26).fill(0).map((_, i) => {
    const a = rand(`ca${i}`) * Math.PI * 2;
    const d = Math.sqrt(rand(`cd${i}`)) * r;
    return {
      x: cx + Math.cos(a) * d * 1.25,
      y: cy + Math.sin(a) * d * 0.75,
      rr: r * (0.25 + rand(`cr${i}`) * 0.25),
      c: [p.canopy1, p.canopy2, p.canopy3][i % 3],
    };
  });
  return (
    <g style={{ translate: `${sway}px 0px` }}>
      {blobs
        .sort((a, b) => (a.c === p.canopy3 ? 1 : 0) - (b.c === p.canopy3 ? 1 : 0))
        .map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y} r={b.rr} fill={b.c} opacity={0.95} />
        ))}
    </g>
  );
};

export const BookLandscape: React.FC<{ variant?: Variant; sunPower?: number }> = ({ variant = "day", sunPower = 1 }) => {
  const frame = useCurrentFrame();
  const p = PALETTE[variant];
  const sway = Math.sin(frame * 0.03) * 6;
  const HZ = 520; // horizon

  return (
    <g>
      <defs>
        <linearGradient id={`sky-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.skyTop} />
          <stop offset="55%" stopColor={p.skyMid} />
          <stop offset="100%" stopColor={p.skyLow} />
        </linearGradient>
        <linearGradient id={`field-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.fieldTop} />
          <stop offset="100%" stopColor={p.fieldBot} />
        </linearGradient>
        <radialGradient id={`sun-${variant}`}>
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="18%" stopColor={p.sun} />
          <stop offset="55%" stopColor={p.sun} stopOpacity={0.35} />
          <stop offset="100%" stopColor={p.sun} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="pathG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff6d8" />
          <stop offset="100%" stopColor="#e6cf9c" />
        </linearGradient>
        <linearGradient id="pageL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d9c49a" />
          <stop offset="85%" stopColor="#f7ecd2" />
          <stop offset="100%" stopColor="#cdb688" />
        </linearGradient>
        <linearGradient id="pageR" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#d9c49a" />
          <stop offset="85%" stopColor="#f7ecd2" />
          <stop offset="100%" stopColor="#cdb688" />
        </linearGradient>
      </defs>

      <rect width="1920" height="1080" fill={`url(#sky-${variant})`} />
      {/* clouds */}
      {[
        [300, 170, 1],
        [1500, 130, 1.2],
        [1150, 240, 0.7],
      ].map(([x, y, k], i) => (
        <g key={i} opacity={0.55} style={{ translate: `${((frame * 0.15 * (i + 1)) % 400) - 100}px 0px` }}>
          <ellipse cx={x} cy={y} rx={120 * k} ry={26 * k} fill="#fff" />
          <ellipse cx={x + 60 * k} cy={y - 16 * k} rx={70 * k} ry={30 * k} fill="#fff" />
        </g>
      ))}

      {/* sun */}
      <circle cx={960} cy={440} r={420 * sunPower} fill={`url(#sun-${variant})`} />
      <SunRays cx={960} cy={440} opacity={0.3 * sunPower} length={1500} />

      {/* mountains */}
      <path d={`M 0 ${HZ - 120} Q 200 ${HZ - 230} 420 ${HZ - 140} T 820 ${HZ - 110} T 1260 ${HZ - 190} T 1640 ${HZ - 120} T 1920 ${HZ - 170} L 1920 ${HZ} L 0 ${HZ} Z`} fill={p.mtnBack} opacity={0.75} />
      <path d={`M 0 ${HZ - 50} Q 260 ${HZ - 120} 560 ${HZ - 60} T 1100 ${HZ - 40} T 1560 ${HZ - 90} T 1920 ${HZ - 50} L 1920 ${HZ} L 0 ${HZ} Z`} fill={p.mtnFront} opacity={0.85} />
      {/* haze over mountains */}
      <rect y={HZ - 240} width="1920" height="240" fill={p.skyLow} opacity={0.3} />

      {/* fields */}
      <rect y={HZ} width="1920" height={1080 - HZ} fill={`url(#field-${variant})`} />
      <g stroke="#ffffff" strokeWidth={2} opacity={0.18}>
        {new Array(9).fill(0).map((_, i) => {
          const y = HZ + Math.pow(i / 9, 1.8) * 420 + 6;
          return <line key={i} x1={0} y1={y} x2={1920} y2={y} />;
        })}
        {[-1400, -700, -200, 300, 1600, 2100, 2600, 3300].map((x) => (
          <line key={x} x1={960} y1={HZ} x2={x} y2={1080} />
        ))}
      </g>

      {/* distant school + village */}
      <g opacity={0.85}>
        <rect x={1240} y={HZ - 44} width={280} height={44} fill="#f1e2c2" />
        <rect x={1236} y={HZ - 50} width={288} height={8} fill="#c58a5e" />
        <g fill="#b99d79">
          {new Array(8).fill(0).map((_, i) => (
            <rect key={i} x={1250 + i * 34} y={HZ - 36} width={18} height={12} />
          ))}
        </g>
        {[560, 640, 1600, 1700].map((x, i) => (
          <g key={x}>
            <rect x={x} y={HZ - 22} width={50} height={22} fill="#eadcc0" />
            <path d={`M ${x - 6} ${HZ - 22} L ${x + 25} ${HZ - 40 - (i % 2) * 6} L ${x + 56} ${HZ - 22} Z`} fill="#b2654a" />
          </g>
        ))}
      </g>

      {/* path from the book to the sun */}
      <path d={`M 948 ${HZ} L 972 ${HZ} Q 1060 700 1330 940 L 590 940 Q 860 700 948 ${HZ} Z`} fill="url(#pathG)" />
      <path d={`M 948 ${HZ} L 972 ${HZ} Q 1060 700 1330 940 L 590 940 Q 860 700 948 ${HZ} Z`} fill="#fff" opacity={0.25 + 0.1 * Math.sin(frame * 0.05)} style={{ mixBlendMode: "screen" }} />

      {/* grass tufts */}
      <g fill={p.fieldBot}>
        {new Array(40).fill(0).map((_, i) => {
          const x = rand(`gx${i}`) * 1920;
          const y = 700 + rand(`gy${i}`) * 200;
          if (x > 620 && x < 1300) return null;
          const h = 10 + rand(`gh${i}`) * 18;
          return <path key={i} d={`M ${x - 6} ${y} Q ${x + sway * 0.3} ${y - h} ${x + 6} ${y} Z`} opacity={0.6} />;
        })}
      </g>

      {/* big tree */}
      <path d="M 300 930 Q 330 700 300 560 Q 290 460 250 380 L 285 380 Q 330 470 345 540 Q 380 450 470 400 L 480 420 Q 380 500 372 620 Q 368 780 400 930 Z" fill="#6b4a33" />
      <path d="M 320 900 Q 340 720 322 580" stroke="#8a6448" strokeWidth={8} fill="none" opacity={0.6} />
      <Canopy cx={330} cy={290} r={270} v={variant} sway={sway} />
      <Canopy cx={40} cy={380} r={170} v={variant} sway={sway * 0.8} />

      {/* open book */}
      <path d="M 120 1080 L 180 900 Q 560 860 955 925 L 955 1080 Z" fill="url(#pageL)" />
      <path d="M 1800 1080 L 1740 900 Q 1360 860 965 925 L 965 1080 Z" fill="url(#pageR)" />
      <g stroke="#b69a6c" strokeWidth={1.5} fill="none" opacity={0.6}>
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M ${175 - i * 10} ${915 + i * 14} Q 560 ${876 + i * 14} 955 ${940 + i * 14}`} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M ${1745 + i * 10} ${915 + i * 14} Q 1360 ${876 + i * 14} 965 ${940 + i * 14}`} />
        ))}
      </g>
      <path d="M 955 925 L 960 1080 L 965 925 Z" fill="#9c7f55" />
      <path d="M 100 1080 L 165 895 L 180 900 L 120 1080 Z" fill="#7a5a3a" />
      <path d="M 1820 1080 L 1755 895 L 1740 900 L 1800 1080 Z" fill="#7a5a3a" />
      {/* the path rises out of the pages */}
      <path d="M 620 940 Q 800 930 960 960 Q 1120 930 1300 940 L 1330 940 L 590 940 Z" fill="url(#pathG)" opacity={0.9} />

      <Motes n={45} seed={`bl${variant}`} area={[0, 250, 1920, 700]} rise={0.35} size={3.2} />
    </g>
  );
};
