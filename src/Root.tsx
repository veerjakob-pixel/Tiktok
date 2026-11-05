import { Composition, Still } from "remotion";
import { AppleADay, AppleADayProps, calculateMetadata } from "./AppleADay";
import { BASE_SECONDS, FPS } from "./script";
import { Folge2Fruehstueck } from "./Folge2Fruehstueck";
import { Folge2Story } from "./folge2/StoryImage";
import { TOTAL_FRAMES } from "./folge2/timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AppleADay"
        component={AppleADay}
        durationInFrames={BASE_SECONDS * FPS}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={
          {
            voiceoverSeconds: null,
            hasVoiceover: false,
            hasMusic: false,
          } satisfies AppleADayProps
        }
        calculateMetadata={calculateMetadata}
      />
      <Composition
        id="Folge2Fruehstueck"
        component={Folge2Fruehstueck}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Still
        id="Folge2Story"
        component={Folge2Story}
        width={1080}
        height={1920}
      />
    </>
  );
};
