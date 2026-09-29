import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { interpolatePath } from "../lib/path";
import { Animal, CAST, Species } from "../components/Animal";
import { Mayor } from "../components/Mayor";
import { Skyline } from "../components/Skyline";
import { BigLine, Burst, C, FONT_BOLD } from "../components/Kit";
import { heartPath } from "../components/Effects";
import { Bubble, Citizens, Shots, Stage, SvgText } from "../components/Stage";
import { ip, pop } from "../lib/anim";

const INK = "#2a2330";

export type ChorusProps = {
  // local seconds: 麥克風 / 主角 / 您負責問 / 說好的事 / 麥克風 / 別讓真心 / 一人一題 / 問到順
  beats: number[];
  hero: Species;
};

// mic hops from citizen to citizen above their raised paws
const MicPass: React.FC<{ reverse?: boolean; title?: boolean }> = ({ reverse = false, title = true }) => {
  const frame = useCurrentFrame();
  const n = CAST.length;
  const xs = CAST.map((_, i) => 110 + (i * 1700) / (n - 1));
  const hop = 7;
  const k = Math.min(n - 1, Math.floor(frame / hop));
  const f = (frame % hop) / hop;
  const i0 = reverse ? n - 1 - k : k;
  const i1 = reverse ? Math.max(0, i0 - 1) : Math.min(n - 1, i0 + 1);
  const mx = xs[i0] + (xs[i1] - xs[i0]) * f;
  const my = 700 - Math.sin(f * Math.PI) * 90;
  return (
    <AbsoluteFill style={{ backgroundColor: "#3f5ad8" }}>
      <Stage>
        <Skyline />
        {CAST.map((c, i) => (
          <Animal key={i} x={xs[i]} y={930 + (i % 2) * 10} s={0.95} {...c} armR={Math.abs(i - i0) <= 1 ? 165 : 12} bob={i === i0 ? 6 : 0} />
        ))}
        <g transform={`translate(${mx} ${my}) rotate(${Math.sin(frame * 0.4) * 20}) scale(1.8)`}>
          <path d="M -5 -8 L 5 -8 L 3 26 L -3 26 Z" fill="#23262e" />
          <circle cx={0} cy={-16} r={10} fill="#aab1bd" stroke={INK} strokeWidth={2.5} />
        </g>
      </Stage>
      {title && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center" }}>
          <BigLine text="麥克風交給您" start={0} size={150} />
        </div>
      )}
    </AbsoluteFill>
  );
};

const Protagonist: React.FC<{ hero: Species }> = ({ hero }) => {
  const frame = useCurrentFrame();
  const heroCast = CAST.find((c) => c.species === hero) ?? CAST[0];
  return (
    <AbsoluteFill style={{ backgroundColor: "#1c2450" }}>
      <Stage zoom={[1, 1.06]} origin="960px 700px">
        <Skyline sky="#1c2450" />
        <rect width="1920" height="1080" fill="#0b1030" opacity={0.55} />
        <polygon points="880,-20 1040,-20 1260,1080 660,1080" fill="#fff5c4" opacity={0.3} />
        <ellipse cx={960} cy={1010} rx={260} ry={40} fill="#fff5c4" opacity={0.5} />
        <Citizens y={900} s={0.8} from={100} to={1820} opacity={0.5} skip={[CAST.indexOf(heroCast)]} />
        <Animal x={960} y={1010} s={2} {...heroCast} armR={165} armL={ip(frame, [0, 10], [10, 150])} />
        <g transform={`translate(960 360) scale(${pop(frame, 6, 14)}) rotate(${Math.sin(frame * 0.1) * 5})`}>
          <path d="M 0 -70 L 20 -22 L 70 -22 L 30 10 L 44 60 L 0 30 L -44 60 L -30 10 L -70 -22 L -20 -22 Z" fill="#ffd54f" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        </g>
      </Stage>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center" }}>
        <BigLine text="主角就是您" start={4} size={140} />
      </div>
    </AbsoluteFill>
  );
};

