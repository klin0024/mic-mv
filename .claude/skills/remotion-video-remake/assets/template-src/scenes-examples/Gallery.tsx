import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Animal, CAST, Prop, Species } from "../components/Animal";
import { Mayor } from "../components/Mayor";
import { Skyline } from "../components/Skyline";
import { BigLine, Burst, C, FONT_BOLD, Mic, Waves } from "../components/Kit";
import { heartPath, Motes, Petals, SunRays, Vignette } from "../components/Effects";
import { Figure } from "../components/Figure";

// Component galleries — one composition per file in src/components

const Page: React.FC<{ title: string; file: string; bg?: string; children: React.ReactNode }> = ({ title, file, bg = "#f4f1ea", children }) => (
  <AbsoluteFill style={{ backgroundColor: bg }}>
    <svg viewBox="0 0 1920 1080" width="100%" height="100%">
      {children}
    </svg>
    <div style={{ position: "absolute", left: 50, top: 30, fontFamily: FONT_BOLD, color: bg === "#f4f1ea" ? "#2a2330" : "#ffffff" }}>
      <div style={{ fontSize: 52, fontWeight: 900 }}>{title}</div>
      <div style={{ fontSize: 26, opacity: 0.6, fontFamily: "Consolas, monospace" }}>{file}</div>
    </div>
  </AbsoluteFill>
);

const Label: React.FC<{ x: number; y: number; t: string; size?: number; color?: string }> = ({ x, y, t, size = 24, color = "#2a2330" }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT_BOLD} fontWeight={700} fontSize={size} fill={color}>
    {t}
  </text>
);

const SPECIES_ZH: Record<Species, string> = {
  cat: "石虎 cat",
  bear: "熊 bear",
  elephant: "大象 elephant",
  beaver: "河狸 beaver",
  kangaroo: "袋鼠 kangaroo",
  penguin: "企鵝 penguin",
  tiger: "老虎 tiger",
  turtle: "烏龜 turtle",
  deer: "鹿 deer",
  squirrel: "松鼠 squirrel",
  giraffe: "長頸鹿 giraffe",
};

export const GalleryAnimal: React.FC = () => {
  const frame = useCurrentFrame();
  const props: Prop[] = ["none", "phone", "mic", "tea", "plant"];
  return (
    <Page title="Animal — 動物市民（CAST 陣容）" file="src/components/Animal.tsx">
      {CAST.map((c, i) => {
        const x = 110 + i * 170;
        return (
          <g key={i}>
            <Animal x={x} y={560} s={0.95} {...c} armR={i % 2 ? 150 + Math.sin(frame * 0.2 + i) * 12 : 12} />
            <Label x={x} y={610} t={SPECIES_ZH[c.species]} size={20} />
          </g>
        );
      })}
      <line x1={60} y1={660} x2={1860} y2={660} stroke="#2a2330" strokeOpacity={0.15} strokeWidth={3} />
      <Label x={330} y={710} t="手臂角度 armR：0 / 90 / 170" />
      {[0, 90, 170].map((a, i) => (
        <Animal key={a} x={170 + i * 160} y={1010} s={0.9} species="bear" shirt="#f59a2f" pants="#f59a2f" armR={a} armL={a} />
      ))}
      <Label x={1270} y={710} t="配件 prop：none / phone / mic / tea / plant" />
      {props.map((p, i) => (
        <g key={p}>
          <Animal x={870 + i * 190} y={1010} s={0.9} species="tiger" shirt="#f3e07a" pants="#8a6a4a" armR={p === "none" ? 12 : 150} prop={p} />
          <Label x={870 + i * 190} y={1050} t={p} size={22} />
        </g>
      ))}
    </Page>
  );
};

export const GalleryMayor: React.FC = () => {
  const frame = useCurrentFrame();
  const talk = Math.floor(frame / 6) % 2 === 0;
  const poses = [
    { t: "預設", p: {} },
    { t: "遞麥克風 armR=78", p: { armR: 78 } },
    { t: "說話 mouthOpen", p: { armR: 40, mouthOpen: talk } },
    { t: "左手拿 micHand=L", p: { micHand: "L" as const, armL: 40, armR: 12 } },
    { t: "空手 micHand=none", p: { micHand: "none" as const, armR: 100 } },
  ];
  return (
    <Page title="Mayor — 市長（捲髮）" file="src/components/Mayor.tsx">
      {poses.map((q, i) => (
        <g key={i}>
          <Mayor x={220 + i * 370} y={880} s={1.5} {...q.p} />
          <Label x={220 + i * 370} y={950} t={q.t} />
        </g>
      ))}
    </Page>
  );
};

