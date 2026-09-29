import React from "react";

export type Species =
  | "elephant"
  | "beaver"
  | "tiger"
  | "penguin"
  | "deer"
  | "giraffe"
  | "turtle"
  | "bear"
  | "squirrel"
  | "cat"
  | "kangaroo";

export type Prop = "none" | "phone" | "mic" | "tea" | "plant" | "question";

export type AnimalProps = {
  x: number;
  y: number; // feet baseline
  s?: number;
  species: Species;
  shirt?: string;
  pants?: string;
  armL?: number; // 0 = down, 90 = out, 170 = up
  armR?: number;
  bob?: number;
  flip?: boolean;
  prop?: Prop;
  hat?: "none" | "cap" | "bucket" | "goggles" | "flower";
  opacity?: number;
};

const OUT = "#2a2330";
const SW = 3.5;

const FUR: Record<Species, [string, string]> = {
  elephant: ["#a9a7c4", "#c9c7df"],
  beaver: ["#8a5a44", "#c9a08a"],
  tiger: ["#f29a3a", "#fff5e6"],
  penguin: ["#353b5c", "#fff8ee"],
  deer: ["#c98f5a", "#f1d3b0"],
  giraffe: ["#f2c14e", "#fbe6b0"],
  turtle: ["#8bbf5a", "#c9e39a"],
  bear: ["#7a4e32", "#c69a74"],
  squirrel: ["#d18a4a", "#f6d6ae"],
  cat: ["#d9a15a", "#fff2dc"],
  kangaroo: ["#c9955f", "#efd2ae"],
};

const Eyes: React.FC<{ y?: number; dx?: number }> = ({ y = -188, dx = 14 }) => (
  <g>
    {[-dx, dx].map((x) => (
      <g key={x}>
        <circle cx={x} cy={y} r={4.6} fill={OUT} />
        <circle cx={x + 1.4} cy={y - 1.6} r={1.5} fill="#fff" />
      </g>
    ))}
  </g>
);

const Smile: React.FC<{ y?: number }> = ({ y = -158 }) => (
  <path d={`M -7 ${y} Q 0 ${y + 6} 7 ${y}`} stroke={OUT} strokeWidth={2.6} fill="none" strokeLinecap="round" />
);

