import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Animal } from "../components/Animal";
import { BigLine, Burst, C, FONT_BOLD } from "../components/Kit";
import { heartPath } from "../components/Effects";
import { Bubble, Citizens, Shots, Stage, SvgText } from "../components/Stage";
import { ip, pop, rand, s } from "../lib/anim";

const INK = "#2a2330";

// One-point-perspective alley; `warm` 0 = grey dusk, 1 = warm and lived-in
const Alley: React.FC<{ warm: number; night?: number }> = ({ warm, night = 0 }) => {
  const frame = useCurrentFrame();
  const mix = (a: [number, number, number], b: [number, number, number]) =>
    `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * warm)).join(",")})`;
  const wallL = mix([96, 98, 120], [214, 150, 110]);
  const wallR = mix([110, 112, 134], [232, 176, 120]);
  const sky = mix([70, 76, 110], [246, 180, 120]);
  const ground = mix([70, 72, 88], [150, 110, 90]);
  return (
    <g>
      <rect width="1920" height="1080" fill={sky} />
      <polygon points="0,0 820,300 820,760 0,1080" fill={wallL} stroke={INK} strokeWidth={5} />
      <polygon points="1920,0 1100,300 1100,760 1920,1080" fill={wallR} stroke={INK} strokeWidth={5} />
      <polygon points="0,1080 820,760 1100,760 1920,1080" fill={ground} />
      {[0.15, 0.4, 0.62, 0.8].map((z, i) => {
        const lx = z * 820;
        const top = 300 * z + 120 * (1 - z);
        const h = (1 - z) * 260 + 60;
        return (
          <g key={i}>
            <rect x={lx} y={top} width={(1 - z) * 120 + 20} height={h * 0.5} fill={mix([60, 64, 84], [255, 220, 150])} stroke={INK} strokeWidth={3} opacity={0.9} />
            <rect x={1920 - lx - ((1 - z) * 120 + 20)} y={top + 40} width={(1 - z) * 120 + 20} height={h * 0.45} fill={mix([60, 64, 84], [255, 220, 150])} stroke={INK} strokeWidth={3} opacity={0.9} />
          </g>
        );
      })}
      {/* clotheslines, AC units */}
      <path d="M 0 260 Q 960 360 1920 260" stroke={INK} strokeWidth={3} fill="none" />
      {[300, 700, 1200, 1600].map((x, i) => (
        <rect key={x} x={x} y={268 + Math.sin((x / 1920) * Math.PI) * 90} width={50} height={70} fill={["#e57373", "#64b5f6", "#ffd54f", "#81c784"][i]} stroke={INK} strokeWidth={3} opacity={0.4 + warm * 0.6} />
      ))}
      {/* street lamp */}
      <rect x={1380} y={300} width={14} height={560} fill="#2b2d3a" />
      <path d="M 1387 300 Q 1387 260 1320 262" stroke="#2b2d3a" strokeWidth={12} fill="none" />
      <ellipse cx={1310} cy={272} rx={34} ry={12} fill={night > 0 ? "#fff1c1" : "#888"} opacity={night > 0 ? 0.6 + 0.4 * Math.abs(Math.sin(frame * 0.5)) * (1 - warm) + warm : 1} />
      {night > 0 && <circle cx={1310} cy={300} r={170} fill="#ffe7a3" opacity={0.18 * night} />}
      {/* flower pots appear as it warms */}
      {new Array(6).fill(0).map((_, i) => (
        <g key={i} opacity={warm} transform={`translate(${i < 3 ? 120 + i * 180 : 1260 + (i - 3) * 180} ${i < 3 ? 1000 - i * 60 : 880 + (i - 3) * 60}) scale(${warm})`}>
          <path d="M -30 0 L 30 0 L 22 50 L -22 50 Z" fill="#c8693a" stroke={INK} strokeWidth={4} />
          {[-16, 0, 16].map((dx) => (
            <circle key={dx} cx={dx} cy={-18 - Math.abs(dx) * 0.5} r={16} fill={["#f06292", "#ffd54f", "#ba68c8"][(i + dx) % 3 === 0 ? 0 : i % 3]} stroke={INK} strokeWidth={3} />
          ))}
        </g>
      ))}
      {night > 0 && <rect width="1920" height="1080" fill="#0b1030" opacity={night * 0.35 * (1 - warm)} />}
      {new Array(10).fill(0).map((_, i) => (
        <circle key={i} cx={rand(`al${i}`) * 1920} cy={rand(`aly${i}`) * 300} r={2} fill="#fff" opacity={warm * 0.6} />
      ))}
    </g>
  );
};

