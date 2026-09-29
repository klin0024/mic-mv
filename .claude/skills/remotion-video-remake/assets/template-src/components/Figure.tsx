import React from "react";

export type Hair = "bun" | "short" | "long" | "pony" | "spiky";

export type FigureProps = {
  x: number;
  y: number; // feet baseline
  s?: number; // 1 = adult ~100px tall
  kid?: boolean;
  color?: string; // clothing
  pants?: string;
  hair?: Hair;
  dress?: boolean;
  glasses?: boolean;
  armL?: number; // degrees, 0 = down, 90 = horizontal out, 170 = up
  armR?: number;
  walk?: number; // walk phase in frames (undefined = standing)
  bag?: string;
  opacity?: number;
  bob?: number;
  lean?: number; // degrees
  glow?: number; // 0..1 warm rim glow
  children?: React.ReactNode; // extra props drawn in figure space
};

const INK = "#2b2522";
const SKIN = "#f7d9bd";

const Arm: React.FC<{ side: -1 | 1; angle: number; color: string }> = ({ side, angle, color }) => {
  const rad = (angle * Math.PI) / 180;
  const sx = side * 9;
  const sy = -64;
  const len = 26;
  const ex = sx + side * Math.sin(rad) * len;
  const ey = sy + Math.cos(rad) * len;
  return (
    <g>
      <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={color} strokeWidth={5} strokeLinecap="round" />
      <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={INK} strokeWidth={1.2} strokeLinecap="round" opacity={0.35} />
      <circle cx={ex} cy={ey} r={3} fill={SKIN} stroke={INK} strokeWidth={1} />
    </g>
  );
};

const HairShape: React.FC<{ hair: Hair }> = ({ hair }) => {
  switch (hair) {
    case "bun":
      return (
        <g fill="#1d1a19">
          <circle cx={0} cy={-97} r={6} />
          <path d="M -11.5 -82 Q -12 -95 0 -95 Q 12 -95 11.5 -82 Q 6 -89 0 -88 Q -6 -89 -11.5 -82 Z" />
        </g>
      );
    case "long":
      return (
        <path
          fill="#1d1a19"
          d="M -12 -80 Q -13 -96 0 -96 Q 13 -96 12 -80 L 13 -68 Q 9 -70 9 -80 Q 4 -88 -9 -84 L -9 -70 Q -13 -70 -12 -68 Z"
        />
      );
    case "pony":
      return (
        <g fill="#1d1a19">
          <path d="M -11.5 -82 Q -12 -95 0 -95 Q 12 -95 11.5 -82 Q 4 -90 -11.5 -82 Z" />
          <circle cx={-12} cy={-88} r={4} />
          <circle cx={12} cy={-88} r={4} />
        </g>
      );
    case "spiky":
      return (
        <path
          fill="#1d1a19"
          d="M -11.5 -83 L -12 -90 L -8 -93 L -4 -97 L 1 -94 L 6 -97 L 9 -92 L 12 -89 L 11.5 -83 Q 3 -88 -11.5 -83 Z"
        />
      );
    default:
      return <path fill="#1d1a19" d="M -11.5 -82 Q -12 -95 0 -95 Q 12 -95 11.5 -82 Q 2 -89 -11.5 -82 Z" />;
  }
};

