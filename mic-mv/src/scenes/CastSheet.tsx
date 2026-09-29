import React from "react";
import { AbsoluteFill } from "remotion";
import { Animal, CAST } from "../components/Animal";
import { Mayor } from "../components/Mayor";
import { Skyline } from "../components/Skyline";

// Character line-up on the Taipei skyline — reference sheet for the cast
export const CastSheet: React.FC = () => (
  <AbsoluteFill>
    <svg viewBox="0 0 1920 1080" width="100%" height="100%">
      <Skyline />
      {CAST.map((c, i) => (
        <Animal key={i} x={90 + i * 150 + (i > 5 ? 180 : 0)} y={800} s={0.95} armR={i % 3 === 0 ? 150 : 10} {...c} />
      ))}
      <Mayor x={1005} y={806} s={0.95} armR={70} armL={20} />
    </svg>
  </AbsoluteFill>
);
