import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Animal } from "../components/Animal";
import { Mayor } from "../components/Mayor";
import { Skyline } from "../components/Skyline";
import { BigLine, Burst, C, FONT_BOLD, Waves } from "../components/Kit";
import { Bubble, Citizens, Shots, Stage, SvgText } from "../components/Stage";
import { ip, pop, rand, s } from "../lib/anim";

const INK = "#2a2330";

// ───────────── 開場 0–8s ─────────────
export const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const mx = ip(frame, [0, s(1.8)], [2150, 1380]);
  const walking = frame < s(1.8);
  const reach = ip(frame, [s(1.8), s(2.3)], [14, 78]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#3f5ad8" }}>
      <Stage dur={s(8)}>
        <Skyline />
        <Citizens y={770} s={0.75} from={70} to={1850} raise={ip(frame, [s(4), s(5)], [0, 0.5])} />
        <g opacity={ip(frame, [s(2.2), s(2.6)], [0, 1])}>
          <Waves x={1620} y={712} color="#ffd54f" />
        </g>
        <Mayor x={mx} y={1070} s={1.75} armR={reach} armL={14} bob={walking ? Math.abs(Math.sin(frame * 0.35)) * 6 : 0} mouthOpen={!walking && Math.floor(frame / 6) % 2 === 0} />
      </Stage>
      <div style={{ position: "absolute", left: 140, top: 150 }}>
        <BigLine text="麥克風" start={s(3.8)} size={210} />
        <BigLine text="交給您" start={s(4.4)} size={210} color={C.orange} stroke="#fff" style={{ marginLeft: 120 }} />
      </div>
    </AbsoluteFill>
  );
};

// ───────────── 上次說的話／巷口的坑 8–17s ─────────────
const Promises: React.FC = () => {
  const frame = useCurrentFrame();
  const words = ["我會處理", "一定改善", "馬上去看"];
  return (
    <AbsoluteFill style={{ backgroundColor: "#3f5ad8" }}>
      <Stage>
        <Skyline />
        {words.map((w, i) => {
          const st = i * 12;
          const y = 520 - ip(frame, [st, st + 110], [0, 380]);
          return (
            <g key={w} opacity={ip(frame, [st, st + 8, st + 80, st + 110], [0, 1, 1, 0])} transform={`rotate(${(i - 1) * 6} ${420 + i * 520} ${y})`}>
              <Bubble x={420 + i * 540} y={y} w={340} h={120} k={pop(frame, st, 12)}>
                <SvgText x={0} y={18} size={52}>
                  {w}
                </SvgText>
              </Bubble>
            </g>
          );
        })}
        {/* notebook: has anybody written it down? */}
        <g transform={`translate(1500 830) rotate(-6) scale(${pop(frame, 30, 14)})`}>
          <rect x={-200} y={-150} width={400} height={300} rx={14} fill="#fffdf4" stroke={INK} strokeWidth={6} />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={-170} y1={-90 + i * 60} x2={170} y2={-90 + i * 60} stroke="#b8c4e0" strokeWidth={4} />
          ))}
          <SvgText x={0} y={20} size={110} color="#d9534f">
            ？
          </SvgText>
        </g>
        <Animal x={1180} y={1000} s={1.3} species="bear" shirt="#f59a2f" pants="#f59a2f" hat="goggles" armR={60} armL={30} />
      </Stage>
    </AbsoluteFill>
  );
};

