import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Animal, CAST } from "../components/Animal";
import { Mayor } from "../components/Mayor";
import { Skyline } from "../components/Skyline";
import { BigLine, C, FONT_BOLD, Waves } from "../components/Kit";
import { Vignette } from "../components/Effects";
import { Citizens, Shots, Stage, SvgText } from "../components/Stage";
import { ip, pop, rand, s } from "../lib/anim";

const INK = "#2a2330";

const Tree: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => (
  <g transform={`translate(${x} ${y}) scale(${k})`}>
    <rect x={-12} y={-120} width={24} height={120} fill="#6b4a33" stroke={INK} strokeWidth={4} />
    <circle cx={0} cy={-170} r={80} fill="#4f9a3e" stroke={INK} strokeWidth={5} />
    <circle cx={-50} cy={-140} r={50} fill="#5fae4a" stroke={INK} strokeWidth={5} />
    <circle cx={50} cy={-140} r={50} fill="#5fae4a" stroke={INK} strokeWidth={5} />
  </g>
);

// 問到樹蔭 連起來
const Shade: React.FC = () => {
  const frame = useCurrentFrame();
  const n = 8;
  return (
    <AbsoluteFill style={{ backgroundColor: "#6fb6ec" }}>
      <Stage>
        <Skyline sky="#6fb6ec" />
        {/* shade band connecting under the canopy */}
        <rect x={0} y={880} width={1920 * ip(frame, [20, 100], [0, 1])} height={60} fill="#2d3a5f" opacity={0.35} />
        {new Array(n).fill(0).map((_, i) => (
          <Tree key={i} x={120 + i * 240} y={900} k={pop(frame, i * 9, 14) * 1.1} />
        ))}
        <Citizens y={1060} s={0.75} raise={0.3} />
      </Stage>
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, display: "flex", justifyContent: "center" }}>
        <BigLine text="樹蔭連起來" start={s(0.6)} size={150} />
      </div>
    </AbsoluteFill>
  );
};

// 問到回家的路 亮起來
const Lights: React.FC = () => {
  const frame = useCurrentFrame();
  const n = 8;
  return (
    <AbsoluteFill style={{ backgroundColor: "#1c2450" }}>
      <Stage>
        <Skyline sky="#1c2450" tags={false} />
        <rect width="1920" height="1080" fill="#0b1030" opacity={0.45} />
        {new Array(n).fill(0).map((_, i) => {
          const x = 120 + i * 240;
          const on = ip(frame, [i * 8, i * 8 + 4], [0, 1]);
          return (
            <g key={i}>
              <circle cx={x} cy={560} r={150} fill="#ffe7a3" opacity={0.22 * on} />
              <ellipse cx={x} cy={900} rx={120} ry={24} fill="#ffe7a3" opacity={0.35 * on} />
              <rect x={x - 6} y={560} width={12} height={340} fill="#2b2d3a" />
              <circle cx={x} cy={556} r={22} fill={on > 0.5 ? "#fff1c1" : "#555"} stroke={INK} strokeWidth={4} />
            </g>
          );
        })}
        {/* walking home */}
        {CAST.slice(0, 4).map((c, i) => (
          <Animal key={i} x={ip(frame, [0, 130], [-200 - i * 160, 1700 - i * 160], (t) => t)} y={960} s={0.95} {...c} bob={Math.abs(Math.sin(frame * 0.35 + i)) * 5} />
        ))}
      </Stage>
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, display: "flex", justifyContent: "center" }}>
        <BigLine text="回家的路亮起來" start={s(0.6)} size={130} color="#fff1c1" stroke={C.orange} />
      </div>
    </AbsoluteFill>
  );
};

// 把說好的事 一件一件做出來
const Done: React.FC = () => {
  const frame = useCurrentFrame();
  const items = ["人行道變好走", "樹蔭連起來", "路燈亮起來", "公車不用等", "陳情有回覆"];
  return (
    <AbsoluteFill style={{ backgroundColor: C.blue }}>
      <Stage>
        <rect width="1920" height="1080" fill={C.blue} />
        <g transform="translate(1120 540) rotate(-2)">
          <rect x={-460} y={-420} width={920} height={840} rx={24} fill="#fff" stroke={INK} strokeWidth={8} />
          {items.map((t, i) => {
            const on = ip(frame, [14 + i * 18, 20 + i * 18], [0, 1]);
            return (
              <g key={t} transform={`translate(0 ${-300 + i * 150})`}>
                <rect x={-380} y={-50} width={100} height={100} rx={14} fill={on > 0.5 ? "#4caf50" : "#fff"} stroke={INK} strokeWidth={6} />
                <path d="M -358 0 L -336 24 L -300 -24" stroke="#fff" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={on} />
                <SvgText x={-240} y={24} size={64} anchor="start" color={on > 0.5 ? INK : "#9aa0b4"}>
                  {t}
                </SvgText>
              </g>
            );
          })}
        </g>
        <Mayor x={330} y={1080} s={1.8} armR={100} armL={14} micHand="L" />
      </Stage>
    </AbsoluteFill>
  );
};

