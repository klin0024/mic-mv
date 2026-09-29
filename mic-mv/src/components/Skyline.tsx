import React from "react";
import { useCurrentFrame } from "remotion";
import { FONT_BOLD } from "./Kit";

const G = "#43a847"; // skyline fill
const GL = "#2f8a3a"; // skyline line work
const GH = "#6cc46a"; // highlights

const Tag: React.FC<{ x: number; y: number; text: string }> = ({ x, y, text }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-15} y={0} width={30} height={[...text].length * 30 + 12} fill="#f6c83b" stroke="#2a2330" strokeWidth={2.5} />
    {[...text].map((ch, i) => (
      <text key={i} x={0} y={30 + i * 30} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={900} fontSize={24} fill="#2a2330">
        {ch}
      </text>
    ))}
  </g>
);

const Cloud: React.FC<{ x: number; y: number; w: number }> = ({ x, y, w }) => (
  <path d={`M ${x - w} ${y} Q ${x - w * 0.4} ${y - w * 0.28} ${x} ${y - w * 0.2} Q ${x + w * 0.3} ${y - w * 0.42} ${x + w * 0.6} ${y - w * 0.12} Q ${x + w} ${y - w * 0.1} ${x + w * 1.2} ${y} Z`} fill="#fff" />
);

// Flat blue sky + green line-art Taipei skyline with district tags + street (after the reference art)
export const Skyline: React.FC<{ sky?: string; horizon?: number; tags?: boolean }> = ({ sky = "#3f5ad8", horizon = 640, tags = true }) => {
  const frame = useCurrentFrame();
  const H = horizon;
  const drift = (frame * 0.3) % 2400;
  return (
    <g>
      <rect width="1920" height="1080" fill={sky} />
      {[
        [220, 220, 60],
        [760, 190, 70],
        [1300, 210, 50],
        [1800, 170, 60],
        [2300, 230, 55],
      ].map(([x, y, w], i) => (
        <Cloud key={i} x={((x + drift) % 2400) - 240} y={y} w={w} />
      ))}

      {/* skyline silhouette */}
      <g>
        {/* 文山: hills + gondola */}
        <path d={`M -20 ${H} L -20 ${H - 150} Q 80 ${H - 230} 200 ${H - 170} Q 280 ${H - 130} 330 ${H - 120} L 330 ${H} Z`} fill={G} />
        <path d={`M 40 ${H - 240} L 420 ${H - 150}`} stroke={GL} strokeWidth={3} />
        {[120, 250, 360].map((gx, i) => (
          <g key={gx}>
            <line x1={gx} y1={H - 222 + i * 30} x2={gx} y2={H - 204 + i * 30} stroke={GL} strokeWidth={3} />
            <rect x={gx - 12} y={H - 204 + i * 30} width={24} height={20} rx={5} fill={GH} stroke={GL} strokeWidth={3} />
          </g>
        ))}
        <path d={`M 150 ${H - 150} L 190 ${H - 186} L 230 ${H - 150} Z M 160 ${H - 150} L 160 ${H - 110} L 220 ${H - 110} L 220 ${H - 150}`} fill={GH} stroke={GL} strokeWidth={3} />

        {/* 大安: shops with signboards */}
        <rect x={330} y={H - 170} width={420} height={170} fill={G} />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={350 + i * 80} y={H - 150} width={56} height={36} fill={GH} stroke={GL} strokeWidth={3} />
        ))}
        <rect x={520} y={H - 230} width={60} height={70} fill={G} stroke={GL} strokeWidth={3} />
        <rect x={700} y={H - 250} width={40} height={130} fill={GH} stroke={GL} strokeWidth={3} />

        {/* 信義: tower */}
        <path d={`M 860 ${H} L 870 ${H - 380} L 880 ${H - 430} L 890 ${H - 380} L 900 ${H}`} fill={G} stroke={GL} strokeWidth={3} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M 856 ${H - 60 - i * 55} L 904 ${H - 60 - i * 55} L 898 ${H - 100 - i * 55} L 862 ${H - 100 - i * 55} Z`} fill={G} stroke={GL} strokeWidth={3} />
        ))}
        <rect x={750} y={H - 190} width={320} height={190} fill={G} />

        {/* 中正: government building with central tower */}
        <rect x={1070} y={H - 170} width={360} height={170} fill={G} stroke={GL} strokeWidth={3} />
        <rect x={1220} y={H - 300} width={60} height={140} fill={G} stroke={GL} strokeWidth={3} />
        <path d={`M 1214 ${H - 300} L 1250 ${H - 340} L 1286 ${H - 300} Z`} fill={GH} stroke={GL} strokeWidth={3} />
        {new Array(8).fill(0).map((_, i) => (
          <rect key={i} x={1086 + i * 42} y={H - 130} width={18} height={50} rx={9} fill={GH} stroke={GL} strokeWidth={2.5} />
        ))}

        {/* 萬華: temple roof */}
        <rect x={1430} y={H - 150} width={260} height={150} fill={G} />
        <path d={`M 1410 ${H - 150} Q 1560 ${H - 200} 1710 ${H - 150} L 1680 ${H - 170} Q 1560 ${H - 220} 1440 ${H - 170} Z`} fill={GH} stroke={GL} strokeWidth={3} />
        <path d={`M 1470 ${H - 200} Q 1560 ${H - 250} 1650 ${H - 200} L 1630 ${H - 214} Q 1560 ${H - 262} 1490 ${H - 214} Z`} fill={GH} stroke={GL} strokeWidth={3} />
        <path d={`M 1410 ${H - 150} L 1396 ${H - 176} M 1710 ${H - 150} L 1724 ${H - 176}`} stroke={GL} strokeWidth={4} strokeLinecap="round" />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={1480 + i * 60} y={H - 120} width={36} height={60} fill={GH} stroke={GL} strokeWidth={3} />
        ))}

        {/* 大同: old arcade shophouses */}
        <rect x={1690} y={H - 200} width={260} height={200} fill={G} />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M ${1710 + i * 58} ${H - 20} L ${1710 + i * 58} ${H - 120} Q ${1734 + i * 58} ${H - 150} ${1758 + i * 58} ${H - 120} L ${1758 + i * 58} ${H - 20}`} fill={GH} stroke={GL} strokeWidth={3} />
        ))}
        {/* lanterns strung between */}
        <path d={`M 1600 ${H - 190} Q 1700 ${H - 150} 1800 ${H - 210}`} stroke={GL} strokeWidth={2} fill="none" />
        {[1630, 1680, 1730, 1780].map((lx, i) => (
          <circle key={lx} cx={lx} cy={H - 176 + (i % 2) * 8} r={7} fill={GH} stroke={GL} strokeWidth={2} />
        ))}

        {/* street lamps */}
        {[60, 1000].map((lx) => (
          <g key={lx}>
            <rect x={lx - 3} y={H - 110} width={6} height={110} fill={GL} />
            <circle cx={lx - 12} cy={H - 112} r={9} fill="#f6d33b" />
            <circle cx={lx + 12} cy={H - 112} r={9} fill="#f6d33b" />
          </g>
        ))}
      </g>

      {tags && (
        <g>
          <Tag x={96} y={H - 220} text="文山區" />
          <Tag x={610} y={H - 240} text="大安區" />
          <Tag x={1180} y={H - 260} text="中正區" />
          <Tag x={1402} y={H - 240} text="萬華區" />
          <Tag x={1860} y={H - 250} text="大同區" />
        </g>
      )}

      {/* curb + street */}
      <rect y={H} width="1920" height={1080 - H} fill="#5b6b8f" />
      <rect y={H} width="1920" height={8} fill="#f2c230" />
      <rect y={H + 170} width="1920" height={10} fill="#a4acbf" />
      <rect y={H + 186} width="1920" height={4} fill="#a4acbf" />
    </g>
  );
};
