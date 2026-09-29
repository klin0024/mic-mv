import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT_BOLD } from "./Kit";

// Channel watermark, bottom-right corner (clear of top headlines and the centred subtitles)
export const Watermark: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div
      style={{
        position: "absolute",
        right: 28,
        bottom: 26,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "10px 18px 10px 14px",
        borderRadius: 16,
        background: "rgba(15, 20, 45, 0.55)",
        opacity: 0.9,
      }}
    >
      {/* YouTube-style play badge */}
      <svg width={46} height={32} viewBox="0 0 46 32">
        <rect width={46} height={32} rx={9} fill="#ff0033" />
        <path d="M 18 9 L 31 16 L 18 23 Z" fill="#fff" />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
        <span style={{ fontFamily: FONT_BOLD, fontWeight: 900, fontSize: 24, color: "#fff", letterSpacing: 2 }}>龍神太子的頻道</span>
        <span style={{ fontFamily: "Consolas, 'Segoe UI', sans-serif", fontSize: 18, color: "#ffd54f" }}>https://www.youtube.com/@matt039017</span>
      </div>
    </div>
  </AbsoluteFill>
);