// 其實我也怕 問了還是一樣
const Afraid: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stage zoom={[1, 1.06]} origin="960px 800px">
        <Alley warm={0} />
        <Animal x={960} y={960} s={1.7} species="squirrel" shirt="#fdfdfd" pants="#c23b3b" armR={ip(frame, [0, 60, 90], [20, 90, 40])} prop="mic" armL={10} />
        <path d="M 1040 700 Q 1052 724 1040 736 Q 1028 724 1040 700 Z" fill="#8fd3ff" stroke={INK} strokeWidth={3} opacity={Math.abs(Math.sin(frame * 0.1))} />
      </Stage>
    </AbsoluteFill>
  );
};

// 怕好不容易開口 又被晾在一旁
const Ignored: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = ip(frame, [20, 110], [0, 1]);
  return (
    <AbsoluteFill>
      <Stage>
        <Alley warm={0} />
        <g opacity={1 - drift * 0.6} transform={`translate(${-drift * 500} ${drift * 120}) rotate(${-drift * 20} 1180 460)`}>
          <Bubble x={1180} y={460} w={440} h={200}>
            <SvgText x={0} y={20} size={60}>
              我想問…
            </SvgText>
          </Bubble>
        </g>
        {/* cobweb corner: it's been waiting */}
        <path d="M 0 0 L 240 0 M 0 0 L 0 240 M 0 0 L 200 200 M 70 0 Q 70 70 0 70 M 140 0 Q 140 140 0 140" stroke="#dfe3ee" strokeWidth={3} fill="none" opacity={drift} />
        {/* bench */}
        <rect x={760} y={900} width={400} height={24} rx={8} fill="#8a5a3a" stroke={INK} strokeWidth={4} />
        <rect x={790} y={924} width={16} height={80} fill="#5b3a28" />
        <rect x={1114} y={924} width={16} height={80} fill="#5b3a28" />
        <Animal x={960} y={960} s={1.6} species="squirrel" shirt="#fdfdfd" pants="#c23b3b" armR={10} armL={10} />
      </Stage>
      <div style={{ position: "absolute", left: 110, top: 110 }}>
        <BigLine text="又被晾在一旁" start={s(1.4)} size={110} color="#dfe3ee" stroke="#4b5070" />
      </div>
    </AbsoluteFill>
  );
};

// 可我明天 還要走過那條巷
const Tomorrow: React.FC = () => {
  const frame = useCurrentFrame();
  const z = ip(frame, [0, 120], [0, 1], (t) => t);
  return (
    <AbsoluteFill>
      <Stage>
        <Alley warm={0.2} night={1} />
        <Animal x={960} y={1000 - z * 180} s={1.6 - z * 0.8} species="squirrel" shirt="#fdfdfd" pants="#c23b3b" bob={Math.abs(Math.sin(frame * 0.35)) * 5} armR={20} armL={20} />
      </Stage>
    </AbsoluteFill>
  );
};

// 還想把日子 過成喜歡的模樣
const LikedLife: React.FC = () => {
  const frame = useCurrentFrame();
  const warm = ip(frame, [0, 60], [0.2, 1]);
  return (
    <AbsoluteFill>
      <Stage zoom={[1.05, 1]}>
        <Alley warm={warm} />
        <Animal x={760} y={980} s={1.4} species="cat" shirt="#6f7d4a" pants="#5b6440" hat="bucket" armR={150} />
        <Animal x={960} y={1000} s={1.6} species="squirrel" shirt="#fdfdfd" pants="#c23b3b" armR={160} armL={160} bob={Math.abs(Math.sin(frame * 0.25)) * 6} />
        <Animal x={1170} y={980} s={1.4} species="penguin" shirt="#d9899a" pants="#353b5c" armR={150} />
      </Stage>
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, display: "flex", justifyContent: "center" }}>
        <BigLine text="喜歡的模樣" start={s(1)} size={140} />
      </div>
    </AbsoluteFill>
  );
};

