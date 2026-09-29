import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Subtitles } from "./components/Stage";
import { HomeworkScene, Hotline, Opening, PotholeScene, RecordsScene } from "./scenes/Verse1";
import { Chorus } from "./scenes/Chorus";
import { PledgeScene, VoicesScene } from "./scenes/Verse2";
import { AlleyScene, DateScene, VoteScene } from "./scenes/Bridge";
import { Ending, OutroScene } from "./scenes/Outro";

// Scenes overlap by a 15-frame fade, so each scene starts at the song time noted
// in its name (seconds): 0, 8, 17, 25, 37, 50, 73, 99, 116, 137, 155, 169, 175, 196, 213.
export const MicMV: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="開場 0s" durationInFrames={255}>
          <Opening />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="上次說的話・巷口的坑 8s" durationInFrames={285}>
          <PotholeScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="1999 17s" durationInFrames={255}>
          <Hotline />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="陳情・議會・十二區 25s" durationInFrames={375}>
          <RecordsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="功課・冷場・認真回答 37s" durationInFrames={405}>
          <HomeworkScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="副歌 1 50s" durationInFrames={705}>
          <Chorus beats={[1, 4, 6, 8, 11, 12, 15, 18]} hero="elephant" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="市民的聲音 73s" durationInFrames={795}>
          <VoicesScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="選前選後・一票 99s" durationInFrames={525}>
          <PledgeScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="副歌 2 116s" durationInFrames={645}>
          <Chorus beats={[0, 2, 4, 6, 8, 10, 13, 17]} hero="kangaroo" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="小巷 137s" durationInFrames={555}>
          <AlleyScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="開口・投票 155s" durationInFrames={435}>
          <VoteScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="11.28 169s" durationInFrames={195}>
          <DateScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="副歌 3 175s" durationInFrames={645}>
          <Chorus beats={[0, 3, 5, 7, 9, 11, 14, 17]} hero="penguin" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="樹蔭・路燈・做出來 196s" durationInFrames={525}>
          <OutroScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
        <TransitionSeries.Sequence name="結尾 213s" durationInFrames={360}>
          <Ending />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <Sequence name="Subtitles" layout="absolute-fill">
        <Subtitles />
      </Sequence>
      <Audio name="Song" src={staticFile("music.m4a")} />
    </AbsoluteFill>
  );
};