const Head: React.FC<{ sp: Species; hat: AnimalProps["hat"] }> = ({ sp, hat }) => {
  const [f, l] = FUR[sp];
  const o = { stroke: OUT, strokeWidth: SW, strokeLinejoin: "round" as const };
  switch (sp) {
    case "elephant":
      return (
        <g>
          <ellipse cx={-50} cy={-184} rx={34} ry={44} fill={f} {...o} />
          <ellipse cx={-50} cy={-184} rx={20} ry={30} fill={l} />
          <ellipse cx={50} cy={-184} rx={34} ry={44} fill={f} {...o} />
          <ellipse cx={50} cy={-184} rx={20} ry={30} fill={l} />
          <ellipse cx={0} cy={-186} rx={42} ry={40} fill={f} {...o} />
          <path d="M 0 -172 Q -4 -140 10 -122 Q 16 -116 22 -122" stroke={OUT} strokeWidth={22} fill="none" strokeLinecap="round" />
          <path d="M 0 -172 Q -4 -140 10 -122 Q 16 -116 22 -122" stroke={f} strokeWidth={15} fill="none" strokeLinecap="round" />
          <Eyes y={-192} dx={16} />
          {hat === "flower" && (
            <g transform="translate(40 -214)">
              {[0, 72, 144, 216, 288].map((a) => (
                <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 8} cy={Math.sin((a * Math.PI) / 180) * 8} r={7} fill="#f47b6a" stroke={OUT} strokeWidth={2} />
              ))}
              <circle r={5} fill="#ffd54f" stroke={OUT} strokeWidth={2} />
            </g>
          )}
        </g>
      );
    case "beaver":
    case "bear":
      return (
        <g>
          <circle cx={-30} cy={-214} r={11} fill={f} {...o} />
          <circle cx={30} cy={-214} r={11} fill={f} {...o} />
          <ellipse cx={0} cy={-184} rx={42} ry={38} fill={f} {...o} />
          <ellipse cx={0} cy={-166} rx={22} ry={15} fill={l} {...o} />
          <ellipse cx={0} cy={-175} rx={7} ry={5} fill={OUT} />
          {sp === "beaver" ? (
            <g>
              <rect x={-7} y={-163} width={14} height={11} rx={2} fill="#fff" stroke={OUT} strokeWidth={2.2} />
              <line x1={0} y1={-163} x2={0} y2={-152} stroke={OUT} strokeWidth={2} />
            </g>
          ) : (
            <Smile y={-163} />
          )}
          <Eyes y={-192} />
        </g>
      );
    case "tiger":
    case "cat":
      return (
        <g>
          <path d="M -38 -200 L -30 -232 L -12 -214 Z" fill={f} {...o} />
          <path d="M 38 -200 L 30 -232 L 12 -214 Z" fill={f} {...o} />
          <ellipse cx={0} cy={-184} rx={42} ry={36} fill={f} {...o} />
          <ellipse cx={0} cy={-166} rx={24} ry={15} fill={l} />
          {sp === "tiger" ? (
            <g stroke={OUT} strokeWidth={3.5} strokeLinecap="round" fill="none">
              <path d="M -8 -218 L -4 -204 M 8 -218 L 4 -204 M 0 -220 L 0 -208" />
              <path d="M -42 -186 L -28 -182 M -42 -176 L -30 -174 M 42 -186 L 28 -182 M 42 -176 L 30 -174" />
            </g>
          ) : (
            <g>
              <path d="M -10 -218 L -8 -200 M 10 -218 L 8 -200" stroke="#fff" strokeWidth={4} strokeLinecap="round" />
              {[-30, -24, 26, 32].map((x, i) => (
                <circle key={i} cx={x} cy={-180 + (i % 2) * 10} r={3} fill={OUT} opacity={0.7} />
              ))}
            </g>
          )}
          <path d="M -5 -174 L 5 -174 L 0 -168 Z" fill="#e7788a" />
          <Smile y={-163} />
          <Eyes y={-190} />
        </g>
      );
    case "penguin":
      return (
        <g>
          <ellipse cx={0} cy={-184} rx={36} ry={38} fill={f} {...o} />
          <ellipse cx={0} cy={-176} rx={24} ry={24} fill={l} />
          <path d="M -8 -176 L 8 -176 L 0 -162 Z" fill="#f59a2f" stroke={OUT} strokeWidth={2.4} strokeLinejoin="round" />
          <Eyes y={-188} dx={12} />
        </g>
      );
    case "deer":
    case "kangaroo":
      return (
        <g>
          {sp === "deer" && (
            <g stroke="#7a4e32" strokeWidth={5} strokeLinecap="round" fill="none">
              <path d="M -16 -214 L -26 -246 M -22 -234 L -36 -240" />
              <path d="M 16 -214 L 26 -246 M 22 -234 L 36 -240" />
            </g>
          )}
          <ellipse
            cx={-30}
            cy={sp === "deer" ? -204 : -222}
            rx={sp === "deer" ? 18 : 10}
            ry={sp === "deer" ? 9 : 26}
            transform={`rotate(${sp === "deer" ? -25 : -10} -30 ${sp === "deer" ? -204 : -222})`}
            fill={f}
            {...o}
          />
          <ellipse
            cx={30}
            cy={sp === "deer" ? -204 : -222}
            rx={sp === "deer" ? 18 : 10}
            ry={sp === "deer" ? 9 : 26}
            transform={`rotate(${sp === "deer" ? 25 : 10} 30 ${sp === "deer" ? -204 : -222})`}
            fill={f}
            {...o}
          />
          <ellipse cx={0} cy={-186} rx={30} ry={36} fill={f} {...o} />
          <ellipse cx={0} cy={-162} rx={18} ry={14} fill={l} {...o} />
          <ellipse cx={0} cy={-166} rx={6} ry={4} fill={OUT} />
          <Eyes y={-192} dx={12} />
        </g>
      );
    case "giraffe":
      return (
        <g>
          <rect x={-12} y={-232} width={24} height={88} fill={f} stroke={OUT} strokeWidth={SW} />
          {[-212, -186, -160].map((y, i) => (
            <circle key={y} cx={i % 2 ? 5 : -4} cy={y} r={5} fill="#c9853a" />
          ))}
          <g stroke={OUT} strokeWidth={4} strokeLinecap="round">
            <line x1={-9} y1={-266} x2={-12} y2={-284} />
            <line x1={9} y1={-266} x2={12} y2={-284} />
          </g>
          <circle cx={-12} cy={-286} r={5} fill="#c9853a" stroke={OUT} strokeWidth={2.5} />
          <circle cx={12} cy={-286} r={5} fill="#c9853a" stroke={OUT} strokeWidth={2.5} />
          <ellipse cx={0} cy={-244} rx={26} ry={30} fill={f} {...o} />
          <ellipse cx={0} cy={-226} rx={17} ry={12} fill={l} {...o} />
          <Eyes y={-250} dx={11} />
        </g>
      );
    case "turtle":
      return (
        <g>
          <ellipse cx={0} cy={-184} rx={32} ry={34} fill={f} {...o} />
          <Smile y={-166} />
          <Eyes y={-190} dx={12} />
        </g>
      );
    case "squirrel":
      return (
        <g>
          <path d="M -30 -204 L -26 -234 L -10 -214 Z" fill={f} {...o} />
          <path d="M 30 -204 L 26 -234 L 10 -214 Z" fill={f} {...o} />
          <ellipse cx={0} cy={-184} rx={34} ry={34} fill={f} {...o} />
          <ellipse cx={0} cy={-168} rx={20} ry={13} fill={l} />
          <ellipse cx={0} cy={-174} rx={5} ry={3.5} fill={OUT} />
          <Smile y={-164} />
          <Eyes y={-190} dx={12} />
        </g>
      );
  }
};