// Global 137–155s
export const AlleyScene: React.FC = () => (
  <Shots
    shots={[
      { at: 0, name: "其實我也怕", el: <Afraid /> },
      { at: 4, name: "又被晾在一旁", el: <Ignored /> },
      { at: 9, name: "明天還要走過那條巷", el: <Tomorrow /> },
      { at: 13, name: "喜歡的模樣", el: <LikedLife /> },
    ]}
  />
);

// 按讚 是心意 開口 是開始
const LikeToSpeak: React.FC = () => {
  const frame = useCurrentFrame();
  const flip = ip(frame, [40, 56], [0, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: C.blue }}>
      <Stage>
        <Burst x={960} y={520} opacity={0.12} />
        {/* phone with likes */}
        <g transform={`translate(700 520) scale(${1 - flip * 0.3}) rotate(${-8 + flip * -20})`} opacity={1 - flip * 0.5}>
          <rect x={-170} y={-300} width={340} height={600} rx={40} fill="#23262e" stroke={INK} strokeWidth={6} />
          <rect x={-150} y={-260} width={300} height={520} rx={20} fill="#fff" />
          {new Array(4).fill(0).map((_, i) => (
            <g key={i} transform={`translate(0 ${-190 + i * 120})`}>
              <rect x={-120} y={-44} width={240} height={88} rx={14} fill="#eef2fb" />
              <text x={-60} y={18} textAnchor="middle" fontSize={50}>
                👍
              </text>
              <path d={heartPath(18)} transform="translate(60 4)" fill="#f2718d" />
            </g>
          ))}
        </g>
        {/* the hand goes up with the mic */}
        <Animal x={1300} y={1040} s={2} species="kangaroo" shirt="#2b2d3a" pants="#d58ad8" armR={ip(frame, [40, 60], [40, 165])} prop={flip > 0.5 ? "mic" : "phone"} />
      </Stage>
      <div style={{ position: "absolute", left: 90, top: 80 }}>
        <BigLine text="開口" start={s(1.6)} size={180} color={C.orange} stroke="#fff" />
      </div>
      <div style={{ position: "absolute", left: 470, top: 110 }}>
        <BigLine text="是開始" start={s(1.9)} size={130} />
      </div>
    </AbsoluteFill>
  );
};

// 走進投票所那一刻
const PollingStation: React.FC = () => {
  const frame = useCurrentFrame();
  const q = ip(frame, [0, 140], [0, 1], (t) => t);
  return (
    <AbsoluteFill style={{ backgroundColor: "#f7b267" }}>
      <Stage>
        <rect width="1920" height="1080" fill="#6fb6ec" />
        <rect x={560} y={260} width={800} height={600} fill="#f1e2c2" stroke={INK} strokeWidth={7} />
        <rect x={520} y={220} width={880} height={60} fill="#c58a5e" stroke={INK} strokeWidth={7} />
        <rect x={700} y={120} width={520} height={90} rx={14} fill="#fff" stroke={INK} strokeWidth={6} />
        <text x={960} y={185} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={900} fontSize={64} fill={C.blue}>
          投票所
        </text>
        <rect x={840} y={560} width={240} height={300} fill="#fff6d8" stroke={INK} strokeWidth={6} />
        <circle cx={960} cy={700} r={200} fill="#fff6d8" opacity={0.5} />
        <rect y={860} width="1920" height="220" fill="#5b6b8f" />
        <rect y={860} width="1920" height="8" fill="#f2c230" />
        {/* the queue walks in */}
        {["elephant", "tiger", "penguin", "bear", "giraffe"].map((sp, i) => {
          const x = 1780 - i * 230 - q * 700;
          const inDoor = x < 1000;
          return (
            <Animal
              key={sp}
              x={Math.max(960, x)}
              y={inDoor ? 860 : 980}
              s={inDoor ? 0.7 : 1.05}
              species={sp as never}
              shirt={["#e8b64c", "#f3e07a", "#d9899a", "#f59a2f", "#f5e3c8"][i]}
              opacity={inDoor ? ip(x, [880, 1000], [0, 1]) : 1}
              bob={Math.abs(Math.sin(frame * 0.3 + i)) * 4}
            />
          );
        })}
      </Stage>
    </AbsoluteFill>
  );
};