// The approved hook shot: split orange/blue, citizen asks, mayor answers
const AskAnswer: React.FC<{ asker: Species }> = ({ asker }) => {
  const frame = useCurrentFrame();
  const split = ip(frame, [0, 10], [0, 1]);
  const a = CAST.find((c) => c.species === asker) ?? CAST[2];
  return (
    <AbsoluteFill style={{ backgroundColor: C.blue }}>
      <Stage zoom={[1.04, 1]}>
        <polygon points={`0,0 ${1060 * split},0 ${860 * split},1080 0,1080`} fill={C.orange} />
        <polygon points={`${1060 * split},0 1920,0 1920,1080 ${860 * split},1080`} fill={C.blue} />
        <Burst x={480} y={560} color="#fff" opacity={0.14} />
        <Burst x={1440} y={560} color="#fff" opacity={0.08} />
        <Animal x={470} y={900} s={1.9} {...a} armR={150} prop="mic" />
        <Mayor x={1440} y={930} s={1.35} armR={62} armL={30} micHand="R" mouthOpen={frame > 30 && Math.floor(frame / 5) % 2 === 0} />
        <path d="M 1290 770 L 1590 770 L 1560 1000 L 1320 1000 Z" fill="#162a5a" stroke={INK} strokeWidth={5} />
        <rect x={1270} y={752} width={340} height={28} rx={6} fill="#2c4a8f" stroke={INK} strokeWidth={5} />
        <circle cx={1440} cy={880} r={48} fill="#fff" />
        <text x={1440} y={898} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={900} fontSize={52} fill={C.blue}>
          答
        </text>
        <Citizens y={1100} s={0.8} raise={0.6} />
      </Stage>
      <div style={{ position: "absolute", top: 50, left: 0, right: 0, display: "flex", justifyContent: "center", scale: `${pop(frame, 4, 14)}` }}>
        <div style={{ background: "#fff", borderRadius: 26, padding: "10px 40px", border: `8px solid ${C.orange}`, rotate: "-2deg" }}>
          <span style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 64, color: C.orange }}>市長，你給我聽好了！！</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 90, top: 230 }}>
        <BigLine text="您負責問" start={4} size={150} rotate={-4} stroke={INK} strokeW={16} />
      </div>
      <div style={{ position: "absolute", right: 90, top: 230 }}>
        <BigLine text="（他負責答）" start={30} size={96} rotate={-4} color={C.amber} stroke={INK} strokeW={12} />
      </div>
    </AbsoluteFill>
  );
};

const PromiseStamp: React.FC = () => {
  const frame = useCurrentFrame();
  const stamp = interpolate(frame, [26, 32, 36], [2.4, 0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shake = frame > 30 && frame < 40 ? Math.sin(frame * 3) * 6 : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#3f5ad8" }}>
      <Stage>
        <Skyline />
        <g transform={`translate(${1060 + shake} 520) rotate(-3)`}>
          <rect x={-340} y={-300} width={680} height={560} rx={20} fill="#fff" stroke={INK} strokeWidth={7} />
          <SvgText x={0} y={-210} size={70} color={C.blue}>
            說好的事
          </SvgText>
          {["每一題都回覆", "進度公開", "定期回來報告"].map((t, i) => (
            <g key={t} transform={`translate(0 ${-100 + i * 100})`}>
              <rect x={-270} y={-34} width={60} height={60} rx={8} fill="none" stroke={INK} strokeWidth={5} />
              <path d="M -260 -6 L -244 12 L -214 -24" stroke="#4caf50" strokeWidth={9} fill="none" strokeLinecap="round" opacity={ip(frame, [6 + i * 6, 10 + i * 6], [0, 1])} />
              <SvgText x={-180} y={16} size={46} anchor="start">
                {t}
              </SvgText>
            </g>
          ))}
          {frame > 25 && (
            <g transform={`translate(170 170) rotate(-14) scale(${stamp})`} opacity={0.92}>
              <circle r={110} fill="none" stroke="#d9342b" strokeWidth={12} />
              <circle r={90} fill="none" stroke="#d9342b" strokeWidth={4} />
              <SvgText x={0} y={34} size={96} color="#d9342b">
                做到
              </SvgText>
            </g>
          )}
        </g>
        <Mayor x={420} y={1070} s={1.8} armR={100} armL={14} micHand="L" />
      </Stage>
    </AbsoluteFill>
  );
};

const Echo: React.FC = () => {
  const frame = useCurrentFrame();
  const caught = ip(frame, [40, 50], [0, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: C.orange }}>
      <Stage>
        <Burst x={960} y={540} opacity={0.12} />
        {[0, 1, 2, 3].map((i) => {
          const p = ((frame + i * 12) % 48) / 48;
          return <circle key={i} cx={560 + p * 700} cy={440} r={60 + p * 180} fill="none" stroke="#fff" strokeWidth={10 * (1 - p)} opacity={(1 - p) * (1 - caught)} />;
        })}
        <Bubble x={520} y={420} w={260} h={200} k={pop(frame, 0, 12)}>
          <path d={heartPath(50)} fill="#f2718d" stroke={INK} strokeWidth={5} transform="translate(0 6)" />
        </Bubble>
        <Animal x={420} y={1000} s={1.8} species="elephant" shirt="#e8b64c" pants="#8a8fb3" hat="flower" armR={150} prop="mic" />
        <Mayor x={1500} y={1060} s={1.7} armR={80} armL={40} micHand="none" />
        {/* notepad catches the heart: the voice gets written down */}
        <g transform="translate(1720 620) rotate(8)">
          <rect x={-90} y={-110} width={180} height={220} rx={10} fill="#fffdf4" stroke={INK} strokeWidth={5} />
          <path d={heartPath(40)} fill="#f2718d" stroke={INK} strokeWidth={4} transform={`scale(${caught})`} />
        </g>
      </Stage>
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, display: "flex", justifyContent: "center" }}>
        <BigLine text="別讓真心只剩回音" start={4} size={110} stroke={INK} strokeW={14} />
      </div>
    </AbsoluteFill>
  );
};

