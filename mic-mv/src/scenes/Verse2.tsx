import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Animal } from "../components/Animal";
import { Mayor } from "../components/Mayor";
import { Skyline } from "../components/Skyline";
import { BigLine, Burst, C, FONT_BOLD } from "../components/Kit";
import { Bubble, Citizens, Shots, Stage, SvgText } from "../components/Stage";
import { ip, pop, rand, s } from "../lib/anim";

const INK = "#2a2330";

const NightSky: React.FC<{ top?: string; bottom?: string }> = ({ top = "#141b45", bottom = "#3a2d6b" }) => {
  const frame = useCurrentFrame();
  return (
    <g>
      <defs>
        <linearGradient id={`ns-${top}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={top} />
          <stop offset="100%" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect width="1920" height="1080" fill={`url(#ns-${top})`} />
      {new Array(30).fill(0).map((_, i) => (
        <circle key={i} cx={rand(`st${i}`) * 1920} cy={rand(`sy${i}`) * 420} r={2} fill="#fff" opacity={0.3 + 0.6 * Math.abs(Math.sin(frame * 0.05 + i))} />
      ))}
    </g>
  );
};

// 夜市的攤販 問租金和油煙
const NightMarket: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage>
        <NightSky />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${300 + i * 660} 0)`}>
            <rect x={-260} y={420} width={520} height={420} fill={["#c0392b", "#2c7a4b", "#d68910"][i]} stroke={INK} strokeWidth={6} />
            <path d="M -290 420 L 290 420 L 250 340 L -250 340 Z" fill={["#e74c3c", "#27ae60", "#f5b041"][i]} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
            <rect x={-200} y={360} width={400} height={50} rx={8} fill="#fff" stroke={INK} strokeWidth={4} />
            <SvgText x={0} y={398} size={38}>
              {["鹹酥雞", "蚵仔煎", "珍珠奶茶"][i]}
            </SvgText>
          </g>
        ))}
        {/* lanterns */}
        <path d="M 0 250 Q 960 330 1920 250" stroke="#111" strokeWidth={3} fill="none" />
        {new Array(12).fill(0).map((_, i) => (
          <ellipse key={i} cx={80 + i * 160} cy={266 + Math.sin((i / 11) * Math.PI) * 60} rx={22} ry={28} fill="#ff7043" stroke={INK} strokeWidth={3} opacity={0.8 + 0.2 * Math.sin(frame * 0.2 + i)} />
        ))}
        {/* wok smoke */}
        {[0, 1, 2, 3].map((i) => {
          const p = ((frame + i * 20) % 80) / 80;
          return <circle key={i} cx={960 + Math.sin(p * 6 + i) * 40} cy={640 - p * 360} r={40 + p * 60} fill="#fff" opacity={(1 - p) * 0.4} />;
        })}
        <rect x={0} y={840} width={1920} height={240} fill="#2b2d3a" />
        <Animal x={960} y={940} s={1.6} species="tiger" shirt="#fdfdfd" pants="#8a6a4a" armR={60} armL={40} />
        <g transform={`translate(1400 560) scale(${pop(frame, 20, 12)})`}>
          <rect x={-150} y={-60} width={300} height={120} rx={16} fill="#fff" stroke={INK} strokeWidth={6} />
          <SvgText x={-30} y={20} size={56} color="#d9342b">
            租金
          </SvgText>
          <path d="M 80 30 L 80 -30 M 60 -10 L 80 -34 L 100 -10" stroke="#d9342b" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </Stage>
    </AbsoluteFill>
  );
};

// 下夜班的護理師 問末班車幾點
const Nurse: React.FC = () => {
  const frame = useCurrentFrame();
  const bus = ip(frame, [20, 80], [900, 2400], (t) => t * t);
  return (
    <AbsoluteFill>
      <Stage>
        <NightSky top="#0f1433" bottom="#27305e" />
        <Skyline sky="transparent" tags={false} />
        <rect width="1920" height="1080" fill="#0b1030" opacity={0.45} />
        {/* bus stop */}
        <rect x={420} y={420} width={14} height={400} fill="#9aa6c4" />
        <rect x={340} y={420} width={180} height={110} rx={10} fill="#1f5fbf" stroke={INK} strokeWidth={5} />
        <SvgText x={430} y={492} size={56} color="#fff">
          🚏
        </SvgText>
        {/* departing bus */}
        <g transform={`translate(${bus} 700)`}>
          <rect x={-300} y={-150} width={600} height={220} rx={30} fill="#f2c230" stroke={INK} strokeWidth={6} />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={-260 + i * 135} y={-120} width={110} height={80} rx={8} fill="#bfe3ff" stroke={INK} strokeWidth={4} />
          ))}
          <circle cx={-180} cy={70} r={40} fill="#333" stroke={INK} strokeWidth={5} />
          <circle cx={180} cy={70} r={40} fill="#333" stroke={INK} strokeWidth={5} />
        </g>
        {/* clock */}
        <g transform="translate(1500 300)">
          <circle r={110} fill="#fff" stroke={INK} strokeWidth={8} />
          <line x1={0} y1={0} x2={0} y2={-70} stroke={INK} strokeWidth={9} strokeLinecap="round" transform="rotate(-10)" />
          <line x1={0} y1={0} x2={0} y2={-90} stroke="#d9342b" strokeWidth={5} strokeLinecap="round" transform={`rotate(${300 + frame * 2})`} />
          <SvgText x={0} y={170} size={52} color="#fff">
            23:50
          </SvgText>
        </g>
        <Animal x={640} y={960} s={1.7} species="deer" shirt="#ffffff" pants="#9fd3e6" armR={frame < 40 ? 120 + Math.sin(frame * 0.5) * 20 : 10} />
        {/* nurse cap */}
        <g transform="translate(640 960) scale(1.7)">
          <path d="M -26 -222 L 26 -222 L 22 -236 L -22 -236 Z" fill="#fff" stroke={INK} strokeWidth={3} />
          <path d="M -4 -229 L 4 -229 M 0 -233 L 0 -225" stroke="#e53935" strokeWidth={2.5} />
        </g>
      </Stage>
    </AbsoluteFill>
  );
};

// 頂加的房客 問一坪的尊嚴
const Rooftop: React.FC = () => {
  const frame = useCurrentFrame();
  const tape = ip(frame, [20, 60], [0, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#6fb6ec" }}>
      <Stage>
        <rect width="1920" height="1080" fill="#6fb6ec" />
        {/* apartment block top */}
        <rect x={300} y={640} width={1320} height={440} fill="#c9b8a0" stroke={INK} strokeWidth={6} />
        {new Array(6).fill(0).map((_, i) => (
          <rect key={i} x={360 + i * 210} y={720} width={120} height={100} fill="#8fb4d1" stroke={INK} strokeWidth={4} />
        ))}
        {/* tin rooftop add-on */}
        <rect x={700} y={400} width={520} height={240} fill="#9aa7b0" stroke={INK} strokeWidth={6} />
        {new Array(10).fill(0).map((_, i) => (
          <line key={i} x1={720 + i * 52} y1={400} x2={720 + i * 52} y2={640} stroke="#7c8993" strokeWidth={4} />
        ))}
        <path d="M 670 400 L 1250 400 L 1200 350 L 720 350 Z" fill="#b24a3a" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <rect x={760} y={470} width={120} height={170} fill="#5b4636" stroke={INK} strokeWidth={4} />
        <rect x={1000} y={460} width={150} height={100} fill="#fff3c4" stroke={INK} strokeWidth={4} />
        {/* water tanks */}
        <rect x={1350} y={470} width={120} height={170} rx={20} fill="#e9eef2" stroke={INK} strokeWidth={5} />
        {/* measuring tape: 1 坪 */}
        <line x1={720} y1={680} x2={720 + 480 * tape} y2={680} stroke="#f2c230" strokeWidth={22} />
        <SvgText x={960} y={740} size={60} color={INK}>
          {tape > 0.95 ? "1 坪" : ""}
        </SvgText>
        <Animal x={560} y={640} s={1.5} species="beaver" shirt="#9b4a3c" pants="#5b3a30" armR={100} />
      </Stage>
      <div style={{ position: "absolute", right: 110, top: 110 }}>
        <BigLine text="一坪的尊嚴" start={s(1)} size={120} />
      </div>
    </AbsoluteFill>
  );
};

// 牽孩子過馬路 能不能少怕一點
const Crossing: React.FC = () => {
  const frame = useCurrentFrame();
  const car = ip(frame, [0, 40], [-500, 300]);
  const stop = frame > 40;
  const walk = ip(frame, [44, 110], [0, 700]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#3f5ad8" }}>
      <Stage>
        <Skyline horizon={520} />
        {/* zebra crossing */}
        {new Array(9).fill(0).map((_, i) => (
          <rect key={i} x={240 + i * 170} y={760} width={110} height={240} fill="#f4f4f4" opacity={0.9} />
        ))}
        {/* traffic light */}
        <rect x={1700} y={330} width={16} height={430} fill="#333" />
        <rect x={1650} y={200} width={116} height={200} rx={20} fill="#2b2d3a" stroke={INK} strokeWidth={5} />
        <circle cx={1708} cy={250} r={34} fill={stop ? "#512" : "#e53935"} />
        <circle cx={1708} cy={340} r={34} fill={stop ? "#43d15a" : "#152"} />
        {/* car that stops in time */}
        <g transform={`translate(${car} 820)`}>
          <rect x={-200} y={-90} width={400} height={120} rx={30} fill="#e57373" stroke={INK} strokeWidth={6} />
          <path d="M -120 -90 L -80 -160 L 90 -160 L 130 -90 Z" fill="#bfe3ff" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          <circle cx={-120} cy={40} r={40} fill="#333" stroke={INK} strokeWidth={5} />
          <circle cx={120} cy={40} r={40} fill="#333" stroke={INK} strokeWidth={5} />
        </g>
        <Animal x={640 + walk} y={960} s={1.6} species="kangaroo" shirt="#2b2d3a" pants="#d58ad8" armR={10} armL={40} bob={stop ? Math.abs(Math.sin(frame * 0.35)) * 4 : 0} />
        <Animal x={540 + walk} y={970} s={0.9} species="squirrel" shirt="#fdfdfd" pants="#c23b3b" armR={60} bob={stop ? Math.abs(Math.sin(frame * 0.35 + 1)) * 4 : 0} />
      </Stage>
      <div style={{ position: "absolute", left: 110, top: 110 }}>
        <BigLine text="少怕一點" start={s(1)} size={140} />
      </div>
    </AbsoluteFill>
  );
};

// 這場面試 考官就在台下
const Interview: React.FC = () => {
  const frame = useCurrentFrame();
  const judges = [
    { species: "elephant" as const, shirt: "#e8b64c" },
    { species: "cat" as const, shirt: "#6f7d4a" },
    { species: "penguin" as const, shirt: "#d9899a" },
    { species: "giraffe" as const, shirt: "#f5e3c8" },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: "#243a78" }}>
      <Stage>
        <rect width="1920" height="1080" fill="#243a78" />
        <polygon points="860,-20 1060,-20 1180,700 740,700" fill="#fff5c4" opacity={0.25} />
        <rect x={0} y={640} width={1920} height={60} fill="#8a5a3a" stroke={INK} strokeWidth={5} />
        <Mayor x={960} y={660} s={1.6} armR={40} armL={20} micHand="R" mouthOpen={Math.floor(frame / 6) % 2 === 0} />
        <SvgText x={960} y={170} size={60} color="#ffd54f">
          面試中
        </SvgText>
        <rect x={0} y={960} width={1920} height={120} fill="#3a3040" />
        {judges.map((j, i) => (
          <g key={i}>
            <Animal x={300 + i * 440} y={1110} s={1.2} species={j.species} shirt={j.shirt} armR={150} />
            <g transform={`translate(${360 + i * 440} 760) scale(${pop(frame, 20 + i * 8, 12)}) rotate(${(i - 1.5) * 4})`}>
              <rect x={-70} y={-50} width={140} height={100} rx={12} fill="#fff" stroke={INK} strokeWidth={5} />
              <SvgText x={0} y={22} size={64} color={C.blue}>
                {["?", "?", "?", "?"][i]}
              </SvgText>
            </g>
          </g>
        ))}
      </Stage>
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, display: "flex", justifyContent: "center" }}>
        <BigLine text="考官就在台下" start={s(0.6)} size={110} />
      </div>
    </AbsoluteFill>
  );
};

// 四年的約 先把責任寫下
const Contract: React.FC = () => {
  const frame = useCurrentFrame();
  const sign = ip(frame, [20, 70], [0, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: C.blue }}>
      <Stage>
        <Burst x={960} y={540} opacity={0.1} />
        <g transform="translate(960 520) rotate(-2)">
          <rect x={-420} y={-360} width={840} height={720} rx={20} fill="#fffaf0" stroke={INK} strokeWidth={8} />
          <SvgText x={0} y={-250} size={96} color={C.orange}>
            四年的約
          </SvgText>
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={-330} y1={-140 + i * 80} x2={330 - (i % 2) * 120} y2={-140 + i * 80} stroke="#b8c4e0" strokeWidth={12} strokeLinecap="round" />
          ))}
          <line x1={-100} y1={250} x2={330} y2={250} stroke={INK} strokeWidth={4} />
          <SvgText x={-230} y={264} size={44} anchor="start">
            簽名
          </SvgText>
          <path d="M -80 240 C -40 180 0 290 40 220 C 70 170 100 280 140 230 C 170 200 200 260 260 220" stroke="#1f3f9f" strokeWidth={9} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - sign} />
        </g>
        <g transform={`translate(${760 + sign * 420} ${720 - Math.sin(sign * 12) * 20}) rotate(35)`}>
          <rect x={-10} y={-140} width={20} height={140} rx={6} fill="#1f3f9f" stroke={INK} strokeWidth={3} />
          <path d="M -10 0 L 0 26 L 10 0 Z" fill="#f3d2a0" stroke={INK} strokeWidth={3} />
        </g>
      </Stage>
    </AbsoluteFill>
  );
};

// Global 73–99s
export const VoicesScene: React.FC = () => (
  <Shots
    shots={[
      { at: 0, name: "夜市攤販", el: <NightMarket /> },
      { at: 3, name: "護理師", el: <Nurse /> },
      { at: 7, name: "頂加房客", el: <Rooftop /> },
      { at: 13, name: "牽孩子過馬路", el: <Crossing /> },
      { at: 17, name: "面試", el: <Interview /> },
      { at: 21, name: "四年的約", el: <Contract /> },
    ]}
  />
);

// 選前說的話 選後還算不算
const BeforeAfter: React.FC = () => {
  const frame = useCurrentFrame();
  const deflate = ip(frame, [30, 60], [1, 0.6]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#3f5ad8" }}>
      <Stage>
        <rect width="960" height="1080" fill="#f47b20" />
        <rect x="960" width="960" height="1080" fill="#7d86a8" />
        <SvgText x={480} y={180} size={80} color="#fff">
          選前
        </SvgText>
        <SvgText x={1440} y={180} size={80} color="#fff">
          選後
        </SvgText>
        <Bubble x={480} y={480} w={620} h={300} k={pop(frame, 0, 12)}>
          <SvgText x={0} y={-20} size={70} color={C.orange}>
            ★ 保證 ★
          </SvgText>
          <SvgText x={0} y={70} size={70} color={C.orange}>
            ★ 一定 ★
          </SvgText>
        </Bubble>
        <Bubble x={1440} y={480} w={620 * deflate} h={300 * deflate} k={pop(frame, 12, 12)} fill="#dfe3ee">
          <SvgText x={0} y={30} size={120 * deflate} color="#7d86a8">
            ？
          </SvgText>
        </Bubble>
        <Mayor x={480} y={1100} s={1.3} armR={120} armL={14} micHand="R" />
        <Mayor x={1440} y={1100} s={1.3} armR={12} armL={14} micHand="none" opacity={0.75} />
      </Stage>
      <div style={{ position: "absolute", left: 0, right: 0, top: 780, display: "flex", justifyContent: "center" }}>
        <BigLine text="還算不算？" start={s(1.4)} size={130} stroke={INK} strokeW={14} />
      </div>
    </AbsoluteFill>
  );
};

// 您投下的一票 不是空白授權
const NotBlank: React.FC = () => {
  const frame = useCurrentFrame();
  const items = ["交通", "住宅", "托育", "安全"];
  return (
    <AbsoluteFill style={{ backgroundColor: C.blue }}>
      <Stage>
        <Burst x={960} y={520} opacity={0.12} />
        <g transform={`translate(960 520) rotate(-3) scale(${pop(frame, 0, 12)})`}>
          <rect x={-300} y={-380} width={600} height={760} rx={16} fill="#fffef6" stroke={INK} strokeWidth={8} />
          <SvgText x={0} y={-290} size={70} color={C.blue}>
            選票
          </SvgText>
          {items.map((t, i) => (
            <g key={t} opacity={ip(frame, [10 + i * 10, 16 + i * 10], [0, 1])} transform={`translate(0 ${-170 + i * 120})`}>
              <SvgText x={-200} y={20} size={58} anchor="start">
                {t}
              </SvgText>
              <circle cx={180} cy={0} r={34} fill="none" stroke="#d9342b" strokeWidth={8} />
              <path d="M 162 0 L 198 0 M 180 -18 L 180 18" stroke="#d9342b" strokeWidth={8} strokeLinecap="round" />
            </g>
          ))}
        </g>
        <Citizens y={1120} s={0.8} raise={0.5} />
      </Stage>
      <div style={{ position: "absolute", left: 90, top: 380 }}>
        <BigLine text="不是" start={s(1.2)} size={150} />
        <BigLine text="空白授權" start={s(1.5)} size={150} color={C.orange} stroke="#fff" />
      </div>
    </AbsoluteFill>
  );
};

// 不用看誰臉色 不用把話吞下
const SpeakUp: React.FC = () => {
  const frame = useCurrentFrame();
  const grow = ip(frame, [20, 60], [0.4, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: C.orange }}>
      <Stage>
        <Burst x={700} y={500} opacity={0.18} />
        <Bubble x={1150} y={430} w={900 * grow} h={420 * grow} k={1}>
          <SvgText x={0} y={50 * grow} size={200 * grow} color={C.orange}>
            ！！
          </SvgText>
        </Bubble>
        <Animal x={560} y={1020} s={2.2} species="elephant" shirt="#e8b64c" pants="#8a8fb3" hat="flower" armR={150} prop="mic" bob={Math.abs(Math.sin(frame * 0.3)) * 5} />
      </Stage>
      <div style={{ position: "absolute", right: 90, top: 820 }}>
        <BigLine text="不用把話吞下" start={s(1.6)} size={100} stroke={INK} strokeW={12} />
      </div>
    </AbsoluteFill>
  );
};

// 住在這裡的人 最知道哪裡卡
const WhereStuck: React.FC = () => {
  const frame = useCurrentFrame();
  const pins = [
    { x: 520, y: 460, e: "🚗", t: "塞車" },
    { x: 900, y: 360, e: "🚧", t: "人行道" },
    { x: 1260, y: 520, e: "☀️", t: "沒樹蔭" },
    { x: 760, y: 640, e: "🌧️", t: "積水" },
    { x: 1500, y: 360, e: "🚌", t: "等太久" },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: "#3f5ad8" }}>
      <Stage>
        <rect width="1920" height="1080" fill="#3f5ad8" />
        {/* stylised city map */}
        <path d="M 380 260 Q 700 150 1100 220 Q 1560 200 1680 420 Q 1720 640 1400 760 Q 1000 840 640 760 Q 320 680 330 460 Z" fill="#43a847" stroke={INK} strokeWidth={7} />
        <path d="M 420 520 Q 800 460 1100 560 T 1640 520" stroke="#6fb6ec" strokeWidth={26} fill="none" strokeLinecap="round" />
        <path d="M 900 240 L 960 780 M 500 360 L 1560 660" stroke="#f2c230" strokeWidth={10} strokeDasharray="30 18" fill="none" />
        {pins.map((p, i) => (
          <g key={i} transform={`translate(${p.x} ${p.y - ip(frame, [8 + i * 8, 14 + i * 8], [60, 0])}) scale(${pop(frame, 8 + i * 8, 10)})`}>
            <path d="M 0 0 C -50 -60 -50 -130 0 -130 C 50 -130 50 -60 0 0 Z" fill="#e53935" stroke={INK} strokeWidth={5} />
            <circle cx={0} cy={-88} r={30} fill="#fff" />
            <text x={0} y={-74} textAnchor="middle" fontSize={36}>
              {p.e}
            </text>
            <rect x={-70} y={10} width={140} height={48} rx={12} fill="#fff" stroke={INK} strokeWidth={4} />
            <text x={0} y={46} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={900} fontSize={30} fill={INK}>
              {p.t}
            </text>
          </g>
        ))}
        <Citizens y={1100} s={0.85} raise={0.7} />
      </Stage>
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, display: "flex", justifyContent: "center" }}>
        <BigLine text="最知道哪裡卡" start={s(0.8)} size={110} />
      </div>
    </AbsoluteFill>
  );
};

// Global 99–116s
export const PledgeScene: React.FC = () => (
  <Shots
    shots={[
      { at: 0, name: "選前選後", el: <BeforeAfter /> },
      { at: 4, name: "不是空白授權", el: <NotBlank /> },
      { at: 7, name: "不用把話吞下", el: <SpeakUp /> },
      { at: 12, name: "哪裡卡", el: <WhereStuck /> },
    ]}
  />
);