export const GallerySkyline: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#1b1b24" }}>
    <svg viewBox="0 0 1920 1080" width="100%" height="100%">
      {[
        { sky: "#3f5ad8", t: "預設 sky=#3f5ad8" },
        { sky: "#34419e", t: "黃昏 sky=#34419e" },
        { sky: "#6fb6ec", t: "晴天 sky=#6fb6ec" },
      ].map((v, i) => (
        <g key={i} transform={`translate(${i === 2 ? 480 : i * 960} ${i === 2 ? 540 : 0}) scale(0.5)`}>
          <Skyline sky={v.sky} />
          <text x={60} y={1030} fontFamily={FONT_BOLD} fontWeight={900} fontSize={56} fill="#fff">
            {v.t}
          </text>
        </g>
      ))}
    </svg>
    <div style={{ position: "absolute", left: 40, top: 560, color: "#fff", fontFamily: FONT_BOLD }}>
      <div style={{ fontSize: 44, fontWeight: 900 }}>Skyline — 台北天際線</div>
      <div style={{ fontSize: 24, opacity: 0.7, fontFamily: "Consolas, monospace" }}>src/components/Skyline.tsx</div>
    </div>
  </AbsoluteFill>
);

export const GalleryKit: React.FC = () => (
  <Page title="Kit — 動態字、麥克風、聲波、放射線、色票" file="src/components/Kit.tsx" bg="#26306b">
    <Burst x={1500} y={640} color="#fff" opacity={0.12} />
    <Waves x={1500} y={600} />
    <Mic x={1500} y={600} s={1} rot={-15} />
    <Label x={1500} y={1000} t="Mic + Waves + Burst" color="#fff" />
    {Object.entries(C).map(([k, v], i) => (
      <g key={k}>
        <rect x={80 + i * 140} y={900} width={110} height={70} rx={12} fill={v} stroke="#fff" strokeWidth={3} />
        <Label x={135 + i * 140} y={1010} t={k} color="#fff" size={22} />
      </g>
    ))}
    <foreignObject x={70} y={200} width={1100} height={640}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <BigLine text="BigLine 逐字彈出" start={0} size={110} />
        <BigLine text="橘底白框版本" start={16} size={110} color={C.orange} stroke="#fff" />
        <BigLine text="深色描邊" start={30} size={110} stroke="#2a2330" strokeW={14} rotate={-3} />
      </div>
    </foreignObject>
  </Page>
);

export const GalleryEffects: React.FC = () => (
  <Page title="Effects — 光芒、微光粒子、花瓣、愛心、暗角" file="src/components/Effects.tsx" bg="#2d2a3e">
    <g>
      <rect x={60} y={170} width={580} height={420} rx={20} fill="#f6d98a" />
      <SunRays cx={350} cy={380} length={400} opacity={0.6} />
      <Label x={350} y={630} t="SunRays" color="#fff" />
    </g>
    <g>
      <rect x={670} y={170} width={580} height={420} rx={20} fill="#1f2446" />
      <Motes n={50} seed="g" area={[680, 180, 560, 400]} rise={0.6} size={4} />
      <Label x={960} y={630} t="Motes" color="#fff" />
    </g>
    <g>
      <rect x={1280} y={170} width={580} height={420} rx={20} fill="#fbe3e8" />
      <svg x={1280} y={170} width={580} height={420} viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        <Petals n={40} seed="gp" />
      </svg>
      <Label x={1570} y={630} t="Petals" color="#fff" />
    </g>
    <g>
      <path d={heartPath(70)} transform="translate(350 820)" fill="#f2718d" stroke="#fff" strokeWidth={5} />
      <Label x={350} y={960} t="heartPath()" color="#fff" />
    </g>
    <g>
      <Figure x={900} y={960} s={2} color="#f3a9bd" dress hair="bun" glasses armR={150} />
      <Figure x={1040} y={960} s={2} kid color="#f6c945" hair="pony" armR={60} />
      <Label x={970} y={1000} t="Figure（教師節版小人，保留備用）" color="#fff" size={22} />
    </g>
    <foreignObject x={1330} y={700} width={480} height={280}>
      <div style={{ position: "relative", width: 480, height: 280, background: "#f4f1ea", borderRadius: 20, overflow: "hidden" }}>
        <Vignette strength={0.7} />
      </div>
    </foreignObject>
    <Label x={1570} y={1010} t="Vignette" color="#fff" />
  </Page>
);