export const Figure: React.FC<FigureProps> = ({
  x,
  y,
  s = 1,
  kid = false,
  color = "#f2a7b8",
  pants = "#3d4a6b",
  hair = "short",
  dress = false,
  glasses = false,
  armL = 8,
  armR = 8,
  walk,
  bag,
  opacity = 1,
  bob = 0,
  lean = 0,
  glow = 0,
  children,
}) => {
  const scale = s * (kid ? 0.68 : 1);
  const swing = walk === undefined ? 0 : Math.sin(walk * 0.35) * 16;
  const step = walk === undefined ? 0 : Math.abs(Math.sin(walk * 0.35)) * 2;
  const legL = (-swing * Math.PI) / 180;
  const legR = (swing * Math.PI) / 180;
  const legLen = 36;
  const bodyTop = -70;
  const bodyBottom = -34;

  return (
    <g
      transform={`translate(${x} ${y - (step + bob) * scale}) scale(${scale}) rotate(${lean} 0 -40)`}
      opacity={opacity}
    >
      {/* soft ground shadow */}
      <ellipse cx={0} cy={1} rx={14} ry={3} fill="#000" opacity={0.18} />
      {glow > 0 && <ellipse cx={0} cy={-50} rx={34} ry={60} fill="url(#figGlow)" opacity={glow} />}
      {/* legs */}
      <g stroke={INK} strokeWidth={2.4} strokeLinecap="round">
        <line x1={-4} y1={bodyBottom} x2={-4 + Math.sin(legL) * legLen} y2={bodyBottom + Math.cos(legL) * legLen} />
        <line x1={4} y1={bodyBottom} x2={4 + Math.sin(legR) * legLen} y2={bodyBottom + Math.cos(legR) * legLen} />
      </g>
      <ellipse cx={-4 + Math.sin(legL) * legLen - 1} cy={bodyBottom + Math.cos(legL) * legLen} rx={3.6} ry={2} fill={INK} />
      <ellipse cx={4 + Math.sin(legR) * legLen + 1} cy={bodyBottom + Math.cos(legR) * legLen} rx={3.6} ry={2} fill={INK} />
      {/* back arm */}
      <Arm side={-1} angle={armL + (walk === undefined ? 0 : swing * 0.6)} color={color} />
      {/* body */}
      {dress ? (
        <path
          d={`M -8 ${bodyTop} L 8 ${bodyTop} Q 11 ${bodyTop + 4} 11 ${bodyTop + 10} L 15 ${bodyBottom} L -15 ${bodyBottom} L -11 ${bodyTop + 10} Q -11 ${bodyTop + 4} -8 ${bodyTop} Z`}
          fill={color}
          stroke={INK}
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
      ) : (
        <>
          <rect x={-10} y={bodyTop} width={20} height={30} rx={4} fill={color} stroke={INK} strokeWidth={1.4} />
          <rect x={-9} y={bodyTop + 28} width={18} height={bodyBottom - bodyTop - 26} rx={2} fill={pants} stroke={INK} strokeWidth={1.2} />
        </>
      )}
      {bag && <rect x={-15} y={bodyTop + 6} width={7} height={18} rx={2.5} fill={bag} stroke={INK} strokeWidth={1} />}
      {/* front arm */}
      <Arm side={1} angle={armR - (walk === undefined ? 0 : swing * 0.6)} color={color} />
      {/* neck + head */}
      <rect x={-2.5} y={-74} width={5} height={5} fill={SKIN} />
      <circle cx={0} cy={-84} r={11.5} fill={SKIN} stroke={INK} strokeWidth={1.5} />
      <HairShape hair={hair} />
      <circle cx={-4} cy={-83} r={1.4} fill={INK} />
      <circle cx={4} cy={-83} r={1.4} fill={INK} />
      <path d="M -3.5 -78.5 Q 0 -76 3.5 -78.5" stroke={INK} strokeWidth={1.2} fill="none" strokeLinecap="round" />
      <circle cx={-7} cy={-79.5} r={2} fill="#f19a9a" opacity={0.55} />
      <circle cx={7} cy={-79.5} r={2} fill="#f19a9a" opacity={0.55} />
      {glasses && (
        <g stroke={INK} strokeWidth={1.1} fill="none">
          <circle cx={-4.2} cy={-83} r={3.4} />
          <circle cx={4.2} cy={-83} r={3.4} />
          <line x1={-0.8} y1={-83} x2={0.8} y2={-83} />
        </g>
      )}
      {children}
    </g>
  );
};

// Shared <defs> needed by Figure (glow). Include once per SVG that uses glow.
export const FigureDefs: React.FC = () => (
  <radialGradient id="figGlow">
    <stop offset="0%" stopColor="#fff6c8" stopOpacity={0.9} />
    <stop offset="100%" stopColor="#fff6c8" stopOpacity={0} />
  </radialGradient>
);
