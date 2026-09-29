import React from "react";

const OUT = "#2a2330";
const SW = 3.5;
const SKIN = "#f3cfb0";
const HAIR = "#3a2a22";
const BLAZER = "#9b7b72";
const BLAZER_D = "#7f625b";
const TEE = "#3f4436";
const TROUSER = "#2d2f38";

// [cx, cy, r] curls forming the curly hairdo (head centre is 0,-274)
const CURLS: [number, number, number][] = [
  [-31, -280, 10],
  [-29, -297, 11],
  [-18, -311, 12],
  [-2, -318, 12],
  [14, -316, 12],
  [27, -304, 11],
  [33, -288, 10],
  [-10, -302, 12],
  [8, -305, 12],
  [21, -295, 10],
  [-15, -296, 8],
  [1, -297, 8],
  [16, -294, 7],
];

// Mayor, drawn in the same flat outline style as the citizens.
// Swept dark-brown hair, round glasses, mauve-brown blazer over a dark olive tee, black watch, handheld mic.
export const Mayor: React.FC<{
  x: number;
  y: number;
  s?: number;
  armL?: number; // 0 = down, 90 = out
  armR?: number;
  micHand?: "L" | "R" | "none";
  mouthOpen?: boolean;
  bob?: number;
  opacity?: number;
}> = ({ x, y, s = 1, armL = 12, armR = 40, micHand = "R", mouthOpen = false, bob = 0, opacity = 1 }) => {
  const sy = -226;
  const arm = (side: -1 | 1, angle: number) => {
    const r = (angle * Math.PI) / 180;
    const sx = side * 40;
    const upper = 56;
    const lower = 52;
    // slight elbow bend for natural pose
    const ex1 = sx + side * Math.sin(r) * upper;
    const ey1 = sy + Math.cos(r) * upper;
    const r2 = r + side * 0.35 * (angle > 60 ? -1 : 1) * side;
    const ex2 = ex1 + side * Math.sin(r2) * lower;
    const ey2 = ey1 + Math.cos(r2) * lower;
    return { sx, ex1, ey1, ex2, ey2 };
  };
  const L = arm(-1, armL);
  const R = arm(1, armR);

  const Sleeve: React.FC<{ a: ReturnType<typeof arm> }> = ({ a }) => (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <polyline points={`${a.sx},${sy} ${a.ex1},${a.ey1} ${a.ex2},${a.ey2}`} stroke={OUT} strokeWidth={30} />
      <polyline points={`${a.sx},${sy} ${a.ex1},${a.ey1} ${a.ex2},${a.ey2}`} stroke={BLAZER} strokeWidth={23} />
    </g>
  );
  const Mic: React.FC<{ hx: number; hy: number }> = ({ hx, hy }) => (
    <g transform={`translate(${hx} ${hy}) rotate(-12)`}>
      <path d="M -6 -6 L 6 -6 L 4 40 L -4 40 Z" fill="#1f2128" stroke={OUT} strokeWidth={2} />
      <circle cx={0} cy={-16} r={12} fill="#aab1bd" stroke={OUT} strokeWidth={2.8} />
      <circle cx={-3} cy={-20} r={3} fill="#fff" opacity={0.7} />
    </g>
  );

  return (
    <g transform={`translate(${x} ${y - bob}) scale(${s})`} opacity={opacity}>
      <ellipse cx={0} cy={2} rx={56} ry={8} fill="#000" opacity={0.18} />
      {/* legs */}
      {[-1, 1].map((side) => (
        <g key={side}>
          <rect x={side * 18 - 14} y={-122} width={28} height={118} rx={8} fill={TROUSER} stroke={OUT} strokeWidth={SW} />
          <ellipse cx={side * 22} cy={-3} rx={20} ry={8} fill="#1a1a20" stroke={OUT} strokeWidth={2.5} />
        </g>
      ))}
      {/* back arm */}
      <Sleeve a={L} />
      <circle cx={L.ex2} cy={L.ey2} r={11} fill={SKIN} stroke={OUT} strokeWidth={2.8} />
      <rect x={L.ex2 - 11} y={L.ey2 - 20} width={22} height={9} rx={3} fill="#15151a" />
      {micHand === "L" && <Mic hx={L.ex2} hy={L.ey2} />}
      {/* torso: tee + blazer */}
      <rect x={-44} y={-236} width={88} height={122} rx={16} fill={BLAZER} stroke={OUT} strokeWidth={SW} />
      <path d="M -16 -236 L 16 -236 L 12 -120 L -12 -120 Z" fill={TEE} />
      <path d="M -18 -236 L -4 -196 L -24 -170 L -30 -230 Z" fill={BLAZER_D} stroke={OUT} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M 18 -236 L 4 -196 L 24 -170 L 30 -230 Z" fill={BLAZER_D} stroke={OUT} strokeWidth={2.5} strokeLinejoin="round" />
      <circle cx={-22} cy={-148} r={3} fill={OUT} />
      {/* neck + head */}
      <rect x={-10} y={-250} width={20} height={18} fill={SKIN} stroke={OUT} strokeWidth={2.5} />
      <ellipse cx={-31} cy={-270} rx={7} ry={10} fill={SKIN} stroke={OUT} strokeWidth={2.5} />
      <ellipse cx={31} cy={-270} rx={7} ry={10} fill={SKIN} stroke={OUT} strokeWidth={2.5} />
      <ellipse cx={0} cy={-274} rx={30} ry={36} fill={SKIN} stroke={OUT} strokeWidth={SW} />
      {/* curly hair: clustered curls with volume, a few falling on the forehead */}
      <g>
        {/* outline pass */}
        {CURLS.map(([cx, cy, r], i) => (
          <circle key={`o${i}`} cx={cx} cy={cy} r={r + SW / 2 + 0.5} fill={OUT} />
        ))}
        {CURLS.map(([cx, cy, r], i) => (
          <circle key={`f${i}`} cx={cx} cy={cy} r={r} fill={HAIR} />
        ))}
        {/* curl swirls */}
        <g stroke="#6a4c3e" strokeWidth={2.6} fill="none" strokeLinecap="round">
          {CURLS.filter((_, i) => i % 2 === 0).map(([cx, cy, r], i) => (
            <path key={`s${i}`} d={`M ${cx - r * 0.45} ${cy + r * 0.1} A ${r * 0.45} ${r * 0.45} 0 1 1 ${cx + r * 0.2} ${cy + r * 0.35}`} />
          ))}
        </g>
      </g>
      {/* brows, glasses, eyes, mouth */}
      <path d="M -22 -286 L -8 -288 M 8 -288 L 22 -286" stroke={HAIR} strokeWidth={3.5} strokeLinecap="round" />
      <g stroke="#3b302c" strokeWidth={2.6} fill="none">
        <circle cx={-13} cy={-272} r={11} />
        <circle cx={13} cy={-272} r={11} />
        <path d="M -2 -273 Q 0 -276 2 -273" />
      </g>
      <circle cx={-13} cy={-272} r={3.2} fill={OUT} />
      <circle cx={13} cy={-272} r={3.2} fill={OUT} />
      {mouthOpen ? (
        <ellipse cx={0} cy={-252} rx={6} ry={4.5} fill="#8a3b3b" stroke={OUT} strokeWidth={2} />
      ) : (
        <path d="M -7 -254 Q 0 -249 7 -254" stroke={OUT} strokeWidth={2.6} fill="none" strokeLinecap="round" />
      )}
      {/* front arm */}
      <Sleeve a={R} />
      {micHand === "R" && <Mic hx={R.ex2} hy={R.ey2} />}
      <circle cx={R.ex2} cy={R.ey2} r={11} fill={SKIN} stroke={OUT} strokeWidth={2.8} />
    </g>
  );
};