const HatLayer: React.FC<{ hat: AnimalProps["hat"]; sp: Species }> = ({ hat, sp }) => {
  const top = sp === "giraffe" ? -270 : -218;
  if (hat === "cap")
    return (
      <g>
        <path d={`M -34 ${top + 4} Q 0 ${top - 34} 34 ${top + 4} Z`} fill="#3f6fd1" stroke={OUT} strokeWidth={SW} />
        <path d={`M 20 ${top + 2} L 54 ${top + 8} L 30 ${top + 8} Z`} fill="#3f6fd1" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
      </g>
    );
  if (hat === "bucket")
    return (
      <g>
        <path d={`M -48 ${top + 6} L 48 ${top + 6} L 30 ${top - 12} L -30 ${top - 12} Z`} fill="#e6c36a" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
        <path d={`M -26 ${top - 12} Q 0 ${top - 40} 26 ${top - 12} Z`} fill="#e6c36a" stroke={OUT} strokeWidth={SW} />
      </g>
    );
  if (hat === "goggles")
    return (
      <g>
        <rect x={-38} y={-200} width={76} height={24} rx={12} fill="#dff1fb" stroke={OUT} strokeWidth={SW} />
        <line x1={0} y1={-200} x2={0} y2={-176} stroke={OUT} strokeWidth={2.5} />
      </g>
    );
  return null;
};