const Pothole: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#3f5ad8" }}>
      <Stage zoom={[1.08, 1.0]} origin="960px 900px">
        <Skyline horizon={560} />
        <ellipse cx={960} cy={880} rx={330} ry={70} fill="#3b3f52" />
        <ellipse cx={960} cy={872} rx={290} ry={52} fill="#1d2032" />
        <g transform="translate(1350 900)">
          <path d="M -60 0 L -18 -200 L 18 -200 L 60 0 Z" fill={C.orange} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <rect x={-40} y={-140} width={80} height={26} fill="#fff" />
          <rect x={-80} y={-6} width={160} height={20} rx={4} fill="#d35f13" stroke={INK} strokeWidth={5} />
          {/* cobweb: it has been here a long time */}
          <path d="M 18 -200 L 70 -250 M 18 -200 L 80 -200 M 18 -200 L 60 -160 M 40 -222 Q 56 -206 50 -182 M 54 -236 Q 76 -204 66 -172" stroke="#fff" strokeWidth={2.5} fill="none" opacity={0.8} />
        </g>
        <Animal x={560} y={960} s={1.5} species="cat" shirt="#6f7d4a" pants="#5b6440" hat="bucket" armR={60} />
        <Animal x={720} y={980} s={1.3} species="penguin" shirt="#d9899a" pants="#353b5c" armR={20} />
        {/* dates flying past the hole */}
        {["2023", "2024", "2025"].map((y, i) => (
          <g key={y} opacity={ip(frame, [10 + i * 24, 18 + i * 24, 40 + i * 24, 50 + i * 24], [0, 1, 1, 0])} transform={`translate(${960 + (i - 1) * 260} ${640 - ip(frame, [10 + i * 24, 50 + i * 24], [0, 80])})`}>
            <rect x={-80} y={-40} width={160} height={80} rx={12} fill="#fff" stroke={INK} strokeWidth={5} />
            <SvgText x={0} y={18} size={48} color={C.blue}>
              {y}
            </SvgText>
          </g>
        ))}
      </Stage>
      <div style={{ position: "absolute", right: 120, top: 110 }}>
        <BigLine text="還在那？" start={s(1)} size={150} />
      </div>
    </AbsoluteFill>
  );
};

export const PotholeScene: React.FC = () => (
  <Shots
    shots={[
      { at: 0, name: "上次說的話", el: <Promises /> },
      { at: 5, name: "巷口的坑", el: <Pothole /> },
    ]}
  />
);