// 我的明天 我自己決定 (approved key frame)
const MyTomorrow: React.FC = () => {
  const frame = useCurrentFrame();
  const drop = ip(frame, [6, 26], [0, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#f7b267" }}>
      <Stage>
        <defs>
          <radialGradient id="dawn" cx="0.5" cy="0.75" r="0.8">
            <stop offset="0%" stopColor="#fff3c4" />
            <stop offset="45%" stopColor="#f7b267" />
            <stop offset="100%" stopColor="#c8553d" />
          </radialGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#dawn)" />
        <Burst x={960} y={720} color="#fff" opacity={0.2} />
        <circle cx={960} cy={690} r={240} fill="#fff6d8" opacity={0.9} />
        <g transform="translate(960 640) scale(0.9)">
          <path d="M -230 -40 L 230 -40 L 200 230 L -200 230 Z" fill="#fff" stroke={INK} strokeWidth={8} />
          <rect x={-250} y={-70} width={500} height={40} rx={8} fill={C.blue} stroke={INK} strokeWidth={8} />
          <rect x={-90} y={-58} width={180} height={14} rx={6} fill={INK} />
          <text x={0} y={120} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={900} fontSize={90} fill={C.blue}>
            票
          </text>
        </g>
        <g transform={`translate(960 ${360 + drop * 220})`} opacity={1 - ip(frame, [26, 30], [0, 1])}>
          <rect x={-70} y={-110} width={140} height={180} rx={6} fill="#fffef6" stroke={INK} strokeWidth={6} />
          <circle cx={0} cy={-30} r={34} fill="none" stroke="#d13b3b" strokeWidth={8} />
          <path d="M -18 -30 L 18 -30 M 0 -48 L 0 -12" stroke="#d13b3b" strokeWidth={8} strokeLinecap="round" />
        </g>
        <rect y={930} width="1920" height="150" fill="#5b6b8f" />
        <rect y={930} width="1920" height="8" fill="#f2c230" />
        <Citizens y={1050} s={0.8} raise={0.4} />
      </Stage>
      <div style={{ position: "absolute", top: 70, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <BigLine text="我的明天" start={4} size={150} stroke={C.blue} />
        <BigLine text="我自己決定" start={16} size={150} color={C.cream} stroke={INK} strokeW={18} />
      </div>
    </AbsoluteFill>
  );
};

// Global 155–169s
export const VoteScene: React.FC = () => (
  <Shots
    shots={[
      { at: 0, name: "按讚是心意 開口是開始", el: <LikeToSpeak /> },
      { at: 3, name: "走進投票所", el: <PollingStation /> },
      { at: 8, name: "我的明天 我自己決定", el: <MyTomorrow /> },
    ]}
  />
);

// Global 169–175s：十一月二十八／下一個四年／您決定
export const DateScene: React.FC = () => {
  const frame = useCurrentFrame();
  const tear = ip(frame, [s(3.2), s(3.8)], [0, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: C.orange }}>
      <Stage zoom={[1, 1.05]}>
        <Burst x={960} y={540} opacity={0.2} />
        <g transform={`translate(960 420) scale(${0.85 * pop(frame, s(0.3), 14)})`}>
          <rect x={-320} y={-340} width={640} height={680} rx={30} fill="#fff" stroke={INK} strokeWidth={10} />
          <rect x={-320} y={-340} width={640} height={150} rx={30} fill={C.blue} stroke={INK} strokeWidth={10} />
          <text x={0} y={-235} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={900} fontSize={96} fill="#fff">
            11 月
          </text>
          <text x={0} y={150} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={900} fontSize={330} fill={INK}>
            28
          </text>
          {/* torn-off page flying away reveals the next four years */}
          <g opacity={1 - tear} transform={`translate(${tear * 700} ${-tear * 300}) rotate(${tear * 40})`}>
            <rect x={-300} y={-180} width={600} height={500} fill="#fff" />
            <text x={0} y={150} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={900} fontSize={330} fill={INK}>
              28
            </text>
          </g>
          <g opacity={tear}>
            <rect x={-300} y={-180} width={600} height={500} fill="#fff" />
            <text x={0} y={60} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={900} fontSize={120} fill={C.blue}>
              下一個
            </text>
            <text x={0} y={220} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={900} fontSize={140} fill={C.orange}>
              四年
            </text>
          </g>
        </g>
      </Stage>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 160,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [s(5), s(5.2)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <BigLine text="您決定" start={s(5)} size={150} stroke={INK} strokeW={16} />
      </div>
    </AbsoluteFill>
  );
};