const PropAtPaw: React.FC<{ prop: Prop; x: number; y: number }> = ({ prop, x, y }) => {
  switch (prop) {
    case "phone":
      return <rect x={x - 7} y={y - 30} width={14} height={26} rx={3} fill={OUT} />;
    case "mic":
      return (
        <g transform={`translate(${x} ${y})`}>
          <path d="M -5 -8 L 5 -8 L 3 26 L -3 26 Z" fill="#23262e" />
          <circle cx={0} cy={-16} r={10} fill="#aab1bd" stroke={OUT} strokeWidth={2.5} />
        </g>
      );
    case "tea":
      return (
        <g transform={`translate(${x} ${y})`}>
          <path d="M -9 -26 L 9 -26 L 7 4 L -7 4 Z" fill="#f3d2a0" stroke={OUT} strokeWidth={2.5} />
          <line x1={3} y1={-26} x2={6} y2={-40} stroke="#e7788a" strokeWidth={3} />
          {[-4, 0, 4].map((c) => (
            <circle key={c} cx={c} cy={-2} r={2.2} fill="#3a2a20" />
          ))}
        </g>
      );
    case "plant":
      return (
        <g transform={`translate(${x} ${y})`}>
          <path d="M -12 -6 L 12 -6 L 9 14 L -9 14 Z" fill="#c8693a" stroke={OUT} strokeWidth={2.5} />
          <path d="M 0 -6 Q -14 -26 -4 -34 M 0 -6 Q 12 -24 6 -34" stroke="#4f8f3a" strokeWidth={5} fill="none" strokeLinecap="round" />
        </g>
      );
    default:
      return null;
  }
};