// ───────────── 1999 17–25s ─────────────
export const Hotline: React.FC = () => {
  const frame = useCurrentFrame();
  const bar = 0.3 + 0.62 * Math.min(1, (frame % 90) / 60);
  return (
    <AbsoluteFill style={{ backgroundColor: "#3f5ad8" }}>
      <Stage dur={s(8)}>
        <Skyline />
        <ellipse cx={430} cy={900} rx={190} ry={40} fill="#3b3f52" />
        <ellipse cx={430} cy={894} rx={160} ry={28} fill="#23263a" />
        <g transform="translate(660 910)">
          <path d="M -46 0 L -14 -150 L 14 -150 L 46 0 Z" fill={C.orange} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          <rect x={-30} y={-104} width={60} height={20} fill="#fff" />
          <rect x={-62} y={-4} width={124} height={16} rx={4} fill="#d35f13" stroke={INK} strokeWidth={4} />
        </g>
        <g transform={`translate(1450 330) rotate(${-4 + Math.sin(frame * 0.3) * 1.5}) scale(${pop(frame, 4, 14)})`}>
          <rect x={-250} y={-230} width={500} height={400} rx={36} fill="#fff" stroke={INK} strokeWidth={8} />
          <text x={0} y={-100} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={900} fontSize={120} fill={C.blue}>
            1999
          </text>
          <text x={0} y={0} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={700} fontSize={56} fill={INK}>
            處理中…
          </text>
          <rect x={-190} y={40} width={380} height={40} rx={20} fill="#e3e6ec" />
          <rect x={-190} y={40} width={380 * bar} height={40} rx={20} fill={C.orange} />
          <text x={0} y={136} textAnchor="middle" fontFamily={FONT_BOLD} fontSize={40} fill="#8a8f98">
            第 {12 + Math.floor(frame / 12)} 通
          </text>
        </g>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${1260 + i * 150} ${700 - i * 26}) rotate(${-10 + i * 9}) scale(${pop(frame, s(3.2 + i * 1.4), 12)})`}>
            <rect x={-60} y={-70} width={120} height={140} rx={10} fill="#fff" stroke={INK} strokeWidth={5} />
            <rect x={-60} y={-70} width={120} height={34} rx={10} fill="#e45b4f" />
            <circle cx={0} cy={18} r={28} fill="#ffc94a" />
            <text x={0} y={-44} textAnchor="middle" fontSize={22} fontFamily={FONT_BOLD} fontWeight={900} fill="#fff">
              夏
            </text>
          </g>
        ))}
        <Animal x={960} y={960} s={1.45} species="beaver" shirt="#9b4a3c" pants="#5b3a30" armR={158} prop="phone" bob={Math.abs(Math.sin(frame * 0.1)) * 3} />
        <Animal x={1740} y={980} s={1.2} species="turtle" shirt="#e9a23b" pants="#6b6f45" armR={40} />
      </Stage>
      <div style={{ position: "absolute", left: 110, top: 120 }}>
        <BigLine text="處理中…" start={s(3)} size={170} />
      </div>
    </AbsoluteFill>
  );
};

// ───────────── 陳情紀錄／議會追問／十二個區 25–37s ─────────────
const PetitionFolder: React.FC = () => {
  const frame = useCurrentFrame();
  const open = ip(frame, [10, 28], [0, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: C.blue }}>
      <Stage>
        <Burst x={1100} y={500} opacity={0.12} />
        <g transform="translate(1100 560)">
          <rect x={-330} y={-230} width={660} height={460} rx={20} fill="#f2c14e" stroke={INK} strokeWidth={7} />
          <rect x={-300} y={-200} width={600} height={400} rx={12} fill="#fffdf4" stroke={INK} strokeWidth={5} />
          <g style={{ scale: `1 ${1 - open}`, transformOrigin: "0px -230px" }}>
            <rect x={-330} y={-230} width={660} height={460} rx={20} fill="#f6d06a" stroke={INK} strokeWidth={7} />
            <SvgText x={0} y={20} size={90}>
              陳情紀錄
            </SvgText>
          </g>
          {new Array(5).fill(0).map((_, i) => (
            <g key={i} opacity={open}>
              <line x1={-250} y1={-140 + i * 70} x2={250 - (i % 2) * 90} y2={-140 + i * 70} stroke="#9aa6c4" strokeWidth={10} strokeLinecap="round" />
            </g>
          ))}
        </g>
        {new Array(8).fill(0).map((_, i) => {
          const st = 30 + i * 5;
          const p = ip(frame, [st, st + 40], [0, 1]);
          const a = rand(`pa${i}`) * Math.PI - Math.PI;
          return (
            <g key={i} opacity={p > 0 ? 1 - p * 0.6 : 0} transform={`translate(${1100 + Math.cos(a) * p * 700} ${480 + Math.sin(a) * p * 420}) rotate(${p * 200 * (i % 2 ? 1 : -1)})`}>
              <rect x={-40} y={-50} width={80} height={100} rx={6} fill="#fff" stroke={INK} strokeWidth={4} />
              <line x1={-24} y1={-20} x2={24} y2={-20} stroke="#9aa6c4" strokeWidth={5} />
              <line x1={-24} y1={0} x2={24} y2={0} stroke="#9aa6c4" strokeWidth={5} />
            </g>
          );
        })}
        <Mayor x={380} y={1080} s={1.9} armR={70} armL={50} micHand="none" />
      </Stage>
    </AbsoluteFill>
  );
};

const Council: React.FC = () => {
  const frame = useCurrentFrame();
  const items = ["人行道", "公車班距", "社宅進度", "路口安全"];
  return (
    <AbsoluteFill style={{ backgroundColor: "#243a78" }}>
      <Stage>
        {/* chamber: tiered desks */}
        {[0, 1, 2].map((r) => (
          <path key={r} d={`M ${-100 + r * 60} ${760 + r * 110} Q 960 ${600 + r * 110} ${2020 - r * 60} ${760 + r * 110} L ${2020 - r * 60} ${820 + r * 110} Q 960 ${660 + r * 110} ${-100 + r * 60} ${820 + r * 110} Z`} fill="#6b4a33" stroke={INK} strokeWidth={5} />
        ))}
        <rect x={660} y={120} width={600} height={90} rx={16} fill="#fff" stroke={INK} strokeWidth={6} />
        <SvgText x={960} y={185} size={60} color={C.blue}>
          議會質詢
        </SvgText>
        {items.map((t, i) => {
          const st = 8 + i * 18;
          return (
            <g key={t} transform={`translate(${960} ${300 + i * 95}) scale(${pop(frame, st, 12)})`}>
              <rect x={-300} y={-38} width={600} height={76} rx={14} fill="#fff" stroke={INK} strokeWidth={5} />
              <SvgText x={-40} y={18} size={46}>
                {t}
              </SvgText>
              <circle cx={220} cy={0} r={26} fill={ip(frame, [st + 10, st + 14], [0, 1]) > 0.5 ? "#4caf50" : "#e3e6ec"} stroke={INK} strokeWidth={4} />
              <path d="M 208 0 L 218 10 L 234 -10" stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" opacity={ip(frame, [st + 10, st + 14], [0, 1])} />
            </g>
          );
        })}
        <Mayor x={1560} y={1060} s={1.6} armR={40} armL={70} mouthOpen={Math.floor(frame / 6) % 2 === 0} />
      </Stage>
    </AbsoluteFill>
  );
};

const DISTRICTS = ["北投", "士林", "內湖", "松山", "中山", "大同", "萬華", "中正", "大安", "信義", "南港", "文山"];

const TwelveDistricts: React.FC = () => {
  const frame = useCurrentFrame();
  const walkX = ip(frame, [0, s(3.5)], [-100, 2000], (t) => t);
  return (
    <AbsoluteFill style={{ backgroundColor: "#3f5ad8" }}>
      <Stage zoom={[1, 1]}>
        <Skyline tags={false} />
        {DISTRICTS.map((d, i) => {
          const x = 110 + i * 155;
          const st = i * 7;
          return (
            <g key={d} transform={`translate(${x} ${330 + (i % 2) * 70}) scale(${pop(frame, st, 12)})`}>
              <rect x={-26} y={-8} width={52} height={130} fill="#f6c83b" stroke={INK} strokeWidth={4} />
              {[...d, "區"].map((ch, j) => (
                <text key={j} x={0} y={30 + j * 40} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={900} fontSize={34} fill={INK}>
                  {ch}
                </text>
              ))}
            </g>
          );
        })}
        <Citizens y={790} s={0.72} from={60} to={1860} raise={0.3} />
        <Mayor x={walkX} y={1060} s={1.3} armR={20} armL={20} micHand="R" bob={Math.abs(Math.sin(frame * 0.35)) * 6} />
      </Stage>
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, display: "flex", justifyContent: "center" }}>
        <BigLine text="十二個區" start={4} size={130} />
      </div>
    </AbsoluteFill>
  );
};

export const RecordsScene: React.FC = () => (
  <Shots
    shots={[
      { at: 0, name: "陳情紀錄", el: <PetitionFolder /> },
      { at: 5, name: "議會追問", el: <Council /> },
      { at: 9, name: "十二個區", el: <TwelveDistricts /> },
    ]}
  />
);

// ───────────── 功課／不用怕冷場／認真回答 37–50s ─────────────
const Homework: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = ["交通", "住宅", "托育", "治安"];
  return (
    <AbsoluteFill style={{ backgroundColor: "#f3efe4" }}>
      <Stage>
        <rect x={0} y={0} width={1920} height={1080} fill="#f3efe4" />
        {new Array(20).fill(0).map((_, i) => (
          <line key={i} x1={0} y1={60 + i * 54} x2={1920} y2={60 + i * 54} stroke="#c9d6ee" strokeWidth={3} />
        ))}
        <line x1={200} y1={0} x2={200} y2={1080} stroke="#f2a0a0" strokeWidth={4} />
        <g transform="translate(760 500) rotate(-3)">
          <rect x={-380} y={-300} width={760} height={600} rx={20} fill="#fff" stroke={INK} strokeWidth={7} />
          <SvgText x={0} y={-200} size={80} color={C.blue}>
            市政功課表
          </SvgText>
          {rows.map((r, i) => (
            <g key={r} transform={`translate(0 ${-90 + i * 100})`}>
              <SvgText x={-200} y={20} size={56} anchor="start">
                {r}
              </SvgText>
              <rect x={120} y={-34} width={200} height={68} rx={10} fill="#f3efe4" stroke={INK} strokeWidth={4} />
              <SvgText x={220} y={22} size={56} color="#d9534f">
                {frame > 20 + i * 14 ? "？" : ""}
              </SvgText>
            </g>
          ))}
        </g>
        <Animal x={1480} y={980} s={1.8} species="deer" shirt="#f4f4f4" pants="#b8bcc6" hat="cap" armR={150} prop="mic" />
      </Stage>
      <div style={{ position: "absolute", right: 90, top: 90 }}>
        <BigLine text="換您來問" start={s(1.2)} size={120} />
      </div>
    </AbsoluteFill>
  );
};

const NoAwkward: React.FC = () => {
  const frame = useCurrentFrame();
  const cheer = frame > s(2);
  return (
    <AbsoluteFill style={{ backgroundColor: "#3f5ad8" }}>
      <Stage>
        <Skyline />
        {/* tumbleweed of silence rolls away */}
        <g transform={`translate(${ip(frame, [0, s(2.2)], [300, 2200], (t) => t)} 860) rotate(${frame * 8})`} opacity={ip(frame, [0, 6], [0, 1])}>
          <circle r={50} fill="none" stroke="#b58b52" strokeWidth={6} />
          <path d="M -40 -20 Q 0 40 40 -20 M -30 30 Q 0 -40 34 26" stroke="#b58b52" strokeWidth={5} fill="none" />
        </g>
        <Citizens y={820} s={0.8} from={80} to={1840} skip={[5]} cheer={cheer} />
        <Animal x={960} y={1060} s={1.8} species="penguin" shirt="#d9899a" pants="#353b5c" armR={120} prop="mic" bob={cheer ? Math.abs(Math.sin(frame * 0.3)) * 5 : 0} />
        {!cheer && <path d="M 1040 740 Q 1052 764 1040 776 Q 1028 764 1040 740 Z" fill="#8fd3ff" stroke={INK} strokeWidth={3} />}
      </Stage>
      <div style={{ position: "absolute", left: 110, top: 110 }}>
        <BigLine text="不用怕冷場" start={4} size={130} />
      </div>
    </AbsoluteFill>
  );
};

const Serious: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.blue }}>
      <Stage zoom={[1, 1.08]} origin="760px 500px">
        <Burst x={760} y={480} opacity={0.12} />
        <Mayor x={760} y={1180} s={2.8} armR={70} armL={60} micHand="none" />
        {/* glasses glint */}
        <path d="M 700 360 L 720 340 M 800 360 L 820 340" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={Math.abs(Math.sin(frame * 0.15))} />
        <g transform={`translate(1420 540) rotate(4) scale(${pop(frame, 6, 12)})`}>
          <rect x={-240} y={-300} width={480} height={600} rx={16} fill="#fffdf4" stroke={INK} strokeWidth={7} />
          <rect x={-240} y={-300} width={480} height={70} rx={16} fill={C.orange} />
          <SvgText x={0} y={-250} size={40} color="#fff">
            市民提問
          </SvgText>
          {new Array(5).fill(0).map((_, i) => (
            <g key={i} opacity={ip(frame, [14 + i * 10, 20 + i * 10], [0, 1])}>
              <circle cx={-190} cy={-150 + i * 90} r={14} fill={C.blue} />
              <line x1={-160} y1={-150 + i * 90} x2={-160 + ip(frame, [14 + i * 10, 26 + i * 10], [0, 360 - (i % 2) * 90])} y2={-150 + i * 90} stroke="#6a748f" strokeWidth={10} strokeLinecap="round" />
            </g>
          ))}
        </g>
      </Stage>
      <div style={{ position: "absolute", left: 90, top: 90 }}>
        <BigLine text="認真回答" start={4} size={130} />
      </div>
    </AbsoluteFill>
  );
};

export const HomeworkScene: React.FC = () => (
  <Shots
    shots={[
      { at: 0, name: "功課做得夠不夠", el: <Homework /> },
      { at: 6, name: "不用怕冷場", el: <NoAwkward /> },
      { at: 10, name: "認真回答", el: <Serious /> },
    ]}
  />
);