const ICONS = ["🚌", "🌳", "🏠", "💡", "🚸", "🗑️", "🏫", "🚲", "🛵", "🌧️", "👶"];

const OneEach: React.FC = () => {
  const frame = useCurrentFrame();
  const n = CAST.length;
  return (
    <AbsoluteFill style={{ backgroundColor: "#3f5ad8" }}>
      <Stage>
        <Skyline />
        {CAST.map((c, i) => {
          const x = 110 + (i * 1700) / (n - 1);
          const st = i * 3;
          return (
            <g key={i}>
              <Animal x={x} y={930 + (i % 2) * 10} s={0.95} {...c} armR={165} />
              <g transform={`translate(${x + 40} ${640 + (i % 2) * 10}) scale(${pop(frame, st, 12)}) rotate(${Math.sin(frame * 0.2 + i) * 5})`}>
                <line x1={0} y1={30} x2={0} y2={90} stroke="#8a6a4a" strokeWidth={6} />
                <rect x={-50} y={-50} width={100} height={90} rx={12} fill="#fff" stroke={INK} strokeWidth={5} />
                <text x={0} y={16} textAnchor="middle" fontSize={50}>
                  {ICONS[i]}
                </text>
              </g>
            </g>
          );
        })}
      </Stage>
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center" }}>
        <BigLine text="一人一題" start={2} size={170} />
      </div>
    </AbsoluteFill>
  );
};

const TANGLE = "M 200 700 C 400 300 500 1000 700 600 C 850 300 700 200 900 500 C 1100 800 1100 300 1300 600 C 1450 800 1600 300 1720 700";
const SMOOTH = "M 200 700 C 400 700 500 700 700 700 C 850 700 700 700 900 700 C 1100 700 1100 700 1300 700 C 1450 700 1600 700 1720 700";

const Smooth: React.FC = () => {
  const frame = useCurrentFrame();
  const p = ip(frame, [8, 50], [0, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#3f5ad8" }}>
      <Stage>
        <Skyline />
        <path d={interpolatePath(p, TANGLE, SMOOTH)} stroke={INK} strokeWidth={34} fill="none" strokeLinecap="round" />
        <path d={interpolatePath(p, TANGLE, SMOOTH)} stroke={p > 0.95 ? "#4caf50" : "#f2c230"} strokeWidth={22} fill="none" strokeLinecap="round" />
        <path d="M 1720 650 L 1800 700 L 1720 750 Z" fill={p > 0.95 ? "#4caf50" : "#f2c230"} stroke={INK} strokeWidth={6} strokeLinejoin="round" opacity={p} />
        <Citizens y={1000} s={0.75} cheer={p > 0.95} raise={0.2} />
      </Stage>
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center" }}>
        <BigLine text="問到順為止" start={4} size={160} />
      </div>
    </AbsoluteFill>
  );
};

// Global 50–73s, 116–137s, 175–196s
export const Chorus: React.FC<ChorusProps> = ({ beats, hero }) => {
  const [, b1, b2, b3, b4, b5, b6, b7] = beats;
  return (
    <Shots
      shots={[
        { at: 0, name: "麥克風交給您", el: <MicPass /> },
        { at: b1, name: "主角本來就是您", el: <Protagonist hero={hero} /> },
        { at: b2, name: "您負責問（他負責答）", el: <AskAnswer asker={hero} /> },
        { at: b3, name: "說好的事（就要做到）", el: <PromiseStamp /> },
        { at: b4, name: "麥克風交給您 2", el: <MicPass reverse title={false} /> },
        { at: b5, name: "別讓真心只剩回音", el: <Echo /> },
        { at: b6, name: "一人一題", el: <OneEach /> },
        { at: b7, name: "問到順為止", el: <Smooth /> },
      ]}
    />
  );
};