export const Animal: React.FC<AnimalProps> = ({
  x,
  y,
  s = 1,
  species,
  shirt = "#e57373",
  pants = "#3d4a6b",
  armL = 10,
  armR = 10,
  bob = 0,
  flip = false,
  prop = "none",
  hat = "none",
  opacity = 1,
}) => {
  const [fur, light] = FUR[species];
  const wide = species === "bear" || species === "beaver" || species === "elephant" || species === "turtle";
  const W = wide ? 84 : 66;
  const sy = -128;

  const arm = (side: -1 | 1, angle: number) => {
    const r = (angle * Math.PI) / 180;
    const sx = side * (W / 2 - 4);
    const len = 58;
    const ex = sx + side * Math.sin(r) * len;
    const ey = sy + Math.cos(r) * len;
    return { sx, ex, ey };
  };
  const L = arm(-1, armL);
  const R = arm(1, armR);

  return (
    <g transform={`translate(${x} ${y - bob}) scale(${flip ? -s : s} ${s})`} opacity={opacity}>
      <ellipse cx={0} cy={2} rx={W * 0.6} ry={7} fill="#000" opacity={0.18} />
      {/* tails / shells behind body */}
      {species === "beaver" && (
        <g>
          <ellipse cx={44} cy={-22} rx={44} ry={16} fill="#6d4332" stroke={OUT} strokeWidth={SW} transform="rotate(-12 44 -22)" />
          <path d="M 18 -26 L 70 -28 M 26 -16 L 66 -20" stroke="#4e2f22" strokeWidth={2} />
        </g>
      )}
      {species === "squirrel" && (
        <path d="M 22 -60 Q 90 -80 76 -170 Q 66 -214 30 -196 Q 58 -170 44 -130 Q 36 -96 22 -90 Z" fill={fur} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
      )}
      {(species === "tiger" || species === "cat") && (
        <path d="M 26 -60 Q 70 -60 76 -110" stroke={OUT} strokeWidth={17} fill="none" strokeLinecap="round" />
      )}
      {(species === "tiger" || species === "cat") && (
        <path d="M 26 -60 Q 70 -60 76 -110" stroke={fur} strokeWidth={10} fill="none" strokeLinecap="round" />
      )}
      {species === "kangaroo" && (
        <path d="M 20 -40 Q 70 -30 96 4 L 80 8 Q 56 -16 20 -24 Z" fill={fur} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
      )}
      {species === "turtle" && (
        <g>
          <ellipse cx={-6} cy={-100} rx={64} ry={60} fill="#5f8f3e" stroke={OUT} strokeWidth={SW} />
          <path d="M -60 -120 L -40 -150 M -64 -86 L -44 -60 M -66 -104 L -52 -104" stroke="#3f6a28" strokeWidth={3} strokeLinecap="round" />
        </g>
      )}

      {/* legs */}
      {[-1, 1].map((side) => (
        <g key={side}>
          <rect x={side * 16 - 12} y={-64} width={24} height={60} rx={8} fill={pants} stroke={OUT} strokeWidth={SW} />
          <ellipse cx={side * 16 + side * 4} cy={-2} rx={17} ry={8} fill={species === "penguin" ? "#f59a2f" : "#3a3440"} stroke={OUT} strokeWidth={2.5} />
        </g>
      ))}
      {/* back arm */}
      <line x1={L.sx} y1={sy} x2={L.ex} y2={L.ey} stroke={OUT} strokeWidth={22} strokeLinecap="round" />
      <line x1={L.sx} y1={sy} x2={L.ex} y2={L.ey} stroke={shirt} strokeWidth={15} strokeLinecap="round" />
      <circle cx={L.ex} cy={L.ey} r={10} fill={fur} stroke={OUT} strokeWidth={2.8} />
      {/* torso */}
      <rect x={-W / 2} y={-146} width={W} height={92} rx={20} fill={species === "penguin" ? fur : shirt} stroke={OUT} strokeWidth={SW} />
      {species === "penguin" && <ellipse cx={0} cy={-100} rx={W / 2 - 10} ry={38} fill={light} />}
      {species === "penguin" && <path d={`M ${-W / 2 + 4} -76 L ${W / 2 - 4} -76 L ${W / 2 + 6} -54 L ${-W / 2 - 6} -54 Z`} fill={shirt} stroke={OUT} strokeWidth={SW} />}
      <path d={`M -10 -146 L 0 -130 L 10 -146`} stroke={OUT} strokeWidth={2.5} fill="none" opacity={0.5} />
      {/* head */}
      <Head sp={species} hat={hat} />
      <HatLayer hat={hat} sp={species} />
      {/* front arm */}
      <line x1={R.sx} y1={sy} x2={R.ex} y2={R.ey} stroke={OUT} strokeWidth={22} strokeLinecap="round" />
      <line x1={R.sx} y1={sy} x2={R.ex} y2={R.ey} stroke={shirt} strokeWidth={15} strokeLinecap="round" />
      <PropAtPaw prop={prop} x={R.ex} y={R.ey} />
      <circle cx={R.ex} cy={R.ey} r={10} fill={fur} stroke={OUT} strokeWidth={2.8} />
    </g>
  );
};

// A varied line-up of citizens
export const CAST: Omit<AnimalProps, "x" | "y">[] = [
  { species: "cat", shirt: "#6f7d4a", pants: "#5b6440", hat: "bucket" },
  { species: "bear", shirt: "#f59a2f", pants: "#f59a2f", hat: "goggles" },
  { species: "elephant", shirt: "#e8b64c", pants: "#8a8fb3", hat: "flower" },
  { species: "beaver", shirt: "#9b4a3c", pants: "#5b3a30" },
  { species: "kangaroo", shirt: "#2b2d3a", pants: "#d58ad8", prop: "tea" },
  { species: "penguin", shirt: "#d9899a", pants: "#353b5c" },
  { species: "tiger", shirt: "#f3e07a", pants: "#8a6a4a", prop: "plant" },
  { species: "turtle", shirt: "#e9a23b", pants: "#6b6f45" },
  { species: "deer", shirt: "#f4f4f4", pants: "#b8bcc6", hat: "cap" },
  { species: "squirrel", shirt: "#fdfdfd", pants: "#c23b3b" },
  { species: "giraffe", shirt: "#f5e3c8", pants: "#c9955f" },
];
