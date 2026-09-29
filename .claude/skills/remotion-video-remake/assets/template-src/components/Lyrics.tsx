import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_UI } from "../lib/anim";
import { LYRICS } from "../lyrics";

const KaraokeLine: React.FC<{ text: string; progress: number }> = ({ text, progress }) => {
  const shadow = "0 0 8px rgba(40,20,0,0.85), 0 2px 3px rgba(0,0,0,0.9)";
  return (
    <div style={{ position: "relative", whiteSpace: "nowrap", lineHeight: 1.25 }}>
      <span style={{ color: "#fffaf0", textShadow: shadow }}>{text}</span>
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          color: "#ffd257",
          textShadow: shadow,
          clipPath: `inset(-20% ${100 - progress * 100}% -20% -2%)`,
        }}
      >
        {text}
      </span>
    </div>
  );
};

// Karaoke-style lyrics: white text that fills gold as the line is sung
export const Lyrics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const line = LYRICS.find((l) => t >= l.start && t < l.end);
  if (!line) return null;

  const fadeIn = interpolate(t, [line.start, line.start + 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(t, [line.end - 0.25, line.end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sungEnd = line.start + (line.end - line.start) * 0.85;
  const p = interpolate(t, [line.start + 0.1, sungEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lines = line.text.split("/");
  const total = lines.reduce((a, l) => a + l.length, 0);

  let acc = 0;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 54, pointerEvents: "none" }}>
      <div
        style={{
          fontFamily: FONT_UI,
          fontWeight: 700,
          fontSize: 44,
          letterSpacing: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: fadeIn * fadeOut,
          translate: `0px ${(1 - fadeIn) * 10}px`,
        }}
      >
        {lines.map((l, i) => {
          const a = acc / total;
          acc += l.length;
          const b = acc / total;
          const lp = interpolate(p, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <KaraokeLine key={i} text={l} progress={lp} />;
        })}
      </div>
    </AbsoluteFill>
  );
};