// 讓台北 一起順起來
const Together: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#3f5ad8" }}>
      <Stage zoom={[1.05, 1]}>
        <Skyline />
        {new Array(60).fill(0).map((_, i) => {
          const y = ((rand(`cf${i}`) * 1080 + frame * (4 + rand(`cv${i}`) * 4)) % 1180) - 100;
          return (
            <rect
              key={i}
              x={rand(`cx${i}`) * 1920 + Math.sin(frame * 0.1 + i) * 20}
              y={y}
              width={16}
              height={26}
              fill={["#f47b20", "#ffd54f", "#fff", "#f2718d", "#4caf50"][i % 5]}
              transform={`rotate(${frame * 6 + i * 30} ${rand(`cx${i}`) * 1920} ${y})`}
            />
          );
        })}
        <Citizens y={960} s={0.95} cheer from={90} to={1830} skip={[5]} />
        <Mayor x={960} y={1000} s={1.25} armR={160} armL={160} micHand="R" bob={Math.abs(Math.sin(frame * 0.25)) * 6} />
      </Stage>
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, display: "flex", justifyContent: "center" }}>
        <BigLine text="讓台北一起順起來" start={s(0.4)} size={130} />
      </div>
    </AbsoluteFill>
  );
};

// Global 196–213s
export const OutroScene: React.FC = () => (
  <Shots
    shots={[
      { at: 0, name: "樹蔭連起來", el: <Shade /> },
      { at: 4, name: "回家的路亮起來", el: <Lights /> },
      { at: 9, name: "說好的事做出來", el: <Done /> },
      { at: 14, name: "讓台北一起順起來", el: <Together /> },
    ]}
  />
);

// Global 213–225s：下一題 換誰 我……／我……有一個問題／麥克風交給您
export const Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pass = ip(frame, [s(4.6), s(5.6)], [0, 1]);
  const x0 = 614;
  const y0 = 650;
  const x1 = 1570;
  const y1 = 690;
  const mx = x0 + (x1 - x0) * pass;
  const my = y0 + (y1 - y0) * pass - Math.sin(pass * Math.PI) * 260;
  const final = ip(frame, [s(10), s(10.4)], [0, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#34419e" }}>
      <Stage dur={s(10)}>
        <Skyline sky="#34419e" />
        <rect width="1920" height="1080" fill="#f47b20" opacity={0.08} />
        <path d={`M ${x0} ${y0} Q ${(x0 + x1) / 2} ${y0 - 520} ${x1} ${y1}`} stroke="#fff" strokeWidth={6} strokeDasharray="4 26" strokeLinecap="round" fill="none" opacity={0.7 * ip(frame, [s(4), s(4.6)], [0, 1])} />
        <Citizens y={800} s={0.72} from={640} to={1860} skip={[9]} raise={ip(frame, [0, s(4)], [0, 0.7])} />
        <Mayor x={380} y={1040} s={1.6} armR={pass < 1 ? ip(frame, [s(3.8), s(4.4)], [40, 100]) : 30} armL={14} micHand={pass > 0 ? "none" : "R"} />
        <Animal x={1500} y={1040} s={1.7} species="squirrel" shirt="#fdfdfd" pants="#c23b3b" armR={ip(frame, [s(3.5), s(4.2)], [12, 168])} />
        {pass > 0 && (
          <g transform={`translate(${mx} ${my}) rotate(${-20 + pass * 40}) scale(1.6)`}>
            <path d="M -5 -8 L 5 -8 L 3 26 L -3 26 Z" fill="#23262e" />
            <circle cx={0} cy={-16} r={10} fill="#aab1bd" stroke={INK} strokeWidth={2.5} />
          </g>
        )}
        {pass >= 1 && <Waves x={x1} y={y1 - 20} color="#ffd54f" />}
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${760 + i * 300} ${520 - (i % 2) * 60}) scale(${pop(frame, 10 + i * 6, 12)})`}>
            <circle r={46} fill="#fff" stroke={C.orange} strokeWidth={6} />
            <text y={22} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={900} fontSize={62} fill={C.orange}>
              ?
            </text>
          </g>
        ))}
      </Stage>
      <div style={{ position: "absolute", left: 110, top: 90, opacity: 1 - final }}>
        <BigLine text="下一題 換誰？" start={4} size={140} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 110,
          top: 300,
          background: "#fff",
          borderRadius: 30,
          padding: "18px 36px",
          border: `8px solid ${INK}`,
          scale: `${pop(frame, s(5.2), 14)}`,
          fontFamily: FONT_BOLD,
          fontWeight: 900,
          fontSize: 64,
          color: INK,
          opacity: 1 - final,
        }}
      >
        我……有一個問題
      </div>
      {/* final title card */}
      <AbsoluteFill style={{ backgroundColor: `rgba(31,95,191,${final * 0.92})`, justifyContent: "center", alignItems: "center", opacity: final }}>
        <BigLine text="麥克風交給您" start={s(10.1)} size={190} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          opacity: interpolate(frame, [durationInFrames - 20, durationInFrames - 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      />
      <Vignette strength={0.3} color="5,10,30" />
    </AbsoluteFill>
  );
};
