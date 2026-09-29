import "./index.css";
import { Composition, Folder } from "remotion";
import { MicMV } from "./MicMV";
import { HomeworkScene, Hotline, Opening, PotholeScene, RecordsScene } from "./scenes/Verse1";
import { Chorus } from "./scenes/Chorus";
import { PledgeScene, VoicesScene } from "./scenes/Verse2";
import { AlleyScene, DateScene, VoteScene } from "./scenes/Bridge";
import { Ending, OutroScene } from "./scenes/Outro";
import { CastSheet } from "./scenes/CastSheet";
import { GalleryAnimal, GalleryEffects, GalleryKit, GalleryMayor, GallerySkyline } from "./gallery/Gallery";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="MicMV" component={MicMV} width={1920} height={1080} fps={30} durationInFrames={6750} />
      <Folder name="MicMV-Scenes">
        <Composition id="Opening" component={Opening} width={1920} height={1080} fps={30} durationInFrames={255} />
        <Composition id="Pothole" component={PotholeScene} width={1920} height={1080} fps={30} durationInFrames={285} />
        <Composition id="Hotline" component={Hotline} width={1920} height={1080} fps={30} durationInFrames={255} />
        <Composition id="Records" component={RecordsScene} width={1920} height={1080} fps={30} durationInFrames={375} />
        <Composition id="Homework" component={HomeworkScene} width={1920} height={1080} fps={30} durationInFrames={405} />
        <Composition
          id="Chorus"
          component={Chorus}
          width={1920}
          height={1080}
          fps={30}
          durationInFrames={705}
          defaultProps={{ beats: [1, 4, 6, 8, 11, 12, 15, 18], hero: "elephant" as const }}
        />
        <Composition id="Voices" component={VoicesScene} width={1920} height={1080} fps={30} durationInFrames={795} />
        <Composition id="Pledge" component={PledgeScene} width={1920} height={1080} fps={30} durationInFrames={525} />
        <Composition id="Alley" component={AlleyScene} width={1920} height={1080} fps={30} durationInFrames={555} />
        <Composition id="Vote" component={VoteScene} width={1920} height={1080} fps={30} durationInFrames={435} />
        <Composition id="DateCard" component={DateScene} width={1920} height={1080} fps={30} durationInFrames={195} />
        <Composition id="Outro" component={OutroScene} width={1920} height={1080} fps={30} durationInFrames={525} />
        <Composition id="Ending" component={Ending} width={1920} height={1080} fps={30} durationInFrames={360} />
      </Folder>
      <Folder name="Components">
        <Composition id="CastSheet" component={CastSheet} width={1920} height={1080} fps={30} durationInFrames={60} />
        <Composition id="Gallery-Animal" component={GalleryAnimal} width={1920} height={1080} fps={30} durationInFrames={150} />
        <Composition id="Gallery-Mayor" component={GalleryMayor} width={1920} height={1080} fps={30} durationInFrames={150} />
        <Composition id="Gallery-Skyline" component={GallerySkyline} width={1920} height={1080} fps={30} durationInFrames={150} />
        <Composition id="Gallery-Kit" component={GalleryKit} width={1920} height={1080} fps={30} durationInFrames={150} />
        <Composition id="Gallery-Effects" component={GalleryEffects} width={1920} height={1080} fps={30} durationInFrames={150} />
      </Folder>
    </>
  );
};
